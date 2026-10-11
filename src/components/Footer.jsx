import React from 'react';
import { TLink } from './Transition';
import { LogoMark } from './Navbar';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wordmark" aria-hidden="true">Purple <em>Sector</em></div>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <LogoMark size={30} />
              <h4 style={{ margin: 0 }}>Purple Sector</h4>
            </div>
            <p className="muted" style={{ maxWidth: '38ch' }}>
              A fan-first Formula 1 hub — every race winner, every driver, every circuit, without the telemetry overload.
            </p>
          </div>
          <div>
            <h4>Season</h4>
            <ul>
              <li><TLink to="/standings">Standings</TLink></li>
              <li><TLink to="/calendar">Calendar</TLink></li>
              <li><TLink to="/drivers">Drivers</TLink></li>
              <li><TLink to="/teams">Teams</TLink></li>
            </ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <li><TLink to="/circuits">Circuits</TLink></li>
              <li><TLink to="/champions">Legends</TLink></li>
              <li><TLink to="/compare">Head to head</TLink></li>
              <li><TLink to="/guide">F1 101</TLink></li>
            </ul>
          </div>
          <div>
            <h4>Play</h4>
            <ul>
              <li><TLink to="/quiz">F1 Quiz</TLink></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="made">Designed &amp; built with <Heart size={14} style={{ verticalAlign: '-2px', color: 'var(--magenta)' }} fill="currentColor" /> by <b>Sarvesh</b></div>
          <div className="legal">
            Purple Sector is an unofficial fan project and is not affiliated with Formula 1, the FIA, or any team. F1, Formula 1 and related marks are trademarks of Formula One Licensing BV.
            Race data from the Jolpica F1 API · track layouts from bacinger/f1-circuits (MIT).
          </div>
          <div>© {new Date().getFullYear()} Purple Sector</div>
        </div>
      </div>
    </footer>
  );
}
