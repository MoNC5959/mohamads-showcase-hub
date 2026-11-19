// @ts-nocheck -- imported code written for looser TypeScript settings
import { Link } from '@/lib/router-compat';
import { useEffect, useState } from 'react';
import './cognitive-qa-amber.css';
import BackToTop from '@/components/BackToTop';
import CognitiveQANav from '@/components/CognitiveQANav';

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
          ['cl1','cl2','cl3'].forEach((id, i) => {
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

      <CognitiveQANav />

      <header className="hero" aria-label="Vision Brief opening">

        <div className="hero-content">
          <p className="hero-eyebrow">Cognitive QA vision brief, 2026</p>

          <h1 className="hero-title"><span className="hero-setup">The system is</span> <span className="hero-broken">broken</span></h1>
          <p className="hero-suffix">It has been for years.</p>

          <div className="hero-body">
            <p>In January 2024, a door plug blew out of an Alaska Airlines 737 MAX 9 over Oregon. In March, a LATAM Dreamliner dropped suddenly mid-flight, injuring 50 people. On December 29th, Jeju Air Flight 2216 crashed in South Korea, killing 179 of the 181 people on board.</p>
            <p>The causes were different, but each one points to the same underlying problem.</p>
          </div>
        </div>
      </header>

      <div className="stats-band" role="region" aria-label="Key statistics">
        <div className="stat-cell">
          <span className="stat-num" data-target="1.8" data-suffix="T" data-prefix="$" data-decimals="1">$1.8T</span>
          <p className="stat-label">U.S. civil aviation economic activity (2022)</p>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="9.4" data-suffix="M" data-prefix="" data-decimals="1">9.4M</span>
          <p className="stat-label">Jobs supported by civil aviation (2022)</p>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="11.8" data-suffix="B" data-prefix="$" data-decimals="1">$11.8B</span>
          <p className="stat-label">Boeing loss in 2024</p>
        </div>
        <div className="stat-cell">
          <span className="stat-num" data-target="487" data-suffix="M" data-prefix="$" data-decimals="0">$487M</span>
          <p className="stat-label">Boeing criminal fine, 737 MAX case</p>
        </div>
      </div>

      <section className="section reveal">
        <div className="section-inner">
          <div className="section-label">Scale of the stakes</div>
          <div className="body-text">
            <p>U.S. civil aviation supported <strong>$1.8 trillion in economic activity</strong> and <strong>9.4 million jobs</strong> in 2022, according to the FAA. Boeing alone lost <strong>$11.8 billion in 2024</strong>, a year that included a machinists' strike and charges on the 737 MAX and its defense programs.</p>
            <p>In July 2024, Boeing agreed to plead guilty to a federal fraud charge for deceiving the FAA during the certification of the 737 MAX. A judge rejected that deal in December, and in November 2025 the case was dismissed under a non-prosecution agreement that includes a <strong>$487 million criminal fine</strong>.</p>
            <p>Together they describe a system that has not kept pace with the complexity of modern aircraft manufacturing.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The human cost</div>
          <h2 className="section-heading reveal">Every defect that leaves a factory floor<br/>is the result of a <span className="red">missed step.</span></h2>
          <div className="body-text reveal">
            <p>A bolt goes unchecked or a bracket unverified because manual inspection was never designed for the scale and complexity of a modern commercial aircraft.</p>
          </div>

          <div className="incident-grid" role="list">
            <div className="incident-card reveal-up" role="listitem" style={{transitionDelay:'0ms'}}>
              <span className="incident-badge badge-crit">Critical</span>
              <p className="incident-flight">Alaska Airlines 1282</p>
              <div className="incident-stat">4 bolts</div>
              <p className="incident-desc">Left the factory missing four critical bolts. A door plug failed at altitude over Oregon.</p>
            </div>
            <div className="incident-card warn reveal-up" role="listitem" style={{transitionDelay:'80ms'}}>
              <span className="incident-badge badge-warn">Warning</span>
              <p className="incident-flight">LATAM Dreamliner</p>
              <div className="incident-stat">50 injured</div>
              <p className="incident-desc">Dropped suddenly mid-flight, with no warning to anyone on board.</p>
            </div>
            <div className="incident-card reveal-up" role="listitem" style={{transitionDelay:'160ms'}}>
              <span className="incident-badge badge-crit">Critical</span>
              <p className="incident-flight">Jeju Air 2216</p>
              <div className="incident-stat">179 lives</div>
              <p className="incident-desc">Crashed in South Korea on December 29th, 2024. 179 people did not survive.</p>
            </div>
          </div>

          <div className="body-text reveal">
            <p>The process behind them was not built to catch what human eyes can miss.</p>
          </div>

          <div className="pull-quote reveal">
            <p className="pull-quote-text">What if the inspector <span className="hi">never missed a thing?</span> Every bolt, fastener, and bracket would be verified in real time on the factory floor, before the aircraft left the ground.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The gaps in the chain</div>
          <h2 className="section-heading reveal">Four parties check the same aircraft. <span className="red">Every handoff is a chance to miss something.</span></h2>
          <div className="body-text reveal">
            <p>Every party in the aviation supply chain re-verifies the aircraft from scratch because it cannot fully trust the checks that came before.</p>
          </div>

          <div className="chain-wrap reveal" aria-label="Supply chain handoff diagram">
            <div className="chain-track" id="chainTrack">
              <div className="chain-node" id="cn1">
                <p className="chain-node-party">Boeing</p>
                <p className="chain-node-action">Inspects during assembly</p>
              </div>
              <div className="chain-gap">
                <div className="chain-gap-line"></div>
                <span className="chain-gap-label">Gap 1</span>
              </div>
              <div className="chain-node" id="cn2">
                <p className="chain-node-party">FAA</p>
                <p className="chain-node-action">Audits Boeing</p>
              </div>
              <div className="chain-gap">
                <div className="chain-gap-line"></div>
                <span className="chain-gap-label">Gap 2</span>
              </div>
              <div className="chain-node" id="cn3">
                <p className="chain-node-party">Airlines</p>
                <p className="chain-node-action">Inspect on delivery</p>
              </div>
              <div className="chain-gap">
                <div className="chain-gap-line"></div>
                <span className="chain-gap-label">Gap 3</span>
              </div>
              <div className="chain-node" id="cn4">
                <p className="chain-node-party">MRO</p>
                <p className="chain-node-action">Inspect during service</p>
              </div>
            </div>
            <div className="chain-summary">
              <strong>Three handoffs, three gaps.</strong> At each one, the next party starts from zero.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">How Cognitive QA works</div>
          <h2 className="section-heading reveal">The inspector <span className="amber">sees the defect</span><br/>while the work is happening.</h2>

          <div className="reveal">
            <div className="tabs-row" role="tablist" aria-label="Use case selector">
              <button
                className={`tab-btn${activeTab === 'boeing' ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === 'boeing'}
                aria-controls="tab-boeing"
                id="btn-boeing"
                onClick={() => setActiveTab('boeing')}
              >Assembly line</button>
              <button
                className={`tab-btn${activeTab === 'mro' ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === 'mro'}
                aria-controls="tab-mro"
                id="btn-mro"
                onClick={() => setActiveTab('mro')}
              >MRO companies</button>
              <button
                className={`tab-btn${activeTab === 'chain' ? ' active' : ''}`}
                role="tab"
                aria-selected={activeTab === 'chain'}
                aria-controls="tab-chain"
                id="btn-chain"
                onClick={() => setActiveTab('chain')}
              >The chain</button>
            </div>

            <div className={`tab-panel${activeTab === 'boeing' ? ' active' : ''}`} id="tab-boeing" role="tabpanel" aria-labelledby="btn-boeing">
              <p className="tab-panel-heading">Boeing assembly line</p>
              <div className="tab-panel-body">
                <p>Cognitive QA puts a HoloLens on the engineer and overlays a live digital twin of the aircraft blueprint onto the physical plane in front of them. The AI scans in real time and flags deviations, damage, and defects, each pinned to the exact part of the aircraft where it was found.</p>
                <p>The inspector no longer has to guess or cross-reference a paper checklist, because the problem shows up on the part itself.</p>
                <p>Defects caught before a panel is sealed cost a fraction of what they cost to fix after the fact, and a fraction of a fraction of what they cost if they reach a passenger. Cognitive QA catches them while the work is still happening, before anyone signs off.</p>
              </div>
            </div>

            <div className={`tab-panel${activeTab === 'mro' ? ' active' : ''}`} id="tab-mro" role="tabpanel" aria-labelledby="btn-mro">
              <p className="tab-panel-heading">MRO maintenance</p>
              <div className="tab-panel-body">
                <p>For MRO companies, the gain is faster and more consistent inspections.</p>
                <p>Every inspector, whatever their experience, works at the level of your most senior one.</p>
                <p>The HoloLens overlay closes the gap between a 30-year veteran and a technician in their second year, because the AI carries the institutional knowledge the veteran would otherwise supply.</p>
              </div>
            </div>

            <div className={`tab-panel${activeTab === 'chain' ? ' active' : ''}`} id="tab-chain" role="tabpanel" aria-labelledby="btn-chain">
              <p className="tab-panel-heading">The unbroken chain</p>
              <div className="tab-panel-body">
                <p>Cognitive QA closes those gaps with <strong>one tamper-proof inspection record</strong> that every party can rely on.</p>
                <p>Boeing's verification goes to the FAA, the FAA's record goes to the airline, and the airline's history goes to the MRO shop. The record travels with the aircraft, so nobody has to start over at the next step.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mission reveal" role="region" aria-label="Mission statement">
        <p className="mission-kicker">Our mission</p>
        <p className="mission-text">
          Cognitive QA exists to make<br/>
          <span className="amber">defect-free aviation</span><br/>
          the global standard.
        </p>
        <p className="mission-sub">Verified at every step</p>
      </div>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">The world we are building</div>

          <div className="world-grid reveal">
            <div className="world-card">
              <p className="world-card-text">Every aircraft that leaves the factory floor carries a complete, verified record of its assembly.</p>
            </div>
            <div className="world-card">
              <p className="world-card-text">Regulators can see verified proof of quality compliance.</p>
            </div>
            <div className="world-card">
              <p className="world-card-text">Airlines can take delivery of an aircraft with full confidence in its history.</p>
            </div>
            <div className="world-card">
              <p className="world-card-text">Passengers can board knowing every component was checked and documented before the aircraft left the ground.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="section-label reveal">Why now</div>
          <h2 className="section-heading reveal">The technology has finally <span className="amber">caught up with the problem.</span></h2>

          <div className="whynow-points reveal">
            <div className="whynow-point">
              <span className="whynow-tag">AI</span>
              <p className="whynow-text">AI models, vision processing, and real-time inference can now run on a wearable device on a factory floor.</p>
            </div>
            <div className="whynow-point">
              <span className="whynow-tag">HoloLens</span>
              <p className="whynow-text">The Microsoft HoloLens 2 is an established enterprise headset and is already used in defense aircraft manufacturing.</p>
            </div>
            <div className="whynow-point">
              <span className="whynow-tag">Precedent</span>
              <p className="whynow-text">Boeing uses HoloLens to guide wiring work on its military 767 tanker, and Airbus has used HoloLens 2 on its commercial production lines since 2019.</p>
            </div>
            <div className="whynow-point">
              <span className="whynow-tag">The gap</span>
              <p className="whynow-text">No one has built an AI inspection layer for commercial aircraft manufacturing at scale. Cognitive QA is designed to fill that gap.</p>
            </div>
            <div className="whynow-point">
              <span className="whynow-tag">The cost</span>
              <p className="whynow-text">After 2024, the cost of doing nothing is hard to ignore. This technology will reach commercial aviation, and the open question is who builds it first.</p>
            </div>
          </div>

          <div className="body-text reveal">
            <p>Cognitive QA gives the people who build and maintain aircraft a way to check their work against the blueprint as they go.</p>
          </div>
        </div>
      </section>

      <footer className="closing" aria-label="Closing statement">
        <div className="closing-lines">
          <p className="closing-line lit"  id="cl1">The hardware exists.</p>
          <p className="closing-line lit"  id="cl2">The failures keep happening.</p>
          <p className="closing-line amber" id="cl3">Nobody has built this layer yet.</p>
        </div>
      </footer>

      <section className="sources" aria-label="Sources">
        <div className="sources-inner">
          <h2>Sources</h2>
          <ol>
            {[
              {"pre": "FAA, ", "link": "The Economic Impact of Civil Aviation on the U.S. Economy", "href": "https://www.faa.gov/2024-economic-impact-report", "post": " (2024 report). $1.8 trillion in economic activity and 9.4 million jobs in 2022."},
              {"pre": "Boeing, ", "link": "Boeing Reports Fourth Quarter Results", "href": "https://www.nasdaq.com/press-release/boeing-reports-fourth-quarter-results-2025-01-28", "post": " (January 2025). 2024 net loss of $11.8 billion and its causes."},
              {"pre": "HeraldNet, ", "link": "Boeing agrees to plead guilty to felony in deal with Justice Department", "href": "https://www.heraldnet.com/news/boeing-agrees-to-plead-guilty-to-felony-in-deal-with-justice-department", "post": " (July 2024)."},
              {"pre": "Claims Journal, ", "link": "Boeing avoids US criminal charge in 737 Max jet crash case", "href": "https://www.claimsjournal.com/news/national/2025/11/06/333951.htm", "post": " (November 2025). The dismissal and the $487.2 million criminal fine."},
              {"pre": "NTSB, ", "link": "Boeing's inadequate training, guidance and oversight led to mid-exit door plug blowout", "href": "https://www.ntsb.gov/news/press-releases/Pages/NR20250624.aspx", "post": " (June 2025). The four missing bolts on Alaska Airlines 1282."},
              {"pre": "Khaleej Times, ", "link": "At least 50 injured as Boeing 787 plane drops mid-flight", "href": "https://www.khaleejtimes.com/aviation/at-least-50-injured-as-boeing-787-plane-drops-mid-flight", "post": " (March 2024). LATAM flight LA800."},
              {"pre": "NBC News, ", "link": "South Korea plane crash: what we know", "href": "https://www.nbcnews.com/news/world/south-korea-plane-crash-what-we-know-rcna185718", "post": " (December 2024). Jeju Air 2216, 179 of 181 people killed."},
              {"pre": "AR Insider, ", "link": "Case study: Boeing streamlines aircraft assembly with AR", "href": "https://arinsider.co/2022/08/23/case-study-boeing-streamlines-aircraft-assembly-with-ar/", "post": " (2022). HoloLens 2 in Boeing wiring and assembly work."},
              {"pre": "George Washington University, ", "link": "thesis on HoloLens use in wiring work on Boeing's military 767 tanker", "href": "https://scholarspace.library.gwu.edu/concern/gw_etds/jq085k56b", "post": "."},
              {"pre": "Microsoft, ", "link": "Airbus reaches new heights with the help of Microsoft mixed reality technology", "href": "https://news.microsoft.com/source/features/digital-transformation/airbus-reaches-new-heights-with-the-help-of-microsoft-mixed-reality-technology", "post": " (June 2019)."},
            ].map((s, i) => (
              <li key={i}>{s.pre}<a href={s.href} target="_blank" rel="noopener noreferrer">{s.link}</a>{s.post}</li>
            ))}
          </ol>
        </div>
      </section>

      <div className="status-bar status-bar-sm">
        <span className="status-online">Concept demo</span>
      </div>
      <BackToTop ground="var(--amber)" ink="var(--w-bg)" />
    </div>
  );
}
