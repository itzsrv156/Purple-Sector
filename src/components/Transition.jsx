import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Ctx = createContext({ go: () => {} });
export const useTransition = () => useContext(Ctx);

const LABELS = {
  '/': 'Home', '/standings': 'Standings', '/calendar': 'Calendar', '/drivers': 'Drivers', '/teams': 'Teams',
  '/circuits': 'Circuits', '/champions': 'Legends', '/compare': 'Head to head', '/quiz': 'Quiz', '/guide': 'F1 101',
};
const labelFor = (path) => LABELS['/' + path.split('/')[1]] || 'Purple Sector';
const COVER_MS = 560;
const REVEAL_MS = 620;

/**
 * Page curtain: two panels wipe up, route changes behind them, panels exit upward.
 * Only `transform` is animated, so it stays smooth on phones.
 */
export function TransitionProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState('idle');
  const [label, setLabel] = useState('');
  const busy = useRef(false);

  const go = useCallback((to) => {
    if (busy.current) return;
    if (to === location.pathname + location.search) return;
    busy.current = true;
    setLabel(labelFor(to));
    setPhase('cover');
    setTimeout(() => {
      navigate(to);
      window.scrollTo(0, 0);
      window.__lenis && window.__lenis.scrollTo(0, { immediate: true, force: true });
      requestAnimationFrame(() => {
        setPhase('reveal');
        setTimeout(() => { setPhase('idle'); busy.current = false; }, REVEAL_MS);
      });
    }, COVER_MS);
  }, [navigate, location]);

  // browser back/forward: reset scroll
  useEffect(() => { if (phase === 'idle') window.scrollTo(0, 0); }, [location.pathname]); // eslint-disable-line

  return (
    <Ctx.Provider value={{ go }}>
      {children}
      <div className={`curtain ${phase !== 'idle' ? 'active ' + phase : ''}`} aria-hidden="true">
        <i className="c1" /><i className="c2" /><b>{label}</b>
      </div>
    </Ctx.Provider>
  );
}

/** Drop-in <a> that plays the curtain. */
export function TLink({ to, children, onClick, className, ...rest }) {
  const { go } = useTransition();
  return (
    <a href={to} className={className} {...rest}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick && onClick(e);
        go(to);
      }}>
      {children}
    </a>
  );
}
