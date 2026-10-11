import { useEffect, useRef, useState } from 'react';

// One shared IntersectionObserver for every reveal on the page (cheaper than one per element).
let io;
const callbacks = new WeakMap();
export function observeOnce(el, cb) {
  if (!el) return () => {};
  if (typeof IntersectionObserver === 'undefined') { cb(); return () => {}; }
  if (!io) {
    io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const fn = callbacks.get(e.target);
          io.unobserve(e.target);
          callbacks.delete(e.target);
          fn && fn();
        }
      }
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.06 });
  }
  callbacks.set(el, cb);
  io.observe(el);
  return () => { io.unobserve(el); callbacks.delete(el); };
}

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isDesktopPointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches;

export function useMedia(query) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setM(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return m;
}

// Count up when scrolled into view.
export function useCountUp(target, { duration = 1400, decimals = 0 } = {}) {
  const ref = useRef(null);
  const [val, setVal] = useState(prefersReduced() ? target : 0);
  useEffect(() => {
    if (prefersReduced()) { setVal(target); return; }
    let raf;
    const stop = observeOnce(ref.current, () => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        setVal(+(target * eased).toFixed(decimals));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    return () => { stop(); cancelAnimationFrame(raf); };
  }, [target, duration, decimals]);
  return [ref, val];
}

// Lock/unlock page scroll (also pauses Lenis when active).
export function lockScroll(lock) {
  const lenis = window.__lenis;
  if (lock) { lenis && lenis.stop(); document.documentElement.style.overflow = 'hidden'; }
  else { lenis && lenis.start(); document.documentElement.style.overflow = ''; }
}
