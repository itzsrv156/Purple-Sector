import React, { useState } from 'react';
import { Reveal, SplitText } from '../components/ui';
import { Flag as FlagIcon, CircleDot, Trophy, Zap, Clock, ShieldCheck, HelpCircle, Sparkles } from 'lucide-react';

const TABS = [
  { id: 'flags', label: 'Racing Flags', icon: FlagIcon },
  { id: 'tyres', label: 'Tyre Compounds', icon: CircleDot },
  { id: 'points', label: 'Points System', icon: Trophy },
  { id: 'weekend', label: 'Race Weekend', icon: Clock },
  { id: '2026rules', label: '2026 Rules', icon: Zap },
  { id: 'lingo', label: 'F1 Slang', icon: HelpCircle },
];

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState('flags');

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36 }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            CASUAL FAN RACING MANUAL
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text="FORMULA 1" by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="101 GUIDE" by="char" base={120} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 720 }}>
            The essential paddock playbook. Race flags, tyre strategies, sprint formats, the 2026 active aero & engine overhaul, and essential trackside slang.
          </p>
        </Reveal>
      </div>

      {/* Category Navigation Bar */}
      <Reveal d={1} className="chips" style={{ paddingBottom: 16, marginBottom: 36 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`btn ${activeTab === t.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '8px 18px', borderRadius: 8, fontSize: '0.85rem', whiteSpace: 'nowrap', flexShrink: 0 }}
            onClick={() => setActiveTab(t.id)}
          >
            <t.icon size={15} />
            <span>{t.label}</span>
          </button>
        ))}
      </Reveal>

      {/* TAB CONTENT: FLAGS */}
      {activeTab === 'flags' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
          {[
            {
              name: 'Green Flag',
              color: 'var(--green)',
              symbol: '🟩',
              meaning: 'Track is clear. Racing conditions resume at full speed.',
              lore: 'Waved after a Safety Car restart, accident clearance, or to open a pit lane session.',
            },
            {
              name: 'Yellow Flag',
              color: 'var(--yellow)',
              symbol: '🟨',
              meaning: 'Hazard on or beside track. Reduce speed, no overtaking permitted.',
              lore: 'Double waved yellows mean track is blocked or marshals are on circuit; be prepared to stop.',
            },
            {
              name: 'Red Flag',
              color: 'var(--magenta)',
              symbol: '🟥',
              meaning: 'Session suspended immediately. Severe danger or barrier damage.',
              lore: 'All drivers must immediately enter the pit lane. Teams can change tyres and make repairs under red flag.',
            },
            {
              name: 'Blue Flag',
              color: '#3d9aff',
              symbol: '🟦',
              meaning: 'Faster car approaching from behind to lap you. Yield within 3 marshal posts.',
              lore: 'Ignoring 3 consecutive blue flags results in a time penalty from the FIA race stewards.',
            },
            {
              name: 'Black & White Diagonal',
              color: '#fff',
              symbol: '🏁',
              meaning: 'Official warning for unsportsmanlike behaviour or track limits.',
              lore: 'The F1 equivalent of a soccer yellow card. Receiving another one triggers a 5-second penalty.',
            },
            {
              name: 'Chequered Flag',
              color: '#fff',
              symbol: '🏁',
              meaning: 'The session or Grand Prix has officially concluded.',
              lore: 'First car to cross the line wins the race. The flag is traditionally waved by an invited celebrity guest.',
            },
            {
              name: 'Yellow & Red Striped',
              color: '#ff9800',
              symbol: '⚠️',
              meaning: 'Deteriorated track surface — oil, water, or loose gravel ahead.',
              lore: 'Warns drivers that grip levels will abruptly plummet in the upcoming sector.',
            },
            {
              name: 'Black Flag',
              color: '#111',
              symbol: '⬛',
              meaning: 'Disqualification. Driver must return to the pit garage immediately.',
              lore: 'Extremely rare in modern F1; reserved for severe safety violations or dangerous driving.',
            },
          ].map((f, i) => (
            <Reveal key={f.name} d={(i % 4) + 1}>
              <div className="panel" style={{ padding: 24, borderLeft: `4px solid ${f.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.8rem' }}>{f.symbol}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, color: f.color }}>
                    {f.name}
                  </h3>
                </div>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
                  {f.meaning}
                </p>
                <div style={{ fontSize: '0.8rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>
                  {f.lore}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* TAB CONTENT: TYRES */}
      {activeTab === 'tyres' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20, marginBottom: 32 }}>
            {[
              {
                name: 'Soft Tyre (C3-C5)',
                color: 'var(--magenta)',
                badge: 'RED SIDEWALL',
                pros: 'Maximum grip, fastest lap times, lightning acceleration.',
                cons: 'Degrades rapidly; vulnerable to overheating and blistering.',
                stint: 'Ideal for Qualifying runs and short 12-18 lap sprint stints.',
              },
              {
                name: 'Medium Tyre (C2-C4)',
                color: 'var(--yellow)',
                badge: 'YELLOW SIDEWALL',
                pros: 'Balanced compromise between raw speed and durability.',
                cons: 'Slightly slower than Softs, but lasts considerably longer.',
                stint: 'The most popular race-start tyre; typically lasts 22-30 laps.',
              },
              {
                name: 'Hard Tyre (C1-C3)',
                color: '#fff',
                badge: 'WHITE SIDEWALL',
                pros: 'Maximum durability, resistant to high track temperatures.',
                cons: 'Harder to warm up; slower turn-in grip on cold track.',
                stint: 'Crucial for 1-stop strategies; can last 35-45+ laps.',
              },
              {
                name: 'Intermediate Tyre',
                color: 'var(--green)',
                badge: 'GREEN SIDEWALL',
                pros: 'Grooved tread for wet or drying track with no standing puddles.',
                cons: 'Overheats and disintegrates rapidly if the track dries up.',
                stint: 'Displaces 30 litres of water per second at 300 km/h.',
              },
              {
                name: 'Full Wet Tyre',
                color: '#3d9aff',
                badge: 'BLUE SIDEWALL',
                pros: 'Deep tread designed specifically for torrential rainfall.',
                cons: 'High rolling resistance; poor visibility due to spray.',
                stint: 'Displaces up to 85 litres of water per second at speed!',
              },
            ].map((t, i) => (
              <Reveal key={t.name} d={(i % 3) + 1}>
                <div className="panel" style={{ padding: 24, borderTop: `4px solid ${t.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, color: t.color }}>
                      {t.name}
                    </h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 800, background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 999 }}>
                      {t.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'grid', gap: 6, marginBottom: 12 }}>
                    <div><b style={{ color: 'var(--green)' }}>+ Advantage:</b> {t.pros}</div>
                    <div><b style={{ color: 'var(--magenta)' }}>- Drawback:</b> {t.cons}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--dim)', background: 'rgba(255,255,255,0.02)', padding: '8px 10px', borderRadius: 8 }}>
                    {t.stint}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Golden Rule Banner */}
          <Reveal d={2} className="panel" style={{ padding: '20px 24px', borderColor: 'rgba(178, 75, 255, 0.3)', background: 'rgba(178, 75, 255, 0.06)' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--purple-hot)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 4 }}>
              ★ THE GOLDEN TYRE RULE
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text)' }}>
              In every dry race, every driver <b>must use at least two different dry tyre compounds</b> (e.g. Mediums and Hards). This mandates at least one pit stop, making race strategy unpredictable!
            </p>
          </Reveal>
        </div>
      )}

      {/* TAB CONTENT: POINTS SYSTEM */}
      {activeTab === 'points' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24 }}>
          {/* Sunday Race Points */}
          <Reveal d={1} className="panel" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 16 }}>
              Grand Prix Points (Sunday)
            </h3>
            <div style={{ display: 'grid', gap: 8, fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
              {[
                { pos: 'P1 (Winner)', pts: '25 PTS', aura: 'var(--yellow)' },
                { pos: 'P2', pts: '18 PTS', aura: 'var(--purple-hot)' },
                { pos: 'P3', pts: '15 PTS', aura: 'var(--purple-hot)' },
                { pos: 'P4', pts: '12 PTS', aura: '#fff' },
                { pos: 'P5', pts: '10 PTS', aura: '#fff' },
                { pos: 'P6', pts: '8 PTS', aura: '#fff' },
                { pos: 'P7', pts: '6 PTS', aura: '#fff' },
                { pos: 'P8', pts: '4 PTS', aura: '#fff' },
                { pos: 'P9', pts: '2 PTS', aura: '#fff' },
                { pos: 'P10', pts: '1 PT', aura: '#fff' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
                  <span style={{ fontWeight: 600 }}>{row.pos}</span>
                  <span style={{ fontWeight: 900, color: row.aura }}>{row.pts}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, fontSize: '0.8rem', color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
              ⚡ +1 Bonus Point for Fastest Lap (if finishing inside top 10)
            </div>
          </Reveal>

          {/* Saturday Sprint Points */}
          <Reveal d={2} className="panel" style={{ padding: 28 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 16 }}>
              Sprint Race Points (Saturday)
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: 16 }}>
              Sprint races are 100 km mini-races held on select weekends without mandatory pit stops. Points are awarded to the top 8 finishers:
            </p>
            <div style={{ display: 'grid', gap: 8, fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
              {[
                { pos: 'P1 (Sprint Winner)', pts: '8 PTS' },
                { pos: 'P2', pts: '7 PTS' },
                { pos: 'P3', pts: '6 PTS' },
                { pos: 'P4', pts: '5 PTS' },
                { pos: 'P5', pts: '4 PTS' },
                { pos: 'P6', pts: '3 PTS' },
                { pos: 'P7', pts: '2 PTS' },
                { pos: 'P8', pts: '1 PT' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8 }}>
                  <span style={{ fontWeight: 600 }}>{row.pos}</span>
                  <span style={{ fontWeight: 900, color: 'var(--yellow)' }}>{row.pts}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      )}

      {/* TAB CONTENT: RACE WEEKEND */}
      {activeTab === 'weekend' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24 }}>
          <Reveal d={1} className="panel" style={{ padding: 28 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--purple-hot)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 8 }}>
              FORMAT 1
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 16 }}>
              Standard Grand Prix Weekend
            </h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <b style={{ color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>FRIDAY</b>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  <b>Practice 1 (FP1) & Practice 2 (FP2)</b> — Teams dial in aerodynamic balance, tyre wear data, and test upgrades.
                </div>
              </div>
              <div>
                <b style={{ color: 'var(--purple-hot)', fontFamily: 'var(--font-mono)' }}>SATURDAY</b>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  <b>Practice 3 (FP3) & Qualifying (Q1, Q2, Q3)</b> — Knockout qualifying session setting the starting grid for Sunday.
                </div>
              </div>
              <div>
                <b style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>SUNDAY</b>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  <b>The Grand Prix</b> — 305 km race distance (or 2-hour max). 20+ laps, full pit stops, champagne on the podium!
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal d={2} className="panel" style={{ padding: 28 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--yellow)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 8 }}>
              FORMAT 2
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 16 }}>
              Sprint Weekend Format
            </h3>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <b style={{ color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>FRIDAY</b>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  <b>FP1 & Sprint Qualifying (SQ1, SQ2, SQ3)</b> — Only one practice session before immediate competitive shootout!
                </div>
              </div>
              <div>
                <b style={{ color: 'var(--purple-hot)', fontFamily: 'var(--font-mono)' }}>SATURDAY</b>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  <b>The Sprint (100km race)</b> followed by <b>Grand Prix Qualifying</b> in the afternoon.
                </div>
              </div>
              <div>
                <b style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>SUNDAY</b>
                <div style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: 4 }}>
                  <b>The Grand Prix</b> — The main event with maximum championship points on the line.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      )}

      {/* TAB CONTENT: 2026 RULES */}
      {activeTab === '2026rules' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
          {[
            {
              title: '50% Electric Power',
              badge: 'POWER UNIT',
              desc: 'The MGU-H (heat generator) is eliminated. The MGU-K electric motor output skyrockets from 120kW to 350kW (nearly 470 horsepower), delivering near 50-50 parity between combustion engine and electric battery.',
            },
            {
              title: 'Active Aerodynamics',
              badge: 'AERO REVOLUTION',
              desc: 'Goodbye permanent drag! Both front and rear wings feature active moving elements that switch between Cornering Mode (Z-mode with huge downforce) and Low-Drag Mode (X-mode on straights for maximum top speed).',
            },
            {
              title: 'Manual Override Mode',
              badge: 'OVERTAKING',
              desc: 'Traditional DRS is gone. Instead, drivers within 1 second of the car ahead can engage Manual Override Mode to unlock an extra burst of 350kW electrical battery power up to 337 km/h to pass.',
            },
            {
              title: '100% Sustainable Fuel',
              badge: 'SUSTAINABILITY',
              desc: 'Every engine on the 2026 grid runs on fully drop-in advanced sustainable e-fuels manufactured from carbon capture or municipal waste without fossil carbon.',
            },
            {
              title: 'Cadillac Joins as 11th Team',
              badge: 'NEW CONSTRUCTOR',
              desc: 'General Motors enters Formula 1 as Cadillac Formula 1 Team, expanding the grid to 22 cars and 11 teams for the first time since 2016.',
            },
          ].map((item, i) => (
            <Reveal key={item.title} d={(i % 3) + 1}>
              <div className="panel" style={{ padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                    {item.title}
                  </h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 800, color: 'var(--purple-hot)', background: 'rgba(178,75,255,0.1)', padding: '2px 8px', borderRadius: 999 }}>
                    {item.badge}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: 0, lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* TAB CONTENT: F1 LINGO */}
      {activeTab === 'lingo' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
          {[
            { term: 'Purple Sector', def: 'Setting the fastest sector time of any car on the entire grid in that session.' },
            { term: 'The Undercut', def: 'Pitting one lap earlier than your rival to lap on fresh, sticky tyres and jump ahead when they pit later.' },
            { term: 'The Overcut', def: 'Staying out on track longer while your rival gets caught in traffic after their stop, leapfrogging them.' },
            { term: '"Box, Box, Box"', def: 'The radio command from the race engineer ordering the driver to enter the pit lane this lap.' },
            { term: 'Dirty Air', def: 'Turbulent aerodynamic wake coming off a leading car that robs the trailing car of downforce and eats tyres.' },
            { term: 'Apex', def: 'The innermost geometric point of a racing corner that a driver aims to clip for the fastest racing line.' },
            { term: 'Parc Fermé', def: 'Strict quarantine rules where cars cannot be modified between Qualifying and Sunday’s Grand Prix.' },
            { term: 'Slipstream / Tow', def: 'Tucking in directly behind a car on a long straight to cut through air resistance and gain top speed.' },
          ].map((item, i) => (
            <Reveal key={item.term} d={(i % 4) + 1}>
              <div className="panel" style={{ padding: 20 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--purple-hot)', textTransform: 'uppercase', marginBottom: 6 }}>
                  {item.term}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
                  {item.def}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
