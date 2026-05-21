"use client";

import { useEffect, useRef } from "react";

const POINT_LIFE = 320;
const DRAIN_LIFE = 60;

const DOT_SIZES = [4, 3.6, 3.2, 2.8, 2.4, 2.0, 1.6, 1.2, 0.8, 0.5];
const DOT_GAP = 2;

const DOT_COLORS = [
  "#51463E", // --secondary (tip, darkest)
  "#6B5D53",
  "#857570",
  "#CBC3BB", // --border-color
  "#B8AFA8",
  "#D4CAC2",
  "#E2D3C3", // --primary
  "#EBE0D4",
  "#F2EDE7",
  "#F9F5F0", // --cream-bg (tail, lightest)
];

export function ElasticEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0;
    let mouse: { x: number; y: number } | null = null;
    let tip: { x: number; y: number } | null = null;
    let vtx = 0, vty = 0;
    let trail: { x: number; y: number; born: number }[] = [];
    let raf: number | null = null;
    let active = false;
    let draining = false;

    const resize = () => {
      const p = canvas.parentElement!;
      W = canvas.width = p.offsetWidth;
      H = canvas.height = p.offsetHeight;
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    function addPoint(x: number, y: number) {
      trail.push({ x, y, born: performance.now() });
    }

    function pruneTrail() {
      const life = draining ? DRAIN_LIFE : POINT_LIFE;
      const now = performance.now();
      while (trail.length > 0 && now - trail[0].born > life) {
        trail.shift();
      }
    }

    function sampleTrailAtDistance(dist: number): { x: number; y: number } | null {
      if (trail.length < 1) return null;
      if (dist <= 0) return { x: trail[trail.length - 1].x, y: trail[trail.length - 1].y };

      let accumulated = 0;
      for (let i = trail.length - 1; i > 0; i--) {
        const a = trail[i];
        const b = trail[i - 1];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const seg = Math.sqrt(dx * dx + dy * dy);
        if (accumulated + seg >= dist) {
          const t = (dist - accumulated) / seg;
          return { x: a.x - dx * t, y: a.y - dy * t };
        }
        accumulated += seg;
      }
      return { x: trail[0].x, y: trail[0].y };
    }

    function drawDots() {
      if (trail.length < 1) return;

      for (let i = 0; i < DOT_SIZES.length; i++) {
        let distFromTip = 0;
        for (let j = 0; j < i; j++) {
          distFromTip += DOT_SIZES[j] + DOT_GAP + DOT_SIZES[j + 1];
        }

        const pos = sampleTrailAtDistance(distFromTip);
        if (!pos) continue;

        const r = DOT_SIZES[i];
        const color = DOT_COLORS[i];

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      pruneTrail();

      if (active && mouse && tip) {
        vtx += (mouse.x - tip.x) * 0.07;
        vty += (mouse.y - tip.y) * 0.07;
        vtx *= 0.72;
        vty *= 0.72;
        tip.x += vtx;
        tip.y += vty;
        addPoint(tip.x, tip.y);
      }

      drawDots();

      if (trail.length > 0 || (active && !!mouse)) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    const parent = canvas.parentElement!;

    const onEnter = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      tip = { x: mouse.x, y: mouse.y };
      trail = []; vtx = 0; vty = 0;
      active = true; draining = false;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      active = false; mouse = null; tip = null;
      draining = true;
      const now = performance.now();
      trail.forEach(p => { p.born = now - (POINT_LIFE - DRAIN_LIFE * 0.5); });
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (!raf) raf = requestAnimationFrame(loop);
    };

    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);
    parent.addEventListener("mousemove", onMove);

    return () => {
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
      parent.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 20,
      }}
    />
  );
}