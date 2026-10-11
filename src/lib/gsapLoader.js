import { isDesktopPointer, prefersReduced } from './motion';

let cached;
/**
 * GSAP + ScrollTrigger are only downloaded on desktop pointers.
 * Phones never pay for them — they get CSS-only scroll reveals and native swipe rows.
 */
export function loadGsap() {
  if (!isDesktopPointer() || prefersReduced()) return Promise.resolve(null);
  cached ||= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, s]) => {
    const { gsap } = g;
    const { ScrollTrigger } = s;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = window.__lenis;
    if (lenis && !lenis.__st) { lenis.on('scroll', ScrollTrigger.update); lenis.__st = true; }
    return { gsap, ScrollTrigger };
  });
  return cached;
}
