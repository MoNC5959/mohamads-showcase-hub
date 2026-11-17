import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/*
 * The pizza paragraph, acted out: a $10M building is cut into slices,
 * the slices separate, and a ledger records which wallet holds which.
 * Plays once when it scrolls into view; reduced motion and ?static show
 * the finished state.
 */

const GX = 4; // blocks across
const GY = 3; // blocks deep
const GZ = 7; // floors
const A = 14; // iso half-width per unit
const B = 8; // iso half-height per unit
const HZ = 16; // height per floor
const GAP = 0.32; // explode distance, in block units

const TOTAL_SLICES = 10_000;
const PRICE = 1_000;
const CUBES = GX * GY * GZ; // 84
const PER_CUBE = Math.floor(TOTAL_SLICES / CUBES); // 119

const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

type Pt = [number, number];
const P = (x: number, y: number, z: number): Pt => [(x - y) * A, (x + y) * B - z * HZ];
const poly = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

interface Cube {
  key: string;
  index: number;
  x: number; y: number; z: number;
  top: string; right: string; left: string;
  dx: number; dy: number;
  cutDelay: number;
  splitDelay: number;
}

// Cubes the ledger rows point at: all on faces the reader can see.
const LEDGER_PICKS: [number, number, number][] = [
  [3, 2, 6],
  [1, 2, 5],
  [3, 0, 4],
  [3, 1, 2],
  [0, 2, 1],
];
const WALLETS = ['Wallet A', 'Wallet B', 'Wallet C', 'Wallet D', 'Wallet E'];

function useCubes() {
  return useMemo(() => {
    const cubes: Cube[] = [];
    let index = 0;
    for (let z = 0; z < GZ; z++) {
      for (let y = 0; y < GY; y++) {
        for (let x = 0; x < GX; x++) {
          const ox = (x - (GX - 1) / 2) * GAP;
          const oy = (y - (GY - 1) / 2) * GAP;
          const oz = (z - (GZ - 1) / 2) * GAP;
          cubes.push({
            key: `${x}-${y}-${z}`,
            index: index++,
            x, y, z,
            top: poly([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)]),
            right: poly([P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z), P(x + 1, y, z)]),
            left: poly([P(x, y + 1, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y + 1, z), P(x, y + 1, z)]),
            dx: (ox - oy) * A,
            dy: (ox + oy) * B - oz * HZ,
            // the blade sweeps from the roof down
            cutDelay: (GZ - 1 - z) * 70 + (x + y) * 12,
            splitDelay: Math.min(260, (x + y + (GZ - 1 - z)) * 18),
          });
        }
      }
    }
    // painter's order: far and low first
    cubes.sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z) || a.z - b.z);

    // viewBox from the exploded extents
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const c of cubes) {
      for (const [px, py] of [P(c.x, c.y, c.z), P(c.x + 1, c.y + 1, c.z + 1), P(c.x + 1, c.y, c.z), P(c.x, c.y + 1, c.z), P(c.x, c.y, c.z + 1)]) {
        minX = Math.min(minX, px + c.dx); maxX = Math.max(maxX, px + c.dx);
        minY = Math.min(minY, py + c.dy); maxY = Math.max(maxY, py + c.dy);
      }
    }
    const pad = 10;
    const viewBox = `${(minX - pad).toFixed(1)} ${(minY - pad).toFixed(1)} ${(maxX - minX + pad * 2).toFixed(1)} ${(maxY - minY + pad * 2).toFixed(1)}`;

    const rows = LEDGER_PICKS.map(([x, y, z]) => {
      const cube = cubes.find(c => c.x === x && c.y === y && c.z === z)!;
      // slice ranges follow build order: floor by floor, front to back
      const order = z * GX * GY + y * GX + x;
      const from = order * PER_CUBE + 1;
      const to = order === CUBES - 1 ? TOTAL_SLICES : from + PER_CUBE - 1;
      return { cubeKey: cube.key, from, to, value: (to - from + 1) * PRICE };
    })
      .sort((a, b) => a.from - b.from)
      .map((row, i) => ({ ...row, wallet: WALLETS[i] }));

    return { cubes, viewBox, rows };
  }, []);
}

const fmt = (n: number) => n.toLocaleString('en-US');
const pad4 = (n: number) => String(n).padStart(5, '0');

function prefersStill() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || new URLSearchParams(window.location.search).has('static');
}

type Stage = 'whole' | 'cut' | 'split';

