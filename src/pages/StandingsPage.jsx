import React, { useState } from 'react';
import { TLink } from '../components/Transition';
import { Reveal, SplitText, Flag, Counter } from '../components/ui';
import { SEASONS, YEARS, CURRENT, pointsProgress, teamLogo, teamColor } from '../lib/data';
import { Trophy, Wrench, TrendingUp, Sparkles } from 'lucide-react';

export default function StandingsPage() {
  const [year, setYear] = useState(CURRENT);
  const [tab, setTab] = useState('drivers'); // 'drivers' | 'constructors'

  const season = SEASONS[year];
  const driverStandings = season?.driverStandings || [];
  const constructorStandings = season?.constructorStandings || [];
  const leaderDriver = driverStandings[0];
  const leaderConstructor = constructorStandings[0];
  const maxDriverPts = leaderDriver?.points || 1;
  const maxTeamPts = leaderConstructor?.points || 1;

  // Chart data for top 5 drivers
  const chartData = pointsProgress(year, 5);

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36 }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            FIA FORMULA ONE WORLD CHAMPIONSHIP
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text="CHAMPIONSHIP" by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="STANDINGS" by="char" base={140} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 720 }}>
            Official World Drivers’ and Constructors’ championship standings. Real race points, podium tallies, sprint points, and title progression.
          </p>
        </Reveal>
      </div>

      {/* Year & Category Controls */}
      <Reveal d={1} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        {/* Championship toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.04)', padding: 4, borderRadius: 12, border: '1px solid var(--line)' }}>
          <button
            className={`btn ${tab === 'drivers' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '8px 20px', borderRadius: 8, fontSize: '0.85rem' }}
            onClick={() => setTab('drivers')}
          >
            <Trophy size={16} />
            <span>Drivers (WDC)</span>
          </button>
          <button
            className={`btn ${tab === 'constructors' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '8px 20px', borderRadius: 8, fontSize: '0.85rem' }}
            onClick={() => setTab('constructors')}
          >
            <Wrench size={16} />
            <span>Constructors (WCC)</span>
          </button>
        </div>

        {/* Season selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--dim)', textTransform: 'uppercase' }}>Season:</span>
          {YEARS.map((y) => (
            <button
              key={y}
              className="btn"
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: y === year ? 800 : 500,
                background: y === year ? 'var(--purple)' : 'rgba(255, 255, 255, 0.03)',
                color: y === year ? '#fff' : 'var(--muted)',
                borderColor: y === year ? 'var(--purple-hot)' : 'var(--line)',
              }}
              onClick={() => setYear(y)}
            >
              {y} {y === CURRENT && <span style={{ fontSize: '0.65rem', marginLeft: 4, color: 'var(--green)' }}>LIVE</span>}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Leader Spotlight Panel */}
      <Reveal d={2} className="panel" style={{ padding: '24px 28px', marginBottom: 36, borderColor: 'rgba(178, 75, 255, 0.3)', background: 'linear-gradient(135deg, rgba(34, 18, 58, 0.7) 0%, rgba(13, 8, 24, 0.95) 100%)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(178, 75, 255, 0.15)', display: 'grid', placeItems: 'center', color: 'var(--purple-hot)', border: '1px solid var(--purple)' }}>
              <Trophy size={24} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--purple-hot)', textTransform: 'uppercase' }}>
                {year === CURRENT ? 'Current Championship Leader' : `${year} World Champion`}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1 }}>
                {tab === 'drivers' ? (
                  <>
                    {leaderDriver?.name}{' '}
                    <span style={{ fontSize: '1.2rem', color: teamColor(leaderDriver?.teamId), fontWeight: 700 }}>
                      ({leaderDriver?.team})
                    </span>
                  </>
                ) : (
                  <>
                    {leaderConstructor?.name}{' '}
                    <span style={{ fontSize: '1.2rem', color: 'var(--muted)', fontWeight: 600 }}>
                      ({leaderConstructor?.nationality})
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 28, fontFamily: 'var(--font-mono)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase' }}>Points</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--purple-hot)' }}>
                {tab === 'drivers' ? leaderDriver?.points : leaderConstructor?.points}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase' }}>Wins</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--green)' }}>
                {tab === 'drivers' ? leaderDriver?.wins : leaderConstructor?.wins}
              </div>
            </div>
            {tab === 'drivers' && driverStandings[1] && (
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--dim)', textTransform: 'uppercase' }}>Lead Margin</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--yellow)' }}>
                  +{leaderDriver?.points - driverStandings[1]?.points} pts
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* Points Progression Chart */}
      {chartData.rounds.length > 0 && tab === 'drivers' && (
        <Reveal d={2} className="panel" style={{ padding: '24px 28px', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <TrendingUp size={18} style={{ color: 'var(--purple-hot)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
              Title Fight Progression (Top 5 Contenders)
            </h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
            {chartData.series.map((s) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: s.color }} />
                <span style={{ fontWeight: 700 }}>{s.name}</span>
                <span style={{ color: 'var(--dim)' }}>({s.pts[s.pts.length - 1]} pts)</span>
              </div>
            ))}
          </div>
          {/* Simple clean visual progress bars */}
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {chartData.series.map((s) => {
              const currentTotal = s.pts[s.pts.length - 1] || 0;
              const pct = Math.min(100, Math.round((currentTotal / maxDriverPts) * 100));
              return (
                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700 }}>{s.code}</span>
                  <div style={{ height: 10, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 999, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: s.color,
                        borderRadius: 999,
                        transition: 'width 0.8s var(--ease)',
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, textAlign: 'right', color: s.color }}>
                    {currentTotal}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
      )}

      {/* Main Standings Table */}
      <Reveal d={3}>
        {tab === 'drivers' ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="stable">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>POS</th>
                  <th>DRIVER</th>
                  <th>NATIONALITY</th>
                  <th>TEAM</th>
                  <th style={{ textAlign: 'center' }}>WINS</th>
                  <th style={{ textAlign: 'right', minWidth: 120 }}>POINTS</th>
                </tr>
              </thead>
              <tbody>
                {driverStandings.map((d) => {
                  const tc = teamColor(d.teamId);
                  const isLeader = d.pos === 1;
                  return (
                    <tr key={d.id} style={{ '--tc': tc }}>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: isLeader ? 'var(--purple)' : d.pos <= 3 ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                            color: isLeader ? '#fff' : 'inherit',
                            fontWeight: isLeader || d.pos <= 3 ? 900 : 700,
                          }}
                        >
                          {d.pos}
                        </span>
                      </td>
                      <td>
                        <TLink to={`/drivers/${d.id}`} className="stable-driver-cell" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: 'rgba(255, 255, 255, 0.06)',
                              color: tc,
                              border: `1px solid ${tc}33`,
                            }}
                          >
                            {d.number || d.code}
                          </span>
                          <div>
                            <span className="stable-driver-name" style={{ display: 'block' }}>
                              {d.name}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--dim)' }}>
                              {d.code}
                            </span>
                          </div>
                        </TLink>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Flag iso={d.iso} title={d.nationality} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{d.nationality}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600, color: tc }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: tc }} />
                          {d.team}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: d.wins > 0 ? 'var(--green)' : 'var(--dim)' }}>
                        {d.wins}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: isLeader ? 'var(--purple-hot)' : 'inherit' }}>
                            <Counter value={d.points} />
                          </span>
                          <div style={{ width: 80, height: 4, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${(d.points / maxDriverPts) * 100}%`, height: '100%', background: tc }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="stable">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>POS</th>
                  <th>CONSTRUCTOR</th>
                  <th>NATIONALITY</th>
                  <th>POWER UNIT</th>
                  <th style={{ textAlign: 'center' }}>WINS</th>
                  <th style={{ textAlign: 'right', minWidth: 120 }}>POINTS</th>
                </tr>
              </thead>
              <tbody>
                {constructorStandings.map((c) => {
                  const tc = teamColor(c.id);
                  const isLeader = c.pos === 1;
                  return (
                    <tr key={c.id} style={{ '--tc': tc }}>
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: isLeader ? 'var(--purple)' : c.pos <= 3 ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                            color: isLeader ? '#fff' : 'inherit',
                            fontWeight: isLeader || c.pos <= 3 ? 900 : 700,
                          }}
                        >
                          {c.pos}
                        </span>
                      </td>
                      <td>
                        <TLink to="/teams" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', color: 'inherit' }}>
                          {teamLogo(c.id) && (
                            <img src={teamLogo(c.id)} alt={c.name} width="32" height="32" style={{ objectFit: 'contain' }} loading="lazy" />
                          )}
                          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: tc }}>
                            {c.name}
                          </span>
                        </TLink>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Flag iso={c.iso} title={c.nationality} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{c.nationality}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--dim)', background: 'rgba(255, 255, 255, 0.03)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--line)' }}>
                          {c.pu || 'Hybrid Turbo'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 800, color: c.wins > 0 ? 'var(--green)' : 'var(--dim)' }}>
                        {c.wins}
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: isLeader ? 'var(--purple-hot)' : 'inherit' }}>
                            <Counter value={c.points} />
                          </span>
                          <div style={{ width: 80, height: 4, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${(c.points / maxTeamPts) * 100}%`, height: '100%', background: tc }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Reveal>
    </div>
  );
}
