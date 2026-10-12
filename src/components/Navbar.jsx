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
  { to: '/', label: 'Home', d: 'Where the action starts' },
  { to: '/standings', label: 'Standings', d: 'Drivers & constructors titles' },
  { to: '/calendar', label: 'Calendar', d: '24 rounds, every winner' },
  { to: '/drivers', label: 'Drivers', d: '2026 grid line-up' },
  { to: '/teams', label: 'Teams', d: 'Eleven constructors' },
  { to: '/circuits', label: 'Circuits', d: 'Real GPS track layouts' },
  { to: '/champions', label: 'Legends', d: 'All-time world champions' },
  { to: '/compare', label: 'Head to Head', d: 'Wheel-to-wheel telemetry' },
  { to: '/quiz', label: 'F1 Quiz', d: 'Test your racing IQ' },
  { to: '/guide', label: 'F1 101', d: 'Rules, aero, tyres & flags' },
];

/**
 * High-end motorsport Apex Sector emblem.
 * Features 3 telemetry timing bars (S1 silver, S2 green, S3 hot purple),
 * speed aero spine, and interlocking P-S racing trajectory.
 */
export function LogoMark({ size = 38 }) {
  return (
    <span className="logo-mark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="psPurpleHot" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f3b8ff" />
            <stop offset="50%" stopColor="#b24bff" />
            <stop offset="100%" stopColor="#7a2cf0" />
          </linearGradient>
          <linearGradient id="psMagentaSpeed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b24bff" />
            <stop offset="100%" stopColor="#ff3d9a" />
          </linearGradient>
          <filter id="glowF1" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#b24bff" floodOpacity="0.7" />
          </filter>
        </defs>

        {/* 3 Telemetry Sector Chevrons (F1 Timing Screen) */}
        <g transform="translate(3, 4)">
          {/* Sector 1: White/Silver */}
          <path d="M14 0h4.5l-2 3.8h-4.5z" fill="rgba(255,255,255,0.5)" />
          {/* Sector 2: Timing Green */}
          <path d="M19.5 0h4.5l-2 3.8h-4.5z" fill="#36ff8f" />
          {/* Sector 3: Purple Sector Hot */}
          <path d="M25 0h5l-2 3.8h-5z" fill="#d58bff" filter="url(#glowF1)" />
        </g>

        {/* The Aerodynamic "P" Leading-Edge Spine */}
        <path
          d="M9.5 33.5V12C9.5 10.2 11 8.8 12.8 8.8H21C25 8.8 28 11.8 28 15.6C28 19.4 25 22.4 21 22.4H12.5"
          stroke="url(#psPurpleHot)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* The "S" Apex Sweeper & Diffuser Flick */}
        <path
          d="M16.5 22.4C21.5 22.4 28.5 23.6 28.5 27.6C28.5 31.8 24.5 33.8 19.8 33.8C14.5 33.8 11.2 31.5 10.8 29.5"
          stroke="url(#psMagentaSpeed)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Apex Clipping Target (Green Timing Marker) */}
        <circle cx="21" cy="15.6" r="2" fill="#36ff8f" />

        {/* High-Speed Aero Intake Vent Slot */}
        <path d="M15 15.2H18.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
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
        setSolid(y > 20);
        setHide(y > 380 && y > last.current + 8 && !open ? true : y < last.current - 8 ? false : hide);
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
      <header className={`nav ${solid ? 'solid' : ''} ${hide ? 'hide' : ''}`}>
        <div className="nav-cockpit">
          {/* Logo & Telemetry Status */}
          <TLink to="/" className="logo" aria-label="Purple Sector home">
            <LogoMark size={38} />
            <div className="logo-text-group">
              <span className="logo-main">
                PURPLE<span className="sec">SECTOR</span>
              </span>
              <span className="logo-badge">
                <span className="live-dot" />
                <span>APEX // 2026</span>
              </span>
            </div>
          </TLink>

          {/* Desktop Racing Navigation Links */}
          <nav className="nav-links" aria-label="Main navigation">
            {MAIN.map((l) => (
              <TLink key={l.to} to={l.to} className={`nav-item ${isOn(l.to) ? 'on' : ''}`}>
                <span className="nav-dot" />
                <Scramble text={l.label} hover duration={340} />
              </TLink>
            ))}
          </nav>

          {/* High-Tech Telemetry Paddock Switch */}
          <button
            className={`menu-btn ${open ? 'open' : ''}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle paddock navigation"
          >
            <div className="mbtn-telemetry" aria-hidden="true">
              <span className="tbar tb-1" />
              <span className="tbar tb-2" />
              <span className="tbar tb-3" />
            </div>
            <div className="mbtn-meta">
              <span className="mbtn-tag">{open ? 'EXIT' : 'PADDOCK'}</span>
              <span className="mbtn-label">{open ? 'CLOSE' : 'MENU'}</span>
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile & Desktop Curtain Drawer */}
      <div className={`menu ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="menu-inner">
          <div className="menu-top-meta">
            <span className="menu-kicker">✦ THE COMPLETE PADDOCK SITEMAP</span>
            <span className="menu-badge">10 DIRECT DESTINATIONS</span>
          </div>

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
            <span className="foot-brand">Purple Sector — Built with ❤️ by Sarvesh</span>
            <span className="foot-tag">Unofficial Formula 1 Fan Hub</span>
          </div>
        </div>
      </div>
    </>
  );
}
