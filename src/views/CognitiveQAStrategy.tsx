// @ts-nocheck -- imported code written for looser TypeScript settings
import { Link } from '@/lib/router-compat';
import { useEffect } from 'react';
import './cognitive-qa-amber.css';
import ProjectCover from '@/components/ProjectCover';
import BackToTop from '@/components/BackToTop';
import CognitiveQANav from '@/components/CognitiveQANav';

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
          ['cl1', 'cl2', 'cl3'].forEach((id, i) => {
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

      <CognitiveQANav />

      {/* ── HERO ── */}
      <section className="hero" aria-label="Strategy overview">
        <div className="hero-content">
          <p className="hero-eyebrow">Cognitive QA product strategy, 2026</p>
          <h1 className="hero-word">THE<br/>STRATEGY</h1>
          <span className="hero-subword">Built on proven technology. Designed for what comes next.</span>
          <div className="hero-statement">
            <p>Cognitive QA is an AI inspection platform that keeps a <span className="hi">verified, tamper-proof record</span> of an aircraft's quality from the assembly line to the maintenance hangar.</p>
            <p>Each party that receives the aircraft gets that record instead of re-checking everything from scratch.</p>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="stats-band" role="region" aria-label="Market statistics">
        <div className="stat-cell">
          <span className="stat-num" data-target="328" data-prefix="$" data-suffix="B">$328B</span>
          <div className="stat-label">Commercial aircraft manufacturing market (2024)</div>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="135" data-prefix="$" data-suffix="B">$135B</span>
          <div className="stat-label">Aerospace and defense MRO market (2024)</div>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="471" data-prefix="$" data-suffix="B">$471B</span>
          <div className="stat-label">Combined addressable opportunity</div>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="63" data-suffix="%">63%</span>
          <div className="stat-label">Of airlines using AI in operations control</div>
        </div>
      </div>

      {/* ── THE PROBLEM ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The problem we are solving</div>
          <h2 className="section-heading reveal">Aviation has a <span className="red">process problem.</span><br/>Everyone already wants safety.</h2>
          <div className="body-text reveal">
            <p>Boeing, MRO companies, airlines, and regulators all want an aircraft that is safe to fly, but each has to verify that from scratch because there is no shared record of quality they can trust.</p>
          </div>

          <div className="gap-callout reveal">
            <div className="gap-callout-label">The structural failure</div>
            <div className="gap-callout-text"><span>Four parties check the same aircraft,</span> and every handoff is a chance to miss something.</div>
          </div>

          <div className="incident-row" role="list">
            <div className="incident-card reveal-up" role="listitem" style={{ transitionDelay: '0ms' }}>
              <span className="inc-badge badge-crit">Critical</span>
              <p className="inc-flight">Alaska Airlines 1282</p>
              <div className="inc-stat">4 bolts</div>
              <p className="inc-desc">Left the factory missing four critical bolts. A door plug failed at altitude over Oregon.</p>
            </div>
            <div className="incident-card warn reveal-up" role="listitem" style={{ transitionDelay: '80ms' }}>
              <span className="inc-badge badge-warn">Warning</span>
              <p className="inc-flight">LATAM Dreamliner</p>
              <div className="inc-stat">50 injured</div>
              <p className="inc-desc">Dropped suddenly mid-flight, with no warning to anyone on board.</p>
            </div>
            <div className="incident-card reveal-up" role="listitem" style={{ transitionDelay: '160ms' }}>
              <span className="inc-badge badge-crit">Critical</span>
              <p className="inc-flight">Jeju Air 2216</p>
              <div className="inc-stat">179 lives</div>
              <p className="inc-desc">Crashed on December 29th, 2024. 179 of 181 people on board did not survive.</p>
            </div>
          </div>

          <div className="body-text reveal">
            <p>The process behind these incidents was not built to catch what human eyes can miss. Commercial aircraft inspection still runs on manual checks, paper checklists, and individual sign-offs, and it keeps no continuous record of quality across an aircraft's life. Cognitive QA is built to close that gap.</p>
          </div>
        </div>
      </section>

      {/* ── WHAT WE REPLACE ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">What Cognitive QA replaces</div>
          <h2 className="section-heading reveal">A live check against the blueprint <span className="amber">replaces the paper checklist.</span></h2>
          <div className="body-text reveal">
            <p>Today, inspectors work from printed or digital checklists, verify components by eye, and sign off based on training and experience. When the aircraft moves from one party to the next, that record does not move with it. Cognitive QA replaces that process entirely.</p>
          </div>

          <div className="replace-grid reveal">
            <div className="replace-col before">
              <div className="replace-col-label">Before: current state</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Manual visual checks, no spatial record</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Paper and digital checklists</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Sign-offs based on experience only</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>No real-time comparison against blueprint</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Record stays behind when aircraft moves</div>
              <div className="replace-item"><div className="replace-icon x">✕</div>Every party re-verifies from scratch</div>
            </div>
            <div className="replace-col after">
              <div className="replace-col-label">After: Cognitive QA</div>
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
          <div className="section-label reveal">The platform</div>
          <h2 className="section-heading reveal">An inspector that checks<br/><span className="amber">every part, every time.</span></h2>
          <div className="body-text reveal">
            <p>Cognitive QA runs on two Microsoft products, Copilot and HoloLens 2, and adds a shared inspection record on top.</p>
          </div>

          <div className="platform-grid reveal">
            <div className="platform-card">
              <div className="platform-card-bg"></div>
              <div className="platform-num">Intelligence</div>
              <div className="platform-title">Microsoft<br/>Copilot</div>
              <div className="platform-tech">AI core</div>
              <div className="platform-body">Copilot is loaded with the aircraft's full blueprint library, every measurement, specification, and component, before the first inspection. During an inspection it compares what it sees in real time against what the blueprint says should be there.</div>
            </div>
            <div className="platform-card">
              <div className="platform-card-bg"></div>
              <div className="platform-num">Delivery</div>
              <div className="platform-title">Microsoft<br/>HoloLens 2</div>
              <div className="platform-tech">Augmented reality</div>
              <div className="platform-body">The headset is built for industrial work. It gives the inspector a live augmented view of the aircraft during assembly, and each deviation is flagged and logged against the digital twin as it happens.</div>
            </div>
            <div className="platform-card">
              <div className="platform-card-bg"></div>
              <div className="platform-num">The record</div>
              <div className="platform-title">Verified<br/>audit trail</div>
              <div className="platform-tech">Tamper-proof</div>
              <div className="platform-body">Every inspection produces a tamper-proof digital record tied to the exact components checked and to the original specification. Boeing, airlines, MRO shops, and regulators all read from the same record.</div>
            </div>
          </div>

        </div>
      </section>

      {/* ── INFOGRAPHIC ── */}
      <div className="infographic-section reveal">
        <div className="infographic-label">Real-time diagnostic scan</div>
        <div className="infographic-wrap">
          <div className="infographic-drawing"><ProjectCover slug="cognitive-qa" title="Side elevation of an airliner with one fuselage section flagged by the inspector's scan" /></div>
        </div>
      </div>

      {/* ── PROVEN ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Proven where it matters most</div>
          <h2 className="section-heading reveal">Defense-grade inspection<br/><span className="amber">for commercial production.</span></h2>
          <div className="body-text reveal">
            <p>The Microsoft HoloLens 2 is already used in aviation. Boeing uses it to guide wiring work on the military version of its 767 tanker, and Airbus has used it on its commercial production lines since 2019.</p>
            <p>No one has yet used it for live inspection against the blueprint on commercial aircraft. The jets that carry millions of passengers a day are still inspected largely by hand, with paper checklists and individual sign-offs.</p>
            <p>Defense aircraft are built to some of the strictest quality standards in the world, with every component verified, every system tested, and every deviation documented. Commercial aviation should meet the same standard, because the public flies on it every day.</p>
            <p>Cognitive QA brings defense-grade quality control to the commercial manufacturing floor.</p>
          </div>
        </div>
      </section>

      {/* ── GO-TO-MARKET ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Go-to-market</div>
          <h2 className="section-heading reveal">A deliberately <span className="amber">sequenced</span> strategy.</h2>
          <div className="body-text reveal">
            <p>Cognitive QA is sold to businesses as an enterprise platform. It starts where aircraft are built and moves outward from there.</p>
          </div>

          <div className="phases-track reveal" id="phasesTrack">
            <div className="phase-row" id="ph1">
              <div className="phase-number-col">
                <div className="phase-num">01</div>
                <div className="phase-connector"></div>
              </div>
              <div className="phase-content">
                <div className="phase-tag">Beachhead</div>
                <div className="phase-heading">Boeing assembly line</div>
                <div className="phase-body">Boeing is the first target and the reference customer every later sale would point to. Defects caught before a panel is sealed cost a fraction of what they cost to fix after the fact, and a fraction of a fraction of what they cost if they reach a passenger. A Boeing contract would open doors across the industry.</div>
              </div>
            </div>
            <div className="phase-row" id="ph2">
              <div className="phase-number-col">
                <div className="phase-num">02</div>
                <div className="phase-connector"></div>
              </div>
              <div className="phase-content">
                <div className="phase-tag">Expansion</div>
                <div className="phase-heading">MRO companies</div>
                <div className="phase-body">Maintenance is the second point where quality gets checked. MRO inspectors certify aircraft already in service, under time pressure, working from documentation and experience. Cognitive QA gives every MRO inspector, whatever their experience, the knowledge of the most senior one on the team.</div>
              </div>
            </div>
            <div className="phase-row" id="ph3">
              <div className="phase-number-col">
                <div className="phase-num">03</div>
                <div className="phase-connector"></div>
              </div>
              <div className="phase-content">
                <div className="phase-tag">Scale</div>
                <div className="phase-heading">Defense and government</div>
                <div className="phase-body">HoloLens already has a place in defense procurement. Cognitive QA adds a full audit trail from day one, built to meet the documentation requirements of government contracts.</div>
              </div>
            </div>
            <div className="phase-row" id="ph4">
              <div className="phase-number-col">
                <div className="phase-num">04</div>
                <div className="phase-connector"></div>
              </div>
              <div className="phase-content">
                <div className="phase-tag">Platform</div>
                <div className="phase-heading">Beyond aviation</div>
                <div className="phase-body">Once Cognitive QA sets the standard in aviation, the platform can move into other industries where a single defect can be catastrophic, such as automotive, maritime, and spacecraft.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TAM ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Total addressable market</div>
          <h2 className="section-heading reveal">A <span className="amber">$471 billion</span> opportunity<br/>that no one has addressed.</h2>
          <div className="body-text reveal">
            <p>The figure combines commercial aircraft manufacturing, aerospace and defense MRO, and MRO software. All three markets are under pressure, with operators already investing in AI and regulators demanding higher standards.</p>
          </div>

          <div className="tam-rows reveal" id="tamRows">
            <div className="tam-row" style={{ ['--bar-w' as string]: '100%' }}>
              <div className="tam-amount">$328B</div>
              <div>
                <div className="tam-label">Commercial aircraft manufacturing</div>
                <div className="tam-bar-wrap"><div className="tam-bar"></div></div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-w)', whiteSpace: 'nowrap' }}>2024 market</div>
            </div>
            <div className="tam-row" style={{ ['--bar-w' as string]: '41%' }}>
              <div className="tam-amount">$135B</div>
              <div>
                <div className="tam-label">Aerospace and defense MRO market</div>
                <div className="tam-bar-wrap"><div className="tam-bar"></div></div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-w)', whiteSpace: 'nowrap' }}>Total MRO</div>
            </div>
            <div className="tam-row" style={{ ['--bar-w' as string]: '2.3%' }}>
              <div className="tam-amount">$7.7B</div>
              <div>
                <div className="tam-label">MRO software segment, projected to reach $11.68B by 2032</div>
                <div className="tam-bar-wrap"><div className="tam-bar"></div></div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted-w)', whiteSpace: 'nowrap' }}>To $11.68B</div>
            </div>
            <div className="tam-row highlight" style={{ ['--bar-w' as string]: '100%' }}>
              <div className="tam-amount">$471B</div>
              <div>
                <div className="tam-label">Combined addressable opportunity</div>
                <div className="tam-bar-wrap"><div className="tam-bar" style={{ background: 'linear-gradient(90deg,var(--amber),var(--orange))' }}></div></div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--amber)', whiteSpace: 'nowrap' }}>Total</div>
            </div>
          </div>

          <div className="tam-insight reveal">
            <strong>63% of airlines</strong> already use AI in operations control, and 64% of respondents to Oliver Wyman's 2025 MRO survey said they had adopted AI. No inspection product like Cognitive QA exists yet.
          </div>
        </div>
      </section>

      {/* ── BEYOND AVIATION ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The path beyond aviation</div>
          <h2 className="section-heading reveal">Aviation is the proof of concept.<br/><span className="amber">The platform is universal.</span></h2>
          <div className="body-text reveal">
            <p>The same framework that verifies a bolt on a 737 can verify a weld on a naval vessel, a component in an armored vehicle, or a part on a spacecraft.</p>
          </div>

          <div className="beyond-grid" id="beyondGrid" aria-label="Industries beyond aviation">
            <div className="beyond-card" id="bc1">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="beyond-name">Aviation</div>
              <div className="beyond-desc">The starting market: commercial aircraft manufacturing.</div>
            </div>
            <div className="beyond-card" id="bc2">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-4 0v2M12 12v4M8 12v2"/>
                </svg>
              </div>
              <div className="beyond-name">Automotive</div>
              <div className="beyond-desc">Assembly line verification at production scale.</div>
            </div>
            <div className="beyond-card" id="bc3">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 17l9-14 9 14H3z"/>
                  <path d="M12 17v-5M9 14h6"/>
                </svg>
              </div>
              <div className="beyond-name">Maritime</div>
              <div className="beyond-desc">Naval and commercial hull and system inspection.</div>
            </div>
            <div className="beyond-card" id="bc4">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <div className="beyond-name">Defense</div>
              <div className="beyond-desc">Where the inspection standard was first set.</div>
            </div>
            <div className="beyond-card" id="bc5">
              <div className="beyond-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/>
                </svg>
              </div>
              <div className="beyond-name">Spacecraft</div>
              <div className="beyond-desc">Zero tolerance for a defect in any component.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY NOW ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Why now</div>
          <h2 className="section-heading reveal">This is coming to commercial aviation.<br/>The open question is <span className="red">who builds it.</span></h2>
          <div className="body-text reveal">
            <p>Ten years ago this could not have been built. Better AI, more regulatory pressure, and a run of industry failures have opened a window that did not exist before.</p>
          </div>

          <div className="why-items reveal">
            <div className="why-item">
              <span className="why-tag">AI</span>
              <div className="why-text">AI can now run real-time spatial inspection against a digital twin as a system an enterprise can actually deploy.</div>
            </div>
            <div className="why-item">
              <span className="why-tag">HoloLens</span>
              <div className="why-text">The Microsoft HoloLens 2 is an established enterprise headset. Boeing uses it for wiring work on a military tanker, and Airbus has used it on commercial production lines since 2019.</div>
            </div>
            <div className="why-item">
              <span className="why-tag danger">Precedent</span>
              <div className="why-text">The 2024 incidents came out of a process that was never designed for the scale and complexity of modern commercial aircraft, and both regulators and the public have noticed.</div>
            </div>
            <div className="why-item">
              <span className="why-tag danger">Boeing</span>
              <div className="why-text"><span className="red">Boeing reported an $11.8 billion loss in 2024.</span> In 2025 it resolved the federal case over deceiving the FAA about the 737 MAX with a non-prosecution agreement that includes a $487 million criminal fine. The industry is under more regulatory, financial, and public pressure than it has ever faced.</div>
            </div>
            <div className="why-item">
              <span className="why-tag">The gap</span>
              <div className="why-text">No one has yet applied AR inspection against the blueprint to commercial aircraft production. That gap is the opportunity, and it will not stay open for long.</div>
            </div>
            <div className="why-item">
              <span className="why-tag">First mover</span>
              <div className="why-text">The company that sets this standard first gets the network effect, the inspection data that improves the product, and the working relationship with regulators.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLOSING ── */}
      <footer className="closing-strategy" aria-label="Closing statement">
        <div className="closing-lines">
          <p className="closing-line" id="cl1">The hardware exists.</p>
          <p className="closing-line" id="cl2">The failures keep happening.</p>
          <p className="closing-line amber" id="cl3">Nobody has built this layer yet.</p>
        </div>
      </footer>

      <section className="sources" aria-label="Sources">
        <div className="sources-inner">
          <h2>Sources</h2>
          <ol>
            {[
              {"pre": "Fact.MR, ", "link": "Commercial Aircraft Manufacturing Market Outlook (2024 to 2034)", "href": "https://www.factmr.com/report/commercial-aircraft-manufacturing-market", "post": ". $328.32 billion in 2024."},
              {"pre": "Kaiso Research and Consulting, ", "link": "Global Aerospace and Defense MRO Market", "href": "https://www.marketresearch.com/Kaiso-Research-and-Consulting-v4350/Global-Aerospace-Defense-MRO-Size-43296356", "post": ". $135.7 billion in 2024."},
              {"pre": "Fortune Business Insights, ", "link": "Aviation MRO Software Market", "href": "https://www.fortunebusinessinsights.com/aviation-mro-software-market-101798", "post": ". $7.70 billion in 2024, projected to reach $11.68 billion by 2032."},
              {"pre": "SITA, ", "link": "Air Transport IT Insights 2025", "href": "https://www.sita.aero/resources/surveys-reports/air-transport-it-insights-2025/", "post": ". 63% of airlines use AI in operations control."},
              {"pre": "Oliver Wyman, ", "link": "The MRO demand challenge", "href": "https://www.oliverwyman.com/our-expertise/insights/2025/apr/mro-industry-sees-growth-amid-supply-and-labor-pressure.html", "post": " (April 2025). AI adoption at 64% of survey respondents, up from 58% in 2024."},
              {"pre": "NTSB, ", "link": "Boeing's inadequate training, guidance and oversight led to mid-exit door plug blowout", "href": "https://www.ntsb.gov/news/press-releases/Pages/NR20250624.aspx", "post": " (June 2025). The four missing bolts on Alaska Airlines 1282."},
              {"pre": "Khaleej Times, ", "link": "At least 50 injured as Boeing 787 plane drops mid-flight", "href": "https://www.khaleejtimes.com/aviation/at-least-50-injured-as-boeing-787-plane-drops-mid-flight", "post": " (March 2024). LATAM flight LA800."},
              {"pre": "NBC News, ", "link": "South Korea plane crash: what we know", "href": "https://www.nbcnews.com/news/world/south-korea-plane-crash-what-we-know-rcna185718", "post": " (December 2024). Jeju Air 2216, 179 of 181 people killed."},
              {"pre": "Boeing, ", "link": "Boeing Reports Fourth Quarter Results", "href": "https://www.nasdaq.com/press-release/boeing-reports-fourth-quarter-results-2025-01-28", "post": " (January 2025). 2024 net loss of $11.8 billion and its causes."},
              {"pre": "Claims Journal, ", "link": "Boeing avoids US criminal charge in 737 Max jet crash case", "href": "https://www.claimsjournal.com/news/national/2025/11/06/333951.htm", "post": " (November 2025). The dismissal and the $487.2 million criminal fine."},
              {"pre": "AR Insider, ", "link": "Case study: Boeing streamlines aircraft assembly with AR", "href": "https://arinsider.co/2022/08/23/case-study-boeing-streamlines-aircraft-assembly-with-ar/", "post": " (2022). HoloLens 2 in Boeing wiring and assembly work."},
              {"pre": "George Washington University, ", "link": "thesis on HoloLens use in wiring work on Boeing's military 767 tanker", "href": "https://scholarspace.library.gwu.edu/concern/gw_etds/jq085k56b", "post": "."},
              {"pre": "Microsoft, ", "link": "Airbus reaches new heights with the help of Microsoft mixed reality technology", "href": "https://news.microsoft.com/source/features/digital-transformation/airbus-reaches-new-heights-with-the-help-of-microsoft-mixed-reality-technology", "post": " (June 2019)."},
            ].map((s, i) => (
              <li key={i}>{s.pre}<a href={s.href} target="_blank" rel="noopener noreferrer">{s.link}</a>{s.post}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── STATUS BAR ── */}
      <div className="status-bar" style={{ marginTop: 'auto' }}>
        <span className="status-online">Concept demo</span>
      </div>
      <BackToTop ground="var(--amber)" ink="var(--w-bg)" />
    </div>
  );
}
