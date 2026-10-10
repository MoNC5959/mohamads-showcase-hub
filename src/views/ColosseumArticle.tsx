import { useEffect } from 'react';
import './colosseum.css';

export default function ColosseumArticle() {
  useEffect(() => {
    /* ══════════════════════════════════════════════════════
       PROGRESS BAR
    ══════════════════════════════════════════════════════ */
    const progressEl = document.getElementById('col-progress');
    const scrollHandler = () => {
      const p = window.scrollY / (document.documentElement.scrollHeight - innerHeight);
      if (progressEl) progressEl.style.width = Math.min(p * 100, 100) + '%';
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    /* ══════════════════════════════════════════════════════
       SCROLL REVEAL
    ══════════════════════════════════════════════════════ */
    const revObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('up'); revObs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.colosseum-article .reveal, .colosseum-article .reveal-l, .colosseum-article .reveal-r').forEach(el => revObs.observe(el));

    /* ══════════════════════════════════════════════════════
       SIDE NAV ACTIVE
    ══════════════════════════════════════════════════════ */
    const sections = document.querySelectorAll('.colosseum-article section[id]');
    const dots = document.querySelectorAll('.colosseum-article .side-dot');
    const sNavObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          dots.forEach(d => d.classList.remove('active'));
          const hit = document.querySelector(`.colosseum-article .side-dot[data-s="${e.target.id}"]`);
          if (hit) hit.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => sNavObs.observe(s));

    /* ══════════════════════════════════════════════════════
       ANIMATED COUNTERS (hero stats)
    ══════════════════════════════════════════════════════ */
    function animateCounter(el: Element) {
      const dataset = (el as HTMLElement).dataset;
      const target = parseFloat(dataset.count || dataset.countBig || '0');
      const prefix = dataset.prefix || '';
      const suffix = dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      function tick(now: number) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = ease * target;
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const dataset = (e.target as HTMLElement).dataset;
        if (e.isIntersecting && (dataset.count || dataset.countBig)) {
          animateCounter(e.target); counterObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.colosseum-article [data-count], .colosseum-article [data-count-big]').forEach(el => counterObs.observe(el));

    /* ══════════════════════════════════════════════════════
       STAT BARS
    ══════════════════════════════════════════════════════ */
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.bar-fill').forEach((f: Element) => {
            const fill = f as HTMLElement;
            if (fill.dataset.w) fill.style.width = fill.dataset.w + '%';
          });
          barObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    const dataBars = document.getElementById('data-bars');
    if (dataBars) barObs.observe(dataBars);

    /* ══════════════════════════════════════════════════════
       HERO CANVAS: PARTICLE NETWORK
    ══════════════════════════════════════════════════════ */
    let particleRafId: number | null = null;
    let resizeHandler1: () => void;
    (function() {
      const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      let W: number, H: number;
      interface Particle { x: number; y: number; vx: number; vy: number; r: number; a: number; }
      let particles: Particle[];

      function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
      }
      resizeHandler1 = resize;
      resize();
      window.addEventListener('resize', resizeHandler1, { passive: true });

      const COUNT = 60;
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.5,
        a: Math.random() * 0.5 + 0.1,
      }));

      function draw() {
        ctx.clearRect(0, 0, W, H);

        const grad = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, H * 0.6);
        grad.addColorStop(0, 'rgba(0,200,255,0.04)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(0,200,255,${0.04 * (1 - dist / 140)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }

        particles.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,200,255,${p.a})`;
          ctx.fill();
        });

        particleRafId = requestAnimationFrame(draw);
      }
      draw();
    })();

    /* ══════════════════════════════════════════════════════
       S-CURVE CHART
    ══════════════════════════════════════════════════════ */
    let resizeHandler2: () => void;
    (function() {
      const canvas = document.getElementById('scurve') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const years      = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025];
      const streaming  = [8, 12, 18, 26, 36, 55, 67, 76, 84, 90, 95];
      const traditional= [95, 90, 84, 78, 70, 60, 52, 46, 40, 36, 32];

      function drawChart() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width  = rect.width  * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const W = rect.width, H = rect.height;
        const pL = 40, pR = 20, pT = 20, pB = 36;
        const cW = W - pL - pR, cH = H - pT - pB;
        const xP = (i: number) => pL + (i / (years.length - 1)) * cW;
        const yP = (v: number) => pT + cH - (v / 100) * cH;

        ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
        [0,25,50,75,100].forEach(v => {
          const y = yP(v);
          ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(W - pR, y); ctx.stroke();
        });

        const cx = xP(5);
        ctx.fillStyle = 'rgba(0,200,255,0.04)';
        ctx.fillRect(cx - 16, pT, 32, cH);
        ctx.strokeStyle = 'rgba(0,200,255,0.2)';
        ctx.setLineDash([3,5]); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx, pT); ctx.lineTo(cx, pT + cH); ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(106,143,171,0.6)';
        ctx.font = `11px Inter, sans-serif`;
        ctx.textAlign = 'center';
        years.forEach((y, i) => { if (i % 2 === 0 || i === years.length - 1) ctx.fillText(String(y), xP(i), H - 8); });

        ctx.strokeStyle = 'rgba(58,85,112,0.8)'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        traditional.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
        ctx.stroke();

        ([[4,'rgba(0,200,255,0.08)'],[2,'rgba(0,200,255,0.2)'],[1.5,'rgba(0,200,255,0.9)']] as [number,string][]).forEach(([lw, color]) => {
          ctx.strokeStyle = color; ctx.lineWidth = lw;
          ctx.beginPath();
          streaming.forEach((v, i) => i === 0 ? ctx.moveTo(xP(i), yP(v)) : ctx.lineTo(xP(i), yP(v)));
          ctx.stroke();
        });

        ctx.fillStyle = 'rgba(0,200,255,0.2)'; ctx.strokeStyle = 'rgba(0,200,255,0.9)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(cx, yP(55), 5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,200,255,0.3)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, yP(55), 9, 0, Math.PI * 2); ctx.stroke();

        ctx.font = 'italic 11px Newsreader, serif'; ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(0,200,255,0.7)'; ctx.fillText('Streaming', xP(10) + 6, yP(95) + 4);
        ctx.fillStyle = 'rgba(58,85,112,0.9)'; ctx.fillText('Linear TV', xP(10) + 6, yP(32) + 4);
      }

      const chartObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { drawChart(); chartObs.disconnect(); }
      }, { threshold: 0.3 });
      chartObs.observe(canvas);

      resizeHandler2 = () => { if (canvas.width > 0) drawChart(); };
      window.addEventListener('resize', resizeHandler2);
    })();

    /* ══════════════════════════════════════════════════════
       ERA TRACK: DRAG + WHEEL
    ══════════════════════════════════════════════════════ */
    let eraMouseDownHandler: (e: MouseEvent) => void;
    let eraMouseLeaveHandler: () => void;
    let eraMouseUpHandler: () => void;
    let eraMouseMoveHandler: (e: MouseEvent) => void;
    let eraWheelHandler: (e: WheelEvent) => void;
    const track = document.querySelector('.colosseum-article .era-track') as HTMLElement | null;
    if (track) {
      let down = false, startX = 0, scrollLeft = 0;
      eraMouseDownHandler = (e: MouseEvent) => { down = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; };
      eraMouseLeaveHandler = () => { down = false; };
      eraMouseUpHandler = () => { down = false; };
      eraMouseMoveHandler = (e: MouseEvent) => { if (!down) return; e.preventDefault(); track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX); };
      eraWheelHandler = (e: WheelEvent) => { e.preventDefault(); track.scrollLeft += e.deltaY * 0.8; };
      track.addEventListener('mousedown', eraMouseDownHandler);
      track.addEventListener('mouseleave', eraMouseLeaveHandler);
      track.addEventListener('mouseup', eraMouseUpHandler);
      track.addEventListener('mousemove', eraMouseMoveHandler);
      track.addEventListener('wheel', eraWheelHandler, { passive: false });
    }

    /* ══════════════════════════════════════════════════════
       COLOSSEUM → CLOUD LINE-ART ANIMATION
    ══════════════════════════════════════════════════════ */
    let morphRafId: number | null = null;
    let resizeHandler3: () => void;
    (function() {
      const canvas = document.getElementById('morph-canvas') as HTMLCanvasElement | null;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;

      let W: number, H: number, dpr: number;
      let startTime: number | null = null;

      const PH = [0, 2600, 4000, 6600];
      const PH_DUR = [2600, 1400, 2600, 1400];
      const TOTAL = 8000;

      function eio(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

      function drawColosseum(alpha: number, scale: number) {
        const cx = W * 0.5, cy = H * 0.5;
        const w = Math.min(W * 0.86, 370) * scale;
        const h = Math.min(H * 0.74, 280) * scale;
        const left = cx - w/2, right = cx + w/2;
        const top  = cy - h/2, bot   = cy + h/2;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#00c8ff';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const stroke = (fn: () => void, lw = 1.2) => {
          ctx.lineWidth = lw;
          ctx.beginPath(); fn(); ctx.stroke();
        };

        stroke(() => {
          ctx.moveTo(left, bot);
          ctx.lineTo(left, top + h * 0.17);
          ctx.bezierCurveTo(
            left + w * 0.08, top,
            right - w * 0.08, top,
            right, top + h * 0.17
          );
          ctx.lineTo(right, bot);
        }, 1.5);

        stroke(() => {
          ctx.moveTo(left  - w*0.015, bot);
          ctx.lineTo(right + w*0.015, bot);
        }, 1.5);

        for (let i = 0; i < 4; i++) {
          const y  = bot  - h * (i * 0.228);
          const rw = w * (0.92 - i * 0.015);
          stroke(() => {
            ctx.moveTo(cx - rw/2, y);
            ctx.lineTo(cx + rw/2, y);
          }, i === 3 ? 1.0 : 0.9);
        }

        const nArches = 6;
        for (let row = 0; row < 3; row++) {
          const rBot = bot  - h * (row * 0.228);
          const rTop = rBot - h * 0.195;
          const rW   = w   * (0.88 - row * 0.015);
          const aW   = rW  / nArches;
          const rL   = cx  - rW / 2;

          for (let a = 0; a < nArches; a++) {
            const ax = rL + a * aW + aW * 0.5;
            const iw = aW * 0.50;
            const archCY = rTop + iw * 0.5;

            stroke(() => {
              ctx.moveTo(ax - iw/2, rBot);
              ctx.lineTo(ax - iw/2, archCY);
              ctx.arc(ax, archCY, iw/2, Math.PI, 0, false);
              ctx.lineTo(ax + iw/2, rBot);
            }, 0.85);
          }
        }

        const atticBot = bot - h * 0.228 * 3;
        const atticTop = atticBot - h * 0.085;
        const atticW   = w * 0.84;
        const nAttic   = 7;
        const awW      = atticW / nAttic;
        for (let a = 0; a < nAttic; a++) {
          const ax = (cx - atticW/2) + a * awW + awW/2;
          const ww = awW * 0.38, wh = atticBot - atticTop - h*0.01;
          stroke(() => { ctx.rect(ax - ww/2, atticTop, ww, wh); }, 0.75);
        }

        ctx.restore();
      }

      function drawCloud(alpha: number, scale: number) {
        const cx = W * 0.5, cy = H * 0.49;
        const s  = Math.min(W * 0.24, H * 0.24, 92) * scale;

        ctx.save();
        ctx.globalAlpha = alpha;

        function cloudPath() {
          ctx.beginPath();
          ctx.moveTo(cx - s, cy + s * 0.5);

          ctx.bezierCurveTo(
            cx - s*1.30, cy + s*0.50,
            cx - s*1.30, cy - s*0.10,
            cx - s*0.85, cy - s*0.10
          );
          ctx.bezierCurveTo(
            cx - s*0.85, cy - s*0.88,
            cx - s*0.05, cy - s*0.88,
            cx,          cy - s*0.42
          );
          ctx.bezierCurveTo(
            cx,          cy - s*0.92,
            cx + s*0.85, cy - s*0.92,
            cx + s*0.85, cy - s*0.10
          );
          ctx.bezierCurveTo(
            cx + s*1.30, cy - s*0.10,
            cx + s*1.30, cy + s*0.50,
            cx + s,      cy + s*0.50
          );
          ctx.lineTo(cx - s, cy + s*0.50);
          ctx.closePath();
        }

        cloudPath();
        ctx.fillStyle = 'rgba(0,200,255,0.05)';
        ctx.fill();

        cloudPath();
        ctx.shadowColor = 'rgba(0,200,255,0.45)';
        ctx.shadowBlur  = 10;
        ctx.strokeStyle = 'rgba(0,200,255,0.25)';
        ctx.lineWidth   = 4;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';
        ctx.stroke();

        ctx.shadowBlur  = 0;
        cloudPath();
        ctx.strokeStyle = '#00c8ff';
        ctx.lineWidth   = 1.6;
        ctx.stroke();

        ctx.globalAlpha = alpha * 0.18;
        ctx.strokeStyle = '#00c8ff';
        ctx.lineWidth   = 1.0;
        ctx.beginPath();
        ctx.bezierCurveTo(
          cx - s*0.35, cy - s*0.55,
          cx + s*0.35, cy - s*0.55,
          cx + s*0.55, cy - s*0.05
        );
        ctx.moveTo(cx - s*0.55, cy - s*0.05);
        ctx.bezierCurveTo(
          cx - s*0.35, cy - s*0.55,
          cx + s*0.35, cy - s*0.55,
          cx + s*0.55, cy - s*0.05
        );
        ctx.stroke();

        ctx.restore();
      }

      function draw(ts: number) {
        if (!startTime) startTime = ts;
        const elapsed = (ts - startTime) % TOTAL;
        ctx.clearRect(0, 0, W, H);

        let phase = 0;
        for (let i = PH.length - 1; i >= 0; i--) {
          if (elapsed >= PH[i]) { phase = i; break; }
        }
        const phT = (elapsed - PH[phase]) / PH_DUR[phase];
        const et  = eio(phT);

        let colA = 0, cloudA = 0, colS = 1, cloudS = 1;

        if (phase === 0) {
          colA = 0.82; colS = 1;
        } else if (phase === 1) {
          colA   = (1 - et) * 0.82; colS   = 1 + et * 0.04;
          cloudA = et * 0.82;       cloudS = 0.96 + et * 0.04;
        } else if (phase === 2) {
          cloudA = 0.82; cloudS = 1;
        } else {
          cloudA = (1 - et) * 0.82; cloudS = 1 + et * 0.04;
          colA   = et * 0.82;       colS   = 0.96 + et * 0.04;
        }

        if (colA   > 0.01) drawColosseum(colA,   colS);
        if (cloudA > 0.01) drawCloud    (cloudA, cloudS);

        morphRafId = requestAnimationFrame(draw);
      }

      function resize() {
        dpr = window.devicePixelRatio || 1;
        W   = canvas.offsetWidth;
        H   = canvas.offsetHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
      }

      resize();
      startTime = null;
      resizeHandler3 = () => { resize(); startTime = null; };
      window.addEventListener('resize', resizeHandler3, { passive: true });
      morphRafId = requestAnimationFrame(draw);
    })();

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      if (resizeHandler1) window.removeEventListener('resize', resizeHandler1);
      if (resizeHandler2) window.removeEventListener('resize', resizeHandler2);
      if (resizeHandler3) window.removeEventListener('resize', resizeHandler3);
      revObs.disconnect();
      sNavObs.disconnect();
      counterObs.disconnect();
      barObs.disconnect();
      if (particleRafId !== null) cancelAnimationFrame(particleRafId);
      if (morphRafId !== null) cancelAnimationFrame(morphRafId);
      if (track) {
        if (eraMouseDownHandler) track.removeEventListener('mousedown', eraMouseDownHandler);
        if (eraMouseLeaveHandler) track.removeEventListener('mouseleave', eraMouseLeaveHandler);
        if (eraMouseUpHandler) track.removeEventListener('mouseup', eraMouseUpHandler);
        if (eraMouseMoveHandler) track.removeEventListener('mousemove', eraMouseMoveHandler);
        if (eraWheelHandler) track.removeEventListener('wheel', eraWheelHandler);
      }
    };
  }, []);

  return (
    <div className="colosseum-article">
      {/* Progress bar */}
      <div id="col-progress"></div>

      {/* Nav */}
      <nav className="col-nav">
        <a href="/" className="nav-logo font-sans text-lg" style={{textDecoration:'none',color:'inherit',cursor:'pointer'}}>MOHAMAD NOOR CHOWDHURY</a>
        <ul className="nav-links">
          <li><a href="#access">Access</a></li>
          <li><a href="#power">Power Play</a></li>
          <li><a href="#amazon">Deals</a></li>
          <li><a href="#victim">The Victim</a></li>
          <li><a href="#reckoning">Reckoning</a></li>
        </ul>
        <span className="nav-tag">Sports Media</span>
      </nav>

      {/* Side nav dots */}
      <nav className="side-nav" aria-label="Section navigation">
        <a href="#hero"      className="side-dot" data-s="hero"      title="Introduction"></a>
        <a href="#access"    className="side-dot" data-s="access"    title="The Era Timeline"></a>
        <a href="#power"     className="side-dot" data-s="power"     title="Power Play"></a>
        <a href="#covid"     className="side-dot" data-s="covid"     title="COVID Accelerator"></a>
        <a href="#amazon"    className="side-dot" data-s="amazon"    title="Amazon Blueprint"></a>
        <a href="#data"      className="side-dot" data-s="data"      title="Data Payoff"></a>
        <a href="#domino"    className="side-dot" data-s="domino"    title="Domino Effect"></a>
        <a href="#victim"    className="side-dot" data-s="victim"    title="The Victim"></a>
        <a href="#reckoning" className="side-dot" data-s="reckoning" title="Reckoning"></a>
      </nav>

      <main>

        {/* ═══════════════════════════════════════ HERO */}
        <section id="hero">
          <canvas id="hero-canvas" aria-hidden="true"></canvas>
          <canvas id="morph-canvas" aria-hidden="true"></canvas>
          <div className="hero-inner">
            <div className="hero-kicker reveal d1">
              <span className="hero-kicker-dot"></span>
              <span style={{fontSize:'0.72rem',letterSpacing:'0.25em',textTransform:'uppercase',color:'var(--text-dim)'}}>Long Read · Sports &amp; Media</span>
            </div>

            <h1 className="hero-title reveal d2">
              From the<br/>
              <em>Colosseum</em><br/>
              to the Cloud
            </h1>

            <p className="hero-sub reveal d3">
              How leagues and streaming giants built a lucrative partnership, and left the fan holding the bill. A reckoning two millennia in the making.
            </p>

            <div className="hero-stats reveal d4">
              <div className="hero-stat">
                <span className="hero-stat-num" data-count="110" data-prefix="$" data-suffix="B+">$0B+</span>
                <span className="hero-stat-label">Total streaming sports rights deals</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num" data-count="70" data-suffix="%">0%</span>
                <span className="hero-stat-label">18–44 yr-olds on streaming</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num" data-count="137" data-prefix="$">$0</span>
                <span className="hero-stat-label">Fan's monthly sports bill</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num" data-count="60" data-suffix="%">0%</span>
                <span className="hero-stat-label">Subscribe then cancel</span>
              </div>
            </div>
          </div>

          <div className="hero-scroll-cue" aria-hidden="true">
            <div className="scroll-line"></div>
            <span className="scroll-label">Scroll</span>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ ERA TIMELINE */}
        <section id="access">
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">Chapter I</span>
            </div>
            <h2 className="h-section section-title reveal d1">
              The Unstoppable<br/>
              <span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>March of Access</span>
            </h2>
            <p className="section-lead reveal d2">Sport has always been inseparable from the dominant medium of its era. Each technological revolution broadened reach and inflated the prize.</p>

            <div className="era-track reveal d3">
              <div className="era-card">
                <div className="era-num">I</div>
                {/* Colosseum */}
                <svg viewBox="0 0 120 72" xmlns="http://www.w3.org/2000/svg" style={{width:'120px',height:'72px',display:'block',marginBottom:'1.25rem'}}>
                  <rect x="4" y="28" width="112" height="40" rx="1" fill="none" stroke="#006b8a" strokeWidth="1"/>
                  <path d="M4,28 Q60,2 116,28" fill="none" stroke="#00c8ff" strokeWidth="1.2"/>
                  <path d="M14,68 L14,44 Q20,36 26,44 L26,68" fill="rgba(0,200,255,0.06)" stroke="#006b8a" strokeWidth="0.8"/>
                  <path d="M32,68 L32,44 Q38,36 44,44 L44,68" fill="rgba(0,200,255,0.06)" stroke="#006b8a" strokeWidth="0.8"/>
                  <path d="M50,68 L50,44 Q56,36 62,44 L62,68" fill="rgba(0,200,255,0.08)" stroke="#00c8ff" strokeWidth="0.8"/>
                  <path d="M68,68 L68,44 Q74,36 80,44 L80,68" fill="rgba(0,200,255,0.06)" stroke="#006b8a" strokeWidth="0.8"/>
                  <path d="M86,68 L86,44 Q92,36 98,44 L98,68" fill="rgba(0,200,255,0.06)" stroke="#006b8a" strokeWidth="0.8"/>
                  <path d="M20,44 L20,30 Q26,24 32,30 L32,44" fill="none" stroke="#006b8a" strokeWidth="0.6" strokeDasharray="2,2"/>
                  <path d="M44,44 L44,30 Q50,24 56,30 L56,44" fill="none" stroke="#006b8a" strokeWidth="0.6" strokeDasharray="2,2"/>
                  <path d="M62,44 L62,30 Q68,24 74,30 L74,44" fill="none" stroke="#00c8ff" strokeWidth="0.7" strokeDasharray="2,2"/>
                  <path d="M80,44 L80,30 Q86,24 92,30 L92,44" fill="none" stroke="#006b8a" strokeWidth="0.6" strokeDasharray="2,2"/>
                  <line x1="4" y1="68" x2="116" y2="68" stroke="#006b8a" strokeWidth="0.5"/>
                </svg>
                <div className="era-title">The Arena</div>
                <div className="era-tag">Physical Presence</div>
                <p className="era-desc">The Colosseum held 80,000. Access was physical, hierarchical, and local. Your seat was social currency.</p>
              </div>
              <div className="era-card">
                <div className="era-num">II</div>
                {/* Radio with sound waves */}
                <svg viewBox="0 0 120 72" xmlns="http://www.w3.org/2000/svg" style={{width:'120px',height:'72px',display:'block',marginBottom:'1.25rem'}}>
                  <rect x="28" y="26" width="44" height="34" rx="3" fill="rgba(0,200,255,0.05)" stroke="#006b8a" strokeWidth="1"/>
                  <circle cx="43" cy="43" r="8" fill="none" stroke="#006b8a" strokeWidth="0.8"/>
                  <circle cx="43" cy="43" r="4" fill="none" stroke="#006b8a" strokeWidth="0.6"/>
                  <circle cx="43" cy="43" r="1.5" fill="#006b8a"/>
                  <rect x="56" y="38" width="10" height="6" rx="1" fill="none" stroke="#006b8a" strokeWidth="0.7"/>
                  <line x1="61" y1="38" x2="61" y2="41" stroke="#00c8ff" strokeWidth="1"/>
                  <line x1="60" y1="26" x2="54" y2="10" stroke="#006b8a" strokeWidth="1" strokeLinecap="round"/>
                  <path d="M78,36 Q85,43 78,50" fill="none" stroke="#00c8ff" strokeWidth="1.2" strokeLinecap="round" opacity="0.9"/>
                  <path d="M84,30 Q96,43 84,56" fill="none" stroke="#00c8ff" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
                  <path d="M90,24 Q107,43 90,62" fill="none" stroke="#00c8ff" strokeWidth="0.8" strokeLinecap="round" opacity="0.35"/>
                </svg>
                <div className="era-title">Radio</div>
                <div className="era-tag">Audio Access · 1920s</div>
                <p className="era-desc">Radio broke geography. Millions heard the fight simultaneously. Attention became the commodity.</p>
              </div>
              <div className="era-card">
                <div className="era-num">III</div>
                {/* Television */}
                <svg viewBox="0 0 120 72" xmlns="http://www.w3.org/2000/svg" style={{width:'120px',height:'72px',display:'block',marginBottom:'1.25rem'}}>
                  <rect x="14" y="10" width="82" height="52" rx="4" fill="rgba(0,200,255,0.05)" stroke="#006b8a" strokeWidth="1"/>
                  <rect x="22" y="17" width="66" height="38" rx="2" fill="rgba(0,200,255,0.08)" stroke="#00c8ff" strokeWidth="0.8"/>
                  <line x1="30" y1="28" x2="60" y2="28" stroke="#00c8ff" strokeWidth="0.7" opacity="0.5"/>
                  <line x1="30" y1="33" x2="54" y2="33" stroke="#006b8a" strokeWidth="0.7" opacity="0.5"/>
                  <line x1="30" y1="38" x2="58" y2="38" stroke="#006b8a" strokeWidth="0.7" opacity="0.5"/>
                  <polygon points="66,27 66,45 80,36" fill="rgba(0,200,255,0.2)" stroke="#00c8ff" strokeWidth="0.8"/>
                  <line x1="40" y1="62" x2="36" y2="70" stroke="#006b8a" strokeWidth="1.2" strokeLinecap="round"/>
                  <line x1="70" y1="62" x2="74" y2="70" stroke="#006b8a" strokeWidth="1.2" strokeLinecap="round"/>
                  <line x1="44" y1="10" x2="36" y2="2" stroke="#006b8a" strokeWidth="1" strokeLinecap="round"/>
                  <line x1="66" y1="10" x2="74" y2="2" stroke="#006b8a" strokeWidth="1" strokeLinecap="round"/>
                </svg>
                <div className="era-title">Television</div>
                <div className="era-tag">Visual Access · 1950s</div>
                <p className="era-desc">TV made sport spectacular at home. Rights deals ballooned. The Super Bowl became the most-watched event on Earth.</p>
              </div>
              <div className="era-card">
                <div className="era-num">IV</div>
                {/* Streaming / screen + signal */}
                <svg viewBox="0 0 120 72" xmlns="http://www.w3.org/2000/svg" style={{width:'120px',height:'72px',display:'block',marginBottom:'1.25rem'}}>
                  <rect x="22" y="14" width="60" height="40" rx="3" fill="rgba(0,200,255,0.06)" stroke="#006b8a" strokeWidth="1"/>
                  <rect x="28" y="19" width="48" height="30" rx="1.5" fill="rgba(0,200,255,0.1)" stroke="#00c8ff" strokeWidth="0.7"/>
                  <polygon points="46,28 46,40 58,34" fill="#00c8ff" opacity="0.85"/>
                  <path d="M90,18 Q100,28 90,38" fill="none" stroke="#00c8ff" strokeWidth="1.1" strokeLinecap="round" opacity="0.9"/>
                  <path d="M95,12 Q110,28 95,44" fill="none" stroke="#00c8ff" strokeWidth="0.9" strokeLinecap="round" opacity="0.55"/>
                  <path d="M100,6 Q120,28 100,50" fill="none" stroke="#00c8ff" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
                  <line x1="52" y1="54" x2="52" y2="62" stroke="#006b8a" strokeWidth="1.2" strokeLinecap="round"/>
                  <line x1="40" y1="62" x2="64" y2="62" stroke="#006b8a" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <div className="era-title">Streaming</div>
                <div className="era-tag">On-Demand · 2020s</div>
                <p className="era-desc">The internet unbundled everything, then rebundled it at a premium. Live sport anchors subscription growth.</p>
              </div>
              <div className="era-card">
                <div className="era-num">V</div>
                {/* AR / AI future */}
                <svg viewBox="0 0 120 72" xmlns="http://www.w3.org/2000/svg" style={{width:'120px',height:'72px',display:'block',marginBottom:'1.25rem'}}>
                  <path d="M18,32 Q18,22 30,22 L52,22 Q60,22 60,30 Q60,22 68,22 L90,22 Q102,22 102,32 L102,44 Q102,52 94,52 L72,52 Q64,52 60,46 Q56,52 48,52 L26,52 Q18,52 18,44 Z" fill="rgba(0,200,255,0.07)" stroke="#00c8ff" strokeWidth="1"/>
                  <ellipse cx="42" cy="37" rx="16" ry="11" fill="rgba(0,200,255,0.1)" stroke="#006b8a" strokeWidth="0.8"/>
                  <ellipse cx="78" cy="37" rx="16" ry="11" fill="rgba(0,200,255,0.1)" stroke="#006b8a" strokeWidth="0.8"/>
                  <line x1="32" y1="37" x2="52" y2="37" stroke="#00c8ff" strokeWidth="0.5" opacity="0.5"/>
                  <line x1="42" y1="28" x2="42" y2="46" stroke="#00c8ff" strokeWidth="0.5" opacity="0.5"/>
                  <line x1="68" y1="37" x2="88" y2="37" stroke="#00c8ff" strokeWidth="0.5" opacity="0.5"/>
                  <line x1="78" y1="28" x2="78" y2="46" stroke="#00c8ff" strokeWidth="0.5" opacity="0.5"/>
                  <circle cx="42" cy="37" r="2.5" fill="#00c8ff" opacity="0.8"/>
                  <circle cx="78" cy="37" r="2.5" fill="#00c8ff" opacity="0.8"/>
                  <circle cx="20" cy="18" r="1.5" fill="#00c8ff" opacity="0.5"/>
                  <line x1="20" y1="18" x2="30" y2="22" stroke="#00c8ff" strokeWidth="0.6" opacity="0.4"/>
                  <circle cx="100" cy="18" r="1.5" fill="#00c8ff" opacity="0.5"/>
                  <line x1="100" y1="18" x2="90" y2="22" stroke="#00c8ff" strokeWidth="0.6" opacity="0.4"/>
                  <circle cx="60" cy="62" r="1.5" fill="#00c8ff" opacity="0.5"/>
                  <line x1="60" y1="62" x2="60" y2="52" stroke="#00c8ff" strokeWidth="0.6" opacity="0.4"/>
                </svg>
                <div className="era-title">What's Next</div>
                <div className="era-tag">Commerce + AI · 2030s</div>
                <p className="era-desc">Shoppable moments. Personalized feeds. Integrated betting. Sport as commerce infrastructure.</p>
              </div>
            </div>

            <div className="glass reveal d4" style={{padding:'2rem',marginTop:'2rem'}}>
              <p style={{fontSize:'0.875rem',color:'var(--text-muted)',lineHeight:'1.75'}}>
                <span className="label" style={{display:'block',marginBottom:'0.75rem'}}>The pattern</span>
                Each era multiplied viewership and revenue. The transition is never smooth: incumbents resist, consumers adapt slowly, but the shift is always irreversible. We are mid-transition now.
              </p>
            </div>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ POWER PLAY */}
        <section id="power" style={{background:'var(--bg-2)'}}>
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">Chapter II</span>
            </div>
            <h2 className="h-section section-title reveal d1">
              A Mutually Beneficial<br/>
              <span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>Power Play</span>
            </h2>
            <p className="section-lead reveal d2">The marriage between sports leagues and streaming platforms wasn't accidental. Each party held exactly what the other desperately needed.</p>

            <div className="two-col" style={{marginBottom:'3rem'}}>
              <div className="glass reveal reveal-l d2" style={{padding:'2.25rem'}}>
                <div className="label" style={{marginBottom:'1.5rem'}}>What Leagues Gained</div>
                <ul className="benefit-list">
                  <li className="benefit-item"><div className="benefit-bar"></div><div><div className="benefit-title">Massive Rights Fees</div><div className="benefit-desc">Tech giants, flush with cash, bid higher than legacy broadcasters ever could or would.</div></div></li>
                  <li className="benefit-item"><div className="benefit-bar"></div><div><div className="benefit-title">Global Distribution</div><div className="benefit-desc">Streaming platforms reach audiences throughout the world. A single deal is a global audience deal.</div></div></li>
                  <li className="benefit-item"><div className="benefit-bar"></div><div><div className="benefit-title">Younger Demographics</div><div className="benefit-desc">Streaming reaches the 18–34 cohort that has abandoned linear TV.</div></div></li>
                  <li className="benefit-item"><div className="benefit-bar"></div><div><div className="benefit-title">Production Innovation</div><div className="benefit-desc">Multi-angle cameras, real-time stats overlays, integrated betting odds.</div></div></li>
                </ul>
              </div>
              <div className="glass reveal reveal-r d2" style={{padding:'2.25rem'}}>
                <div className="label" style={{marginBottom:'1.5rem',color:'var(--blue)'}}>What Streamers Gained</div>
                <ul className="benefit-list">
                  <li className="benefit-item"><div className="benefit-bar" style={{background:'linear-gradient(to bottom,var(--blue),transparent)'}}></div><div><div className="benefit-title">Subscriber Magnets</div><div className="benefit-desc">Live sport drives sign-ups on event nights and keeps churn low during the season.</div></div></li>
                  <li className="benefit-item"><div className="benefit-bar" style={{background:'linear-gradient(to bottom,var(--blue),transparent)'}}></div><div><div className="benefit-title">Legitimate Premium Brand</div><div className="benefit-desc">Owning the rights to a major sports league signals that a streamer is a serious media company.</div></div></li>
                  <li className="benefit-item"><div className="benefit-bar" style={{background:'linear-gradient(to bottom,var(--blue),transparent)'}}></div><div><div className="benefit-title">First-Party Data</div><div className="benefit-desc">Authenticated viewers reveal household income, purchase behavior, and preferences.</div></div></li>
                  <li className="benefit-item"><div className="benefit-bar" style={{background:'linear-gradient(to bottom,var(--blue),transparent)'}}></div><div><div className="benefit-title">Commerce Integration</div><div className="benefit-desc">By following Amazon's lead, every ad slot is a shoppable moment. Sport is a purchase funnel.</div></div></li>
                </ul>
              </div>
            </div>

            <div className="glass-glow reveal">
              <div className="big-stat-block">
                <div className="big-num" data-count-big="70" data-suffix="%">0%</div>
                <p className="big-stat-text">of adults aged 18–44 subscribe to at least one streaming service, with an average of <strong style={{color:'var(--text)'}}>8 active subscriptions</strong> per household. The audience has already moved.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ COVID */}
        <section id="covid">
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">Chapter III</span>
            </div>
            <h2 className="h-section section-title reveal d1">
              The COVID<br/>
              <span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>Accelerator</span>
            </h2>
            <p className="section-lead reveal d2">The pandemic compressed a decade of change into eighteen months. Empty stadiums forced every stakeholder's hand.</p>

            {/* S-Curve Chart */}
            <div className="glass reveal d3" style={{padding:'2.25rem',marginBottom:'2rem'}}>
              <div className="label" style={{marginBottom:'1.5rem'}}>Streaming vs Traditional TV: Viewership Index 2015–2025</div>
              <canvas id="scurve" height={300} aria-label="Chart showing streaming rising and linear TV falling with a crossover at 2020"></canvas>
              <div style={{display:'flex',gap:'2rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}><div style={{width:'2rem',height:'2px',background:'var(--cyan)'}}></div><span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>Streaming</span></div>
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}><div style={{width:'2rem',height:'2px',background:'var(--text-dim)'}}></div><span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>Linear TV</span></div>
                <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}><div style={{width:'10px',height:'10px',borderRadius:'50%',background:'rgba(0,200,255,0.3)',border:'1px solid var(--cyan)'}}></div><span style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>2020 COVID inflection</span></div>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
              <div className="glass reveal d1" style={{padding:'1.75rem'}}>
                <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'2rem',color:'var(--cyan)',marginBottom:'0.5rem'}}>+26M</div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'0.85rem',color:'var(--text)',marginBottom:'0.4rem'}}>New US streaming subscribers in 2020</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)',lineHeight:'1.6'}}>Added in a single year as lockdowns made streaming the only live entertainment.</div>
              </div>
              <div className="glass reveal d2" style={{padding:'1.75rem'}}>
                <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'2rem',color:'var(--cyan)',marginBottom:'0.5rem'}}>–12%</div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'0.85rem',color:'var(--text)',marginBottom:'0.4rem'}}>Linear TV viewership decline 2020–22</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)',lineHeight:'1.6'}}>Cord-cutting accelerated permanently. Households that cancelled rarely returned.</div>
              </div>
              <div className="glass reveal d3" style={{padding:'1.75rem'}}>
                <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'2rem',color:'var(--cyan)',marginBottom:'0.5rem'}}>2021</div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'0.85rem',color:'var(--text)',marginBottom:'0.4rem'}}>First major sports rights shift to streaming</div>
                <div style={{fontSize:'0.78rem',color:'var(--text-muted)',lineHeight:'1.6'}}>Amazon had previously aired NFL games, but in 2021 signed the first exclusive streaming rights deal for Thursday Night Football, a watershed moment for the industry.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ AMAZON */}
        <section id="amazon" style={{background:'var(--bg-2)'}}>
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">Case Study</span>
            </div>
            <h2 className="h-section section-title reveal d1">
              The Amazon / NFL<br/>
              <span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>Blueprint</span>
            </h2>
            <p className="section-lead reveal d2">When Amazon secured exclusive NFL Thursday Night Football rights in 2021, it didn't buy a broadcast slot; it bought a proof-of-concept for the entire industry.</p>

            {/* Deal table */}
            <div className="glass reveal d2" style={{overflow:'hidden',marginBottom:'2.5rem'}}>
              <table className="deal-table" style={{width:'100%'}}>
                <thead>
                  <tr>
                    <th>Partner</th>
                    <th>Asset</th>
                    <th>Duration</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Amazon Prime Video</td>
                    <td>Thursday Night Football (excl.)</td>
                    <td>11 years</td>
                    <td><span className="deal-val">~$1B/yr</span></td>
                  </tr>
                  <tr>
                    <td style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>Per-game cost</td>
                    <td style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>15–17 games/season</td>
                    <td style={{color:'var(--text-muted)',fontSize:'0.8rem'}}>2022–2032</td>
                    <td><span className="deal-val" style={{fontSize:'1rem',color:'var(--text-muted)'}}>$58.8M/game</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Black Friday intro */}
            <div className="glass reveal d1" style={{padding:'2.25rem',marginBottom:'2.5rem'}}>
              <div className="label" style={{marginBottom:'1rem',color:'var(--cyan)'}}>2023: The Black Friday Game</div>
              <p style={{fontSize:'1.05rem',lineHeight:'1.8',color:'var(--text)',marginBottom:'1rem'}}>Building on the success of exclusive Thursday Night Football, Amazon paid $100M for the exclusive rights to a single NFL game on Black Friday 2023. But this was never just about football.</p>
              <p style={{fontSize:'1rem',lineHeight:'1.8',color:'var(--text-muted)',marginBottom:'1rem'}}>The move was a deliberate attempt to create a new commercial holiday tradition, one that lived entirely within a digital ecosystem. Instead of heading out to stores on Black Friday, Amazon wanted the shopping experience to come to viewers, while they watched the most-watched sport in the United States.</p>
              <p style={{fontSize:'1rem',lineHeight:'1.8',color:'var(--text-muted)'}}>By pairing targeted ads with live football, Amazon turned a single game into a shoppable event, redefining what Black Friday could look like for a streaming-first generation.</p>
            </div>

            {/* Black Friday flow */}
            <div className="label reveal" style={{marginBottom:'1.25rem'}}>The Black Friday Experiment: Acquire → Monetize → Integrate</div>
            <div className="flow-grid reveal d2">
              <div className="flow-card">
                <div className="flow-step">01</div>
                <div className="flow-title">Acquire</div>
                <div className="flow-amount">$100M</div>
                <p className="flow-desc">Amazon paid ~$100M for exclusive Black Friday rights, a calculated loss-leader to prove the model.</p>
              </div>
              <div className="flow-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--cyan-dim)" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </div>
              <div className="flow-card">
                <div className="flow-step">02</div>
                <div className="flow-title">Monetize</div>
                <div className="flow-amount">$880K</div>
                <p className="flow-desc">The only publicly available data covers 58 thirty-second ad slots, which alone generated approximately $51M. Shorter formats like 15-second ads were not disclosed, meaning the true ad revenue was almost certainly higher, and Amazon likely recouped well over half its $100M investment from ads before a single item was sold.</p>
              </div>
              <div className="flow-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--cyan-dim)" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </div>
              <div className="flow-card">
                <div className="flow-step">03</div>
                <div className="flow-title">Integrate</div>
                <div className="flow-amount">Shop</div>
                <p className="flow-desc">Instead of going out and battling crowds, the shopping experience was brought directly to the customer's living room. Amazon converted its first-party data into a targeted ad experience tailored to each viewer. Many ads featured QR codes directing users straight to product pages. But every QR code scan sent behavioral data back to Amazon, giving the tech giant even richer targeting signals for future campaigns. The game was not just a commercial event, it was a data collection exercise at scale.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ DATA PAYOFF */}
        <section id="data">
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">Chapter IV</span>
            </div>
            <h2 className="h-section section-title reveal d1">
              The Real Payoff<br/>
              <span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>Is Data</span>
            </h2>
            <p className="section-lead reveal d2">The ad revenue is visible. The commerce integration is trackable. But the real prize, why tech companies outbid legacy broadcasters, is first-party data from authenticated viewers.</p>

            <div className="glass reveal d2" style={{padding:'2.5rem',marginBottom:'2rem'}} id="data-bars">
              <div className="label" style={{marginBottom:'2rem'}}>Black Friday Game: Revenue Analysis</div>
              <div className="bar-row">
                <div className="bar-meta"><span className="bar-label">Rights Investment</span><span className="bar-value" style={{color:'#ff6080'}}>−$100M</span></div>
                <div className="bar-track"><div className="bar-fill" style={{background:'linear-gradient(90deg,#7f1d2a,#ff4060)'}} data-w="100"></div></div>
              </div>
              <div className="bar-row">
                <div className="bar-meta"><span className="bar-label">Known Direct Ad Revenue (from 30 sec ads, 58 × $880K)</span><span className="bar-value" style={{color:'var(--cyan)'}}>+$51.04M</span></div>
                <div className="bar-track"><div className="bar-fill" style={{background:'linear-gradient(90deg,var(--cyan-dim),var(--cyan))'}} data-w="51"></div></div>
              </div>
              <div className="bar-row">
                <div className="bar-meta"><span className="bar-label">Commerce / Shoppable Ads / Unknown Ad Revenue</span><span className="bar-value" style={{color:'var(--cyan)'}}>+Unmeasured</span></div>
                <div className="bar-track"><div className="bar-fill" style={{background:'linear-gradient(90deg,var(--cyan-dim),var(--blue))'}} data-w="38"></div></div>
              </div>
              <div className="bar-row" style={{marginBottom:0}}>
                <div className="bar-meta"><span className="bar-label">First-Party Data Value (modelled)</span><span className="bar-value" style={{color:'#80e8ff'}}>+Strategic</span></div>
                <div className="bar-track"><div className="bar-fill" style={{background:'linear-gradient(90deg,var(--blue),var(--cyan),#a0f0ff)'}} data-w="82"></div></div>
              </div>
              <p style={{fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'1.75rem',fontStyle:'italic'}}>* 58 slots. Only accounts for 30 sec ads.</p>
            </div>

            <div className="mini-grid">
              <div className="glass reveal d1"><div className="mini-stat"><div className="mini-num">58</div><div className="mini-label">30 sec ad slots per game (publicly known)</div></div></div>
              <div className="glass reveal d2"><div className="mini-stat"><div className="mini-num">$880K</div><div className="mini-label">Per 30-second unit</div></div></div>
            </div>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ DOMINO */}
        <section id="domino" style={{background:'var(--bg-2)'}}>
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">Chapter V</span>
            </div>
            <h2 className="h-section section-title reveal d1">
              The Domino<br/>
              <span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>Effect</span>
            </h2>
            <p className="section-lead reveal d2">Once Amazon proved the model, every major league renegotiated. The deals that followed rewired the entire rights landscape.</p>

            {/* NFL table */}
            <div className="label reveal" style={{marginBottom:'1rem'}}>NFL: $26B Total Streaming Portfolio</div>
            <div className="glass reveal d1" style={{overflow:'hidden',marginBottom:'2.5rem'}}>
              <table className="deal-table" style={{width:'100%'}}>
                <thead><tr><th>Platform</th><th>Package</th><th>Deal Signed</th><th>Term</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>Amazon Prime</td><td>Thursday Night (excl.)</td><td>2021</td><td>11 yr</td><td><span className="deal-val">$1.0B/yr</span></td></tr>
                  <tr><td>YouTube TV</td><td>Sunday Ticket</td><td>2024</td><td>7 yr</td><td><span className="deal-val">$2.5B/yr</span></td></tr>
                  <tr><td>Peacock (NBC)</td><td>Exclusive Playoff Game</td><td>2023</td><td>Ongoing</td><td><span className="deal-val">$110M</span></td></tr>
                  <tr><td>Netflix</td><td>Christmas Day Games</td><td>2024</td><td>3 yr</td><td><span className="deal-val">$150M/yr</span></td></tr>
                </tbody>
              </table>
            </div>

            {/* NBA table */}
            <div className="label reveal" style={{marginBottom:'1rem'}}>NBA: $76B Total Streaming Portfolio</div>
            <p style={{fontSize:'0.82rem',color:'var(--text-muted)',marginBottom:'1rem',fontStyle:'italic'}} className="reveal d1">All deals below were signed as part of the NBA's new media rights agreement, covering the 2025-2026 season onwards.</p>
            <div className="glass reveal d2" style={{overflow:'hidden',marginBottom:'2.5rem'}}>
              <table className="deal-table" style={{width:'100%'}}>
                <thead><tr><th>Platform</th><th>Package</th><th>Term</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>Amazon Prime</td><td>Package C (excl. streaming)</td><td>11 yr</td><td><span className="deal-val">$1.8B/yr</span></td></tr>
                  <tr><td>NBC / Peacock</td><td>Package A</td><td>11 yr</td><td><span className="deal-val">$2.5B/yr</span></td></tr>
                  <tr><td>ESPN / ABC</td><td>Package B</td><td>11 yr</td><td><span className="deal-val">$2.6B/yr</span></td></tr>
                </tbody>
              </table>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}} className="reveal d3">
              <div className="glass" style={{padding:'1.75rem'}}>
                <div className="label" style={{marginBottom:'0.75rem'}}>MLS</div>
                <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'2rem',color:'var(--cyan)',marginBottom:'0.5rem'}}>$2.5B</div>
                <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Apple TV+, 10-year exclusive. Full league package. Global rights.</div>
              </div>
              <div className="glass" style={{padding:'1.75rem'}}>
                <div className="label" style={{marginBottom:'0.75rem'}}>MLB</div>
                <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'2rem',color:'var(--cyan)',marginBottom:'0.5rem'}}>$85M/yr</div>
                <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>Apple TV+ Friday games. First major broadcast-to-streaming shift in baseball.</div>
              </div>
              <div className="glass" style={{padding:'1.75rem'}}>
                <div className="label" style={{marginBottom:'0.75rem'}}>WWE / Netflix</div>
                <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'2rem',color:'var(--cyan)',marginBottom:'0.5rem'}}>$5B</div>
                <div style={{fontSize:'0.8rem',color:'var(--text-muted)'}}>10-year deal. RAW exclusively on Netflix. Combat sport goes mainstream streaming.</div>
              </div>
            </div>

            {/* Total committed */}
            <div className="reveal d4" style={{marginTop:'2.5rem',border:'1px solid var(--cyan-dim)',borderRadius:'16px',padding:'2.5rem 3rem',background:'linear-gradient(135deg,rgba(0,200,255,0.04) 0%,rgba(0,200,255,0.01) 100%)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'2rem',flexWrap:'wrap'}}>
              <div>
                <div className="label" style={{marginBottom:'0.6rem',color:'var(--cyan-dim)'}}>Total Capital Committed to Streaming Rights</div>
                <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',lineHeight:'1',color:'var(--cyan)',fontSize:'clamp(3.5rem,7vw,6rem)'}}>
                  <span data-count="110" data-prefix="$" data-suffix="B+">$0B+</span>
                </div>
                <div style={{fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'0.6rem',letterSpacing:'0.15em',textTransform:'uppercase'}}>NFL · NBA · MLS · MLB · WWE and counting</div>
              </div>
              <div style={{flexShrink:0,maxWidth:'320px'}}>
                <p style={{fontSize:'0.875rem',color:'var(--text-muted)',lineHeight:'1.75'}}>In just a few years, the four major American sports leagues collectively signed over <strong style={{color:'var(--text)'}}>$110 billion</strong> in streaming rights contracts. Television's century-long monopoly on live sport ended not with a whimper, but with a wire transfer.</p>
              </div>
            </div>

          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ THE VICTIM */}
        <section id="victim">
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">Chapter VI</span>
            </div>
            <h2 className="h-section section-title reveal d1">
              The Victim<br/>
              <span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>in the Room</span>
            </h2>
            <p className="section-lead reveal d2">As leagues and platforms negotiated their mutual prosperity, one stakeholder was absent from the table: the fan.</p>

            <div style={{marginBottom:'3.5rem'}}>
              <div className="pain-item reveal d1">
                <div className="pain-inner">
                  <div className="pain-index">01</div>
                  <div>
                    <div className="pain-title">À La Carte Chaos</div>
                    <p className="pain-body">To watch a complete NFL season, a fan must now subscribe to YouTube TV, Amazon Prime, Peacock, ESPN+, and Netflix, each carrying a different package of games. No single service provides full coverage. The consumer must reconstruct the bundle they once had, at three times the price.</p>
                  </div>
                </div>
              </div>
              <div className="pain-item reveal d2">
                <div className="pain-inner">
                  <div className="pain-index">02</div>
                  <div>
                    <div className="pain-title">Subscription Fatigue</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:'0.75rem',marginBottom:'0.6rem'}}>
                      <span style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'2rem',color:'var(--cyan)'}}>60%</span>
                      <span style={{fontSize:'0.85rem',color:'var(--text-muted)'}}>of subscribers cancel within 3 months of a major sporting event</span>
                    </div>
                    <p className="pain-body">The subscribe-and-cancel cycle is now a documented consumer pattern. Fans sign up for the Super Bowl or the Finals, cancel after, and platforms spend the off-season buying them back with discounts. The economics are unstable.</p>
                  </div>
                </div>
              </div>
              <div className="pain-item reveal d3" style={{borderBottom:'none'}}>
                <div className="pain-inner">
                  <div className="pain-index">03</div>
                  <div>
                    <div className="pain-title">Toll Road Mentality</div>
                    <p className="pain-body">Individual playoff games are now paywalled behind specific streaming tiers. The 2024 Wild Card game on Peacock required a paid upgrade, a game once available on free broadcast now has a cover charge. The public good of live sport is becoming a private toll road.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill card */}
            <div className="label reveal" style={{marginBottom:'1.25rem'}}>The True Cost: An NFL Fan's Monthly Bill</div>
            <div className="glass-glow bill-card reveal d2">
              <div className="bill-header">
                <div className="bill-header-label">Monthly subscription breakdown</div>
                <div className="bill-header-title">Full NFL Season Access 2024/25</div>
              </div>
              <div className="bill-body">
                <div className="bill-row"><span className="bill-service">YouTube TV (base package)</span><span className="bill-price">$82.99</span></div>
                <div className="bill-row"><span className="bill-service">YouTube Sunday Ticket</span><span className="bill-price">$23.00</span></div>
                <div className="bill-row"><span className="bill-service">Amazon Prime</span><span className="bill-price">$11.58</span></div>
                <div className="bill-row"><span className="bill-service">Peacock Premium</span><span className="bill-price">$10.99</span></div>
                <div className="bill-row" style={{borderBottom:'none'}}><span className="bill-service">Netflix (Standard)</span><span className="bill-price">$7.99</span></div>
              </div>
              <div className="bill-footer">
                <div className="bill-total-label">Total Monthly</div>
                <div className="bill-total-num">$136.55</div>
              </div>
            </div>
            <p style={{fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'1rem',maxWidth:'460px'}}>vs. $50–60/month for the cable bundle that included all of the above a decade ago.</p>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ TRADEOFF */}
        <section style={{background:'var(--bg-2)'}}>
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">The Calculus</span>
            </div>
            <h2 className="h-section section-title reveal d1">Innovation vs.<br/><span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>Accessibility</span></h2>

            <div className="tradeoff-grid" style={{marginTop:'3rem'}}>
              <div className="tradeoff-card positive reveal reveal-l d2">
                <div className="tradeoff-head">
                  <div className="tradeoff-dot" style={{background:'var(--cyan)',boxShadow:'0 0 8px var(--cyan)'}}></div>
                  <span className="tradeoff-head-label" style={{color:'var(--cyan)'}}>What You Get</span>
                </div>
                <ul className="tradeoff-list">
                  <li className="tradeoff-item"><span className="tradeoff-sign" style={{color:'var(--cyan)'}}>+</span><div><div className="tradeoff-item-title">Multi-angle cameras</div><div className="tradeoff-item-desc">Choose your view. Watch replays from any angle instantly.</div></div></li>
                  <li className="tradeoff-item"><span className="tradeoff-sign" style={{color:'var(--cyan)'}}>+</span><div><div className="tradeoff-item-title">Personalized stats overlays</div><div className="tradeoff-item-desc">Real-time player tracking, fantasy data, predictive analytics.</div></div></li>
                  <li className="tradeoff-item"><span className="tradeoff-sign" style={{color:'var(--cyan)'}}>+</span><div><div className="tradeoff-item-title">Integrated betting</div><div className="tradeoff-item-desc">Live odds in-stream. Place bets without leaving the feed.</div></div></li>
                  <li className="tradeoff-item"><span className="tradeoff-sign" style={{color:'var(--cyan)'}}>+</span><div><div className="tradeoff-item-title">Global access</div><div className="tradeoff-item-desc">Any device, anywhere. Games no longer geography-locked.</div></div></li>
                </ul>
              </div>
              <div className="tradeoff-card negative reveal reveal-r d2">
                <div className="tradeoff-head">
                  <div className="tradeoff-dot" style={{background:'var(--red)',boxShadow:'0 0 8px var(--red)'}}></div>
                  <span className="tradeoff-head-label" style={{color:'var(--red)'}}>What It Costs</span>
                </div>
                <ul className="tradeoff-list">
                  <li className="tradeoff-item"><span className="tradeoff-sign" style={{color:'var(--red)'}}>−</span><div><div className="tradeoff-item-title">Financial burden</div><div className="tradeoff-item-desc">$137/month for one sport. This excludes all other entertainment.</div></div></li>
                  <li className="tradeoff-item"><span className="tradeoff-sign" style={{color:'var(--red)'}}>−</span><div><div className="tradeoff-item-title">Navigational complexity</div><div className="tradeoff-item-desc">Six apps to manage. Different UIs, passwords, and billing cycles.</div></div></li>
                  <li className="tradeoff-item"><span className="tradeoff-sign" style={{color:'var(--red)'}}>−</span><div><div className="tradeoff-item-title">Reduced accessibility</div><div className="tradeoff-item-desc">Lower-income households priced out. Sport becomes a luxury, not a right.</div></div></li>
                  <li className="tradeoff-item"><span className="tradeoff-sign" style={{color:'var(--red)'}}>−</span><div><div className="tradeoff-item-title">Privacy erosion</div><div className="tradeoff-item-desc">The price of personalization is behavioral surveillance at scale.</div></div></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ RECKONING */}
        <section id="reckoning">
          <div className="section-inner">
            <div className="chapter-label reveal">
              <div className="chapter-line"></div>
              <span className="label">Chapter VII</span>
            </div>
            <h2 className="h-section section-title reveal d1">
              The<br/>
              <span className="serif" style={{fontSize:'0.9em',color:'var(--text-muted)'}}>Reckoning</span>
            </h2>
            <p className="section-lead reveal d2">Consumer tolerance for fragmented access and escalating costs has limits. Two distinct futures are emerging. The industry must choose.</p>

            {/* Venu Sports */}
            <div className="glass reveal d2" style={{padding:'2.5rem',marginBottom:'3rem',borderColor:'rgba(255,64,96,0.15)'}}>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem',marginBottom:'2rem'}}>
                <div className="label">Cautionary Tale: Venu Sports</div>
                <span className="blocked-badge"><span className="blocked-dot"></span>BLOCKED: Antitrust</span>
              </div>
              <div className="venu-grid">
                <div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',color:'var(--text)',marginBottom:'0.75rem'}}>The Proposed Solution</div>
                  <p style={{fontSize:'0.875rem',color:'var(--text-muted)',lineHeight:'1.75',marginBottom:'1rem'}}>ESPN, Fox, and Warner Bros. Discovery proposed a joint streaming venture, "Venu Sports", to offer all major sports on a single platform. A genuine re-aggregation attempt. Industry collaboration over competition.</p>
                  <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'2rem',color:'var(--cyan)'}}>$42.99/mo</div>
                  <div style={{fontSize:'0.75rem',color:'var(--text-dim)'}}>Proposed price point</div>
                </div>
                <div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:'1rem',color:'var(--text)',marginBottom:'0.75rem'}}>The Regulatory Block</div>
                  <p style={{fontSize:'0.875rem',color:'var(--text-muted)',lineHeight:'1.75'}}>A federal judge issued a preliminary injunction, ruling that three of the largest sports content owners creating a single bundle raised serious antitrust concerns. Venu Sports was shelved indefinitely.</p>
                </div>
              </div>
            </div>

            {/* Two paths */}
            <div className="label reveal" style={{marginBottom:'1.25rem'}}>Two Futures</div>
            <div className="path-grid reveal d2">
              <div className="path-card">
                <div className="path-num">Path 01</div>
                <div className="path-title">Re-Aggregation</div>
                <p className="path-body">The industry consolidates. A single super-bundle emerges through regulatory approval or acquisition. The fan gets one bill, one interface. Convenient, but historically monopolistic.</p>
                <ul className="path-points">
                  <li className="path-point">Precedent: Cable TV bundle (pre-2015)</li>
                  <li className="path-point">Risk: monopolistic pricing without competition</li>
                  <li className="path-point">Blocker: antitrust regulators (see Venu Sports)</li>
                </ul>
              </div>
              <div className="path-card">
                <div className="path-num">Path 02</div>
                <div className="path-title">Commerce-First</div>
                <p className="path-body">Streaming becomes the wrapper around a commerce experience. Subscription fees are subsidized by purchase commissions and targeted advertising. The cost drops, and the data cost rises.</p>
                <ul className="path-points">
                  <li className="path-point">Precedent: Amazon Black Friday game</li>
                  <li className="path-point">58% higher engagement for shoppable content</li>
                  <li className="path-point">Privacy trade-off: data for reduced cost</li>
                </ul>
              </div>
            </div>

            {/* Commerce stat */}
            <div className="glass-glow reveal" style={{marginTop:'2rem'}}>
              <div className="big-stat-block">
                <div className="big-num">58%</div>
                <p className="big-stat-text">higher viewer engagement with shoppable streaming content versus standard ad formats, the number that makes the commerce-first model commercially irresistible.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="glow-divider"></div>

        {/* ═══════════════════════════ CLOSING */}
        <section id="closing" style={{background:'var(--bg-2)'}}>
          <div className="section-inner" style={{textAlign:'left'}}>
            <div className="closing-body reveal d1">
              <p>The transformation of sports media is, on its surface, a story of progress. Better technology, broader access, richer content, global audiences. And those things are real.</p>
              <p>But progress for whom? The leagues secured generational wealth through rights fees that no cable network could match. The platforms secured subscriber growth, brand legitimacy, and, most valuably, data at a scale previously unimaginable.</p>
              <p>The fan, the person whose passion made all of this possible, who filled the stadium and bought the jersey and tuned in for fifty years, was the last consideration in every deal room. Their loyalty was assumed. Their tolerance was tested. Their wallet was the variable everyone planned around.</p>
              <p>The reckoning will come, as it always does, when the audience decides it's had enough. What form that reckoning takes, whether re-aggregation, regulation, or a new commerce compact, will define the next era of sports media. But one thing is certain: <strong style={{color:'var(--text)'}}>whoever controls the access, controls the audience. And whoever controls the audience, controls the game.</strong></p>
            </div>
            <div className="closing-byline reveal d3">
              <div className="byline-divider"></div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:'0.72rem',letterSpacing:'0.25em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:'0.35rem'}}>Mo NC</div>
              <div style={{fontFamily:"'Newsreader',serif",fontStyle:'italic',fontSize:'0.9rem',color:'var(--text-dim)'}}>The Future of Sports Media · 2025</div>
            </div>
          </div>
        </section>

      </main>

      <footer>
        <div className="footer-series">
          <a href="#">The Future of FinTech</a>
          <a href="#">Sports &amp; Media</a>
          <a href="#">Technology &amp; Society</a>
        </div>
        <span className="footer-copy">© 2025 Mo NC</span>
      </footer>
    </div>
  );
}
