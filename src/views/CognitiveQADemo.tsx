import { Link } from '@/lib/router-compat';
import './cognitive-qa-amber.css';

export default function CognitiveQADemo() {
  return (
    <div style={{ background: 'var(--w-bg)', color: 'var(--text-w)', fontFamily: 'var(--font)', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <style>{`
        :root {
          --w-bg:       #0b0804;
          --w-surface:  #110d07;
          --w-surface2: #181108;
          --amber:      #f5a623;
          --amber-dim:  rgba(245,166,35,0.10);
          --amber-glow: rgba(245,166,35,0.22);
          --orange:     #e8682a;
          --orange-dim: rgba(232,104,42,0.10);
          --muted-w:    #a8845a;
          --text-w:     #f0dfc0;
          --border-w:   rgba(245,166,35,0.22);
        }
        .cqa-demo * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (prefers-reduced-motion: reduce) {
          .cqa-demo *, .cqa-demo *::before, .cqa-demo *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        .cqa-demo .top-bar {
          display: flex; align-items: center; padding: 0 28px; height: 48px;
          background: var(--w-surface); border-bottom: 1px solid var(--border-w); flex-shrink: 0;
        }
        .cqa-demo .back-link {
          display: flex; align-items: center; gap: 8px; color: var(--muted-w);
          text-decoration: none; font-size: 0.78rem; letter-spacing: 0.14em;
          padding-right: 20px; border-right: 1px solid var(--border-w); margin-right: 20px;
          transition: color 0.15s; min-height: 44px;
        }
        .cqa-demo .back-link:hover { color: var(--amber); }
        .cqa-demo .brand {
          display: flex; align-items: center; gap: 9px; color: var(--amber);
          font-size: 0.9rem; letter-spacing: 0.2em; text-decoration: none;
        }
        .cqa-demo .brand-dot {
          width: 10px; height: 10px; border-radius: 50%; background: var(--amber);
          box-shadow: 0 0 10px var(--amber); animation: cqa-pulse 2s infinite;
        }
        @keyframes cqa-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .cqa-demo .top-bar-right {
          margin-left: auto; font-size: 0.78rem; letter-spacing: 0.18em; color: var(--muted-w);
        }
        .cqa-demo .scene {
          position: absolute; inset: 0; pointer-events: none; overflow: hidden;
        }
        .cqa-demo .scene-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .cqa-demo .scene-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 55% 50% at 50% 52%, rgba(232,104,42,0.06) 0%, transparent 65%);
        }
        .cqa-demo .scene-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(11,8,4,0.85) 100%);
        }
        .cqa-demo .scene-scan {
          position: absolute; width: 100%; height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(245,166,35,0.06) 20%, rgba(245,166,35,0.18) 50%, rgba(245,166,35,0.06) 80%, transparent 100%);
          animation: cqa-scan 7s ease-in-out infinite;
        }
        @keyframes cqa-scan {
          0%   { top: 5%;  opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 92%; opacity: 0; }
        }
        .cqa-demo .demo-wrap {
          flex: 1; position: relative; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .cqa-demo .demo-inner {
          position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center;
        }
        .cqa-demo .eyebrow {
          display: flex; align-items: center; gap: 12px; font-size: 0.88rem;
          letter-spacing: 0.32em; color: var(--muted-w); margin-bottom: 22px;
          opacity: 0; animation: cqa-fadeUp 0.6s ease-out 0.1s forwards;
        }
        .cqa-demo .eyebrow-line { width: 36px; height: 1px; background: var(--border-w); }
        .cqa-demo .demo-title {
          font-size: clamp(2.4rem, 6vw, 4.8rem); letter-spacing: 0.28em; text-transform: uppercase;
          line-height: 1; text-align: center; color: var(--text-w); margin-bottom: 10px;
          opacity: 0; animation: cqa-fadeUp 0.7s ease-out 0.3s forwards;
        }
        .cqa-demo .demo-title .accent {
          color: var(--amber);
          text-shadow: 0 0 30px rgba(245,166,35,0.4), 0 0 80px rgba(245,166,35,0.15);
          animation: cqa-glowBreathe 3s ease-in-out 1.4s infinite;
        }
        .cqa-demo .demo-sub {
          font-size: 0.88rem; letter-spacing: 0.28em; color: var(--muted-w); margin-bottom: 56px;
          opacity: 0; animation: cqa-fadeUp 0.6s ease-out 0.5s forwards;
        }
        .cqa-demo .card-row {
          display: flex; gap: 20px; opacity: 0; animation: cqa-fadeUp 0.6s ease-out 0.7s forwards;
        }
        .cqa-demo .demo-card {
          position: relative; width: 300px; background: var(--w-surface);
          border: 1px solid var(--border-w); text-decoration: none; color: var(--text-w);
          display: flex; flex-direction: column; padding: 32px 28px 28px;
          transition: border-color 0.2s, background 0.2s, transform 0.15s; overflow: hidden; cursor: pointer;
        }
        .cqa-demo .demo-card::after {
          content: ''; position: absolute; top: 0; right: 0; width: 14px; height: 14px;
          border-top: 1px solid var(--border-w); border-right: 1px solid var(--border-w);
          transition: border-color 0.2s;
        }
        .cqa-demo .demo-card:hover { border-color: var(--amber); background: var(--w-surface2); transform: translateY(-4px); }
        .cqa-demo .demo-card:hover::after { border-color: var(--amber); }
        .cqa-demo .demo-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--amber), var(--orange));
          opacity: 0; transition: opacity 0.2s;
        }
        .cqa-demo .demo-card:hover .demo-card-bar { opacity: 1; }
        .cqa-demo .demo-card-shimmer {
          position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(245,166,35,0.06), transparent);
          transform: skewX(-15deg); pointer-events: none;
        }
        .cqa-demo .demo-card:hover .demo-card-shimmer { left: 160%; transition: left 0.5s ease-in-out; }
        .cqa-demo .demo-card-tag {
          font-size: 0.65rem; letter-spacing: 0.28em; color: var(--muted-w); margin-bottom: 24px; transition: color 0.2s;
        }
        .cqa-demo .demo-card:hover .demo-card-tag { color: var(--amber); opacity: 0.7; }
        .cqa-demo .demo-card-icon { margin-bottom: 28px; }
        .cqa-demo .demo-card-icon svg { width: 48px; height: 48px; stroke: var(--amber); opacity: 0.55; transition: opacity 0.2s; }
        .cqa-demo .demo-card:hover .demo-card-icon svg { opacity: 1; }
        .cqa-demo .demo-card-title {
          font-size: 1.25rem; letter-spacing: 0.18em; color: var(--text-w); margin-bottom: 12px; transition: color 0.2s;
        }
        .cqa-demo .demo-card:hover .demo-card-title { color: var(--amber); }
        .cqa-demo .demo-card-desc { font-size: 0.8rem; letter-spacing: 0.06em; line-height: 1.65; color: var(--muted-w); flex: 1; }
        .cqa-demo .demo-card-enter {
          margin-top: 28px; font-size: 0.78rem; letter-spacing: 0.18em; color: var(--muted-w);
          display: flex; align-items: center; gap: 8px; transition: color 0.2s, gap 0.2s;
        }
        .cqa-demo .demo-card:hover .demo-card-enter { color: var(--amber); gap: 14px; }
        .cqa-demo .status-bar {
          display: flex; align-items: center; gap: 20px; padding: 9px 22px;
          background: var(--w-surface); border-top: 1px solid var(--border-w);
          font-size: 0.75rem; letter-spacing: 0.1em; color: var(--muted-w); flex-shrink: 0;
        }
        .cqa-demo .status-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--amber);
          box-shadow: 0 0 6px var(--amber); animation: cqa-pulse 2s infinite;
        }
        .cqa-demo .status-online { color: var(--amber); }
        .cqa-demo .status-right  { margin-left: auto; }
        @keyframes cqa-fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cqa-glowBreathe {
          0%, 100% { text-shadow: 0 0 30px rgba(245,166,35,0.4), 0 0 80px rgba(245,166,35,0.15); }
          50%       { text-shadow: 0 0 50px rgba(245,166,35,0.7), 0 0 120px rgba(245,166,35,0.28); }
        }
        @media (max-width: 680px) {
          .cqa-demo .card-row { flex-direction: column; gap: 12px; }
          .cqa-demo .demo-card { width: 100%; max-width: 340px; }
        }
      `}</style>

      <div className="cqa-demo" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

        <div className="top-bar">
          <Link to="/cognitive-qa" className="back-link">&#8592; BACK</Link>
          <Link to="/cognitive-qa" className="brand">
            <div className="brand-dot"></div>
            COGNITIVE QA
          </Link>
          <div className="top-bar-right">DEMO</div>
        </div>

        <div className="demo-wrap">
          <div className="scene" aria-hidden="true">
            <div className="scene-grid"></div>
            <div className="scene-glow"></div>
            <div className="scene-vignette"></div>
            <div className="scene-scan"></div>
          </div>

          <div className="demo-inner">

            <div className="eyebrow">
              <div className="eyebrow-line"></div>
              SELECT INSPECTION VIEW
              <div className="eyebrow-line"></div>
            </div>

            <h1 className="demo-title">LIVE <span className="accent">DEMO</span></h1>
            <p className="demo-sub">CHOOSE A ROLE TO ENTER THE SIMULATION</p>

            <div className="card-row">

              <Link to="/cognitive-qa/boeing" className="demo-card">
                <div className="demo-card-bar"></div>
                <div className="demo-card-shimmer"></div>
                <div className="demo-card-tag">01 / MANUFACTURER</div>
                <div className="demo-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17l5-10 3 6 2-3 4 7H3z"/>
                    <path d="M17 7l2 2M19 5l-2 2"/>
                    <circle cx="19" cy="5" r="2"/>
                  </svg>
                </div>
                <div className="demo-card-title">BOEING INSPECTOR</div>
                <div className="demo-card-desc">Assembly line quality control. Real-time AI scan of wing components against the digital twin. Defects flagged spatially as they occur.</div>
                <div className="demo-card-enter">ENTER VIEW &#8594;</div>
              </Link>

              <Link to="/cognitive-qa/mro" className="demo-card">
                <div className="demo-card-bar"></div>
                <div className="demo-card-shimmer"></div>
                <div className="demo-card-tag">02 / MAINTENANCE</div>
                <div className="demo-card-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
                  </svg>
                </div>
                <div className="demo-card-title">MRO INSPECTOR</div>
                <div className="demo-card-desc">In-service maintenance verification. Full inspection history at a glance. Every prior check, every variance, every sign-off in one verified record.</div>
                <div className="demo-card-enter">ENTER VIEW &#8594;</div>
              </Link>

            </div>
          </div>
        </div>

        <div className="status-bar">
          <div className="status-dot"></div>
          <span className="status-online">PLATFORM ONLINE</span>
          <span>COGNITIVE QA / DEMO</span>
          <span className="status-right">v2.4.1</span>
        </div>

      </div>
    </div>
  );
}