export function MintingSequence() {
  const { cubes, viewBox, rows } = useCubes();
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);
  const raf = useRef<number | null>(null);

  const [stage, setStage] = useState<Stage>('split');
  const [shownRows, setShownRows] = useState(rows.length);
  const [still, setStill] = useState(true); // SSR and no-JS show the finished state
  const [hover, setHover] = useState<number | null>(null);
  const [played, setPlayed] = useState(false);

  const clear = () => {
    timers.current.forEach(t => window.clearTimeout(t));
    timers.current = [];
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
  };

  const setCount = (n: number) => {
    if (counterRef.current) counterRef.current.textContent = fmt(n);
  };

  const play = useCallback(() => {
    clear();
    setStill(false);
    setStage('whole');
    setShownRows(0);
    setCount(0);
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

    at(250, () => setStage('cut'));
    at(1050, () => {
      setStage('split');
      const start = performance.now();
      const dur = 1500;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        setCount(Math.round(TOTAL_SLICES * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    });
    rows.forEach((_, i) => at(1500 + i * 230, () => setShownRows(i + 1)));
    at(1500 + rows.length * 230 + 200, () => setPlayed(true));
  }, [rows]);

  // Hold the finished state until the piece is in view, then play once.
  useEffect(() => {
    if (prefersStill()) { setPlayed(true); return; }
    const el = rootRef.current;
    if (!el) return;
    // prime: assembled building, empty ledger, but only if it is still offscreen
    const r = el.getBoundingClientRect();
    if (r.top > window.innerHeight * 0.85 || r.bottom < 0) {
      setStill(false);
      setStage('whole');
      setShownRows(0);
      setCount(0);
    }
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { io.disconnect(); play(); }
    }, { threshold: 0.45 });
    io.observe(el);
    return () => { io.disconnect(); clear(); };
  }, [play]);

  const activeKey = hover !== null ? rows[hover]?.cubeKey
    : shownRows > 0 && !played ? rows[shownRows - 1]?.cubeKey ?? null : null;
  const litKeys = new Set(rows.slice(0, shownRows).map(r => r.cubeKey));

  const cut = stage !== 'whole';
  const split = stage === 'split';

  return (
    <div
      ref={rootRef}
      className="minting mt-24 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 md:gap-16 items-center"
      data-still={still || undefined}
    >
      <figure className="m-0 flex justify-center">
        <svg
          viewBox={viewBox}
          className="w-full max-w-[250px] md:max-w-[340px] h-auto overflow-visible"
          role="img"
          aria-label="A building drawn as 84 blocks. It is cut along every floor and column, and the blocks separate into individual slices."
        >
          {cubes.map(c => {
            const isActive = c.key === activeKey;
            const isLit = litKeys.has(c.key);
            const tone = isActive ? 'active' : isLit ? 'lit' : 'base';
            return (
              <g
                key={c.key}
                className={`mint-cube mint-${tone}`}
                style={{
                  transform: split ? `translate(${c.dx.toFixed(2)}px, ${c.dy.toFixed(2)}px)` : 'translate(0px, 0px)',
                  transitionDelay: still || !split ? '0ms' : `${c.splitDelay}ms`,
                  // edge strength rides custom properties so the blade can sweep floor by floor
                  ['--edge' as string]: cut ? (tone === 'base' ? 0.5 : 0.85) : 0.1,
                  ['--cut-delay' as string]: still || stage !== 'cut' ? '0ms' : `${c.cutDelay}ms`,
                }}
              >
                <polygon points={c.top} className="mint-top" />
                <polygon points={c.right} className="mint-right" />
                <polygon points={c.left} className="mint-left" />
              </g>
            );
          })}
        </svg>
      </figure>

      <div>
        <div className="flex items-baseline justify-between gap-6 border-b border-zinc-800 pb-4">
          <span className="font-sans text-[11px] tracking-[0.25em] uppercase text-zinc-400">Example ledger</span>
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-zinc-500">$10,000,000 building</span>
        </div>
        <p className="mt-6 mb-8 flex items-baseline gap-3">
          <span
            ref={counterRef}
            className="font-serif italic text-white leading-none tabular-nums"
            style={{ fontFamily: "'Newsreader',serif", fontSize: 'clamp(3rem,6vw,4.5rem)' }}
          >
            {fmt(TOTAL_SLICES)}
          </span>
          <span className="font-sans text-sm text-zinc-400">slices at {`$${fmt(PRICE)}`} each</span>
        </p>

        <ol className="m-0 p-0 list-none border-t border-zinc-800" aria-label="Who owns which slices">
          {rows.map((row, i) => (
            <li
              key={row.cubeKey}
              tabIndex={0}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className={`mint-row grid grid-cols-[1.4fr_1fr_auto] gap-4 py-3 border-b border-zinc-800 font-sans text-sm tabular-nums outline-none ${i < shownRows ? 'is-in' : ''} ${row.cubeKey === activeKey ? 'is-active' : ''}`}
            >
              <span className="text-zinc-300">#{pad4(row.from)} to #{pad4(row.to)}</span>
              <span className="text-zinc-400">{row.wallet}</span>
              <span className="text-right text-[#f2dfd2]">${fmt(row.value)}</span>
            </li>
          ))}
        </ol>

        <div className="mt-6 flex items-start justify-between gap-6">
          <p className="font-sans text-xs text-zinc-500 leading-relaxed max-w-sm m-0">
            Each block stands for about {PER_CUBE} of the building's {fmt(TOTAL_SLICES)} slices. The ledger records which wallet holds which slices; hover a row to find its block.
          </p>
          <button
            type="button"
            onClick={play}
            className="mint-replay shrink-0 inline-flex items-center gap-2 font-sans text-[11px] tracking-[0.2em] uppercase text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 px-3 py-2"
            style={{ transitionTimingFunction: ease }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M10 6a4 4 0 1 1-1.2-2.85" strokeLinecap="round" />
              <path d="M9.2 1.2v2.2H7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Replay
          </button>
        </div>
      </div>
    </div>
  );
}
