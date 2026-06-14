'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle';
  opacity: number;
}

const COLORS = ['#FFC800', '#58CC02', '#1CB0F6', '#FF4B4B', '#CE82FF', '#FF9600', '#ffffff'];

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Spawn particles from top
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      shape: Math.random() > 0.4 ? 'rect' : 'circle',
      opacity: 1,
    }));

    let raf: number;
    let done = false;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allGone = true;
      for (const p of particles) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.08; // gravity
        p.vx *= 0.99; // drag
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height) {
          p.opacity -= 0.05;
        }
        if (p.opacity > 0) allGone = false;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (!allGone && !done) {
        raf = requestAnimationFrame(draw);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      done = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
