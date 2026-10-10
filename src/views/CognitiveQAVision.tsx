// @ts-nocheck -- imported code written for looser TypeScript settings
import { Link } from '@/lib/router-compat';
import { useEffect, useState } from 'react';
import './cognitive-qa-amber.css';

export default function CognitiveQAVision() {
  const [activeTab, setActiveTab] = useState('boeing');

  useEffect(() => {
    // Reading progress
    const progressBar = document.getElementById('cqa-progress') as HTMLElement | null;
    function onScroll() {
      if (!progressBar) return;
      const doc = document.documentElement;
      const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      progressBar.style.width = (scrolled * 100) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // Scroll reveals
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.cqa-vision .reveal, .cqa-vision .reveal-up').forEach(el => revealObs.observe(el));

    // Stat counters
    function formatStat(el: HTMLElement, value: number) {
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      const dec = parseInt(el.dataset.decimals || '0') || 0;
      return pre + value.toFixed(dec) + suf;
    }

    function runCounter(el: HTMLElement) {
      const target = parseFloat(el.dataset.target || '0');
      const duration = 1800;
      const start = performance.now();
      el.dataset.run = '1';
      function step(now: number) {
        const p = Math.min((now - start) / duration, 1);
        const t = 1 - Math.pow(1 - p, 3);
        el.textContent = formatStat(el, t * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = formatStat(el, target);
      }
      requestAnimationFrame(step);
    }

    const statObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting && !el.dataset.run) {
          runCounter(el);
          statObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.cqa-vision .stat-num').forEach(el => statObs.observe(el));

    // Chain node light-up
    const chainObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ['cn1','cn2','cn3','cn4'].forEach((id, i) => {
            setTimeout(() => {
              const el = document.getElementById(id);
              if (el) el.classList.add('active');
            }, i * 220);
          });
          chainObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });

    const ct = document.getElementById('chainTrack');
    if (ct) chainObs.observe(ct);

    // Closing lines
    const closingObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ['cl1','cl2','cl3','cltag'].forEach((id, i) => {
            setTimeout(() => {
              const el = document.getElementById(id);
              if (el) el.classList.add('visible');
            }, i * 220);
          });
          closingObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    const cl = document.getElementById('cl1');
    if (cl) closingObs.observe(cl);

    return () => {
      window.removeEventListener('scroll', onScroll);
      revealObs.disconnect();
      statObs.disconnect();
      chainObs.disconnect();
      closingObs.disconnect();
    };
  }, []);

  return (
    <div className="cqa-amber cqa-vision">
      <div id="cqa-progress" className="progress-bar" aria-hidden="true"></div>

      <div className="top-bar top-bar-sticky">
        <Link to="/cognitive-qa" className="back-link" aria-label="Back to home">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M7 1L3 5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          BACK
        </Link>
        <Link to="/cognitive-qa" className="brand brand-sm">
          <div className="brand-dot-sm"></div>
          COGNITIVE QA
        </Link>
        <span className="top-bar-right">VISION BRIEF</span>
      </div>

      <header className="hero" aria-label="Vision Brief opening">
        <div className="hero-bg-grid" aria-hidden="true"></div>
        <div className="hero-bg-glow" aria-hidden="true"></div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" aria-hidden="true"></div>
            COGNITIVE QA / VISION BRIEF / 2025
          </div>

          <p className="hero-setup">The System Isn't Just</p>
          <h1 className="hero-broken" aria-label="BROKEN.">BROKEN.</h1>
          <span className="hero-suffix">It Has Been Broken for Years.</span>

          <div className="hero-body">
            <p>2024 was a difficult year for aviation. A door plug blew out mid-flight over Oregon. A Dreamliner suddenly plunged, injuring 50 passengers. And on December 29th, Jeju Air Flight 2216 crashed in South Korea, killing 179 of 181 people on board.</p>
            <p>Each incident was different. But each one pointed to the same underlying problem.</p>
          </div>
        </div>

        <div className="hero-scroll-cue" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          SCROLL
        </div>
      </header>

      <div className="stats-band" role="region" aria-label="Key statistics">
        <div className="stat-cell">
          <span className="stat-num" data-target="1.45" data-suffix="T" data-prefix="$" data-decimals="2">$0T</span>
          <p className="stat-label">U.S. Aviation Economic Output</p>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="10" data-suffix="M" data-prefix="" data-decimals="0">0M</span>
          <p className="stat-label">Jobs Supported</p>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="11.8" data-suffix="B" data-prefix="$" data-decimals="1">$0B</span>
          <p className="stat-label">Boeing Loss in 2024</p>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="487" data-suffix="M" data-prefix="$" data-decimals="0">$0M</span>
          <p className="stat-label">Federal Fraud Fine</p>
        </div>
      </div>

      <section className="section reveal">
        <div className="section-inner">
          <div className="section-label">Scale of the Stakes</div>
          <div className="body-text">
            <p>The U.S. commercial aviation industry represents <strong>$1.45 trillion in economic output</strong> and supports <strong>10 million jobs</strong>. Yet Boeing alone reported a loss of <strong>$11.8 billion in 2024</strong> due to operational failures and quality issues.</p>
            <p>And in July 2024, Boeing pleaded guilty to federal criminal fraud charges for deliberately deceiving the FAA during the certification of the 737 Max, agreeing to pay up to <strong>$487 million in fines</strong>.</p>
            <p>These are not isolated events. They are symptoms of a system that has not kept pace with the complexity of modern aircraft manufacturing.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The Human Cost</div>
          <h2 className="section-heading reveal">Every defect that leaves a factory floor<br/>is the result of a <span className="red">missed step.</span></h2>
          <div className="body-text reveal">
            <p>A bolt not checked. A bracket not verified. A manual inspection process that was never designed to handle the scale and complexity of a modern commercial aircraft.</p>
          </div>

          <div className="incident-grid" role="list">
            <div className="incident-card reveal-up" role="listitem" style={{transitionDelay:'0ms'}}>
              <span className="incident-badge badge-crit">CRITICAL</span>
              <p className="incident-flight">Alaska Airlines 1282</p>
              <div className="incident-stat">4 BOLTS</div>
              <p className="incident-desc">Left the factory missing four critical bolts. A door plug failed at altitude over Oregon.</p>
            </div>
            <div className="incident-card warn reveal-up" role="listitem" style={{transitionDelay:'80ms'}}>
              <span className="incident-badge badge-warn">WARNING</span>
              <p className="incident-flight">LATAM Dreamliner</p>
              <div className="incident-stat">50 INJURED</div>
              <p className="incident-desc">Dropped without warning mid-flight. No alert. No time to react.</p>
            </div>
            <div className="incident-card reveal-up" role="listitem" style={{transitionDelay:'160ms'}}>
              <span className="incident-badge badge-crit">CRITICAL</span>
              <p className="incident-flight">Jeju Air 2216</p>
              <div className="incident-stat">179 LIVES</div>
              <p className="incident-desc">Crashed in South Korea on December 29th, 2024. 179 people did not survive.</p>
            </div>
          </div>

          <div className="body-text reveal">
            <p>These incidents did not happen because people stopped caring. They happened because the process was not built to catch what human eyes can miss.</p>
          </div>

          <div className="pull-quote reveal">
            <p className="pull-quote-text">But what if the inspector <span className="hi">never missed a thing?</span> What if every bolt, fastener, and bracket was verified in real time, on the factory floor, before the aircraft ever left the ground?</p>
            <p className="pull-quote-tagline">WHERE AI MEETS THE GOLD STANDARD OF SAFETY</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The Gaps in the Chain</div>
          <h2 className="section-heading reveal">Four handoffs. <span className="red">Four opportunities to miss something.</span></h2>
          <div className="body-text reveal">
            <p>Right now, every party in the aviation supply chain has to reverify everything from scratch because they cannot fully trust what came before them.</p>
          </div>

          <div className="chain-wrap reveal" aria-label="Supply chain handoff diagram">
            <div className="chain-track" id="chainTrack">
              <div className="chain-node" id="cn1">
                <p className="chain-node-party">BOEING</p>
                <p className="chain-node-action">Inspects during assembly</p>
              </div>
              <div className="chain-gap">
                <div className="chain-gap-line"></div>
                <span className="chain-gap-label">GAP 1</span>
              </div>
              <div className="chain-node" id="cn2">
                <p className="chain-node-party">FAA</p>
                <p className="chain-node-action">Audits Boeing</p>
              </div>
              <div className="chain-gap">
                <div className="chain-gap-line"></div>
                <span className="chain-gap-label">GAP 2</span>
              </div>
              <div className="chain-node" id="cn3">
                <p className="chain-node-party">AIRLINES</p>
                <p className="chain-node-action">Inspect on delivery</p>
              </div>
              <div className="chain-gap">
                <div className="chain-gap-line"></div>
                <span className="chain-gap-label">GAP 3</span>
              </div>
              <div className="chain-node" id="cn4">
                <p className="chain-node-party">MRO</p>
                <p className="chain-node-action">Inspect during service</p>
              </div>
            </div>
            <div className="chain-summary">
              <strong>Four handoffs. Four gaps.</strong> Each party starts from zero because the last verification cannot be trusted.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">How Cognitive QA Works</div>
          <h2 className="section-heading reveal">The inspector <span className="amber">sees it.</span><br/>In the moment it matters.</h2>

          <div className="reveal">
            <div className="tabs-row" role="tablist" aria-label="Use case selector">
              <button
                className={`tab-btn${activeTab === 'boeing' ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === 'boeing'}
                aria-controls="tab-boeing"
                id="btn-boeing"
                onClick={() => setActiveTab('boeing')}
              >ASSEMBLY LINE</button>
              <button
                className={`tab-btn${activeTab === 'mro' ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === 'mro'}
                aria-controls="tab-mro"
                id="btn-mro"
                onClick={() => setActiveTab('mro')}
              >MRO COMPANIES</button>
              <button
                className={`tab-btn${activeTab === 'chain' ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === 'chain'}
                aria-controls="tab-chain"
                id="btn-chain"
                onClick={() => setActiveTab('chain')}
              >THE CHAIN</button>
            </div>

            <div className={`tab-panel${activeTab === 'boeing' ? ' active' : ''}`} id="tab-boeing" role="tabpanel" aria-labelledby="btn-boeing">
              <p className="tab-panel-heading">Boeing / Assembly Line</p>
              <div className="tab-panel-body">
                <p>Cognitive QA puts a HoloLens on the engineer and overlays a live digital twin of the aircraft blueprint onto the physical plane in front of them. The AI scans in real time and flags deviations, damage, and defects spatially anchored to the exact part of the aircraft where the issue exists.</p>
                <p>The inspector does not have to guess or cross-reference a paper checklist. <strong>They see it.</strong></p>
                <p>Defects caught before a panel is sealed cost a fraction of what they cost to fix after the fact, and a fraction of a fraction of what they cost if they reach a passenger. Cognitive QA catches those defects in the moment the work is happening, not after a sign-off, not after an audit, not after an incident.</p>
              </div>
            </div>

            <div className={`tab-panel${activeTab === 'mro' ? ' active' : ''}`} id="tab-mro" role="tabpanel" aria-labelledby="btn-mro">
              <p className="tab-panel-heading">MRO Companies / Maintenance</p>
              <div className="tab-panel-body">
                <p>For MRO companies, the value is speed, consistency, and certainty.</p>
                <p><strong>Every inspector, regardless of experience level, performs at the level of your most senior one.</strong></p>
                <p>The HoloLens overlay eliminates the gap between a 30-year veteran and a technician on their second year. The AI carries the institutional knowledge. The human executes with full confidence.</p>
              </div>
            </div>

            <div className={`tab-panel${activeTab === 'chain' ? ' active' : ''}`} id="tab-chain" role="tabpanel" aria-labelledby="btn-chain">
              <p className="tab-panel-heading">The Unbroken Chain</p>
              <div className="tab-panel-body">
                <p>Cognitive QA does not just close one of those gaps. It creates a <strong>single, unbroken, tamper-proof chain of verified truth</strong> that every party in that chain can rely on.</p>
                <p>Boeing's verification travels to the FAA. The FAA's record travels to the airline. The airline's history travels to MRO. For the first time, quality does not have to be rediscovered at every step.</p>
                <p><strong>It travels with the aircraft.</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mission reveal" role="region" aria-label="Mission statement">
        <p className="mission-kicker">OUR MISSION</p>
        <p className="mission-text">
          Cognitive QA exists to make<br/>
          <span className="amber">defect-free aviation</span><br/>
          the global standard.
        </p>
        <p className="mission-sub">NOT AS AN AMBITION. AS A PROCESS.</p>
        <p className="mission-tagline">WHERE AI MEETS THE GOLD STANDARD OF SAFETY</p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The World We Are Building</div>

          <div className="world-grid reveal">
            <div className="world-card">
              <span className="world-card-num">01</span>
              <p className="world-card-text">Every aircraft that leaves the factory floor carries a complete, verified record of its assembly.</p>
            </div>
            <div className="world-card">
              <span className="world-card-num">02</span>
              <p className="world-card-text">Regulators have access to irrefutable proof of quality compliance.</p>
            </div>
            <div className="world-card">
              <span className="world-card-num">03</span>
              <p className="world-card-text">Airlines can take delivery of an aircraft with full confidence in its history.</p>
            </div>
            <div className="world-card">
              <span className="world-card-num">04</span>
              <p className="world-card-text">Passengers can board knowing that every component was checked, verified, and documented before the aircraft ever left the ground.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Why Now</div>
          <h2 className="section-heading reveal">The technology has finally <span className="amber">caught up with the problem.</span></h2>

          <div className="whynow-points reveal">
            <div className="whynow-point">
              <span className="whynow-tag">AI</span>
              <p className="whynow-text"><strong>AI has matured.</strong> The models, the vision processing, the real-time inference — it all exists now in a form that can run on a wearable device on a factory floor.</p>
            </div>
            <div className="whynow-point">
              <span className="whynow-tag">HOLOLENS</span>
              <p className="whynow-text"><strong>The Microsoft HoloLens 2</strong> has become a proven enterprise platform, already deployed in defense aircraft manufacturing. The hardware is not experimental.</p>
            </div>
            <div className="whynow-point">
              <span className="whynow-tag">PRECEDENT</span>
              <p className="whynow-text">Boeing's own defense division already uses HoloLens for military aircraft. Airbus is moving toward AR-assisted inspection on the commercial side. <strong>The technology has been proven in adjacent contexts.</strong></p>
            </div>
            <div className="whynow-point">
              <span className="whynow-tag">THE GAP</span>
              <p className="whynow-text">What does not yet exist is a <strong>purpose-built AI inspection layer for commercial aircraft manufacturing at scale.</strong> That is the gap Cognitive QA fills.</p>
            </div>
            <div className="whynow-point">
              <span className="whynow-tag">THE COST</span>
              <p className="whynow-text">The cost of doing nothing has become impossible to ignore. The question is not whether this technology will come to commercial aviation. <strong>The question is who builds it first.</strong></p>
            </div>
          </div>

          <div className="body-text reveal">
            <p>This is not about reimagining aviation from scratch. It is about giving the people who build and maintain aircraft the tools they actually need to do their jobs with complete confidence.</p>
          </div>
        </div>
      </section>

      <footer className="closing" aria-label="Closing statement">
        <div className="closing-lines">
          <p className="closing-line lit"  id="cl1">The technology is here.</p>
          <p className="closing-line lit"  id="cl2">The need is clear.</p>
          <p className="closing-line amber" id="cl3">The time to act is now.</p>
        </div>
        <p className="closing-tagline" id="cltag">WHERE AI MEETS THE GOLD STANDARD OF SAFETY</p>
      </footer>

      <div className="status-bar status-bar-sm">
        <div className="status-dot"></div>
        <span className="status-online">PLATFORM ONLINE</span>
        <span>COGNITIVE QA / VISION</span>
        <span className="status-right">v2.4.1</span>
      </div>
    </div>
  );
}
