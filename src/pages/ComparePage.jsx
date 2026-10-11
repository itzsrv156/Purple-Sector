import React, { useState } from 'react';
import { Reveal, SplitText, Flag } from '../components/ui';
import DriverCard, { DriverCutout } from '../components/DriverCard';
import { DRIVERS, TEAMS, teamLogo, ageOf } from '../lib/data';
import { ArrowLeftRight, Trophy, Zap, Shield, Sparkles } from 'lucide-react';

const PRESETS = [
  { label: 'Title Fight', a: 'norris', b: 'max_verstappen' },
  { label: 'Ferrari Duel', a: 'hamilton', b: 'leclerc' },
  { label: 'McLaren Duo', a: 'norris', b: 'piastri' },
  { label: 'Mercedes Lineup', a: 'russell', b: 'antonelli' },
  { label: 'Veterans', a: 'hamilton', b: 'alonso' },
];

export default function ComparePage() {
  const [driverAId, setDriverAId] = useState('norris');
  const [driverBId, setDriverBId] = useState('max_verstappen');

  const driverA = DRIVERS.find((d) => d.id === driverAId) || DRIVERS[0];
  const driverB = DRIVERS.find((d) => d.id === driverBId) || DRIVERS[1];

  const compareStats = [
    { label: 'World Championships', a: driverA.career?.titles || 0, b: driverB.career?.titles || 0, highlight: 'gold' },
    { label: 'Grand Prix Wins', a: driverA.career?.wins || 0, b: driverB.career?.wins || 0 },
    { label: 'Career Podiums', a: driverA.career?.podiums || 0, b: driverB.career?.podiums || 0 },
    { label: 'Pole Positions', a: driverA.career?.poles || 0, b: driverB.career?.poles || 0 },
    { label: 'Race Starts', a: driverA.career?.starts || 0, b: driverB.career?.starts || 0 },
    { label: 'Fastest Laps', a: driverA.career?.fastestLaps || 0, b: driverB.career?.fastestLaps || 0 },
    { label: '2026 Points', a: driverA.points || 0, b: driverB.points || 0 },
    { label: '2026 Season Podiums', a: driverA.season?.podiums || 0, b: driverB.season?.podiums || 0 },
    { label: '2026 Season Wins', a: driverA.wins || 0, b: driverB.wins || 0 },
  ];

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36 }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            HEAD-TO-HEAD BATTLE
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text="DRIVER" by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="COMPARISON" by="char" base={120} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 720 }}>
            Put any two drivers side-by-side to compare career achievements, world championships, 2026 form, and race-craft.
          </p>
        </Reveal>
      </div>

      {/* Rivalry Presets */}
      <Reveal d={1} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 36 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--dim)', textTransform: 'uppercase' }}>
          Popular Rivalries:
        </span>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            className="btn btn-ghost"
            style={{ padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.03)' }}
            onClick={() => {
              setDriverAId(p.a);
              setDriverBId(p.b);
            }}
          >
            <Sparkles size={13} style={{ color: 'var(--purple-hot)' }} />
            <span>{p.label}</span>
          </button>
        ))}
      </Reveal>

      {/* Driver Selectors and Side-by-Side Cutouts */}
      <div className="compare-grid" style={{ marginBottom: 48 }}>
        {/* Driver A Card */}
        <Reveal d={1}>
          <div className="panel" style={{ padding: 24, borderColor: driverA.color, background: 'linear-gradient(160deg, rgba(20, 12, 36, 0.7) 0%, rgba(13, 8, 24, 0.95) 100%)' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Driver A
              </label>
              <select
                value={driverAId}
                onChange={(e) => setDriverAId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--line)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id} style={{ background: '#120b1f', color: '#fff' }}>
                    {d.name} ({d.team})
                  </option>
                ))}
              </select>
            </div>

            {/* Cutout container */}
            <div style={{ height: 260, position: 'relative', display: 'grid', placeItems: 'center', overflow: 'hidden', borderRadius: 12, background: `radial-gradient(circle, ${driverA.color}22, transparent)` }}>
              <span style={{ position: 'absolute', top: 10, right: 14, fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 900, color: 'rgba(255,255,255,0.06)' }}>
                {driverA.number}
              </span>
              <DriverCutout d={driverA} style={{ maxHeight: 250, objectFit: 'contain' }} />
            </div>

            {/* Basic Info */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Flag iso={driverA.iso} title={driverA.nationality} />
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                  {driverA.nationality} · Age {ageOf(driverA.dob)}
                </span>
              </div>
              <h2 className="h-display" style={{ fontSize: '2.2rem', margin: '4px 0', textTransform: 'uppercase' }}>
                {driverA.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: driverA.color, fontWeight: 700, fontSize: '0.95rem' }}>
                {teamLogo(driverA.teamId) && <img src={teamLogo(driverA.teamId)} alt="" width="20" height="20" loading="lazy" />}
                <span>{driverA.team}</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Center VS Indicator */}
        <Reveal d={2} style={{ textAlign: 'center' }}>
          <div className="compare-vs">VS</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--dim)', textTransform: 'uppercase', marginTop: 4 }}>
            TALE OF THE TAPE
          </div>
        </Reveal>

        {/* Driver B Card */}
        <Reveal d={1}>
          <div className="panel" style={{ padding: 24, borderColor: driverB.color, background: 'linear-gradient(160deg, rgba(20, 12, 36, 0.7) 0%, rgba(13, 8, 24, 0.95) 100%)' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Driver B
              </label>
              <select
                value={driverBId}
                onChange={(e) => setDriverBId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--line)',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                }}
              >
                {DRIVERS.map((d) => (
                  <option key={d.id} value={d.id} style={{ background: '#120b1f', color: '#fff' }}>
                    {d.name} ({d.team})
                  </option>
                ))}
              </select>
            </div>

            {/* Cutout container */}
            <div style={{ height: 260, position: 'relative', display: 'grid', placeItems: 'center', overflow: 'hidden', borderRadius: 12, background: `radial-gradient(circle, ${driverB.color}22, transparent)` }}>
              <span style={{ position: 'absolute', top: 10, right: 14, fontFamily: 'var(--font-display)', fontSize: '6rem', fontWeight: 900, color: 'rgba(255,255,255,0.06)' }}>
                {driverB.number}
              </span>
              <DriverCutout d={driverB} style={{ maxHeight: 250, objectFit: 'contain' }} />
            </div>

            {/* Basic Info */}
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Flag iso={driverB.iso} title={driverB.nationality} />
                <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                  {driverB.nationality} · Age {ageOf(driverB.dob)}
                </span>
              </div>
              <h2 className="h-display" style={{ fontSize: '2.2rem', margin: '4px 0', textTransform: 'uppercase' }}>
                {driverB.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: driverB.color, fontWeight: 700, fontSize: '0.95rem' }}>
                {teamLogo(driverB.teamId) && <img src={teamLogo(driverB.teamId)} alt="" width="20" height="20" loading="lazy" />}
                <span>{driverB.team}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Head to Head Stats Breakdown */}
      <Reveal d={2} className="panel" style={{ padding: '32px 28px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>
          Head-to-Head Statistics
        </h3>

        <div style={{ display: 'grid', gap: 18 }}>
          {compareStats.map((stat, i) => {
            const total = (stat.a || 0) + (stat.b || 0);
            const pctA = total === 0 ? 50 : Math.round(((stat.a || 0) / total) * 100);
            const pctB = 100 - pctA;
            const aWins = stat.a > stat.b;
            const bWins = stat.b > stat.a;

            return (
              <div key={i}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <div style={{ textAlign: 'left', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: aWins ? driverA.color : 'inherit' }}>
                      {stat.a}
                    </span>
                    {aWins && <span style={{ color: 'var(--green)', fontSize: '0.75rem', marginLeft: 8 }}>▲ LEAD</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--dim)', textTransform: 'uppercase', textAlign: 'center', minWidth: 150 }}>
                    {stat.label}
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                    {bWins && <span style={{ color: 'var(--green)', fontSize: '0.75rem', marginRight: 8 }}>LEAD ▲</span>}
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: bWins ? driverB.color : 'inherit' }}>
                      {stat.b}
                    </span>
                  </div>
                </div>

                {/* Comparative bar */}
                <div style={{ height: 8, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 999, display: 'flex', overflow: 'hidden' }}>
                  <div style={{ width: `${pctA}%`, background: driverA.color, transition: 'width 0.6s var(--ease)' }} />
                  <div style={{ width: `${pctB}%`, background: driverB.color, transition: 'width 0.6s var(--ease)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}
