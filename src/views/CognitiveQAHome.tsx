// @ts-nocheck -- imported code written for looser TypeScript settings
import { Link } from '@/lib/router-compat';
import { useEffect } from 'react';
import './cognitive-qa-amber.css';

export default function CognitiveQAHome() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const planeEl = document.getElementById('cqa-plane') as HTMLElement | null;
    const vaporEl = document.getElementById('cqa-vapor') as HTMLElement | null;
    const sceneEl = document.getElementById('cqa-scene') as HTMLElement | null;
    if (!planeEl || !vaporEl || !sceneEl) return;

    const trajectories = [
      { sx: -0.05, sy: 0.88, ex: 1.05, ey: 0.08 },
      { sx: 1.05,  sy: 0.88, ex: -0.05, ey: 0.08 },
      { sx: -0.05, sy: 0.08, ex: 1.05,  ey: 0.88 },
      { sx: 1.05,  sy: 0.08, ex: -0.05, ey: 0.88 },
      { sx: -0.05, sy: 0.55, ex: 1.05,  ey: 0.10 },
      { sx: 1.05,  sy: 0.55, ex: -0.05, ey: 0.10 },
    ];
    let idx = 0;
    let scheduleTimeout: ReturnType<typeof setTimeout>;
    let rafId: number;

    function fly() {
      const vw = sceneEl!.offsetWidth;
      const vh = sceneEl!.offsetHeight;
      const tr = trajectories[idx++ % trajectories.length];
      const p0 = { x: tr.sx * vw, y: tr.sy * vh };
      const p1 = { x: tr.ex * vw, y: tr.ey * vh };
      const ang = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI;
      const dur = 5500;
      planeEl!.style.opacity = '0';
      vaporEl!.style.width = '0px';
      const t0 = performance.now();
      function step(now: number) {
        const p = Math.min((now - t0) / dur, 1);
        const t = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        let op = 1;
        if (p < 0.08) op = p / 0.08;
        else if (p > 0.9) op = 1 - (p - 0.9) / 0.1;
        planeEl!.style.transform = `translate(${p0.x + (p1.x - p0.x) * t}px,${p0.y + (p1.y - p0.y) * t}px) rotate(${ang}deg)`;
        planeEl!.style.opacity = String(op);
        vaporEl!.style.width = Math.min(t * 300, 180) + 'px';
        if (p < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          planeEl!.style.opacity = '0';
          vaporEl!.style.width = '0px';
        }
      }
      rafId = requestAnimationFrame(step);
    }

    function schedule() {
      fly();
      scheduleTimeout = setTimeout(schedule, 10500);
    }
    const initialTimeout = setTimeout(schedule, 2500);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(scheduleTimeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="cqa-amber" style={{ overflow: 'hidden' }}>
      <div className="top-bar spaced">
        <Link to="/" className="brand" style={{ color: '#f5a623', letterSpacing: '0.12em', fontSize: '0.85rem', textTransform: 'uppercase' }}>
          Mohamad Noor-Chowdhury
        </Link>
        <span className="top-bar-tag">INSPECTION INTELLIGENCE PLATFORM</span>
      </div>

      <div className="home-wrap">
        <div className="scene" id="cqa-scene" aria-hidden="true">
          <div className="scene-grid"></div>
          <div className="scene-glow"></div>
          <div className="scene-vignette"></div>
          <div className="scene-scan"></div>

          <div className="plane-wrap" id="cqa-plane">
            <div className="vapor-trail" id="cqa-vapor"></div>
            <svg viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 14 Q20 10 72 13 Q76 13.5 78 14 Q76 14.5 72 15 Q20 18 8 14Z" fill="rgba(245,166,35,0.7)" stroke="rgba(245,166,35,0.9)" strokeWidth="0.4"/>
              <path d="M72 13 Q80 14 72 15Z" fill="rgba(245,166,35,0.9)"/>
              <path d="M38 14 L28 4 L22 4 L32 14 L22 24 L28 24 Z" fill="rgba(245,166,35,0.5)" stroke="rgba(245,166,35,0.7)" strokeWidth="0.3"/>
              <path d="M12 14 L8 6 L14 6 L16 14Z" fill="rgba(245,166,35,0.5)" stroke="rgba(245,166,35,0.7)" strokeWidth="0.3"/>
              <path d="M16 14 L10 9 L8 9 L14 14 L8 19 L10 19 Z" fill="rgba(245,166,35,0.45)" stroke="rgba(245,166,35,0.6)" strokeWidth="0.3"/>
              <ellipse cx="36" cy="17.5" rx="6" ry="2.5" fill="rgba(245,166,35,0.35)" stroke="rgba(245,166,35,0.5)" strokeWidth="0.3"/>
              <circle cx="52" cy="13.5" r="1" fill="rgba(245,166,35,0.5)"/>
              <circle cx="58" cy="13.2" r="1" fill="rgba(245,166,35,0.5)"/>
              <circle cx="64" cy="13.2" r="1" fill="rgba(245,166,35,0.5)"/>
            </svg>
          </div>

          <div className="particle" style={{width:'3px',height:'3px',left:'22%',bottom:'35%',animation:'cqa-float1 7s ease-in-out 1s infinite'}}></div>
          <div className="particle" style={{width:'2px',height:'2px',left:'55%',bottom:'28%',animation:'cqa-float2 9s ease-in-out 2.5s infinite'}}></div>
          <div className="particle" style={{width:'4px',height:'4px',left:'75%',bottom:'40%',animation:'cqa-float3 8s ease-in-out 0.5s infinite'}}></div>
          <div className="particle" style={{width:'2px',height:'2px',left:'38%',bottom:'22%',animation:'cqa-float1 10s ease-in-out 4s infinite'}}></div>
        </div>

        <div className="home-inner">
          <div className="eyebrow">
            <div className="eyebrow-line"></div>
            SYSTEM READY
            <div className="eyebrow-line"></div>
          </div>

          <h1 className="home-title">
            COGNITIVE
            <span className="accent">QA</span>
          </h1>

          <p className="home-desc">WHERE AI MEETS THE GOLD STANDARD OF SAFETY</p>

          <div className="btn-row">
            <Link to="/cognitive-qa/vision" className="nav-btn">
              <div className="nav-btn-shimmer"></div>
              <span className="nav-btn-num">01</span>
              <span className="nav-btn-label">VISION</span>
              <span className="nav-btn-arrow">ENTER →</span>
              <div className="nav-btn-bar"></div>
            </Link>

            <Link to="/cognitive-qa/strategy" className="nav-btn">
              <div className="nav-btn-shimmer"></div>
              <span className="nav-btn-num">02</span>
              <span className="nav-btn-label">STRATEGY</span>
              <span className="nav-btn-arrow">ENTER →</span>
              <div className="nav-btn-bar"></div>
            </Link>

            <Link to="/cognitive-qa/demo" className="nav-btn cta">
              <div className="nav-btn-shimmer"></div>
              <span className="nav-btn-num">03</span>
              <span className="nav-btn-label">DEMO</span>
              <span className="nav-btn-arrow">ENTER →</span>
              <div className="nav-btn-bar"></div>
            </Link>
          </div>
        </div>
      </div>

      <div className="status-bar">
        <div className="status-dot"></div>
        <span className="status-online">PLATFORM ONLINE</span>
        <span>v2.4.1</span>
        <span className="status-right">COGNITIVE QA SYSTEMS</span>
      </div>
    </div>
  );
}
