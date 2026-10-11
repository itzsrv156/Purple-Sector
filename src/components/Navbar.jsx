import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TLink } from './Transition';
import { Scramble } from './ui';
import { lockScroll } from '../lib/motion';

const MAIN = [
  { to: '/standings', label: 'Standings' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/teams', label: 'Teams' },
  { to: '/circuits', label: 'Circuits' },
];
export const ALL_PAGES = [
  { to: '/', label: 'Home', d: 'Where it all starts' },
  { to: '/standings', label: 'Standings', d: 'Drivers & constructors' },
  { to: '/calendar', label: 'Calendar', d: 'Every race, every winner' },
  { to: '/drivers', label: 'Drivers', d: 'The full grid' },
  { to: '/teams', label: 'Teams', d: 'Eleven garages' },
  { to: '/circuits', label: 'Circuits', d: 'Real track maps' },
  { to: '/champions', label: 'Legends', d: 'Every world champion' },
  { to: '/compare', label: 'Head to head', d: 'Settle the debate' },
  { to: '/quiz', label: 'Quiz', d: 'Test your F1 IQ' },
  { to: '/guide', label: 'F1 101', d: 'Flags, tyres, points' },
];

export function LogoMark({ size = 38 }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="psPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e89aff" />
            <stop offset="100%" stopColor="#b24bff" />
          </linearGradient>
          <linearGradient id="psMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b24bff" />
            <stop offset="100%" stopColor="#ff3d9a" />
          </linearGradient>
        </defs>

        {/* 3 Telemetry Sector Blocks (F1 Timing Screen) */}
        <path d="M6 5.5h4.5l-1.5 3h-4.5z" fill="rgba(255,255,255,0.4)" />
        <path d="M12.5 5.5h4.5l-1.5 3h-4.5z" fill="#36ff8f" />
        <path d="M19 5.5h4.5l-1.5 3h-4.5z" fill="url(#psPurple)" />

        {/* The Racing Apex / P-S Speedline Flow */}
        <path d="M7 26V11" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <path
          d="M7 11.5C7 11.5 13 8.5 18 11.5C22.5 14 21.5 18.5 15.5 19.2"
          stroke="url(#psPurple)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 19.2C17.5 19.8 24 20.8 23 25.5"
          stroke="url(#psMagenta)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Apex Clipping Dot */}
        <circle cx="20.5" cy="13.8" r="1.6" fill="#36ff8f" />
      </svg>
    </span>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hide, setHide] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setSolid(y > 24);
        setHide(y > 400 && y > last.current + 6 && !open ? true : y < last.current - 6 ? false : hide);
        last.current = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [open, hide]);

  useEffect(() => { lockScroll(open); return () => lockScroll(false); }, [open]);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  const isOn = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <>
      <header className={`nav ${solid || open ? 'solid' : ''} ${hide ? 'hide' : ''}`}>
        <div className="container">
          <TLink to="/" className="logo" aria-label="Purple Sector home">
            <LogoMark />
            <span>Purple<span className="sec"> Sector</span></span>
          </TLink>
          <nav className="nav-links" aria-label="Main">
            {MAIN.map((l) => (
              <TLink key={l.to} to={l.to} className={isOn(l.to) ? 'on' : ''}><Scramble text={l.label} hover duration={380} /></TLink>
            ))}
          </nav>
          <button className={`menu-btn ${open ? 'open' : ''}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Toggle menu">
            <span>{open ? 'Close' : 'Menu'}</span>
            <span className="burger"><i /></span>
          </button>
        </div>
      </header>

      <div className={`menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="menu-inner">
          <nav className="menu-list" aria-label="All pages">
            {ALL_PAGES.map((p, i) => (
              <TLink key={p.to} to={p.to} className={isOn(p.to) ? 'on' : ''} style={{ '--i': i }} tabIndex={open ? 0 : -1}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <span className="t">{p.label}</span>
                <span className="d">{p.d}</span>
              </TLink>
            ))}
          </nav>
          <div className="menu-foot">
            <span>Purple Sector — made by Sarvesh</span>
            <span>Unofficial fan project</span>
          </div>
        </div>
      </div>
    </>
  );
}
