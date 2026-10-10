import { Link } from '@/lib/router-compat';
import { useEffect } from 'react';
import './cognitive-qa-amber.css';

export default function CognitiveQAStrategy() {
  useEffect(() => {
    // ── READING PROGRESS ──
    const progressBar = document.getElementById('cqa-s-progress') as HTMLElement | null;
    function onScroll() {
      if (!progressBar) return;
      const doc = document.documentElement;
      const scrolled = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      progressBar.style.width = (scrolled * 100) + '%';
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── SCROLL REVEALS ──
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.cqa-s-wrap .reveal, .cqa-s-wrap .reveal-up').forEach(el => revealObs.observe(el));

    // ── STAT COUNTERS ──
    function formatStat(el: HTMLElement, value: number): string {
      const pre = (el as HTMLElement & { dataset: DOMStringMap }).dataset.prefix || '';
      const suf = (el as HTMLElement & { dataset: DOMStringMap }).dataset.suffix || '';
      const dec = parseInt((el as HTMLElement & { dataset: DOMStringMap }).dataset.decimals || '0') || 0;
      return pre + value.toFixed(dec) + suf;
    }

    function runCounter(el: HTMLElement) {
      const target = parseFloat((el as HTMLElement & { dataset: DOMStringMap }).dataset.target || '0');
      const duration = 1800;
      const start = performance.now();
      (el as HTMLElement & { dataset: DOMStringMap }).dataset.run = '1';

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
        const el = e.target as HTMLElement & { dataset: DOMStringMap };
        if (e.isIntersecting && !el.dataset.run) {
          runCounter(el as HTMLElement);
          statObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.cqa-s-wrap .stat-num').forEach(el => statObs.observe(el));

    // ── GTM PHASES SEQUENTIAL LIGHT-UP ──
    const phaseObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ['ph1', 'ph2', 'ph3', 'ph4'].forEach((id, i) => {
            setTimeout(() => {
              const el = document.getElementById(id);
              if (el) el.classList.add('active');
            }, i * 260);
          });
          phaseObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.25 });

    const pt = document.getElementById('phasesTrack');
    if (pt) phaseObs.observe(pt);

    // ── TAM BARS ANIMATE ──
    const tamObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.cqa-s-wrap .tam-row').forEach((row, i) => {
            setTimeout(() => row.classList.add('bar-animate'), i * 150);
          });
          tamObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    const tamRowsEl = document.getElementById('tamRows');
    if (tamRowsEl) tamObs.observe(tamRowsEl);

    // ── BEYOND CARDS STAGGER ──
    const beyondObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ['bc1', 'bc2', 'bc3', 'bc4', 'bc5'].forEach((id, i) => {
            setTimeout(() => {
              const el = document.getElementById(id);
              if (el) el.classList.add('visible');
            }, i * 100);
          });
          beyondObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

    const bgEl = document.getElementById('beyondGrid');
    if (bgEl) beyondObs.observe(bgEl);

    // ── CLOSING LINES STAGGER ──
    const closingObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          ['cl1', 'cl2', 'cl3', 'cltag'].forEach((id, i) => {
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
      phaseObs.disconnect();
      tamObs.disconnect();
      beyondObs.disconnect();
      closingObs.disconnect();
    };
  }, []);

  return (
    <div className="cqa-amber cqa-s-wrap" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="progress-bar" id="cqa-s-progress"></div>

      <div className="top-bar">
        <Link to="/cognitive-qa" className="back-link">← BACK</Link>
        <Link to="/cognitive-qa" className="brand">
          <div className="brand-dot"></div>
          COGNITIVE QA
        </Link>
        <div className="top-bar-right">PRODUCT STRATEGY</div>
      </div>

      {/* ── HERO ── */}
      <section className="hero" aria-label="Strategy overview">
        <div className="hero-bg-grid"></div>
        <div className="hero-bg-glow"></div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot"></div>
            COGNITIVE QA / PRODUCT STRATEGY / 2025
          </div>
          <div className="hero-word">THE<br/>STRATEGY.</div>
          <span className="hero-subword">Built on Proven Technology. Designed for What Comes Next.</span>
          <div className="hero-statement">
            <p>Cognitive QA is the first AI-powered inspection platform that creates a <span className="hi">verified, tamper-proof record</span> of aircraft quality at every stage of its life. From the assembly line to the maintenance hangar.</p>
            <p>For the first time, quality does not have to be rediscovered at every handoff. It travels with the aircraft.</p>
          </div>
          <p className="hero-tagline">WHERE AI MEETS THE GOLD STANDARD OF SAFETY</p>
        </div>
        <div className="hero-scroll-cue" aria-hidden="true">▼ SCROLL</div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="stats-band" role="region" aria-label="Market statistics">
        <div className="stat-cell">
          <span className="stat-num" data-target="328" data-prefix="$" data-suffix="B">$328B</span>
          <div className="stat-label">AIRCRAFT MANUFACTURING MARKET (2024)</div>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="135" data-prefix="$" data-suffix="B">$135B</span>
          <div className="stat-label">GLOBAL MRO MARKET</div>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="471" data-prefix="$" data-suffix="B">$471B</span>
          <div className="stat-label">COMBINED ADDRESSABLE OPPORTUNITY</div>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="85" data-suffix="%">85%</span>
          <div className="stat-label">OF OPERATORS ALREADY INVESTING IN AI</div>
        </div>
      </div>

      {/* ── THE PROBLEM ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The Problem We Are Solving</div>
          <h2 className="section-heading reveal">Aviation does not have a safety<br/><span className="red">ambition problem.</span> It has a process problem.</h2>
          <div className="body-text reveal">
            <p>Boeing, MRO companies, airlines, and regulators all want the same outcome. An aircraft that is safe to fly. But each of them has to verify that independently, from scratch, because no shared, trustworthy record of quality has ever existed.</p>
          </div>

          <div className="gap-callout reveal">
            <div className="gap-callout-label">THE STRUCTURAL FAILURE</div>
            <div className="gap-callout-text"><span>Four handoffs.</span> Four gaps. Four opportunities to miss something.</div>
          </div>

          <div className="incident-row" role="list">
            <div className="incident-card reveal-up" role="listitem" style={{ transitionDelay: '0ms' }}>
              <span className="inc-badge badge-crit">CRITICAL</span>
              <p className="inc-flight">Alaska Airlines 1282</p>
              <div className="inc-stat">4 BOLTS</div>
              <p className="inc-desc">Left the factory missing four critical bolts. A door plug failed at altitude over Oregon.</p>
            </div>
            <div className="incident-card warn reveal-up" role="listitem" style={{ transitionDelay: '80ms' }}>
              <span className="inc-badge badge-warn">WARNING</span>
              <p className="inc-flight">LATAM Dreamliner</p>
              <div className="inc-stat">50 INJURED</div>
              <p className="inc-desc">Dropped without warning mid-flight. No alert. No time to react.</p>
            </div>
            <div className="incident-card reveal-up" role="listitem" style={{ transitionDelay: '160ms' }}>
              <span className="inc-badge badge-crit">CRITICAL</span>
              <p className="inc-flight">Jeju Air 2216</p>
              <div className="inc-stat">179 LIVES</div>
              <p className="inc-desc">Crashed on December 29th, 2024. 179 of 181 people on board did not survive.</p>
            </div>
          </div>

          <div className="body-text reveal">
            <p>These incidents did not happen because people stopped caring. They happened because <strong>the process was not built to catch what human eyes can miss.</strong> The current approach to commercial aircraft inspection is built on manual processes, paper checklists, and individual sign-offs. It has no mechanism for creating a continuous, verifiable record of quality across the full lifecycle of an aircraft.</p>
            <p>That is the gap Cognitive QA was built to close.</p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE REPLACE ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">What Cognitive QA Replaces</div>
          <h2 className="section-heading reveal">Not an upgrade to the old process.<br/><span className="amber">A replacement of it.</span></h2>
          <div className="body-text reveal">
            <p>Today, inspectors work from printed or digital checklists, verify components by eye, and sign off based on training and experience. When the aircraft moves from one party to the next, that record does not move with it. Cognitive QA replaces that process entirely.</p>
          </div>

          <div className="replace-grid reveal">
            <div className="replace-col before">
              <div className="replace-col-label">BEFORE: CURRENT STATE</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Manual visual checks, no spatial record</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Paper and digital checklists</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Sign-offs based on experience only</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>No real-time comparison against blueprint</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Record stays behind when aircraft moves</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Every party re-verifies from scratch</div>
            </div>
            <div className="replace-col after">
              <div className="replace-col-label">AFTER: COGNITIVE QA</div>
              <div className="replace-item"><div className="replace-icon check">✓</div>Real-time AI scan against digital twin</div>
              <div className="replace-item"><div className="replace-icon check">✓</div>Spatially anchored, tamper-proof record</div>
              <div className="replace-item"><div className="replace-icon check">✓</div>Every inspector performs at senior level</div>
              <div className="replace-item"><div className="replace-icon check">✓</div>Live deviation flagging during assembly</div>
              <div className="replace-item"><div className="replace-icon check">✓</div>Verified record travels with the aircraft</div>
              <div className="replace-item"><div className="replace-icon check">✓</div>One chain of trust across all parties</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The Platform</div>
          <h2 className="section-heading reveal">An inspector that never forgets,<br/>never overlooks, <span className="amber">never assumes.</span></h2>
          <div className="body-text reveal">
            <p>Cognitive QA is not a standalone application. It is a platform built on two of the most powerful enterprise technologies available today. Together, they create something the aviation industry has never had before.</p>
          </div>

          <div className="platform-grid reveal">
            <div className="platform-card">
              <div className="platform-card-bg"></div>
              <div className="platform-num">01 / INTELLIGENCE</div>
              <div className="platform-title">MICROSOFT<br/>COPILOT</div>
              <div className="platform-tech">AI CORE</div>
              <div className="platform-body">Pre-loaded with the complete blueprint library of an aircraft before a single inspection begins. Every measurement. Every specification. Every component mapped and understood. During inspection, Copilot reads the aircraft in real time, comparing what it sees against what should be there.</div>
            </div>
            <div className="platform-card">
              <div className="platform-card-bg"></div>
              <div className="platform-num">02 / DELIVERY</div>
              <div className="platform-title">MICROSOFT<br/>HOLOLENS 2</div>
              <div className="platform-tech">AUGMENTED REALITY</div>
              <div className="platform-body">Purpose-built for industrial quality control. Gives the inspector a live augmented view of the aircraft during assembly. Every deviation flagged. Every variance logged. Every component verified against the digital twin in real time. The inspector sees not just the aircraft, but the truth about the aircraft.</div>
            </div>
            <div className="platform-card">
              <div className="platform-card-bg"></div>
              <div className="platform-num">03 / THE RECORD</div>
              <div className="platform-title">VERIFIED<br/>AUDIT TRAIL</div>
              <div className="platform-tech">TAMPER-PROOF</div>
              <div className="platform-body">Every inspection generates a tamper-proof digital record, spatially anchored to the exact components checked, verified against original specification, stored in a format every downstream party can trust. Boeing, airlines, MRO, regulators. One record. Irrefutable proof at every stage.</div>
            </div>
          </div>

          <div className="body-text reveal">
            <p>Quality does not have to be rediscovered at every handoff. <strong>It travels with the aircraft.</strong></p>
          </div>
        </div>
      </section>

      {/* ── INFOGRAPHIC ── */}
      <div className="infographic-section reveal">
        <div className="infographic-label">COGNITIVE QA / REAL-TIME DIAGNOSTIC SCAN</div>
        <div className="infographic-wrap">
          <img src="/cognitive-qa/Cognitive%20QA%20Inforgraphic.png" alt="Cognitive QA: The Future of Aerospace Inspection — Real-Time Diagnostic Scan" className="infographic-img" />
        </div>
      </div>

      {/* ── PROVEN ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Proven Where It Matters Most</div>
          <h2 className="section-heading reveal">Defense grade.<br/><span className="amber">Commercial scale.</span></h2>
          <div className="body-text reveal">
            <p>The Microsoft HoloLens 2 is not untested in aviation. <strong>Boeing has already deployed it in partnership with the government</strong> to improve defense aircraft manufacturing. Airbus is moving toward AR-assisted inspection on the commercial side. The technology has proven itself in the most demanding, high-stakes environments the industry has to offer.</p>
            <p>But there is a gap. That same proven technology has never been applied to commercial aircraft manufacturing. The aircraft that carry millions of passengers every single day are still being inspected with manual processes that defense aviation left behind years ago.</p>
            <p>Defense aircraft operate under some of the strictest quality standards in the world. Every component verified. Every system tested. Every deviation documented. Commercial aviation deserves that same standard. Not because regulators require it. Because the public depends on it.</p>
            <p><strong>Cognitive QA brings the rigor of defense-grade quality control to the commercial manufacturing floor for the first time.</strong></p>
          </div>
        </div>
      </section>

      {/* ── GO-TO-MARKET ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Go-To-Market</div>
          <h2 className="section-heading reveal">A deliberately <span className="amber">sequenced</span> strategy.</h2>
          <div className="body-text reveal">
            <p>Cognitive QA operates as a B2B enterprise platform. The strategy starts at the source and expands outward.</p>
          </div>

          <div className="phases-track reveal" id="phasesTrack">
            <div className="phase-row" id="ph1">
              <div className="phase-number-col">
                <div className="phase-num">01</div>
                <div className="phase-connector"></div>
              </div>
              <div className="phase-content">
                <div className="phase-tag">PHASE ONE / BEACHHEAD</div>
                <div className="phase-heading">Boeing Assembly Line</div>
                <div className="phase-body">The primary target and the reference customer that changes every conversation that follows. Defects caught before a panel is sealed cost a fraction of what they cost to fix after the fact, and a fraction of a fraction of what they cost if they reach a passenger. Winning Boeing unlocks every door in the industry.</div>
              </div>
            </div>
            <div className="phase-row" id="ph2">
              <div className="phase-number-col">
                <div className="phase-num">02</div>
                <div className="phase-connector"></div>
              </div>
              <div className="phase-content">
                <div className="phase-tag">PHASE TWO / EXPANSION</div>
                <div className="phase-heading">MRO Companies</div>
                <div className="phase-body">The second critical window of quality control. MRO inspectors certify aircraft already in service, under time pressure, working from documentation and experience rather than real-time spatial intelligence. Cognitive QA gives every MRO inspector, regardless of experience level, the capability of the most senior one on the team.</div>
              </div>
            </div>
            <div className="phase-row" id="ph3">
              <div className="phase-number-col">
                <div className="phase-num">03</div>
                <div className="phase-connector"></div>
              </div>
              <div className="phase-content">
                <div className="phase-tag">PHASE THREE / SCALE</div>
                <div className="phase-heading">Defense and Government</div>
                <div className="phase-body">Building on the existing relationship between the HoloLens platform and defense procurement workflows. Full audit trail support embedded from day one, meeting the documentation requirements of government contracts from the ground up.</div>
              </div>
            </div>
            <div className="phase-row" id="ph4">
              <div className="phase-number-col">
                <div className="phase-num">04</div>
                <div className="phase-connector"></div>
              </div>
              <div className="phase-content">
                <div className="phase-tag">PHASE FOUR / PLATFORM</div>
                <div className="phase-heading">Beyond Aviation</div>
                <div className="phase-body">Aviation is the proof of concept. Once Cognitive QA has established the standard, the platform scales into any industry where a single defect can have catastrophic consequences. Automotive. Maritime. Spacecraft. The foundation built in aviation becomes the entry point into every precision-critical industry that follows.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAM ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Total Addressable Market</div>
          <h2 className="section-heading reveal">A <span className="amber">$471 billion</span> opportunity<br/>that no one has addressed.</h2>
          <div className="body-text reveal">
            <p>The combined opportunity across commercial aircraft manufacturing, global MRO, and MRO software is not theoretical. These are active markets under pressure, with operators already investing in AI and regulators demanding higher standards.</p>
          </div>

          <div className="tam-rows reveal" id="tamRows">
            <div className="tam-row" style={{ ['--bar-w' as string]: '100%' }}>
              <div className="tam-amount">$328B</div>
              <div>
                <div className="tam-label">Commercial Aircraft Manufacturing</div>
                <div className="tam-bar-wrap"><div className="tam-bar"></div></div>
              </div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--muted-w)', whiteSpace: 'nowrap' }}>2024 MARKET</div>
            </div>
            <div className="tam-row" style={{ ['--bar-w' as string]: '41%' }}>
              <div className="tam-amount">$135B</div>
              <div>
                <div className="tam-label">Global MRO Market</div>
                <div className="tam-bar-wrap"><div className="tam-bar"></div></div>
              </div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--muted-w)', whiteSpace: 'nowrap' }}>TOTAL MRO</div>
            </div>
            <div className="tam-row" style={{ ['--bar-w' as string]: '2.3%' }}>
              <div className="tam-amount">$7.7B</div>
              <div>
                <div className="tam-label">MRO Software Segment — projected $11.68B by 2032</div>
                <div className="tam-bar-wrap"><div className="tam-bar"></div></div>
              </div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--muted-w)', whiteSpace: 'nowrap' }}>TO $11.68B</div>
            </div>
            <div className="tam-row highlight" style={{ ['--bar-w' as string]: '100%' }}>
              <div className="tam-amount">$471B</div>
              <div>
                <div className="tam-label">Combined Addressable Opportunity</div>
                <div className="tam-bar-wrap"><div className="tam-bar" style={{ background: 'linear-gradient(90deg,var(--amber),var(--orange))' }}></div></div>
              </div>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'var(--amber)', whiteSpace: 'nowrap' }}>TOTAL</div>
            </div>
          </div>

          <div className="tam-insight reveal">
            <strong>85% of operators</strong> and nearly half of all MRO companies are already actively investing in AI. The demand is there. The market is ready. <strong>The solution has not existed until now.</strong>
          </div>
        </div>
      </section>

      {/* ── BEYOND AVIATION ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The Path Beyond Aviation</div>
          <h2 className="section-heading reveal">Aviation is the proof of concept.<br/><span className="amber">The platform is universal.</span></h2>
          <div className="body-text reveal">
            <p>The same framework that verifies a bolt on a 737 can verify a weld on a naval vessel, a component in an armored vehicle, or a part on a spacecraft. The foundation being built in aviation becomes the entry point into every precision-critical industry that follows.</p>
          </div>

          <div className="beyond-grid" id="beyondGrid" aria-label="Industries beyond aviation">
            <div className="beyond-card" id="bc1">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="beyond-name">AVIATION</div>
              <div className="beyond-desc">The beachhead. Commercial manufacturing. The proof.</div>
            </div>
            <div className="beyond-card" id="bc2">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-4 0v2M12 12v4M8 12v2"/>
                </svg>
              </div>
              <div className="beyond-name">AUTOMOTIVE</div>
              <div className="beyond-desc">Assembly line verification at production scale.</div>
            </div>
            <div className="beyond-card" id="bc3">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l9-14 9 14H3z"/>
                  <path d="M12 17v-5M9 14h6"/>
                </svg>
              </div>
              <div className="beyond-name">MARITIME</div>
              <div className="beyond-desc">Naval and commercial hull and system inspection.</div>
            </div>
            <div className="beyond-card" id="bc4">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <div className="beyond-name">DEFENSE</div>
              <div className="beyond-desc">Where the standard was set. Where the scale now follows.</div>
            </div>
            <div className="beyond-card" id="bc5">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
                </svg>
              </div>
              <div className="beyond-name">SPACECRAFT</div>
              <div className="beyond-desc">Zero tolerance. Every component. Every time.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY NOW ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Why Now</div>
          <h2 className="section-heading reveal">The question is not <span className="red">whether</span> this comes<br/>to commercial aviation.</h2>
          <div className="body-text reveal">
            <p>There is a reason this solution exists now and not ten years ago. The convergence of technology, regulatory pressure, and industry failure has created a window that did not exist before.</p>
          </div>

          <div className="why-items reveal">
            <div className="why-item">
              <span className="why-tag">AI</span>
              <div className="why-text">Artificial intelligence has matured to the point where real-time spatial inspection against a digital twin is not a research project. It is a deployable enterprise system.</div>
            </div>
            <div className="why-item">
              <span className="why-tag">HOLOLENS</span>
              <div className="why-text">The Microsoft HoloLens 2 has become a proven enterprise platform. Boeing's own defense division is already using it. Airbus is moving in this direction on the commercial side.</div>
            </div>
            <div className="why-item">
              <span className="why-tag danger">PRECEDENT</span>
              <div className="why-text">The incidents of 2024 are not flukes. They are the direct outcome of a process that was never designed for the scale and complexity of modern commercial aircraft. Regulators have noticed. The public has noticed.</div>
            </div>
            <div className="why-item">
              <span className="why-tag danger">BOEING</span>
              <div className="why-text"><span className="red">Boeing reported an $11.8 billion loss in 2024</span> and pleaded guilty to federal criminal fraud charges for deceiving the FAA. The industry is under regulatory, financial, and public pressure that it has never faced at this scale before.</div>
            </div>
            <div className="why-item">
              <span className="why-tag">THE GAP</span>
              <div className="why-text">The same proven technology used in defense aircraft manufacturing has never been applied to commercial aviation. That gap is the opportunity. And it has a closing window.</div>
            </div>
            <div className="why-item">
              <span className="why-tag">FIRST MOVER</span>
              <div className="why-text">The question is not whether this comes to commercial aviation. The question is who builds it first. The company that establishes this standard owns the network effect, the data flywheel, and the regulatory relationship that follows.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <footer className="closing-strategy" aria-label="Closing statement">
        <div className="closing-lines">
          <p className="closing-line" id="cl1">The technology is here.</p>
          <p className="closing-line" id="cl2">The need is clear.</p>
          <p className="closing-line amber" id="cl3">The time to act is now.</p>
        </div>
        <p className="closing-tagline" id="cltag">WHERE AI MEETS THE GOLD STANDARD OF SAFETY</p>
      </footer>

      {/* ── STATUS BAR ── */}
      <div className="status-bar" style={{ marginTop: 'auto' }}>
        <div className="status-dot"></div>
        <span className="status-online">PLATFORM ONLINE</span>
        <span>COGNITIVE QA / STRATEGY</span>
        <span className="status-right">v2.4.1</span>
      </div>
    </div>
  );
}
