// @ts-nocheck -- imported code written for looser TypeScript settings
import { useEffect, useLayoutEffect, useRef } from 'react';
import BackToTop from '@/components/BackToTop';
import { Link } from '@/lib/router-compat';
import { SEOHead } from '@/components/seo/SEOHead';
import { MintingSequence } from '@/components/article/MintingSequence';
import './tokenization.css';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersStill() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || new URLSearchParams(window.location.search).has('static');
}

export default function TokenizationArticle() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Decide on motion before first paint. Anything already on screen stays
  // exactly where the server put it; only offscreen blocks wait to settle in.
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersStill()) return;
    root.querySelectorAll('.reveal, .reveal-left').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
    });
    root.classList.add('tok-motion');
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const still = prefersStill();

    // 1. Reading progress, drawn with transform
    const progressBar = document.getElementById('progress-bar');
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? window.scrollY / docHeight : 0;
      if (progressBar) progressBar.style.transform = `scaleX(${p})`;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 2. Scroll reveal
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    root?.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible)').forEach(el => revealObserver.observe(el));

    // 3. Active side nav
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navDots.forEach(dot => {
            const active = dot.getAttribute('data-section') === id;
            dot.classList.toggle('active', active);
            const icon = dot.querySelector('.dot-icon');
            if (icon) (icon as HTMLElement).style.color = active ? 'white' : '';
          });
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(s => sectionObserver.observe(s));

    // 4. Figures that grow with their data: counters and bars run when their
    //    group comes into view. The server-rendered text already holds the
    //    final value, so nothing reads as zero if this never runs.
    const counterFrames = new Set<number>();
    function animateCounter(el: Element) {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const final = prefix + target + suffix;
      if (still) { el.textContent = final; return; }
      const duration = 1400;
      const start = performance.now();
      const update = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = t < 1 ? prefix + Math.round(eased * target) + suffix : final;
        if (t < 1) counterFrames.add(requestAnimationFrame(update));
      };
      counterFrames.add(requestAnimationFrame(update));
    }
    root?.querySelectorAll<HTMLElement>('.friction-bar-fill[data-width]').forEach(bar => {
      bar.style.setProperty('--share', String(parseFloat(bar.dataset.width || '0') / 100));
    });
    const inviewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        inviewObserver.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    root?.querySelectorAll('[data-inview]').forEach(el => inviewObserver.observe(el));

    // Loops run only while on screen
    const loopObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
    }, { threshold: 0.2 });
    root?.querySelectorAll('[data-loop]').forEach(el => loopObserver.observe(el));

    // 5. Timeline: drag, wheel, and a hairline showing where you are in it
    const track = document.querySelector('.timeline-track') as HTMLElement | null;
    const trackProgress = document.querySelector('.timeline-progress') as HTMLElement | null;
    let isDragging = false, startX = 0, scrollStart = 0;
    let mouseMoveHandler: ((e: MouseEvent) => void) | undefined;
    let mouseUpHandler: (() => void) | undefined;
    let trackScrollHandler: (() => void) | undefined;
    if (track) {
      trackScrollHandler = () => {
        const max = track.scrollWidth - track.clientWidth;
        const p = max > 0 ? track.scrollLeft / max : 1;
        trackProgress?.style.setProperty('--p', String(0.12 + p * 0.88));
      };
      trackScrollHandler();
      track.addEventListener('scroll', trackScrollHandler, { passive: true });
      const wheelHandler = (e: WheelEvent) => {
        const max = track.scrollWidth - track.clientWidth;
        const atEnd = (e.deltaY > 0 && track.scrollLeft >= max - 1) || (e.deltaY < 0 && track.scrollLeft <= 0);
        if (e.deltaY !== 0 && !atEnd) { e.preventDefault(); track.scrollLeft += e.deltaY; }
      };
      track.addEventListener('wheel', wheelHandler, { passive: false });
      const mouseDownHandler = (e: MouseEvent) => {
        isDragging = true;
        startX = e.pageX - track.offsetLeft;
        scrollStart = track.scrollLeft;
        track.style.cursor = 'grabbing';
      };
      mouseUpHandler = () => { isDragging = false; track.style.cursor = 'grab'; };
      mouseMoveHandler = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        track.scrollLeft = scrollStart - (x - startX);
      };
      track.addEventListener('mousedown', mouseDownHandler);
      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
      track.style.cursor = 'grab';
    }

    // 6. Ledger chain: pending transactions drift in, gather into a block,
    //    the block is sealed and linked, and the chain moves on.
    const canvas = canvasRef.current;
    let animFrame = 0;
    let running = false;
    let canvasObserver: IntersectionObserver | undefined;
    let handleCanvasResize: (() => void) | undefined;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      let W = 0, H = 0;
      const BW = 58;        // block size
      const S = 104;        // block pitch
      const PERIOD = 4200;  // one block every 4.2s
      const TX = 4;         // transactions per block
      const rand = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const arrival = (n: number) => 0.38 + n * 0.13;

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = canvas.offsetWidth; H = canvas.offsetHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const txBar = (j: number, n: number) => 10 + rand(j * 7 + n) * (BW - 22);

      const drawBlock = (j: number, x: number, cy: number, alpha: number, fresh: number, bars: number) => {
        const half = BW / 2;
        ctx.fillStyle = `rgba(242,223,210,${(0.025 + fresh * 0.1) * alpha})`;
        ctx.fillRect(x - half, cy - half, BW, BW);
        ctx.strokeStyle = `rgba(242,223,210,${(0.3 + fresh * 0.6) * alpha})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(x - half + 0.5, cy - half + 0.5, BW - 1, BW - 1);
        for (let n = 0; n < bars; n++) {
          ctx.fillStyle = `rgba(242,223,210,${0.28 * alpha})`;
          ctx.fillRect(x - half + 10, cy - half + 13 + n * 10, txBar(j, n), 2);
        }
        ctx.font = '10px Manrope, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = `rgba(212,212,216,${0.45 * alpha})`;
        ctx.fillText(`#${j}`, x - half, cy - half - 10);
      };

      const draw = (k: number, f: number) => {
        ctx.clearRect(0, 0, W, H);
        const headX = Math.round(W * 0.7);
        const cy = Math.round(H - 112);
        const half = BW / 2;
        const shift = easeOut(Math.min(f / 0.3, 1));
        const fadeOf = (x: number) => Math.max(0, Math.min(1, (x + BW) / (W * 0.35)));

        // sealed chain, newest first
        for (let i = 0; ; i++) {
          const j = k - i;
          const x = headX - (i + shift) * S;
          if (x < -BW) break;
          const fade = fadeOf(x);
          const fresh = i === 0 ? Math.max(0, 1 - (f * PERIOD) / 900) : 0;
          // link back to the previous block, drawn in as the block seals
          const lx0 = x - S + half, lx1 = x - half;
          const grow = i === 0 ? Math.min(1, (f * PERIOD) / 500) : 1;
          ctx.strokeStyle = `rgba(242,223,210,${0.3 * fadeOf(lx0)})`;
          ctx.beginPath();
          ctx.moveTo(lx1, cy);
          ctx.lineTo(lx1 - (lx1 - lx0) * grow, cy);
          ctx.stroke();
          drawBlock(j, x, cy, fade, fresh, TX);
        }

        // the next block, gathering transactions
        if (f > 0.3) {
          const g = (f - 0.3) / 0.7;
          const landed = Array.from({ length: TX }, (_, n) => f >= arrival(n)).filter(Boolean).length;
          ctx.setLineDash([3, 4]);
          ctx.strokeStyle = `rgba(242,223,210,${0.12 + g * 0.3})`;
          ctx.strokeRect(headX - half + 0.5, cy - half + 0.5, BW - 1, BW - 1);
          ctx.setLineDash([]);
          for (let n = 0; n < landed; n++) {
            ctx.fillStyle = 'rgba(242,223,210,0.3)';
            ctx.fillRect(headX - half + 10, cy - half + 13 + n * 10, txBar(k + 1, n), 2);
          }
          for (let n = 0; n < TX; n++) {
            const a = arrival(n);
            const t = (f - (a - 0.22)) / 0.22;
            if (t <= 0 || t >= 1) continue;
            const e = easeOut(t);
            const sx = W + 12, sy = cy + (rand((k + 1) * 13 + n) - 0.5) * H * 0.55;
            const tx = headX - half + 10, ty = cy - half + 14 + n * 10;
            ctx.fillStyle = `rgba(242,223,210,${0.75 * Math.min(1, t * 4)})`;
            ctx.beginPath();
            ctx.arc(sx + (tx - sx) * e, sy + (ty - sy) * e, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };

      const t0 = performance.now() - PERIOD * 0.55;
      const BASE = 812_400; // block heights for the labels
      const frame = (now: number) => {
        const t = now - t0;
        draw(BASE + Math.floor(t / PERIOD), (t % PERIOD) / PERIOD);
        if (running) animFrame = requestAnimationFrame(frame);
      };
      const start = () => { if (!running && !still) { running = true; animFrame = requestAnimationFrame(frame); } };
      const stop = () => { running = false; cancelAnimationFrame(animFrame); };

      resize();
      draw(BASE, 0.62);
      handleCanvasResize = () => { resize(); if (!running) draw(BASE, 0.62); };
      window.addEventListener('resize', handleCanvasResize, { passive: true });
      canvasObserver = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) start(); else stop();
      });
      canvasObserver.observe(canvas);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      revealObserver.disconnect();
      sectionObserver.disconnect();
      inviewObserver.disconnect();
      loopObserver.disconnect();
      counterFrames.forEach(id => cancelAnimationFrame(id));
      canvasObserver?.disconnect();
      running = false;
      cancelAnimationFrame(animFrame);
      if (handleCanvasResize) window.removeEventListener('resize', handleCanvasResize);
      if (track && trackScrollHandler) track.removeEventListener('scroll', trackScrollHandler);
      if (mouseMoveHandler) document.removeEventListener('mousemove', mouseMoveHandler);
      if (mouseUpHandler) document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, []);

  return (
    <>
      <SEOHead
        title="The Tokenization of Assets"
        description="How tokenization moves real-world assets onto blockchain ledgers, and what that changes about ownership, settlement, and who gets to invest."
        image="/og-tokenization.png"
        type="article"
      />
    <div ref={rootRef} className="tok-root bg-[oklch(0.187_0_0)] text-[oklch(0.915_0.004_39.5)] font-sans overflow-x-hidden" style={{ fontFamily: "'Manrope',sans-serif" }}>

      {/* Reading Progress Bar */}
      <div id="progress-bar" />

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[oklch(0.187_0_0)]/95 backdrop-blur-sm flex justify-between items-center px-8 py-6 max-w-[1920px] mx-auto" style={{ left: 0, right: 0 }}>
        <a href="/" className="font-sans text-zinc-300 hover:text-white transition-colors no-underline text-lg">
          Mohamad Noor-Chowdhury
        </a>
        <div className="hidden md:flex items-center gap-10">
          <a className="text-zinc-400 font-sans text-[14px] hover:text-zinc-300" href="#intro">Theory</a>
          <a className="text-zinc-400 font-sans text-[14px] hover:text-zinc-300" href="#process">Process</a>
          <a className="text-zinc-400 font-sans text-[14px] hover:text-zinc-300" href="#assets">Markets</a>
          <a className="text-zinc-400 font-sans text-[14px] hover:text-zinc-300" href="#road-ahead">Outlook</a>
        </div>
        <div />
      </nav>


      <main className="pt-24">

        {/* ── HERO ── */}
        <section id="intro" className="min-h-screen flex flex-col justify-center px-8 md:px-24 pb-24 relative">
          <h1 className="font-serif text-[clamp(3.2rem,10vw,10.5rem)] leading-[0.92] text-white mb-12 reveal" style={{ fontFamily: "'Newsreader',serif" }}>
            The Tokenization<br />of <span className="text-[oklch(0.915_0.027_56.7)]">Assets</span>
          </h1>
          <div className="flex flex-col md:flex-row items-end justify-between gap-12">
            <div className="reveal reveal-delay-2">
              <p className="font-sans text-sm md:text-base text-zinc-400 max-w-md leading-relaxed mb-6">
                How tokenization moves real-world assets onto blockchain ledgers, and what that changes about ownership, settlement, and who gets to invest.
              </p>
              <div className="flex items-center gap-4">
                <span className="font-sans text-[14px] text-zinc-400">By</span>
                <span className="font-sans text-[14px] text-zinc-400">Mohamad Noor-Chowdhury</span>
                <span className="text-zinc-400">·</span>
                <span className="font-sans text-[14px] text-zinc-400">18 min read</span>
              </div>
            </div>
            </div>
        </section>

        {/* ── BLEED Network Canvas ── */}
        <section className="w-full relative overflow-hidden" style={{ height: '640px' }}>
          <canvas ref={canvasRef} id="network-canvas" className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-8">
            <span className="font-serif text-zinc-300 leading-tight" style={{ fontFamily: "'Newsreader',serif", fontSize: 'clamp(3rem, 8vw, 7rem)' }}>What Is<br />Tokenization</span>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <span className="font-sans text-[14px] text-zinc-400">Transactions gather into blocks, and each block links to the last</span>
          </div>
        </section>

        {/* ── DEFINITION ── */}
        <section id="definition" className="py-32 px-8 md:px-24 lg:px-48 bg-[oklch(0.187_0_0)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5 pt-12">
              <h2 className="font-serif text-4xl text-white leading-tight mb-8 reveal" style={{ fontFamily: "'Newsreader',serif" }}>
                From fixed assets to programmable ones
              </h2>
              <p className="font-sans text-base text-zinc-400 leading-relaxed mb-6 reveal reveal-delay-1">
                Tokenization means recording the rights to a real-world asset on a blockchain ledger, so the asset can be split up and moved about as easily as data. A pizza helps here. A $10 million building is a whole pizza, and most people can't afford a whole pizza. Tokenization cuts it into 10,000 slices, and the blockchain is the receipt that shows who owns which slice.
              </p>
              <p className="font-sans text-base text-zinc-400 leading-relaxed mb-6 reveal reveal-delay-2">
                Cryptocurrency created new assets. Tokenization takes ones that already exist (real estate, bonds, gold, private equity) and puts them on-chain. A property deal with a $5M minimum can sell tokens at $1,000 each. Private credit funds that only took institutional money can open to investors anywhere, as long as the smart contract confirms each buyer is allowed to invest.
              </p>
              <p className="font-sans text-base text-zinc-400 leading-relaxed reveal reveal-delay-3">
                The closest comparison I can think of is the move from DVDs to streaming. Assets that used to sit in one place, held whole by one owner, start to move like data.
              </p>
              <div className="mt-12 rounded-xl bg-white/[0.04] p-6 reveal reveal-delay-4">
                <span className="font-sans text-[14px] text-zinc-400 block mb-2">The Legal Wrapper</span>
                <p className="font-sans text-sm text-zinc-300 leading-relaxed">The <em>token</em> proves ownership on the ledger. The <em>legal wrapper</em> is what a court will recognize. The two have to be tied together, or a transfer on the blockchain means nothing in law.</p>
              </div>
            </div>

            <div className="lg:col-span-7 flex items-center reveal reveal-delay-3">
              <div className="rounded-xl bg-white/[0.04] p-6">
                <span className="font-sans font-bold text-[14px] text-zinc-400 block mb-3">McKinsey Projection</span>
                <span className="font-serif leading-none block mb-4 text-[oklch(0.915_0.027_56.7)]" style={{ fontFamily: "'Newsreader',serif", fontSize: 'clamp(4rem,8vw,7rem)' }}>$2T</span>
                <span className="font-sans text-sm text-zinc-400 leading-relaxed block max-w-xs">McKinsey's base-case estimate for the tokenized market by 2030. BCG's higher estimate: $16 trillion.</span>
              </div>
            </div>
          </div>

          <MintingSequence />

          {/* 3-Panel Flow Diagram */}
          <div className="mt-20 reveal overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 56px 1fr 56px 1fr', alignItems: 'center', gap: 0, minWidth: '800px' }}>
            {/* Panel 1 */}
            <div className="flex flex-col items-center gap-8 p-12 rounded-2xl" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
              <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
                <polygon points="100,30 148,57 100,84 52,57" fill="rgba(242,223,210,0.07)" stroke="rgba(242,223,210,0.35)" strokeWidth="1" />
                <polygon points="100,84 148,57 148,170 100,197" fill="rgba(242,223,210,0.04)" stroke="rgba(242,223,210,0.25)" strokeWidth="1" />
                <polygon points="52,57 100,84 100,197 52,170" fill="rgba(242,223,210,0.02)" stroke="rgba(242,223,210,0.15)" strokeWidth="1" />
                <line x1="52" y1="170" x2="148" y2="170" stroke="rgba(242,223,210,0.12)" strokeWidth="0.5" strokeDasharray="3,3" />
                <circle cx="130" cy="105" r="2" fill="rgba(242,223,210,0.3)" />
                <circle cx="130" cy="120" r="2" fill="rgba(242,223,210,0.3)" />
                <circle cx="130" cy="135" r="2" fill="rgba(242,223,210,0.3)" />
                <circle cx="115" cy="112" r="2" fill="rgba(242,223,210,0.2)" />
                <circle cx="115" cy="127" r="2" fill="rgba(242,223,210,0.2)" />
                <circle cx="70" cy="105" r="2" fill="rgba(242,223,210,0.15)" />
                <circle cx="70" cy="120" r="2" fill="rgba(242,223,210,0.15)" />
                <circle cx="85" cy="112" r="2" fill="rgba(242,223,210,0.1)" />
                <line x1="148" y1="57" x2="162" y2="50" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <line x1="148" y1="170" x2="162" y2="163" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <line x1="162" y1="50" x2="162" y2="163" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <line x1="158" y1="50" x2="166" y2="50" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <line x1="158" y1="163" x2="166" y2="163" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
              </svg>
              <div className="text-center">
                <span className="font-serif text-2xl text-zinc-200" style={{ fontFamily: "'Newsreader',serif" }}>The Asset</span>
                <p className="font-sans text-sm text-zinc-400 mt-3 leading-relaxed">Real estate, bonds,<br />gold, art, private credit</p>
              </div>
            </div>
            {/* Arrow 1 */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 56 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '56px', height: '24px' }}>
                <line x1="4" y1="12" x2="42" y2="12" stroke="rgba(242,223,210,0.25)" strokeWidth="1" />
                <polygon points="52,12 40,7 40,17" fill="rgba(242,223,210,0.25)" />
              </svg>
            </div>
            {/* Panel 2 */}
            <div className="flex flex-col items-center gap-8 p-12 rounded-2xl" style={{ background: 'oklch(1 0 0 / 0.04)' }}>
              <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
                <rect x="28" y="95" width="38" height="120" fill="rgba(242,223,210,0.03)" stroke="rgba(242,223,210,0.25)" strokeWidth="1" />
                <rect x="134" y="95" width="38" height="120" fill="rgba(242,223,210,0.03)" stroke="rgba(242,223,210,0.25)" strokeWidth="1" />
                <path d="M28,95 C28,12 172,12 172,95" fill="none" stroke="rgba(242,223,210,0.35)" strokeWidth="1" />
                <path d="M46,95 C46,36 154,36 154,95" fill="none" stroke="rgba(242,223,210,0.15)" strokeWidth="0.75" strokeDasharray="4,3" />
                <circle cx="47" cy="115" r="3" fill="none" stroke="rgba(242,223,210,0.4)" strokeWidth="1" />
                <circle cx="47" cy="135" r="3" fill="none" stroke="rgba(242,223,210,0.3)" strokeWidth="1" />
                <circle cx="47" cy="155" r="3" fill="none" stroke="rgba(242,223,210,0.2)" strokeWidth="1" />
                <line x1="47" y1="118" x2="47" y2="132" stroke="rgba(242,223,210,0.2)" strokeWidth="0.75" />
                <line x1="47" y1="138" x2="47" y2="152" stroke="rgba(242,223,210,0.2)" strokeWidth="0.75" />
                <circle cx="153" cy="115" r="3" fill="none" stroke="rgba(242,223,210,0.4)" strokeWidth="1" />
                <circle cx="153" cy="135" r="3" fill="none" stroke="rgba(242,223,210,0.3)" strokeWidth="1" />
                <circle cx="153" cy="155" r="3" fill="none" stroke="rgba(242,223,210,0.2)" strokeWidth="1" />
                <line x1="153" y1="118" x2="153" y2="132" stroke="rgba(242,223,210,0.2)" strokeWidth="0.75" />
                <line x1="153" y1="138" x2="153" y2="152" stroke="rgba(242,223,210,0.2)" strokeWidth="0.75" />
                <line x1="100" y1="62" x2="100" y2="180" stroke="rgba(242,223,210,0.3)" strokeWidth="1" strokeDasharray="5,4" />
                <polygon points="100,190 95,178 105,178" fill="rgba(242,223,210,0.3)" />
              </svg>
              <div className="text-center">
                <span className="font-serif text-2xl text-zinc-200" style={{ fontFamily: "'Newsreader',serif" }}>The Ledger</span>
                <p className="font-sans text-sm text-zinc-400 mt-3 leading-relaxed">Smart contract encodes<br />rights, compliance, yield</p>
              </div>
            </div>
            {/* Arrow 2 */}
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 56 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '56px', height: '24px' }}>
                <line x1="4" y1="12" x2="42" y2="12" stroke="rgba(242,223,210,0.4)" strokeWidth="1" />
                <polygon points="52,12 40,7 40,17" fill="rgba(242,223,210,0.4)" />
              </svg>
            </div>
            {/* Panel 3 */}
            <div className="flex flex-col items-center gap-8 p-12 rounded-2xl" style={{ background: 'oklch(0.91 0.03 58 / 0.06)' }}>
              <svg viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '240px', height: 'auto' }}>
                <polygon points="100,51 118,60 100,69 82,60" fill="rgba(242,223,210,0.06)" stroke="rgba(242,223,210,0.2)" strokeWidth="0.5" />
                <polygon points="100,69 118,60 118,78 100,87" fill="rgba(242,223,210,0.04)" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <polygon points="82,60 100,69 100,87 82,78" fill="rgba(242,223,210,0.02)" stroke="rgba(242,223,210,0.1)" strokeWidth="0.5" />
                <polygon points="82,60 100,69 82,78 64,69" fill="rgba(242,223,210,0.06)" stroke="rgba(242,223,210,0.2)" strokeWidth="0.5" />
                <polygon points="82,78 100,69 100,87 82,96" fill="rgba(242,223,210,0.04)" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <polygon points="64,69 82,78 82,96 64,87" fill="rgba(242,223,210,0.02)" stroke="rgba(242,223,210,0.1)" strokeWidth="0.5" />
                <polygon points="118,60 136,69 118,78 100,69" fill="rgba(242,223,210,0.06)" stroke="rgba(242,223,210,0.2)" strokeWidth="0.5" />
                <polygon points="118,78 136,69 136,87 118,96" fill="rgba(242,223,210,0.04)" stroke="rgba(242,223,210,0.15)" strokeWidth="0.5" />
                <polygon points="100,69 118,78 118,96 100,87" fill="rgba(242,223,210,0.02)" stroke="rgba(242,223,210,0.1)" strokeWidth="0.5" />
                {/* accent */}
                <polygon points="100,69 118,78 100,87 82,78" fill="rgba(242,223,210,0.13)" stroke="rgba(242,223,210,0.45)" strokeWidth="0.75" />
                <polygon points="100,87 118,78 118,96 100,105" fill="rgba(242,223,210,0.08)" stroke="rgba(242,223,210,0.35)" strokeWidth="0.75" />
                <polygon points="82,78 100,87 100,105 82,96" fill="rgba(242,223,210,0.05)" stroke="rgba(242,223,210,0.25)" strokeWidth="0.75" />
                <polygon points="100,87 118,96 100,105 82,96" fill="rgba(242,223,210,0.13)" stroke="rgba(242,223,210,0.45)" strokeWidth="0.75" />
                <polygon points="100,105 118,96 118,114 100,123" fill="rgba(242,223,210,0.08)" stroke="rgba(242,223,210,0.35)" strokeWidth="0.75" />
                <polygon points="82,96 100,105 100,123 82,114" fill="rgba(242,223,210,0.05)" stroke="rgba(242,223,210,0.25)" strokeWidth="0.75" />
                <polygon points="100,105 118,114 100,123 82,114" fill="rgba(242,223,210,0.13)" stroke="rgba(242,223,210,0.45)" strokeWidth="0.75" />
                <polygon points="100,123 118,114 118,132 100,141" fill="rgba(242,223,210,0.08)" stroke="rgba(242,223,210,0.35)" strokeWidth="0.75" />
                <polygon points="82,114 100,123 100,141 82,132" fill="rgba(242,223,210,0.05)" stroke="rgba(242,223,210,0.25)" strokeWidth="0.75" />
              </svg>
              <div className="text-center">
                <span className="font-serif text-2xl text-[oklch(0.915_0.027_56.7)]" style={{ fontFamily: "'Newsreader',serif" }}>The Token</span>
                <p className="font-sans text-sm text-zinc-400 mt-3 leading-relaxed">Fractional, liquid,<br />24/7 globally tradeable</p>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="border-t border-b border-white/10 bg-[oklch(0.164_0_0)] py-0" id="stats-section" data-inview>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="flex flex-col items-center justify-center py-16 px-12 text-center reveal">
              <span className="stat-number text-6xl text-white mb-3" data-target="16" data-prefix="$" data-suffix="T">$16T</span>
              <span className="font-sans text-[14px] text-zinc-400 leading-loose">Upper-end tokenized market<br />projection by 2030</span>
              <span className="font-sans text-[14px] text-zinc-400 mt-3">Source: BCG / ADDX, 2022</span>
            </div>
            <div className="flex flex-col items-center justify-center py-16 px-12 text-center reveal reveal-delay-2">
              <span className="stat-number text-6xl text-white mb-3" data-target="39" data-prefix="$" data-suffix="B">$39B</span>
              <span className="font-sans text-[14px] text-zinc-400 leading-loose">Tokenized real-world assets on-chain<br />today, not counting stablecoins</span>
              <span className="font-sans text-[14px] text-zinc-400 mt-3">Source: RWA.xyz, Nov 2026</span>
            </div>
            <div className="flex flex-col items-center justify-center py-16 px-12 text-center reveal reveal-delay-3">
              <span className="stat-number text-6xl text-white mb-3" data-target="61" data-suffix="%">61%</span>
              <span className="font-sans text-[14px] text-zinc-400 leading-loose">Of tokenized asset volume<br />is Private Credit in 2025</span>
              <span className="font-sans text-[14px] text-zinc-400 mt-3">Source: RWA.xyz, 2025</span>
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="py-24 px-8 md:px-24 lg:px-48 bg-[oklch(0.223_0_0)]">
          <div className="mb-16 reveal">
            <h2 className="font-serif text-4xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>Legacy Markets vs. Tokenized Markets</h2>
          </div>
          <div className="rounded-2xl bg-white/[0.04] reveal overflow-x-auto">
            <div style={{ minWidth: '700px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid oklch(1 0 0 / 0.1)' }}>
              <div className="comp-cell font-sans text-[14px] text-zinc-400" />
              <div className="comp-cell font-sans text-[14px] text-zinc-400">Legacy Infrastructure</div>
              <div className="comp-cell font-sans text-[14px] text-[oklch(0.915_0.027_56.7)]">Tokenized Networks</div>
            </div>
            <div className="comp-row">
              <div className="comp-cell text-zinc-400 font-bold text-[13px]">Market Hours</div>
              <div className="comp-cell text-zinc-400">Monday to Friday, 9 to 5. Trading stops on weekends, holidays, and after hours.</div>
              <div className="comp-cell text-[oklch(0.915_0.027_56.7)] font-medium">Open 24/7, every day of the year.</div>
            </div>
            <div className="comp-row">
              <div className="comp-cell text-zinc-400 font-bold text-[13px]">Settlement Speed</div>
              <div className="comp-cell text-zinc-400">One to five days (US stocks moved to T+1 in 2024). Manual reconciliation, custody chains, correspondent banks.</div>
              <div className="comp-cell text-[oklch(0.915_0.027_56.7)] font-medium">Near-instant atomic settlement: the payment and the asset move in the same transaction, or neither moves.</div>
            </div>
            <div className="comp-row">
              <div className="comp-cell text-zinc-400 font-bold text-[13px]">Accessibility</div>
              <div className="comp-cell text-zinc-400">Institutional-only entry points. A $100M PE fund requires a $1M minimum commitment.</div>
              <div className="comp-cell text-[oklch(0.915_0.027_56.7)] font-medium">Fractional. A $100M asset can be split into 100,000 tokens at $1,000 each.</div>
            </div>
            <div className="comp-row">
              <div className="comp-cell text-zinc-400 font-bold text-[13px]">Asset Mobility</div>
              <div className="comp-cell text-zinc-400">Assets are stuck with one custodian in one jurisdiction.</div>
              <div className="comp-cell text-[oklch(0.915_0.027_56.7)] font-medium">Assets can work together. A tokenized gold bar can be collateral for borrowing a tokenized bond.</div>
            </div>
            <div className="comp-row" style={{ borderBottom: 'none' }}>
              <div className="comp-cell text-zinc-400 font-bold text-[13px]">Compliance</div>
              <div className="comp-cell text-zinc-400">Checked by hand after the fact, so failures can surface weeks later.</div>
              <div className="comp-cell text-[oklch(0.915_0.027_56.7)] font-medium">Automated via smart contracts. A trade that fails compliance never executes.</div>
            </div>
            </div>
          </div>
        </section>

        {/* ── PULL QUOTE Larry Fink ── */}
        <section className="py-48 bg-[oklch(0.223_0_0)]">
          <div className="max-w-5xl mx-auto px-8 text-center">
            <div className="reveal">
              <div className="quote-line" />
              <blockquote className="font-serif text-4xl md:text-6xl text-white leading-tight mb-12" style={{ fontFamily: "'Newsreader',serif" }}>
                "I believe the next generation for markets, the next generation for securities, will be <span className="text-[oklch(0.915_0.027_56.7)]">tokenization of securities</span>."
              </blockquote>
              <cite className="font-sans text-[14px] font-bold text-zinc-400">Larry Fink, CEO, BlackRock, DealBook Summit 2022</cite>
            </div>
          </div>
        </section>

        {/* ── 5-STAGE PROCESS ── */}
        <section id="process" className="py-32 px-8 md:px-24 lg:px-48 bg-[oklch(0.187_0_0)]">
          <div className="mb-24 flex flex-col items-start reveal">
            <h2 className="font-serif text-5xl text-white max-w-2xl leading-tight" style={{ fontFamily: "'Newsreader',serif" }}>How an Asset Moves from the Physical World to the Digital Ledger</h2>
          </div>

          {/* Stage 01 */}
          <div className="stage-step reveal" style={{ paddingTop: '4rem', paddingBottom: 0, overflow: 'hidden' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <h3 className="font-serif text-2xl text-white mb-4" style={{ fontFamily: "'Newsreader',serif" }}>Choosing What Gets Tokenized</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">Almost anything with clear ownership can be tokenized, but four asset classes make up nearly all the volume today.</p>
              </div>
              <div className="lg:col-span-6 flex flex-col">
                <p className="font-sans text-[14px] text-zinc-400 mb-3">Source: RWA.xyz, tokenized asset volume by class, 2025</p>
                <div data-inview style={{ display: 'grid', gridTemplateColumns: '61fr 39fr', gap: '2px', flex: 1, minHeight: '220px' }}>
                  <div className="treemap-block flex flex-col justify-end p-6" data-order="1" style={{ background: 'oklch(0.262 0.034 257.7)' }}>
                    <span className="font-serif text-5xl text-zinc-100 mb-2 leading-none" style={{ fontFamily: "'Newsreader',serif" }}>61%</span>
                    <h3 className="font-sans font-bold text-[14px] text-zinc-300 mb-1">Private Credit</h3>
                    <p className="font-sans text-sm text-zinc-400 leading-snug">The largest category. Smart contracts pay out the yield and adjust collateral automatically.</p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateRows: '30fr 9fr', gap: '2px' }}>
                    <div className="treemap-block flex flex-col justify-end p-4" data-order="2" style={{ background: 'oklch(0.279 0.034 144.6)' }}>
                      <span className="font-serif text-3xl text-zinc-100 mb-1 leading-none" style={{ fontFamily: "'Newsreader',serif" }}>30%</span>
                      <h3 className="font-sans font-bold text-[14px] text-zinc-300 mb-1">Treasuries</h3>
                      <p className="font-sans text-sm text-zinc-400 leading-snug">Yield-bearing government debt, the closest thing on-chain markets have to cash.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '7fr 2fr', gap: '2px' }}>
                      <div className="treemap-block flex flex-col justify-end p-3" data-order="3" style={{ background: 'oklch(0.249 0.026 66.2)' }}>
                        <span className="font-serif text-lg text-zinc-100 mb-1 leading-none" style={{ fontFamily: "'Newsreader',serif" }}>7%</span>
                        <h3 className="font-sans font-bold text-[14px] text-zinc-400 mb-1">Commodities</h3>
                        <p className="font-sans text-[14px] text-zinc-400 leading-snug">Mostly tokenized gold.</p>
                      </div>
                      <div className="treemap-block flex flex-col justify-end p-3" data-order="4" style={{ background: 'oklch(0.260 0 0)' }}>
                        <span className="font-serif text-base text-zinc-300 mb-1 leading-none" style={{ fontFamily: "'Newsreader',serif" }}>2%</span>
                        <h3 className="font-sans font-bold text-[13px] text-zinc-400 mb-1">Funds</h3>
                        <p className="font-sans text-[13px] text-zinc-400 leading-snug">Institutional</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 02 */}
          <div className="stage-step py-16 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-6">
                <h3 className="font-serif text-2xl text-white mb-4" style={{ fontFamily: "'Newsreader',serif" }}>Building the Digital Blueprint</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-6">The token is a piece of software that holds the asset's rights. When it uses the ISO-20022 messaging standard, it can exchange messages with banking systems like SWIFT, so both sides can reconcile their records in real time.</p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-[oklch(0.915_0.027_56.7)] mt-0.5 flex-shrink-0">·</span>
                    <p className="font-sans text-sm text-zinc-300 leading-relaxed"><span className="text-white font-medium">ISO-20022</span> is the message format banks use for payments. A token that uses it can talk to bank systems without a custom translation layer.</p>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-[oklch(0.915_0.027_56.7)] mt-0.5 flex-shrink-0">·</span>
                    <p className="font-sans text-sm text-zinc-300 leading-relaxed"><span className="text-white font-medium">SWIFT</span> is the network banks use to send payment instructions worth trillions of dollars a day. Tokens that use ISO-20022 can connect to it without anyone reconciling records by hand.</p>
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-6">
                <div className="space-y-0 rounded-2xl">
                  {[
                    { label: 'Key Information', text: 'Asset type, who issued it, and an on-chain ID that no other token shares.' },
                    { label: 'Embedded Rights', text: "Voting rights, interest payment schedules, and dividend payouts, written into the token's code." },
                    { label: 'Compliance Rules', text: 'Transfer restrictions for each jurisdiction, such as accredited-investor requirements, enforced automatically by the token.' },
                    { label: 'Provenance', text: 'A full history of every owner. Nobody can edit it, and anyone with access to the ledger can audit it.' },
                  ].map((item, i) => (
                    <div key={i} className={`p-5 ${i < 3 ? 'border-b border-white/10' : ''} hover:bg-[oklch(0.285_0_0)] transition-colors cursor-default`}>
                      <span className="font-sans font-bold text-[14px] text-zinc-400 block mb-1">{item.label}</span>
                      <p className="font-sans text-sm text-zinc-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stage 03 */}
          <div className="stage-step py-16 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-6">
                <h3 className="font-serif text-2xl text-white mb-4" style={{ fontFamily: "'Newsreader',serif" }}>Smart Contracts as Execution Engine</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">A smart contract is code that runs on its own when set conditions are met, so nobody has to approve each step by hand. Tokens on the same network share that code, which means they can be combined: you could put up tokenized gold as collateral for a loan, earn yield on a tokenized bond, and settle in a stablecoin, all in one transaction.</p>
                <div className="mt-6 rounded-xl bg-white/[0.04] p-6">
                  <span className="font-sans text-[14px] text-zinc-400 block mb-1">Atomic Settlement</span>
                  <p className="font-sans text-sm text-zinc-400">The asset and the payment change hands at the same moment. If the payment isn't there, the asset doesn't move, so one side can't pay and then never receive anything.</p>
                  <svg
                    className="atomic-swap mt-5 block w-full max-w-[320px] h-auto overflow-visible"
                    viewBox="0 0 320 84"
                    data-loop
                    role="img"
                    aria-label="The asset moves from seller to buyer while the payment moves from buyer to seller, and both land in the same instant."
                    style={{ ['--travel' as string]: '188px' }}
                  >
                    <text x="0" y="10" fill="#71717a" fontSize="11" fontFamily="Manrope, sans-serif">Seller</text>
                    <text x="320" y="10" fill="#71717a" fontSize="11" fontFamily="Manrope, sans-serif" textAnchor="end">Buyer</text>
                    <line x1="0" y1="34" x2="320" y2="34" stroke="#27272a" />
                    <line x1="0" y1="66" x2="320" y2="66" stroke="#27272a" />
                    <line x1="160" y1="20" x2="160" y2="80" stroke="rgba(242,223,210,0.35)" strokeDasharray="2 3" />
                    <circle className="swap-ring" cx="160" cy="50" r="7" fill="none" stroke="#f2dfd2" />
                    <g className="swap-asset">
                      <rect x="6" y="24" width="120" height="20" fill="#f2dfd2" />
                      <text x="66" y="37.5" fill="#131313" fontSize="11" fontFamily="Manrope, sans-serif" textAnchor="middle" fontWeight="700">Asset</text>
                    </g>
                    <g className="swap-pay">
                      <rect x="194" y="56" width="120" height="20" fill="none" stroke="#f2dfd2" />
                      <text x="254" y="69.5" fill="#f2dfd2" fontSize="11" fontFamily="Manrope, sans-serif" textAnchor="middle" fontWeight="700">Payment</text>
                    </g>
                  </svg>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="grid grid-cols-1 gap-0.5 bg-zinc-800">
                  {[
                    { icon: 'bolt', title: 'Automation of Dividends', text: 'Rent or interest goes to token holders as soon as it comes in, without a fund administrator in the middle.' },
                    { icon: 'balance', title: 'Real-Time Reconciliation', text: 'The contract updates the books with every transaction, so there are no overnight batches and no month-end scramble to make the records match.' },
                    { icon: 'shield', title: 'Compliance Enforcement', text: 'A trade that violates jurisdiction rules or Know Your Customer and Anti-Money Laundering requirements is rejected before it executes.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[oklch(0.187_0_0)] p-8 hover:bg-[oklch(0.223_0_0)] transition-colors cursor-default flex gap-6 items-start">
                      <span className="material-symbols-outlined text-[oklch(0.915_0.027_56.7)]" style={{ fontSize: '24px', flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <h4 className="font-sans font-bold text-[14px] text-zinc-300 mb-2">{item.title}</h4>
                        <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stage 04 */}
          <div className="stage-step py-16 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-12">
                <h3 className="font-serif text-2xl text-white mb-6" style={{ fontFamily: "'Newsreader',serif" }}>Solving the Double-Spend Problem</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="font-sans text-sm text-zinc-400 leading-relaxed">The physical asset has to be locked up so nobody can sell it offline while its token trades online. In reference-backed tokenization, a gold bar sits in a vault and the token is the only way to trade it.</p>
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-[14px] text-zinc-400 mb-3">On-Chain Issuance</h4>
                    <p className="font-sans text-sm text-zinc-400 leading-relaxed">Some bonds are issued directly on the blockchain and have no physical counterpart, so there is nothing to lock in a vault. The ledger entry <em>is</em> the bond.</p>
                  </div>
                  <div className="border border-white/10 p-6">
                    <h4 className="font-sans font-bold text-[14px] text-[oklch(0.915_0.027_56.7)] mb-3">Bankruptcy Remoteness</h4>
                    <p className="font-sans text-sm text-zinc-400 leading-relaxed">In places without clear digital-asset laws, the asset behind a token can get lumped in with a bankrupt issuer's other property. A bankruptcy-remote structure keeps the asset with the token holders instead of the company's creditors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stage 05 */}
          <div className="stage-step py-16 reveal" style={{ borderBottom: '1px solid oklch(1 0 0 / 0.1)' }}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-6">
                <h3 className="font-serif text-2xl text-white mb-4" style={{ fontFamily: "'Newsreader',serif" }}>The Token Goes Live</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">Minting creates the tokens on the ledger. They go to investors' wallets, trade around the clock, and collect coupon payments automatically. At maturity the token is burned and the holder receives the underlying value. Right now the market runs on two kinds of network.</p>
              </div>
              <div className="lg:col-span-5">
                <div className="space-y-0.5">
                  {[
                    { label: 'Permissioned Networks', desc: "Private consortium ledgers that banks prefer for privacy, such as JPMorgan's Kinexys, Goldman's DAP, and HSBC Orion." },
                    { label: 'Permissionless Networks', desc: 'Public networks such as Ethereum, Polygon, and Avalanche, open to capital from anywhere. They are now growing faster than permissioned networks.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[oklch(0.240_0_0)] p-8 hover:bg-[oklch(0.285_0_0)] transition-colors cursor-default">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-sans font-bold text-[14px] text-zinc-300">{item.label}</h4>
                      </div>
                      <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT ACTUALLY WORKS ── */}
        <section className="py-32 px-8 md:px-24 lg:px-48 bg-[oklch(0.223_0_0)]">
          <div className="mb-24 flex flex-col items-start reveal">
            <h2 className="font-serif text-5xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>What Tokenization Changes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 bg-zinc-800">
            {[
              { icon: 'apartment', title: 'Fractional Ownership', text: 'Split a $100M asset into 100,000 tokens at $1,000 each and individuals can buy in alongside institutions.', tag: '$393T global real estate market', delay: 1 },
              { icon: 'contract', title: 'Smart Contract Logic', text: 'Agreements that carry out ownership rules, dividend payments, and votes on their own, without waiting on lawyers or custodians. The compliance checks are part of the code from the start.', tag: 'T+0 atomic settlement', delay: 2 },
              { icon: 'water_drop', title: 'Decentralized Liquidity', text: "Public networks trade around the clock and let in capital from anywhere. Algorithmic market makers do the job floor specialists used to do, and DeFi protocols supply liquidity when it's needed.", tag: '24/7 global trading', delay: 3 },
            ].map((item, i) => (
              <div key={i} className={`pillar-card bg-[oklch(0.223_0_0)] p-12 hover:bg-[oklch(0.285_0_0)] transition-colors group cursor-default reveal reveal-delay-${item.delay}`}>
                <span className="material-symbols-outlined text-[oklch(0.915_0.027_56.7)] text-4xl mb-8 group-hover:scale-110 transition-transform inline-block">{item.icon}</span>
                <h3 className="font-serif text-2xl text-white mb-6" style={{ fontFamily: "'Newsreader',serif" }}>{item.title}</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-8">{item.text}</p>
                <span className="font-sans text-[14px] text-zinc-400">{item.tag}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-zinc-800 mt-0.5">
            {[
              { icon: 'security', title: 'ISO-20022 Interoperability', text: 'The shared message format that lets tokens communicate with bank systems like SWIFT, so on-chain and off-chain records can be matched in real time. Banks need this before they can use tokenized assets at any scale.', delay: 2 },
              { icon: 'hub', title: 'Composable Finance', text: 'Think of tokenized assets like apps on a smartphone. They all run on the same operating system, so they can share data, talk to each other, and combine in ways a single app never could alone. Use your tokenized gold to back a loan, earn yield on a tokenized bond, and settle in a stablecoin, all in one transaction.', delay: 3 },
            ].map((item, i) => (
              <div key={i} className={`pillar-card bg-[oklch(0.223_0_0)] p-12 hover:bg-[oklch(0.285_0_0)] transition-colors group cursor-default reveal reveal-delay-${item.delay}`}>
                <span className="material-symbols-outlined text-[oklch(0.915_0.027_56.7)] text-4xl mb-8 group-hover:scale-110 transition-transform inline-block">{item.icon}</span>
                <h3 className="font-serif text-2xl text-white mb-6" style={{ fontFamily: "'Newsreader',serif" }}>{item.title}</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── BLEED 02 ── */}
        <section className="w-full relative overflow-hidden" style={{ height: '480px', background: 'oklch(0.164 0 0)' }}>
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(242,223,210,0.6) 0%, transparent 70%)', filter: 'blur(60px)', transform: 'translate(-50%,-30%)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, rgba(180,160,140,0.5) 0%, transparent 70%)', filter: 'blur(40px)', transform: 'translate(50%,30%)' }} />
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-8">
            <span className="font-serif text-zinc-300 leading-tight" style={{ fontFamily: "'Newsreader',serif", fontSize: 'clamp(3rem, 8vw, 7rem)' }}>Where Capital<br />Is Flowing</span>
          </div>
        </section>

        {/* ── ASSET CLASSES ── */}
        <section id="assets" className="py-32 px-8 md:px-24 lg:px-48 bg-[oklch(0.187_0_0)]">
          <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="reveal">
              <h2 className="font-serif text-5xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>Every Asset Class,<br />On-Chain</h2>
            </div>
            <p className="font-sans text-sm text-zinc-400 max-w-xs leading-relaxed reveal reveal-delay-2">
              Real estate gets most of the attention, but six asset classes are moving on-chain, each at its own pace and for its own reasons.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-zinc-800">
            {[
              { icon: 'apartment', num: '01', title: 'Real Estate', text: 'Office towers, housing developments, and REITs split into small shares that pay out rent automatically. Real estate gets the most attention, but it is still a small slice of tokenized value. Tokens let an owner sell part of a building without selling the whole thing.', label1: 'Global Market', val1: '$393T', label2: 'Tokenized', val2: 'Early Stage', delay: 1 },
              { icon: 'account_balance', num: '02', title: 'Private Credit', text: 'The largest tokenized asset class in 2025, at 61% of total volume. Smart contracts pay out yield and adjust collateral automatically. Centrifuge alone has brought billions of dollars of private credit on-chain for institutional borrowers.', label1: 'Volume Share', val1: '61%', label2: 'Growth', val2: 'Dominant', delay: 2 },
              { icon: 'description', num: '03', title: 'Treasuries & Fixed Income', text: "Government and corporate bonds issued on-chain. BlackRock's BUIDL fund, which holds tokenized US Treasuries on Ethereum, Polygon, and Avalanche, crossed $500M in under four months. Franklin Templeton and Ondo Finance have issued billions more between them.", label1: 'Market Share', val1: '30%', label2: '2023 Growth', val2: '+641%', delay: 3 },
              { icon: 'diamond', num: '04', title: 'Commodities', text: 'Gold, silver, and carbon credits, used to hedge inflation and manage ESG obligations. Tokenized gold passed $6 billion in market cap in early 2026, letting people own a fraction of physical bullion held in fully verified custody.', label1: 'Market Share', val1: '7%', label2: 'Gold Market Cap', val2: '$5B+', delay: 1 },
              { icon: 'palette', num: '05', title: 'Art & Collectibles', text: "Expensive artworks split among thousands of owners, with the ownership history recorded on-chain where nobody can alter it. That makes provenance much harder to fake, a long-running problem in the art market. Christie's is paying attention.", label1: 'Global Market', val1: '$1.7T', label2: 'Tokenized', val2: 'Early Stage', delay: 2 },
              { icon: 'settings_input_antenna', num: '06', title: 'Infrastructure & Funds', text: 'Toll roads, data centers, and institutional funds, split into tokens so smaller investors can buy in. Funds are only 2% of tokenized volume today. The bigger long-term opportunity is the infrastructure under all of it: the ledgers, custody, and compliance systems.', label1: 'Fund Share', val1: '2%', label2: 'Trajectory', val2: 'Accelerating', delay: 3 },
            ].map((item, i) => (
              <div key={i} className={`asset-card bg-[oklch(0.187_0_0)] p-10 reveal reveal-delay-${item.delay}`}>
                <div className="flex items-start justify-between mb-6">
                  <span className="material-symbols-outlined text-[oklch(0.915_0.027_56.7)]" style={{ fontSize: '32px' }}>{item.icon}</span>
                  <span className="font-serif text-3xl text-zinc-800" style={{ fontFamily: "'Newsreader',serif" }}>{item.num}</span>
                </div>
                <h3 className="font-serif text-xl text-white mb-3" style={{ fontFamily: "'Newsreader',serif" }}>{item.title}</h3>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-6">{item.text}</p>
                <div className="flex items-end justify-between border-t border-white/10 pt-6 mt-auto">
                  <div><span className="font-sans text-[13px] text-zinc-400 block mb-1">{item.label1}</span><span className="font-sans text-sm font-bold text-zinc-300">{item.val1}</span></div>
                  <div className="text-right"><span className="font-sans text-[13px] text-zinc-400 block mb-1">{item.label2}</span><span className="font-sans text-sm font-bold text-[oklch(0.915_0.027_56.7)]">{item.val2}</span></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section id="milestones" className="py-32 bg-[oklch(0.223_0_0)] overflow-hidden">
          <div className="px-8 md:px-24 lg:px-48 mb-20">
            <h2 className="font-serif text-5xl text-white reveal" style={{ fontFamily: "'Newsreader',serif" }}>The Tokenization<br />Timeline</h2>
          </div>
          <div className="pl-8 md:pl-24 lg:pl-48 reveal">
            <div className="relative">
            <div className="timeline-progress" aria-hidden="true"><span /></div>
            <div className="timeline-track pb-8" data-lenis-prevent>
              {[
                { year: '2015', title: 'Ethereum Launches', text: 'Smart contracts make it possible, at least in theory, to tokenize real-world assets.' },
                { year: '2017', title: 'First STOs Emerge', text: 'Security Token Offerings give issuers a way to tokenize securities and equity stakes within existing securities law.' },
                { year: '2020', title: 'DeFi Summer', text: 'Decentralized Finance protocols run automated lending and yield payments at scale, showing the technology can handle real money.' },
                { year: '2022', title: 'Institutional Entry', text: "JPMorgan's Onyx runs tokenized repo trades for institutional clients, and Goldman Sachs readies its Digital Asset Platform (DAP), which goes live in early 2023. These are the first serious experiments by big banks." },
                { year: '2023-24', title: 'BlackRock Arrives', text: "BlackRock's Blockchain USD Institutional Digital Liquidity fund (BUIDL) launches in March 2024 and crosses $500M in under four months. Franklin Templeton, Ondo, and Centrifuge issue billions between them, and tokenized Treasuries pass $1 billion. The EU, UAE, and Singapore publish clear rules." },
                { year: '2025', title: 'The GENIUS Act', text: 'The US passes its first federal rules for stablecoins, easing the compliance worries that had kept the largest pools of capital on the sidelines.' },
                { year: '2026', title: 'Clarity Act Stalls', text: 'The Clarity Act, a broader federal framework for digital assets, passed the House in July 2025 but fell one vote short of advancing in the Senate in September 2026. Tokenized real-world assets reach about $39 billion on-chain.' },
                { year: '2030 ↗', title: '$2T to $16T', text: "McKinsey's base case is about $2 trillion. BCG projects up to $16 trillion, roughly 10% of global GDP. By then the line between traditional finance and DeFi may be hard to find.", accent: true },
              ].map((item, i) => (
                <div key={i} className="timeline-item" style={item.accent ? { borderTopColor: 'rgba(242,223,210,0.3)' } : {}}>
                  <span className="font-sans text-[14px] text-[oklch(0.915_0.027_56.7)] block mb-4">{item.year}</span>
                  <h3 className="font-serif text-xl text-white mb-3" style={{ fontFamily: "'Newsreader',serif" }}>{item.title}</h3>
                  <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
              <div className="min-w-32 md:min-w-48" />
            </div>
            </div>
            <div className="flex items-center gap-3 mt-4 reveal">
              <span className="material-symbols-outlined text-zinc-400 text-base">arrow_forward</span>
              <span className="font-sans text-[14px] text-zinc-400">Drag or scroll to move through the timeline</span>
            </div>
          </div>
        </section>

        {/* ── THE ARCHITECTS ── */}
        <section className="py-32 px-8 md:px-24 lg:px-48 bg-[oklch(0.187_0_0)]">
          <div className="mb-16 reveal">
            <h2 className="font-serif text-5xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>The Architects of the<br />New Master Ledger</h2>
          </div>

          <div className="mb-16 reveal">
            <div style={{ borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 24px 64px rgba(0,0,0,0.55)' }}>
              <img src="/masterledger.png" alt="The Architects of the New Master Ledger: layered infrastructure diagram" style={{ width: '100%', height: 'auto', display: 'block', filter: 'brightness(0.92) contrast(1.04)' }} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-zinc-800 max-w-4xl mx-auto mb-0.5">
            {[
              { name: 'Securitize', tag: 'Platform', text: "Has tokenized more than $4 billion in assets and reached a $1.25 billion valuation through a SPAC merger. It handles issuance and compliance for BlackRock's BUIDL fund.", footer: '$4B+ tokenized', delay: 1 },
              { name: 'tZERO', tag: 'ATS', text: "Runs a FINRA-approved Alternative Trading System for corporate debt, a regulated market where tokenized securities can be resold after they're issued.", delay: 2 },
            ].map((item, i) => (
              <div key={i} className={`arch-card bg-[oklch(0.187_0_0)] p-10 hover:bg-[oklch(0.223_0_0)] cursor-default reveal reveal-delay-${item.delay}`}>
                <div className="flex items-start justify-between mb-6">
                  <span className="font-sans font-bold text-[14px] text-zinc-400">{item.name}</span>
                  <span className="font-sans text-[14px] text-[oklch(0.915_0.027_56.7)]">{item.tag}</span>
                </div>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                {item.footer && <div className="mt-6 border-t border-white/10 pt-4"><span className="font-sans text-[14px] text-zinc-400">{item.footer}</span></div>}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-zinc-800 max-w-4xl mx-auto">
            {[
              { name: 'Ondo Finance & Franklin Templeton', tag: 'Treasuries', text: 'Early issuers of tokenized US Treasuries. Between them they have issued billions in yield-bearing tokens that investors anywhere can hold, settle the same day, and use inside DeFi protocols.', delay: 1 },
              { name: 'Centrifuge', tag: 'Private Credit', text: 'Brings real-world private credit on-chain. Lenders holding trade receivables, mortgages, or microfinance loans can tokenize them and borrow against them from DeFi liquidity pools.', delay: 2 },
            ].map((item, i) => (
              <div key={i} className={`arch-card bg-[oklch(0.187_0_0)] p-10 hover:bg-[oklch(0.223_0_0)] cursor-default reveal reveal-delay-${item.delay}`}>
                <div className="flex items-start justify-between mb-6">
                  <span className="font-sans font-bold text-[14px] text-zinc-400">{item.name}</span>
                  <span className="font-sans text-[14px] text-[oklch(0.915_0.027_56.7)]">{item.tag}</span>
                </div>
                <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PULL QUOTE 02 ── */}
        <section className="py-48 bg-[oklch(0.187_0_0)] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(242,223,210,0.04) 0%, transparent 70%)' }} />
          <div className="max-w-5xl mx-auto px-8 text-center">
            <div className="reveal">
              <div className="quote-line" />
              <blockquote className="font-serif text-4xl md:text-6xl text-white leading-tight mb-12" style={{ fontFamily: "'Newsreader',serif" }}>
                Tokenization keeps the financial system we have and <span className="text-[oklch(0.915_0.027_56.7)]">rebuilds it</span> on programmable infrastructure.
              </blockquote>
            </div>
          </div>
        </section>

        {/* ── ROAD AHEAD ── */}
        <section id="road-ahead" className="py-32 px-8 md:px-24 lg:px-48 bg-[oklch(0.164_0_0)]">
          <div className="mb-24 reveal">
            <h2 className="font-serif text-5xl text-white" style={{ fontFamily: "'Newsreader',serif" }}>The Road Ahead</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Friction Points */}
            <div className="reveal" data-inview>
              <h3 className="font-serif text-2xl text-white mb-10 pb-6 border-b border-white/10" style={{ fontFamily: "'Newsreader',serif" }}>What's Still in the Way</h3>
              <p className="font-sans text-[14px] text-zinc-500 mb-10">Percentages: share of 300 financial institutions naming each risk in Broadridge's 2025 Tokenization Survey</p>
              {[
                { label: 'Regulatory Uncertainty', pct: '73%', width: '73%', text: 'Unclear or insufficient regulation is the barrier institutions name most often. A tokenized bond that is legal in Singapore may be illegal to sell in Germany, and until countries line up their rules, room for regulatory arbitrage and systemic risk both keep growing.' },
                { label: 'Technology & Cybersecurity Risk', pct: '54%', width: '54%', text: 'Code has bugs, and bugs get exploited. If a contract managing $200M of tokenized real estate is hacked, the losses land on people who own pieces of real buildings.' },
                { label: 'Legacy System Integration', text: "Connecting decades-old back-office systems to blockchain ledgers is hard technical work. It won't happen overnight, and building the bridge costs a lot." },
                { label: 'Thin Secondary Trading', text: "Many projects never get past the pilot stage. In RWA.xyz data, 56% of tokenized asset value saw no transfers at all in a given week. It's a cold-start problem: issuers won't tokenize without buyers, and buyers won't show up without trading volume." },
              ].map((item, i) => (
                <div key={i} className={`${item.width ? 'friction-row' : ''} ${i < 3 ? 'mb-10' : ''}`}>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-sans text-sm font-bold text-zinc-300">{item.label}</h4>
                    {item.pct && <span className="font-serif text-xl text-white tabular-nums" style={{ fontFamily: "'Newsreader',serif" }} data-target={parseInt(item.pct)} data-suffix="%">{item.pct}</span>}
                  </div>
                  <div className="h-px bg-zinc-800 mb-3">
                    {item.width && <div className="friction-bar-fill" data-width={item.width} />}
                  </div>
                  <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            {/* Catalysts */}
            <div className="reveal">
              <h3 className="font-serif text-2xl text-white mb-10 pb-6 border-b border-white/10" style={{ fontFamily: "'Newsreader',serif" }}>What's Pushing It Forward</h3>
              <div className="space-y-10">
                {[
                  { label: 'Legislative Clarity', text: 'The GENIUS Act (2025) gave the US clear rules for stablecoins, which removes one of the main reasons large institutions stayed out. The Clarity Act would do the same for the rest of the market, but it stalled in the Senate in September 2026.' },
                  { label: 'Cross-Network Interoperability', text: 'Swift is testing transfers between blockchains with Chainlink and banks including BNY Mellon and Citi. Separate blockchains only add up to one market once something connects them.' },
                  { label: 'Settlement Infrastructure', text: 'With ISO-20022, bank messaging systems and blockchains can exchange messages directly, which connects tokenized markets to the trillions of dollars in daily payments that run over SWIFT.' },
                  { label: 'The $20B Savings Argument', text: 'A GFMA and BCG study estimates that distributed ledgers could save about $20 billion a year in global clearing and settlement costs. Savings that large are hard to treat as an experiment, and banks that wait will be stuck with higher costs than the ones that move.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="font-sans text-zinc-400 text-lg leading-none mt-1 flex-shrink-0">+</span>
                    <div>
                      <h4 className="font-sans text-sm font-bold text-zinc-300 mb-2">{item.label}</h4>
                      <p className="font-sans text-sm text-zinc-400 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editorial Closing */}
          <div className="mt-32 pt-16 border-t border-white/10 reveal">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-12">
                <p className="font-serif text-2xl text-zinc-300 leading-relaxed text-center" style={{ fontFamily: "'Newsreader',serif" }}>
                  Paper-heavy, siloed systems are on their way out. I think the institutions that do well over the next decade will be the ones that build compliance in from the start and make their assets work across networks, so capital moves about as easily as data. The infrastructure scales now, stablecoins finally have US rules, and the big incumbents are putting real money in. The rest of the legislation is still stuck, but I don't have much doubt that this happens. What I'm less sure of is who builds the infrastructure, because whoever does gets to decide <em>who benefits</em>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOURCES ── */}
        <section id="sources" className="py-24 px-8 md:px-24 lg:px-48 bg-[oklch(0.164_0_0)] border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-2">
              <span className="font-sans text-[14px] text-zinc-500">Sources</span>
            </div>
            <ol className="lg:col-span-10 list-decimal pl-5 space-y-3 font-sans text-sm text-zinc-400 leading-relaxed [&_a]:text-zinc-300 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-white">
              {[
                { pre: 'McKinsey, ', link: 'From ripples to waves: The transformational power of tokenizing assets', href: 'https://www.mckinsey.com/industries/financial-services/our-insights/from-ripples-to-waves-the-transformational-power-of-tokenizing-assets', post: ' (June 2024). Base case of about $2 trillion by 2030.' },
                { pre: 'BCG and ADDX, 2022 tokenization report, via ', link: 'Fintech News Singapore', href: 'https://fintechnews.sg/63994/blockchain/bcg-and-addx-project-asset-tokenisation-to-grow-into-us16-trillion-opportunity-by-2030/', post: '. $16 trillion by 2030, about 10% of global GDP.' },
                { pre: 'RWA.xyz, ', link: 'tokenized asset dashboard', href: 'https://app.rwa.xyz', post: '. About $39 billion on-chain, not counting stablecoins (November 2026), and the 2025 split by asset class.' },
                { pre: 'Mid-2025 RWA figures, ', link: 'Cointelegraph', href: 'https://cointelegraph.com/news/private-credit-powers-24b-tokenization-market-ethereum-still-dominates-redstone', post: '.' },
                { pre: 'Stobox, ', link: 'The RWA liquidity gap', href: 'https://www.stobox.io/blog/tokenization-intelligence-rwa-liquidity-gap', post: ', using RWA.xyz data. 56% of tokenized value with no weekly transfers.' },
                { pre: 'Broadridge, ', link: 'Next-gen markets: The rise and reality of tokenization', href: 'https://www.broadridge.com/_assets/pdf/next-gen-markets-the-rise-and-reality-of-tokenization.pdf', post: ' (2025 Tokenization Survey, 300 institutions). Regulatory uncertainty 73%, technology and cybersecurity risk 54%.' },
                { pre: 'Larry Fink at the 2022 DealBook Summit, via ', link: 'Kitco', href: 'https://www.kitco.com/news/article/2022-12-01/tokenization-securities-will-be-next-evolution-markets-blackrock-ceo', post: '.' },
                { pre: 'BlackRock BUIDL passes $500 million, ', link: 'CoinDesk', href: 'https://dev.coindesk.com/it/business/2024/07/08/blackrocks-buidl-fund-tops-500m-as-tokenized-treasury-market-soars', post: ' (July 2024).' },
                { pre: 'Tokenized Treasuries grew 641% in 2023, CoinGecko via ', link: 'Cointelegraph', href: 'https://cointelegraph.com/news/tokenized-us-treasuries-845-market-cap-2023-coingecko', post: '.' },
                { pre: 'Securitize SPAC deal at a $1.25 billion valuation, ', link: 'The Block', href: 'https://www.theblock.co/post/376583/tokenization-giant-securitize-to-go-public-via-1-25-billion-spac-deal', post: ' (October 2025).' },
                { pre: 'Tokenized gold passes $6 billion, ', link: 'Tokenizer.estate', href: 'https://news.tokenizer.estate/tokenized-gold-hits-6b-as-us-iran-crisis-fuels-on-chain-safe-haven-demand', post: ' (2026).' },
                { pre: 'Savills, ', link: 'The total value of global real estate', href: 'https://impacts.savills.com/market-trends/the-total-value-of-global-real-estate.html', post: '. $393.3 trillion at the end of 2024.' },
                { pre: 'GFMA and BCG on $20 billion in annual clearing and settlement savings, via ', link: 'Blockworks', href: 'https://blockworks.co/news/tokenized-distributed-ledgers-gfma', post: '.' },
                { pre: 'Clarity Act status after the September 2026 Senate vote, ', link: 'Triple-A', href: 'https://www.triple-a.io/blog/clarity-act', post: '.' },
              ].map((s, i) => (
                <li key={i}>{s.pre}<a href={s.href} target="_blank" rel="noopener noreferrer">{s.link}</a>{s.post}</li>
              ))}
            </ol>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/10 bg-[oklch(0.164_0_0)] text-zinc-400 font-sans text-[15px]">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-10 flex flex-col sm:flex-row sm:justify-between gap-4">
          <Link to="/portfolio" className="text-zinc-200 underline underline-offset-4 hover:text-white">Back to the portfolio</Link>
          <span>© 2026 Mohamad Noor-Chowdhury</span>
        </div>
      </footer>
      <BackToTop ground="#f2dfd2" ink="#131313" />

    </div>
    </>
  );
}

