// @ts-nocheck -- imported code written for looser TypeScript settings
import { useEffect, useRef, useState } from 'react';
import { Link } from '@/lib/router-compat';
import './cognitive-qa-hud.css';

export default function CognitiveQAMRO() {
  const [guideOpen, setGuideOpen] = useState(false);
  const clockIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanIntervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // ── ZONE DATA ──────────────────────────────────────────────────────────────
    const ZONES = [
      {
        id: 'z-nose', overlayId: 'zo-nose', name: 'NOSE / RADOME',
        status: 'good', findings: 0,
        lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
        note: 'All radome panels within spec. No delamination detected. Seals nominal.'
      },
      {
        id: 'z-cockpit', overlayId: 'zo-cockpit', name: 'COCKPIT / FWD FUSE',
        status: 'critical', findings: 1,
        lastCheck: '2025-01-14', nextDue: '2025-05-18', flightHrs: '12,842',
        note: 'DEF-003: Hairline crack at Frame 12, Skin Panel C. NDT required before next revenue flight.'
      },
      {
        id: 'z-fwd', overlayId: 'zo-fwd', name: 'FWD CABIN',
        status: 'critical', findings: 2,
        lastCheck: '2025-01-14', nextDue: '2025-03-01', flightHrs: '12,842',
        note: 'DEF-001: Missing bolt at Frame 42, Stringer 7. DEF-004: Loose fastener at Frame 61 door frame. Assembly hold active.'
      },
      {
        id: 'z-mid', overlayId: 'zo-mid', name: 'MID CABIN',
        status: 'good', findings: 0,
        lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
        note: 'All structural checks passed. No findings. Released at last A-Check.'
      },
      {
        id: 'z-aft', overlayId: 'zo-aft', name: 'AFT CABIN',
        status: 'warning', findings: 1,
        lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
        note: 'DEF-002: Misaligned bracket at Frame 38, L-Bracket B. Offset 3.2mm beyond tolerance. Monitor — repair at next scheduled check.'
      },
      {
        id: 'z-tail', overlayId: 'zo-tail', name: 'TAIL / EMPENNAGE',
        status: 'good', findings: 0,
        lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
        note: 'Horizontal and vertical stabilizers nominal. Control surface play within limits.'
      },
      {
        id: 'z-wing', overlayId: 'zo-wing', name: 'WING / ENGINE',
        status: 'good', findings: 0,
        lastCheck: '2024-11-18', nextDue: '2025-05-18', flightHrs: '12,842',
        note: 'Wing structure and engine mounts within spec. Fan blades inspected. No erosion detected.'
      }
    ];

    const HISTORY = [
      {
        id: 'INS-2025-0004', date: '2025-01-14', type: 'UNSCHEDULED', result: 'open',
        subtype: 'Discrepancy Report — Frame 12',
        inspector: 'M. REYES', station: 'SEA · Hangar 4',
        findings: [
          'DEF-003 opened: Hairline crack at Frame 12, Skin Panel C — 4.7mm length',
          'NDT inspection initiated — pending results',
          'Aircraft placed on ground hold pending engineering disposition'
        ]
      },
      {
        id: 'INS-2025-0002', date: '2025-01-09', type: 'UNSCHEDULED', result: 'open',
        subtype: 'Discrepancy Report — FWD Cabin',
        inspector: 'T. OKAFOR', station: 'SEA · Hangar 4',
        findings: [
          'DEF-001 opened: Missing bolt at Frame 42, Stringer 7',
          'DEF-004 opened: Loose fastener at Frame 61 door frame — 8 Nm vs 25 Nm required',
          'Both items logged as open — corrective action pending'
        ]
      },
      {
        id: 'INS-2024-0047', date: '2024-11-18', type: 'A-CHECK', result: 'pass',
        subtype: 'Routine 500-hr Structural Check',
        inspector: 'T. OKAFOR', station: 'SEA · Hangar 2',
        findings: [
          '851 structural components scanned across all 7 zones',
          'Zero critical findings logged',
          'DEF-002 (Aft bracket offset) noted — within monitor threshold',
          'Signed off by T. Okafor — Released to service'
        ]
      },
      {
        id: 'INS-2024-0039', date: '2024-09-03', type: 'UNSCHEDULED', result: 'closed',
        subtype: 'Bolt Replacement — Frame 42',
        inspector: 'T. OKAFOR', station: 'SEA · Hangar 2',
        findings: [
          'DEF-002 rework: Frame 42 bolt replaced with HI-LOK HL-4118',
          'Re-torqued to 35 Nm — verified with calibrated torque wrench',
          'DEF-002 closed — cleared for service'
        ]
      },
      {
        id: 'INS-2024-0031', date: '2024-06-22', type: 'B-CHECK', result: 'pass',
        subtype: 'Structural Inspection — 2,000-hr Check',
        inspector: 'A. SINGH', station: 'LAX · Hangar 7',
        findings: [
          'Full fuselage structural scan completed — 1,204 points inspected',
          'Frame 38 bracket: 0.8mm offset noted, within tolerance at time of check',
          'Engine mounts and nacelles inspected — nominal',
          'Cleared — released to service'
        ]
      },
      {
        id: 'INS-2024-0018', date: '2024-03-10', type: 'A-CHECK', result: 'pass',
        subtype: 'Routine 500-hr Structural Check',
        inspector: 'M. REYES', station: 'SEA · Hangar 4',
        findings: [
          'All 7 zones inspected — 0 findings',
          'Previous bolt replacement (Frame 42) verified and holding',
          'Released to service — no open items'
        ]
      },
      {
        id: 'INS-2023-0062', date: '2023-11-05', type: 'C-CHECK', result: 'pass',
        subtype: '6-Year Heavy Maintenance',
        inspector: 'D. CHEN', station: 'MHV · Facility B',
        findings: [
          'Full aircraft disassembly and structural inspection',
          'Engine overhaul completed — 737 CFM56 overhauled to zero-time',
          'Fuselage repaint and corrosion treatment applied',
          'All systems tested — zero open findings at release',
          'Released to service — signed by D. Chen (DAR #7741-A)'
        ]
      }
    ];

    const DEFECTS: Record<string, any> = {
      d1: { id: 'DEF-001', title: 'Missing Bolt', detail: 'Frame 42, Stringer 7\nRequires immediate replacement\nFastener spec: HI-LOK HL-4118', severity: 'SEVERITY: CRITICAL — GROUNDING RISK', type: 'critical' },
      d2: { id: 'DEF-002', title: 'Misaligned Bracket', detail: 'Frame 38, L-Bracket B\nOffset: 3.2mm beyond tolerance\nRequires re-alignment and re-torque', severity: 'SEVERITY: WARNING — REPAIR REQUIRED', type: 'warning' },
      d3: { id: 'DEF-003', title: 'Hairline Crack', detail: 'Frame 12, Skin Panel C\nCrack length: 4.7mm\nNon-destructive test required', severity: 'SEVERITY: CRITICAL — HOLD REQUIRED', type: 'critical' },
      d4: { id: 'DEF-004', title: 'Loose Fastener', detail: 'Frame 61, Door Frame\nTorque: 8 Nm (required: 25 Nm)\nMonitor — re-torque at next check', severity: 'SEVERITY: WARNING — MONITOR', type: 'warning' }
    };

    const diagram    = document.getElementById('diagram')!;
    const zoneHud    = document.getElementById('zoneHud')!;
    const healthGrid = document.getElementById('healthGrid')!;
    const timelineEl = document.getElementById('timeline')!;
    const popup      = document.getElementById('popup')! as HTMLElement;

    // ── CLOCK ──────────────────────────────────────────────────────────────────
    function updateClock() {
      const n = new Date();
      const clockEl = document.getElementById('clock');
      if (clockEl) clockEl.textContent =
        [n.getHours(), n.getMinutes(), n.getSeconds()]
          .map(v => String(v).padStart(2, '0')).join(':');
    }
    updateClock();
    clockIntervalRef.current = setInterval(updateClock, 1000);

    // ── SCAN BAR ───────────────────────────────────────────────────────────────
    const scanFill   = document.getElementById('scan-fill') as HTMLElement;
    const scanPctEl  = document.getElementById('scan-pct')!;
    const scanStatEl = document.getElementById('scan-status')!;
    let scanPct = 0;
    scanIntervalRef.current = setInterval(() => {
      scanPct += 1;
      if (scanFill) scanFill.style.width = scanPct + '%';
      if (scanPctEl) scanPctEl.textContent = scanPct + '%';
      if (scanPct >= 100) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        if (scanStatEl) { scanStatEl.textContent = 'COMPLETE'; scanStatEl.style.color = 'var(--green)'; }
        if (scanPctEl) (scanPctEl as HTMLElement).style.color = 'var(--green)';
      }
    }, 40);

    // ── ZONE OVERLAYS ──────────────────────────────────────────────────────────
    const STATUS_LABEL: Record<string, string> = { good: 'NOMINAL', warning: 'ATTENTION', critical: 'CRITICAL' };

    ZONES.forEach(zone => {
      const el = document.getElementById(zone.overlayId);
      if (el) el.classList.add(zone.status);
    });

    // ── ZONE HUD ───────────────────────────────────────────────────────────────
    let activeZoneId: string | null = null;

    function showZoneHud(zoneId: string, triggerEl: HTMLElement) {
      const zone = ZONES.find(z => z.id === zoneId);
      if (!zone) return;

      const findText = zone.findings === 0
        ? '0 open findings'
        : `${zone.findings} open finding${zone.findings > 1 ? 's' : ''}`;

      zoneHud.innerHTML = `
        <div class="zhud-top">
          <div class="zhud-name">${zone.name}</div>
          <button class="zhud-close" id="zhudCloseBtn">&#10005;</button>
        </div>
        <div class="zhud-status ${zone.status}">
          <div class="zhud-dot"></div>
          <span class="zhud-lbl">${STATUS_LABEL[zone.status]}</span>
        </div>
        <div class="zhud-rows">
          <div class="zhud-row"><span class="zhud-key">FINDINGS</span><span class="zhud-val">${findText}</span></div>
          <div class="zhud-row"><span class="zhud-key">LAST CHECK</span><span class="zhud-val">${zone.lastCheck}</span></div>
          <div class="zhud-row"><span class="zhud-key">NEXT DUE</span><span class="zhud-val">${zone.nextDue}</span></div>
          <div class="zhud-row"><span class="zhud-key">FLIGHT HRS</span><span class="zhud-val">${zone.flightHrs}</span></div>
        </div>
        <div class="zhud-note">${zone.note}</div>
      `;

      const svgEl     = document.getElementById('aircraftSvg')!;
      const svgRect   = svgEl.getBoundingClientRect();
      const diagRect  = diagram.getBoundingClientRect();
      const zoneRect  = triggerEl.getBoundingClientRect();

      const scroll = diagram.scrollTop;
      let left = zoneRect.right - diagRect.left + 12;
      let top  = (zoneRect.top - diagRect.top) + scroll - 10;
      if (left + 240 > diagRect.width - 8)  left = zoneRect.left - diagRect.left - 244;
      const viewH = diagRect.height;
      if ((zoneRect.top - diagRect.top) + 220 > viewH - 8) top = scroll + viewH - 228;
      if (top < scroll + 8) top = scroll + 8;

      zoneHud.style.left    = left + 'px';
      zoneHud.style.top     = top  + 'px';
      zoneHud.style.display = 'block';
      void (zoneHud as HTMLElement).offsetWidth;
      zoneHud.classList.add('show');

      const closeBtn = document.getElementById('zhudCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', e => {
          e.stopPropagation();
          closeZoneHud();
        });
      }

      document.querySelectorAll('.health-zone').forEach(el => el.classList.remove('selected'));
      const gridItem = document.querySelector(`.health-zone[data-zone="${zoneId}"]`);
      if (gridItem) gridItem.classList.add('selected');

      document.querySelectorAll('.zone-overlay').forEach(el => el.classList.remove('selected'));
      triggerEl.classList.add('selected');

      activeZoneId = zoneId;
    }

    function closeZoneHud() {
      zoneHud.classList.remove('show');
      setTimeout(() => { zoneHud.style.display = 'none'; }, 200);
      document.querySelectorAll('.zone-overlay').forEach(el => el.classList.remove('selected'));
      document.querySelectorAll('.health-zone').forEach(el => el.classList.remove('selected'));
      activeZoneId = null;
    }

    // SVG zone clicks
    const zoneOverlayHandlers: Array<{ el: Element; fn: (e: Event) => void }> = [];
    document.getElementById('zoneOverlays')!.querySelectorAll('.zone-overlay').forEach(el => {
      const fn = (e: Event) => {
        e.stopPropagation();
        const zoneId = (el as HTMLElement).dataset.zone!;
        if (activeZoneId === zoneId) {
          closeZoneHud();
        } else {
          showZoneHud(zoneId, el as HTMLElement);
        }
      };
      el.addEventListener('click', fn);
      zoneOverlayHandlers.push({ el, fn });
    });

    // Close on diagram background click
    function hideDefectPopup() {
      popup.style.display = 'none';
      activeDefect = null;
    }

    const onDiagramClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.zone-hud') && !target.closest('.zone-overlay') &&
          !target.closest('.svg-marker') && !target.closest('.defect-popup')) {
        closeZoneHud();
        hideDefectPopup();
      }
    };
    diagram.addEventListener('click', onDiagramClick);

    // ── HEALTH GRID ────────────────────────────────────────────────────────────
    const healthZoneHandlers: Array<{ el: HTMLElement; fn: () => void }> = [];
    ZONES.forEach(zone => {
      const findText = zone.findings === 0 ? 'No findings' : `${zone.findings} finding${zone.findings > 1 ? 's' : ''}`;
      const el = document.createElement('div');
      el.className = `health-zone ${zone.status}`;
      el.dataset.zone = zone.id;
      el.innerHTML = `
        <div class="hz-dot"></div>
        <div class="hz-info">
          <div class="hz-name">${zone.name}</div>
          <div class="hz-find">${findText}</div>
        </div>
      `;
      const fn = () => {
        const overlayEl = document.getElementById(zone.overlayId)!;
        if (activeZoneId === zone.id) {
          closeZoneHud();
        } else {
          showZoneHud(zone.id, overlayEl);
        }
      };
      el.addEventListener('click', fn);
      healthZoneHandlers.push({ el, fn });
      healthGrid.appendChild(el);
    });

    // ── INSPECTION HISTORY TIMELINE ────────────────────────────────────────────
    const RESULT_LABEL: Record<string, string> = { pass: 'PASS', open: 'OPEN', closed: 'CLOSED', rework: 'REWORK' };

    const timelineHandlers: Array<{ el: HTMLElement; fn: () => void }> = [];
    HISTORY.forEach((entry, _i) => {
      const el = document.createElement('div');
      el.className = `tl-entry ${entry.result}${entry.result === 'open' ? ' expanded' : ''}`;

      const findingsHtml = entry.findings
        .map(f => `<div class="tl-finding">${f}</div>`)
        .join('');

      el.innerHTML = `
        <div class="tl-dot"></div>
        <div class="tl-top">
          <span class="tl-date">${entry.date}</span>
          <span>
            <span class="tl-badge">${RESULT_LABEL[entry.result]}</span>
            <span class="tl-chevron">&#9660;</span>
          </span>
        </div>
        <div class="tl-type">${entry.type}</div>
        <div class="tl-subtype">${entry.subtype}</div>
        <div class="tl-meta">
          <span>${entry.inspector}</span>
          <span>${entry.station}</span>
          <span>${entry.id}</span>
        </div>
        <div class="tl-findings">${findingsHtml}</div>
      `;

      const fn = () => el.classList.toggle('expanded');
      el.addEventListener('click', fn);
      timelineHandlers.push({ el, fn });
      timelineEl.appendChild(el);
    });

    // ── DEFECT MARKERS ─────────────────────────────────────────────────────────
    let activeDefect: string | null = null;

    function showDefectPopup(id: string, markerEl: Element) {
      const d = DEFECTS[id];
      if (!d) return;
      popup.className = 'defect-popup' + (d.type === 'warning' ? ' warning' : '');
      popup.innerHTML = `
        <div class="defect-popup-id">DEFECT — ${d.id}</div>
        <div class="defect-popup-title">${d.title}</div>
        <div class="defect-popup-detail">${d.detail.replace(/\n/g, '<br>')}</div>
        <div class="defect-popup-severity">${d.severity}</div>
      `;
      const rect     = markerEl.getBoundingClientRect();
      const diagRect = diagram.getBoundingClientRect();
      const scroll   = diagram.scrollTop;
      let left = (rect.left + rect.width / 2) - diagRect.left + 18;
      let top  = (rect.top  + rect.height / 2) - diagRect.top  + scroll - 20;
      if (left + 230 > diagRect.width - 10) left = (rect.left + rect.width / 2) - diagRect.left - 238;
      if (top < scroll + 4) top = (rect.top + rect.height / 2) - diagRect.top + scroll + 20;
      popup.style.left    = left + 'px';
      popup.style.top     = top  + 'px';
      popup.style.display = 'block';
      activeDefect = id;
    }

    // ── DAMAGE MAP DATA ────────────────────────────────────────────────────────
    const DAMAGE_MAP = [
      {
        id: 'DEF-003', zone: 'COCKPIT / FWD FUSE', location: 'Frame 12 · Skin Panel C',
        sev: 'S1', sevLabel: 'CRITICAL', sevFill: 4,
        action: 'ground', actionLabel: 'AIRCRAFT GROUNDED',
        ref: 'AMM 53-10-11',
        basis: 'Crack exceeds SRM allowable limit — engineering disposition required before return to service'
      },
      {
        id: 'DEF-001', zone: 'FWD CABIN', location: 'Frame 42 · Stringer 7',
        sev: 'S1', sevLabel: 'CRITICAL', sevFill: 4,
        action: 'ground', actionLabel: 'AIRCRAFT GROUNDED',
        ref: 'AMM 51-40-01',
        basis: 'Missing primary structural fastener — no dispatch relief available, immediate rectification required'
      },
      {
        id: 'DEF-004', zone: 'FWD CABIN', location: 'Frame 61 · Door Frame',
        sev: 'S2', sevLabel: 'MAJOR', sevFill: 3,
        action: 'preflight', actionLabel: 'REPAIR BEFORE NEXT FLIGHT',
        ref: 'AMM 52-11-09',
        basis: 'Fastener torque 68% below minimum spec — CDL does not apply, flight safety risk confirmed'
      },
      {
        id: 'DEF-002', zone: 'AFT CABIN', location: 'Frame 38 · L-Bracket B',
        sev: 'S2', sevLabel: 'MAJOR', sevFill: 3,
        action: 'monitor', actionLabel: 'MONITOR — REPAIR AT NEXT CHECK',
        ref: 'SRM 53-00-05',
        basis: 'Bracket offset 3.2mm — within MEL monitor threshold, active trend watch required'
      }
    ];

    const ZONE_LOAD = [
      { name: 'COCKPIT / FWD FUSE', pct: 92, level: 'high'    },
      { name: 'FWD CABIN',          pct: 88, level: 'high'    },
      { name: 'AFT CABIN',          pct: 44, level: 'medium'  },
      { name: 'NOSE / RADOME',      pct:  7, level: 'nominal' },
      { name: 'MID CABIN',          pct:  5, level: 'nominal' },
      { name: 'WING / ENGINE',      pct:  5, level: 'nominal' },
      { name: 'TAIL / EMPENNAGE',   pct:  4, level: 'nominal' }
    ];

    const GNG = {
      value:  'NO-GO',
      reason: '2 S1 CRITICAL DEFECTS\nGROUND HOLD ACTIVE',
      isGo:   false
    };

    // ── DRAWER ─────────────────────────────────────────────────────────────────
    const drawer      = document.getElementById('damageDrawer')!;
    const dmgToggle   = document.getElementById('dmgToggle') as HTMLButtonElement;
    const drawerClose = document.getElementById('drawerClose') as HTMLButtonElement;
    let drawerOpen   = false;
    let barsAnimated = false;

    function buildDrawer() {
      const s1    = DAMAGE_MAP.filter(d => d.sev === 'S1').length;
      const s2    = DAMAGE_MAP.filter(d => d.sev === 'S2').length;
      const s3    = DAMAGE_MAP.filter(d => d.sev === 'S3').length;
      const clear = ZONES.filter(z => z.findings === 0).length;
      const refs  = [...new Set(DAMAGE_MAP.map(d => d.ref))];
      const ts    = new Date().toISOString().slice(0, 16).replace('T', ' ');

      const drawerSummaryEl = document.getElementById('drawerSummary')!;
      drawerSummaryEl.innerHTML = `
        <div>
          <div class="ds-block-label">AIRWORTHINESS DETERMINATION</div>
          <div class="gng-card${GNG.isGo ? ' go-state' : ''}">
            <div class="gng-value">${GNG.value}</div>
            <div class="gng-reason">${GNG.reason.replace('\n', '<br>')}</div>
          </div>
        </div>
        <div>
          <div class="ds-block-label">FINDING COUNTS</div>
          <div class="ds-counts">
            <div class="ds-count-row"><span class="ds-count-key">S1 CRITICAL</span><span class="ds-count-val s1-col">${s1}</span></div>
            <div class="ds-count-row"><span class="ds-count-key">S2 MAJOR</span><span class="ds-count-val s2-col">${s2}</span></div>
            <div class="ds-count-row"><span class="ds-count-key">S3 MINOR</span><span class="ds-count-val s3-col">${s3}</span></div>
            <div class="ds-count-row"><span class="ds-count-key">ZONES CLEAR</span><span class="ds-count-val ok-col">${clear} / ${ZONES.length}</span></div>
          </div>
        </div>
        <div>
          <div class="ds-block-label">REGULATORY BASIS</div>
          <div class="ds-refs">
            ${refs.map(r => {
              const parts = r.split(' ');
              return `<div class="ds-ref"><strong>${parts[0]}</strong> ${parts.slice(1).join(' ')}</div>`;
            }).join('')}
            <div class="ds-ref">Boeing AMM Rev 48 · MMEL Rev 12</div>
          </div>
        </div>
        <div class="ds-timestamp">ASSESSED: ${ts} UTC</div>
      `;

      const rows = DAMAGE_MAP.map(d => {
        const segs = [1,2,3,4].map(n =>
          `<div class="sev-seg${n <= d.sevFill ? ' on-' + d.sev.toLowerCase() : ''}"></div>`
        ).join('');
        return `
          <tr>
            <td><span class="dt-id">${d.id}</span></td>
            <td>
              <div class="dt-zone">${d.zone}</div>
              <div class="dt-loc">${d.location}</div>
              <div class="dt-basis">${d.basis}</div>
            </td>
            <td>
              <div class="sev-wrap">
                <div class="sev-segs">${segs}</div>
                <span class="sev-label ${d.sev.toLowerCase()}">${d.sev} · ${d.sevLabel}</span>
              </div>
            </td>
            <td><span class="act-badge ${d.action}">${d.actionLabel}</span></td>
            <td><span class="dt-ref">${d.ref}</span></td>
          </tr>`;
      }).join('');

      const bars = ZONE_LOAD.map(z => `
        <div class="zl-row ${z.level}">
          <span class="zl-name">${z.name}</span>
          <div class="zl-track"><div class="zl-fill" data-pct="${z.pct}"></div></div>
          <span class="zl-pct">${z.pct}%</span>
          <span class="zl-lvl">${z.level.toUpperCase()}</span>
        </div>`).join('');

      const drawerContentEl = document.getElementById('drawerContent')!;
      drawerContentEl.innerHTML = `
        <div class="dc-section">
          <div class="dc-label">DAMAGE SEVERITY MATRIX</div>
          <table class="dmg-table" role="table">
            <thead>
              <tr>
                <th>DEFECT</th>
                <th>ZONE / LOCATION</th>
                <th>SEVERITY</th>
                <th>REQUIRED ACTION</th>
                <th>REFERENCE</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="dc-section">
          <div class="dc-label">ZONE DAMAGE LOAD</div>
          <div class="zl-list">${bars}</div>
        </div>
      `;
    }

    function openDrawer() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      dmgToggle.setAttribute('aria-expanded', 'true');
      dmgToggle.classList.add('active');
      drawerOpen = true;
      if (!barsAnimated) {
        setTimeout(() => {
          document.querySelectorAll('.zl-fill').forEach(el => {
            (el as HTMLElement).style.width = (el as HTMLElement).dataset.pct + '%';
          });
          barsAnimated = true;
        }, 340);
      }
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      dmgToggle.setAttribute('aria-expanded', 'false');
      dmgToggle.classList.remove('active');
      drawerOpen = false;
    }

    buildDrawer();

    const onDmgToggle = () => drawerOpen ? closeDrawer() : openDrawer();
    dmgToggle.addEventListener('click', onDmgToggle);

    const onDrawerClose = () => closeDrawer();
    drawerClose.addEventListener('click', onDrawerClose);

    // Wire up SVG marker elements
    const markerHandlers: Array<{ el: Element; fn: (e: Event) => void }> = [];
    document.getElementById('markers')!.querySelectorAll('.svg-marker').forEach(el => {
      const fn = (e: Event) => {
        e.stopPropagation();
        const id = (el as HTMLElement).id;
        activeDefect === id ? hideDefectPopup() : showDefectPopup(id, el);
      };
      el.addEventListener('click', fn);
      markerHandlers.push({ el, fn });
    });

    return () => {
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current);
      if (scanIntervalRef.current)  clearInterval(scanIntervalRef.current);
      diagram.removeEventListener('click', onDiagramClick);
      dmgToggle.removeEventListener('click', onDmgToggle);
      drawerClose.removeEventListener('click', onDrawerClose);
      zoneOverlayHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
      healthZoneHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
      timelineHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
      markerHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
    };
  }, []);

  return (
    <div className="cqa-hud">

      <div className="top-bar" style={{ justifyContent: 'flex-start', gap: 0, fontSize: '0.65rem' }}>
        <Link to="/cognitive-qa/demo" className="back-link">&#8592; BACK</Link>
        <div className="top-bar-center">
          <div className="brand-dot"></div>
          <strong>COGNITIVE QA: MRO INSPECTOR v2.4.1</strong>
          <span>AIRCRAFT: 737-MAX-9</span>
          <span>TAIL: N-4892WL</span>
          <span>CYCLES: 12,842</span>
        </div>
        <div className="top-bar-right">
          <span className="hololens-badge">&#9679; HOLOLENS ACTIVE</span>
          <span className="linked-badge">&#8651; LINKED</span>
          <span id="clock">00:00:00</span>
          <button className="twin-toggle" onClick={() => setGuideOpen(true)}>GUIDE</button>
        </div>
      </div>

      {guideOpen && (
        <div className="guide-modal-overlay" onClick={() => setGuideOpen(false)}>
          <div className="guide-modal" onClick={e => e.stopPropagation()}>
            <div className="guide-modal-header">
              <span>INSPECTION GUIDE</span>
              <button className="guide-modal-close" onClick={() => setGuideOpen(false)}>✕</button>
            </div>
            <div className="guide-modal-body">
              <div className="guide-role-card">
                <div className="guide-role-title">YOUR ROLE</div>
                <div className="guide-role-name">MAINTENANCE, REPAIR &amp; OVERHAUL TECHNICIAN</div>
                <div className="guide-role-desc">You are reviewing the full inspection history of an in-service 737-MAX-9, assessing damage zones, and verifying sign-off status before the aircraft returns to service.</div>
              </div>
              <div className="guide-steps">
                <div className="guide-step"><span className="guide-step-num">1</span><span>Watch the <strong>deep scan progress bar</strong> complete and populate the damage map with zone markers.</span></div>
                <div className="guide-step"><span className="guide-step-num">2</span><span>Click <strong>highlighted zones</strong> on the aircraft diagram to open their inspection record.</span></div>
                <div className="guide-step"><span className="guide-step-num">3</span><span>Click the <strong>DAMAGE ASSESSMENT</strong> button in the scan bar to open the full damage drawer.</span></div>
                <div className="guide-step"><span className="guide-step-num">4</span><span>Review the <strong>right-hand panel</strong> for the selected zone's full record including prior inspections and sign-offs.</span></div>
                <div className="guide-step"><span className="guide-step-num">5</span><span>Use the <strong>status bar</strong> to track active alerts and airframe health score.</span></div>
              </div>
              <div className="guide-tip">
                <strong>TIP:</strong> Red zones are critical findings blocking flight release. Orange zones are watch items requiring re-inspection at next cycle. Any zone can be clicked to see the full chain of custody.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="scan-bar">
        <span className="scan-label">DEEP SCAN PROGRESS</span>
        <div className="scan-track"><div className="scan-fill" id="scan-fill"></div></div>
        <span className="scan-pct" id="scan-pct">0%</span>
        <span className="scan-status" id="scan-status">SCANNING</span>
        <button className="dmg-toggle" id="dmgToggle" aria-expanded={false} aria-controls="damageDrawer">
          <div className="dmg-toggle-dot"></div>
          DAMAGE ASSESSMENT
        </button>
      </div>

      <div className="workspace">

        <div className="diagram-area" id="diagram">

          <svg className="diagram-svg" viewBox="0 0 900 460" preserveAspectRatio="xMidYMid meet" id="aircraftSvg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            <g id="zoneOverlays">
              <path  id="zo-nose"    className="zone-overlay" data-zone="z-nose"
                     d="M 75 230 Q 100 192 200 186 L 200 274 Q 100 268 75 230 Z"/>
              <rect  id="zo-cockpit" className="zone-overlay" data-zone="z-cockpit"
                     x="200" y="186" width="80" height="88"/>
              <rect  id="zo-fwd"     className="zone-overlay" data-zone="z-fwd"
                     x="280" y="186" width="155" height="88"/>
              <rect  id="zo-mid"     className="zone-overlay" data-zone="z-mid"
                     x="435" y="186" width="140" height="88"/>
              <rect  id="zo-aft"     className="zone-overlay" data-zone="z-aft"
                     x="575" y="186" width="145" height="88"/>
              <rect  id="zo-tail"    className="zone-overlay" data-zone="z-tail"
                     x="720" y="142" width="155" height="176"/>
              <path  id="zo-wing"    className="zone-overlay" data-zone="z-wing"
                     d="M 400 186 L 318 32 L 272 35 L 348 186 Z M 400 274 L 318 428 L 272 425 L 348 274 Z"/>
            </g>

            <g filter="url(#glow)" stroke="#00e5ff" strokeWidth="1" fill="none" opacity="0.85">
              <path d="M 75 230 Q 100 192 200 186 L 760 186 Q 818 186 840 206 Q 855 216 855 230 Q 855 244 840 254 Q 818 274 760 274 L 200 274 Q 100 268 75 230 Z" strokeWidth="1.5"/>
              <rect x="136" y="217" width="22" height="15" rx="3" strokeWidth="1" opacity="0.75"/>
              <rect x="162" y="217" width="22" height="15" rx="3" strokeWidth="1" opacity="0.75"/>
              {[245,272,299,326,353,380,407,434,461,488,515,542,569,596,623,650].map(x => (
                <rect key={x} x={x} y="182" width="10" height="7" rx="2" opacity="0.55"/>
              ))}
              <rect x="220" y="181" width="14" height="7" rx="2" strokeWidth="1" opacity="0.6"/>
              <rect x="690" y="181" width="14" height="7" rx="2" strokeWidth="1" opacity="0.6"/>
              <path d="M 395 186 L 322 30 L 278 33 L 348 186 Z" strokeWidth="1.4"/>
              <ellipse cx="308" cy="42" rx="48" ry="13" strokeWidth="1.2"/>
              <line x1="260" y1="42" x2="356" y2="42" strokeWidth="0.5" opacity="0.4"/>
              <circle cx="286" cy="42" r="6" strokeWidth="1" opacity="0.6"/>
              <path d="M 395 274 L 322 430 L 278 427 L 348 274 Z" strokeWidth="1.4"/>
              <ellipse cx="308" cy="418" rx="48" ry="13" strokeWidth="1.2"/>
              <line x1="260" y1="418" x2="356" y2="418" strokeWidth="0.5" opacity="0.4"/>
              <circle cx="286" cy="418" r="6" strokeWidth="1" opacity="0.6"/>
              <path d="M 790 186 L 868 148 L 862 144 L 782 183 Z" strokeWidth="1.2"/>
              <path d="M 790 274 L 868 312 L 862 316 L 782 277 Z" strokeWidth="1.2"/>
              <rect x="828" y="224" width="32" height="12" rx="2" strokeWidth="1" opacity="0.55"/>
              <line x1="280" y1="186" x2="280" y2="274" strokeWidth="0.4" opacity="0.28"/>
              <line x1="380" y1="186" x2="380" y2="274" strokeWidth="0.4" opacity="0.28"/>
              <line x1="480" y1="186" x2="480" y2="274" strokeWidth="0.4" opacity="0.28"/>
              <line x1="580" y1="186" x2="580" y2="274" strokeWidth="0.4" opacity="0.28"/>
              <line x1="680" y1="186" x2="680" y2="274" strokeWidth="0.4" opacity="0.28"/>
              <line x1="760" y1="186" x2="760" y2="274" strokeWidth="0.4" opacity="0.28"/>
              <line x1="75" y1="230" x2="860" y2="230" strokeWidth="0.3" opacity="0.2" strokeDasharray="8,5"/>
              <text x="450" y="452" fill="#00e5ff" fontSize="8" textAnchor="middle" opacity="0.28" fontFamily="monospace">BOEING 737-MAX-9 · N-4892WL · TOP-DOWN ZONE HEALTH MAP — CLICK ANY ZONE FOR DETAIL</text>
              <text x="450" y="463" fill="#00e5ff" fontSize="7" textAnchor="middle" opacity="0.18" fontFamily="monospace">COGNITIVE QA DIGITAL TWIN OVERLAY v2.4.1</text>
            </g>

            <g id="markers">
              <g id="d3" className="svg-marker crit" data-defect="d3">
                <circle className="svg-marker-ring" cx="240" cy="230" r="9" fill="none" strokeWidth="1.5"/>
                <circle className="svg-marker-dot"  cx="240" cy="230" r="5"/>
              </g>
              <g id="d1" className="svg-marker crit" data-defect="d1">
                <circle className="svg-marker-ring" cx="360" cy="230" r="9" fill="none" strokeWidth="1.5"/>
                <circle className="svg-marker-dot"  cx="360" cy="230" r="5"/>
              </g>
              <g id="d4" className="svg-marker warn" data-defect="d4">
                <circle className="svg-marker-ring" cx="310" cy="192" r="9" fill="none" strokeWidth="1.5"/>
                <circle className="svg-marker-dot"  cx="310" cy="192" r="5"/>
              </g>
              <g id="d2" className="svg-marker warn" data-defect="d2">
                <circle className="svg-marker-ring" cx="645" cy="230" r="9" fill="none" strokeWidth="1.5"/>
                <circle className="svg-marker-dot"  cx="645" cy="230" r="5"/>
              </g>
            </g>
          </svg>

          <div className="defect-popup" id="popup" style={{ display:'none' }}></div>
          <div className="zone-hud" id="zoneHud"></div>

        </div>

        <div className="right-panel">

          <div className="panel-section">
            <span className="panel-label">AIRCRAFT HEALTH OVERVIEW</span>
            <div className="health-meta-row">
              <div className="health-meta-item">
                <div className="health-meta-key">OPEN FINDINGS</div>
                <div className="health-meta-val crit">4</div>
              </div>
              <div className="health-meta-item">
                <div className="health-meta-key">ZONES CLEAR</div>
                <div className="health-meta-val ok">4 / 7</div>
              </div>
              <div className="health-meta-item">
                <div className="health-meta-key">LAST A-CHECK</div>
                <div className="health-meta-val">2024-11-18</div>
              </div>
              <div className="health-meta-item">
                <div className="health-meta-key">FLIGHT HRS</div>
                <div className="health-meta-val">12,842</div>
              </div>
            </div>
            <div className="health-grid" id="healthGrid"></div>
          </div>

          <div className="timeline-label">INSPECTION HISTORY</div>
          <div className="timeline-wrap">
            <div className="timeline" id="timeline"></div>
          </div>

        </div>
      </div>

      <div className="status-bar">
        <span><div className="status-bar-dot"></div><span className="status-active">DIGITAL TWIN OVERLAY: ACTIVE</span></span>
        <span className="status-warn">&#9650; 2 CRITICAL ZONES — IMMEDIATE ATTENTION REQUIRED</span>
        <span style={{ marginLeft:'auto', color:'var(--muted)' }}>N-4892WL &nbsp;·&nbsp; A-CHECK DUE: 2025-05-18</span>
      </div>

      <div className="damage-drawer" id="damageDrawer" aria-hidden={true}>
        <div className="drawer-header">
          <span className="drawer-header-title">DAMAGE ASSESSMENT</span>
          <div className="drawer-gng-wrap">
            <span className="gng-pill no-go" id="drawerGngPill">NO-GO</span>
            <span className="drawer-gng-label">AIRWORTHINESS STATUS</span>
          </div>
          <button className="drawer-close" id="drawerClose">&#9660; COLLAPSE</button>
        </div>
        <div className="drawer-body">
          <div className="drawer-summary" id="drawerSummary"></div>
          <div className="drawer-content" id="drawerContent"></div>
        </div>
      </div>

    </div>
  );
}
