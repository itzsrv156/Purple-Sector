import React, { useEffect, useRef, useState } from 'react';
import { observeOnce, prefersReduced, useCountUp } from '../lib/motion';
import { flagSrc } from '../lib/flags';
import { TRACKS } from '../lib/data';

/** Scroll-reveal wrapper (transform/opacity only — mobile friendly). */
export function Reveal({ as: Tag = 'div', variant = '', d = 0, className = '', children, style, ...rest }) {
  const ref = useRef(null);
  useEffect(() => observeOnce(ref.current, () => ref.current && ref.current.classList.add('in')), []);
  return (
    <Tag ref={ref} className={`rv ${variant ? 'rv-' + variant : ''} ${className}`} style={{ '--d': d, ...style }} {...rest}>
      {children}
    </Tag>
  );
}

/** Mask-reveal headline: each word/char slides up from behind a clip. */
export function SplitText({ text, as: Tag = 'span', by = 'char', className = '', base = 0, step }) {
  const ref = useRef(null);
  useEffect(() => observeOnce(ref.current, () => ref.current && ref.current.classList.add('in')), []);
  const words = String(text).split(' ');
  let i = 0;
  return (
    <Tag ref={ref} className={`st ${className}`} aria-label={text} style={{ '--base': `${base}ms` }}>
      {words.map((w, wi) => (
        <React.Fragment key={wi}>
          <span className="st-w" aria-hidden="true">
            {by === 'word' ? (
              <span className="st-c" style={{ '--i': (i++) * (step ? step / 26 : 2.4) }}>{w}</span>
            ) : (
              [...w].map((ch, ci) => (
                <span className="st-c" key={ci} style={{ '--i': i++ * (step ? step / 26 : 1) }}>{ch}</span>
              ))
            )}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}

const GLYPHS = '█▓▒░<>/\\|+*#%&ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
/** Decode / scramble text effect (runs once on view, and on hover if `hover`). */
export function Scramble({ text, as: Tag = 'span', className = '', hover = false, duration = 900 }) {
  const ref = useRef(null);
  const raf = useRef(0);
  const run = () => {
    const el = ref.current; if (!el || prefersReduced()) return;
    const t0 = performance.now();
    cancelAnimationFrame(raf.current);
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      const fixed = Math.floor(p * text.length);
      el.textContent = text.split('').map((c, i) => (c === ' ' || i < fixed ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
      if (p < 1) raf.current = requestAnimationFrame(tick); else el.textContent = text;
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => {
    const stop = observeOnce(ref.current, run);
    return () => { stop(); cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line
  }, [text]);
  return <Tag ref={ref} className={className} onMouseEnter={hover ? run : undefined}>{text}</Tag>;
}

/** Cycling typewriter. */
export function Typewriter({ phrases, className = '' }) {
  const [txt, setTxt] = useState(prefersReduced() ? phrases[0] : '');
  useEffect(() => {
    if (prefersReduced()) return;
    let pi = 0, ci = 0, del = false, timer;
    const step = () => {
      const full = phrases[pi];
      ci += del ? -1 : 1;
      setTxt(full.slice(0, ci));
      let wait = del ? 28 : 70;
      if (!del && ci === full.length) { del = true; wait = 1700; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 350; }
      timer = setTimeout(step, wait);
    };
    timer = setTimeout(step, 900);
    return () => clearTimeout(timer);
  }, [phrases]);
  return <span className={`caret ${className}`}>{txt}</span>;
}

export function Counter({ value, decimals = 0, suffix = '', className = '' }) {
  const [ref, v] = useCountUp(value, { decimals });
  return <span ref={ref} className={className}>{v.toLocaleString(undefined, { minimumFractionDigits: decimals })}{suffix}</span>;
}

export function Flag({ iso, lg = false, title }) {
  if (!iso || iso === 'un') return null;
  return (
    <img
      className={`flag ${lg ? 'lg' : ''}`}
      src={flagSrc(iso, lg ? 80 : 40)}
      srcSet={`${flagSrc(iso, lg ? 80 : 40)} 1x, ${flagSrc(iso, lg ? 160 : 80)} 2x`}
      width={lg ? 34 : 22}
      height={lg ? 23 : 15}
      alt={title || iso.toUpperCase()}
      title={title}
      loading="lazy"
      decoding="async"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  );
}

/** Real circuit layout. `draw` animates the outline in once visible; `dot` loops a car around it. */
export function TrackMap({ id, draw = true, dot = false, color = 'var(--purple)', className = '' }) {
  const t = TRACKS[id];
  const ref = useRef(null);
  useEffect(() => {
    if (!draw || !ref.current) return;
    return observeOnce(ref.current, () => ref.current && ref.current.classList.add('in'));
  }, [draw]);
  if (!t) return <div className={`trackmap trackmap-empty ${className}`}>Layout coming soon</div>;
  return (
    <svg ref={ref} className={`trackmap ${draw ? '' : 'in'} ${className}`} viewBox="0 0 400 300" fill="none" role="img" aria-label="Track layout">
      <path d={t.d} className="tm-base" />
      <path d={t.d} className="tm-line" pathLength="1" style={{ stroke: color }} />
      <circle cx={t.start[0]} cy={t.start[1]} r="6" className="tm-start" />
      {dot && (
        <circle r="6" className="tm-car">
          <animateMotion dur="9s" repeatCount="indefinite" path={t.d} rotate="auto" />
        </circle>
      )}
    </svg>
  );
}

export function Marquee({ children, speed = 55 }) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <div style={{ display: 'flex' }}>{children}</div>
        <div style={{ display: 'flex' }}>{children}</div>
      </div>
    </div>
  );
}
