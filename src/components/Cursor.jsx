import React, { useEffect, useRef } from 'react';
import { isDesktopPointer } from '../lib/motion';

/** Dot + ring cursor. Desktop pointers only — nothing is mounted on touch devices. */
export default function Cursor() {
  const root = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!isDesktopPointer()) return;
    let x = -100, y = -100, rx = -100, ry = -100, raf;
    let hasMoved = false;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        rx = x;
        ry = y;
        root.current && root.current.classList.add('active');
      }
    };

    const leave = () => {
      hasMoved = false;
      root.current && root.current.classList.remove('active');
    };

    const loop = () => {
      if (hasMoved) {
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;
        if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
        if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const over = (e) => {
      const hot = e.target.closest && e.target.closest('a, button, [data-hot], input, select, .ccard, .dcard, .liv-pill, .btn-toggle');
      root.current && root.current.classList.toggle('hot', !!hot);
    };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, []);

  if (typeof window !== 'undefined' && !isDesktopPointer()) return null;
  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="ring" ref={ring} />
      <div className="dot" ref={dot} />
    </div>
  );
}
