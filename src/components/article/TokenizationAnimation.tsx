// @ts-nocheck -- imported code written for looser TypeScript settings
import { useEffect, useRef } from 'react';

export function TokenizationAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const TOTAL = 6000;
    const PH = [1000, 700, 1000, 700, 1200, 400];
    const PH_START = PH.reduce((acc: number[], v, i) => {
      acc.push(i === 0 ? 0 : acc[i - 1] + PH[i - 1]);
      return acc;
    }, []);

    let W = 0, H = 200, cx = 0, cy = 0;
    let startTime: number | null = null;
    let rafId: number | null = null;
    let prevPhase = -1;

    interface Particle { x: number; y: number; tx: number; ty: number; size: number; delay: number; }
    let particles: Particle[] = [];

    function resize() {
      const rect = canvas.parentElement!.getBoundingClientRect();
      W = Math.min(rect.width, 800);
      H = 200;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      cx = W / 2;
      cy = H / 2;
    }

    function easeInOut(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function drawAsset(x: number, y: number, size: number, alpha: number) {
      const s = size;
      const top: [number, number][] = [[x, y - s * 0.55], [x + s * 0.48, y - s * 0.28], [x, y], [x - s * 0.48, y - s * 0.28]];
      const right: [number, number][] = [[x + s * 0.48, y - s * 0.28], [x + s * 0.48, y + s * 0.42], [x, y + s * 0.7], [x, y]];
      const left: [number, number][] = [[x - s * 0.48, y - s * 0.28], [x, y], [x, y + s * 0.7], [x - s * 0.48, y + s * 0.42]];

      ctx.save();
      ctx.globalAlpha = alpha;

      const faces = [
        { pts: top,   fill: 'rgba(242,223,210,0.08)', stroke: 'rgba(242,223,210,0.5)' },
        { pts: right, fill: 'rgba(242,223,210,0.04)', stroke: 'rgba(242,223,210,0.3)' },
        { pts: left,  fill: 'rgba(242,223,210,0.02)', stroke: 'rgba(242,223,210,0.2)' },
      ];
      faces.forEach(({ pts, fill, stroke }) => {
        ctx.beginPath();
        pts.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py));
        ctx.closePath();
        ctx.fillStyle = fill; ctx.fill();
        ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke();
      });

      ctx.fillStyle = 'rgba(242,223,210,0.4)';
      const dots: [number, number][] = [
        [x + s * 0.22, y + s * 0.02], [x + s * 0.22, y + s * 0.14], [x + s * 0.22, y + s * 0.26],
        [x + s * 0.1,  y + s * 0.08], [x + s * 0.1,  y + s * 0.2],
        [x - s * 0.1,  y + s * 0.02], [x - s * 0.1,  y + s * 0.14],
        [x - s * 0.22, y + s * 0.08],
      ];
      dots.forEach(([dx, dy]) => { ctx.beginPath(); ctx.arc(dx, dy, 1.5, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
    }

    function drawLedger(x: number, y: number, size: number, alpha: number) {
      const s = size;
      ctx.save();
      ctx.globalAlpha = alpha;
      const pw = s * 0.22, ph = s * 0.75;
      const lx = x - s * 0.28, rx = x + s * 0.28;
      const top_y = y - ph / 2;

      ctx.fillStyle = 'rgba(242,223,210,0.04)';
      ctx.strokeStyle = 'rgba(242,223,210,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.rect(lx - pw / 2, top_y, pw, ph); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.rect(rx - pw / 2, top_y, pw, ph); ctx.fill(); ctx.stroke();

      ctx.beginPath(); ctx.strokeStyle = 'rgba(242,223,210,0.5)';
      ctx.arc(x, top_y, s * 0.28, Math.PI, 0); ctx.stroke();

      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = 'rgba(242,223,210,0.2)';
      ctx.beginPath(); ctx.arc(x, top_y, s * 0.18, Math.PI, 0); ctx.stroke();
      ctx.setLineDash([]);

      const chain = [top_y + ph * 0.2, top_y + ph * 0.38, top_y + ph * 0.56];
      chain.forEach(dy => {
        ctx.beginPath(); ctx.arc(lx, dy, 2.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(242,223,210,0.45)'; ctx.lineWidth = 0.8; ctx.stroke();
        ctx.beginPath(); ctx.arc(rx, dy, 2.5, 0, Math.PI * 2); ctx.stroke();
      });

      const lineTop = top_y + ph * 0.05, lineBot = top_y + ph * 0.88;
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = 'rgba(242,223,210,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, lineTop); ctx.lineTo(x, lineBot); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(242,223,210,0.35)';
      ctx.beginPath(); ctx.moveTo(x, lineBot + 8); ctx.lineTo(x - 4, lineBot); ctx.lineTo(x + 4, lineBot); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function drawToken(x: number, y: number, size: number, alpha: number, shimmerT: number) {
      const s = size * 0.38;
      const cols = 4, rows = 4;
      ctx.save();
      ctx.globalAlpha = alpha;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = x + (c - cols / 2 + 0.5) * s * 0.96 + (r % 2) * s * 0.48;
          const oy = y - s * 0.6 + r * s * 0.45;
          const isAccent = (r === 1 && c === 1) || (r === 2 && c === 2);
          const shimmer = Math.sin(shimmerT * 2 + r * 0.8 + c * 0.6) * 0.5 + 0.5;
          const baseA = isAccent ? 0.25 : 0.08;
          const strokeA = isAccent ? 0.55 + shimmer * 0.25 : 0.25 + shimmer * 0.1;

          ctx.beginPath();
          ctx.moveTo(ox, oy - s * 0.28); ctx.lineTo(ox + s * 0.48, oy);
          ctx.lineTo(ox, oy + s * 0.28); ctx.lineTo(ox - s * 0.48, oy);
          ctx.closePath();
          ctx.fillStyle = `rgba(242,223,210,${baseA})`; ctx.fill();
          ctx.strokeStyle = `rgba(242,223,210,${strokeA})`; ctx.lineWidth = 0.6; ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(ox + s * 0.48, oy); ctx.lineTo(ox + s * 0.48, oy + s * 0.22);
          ctx.lineTo(ox, oy + s * 0.5); ctx.lineTo(ox, oy + s * 0.28);
          ctx.closePath();
          ctx.fillStyle = `rgba(242,223,210,${baseA * 0.5})`; ctx.fill();
          ctx.strokeStyle = `rgba(242,223,210,${strokeA * 0.6})`; ctx.stroke();
        }
      }
      ctx.restore();
    }

    function spawnParticles(fromX: number, fromY: number, toX: number, toY: number, count: number) {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: fromX + (Math.random() - 0.5) * 60,
          y: fromY + (Math.random() - 0.5) * 80,
          tx: toX + (Math.random() - 0.5) * 80,
          ty: toY + (Math.random() - 0.5) * 80,
          size: 1 + Math.random() * 2.5,
          delay: Math.random() * 0.4,
        });
      }
    }

    function drawParticles(progress: number) {
      particles.forEach(p => {
        const t = Math.max(0, Math.min(1, (progress - p.delay) / (1 - p.delay)));
        const et = easeInOut(t);
        const px = lerp(p.x, p.tx, et), py = lerp(p.y, p.ty, et);
        const a = t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 1;
        ctx.save();
        ctx.globalAlpha = a * 0.7;
        ctx.fillStyle = 'rgba(242,223,210,0.8)';
        ctx.beginPath(); ctx.arc(px, py, p.size * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    function drawArrow(x1: number, y: number, x2: number, _y2: number | number, alpha?: number) {
      const realAlpha = typeof _y2 === 'number' && typeof alpha === 'undefined' ? _y2 : alpha ?? 1;
      ctx.save();
      ctx.globalAlpha = realAlpha;
      ctx.strokeStyle = 'rgba(242,223,210,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2 - 8, y); ctx.stroke();
      ctx.fillStyle = 'rgba(242,223,210,0.5)';
      ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(x2 - 10, y - 5); ctx.lineTo(x2 - 10, y + 5); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    function drawLabel(text: string, step: string, x: number, y: number, alpha: number) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = 'center';
      ctx.font = '11px "Manrope", sans-serif';
      ctx.fillStyle = 'rgba(180,180,180,0.7)';
      ctx.fillText(step.toUpperCase(), x, y + 12);
      ctx.font = 'italic 18px "Newsreader", serif';
      ctx.fillStyle = 'rgba(242,223,210,0.9)';
      ctx.fillText(text, x, y + 32);
      ctx.restore();
    }

    function draw(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) % TOTAL;
      ctx.clearRect(0, 0, W, H);

      let phase = 0;
      for (let i = PH_START.length - 1; i >= 0; i--) {
        if (elapsed >= PH_START[i]) { phase = i; break; }
      }
      const phaseT = (elapsed - PH_START[phase]) / PH[phase];

      if (phase !== prevPhase) {
        if (phase === 1) spawnParticles(cx - W * 0.22, cy - 20, cx, cy - 20, 28);
        if (phase === 3) spawnParticles(cx, cy - 20, cx + W * 0.22, cy - 20, 32);
        prevPhase = phase;
      }

      const lx = cx - W * 0.26;
      const rx = cx + W * 0.26;
      const shapeSize = Math.min(W * 0.12, 55);

      if (phase === 0) {
        drawAsset(lx, cy - 10, shapeSize, 1);
        drawLabel('The Asset', 'Step 01', lx, cy + shapeSize * 0.7, 1);
        drawArrow(lx + shapeSize * 0.7, cy - 10, cx - shapeSize * 0.7, cy - 10, 0.15);
        drawLedger(cx, cy - 10, shapeSize, 0.12);
        drawLabel('The Ledger', 'Step 02', cx, cy + shapeSize * 0.7, 0.12);
        drawArrow(cx + shapeSize * 0.7, cy - 10, rx - shapeSize * 0.7, cy - 10, 0.08);
        drawToken(rx, cy - 10, shapeSize, 0.08, 0);
        drawLabel('The Token', 'Step 03', rx, cy + shapeSize * 0.7, 0.08);
      } else if (phase === 1) {
        const fade = easeInOut(phaseT);
        drawAsset(lx, cy - 10, shapeSize, 1 - fade * 0.6);
        drawLabel('The Asset', 'Step 01', lx, cy + shapeSize * 0.7, 1 - fade * 0.5);
        drawArrow(lx + shapeSize * 0.7, cy - 10, cx - shapeSize * 0.7, cy - 10, 0.15 + fade * 0.7);
        drawLedger(cx, cy - 10, shapeSize, fade);
        drawLabel('The Ledger', 'Step 02', cx, cy + shapeSize * 0.7, fade);
        drawParticles(phaseT);
        drawToken(rx, cy - 10, shapeSize, 0.08, 0);
        drawLabel('The Token', 'Step 03', rx, cy + shapeSize * 0.7, 0.08);
      } else if (phase === 2) {
        drawAsset(lx, cy - 10, shapeSize, 0.15);
        drawLabel('The Asset', 'Step 01', lx, cy + shapeSize * 0.7, 0.15);
        drawArrow(lx + shapeSize * 0.7, cy - 10, cx - shapeSize * 0.7, cy - 10, 0.5);
        drawLedger(cx, cy - 10, shapeSize, 1);
        drawLabel('The Ledger', 'Step 02', cx, cy + shapeSize * 0.7, 1);
        drawArrow(cx + shapeSize * 0.7, cy - 10, rx - shapeSize * 0.7, cy - 10, 0.15);
        drawToken(rx, cy - 10, shapeSize, 0.12, 0);
        drawLabel('The Token', 'Step 03', rx, cy + shapeSize * 0.7, 0.12);
      } else if (phase === 3) {
        const fade = easeInOut(phaseT);
        drawAsset(lx, cy - 10, shapeSize, 0.1);
        drawLabel('The Asset', 'Step 01', lx, cy + shapeSize * 0.7, 0.1);
        drawArrow(lx + shapeSize * 0.7, cy - 10, cx - shapeSize * 0.7, cy - 10, 0.4);
        drawLedger(cx, cy - 10, shapeSize, 1 - fade * 0.6);
        drawLabel('The Ledger', 'Step 02', cx, cy + shapeSize * 0.7, 1 - fade * 0.5);
        drawArrow(cx + shapeSize * 0.7, cy - 10, rx - shapeSize * 0.7, cy - 10, 0.15 + fade * 0.7);
        drawToken(rx, cy - 10, shapeSize, fade, phaseT * 3);
        drawLabel('The Token', 'Step 03', rx, cy + shapeSize * 0.7, fade);
        drawParticles(phaseT);
      } else if (phase === 4) {
        drawAsset(lx, cy - 10, shapeSize, 0.1);
        drawLabel('The Asset', 'Step 01', lx, cy + shapeSize * 0.7, 0.1);
        drawArrow(lx + shapeSize * 0.7, cy - 10, cx - shapeSize * 0.7, cy - 10, 0.3);
        drawLedger(cx, cy - 10, shapeSize, 0.15);
        drawLabel('The Ledger', 'Step 02', cx, cy + shapeSize * 0.7, 0.15);
        drawArrow(cx + shapeSize * 0.7, cy - 10, rx - shapeSize * 0.7, cy - 10, 0.5);
        drawToken(rx, cy - 10, shapeSize, 1, phaseT * 4);
        drawLabel('The Token', 'Step 03', rx, cy + shapeSize * 0.7, 1);
      } else if (phase === 5) {
        const fade = easeInOut(phaseT);
        drawAsset(lx, cy - 10, shapeSize, fade);
        drawLabel('The Asset', 'Step 01', lx, cy + shapeSize * 0.7, fade);
        drawArrow(lx + shapeSize * 0.7, cy - 10, cx - shapeSize * 0.7, cy - 10, 0.15 * fade);
        drawLedger(cx, cy - 10, shapeSize, 0.12 * fade);
        drawLabel('The Ledger', 'Step 02', cx, cy + shapeSize * 0.7, 0.12 * fade);
        drawArrow(cx + shapeSize * 0.7, cy - 10, rx - shapeSize * 0.7, cy - 10, 0.08 * fade);
        drawToken(rx, cy - 10, shapeSize, (1 - fade) * 0.8, 0);
        drawLabel('The Token', 'Step 03', rx, cy + shapeSize * 0.7, 1 - fade);
      }

      rafId = requestAnimationFrame(draw);
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        resize();
        startTime = null;
        prevPhase = -1;
        if (!rafId) rafId = requestAnimationFrame(draw);
      } else {
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
      }
    }, { threshold: 0.1 });

    resize();
    observer.observe(canvas);

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="mt-20 reveal flex justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: '800px', height: '200px', display: 'block' }}
      />
    </div>
  );
}
