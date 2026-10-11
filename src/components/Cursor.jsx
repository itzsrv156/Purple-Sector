import React, { useEffect, useRef } from 'react';
import { isDesktopPointer } from '../lib/motion';

/** Dot + ring cursor. Desktop pointers only — nothing is mounted on touch devices. */
export default function Cursor() {
  const root = useRef(null);
  const dot = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    if (!isDesktopPointer()) return;
    let x = 0, y = 0, rx = 0, ry = 0, raf;
    const move = (e) => { x = e.clientX; y = e.clientY; };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const over = (e) => {
      const hot = e.target.closest && e.target.closest('a, button, [data-hot], input, select');
      root.current && root.current.classList.toggle('hot', !!hot);
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); };
  }, []);

  if (typeof window !== 'undefined' && !isDesktopPointer()) return null;
  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <div className="ring" ref={ring} />
      <div className="dot" ref={dot} />
    </div>
  );
}
