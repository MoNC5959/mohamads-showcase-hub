import { useEffect, useState } from 'react';
import { Link } from '@/lib/router-compat';
import './cognitive-qa-hud.css';

export default function CognitiveQABoeing() {
  const [guideOpen, setGuideOpen] = useState(false);
  useEffect(() => {
    // ── STEP DATA ──────────────────────────────────────────────────────────────
    const STEPS = [
      {
        name:     'SPAR CAP ALIGNMENT',
        location: 'Front Spar, Full Length',
        zoneIdx:  0,
        scanPct:  { from: 0.12, to: 0.26 },
        result:   'pass',
        defect:   null,
        hud: {
          comp:     'FRONT SPAR',
          spec:     '±0.025 mm',
          readings: ['+0.018 mm', '+0.011 mm', '+0.008 mm'],
          finalReading: '+0.008 mm',
          finalStatus:  'PASS',
          conf:     '99.2%'
        },
        logLines: [
          { t: 200,  type: 'scan', text: 'Initiating HoloLens spatial scan...' },
          { t: 600,  type: 'info', text: 'Loading blueprint: FRONT-SPAR-737-WNG-042' },
          { t: 1100, type: 'scan', text: 'Scanning spar cap geometry...' },
          { t: 1700, type: 'scan', text: 'Measuring alignment delta...' },
          { t: 2300, type: 'pass', text: 'Alignment within tolerance: +0.008mm' },
          { t: 2600, type: 'pass', text: 'CHECKPOINT PASS — Spar Cap Alignment' },
        ]
      },
      {
        name:     'RIB STATION 4 FASTENER',
        location: 'Rib Station 4, Bolt A7-R4',
        zoneIdx:  1,
        scanPct:  { from: 0.32, to: 0.46 },
        result:   'fail',
        defect:   'm1',
        hud: {
          comp:     'BOLT A7-R4',
          spec:     '35 Nm',
          readings: ['8 Nm', '11 Nm', '12 Nm'],
          finalReading: '12 Nm',
          finalStatus:  'FAIL',
          conf:     '97.8%'
        },
        logLines: [
          { t: 200,  type: 'scan', text: 'Scanning Rib Station 4 fastener pattern...' },
          { t: 700,  type: 'info', text: 'Locating Bolt A7-R4...' },
          { t: 1200, type: 'scan', text: 'Reading torque signature via AI...' },
          { t: 1750, type: 'fail', text: '!! ANOMALY DETECTED — Torque variance' },
          { t: 2100, type: 'fail', text: 'Measured: 12 Nm — Required: 35 Nm' },
          { t: 2400, type: 'fail', text: 'DEFECT LOGGED: DEF-2847 — CRITICAL' },
        ],
        action:     'Bolt A7-R4 at Rib Station 4 installed at incorrect torque. Measured 12 Nm vs. required 35 Nm. Re-torque and re-verify before assembly proceeds.',
        actionType: 'fail'
      },
      {
        name:     'LEADING EDGE SKIN PANEL',
        location: 'Leading Edge, Full Span',
        zoneIdx:  2,
        scanPct:  { from: 0.04, to: 0.16 },
        result:   'pass',
        defect:   null,
        hud: {
          comp:     'LEAD EDGE SKIN',
          spec:     '≤0.008 mm dev',
          readings: ['0.005 mm', '0.004 mm', '0.003 mm'],
          finalReading: '0.003 mm',
          finalStatus:  'PASS',
          conf:     '98.6%'
        },
        logLines: [
          { t: 200,  type: 'scan', text: 'Scanning leading edge skin contour...' },
          { t: 700,  type: 'info', text: 'Comparing against surface spec: LE-SKIN-737' },
          { t: 1300, type: 'scan', text: 'Checking panel fastener count...' },
          { t: 1800, type: 'pass', text: 'Surface deviation: 0.003mm — within spec' },
          { t: 2200, type: 'pass', text: 'All 24 fasteners detected and verified' },
          { t: 2500, type: 'pass', text: 'CHECKPOINT PASS — Leading Edge Skin Panel' },
        ]
      },
      {
        name:     'TRAILING EDGE BRACKET',
        location: 'Rear Spar, Rib Station 6',
        zoneIdx:  3,
        scanPct:  { from: 0.58, to: 0.74 },
        result:   'fail',
        defect:   'm2',
        hud: {
          comp:     'TRAIL EDGE BKTS',
          spec:     '12 fasteners',
          readings: ['7 detected', '8 detected', '9 detected'],
          finalReading: '9 / 12',
          finalStatus:  'FAIL',
          conf:     '96.4%'
        },
        logLines: [
          { t: 200,  type: 'scan', text: 'Scanning Rear Spar — Rib Station 6...' },
          { t: 700,  type: 'info', text: 'Counting upper skin fastener pattern...' },
          { t: 1200, type: 'scan', text: 'Spatial mapping fastener positions...' },
          { t: 1700, type: 'fail', text: '!! INCOMPLETE PATTERN DETECTED' },
          { t: 2050, type: 'fail', text: 'Found: 9 fasteners — Required: 12' },
          { t: 2350, type: 'fail', text: 'DEFECT LOGGED: DEF-2849 — CRITICAL' },
        ],
        action:     'Fastener pattern at Rib Station 6 upper skin incomplete. 9 of 12 fasteners installed. Missing fasteners must be installed and torqued to spec.',
        actionType: 'fail'
      },
      {
        name:     'FUEL SEAL INTEGRITY',
        location: 'Wing Box, Station 3 — Station 7',
        zoneIdx:  4,
        scanPct:  { from: 0.22, to: 0.68 },
        result:   'warning',
        defect:   'm3',
        hud: {
          comp:     'WING BOX SEAL',
          spec:     '0.02 mm max',
          readings: ['1.8 mm', '2.1 mm', '2.3 mm'],
          finalReading: '2.3 mm',
          finalStatus:  'WARN',
          conf:     '94.1%'
        },
        logLines: [
          { t: 200,  type: 'scan', text: 'Initiating wide-area wing box scan...' },
          { t: 600,  type: 'info', text: 'Checking rear spar cap gap tolerances...' },
          { t: 1100, type: 'scan', text: 'Measuring spar cap gap at Station 5...' },
          { t: 1650, type: 'warn', text: '! VARIANCE DETECTED — Gap out of tolerance' },
          { t: 2000, type: 'warn', text: 'Gap measured: 2.3mm — Tolerance: 0.02mm' },
          { t: 2300, type: 'warn', text: 'DEFECT LOGGED: DEF-2848 — WARNING' },
        ],
        action:     'Spar cap gap at Rear Spar Station 5 exceeds tolerance. Measured 2.3mm vs. 0.02mm max. Re-inspect after torque sequence.',
        actionType: 'warn'
      }
    ] as any[];

    const DEFECT_DATA: Record<string, any> = {
      m1: {
        id: 'DEF-2847', title: 'Bolt A7-R4 Incorrect Torque', location: 'Rib Station 4, Front Spar',
        severity: 'critical', spec: '35 Nm', measured: '12 Nm', specVal: 35, measVal: 12, maxVal: 40,
        action: 'Re-torque bolt to 35 Nm using calibrated torque wrench. Re-verify measurement. Obtain inspector sign-off before assembly proceeds.',
        ref: 'REF: FAA AC 43.13-1B § 7-83 / Boeing AMM 57-10-01'
      },
      m2: {
        id: 'DEF-2849', title: 'Fastener Pattern Incomplete', location: 'Rib Station 6, Upper Skin Panel',
        severity: 'critical', spec: '12 fasteners', measured: '9 fasteners', specVal: 12, measVal: 9, maxVal: 12,
        action: 'Install 3 missing fasteners per drawing REV-4.2.1. Torque all fasteners to spec. Re-scan to verify full pattern before closing panel.',
        ref: 'REF: Boeing SRM 57-20-04 / FAA AC 43.13-1B § 7-31'
      },
      m3: {
        id: 'DEF-2848', title: 'Spar Cap Gap Out of Tolerance', location: 'Rear Spar, Station 5',
        severity: 'warning', spec: '0.02 mm', measured: '2.3 mm', specVal: 0.02, measVal: 2.3, maxVal: 3,
        action: 'Monitor spar cap gap. Re-inspect after torque sequence. Escalate to structural engineering if gap exceeds 2.5mm before sealing wing box.',
        ref: 'REF: Boeing SRM 57-10-01 / FAA AC 43.13-2B § 4-22'
      }
    };

    const auditLog: any[] = [];
    let scanStartTime: Date | null = null;

    const diagram        = document.getElementById('diagram')!;
    const scanBeam       = document.getElementById('scanBeam')!;
    const scanAreaHL     = document.getElementById('scanAreaHL')!;
    const scanFlash      = document.getElementById('scanFlash')!;
    const progressFill   = document.getElementById('progressFill')!;
    const stepCounter    = document.getElementById('stepCounter')!;
    const stepBadge      = document.getElementById('stepBadge')!;
    const stepName       = document.getElementById('stepName')!;
    const stepLocation   = document.getElementById('stepLocation')!;
    const scanBtn        = document.getElementById('scanBtn') as HTMLButtonElement;
    const logFeed        = document.getElementById('logFeed')!;
    const actionSection  = document.getElementById('actionSection')!;
    const actionLabel    = document.getElementById('actionLabel')!;
    const actionBox      = document.getElementById('actionBox')!;
    const completeBanner = document.getElementById('completeBanner')!;
    const topBadge       = document.getElementById('topBadge')!;
    const statusVariance     = document.getElementById('statusVariance')!;
    const statusInspection   = document.getElementById('statusInspection')!;
    const defectPanel    = document.getElementById('defectPanel')! as HTMLElement & { dataset: { for: string } };

    const dataHud    = document.getElementById('dataHud')!;
    const hudComp    = document.getElementById('hudComp')!;
    const hudReading = document.getElementById('hudReading')!;
    const hudSpec    = document.getElementById('hudSpec')!;
    const hudStatus  = document.getElementById('hudStatus')! as HTMLElement;
    const hudConf    = document.getElementById('hudConf')!;

    const specZones  = document.getElementById('specZones')!;
    const twinToggle = document.getElementById('twinToggle') as HTMLButtonElement;
    const szEls = [
      document.getElementById('sz0')!,
      document.getElementById('sz1')!,
      document.getElementById('sz2')!,
      document.getElementById('sz3')!,
      document.getElementById('sz4')!,
    ];

    const auditTrailBtn  = document.getElementById('auditTrailBtn') as HTMLButtonElement;
    const auditModal     = document.getElementById('auditModal')!;
    const auditClose     = document.getElementById('auditClose') as HTMLButtonElement;
    const auditMeta      = document.getElementById('auditMeta')!;
    const auditStepsEl   = document.getElementById('auditSteps')!;
    const auditSummary   = document.getElementById('auditSummary')!;
    const signoffBtn     = document.getElementById('signoffBtn') as HTMLButtonElement;
    const signoffLocked  = document.getElementById('signoffLocked')!;
    const signoffTs      = document.getElementById('signoffTs')!;

    function appendLog(text: string, type = 'info') {
      const now  = new Date();
      const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const entry = document.createElement('div');
      entry.className = `log-entry ${type}`;
      entry.innerHTML = `<span class="log-time">${time}</span>${text}`;
      logFeed.appendChild(entry);
      logFeed.scrollTop = logFeed.scrollHeight;
    }

    function setChecklistState(idx: number, state: string) {
      const item = document.getElementById(`ci${idx}`);
      if (!item) return;
      const icon = item.querySelector('.check-icon') as HTMLElement;
      item.className = `checklist-item ${state}`;
      const icons: Record<string, string> = { pass: '&#10003;', fail: '&#10005;', warning: '!', pending: '&#9675;', active: '&#9655;' };
      icon.innerHTML = icons[state] || '&#9675;';
    }

    function setStepBadge(state: string, label: string) {
      stepBadge.className = `step-status-badge ${state}`;
      stepBadge.textContent = label;
    }

    function wait(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    function fmtTime(d: Date) {
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function setZoneState(zoneIdx: number, state: string) {
      const el = szEls[zoneIdx];
      if (!el) return;
      el.classList.remove('scanning', 'pass', 'fail', 'warn');
      if (state) el.classList.add(state);
    }

    function showHud(step: any) {
      hudComp.textContent    = step.hud.comp;
      hudSpec.textContent    = step.hud.spec;
      hudReading.textContent = '—';
      hudStatus.textContent  = 'SCANNING';
      hudStatus.style.color  = 'var(--cyan)';
      hudConf.textContent    = '—';
      dataHud.classList.add('show');
    }

    function animateHudReadings(step: any, scanDurationMs: number) {
      const readings = step.hud.readings;
      if (!readings.length) return;
      const interval = scanDurationMs / (readings.length + 1);
      readings.forEach((val: string, i: number) => {
        setTimeout(() => {
          hudReading.textContent = val;
          hudReading.style.animation = 'none';
          void (hudReading as HTMLElement).offsetWidth;
          hudReading.style.animation = '';
        }, interval * (i + 1));
      });
    }

    function finaliseHud(step: any) {
      hudReading.textContent = step.hud.finalReading;
      hudConf.textContent    = step.hud.conf;
      const statusColorMap: Record<string, string> = { PASS: 'var(--green)', FAIL: 'var(--red)', WARN: 'var(--orange)' };
      hudStatus.textContent  = step.hud.finalStatus;
      hudStatus.style.color  = statusColorMap[step.hud.finalStatus] || 'var(--cyan)';
    }

    function animateScan(fromPct: number, toPct: number, durationMs: number) {
      return new Promise<void>(resolve => {
        const diagW  = diagram.offsetWidth;
        const startX = fromPct * diagW;
        const endX   = toPct   * diagW;

        (scanAreaHL as HTMLElement).style.left  = startX + 'px';
        (scanAreaHL as HTMLElement).style.width = (endX - startX) + 'px';
        scanAreaHL.classList.add('active');
        (scanBeam as HTMLElement).style.left = startX + 'px';
        scanBeam.classList.add('active');

        const t0 = performance.now();
        function frame(now: number) {
          const p    = Math.min((now - t0) / durationMs, 1);
          const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          (scanBeam as HTMLElement).style.left = (startX + (endX - startX) * ease) + 'px';
          if (p < 1) {
            requestAnimationFrame(frame);
          } else {
            scanBeam.classList.remove('active');
            scanAreaHL.classList.remove('active');
            resolve();
          }
        }
        requestAnimationFrame(frame);
      });
    }

    function applyStepResult(stepIdx: number) {
      const step = STEPS[stepIdx];
      const ts   = new Date();

      auditLog.push({ step: stepIdx, timestamp: ts, result: step.result, defectId: step.defect });

      scanFlash.classList.remove('pass', 'fail', 'warn', 'show');
      void (scanFlash as HTMLElement).offsetWidth;
      const flashClass: Record<string, string> = { pass: 'pass', fail: 'fail', warning: 'warn' };
      scanFlash.classList.add(flashClass[step.result] || 'pass', 'show');
      setTimeout(() => scanFlash.classList.remove('show'), 900);

      const clState = step.result === 'warning' ? 'warning' : step.result;
      setChecklistState(stepIdx, clState);

      const zoneResult: Record<string, string> = { pass: 'pass', fail: 'fail', warning: 'warn' };
      setZoneState(step.zoneIdx, zoneResult[step.result] || 'pass');

      finaliseHud(step);

      if (step.defect) {
        const marker = document.getElementById(step.defect);
        if (marker) marker.classList.add('visible');
      }

      if (step.action) {
        actionSection.style.display = 'block';
        actionLabel.style.color     = step.actionType === 'warn' ? 'var(--orange)' : 'var(--red)';
        actionLabel.textContent     = step.actionType === 'warn' ? 'VARIANCE FLAGGED' : 'ACTION REQUIRED';
        actionBox.style.background  = step.actionType === 'warn' ? 'rgba(255,149,0,0.08)' : 'var(--red-dim)';
        actionBox.style.borderColor = step.actionType === 'warn' ? 'rgba(255,149,0,0.3)'  : 'rgba(255,51,51,0.3)';
        actionBox.textContent       = step.action;
      }

      if (step.result === 'fail') {
        const defectCount = document.querySelectorAll('.defect-marker.visible').length;
        topBadge.className       = 'badge badge-red';
        topBadge.textContent     = `${defectCount} DEFECT(S) FOUND`;
        statusInspection.className   = 'status-fail';
        statusInspection.textContent = `✕ DEFECT FOUND — STEP ${stepIdx + 1}`;
      } else if (step.result === 'warning') {
        statusVariance.style.display = '';
        statusInspection.className   = 'status-warn';
        statusInspection.textContent = `▲ VARIANCE — STEP ${stepIdx + 1}`;
      } else {
        if (statusInspection.className !== 'status-fail') {
          statusInspection.className   = 'status-active';
          statusInspection.textContent = `✓ STEP ${stepIdx + 1} PASSED`;
        }
      }
    }

    async function runFullScan() {
      scanBtn.disabled    = true;
      scanBtn.textContent = 'SCANNING...';
      setStepBadge('scanning', 'SCANNING');
      appendLog('Full wing inspection sequence initiated.', 'scan');
      scanStartTime = new Date();

      for (let i = 0; i < STEPS.length; i++) {
        const step = STEPS[i];

        stepCounter.textContent  = `STEP ${i + 1} OF ${STEPS.length}`;
        stepName.textContent     = step.name;
        stepLocation.textContent = step.location;
        (progressFill as HTMLElement).style.width = (i / STEPS.length * 100) + '%';
        setChecklistState(i, 'active');
        setStepBadge('scanning', 'SCANNING');

        setZoneState(step.zoneIdx, 'scanning');

        showHud(step);
        animateHudReadings(step, 2800);

        appendLog(`Starting checkpoint: ${step.name}`, 'scan');

        step.logLines.forEach((line: any) => {
          setTimeout(() => appendLog(line.text, line.type), line.t);
        });

        await animateScan(step.scanPct.from, step.scanPct.to, 2800);
        await wait(500);

        applyStepResult(i);

        await wait(i < STEPS.length - 1 ? 1000 : 600);
      }

      (progressFill as HTMLElement).style.width  = '100%';
      stepCounter.textContent   = 'ALL STEPS COMPLETE';
      stepName.textContent      = 'INSPECTION FINISHED';
      stepLocation.textContent  = '2 defects — 1 variance — 2 passed';
      setStepBadge('done', 'COMPLETE');
      scanBtn.textContent       = 'INSPECTION COMPLETE';
      scanBtn.className         = 'scan-btn complete-btn';
      scanBtn.disabled          = true;
      completeBanner.classList.add('show');
      topBadge.className        = 'badge badge-red';
      topBadge.textContent      = '2 DEFECTS FOUND';
      statusInspection.className   = 'status-fail';
      statusInspection.textContent = '✕ INSPECTION COMPLETE — 2 FAILED';
      appendLog('Inspection sequence complete. Report generated.', 'info');
      appendLog('2 critical defects logged. Assembly hold active.', 'fail');

      hudComp.textContent    = 'INSPECTION DONE';
      hudReading.textContent = '2 DEFECTS';
      hudSpec.textContent    = 'ALL CLEAR';
      hudStatus.textContent  = 'HOLD';
      hudStatus.style.color  = 'var(--red)';
      hudConf.textContent    = '—';
    }

    function openDefectPanel(defectId: string, anchorEl: HTMLElement) {
      const d = DEFECT_DATA[defectId];
      if (!d) return;

      (document.getElementById('dpId') as HTMLElement).textContent       = `DEFECT — ${d.id}`;
      (document.getElementById('dpTitle') as HTMLElement).textContent    = d.title;
      (document.getElementById('dpLocation') as HTMLElement).textContent = d.location;
      (document.getElementById('dpSpec') as HTMLElement).textContent     = d.spec;
      (document.getElementById('dpMeasured') as HTMLElement).textContent = d.measured;
      (document.getElementById('dpAction') as HTMLElement).textContent   = d.action;
      (document.getElementById('dpRef') as HTMLElement).textContent      = d.ref;

      const badge = document.getElementById('dpBadge') as HTMLElement;
      badge.className   = `dp-severity-badge ${d.severity}`;
      badge.textContent = d.severity === 'critical' ? 'CRITICAL' : 'WARNING';

      (document.getElementById('dpMeasured') as HTMLElement).className =
        d.severity === 'warning' ? 'dp-meas-value measured warn-val' : 'dp-meas-value measured';

      const fillPct = Math.min((d.measVal / d.maxVal) * 100, 100);
      const specPct = Math.min((d.specVal / d.maxVal) * 100, 100);
      const fill    = document.getElementById('dpTolFill') as HTMLElement;
      const specMk  = document.getElementById('dpTolSpec') as HTMLElement;
      fill.className    = d.severity === 'warning' ? 'dp-tol-fill warn-fill' : 'dp-tol-fill';
      fill.style.width  = '0%';
      specMk.style.left = specPct + '%';

      const variance = document.getElementById('dpVariance') as HTMLElement;
      const pct = (((d.measVal - d.specVal) / d.specVal) * 100).toFixed(1);
      variance.className   = d.severity === 'warning' ? 'dp-variance-label warn-lbl' : 'dp-variance-label';
      variance.textContent = `VARIANCE: ${Number(pct) > 0 ? '+' : ''}${pct}% FROM SPEC`;

      const rect     = anchorEl.getBoundingClientRect();
      const diagRect = diagram.getBoundingClientRect();
      let left = rect.left - diagRect.left + 36;
      let top  = rect.top  - diagRect.top  - 20;
      if (left + 270 > diagRect.width  - 10) left = rect.left - diagRect.left - 276;
      if (top  + 280 > diagRect.height - 10) top  = diagRect.height - 295;
      if (top < 10) top = 10;

      defectPanel.style.left    = left + 'px';
      defectPanel.style.top     = top  + 'px';
      defectPanel.style.display = 'block';
      defectPanel.dataset.for   = defectId;

      setTimeout(() => { fill.style.width = fillPct + '%'; }, 80);
    }

    function closeDefectPanel() {
      defectPanel.style.display = 'none';
      defectPanel.dataset.for   = '';
    }

    function buildAuditModal() {
      const now = new Date();

      auditMeta.innerHTML = `
        <div class="audit-meta-row"><span class="audit-meta-key">AIRCRAFT PART</span><span class="audit-meta-val">737-WNG-042</span></div>
        <div class="audit-meta-row"><span class="audit-meta-key">SCAN START</span><span class="audit-meta-val">${scanStartTime ? fmtTime(scanStartTime) : '—'}</span></div>
        <div class="audit-meta-row"><span class="audit-meta-key">SCAN END</span><span class="audit-meta-val">${fmtTime(now)}</span></div>
        <div class="audit-meta-row"><span class="audit-meta-key">PLATFORM</span><span class="audit-meta-val">Cognitive QA v2.4.1</span></div>
        <div class="audit-meta-row"><span class="audit-meta-key">INSPECTOR</span><span class="audit-meta-val">CGQ-INS-0472</span></div>
      `;

      const badgeClass: Record<string, string> = { pass: 'pass', fail: 'fail', warning: 'warn' };
      const badgeLabel: Record<string, string> = { pass: 'PASS', fail: 'FAIL', warning: 'WARN' };

      auditStepsEl.innerHTML = auditLog.map((entry, i) => {
        const step   = STEPS[entry.step];
        const defect = entry.defectId ? DEFECT_DATA[entry.defectId] : null;
        const bc     = badgeClass[entry.result] || 'pass';
        const bl     = badgeLabel[entry.result] || 'PASS';
        return `
          <div class="audit-step-row">
            <div class="audit-step-num">${String(i + 1).padStart(2, '0')}</div>
            <div class="audit-step-info">
              <div class="audit-step-name">${step.name}</div>
              <div class="audit-step-detail">${step.location}${defect ? ` — ${defect.id}` : ''}</div>
              <span class="audit-step-badge ${bc}">${bl}</span>
            </div>
            <div class="audit-step-ts">${fmtTime(entry.timestamp)}</div>
          </div>
        `;
      }).join('');

      const passed   = auditLog.filter(e => e.result === 'pass').length;
      const failed   = auditLog.filter(e => e.result === 'fail').length;
      const warnings = auditLog.filter(e => e.result === 'warning').length;
      auditSummary.innerHTML = `
        <div class="audit-summary-title">INSPECTION SUMMARY</div>
        <div class="audit-summary-stats">
          <div class="audit-stat"><div class="audit-stat-num ok">${passed}</div><div class="audit-stat-label">PASSED</div></div>
          <div class="audit-stat"><div class="audit-stat-num">${failed}</div><div class="audit-stat-label">FAILED</div></div>
          <div class="audit-stat"><div class="audit-stat-num wa">${warnings}</div><div class="audit-stat-label">WARNINGS</div></div>
          <div class="audit-stat"><div class="audit-stat-num">${auditLog.length}</div><div class="audit-stat-label">TOTAL</div></div>
        </div>
        <div class="audit-hold">DISPOSITION: ASSEMBLY HOLD — Defects DEF-2847 and DEF-2849 require corrective action before flight release.</div>
      `;

      signoffTs.textContent = fmtTime(now);
    }

    let recordLocked = false;

    // Event listeners
    const onScanClick = () => { if (!scanBtn.disabled) runFullScan(); };
    scanBtn.addEventListener('click', onScanClick);

    const onTwinToggle = () => {
      const isActive = specZones.classList.toggle('visible');
      twinToggle.classList.toggle('active', isActive);
      twinToggle.textContent = isActive ? 'SPEC VIEW ON' : 'SPEC VIEW';
      appendLog(isActive ? 'Digital twin overlay enabled.' : 'Digital twin overlay hidden.', 'info');
    };
    twinToggle.addEventListener('click', onTwinToggle);

    const onDpClose = () => closeDefectPanel();
    (document.getElementById('dpClose') as HTMLButtonElement).addEventListener('click', onDpClose);

    const markerHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = [];
    ['m1', 'm2', 'm3'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const fn = (e: Event) => {
        e.stopPropagation();
        if ((defectPanel as any).dataset.for === id && defectPanel.style.display === 'block') {
          closeDefectPanel();
        } else {
          openDefectPanel(id, el);
        }
      };
      el.addEventListener('click', fn);
      markerHandlers.push({ el, fn });
    });

    const onDiagramClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.defect-panel') && !target.closest('.defect-marker')) {
        closeDefectPanel();
      }
    };
    diagram.addEventListener('click', onDiagramClick);

    const onAuditTrail = () => {
      buildAuditModal();
      auditModal.classList.add('show');
      if (!recordLocked) {
        signoffBtn.style.display = '';
        signoffBtn.disabled      = false;
        signoffBtn.textContent   = 'SIGN OFF AND LOCK RECORD';
      }
    };
    auditTrailBtn.addEventListener('click', onAuditTrail);

    const onAuditClose = () => auditModal.classList.remove('show');
    auditClose.addEventListener('click', onAuditClose);

    const onAuditModalClick = (e: Event) => {
      if (e.target === auditModal) auditModal.classList.remove('show');
    };
    auditModal.addEventListener('click', onAuditModalClick);

    const onSignoff = () => {
      const ts = new Date();
      signoffTs.textContent  = fmtTime(ts);
      signoffBtn.disabled    = true;
      signoffBtn.textContent = 'LOCKING...';
      setTimeout(() => {
        recordLocked             = true;
        signoffBtn.style.display = 'none';
        signoffLocked.classList.add('show');
        appendLog('Audit record signed off and locked by CGQ-INS-0472.', 'info');
        appendLog('Assembly hold confirmed. Awaiting corrective action.', 'fail');
      }, 900);
    };
    signoffBtn.addEventListener('click', onSignoff);

    // Init
    stepCounter.textContent  = `STEP 1 OF ${STEPS.length}`;
    stepName.textContent     = STEPS[0].name;
    stepLocation.textContent = STEPS[0].location;
    setChecklistState(0, 'active');
    appendLog('HoloLens 2 connected. Digital twin loaded.', 'scan');
    appendLog('Blueprint: 737-880 Wing Assy 737-WNG-042', 'info');
    appendLog('Ready — click BEGIN SCAN to start.', 'info');

    return () => {
      scanBtn.removeEventListener('click', onScanClick);
      twinToggle.removeEventListener('click', onTwinToggle);
      const dpCloseBtn = document.getElementById('dpClose') as HTMLButtonElement;
      if (dpCloseBtn) dpCloseBtn.removeEventListener('click', onDpClose);
      markerHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
      diagram.removeEventListener('click', onDiagramClick);
      auditTrailBtn.removeEventListener('click', onAuditTrail);
      auditClose.removeEventListener('click', onAuditClose);
      auditModal.removeEventListener('click', onAuditModalClick);
      signoffBtn.removeEventListener('click', onSignoff);
    };
  }, []);

  return (
    <div className="cqa-hud">
      <div className="top-bar" style={{ justifyContent: 'flex-start', gap: 0 }}>
        <Link to="/cognitive-qa/demo" className="back-link">&#8592; BACK</Link>
        <Link
          to="/cognitive-qa"
          className="brand"
          style={{ borderRight: '1px solid rgba(245,166,35,0.16)', paddingRight: '20px', marginRight: '16px', color: '#f5a623', letterSpacing: '0.2em', fontSize: '0.72rem' }}
        >
          <div className="brand-dot" style={{ background: '#f5a623', boxShadow: '0 0 8px #f5a623' }}></div>
          COGNITIVE QA
        </Link>
        <div className="top-bar-center">
          <div className="brand-dot"></div>
          BOEING INSPECTOR
        </div>
        <div className="top-bar-right">
          <span>PART: WING ASSY 737-WNG-042</span>
          <button className="twin-toggle" id="twinToggle">SPEC VIEW</button>
          <button className="twin-toggle" onClick={() => setGuideOpen(true)}>GUIDE</button>
          <span className="badge badge-red" id="topBadge">INSPECTION READY</span>
        </div>
      </div>

      <div className="workspace">
        <div className="diagram-area" id="diagram">

          <svg className="diagram-svg" viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <g filter="url(#glow)" stroke="#00e5ff" strokeWidth="1" fill="none" opacity="0.85">
              <path d="M 80 200 Q 300 140 820 100" strokeWidth="1.5"/>
              <path d="M 80 310 Q 300 330 820 300" strokeWidth="1.5"/>
              <path d="M 820 100 L 820 300" strokeWidth="1.5"/>
              <path d="M 80 200 L 80 310" strokeWidth="1.5"/>
              <path d="M 80 200 Q 75 255 80 310" stroke="#00e5ff" strokeWidth="2"/>
              <path d="M 820 100 Q 825 200 820 300" stroke="#00e5ff" strokeWidth="2"/>
              <line x1="180" y1="175" x2="180" y2="323" strokeWidth="2"/>
              <line x1="680" y1="110" x2="680" y2="295" strokeWidth="2"/>
              <line x1="180" y1="175" x2="680" y2="110"/>
              <line x1="180" y1="323" x2="680" y2="295"/>
              <line x1="270" y1="164" x2="270" y2="328"/>
              <line x1="360" y1="153" x2="360" y2="328"/>
              <line x1="450" y1="142" x2="450" y2="320"/>
              <line x1="540" y1="130" x2="540" y2="308"/>
              <line x1="630" y1="118" x2="630" y2="297"/>
              <path d="M 80 215 Q 300 160 820 118" strokeWidth="0.5" opacity="0.5"/>
              <path d="M 80 230 Q 300 178 820 136" strokeWidth="0.5" opacity="0.5"/>
              <path d="M 80 245 Q 300 196 820 154" strokeWidth="0.5" opacity="0.5"/>
              <path d="M 80 295 Q 300 315 820 285" strokeWidth="0.5" opacity="0.5"/>
              <path d="M 80 280 Q 300 298 820 270" strokeWidth="0.5" opacity="0.5"/>
              <line x1="180" y1="175" x2="820" y2="100" strokeWidth="2.5" opacity="0.6"/>
              <line x1="180" y1="323" x2="820" y2="300" strokeWidth="2.5" opacity="0.6"/>
              <circle cx="180" cy="220" r="3" fill="#00e5ff" opacity="0.7"/>
              <circle cx="180" cy="255" r="3" fill="#00e5ff" opacity="0.7"/>
              <circle cx="180" cy="290" r="3" fill="#00e5ff" opacity="0.7"/>
              <circle cx="680" cy="160" r="3" fill="#00e5ff" opacity="0.7"/>
              <circle cx="680" cy="190" r="3" fill="#00e5ff" opacity="0.7"/>
              <circle cx="680" cy="220" r="3" fill="#00e5ff" opacity="0.7"/>
              <circle cx="680" cy="250" r="3" fill="#00e5ff" opacity="0.7"/>
              <line x1="80" y1="370" x2="820" y2="370" strokeWidth="0.5" opacity="0.3"/>
              <line x1="80" y1="365" x2="80" y2="375" strokeWidth="0.5" opacity="0.3"/>
              <line x1="820" y1="365" x2="820" y2="375" strokeWidth="0.5" opacity="0.3"/>
              <text x="450" y="385" fill="#00e5ff" fontSize="9" textAnchor="middle" opacity="0.4" fontFamily="monospace">737-880 WING SPAN SECTION — 18.4m</text>
              <line x1="40" y1="200" x2="40" y2="310" strokeWidth="0.5" opacity="0.3"/>
              <text x="28" y="260" fill="#00e5ff" fontSize="9" textAnchor="middle" opacity="0.4" fontFamily="monospace" transform="rotate(-90,28,260)">2.6m</text>
            </g>
          </svg>

          <div className="spec-zones" id="specZones">
            <div className="spec-zone" id="sz0" style={{ left:'10%', top:'25%', width:'17%', height:'55%' }}><span className="spec-zone-label">FRONT SPAR</span></div>
            <div className="spec-zone" id="sz1" style={{ left:'30%', top:'28%', width:'17%', height:'52%' }}><span className="spec-zone-label">RIB STA 4</span></div>
            <div className="spec-zone" id="sz2" style={{ left:'2%',  top:'28%', width:'10%', height:'55%' }}><span className="spec-zone-label">LEAD EDGE</span></div>
            <div className="spec-zone" id="sz3" style={{ left:'55%', top:'20%', width:'18%', height:'57%' }}><span className="spec-zone-label">TRAIL EDGE</span></div>
            <div className="spec-zone" id="sz4" style={{ left:'20%', top:'32%', width:'50%', height:'38%' }}><span className="spec-zone-label">WING BOX</span></div>
          </div>

          <div className="scan-area-hl" id="scanAreaHL"></div>
          <div className="scan-beam"    id="scanBeam"></div>
          <div className="scan-flash"   id="scanFlash"></div>

          <div className="spec-card">
            <strong>DESIGN SPECIFICATION</strong>
            737-880 Wing Assembly<br/>
            Station: RIB 4 — Upper Spar<br/>
            Spec Rev: 4.2.1 · FAA AC 43.13
          </div>

          <div className="data-hud" id="dataHud">
            <div className="hud-title-row">
              <div className="hud-live-dot"></div>
              LIVE SCAN DATA
            </div>
            <div className="hud-rows">
              <div className="hud-row"><span className="hud-key">COMPONENT</span><span className="hud-val" id="hudComp">—</span></div>
              <div className="hud-row"><span className="hud-key">READING</span><span className="hud-val live" id="hudReading">—</span></div>
              <div className="hud-row"><span className="hud-key">SPEC</span><span className="hud-val" id="hudSpec">—</span></div>
              <div className="hud-row"><span className="hud-key">STATUS</span><span className="hud-val" id="hudStatus">—</span></div>
              <div className="hud-row"><span className="hud-key">CONFIDENCE</span><span className="hud-val" id="hudConf">—</span></div>
            </div>
          </div>

          <div className="defect-marker" style={{ left:'38%', top:'52%' }} id="m1"><div className="marker-ring"><div className="marker-inner"></div></div></div>
          <div className="defect-marker" style={{ left:'62%', top:'44%' }} id="m2"><div className="marker-ring"><div className="marker-inner"></div></div></div>
          <div className="defect-marker" style={{ left:'55%', top:'63%' }} id="m3"><div className="marker-ring warning"><div className="marker-inner"></div></div></div>

          <div className="defect-panel" id="defectPanel" style={{ display:'none' }} role="dialog" aria-labelledby="dpTitle">
            <div className="dp-header">
              <div className="dp-id" id="dpId">DEFECT — DEF-0000</div>
              <button className="dp-close" id="dpClose" aria-label="Close">&#10005;</button>
            </div>
            <div className="dp-body">
              <span className="dp-severity-badge" id="dpBadge">CRITICAL</span>
              <div className="dp-title"    id="dpTitle">—</div>
              <div className="dp-location" id="dpLocation">—</div>
              <div className="dp-measurements">
                <div className="dp-meas-row"><span className="dp-meas-label">SPECIFICATION</span><span className="dp-meas-value spec" id="dpSpec">—</span></div>
                <div className="dp-meas-row"><span className="dp-meas-label">MEASURED</span><span className="dp-meas-value measured" id="dpMeasured">—</span></div>
                <div className="dp-tol-track">
                  <div className="dp-tol-fill" id="dpTolFill" style={{ width:'0%' }}></div>
                  <div className="dp-tol-spec-marker" id="dpTolSpec" style={{ left:'100%' }}></div>
                </div>
                <div className="dp-variance-label" id="dpVariance">—</div>
              </div>
              <div className="dp-action-label">REQUIRED ACTION</div>
              <div className="dp-action" id="dpAction">—</div>
              <div className="dp-ref"    id="dpRef">—</div>
            </div>
          </div>

        </div>

        <div className="sidebar">
          <div className="sidebar-section">
            <div className="hud-label">INSPECTION WORKFLOW</div>
            <div className="step-meta">
              <span className="step-counter" id="stepCounter">STEP 1 OF 5</span>
              <span className="step-status-badge ready" id="stepBadge">READY</span>
            </div>
            <div className="step-progress-track"><div className="step-progress-fill" id="progressFill"></div></div>
            <div className="step-name"     id="stepName">SPAR CAP ALIGNMENT</div>
            <div className="step-location" id="stepLocation">Front Spar, Full Length</div>
            <button className="scan-btn" id="scanBtn">BEGIN SCAN</button>
          </div>

          <div className="sidebar-section">
            <div className="hud-label">ASSEMBLY VERIFICATION</div>
            <div className="checklist" id="checklist">
              <div className="checklist-item active"  id="ci0"><div className="check-icon">&#9655;</div>Spar Cap Alignment</div>
              <div className="checklist-item pending" id="ci1"><div className="check-icon">&#9675;</div>Rib Station 4 Fastener (Bolt A7-R4)</div>
              <div className="checklist-item pending" id="ci2"><div className="check-icon">&#9675;</div>Leading Edge Skin Panel</div>
              <div className="checklist-item pending" id="ci3"><div className="check-icon">&#9675;</div>Trailing Edge Bracket</div>
              <div className="checklist-item pending" id="ci4"><div className="check-icon">&#9675;</div>Fuel Seal Integrity</div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="hud-label">AI DETECTION LOG</div>
            <div className="log-feed" id="logFeed">
              <div className="log-entry info"><span className="log-time">--:--:--</span>System ready. Awaiting inspection start.</div>
            </div>
          </div>

          <div className="sidebar-section" id="actionSection" style={{ display:'none' }}>
            <div className="action-label" id="actionLabel">ACTION REQUIRED</div>
            <div className="action-box"   id="actionBox"></div>
          </div>

          <div className="complete-banner" id="completeBanner">
            <strong>INSPECTION COMPLETE</strong>
            <p>2 critical defects logged. 1 variance flagged. Assembly hold required before proceeding.</p>
            <button className="audit-trail-btn" id="auditTrailBtn">VIEW AUDIT TRAIL &amp; SIGN OFF</button>
          </div>
        </div>
      </div>

      <div className="status-bar">
        <span><div className="status-bar-dot"></div><span className="status-active">DIGITAL TWIN OVERLAY: ACTIVE</span></span>
        <span id="statusVariance" className="status-warn" style={{ display:'none' }}>&#9650; VARIANCE DETECTED: 2.3mm OFFSET</span>
        <span id="statusInspection">INSPECTION READY</span>
      </div>

      <div className="audit-modal" id="auditModal" role="dialog" aria-modal={true} aria-label="Inspection Audit Trail">
        <div className="audit-panel">
          <div className="audit-header">
            <div className="audit-title">INSPECTION AUDIT TRAIL</div>
            <button className="audit-close" id="auditClose">&#10005; CLOSE</button>
          </div>
          <div className="audit-body">
            <div className="audit-meta" id="auditMeta"></div>
            <div className="audit-steps-title">CHECKPOINT RESULTS</div>
            <div id="auditSteps"></div>
            <div className="audit-summary" id="auditSummary"></div>
            <div className="audit-signoff">
              <div className="signoff-label">INSPECTOR SIGN-OFF</div>
              <div className="signoff-fields">
                <div className="signoff-field">
                  <div className="signoff-field-label">INSPECTOR ID</div>
                  <div className="signoff-field-val">CGQ-INS-0472</div>
                </div>
                <div className="signoff-field">
                  <div className="signoff-field-label">CERTIFICATION</div>
                  <div className="signoff-field-val">FAA IA CERT #4821-C</div>
                </div>
                <div className="signoff-field">
                  <div className="signoff-field-label">AIRCRAFT PART</div>
                  <div className="signoff-field-val">737-WNG-042</div>
                </div>
                <div className="signoff-field">
                  <div className="signoff-field-label">TIMESTAMP</div>
                  <div className="signoff-field-val" id="signoffTs">—</div>
                </div>
              </div>
              <button className="signoff-btn" id="signoffBtn">SIGN OFF AND LOCK RECORD</button>
              <div className="signoff-locked" id="signoffLocked">
                <strong>RECORD LOCKED</strong>
                Signed by CGQ-INS-0472 — Assembly hold confirmed. Defects DEF-2847 and DEF-2849 require corrective action before flight release.
              </div>
            </div>
          </div>
        </div>
      </div>

      {guideOpen && (
        <div className="guide-modal-overlay" onClick={() => setGuideOpen(false)}>
          <div className="guide-modal" onClick={e => e.stopPropagation()}>
            <div className="guide-header">
              <span className="guide-title">? HOW TO USE THIS VIEW</span>
              <button className="audit-close" onClick={() => setGuideOpen(false)}>&#10005; CLOSE</button>
            </div>
            <div className="guide-body">
              <div className="guide-role-card">
                <div className="guide-role-label">YOUR ROLE</div>
                <div className="guide-role-title">ASSEMBLY LINE QUALITY INSPECTOR</div>
                <p className="guide-role-desc">You are simulating a Boeing quality inspector using Cognitive QA's HoloLens-powered AI inspection system. The digital twin overlay maps the aircraft blueprint onto the physical wing assembly in front of you. Your job is to run the scan, review findings, and sign off on the inspection record.</p>
              </div>
              <div className="guide-steps">
                <div className="guide-step"><span className="guide-step-num">01</span><span className="guide-step-text"><strong>Click BEGIN SCAN</strong> in the sidebar to start the 5-step inspection sequence. The system will scan each checkpoint automatically.</span></div>
                <div className="guide-step"><span className="guide-step-num">02</span><span className="guide-step-text"><strong>Watch the scan beam</strong> sweep across the wing diagram. The Live Scan Data HUD (bottom left) shows real-time readings, specs, and confidence levels.</span></div>
                <div className="guide-step"><span className="guide-step-num">03</span><span className="guide-step-text"><strong>Click the defect markers</strong> (red/orange pulsing circles) that appear on the diagram to open the defect detail panel with measurements, tolerance bars, and required actions.</span></div>
                <div className="guide-step"><span className="guide-step-num">04</span><span className="guide-step-text"><strong>Toggle SPEC VIEW</strong> in the top bar to overlay digital twin specification zones on the wing diagram. Zones change colour based on scan results.</span></div>
                <div className="guide-step"><span className="guide-step-num">05</span><span className="guide-step-text"><strong>After all 5 steps complete</strong>, click VIEW AUDIT TRAIL &amp; SIGN OFF to review the full inspection record, then sign off and lock the report.</span></div>
              </div>
              <div className="guide-tip">
                <span className="guide-tip-icon">&#9432;</span>
                <span><strong>Red markers</strong> indicate critical defects requiring immediate action. <strong>Orange markers</strong> indicate variances that need monitoring. All findings are logged to the tamper-proof audit trail.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
