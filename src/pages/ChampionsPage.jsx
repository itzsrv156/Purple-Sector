import React, { useState } from 'react';
import { Reveal, SplitText, Flag, Counter } from '../components/ui';
import { CHAMPIONS, driverTitleCounts, constructorTitleCounts, teamColor, teamName } from '../lib/data';
import { isoFromNationality } from '../lib/flags';
import { Trophy, Crown, Award, Calendar, Users, Wrench } from 'lucide-react';

const DECADES = [
  { id: 'all', label: 'All Time (1950-2025)' },
  { id: '2020', label: '2020s' },
  { id: '2010', label: '2010s' },
  { id: '2000', label: '2000s' },
  { id: '1990', label: '1990s' },
  { id: '1980', label: '1980s' },
  { id: '1970', label: '1970s' },
  { id: '1960', label: '1960s' },
  { id: '1950', label: '1950s' },
];

export default function ChampionsPage() {
  const [view, setView] = useState('leaderboard'); // 'leaderboard' | 'timeline'
  const [category, setCategory] = useState('drivers'); // 'drivers' | 'constructors'
  const [decade, setDecade] = useState('all');

  const driverLeaders = driverTitleCounts();
  const teamLeaders = constructorTitleCounts();

  const chronologicalDrivers = [...CHAMPIONS.drivers]
    .filter((c) => decade === 'all' || (c.year >= Number(decade) && c.year <= Number(decade) + 9))
    .reverse();

  const chronologicalTeams = [...CHAMPIONS.constructors]
    .filter((c) => decade === 'all' || (c.year >= Number(decade) && c.year <= Number(decade) + 9))
    .reverse();

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36 }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            FORMULA ONE LEGENDS & HALL OF FAME
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text="WORLD" by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="CHAMPIONS" by="char" base={120} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 720 }}>
            Every title, every titan, and every crowning moment in Formula 1 history from Giuseppe Farina’s 1950 triumph to the modern era.
          </p>
        </Reveal>
      </div>

      {/* Controls */}
      <Reveal d={1} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 36 }}>
        {/* Category Toggle: Drivers vs Constructors */}
        <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.04)', padding: 4, borderRadius: 12, border: '1px solid var(--line)' }}>
          <button
            className={`btn ${category === 'drivers' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '8px 20px', borderRadius: 8, fontSize: '0.85rem' }}
            onClick={() => setCategory('drivers')}
          >
            <Trophy size={16} />
            <span>Driver Champions</span>
          </button>
          <button
            className={`btn ${category === 'constructors' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '8px 20px', borderRadius: 8, fontSize: '0.85rem' }}
            onClick={() => setCategory('constructors')}
          >
            <Wrench size={16} />
            <span>Constructor Champions</span>
          </button>
        </div>

        {/* View Mode Toggle: Leaderboard vs Timeline */}
        <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.04)', padding: 4, borderRadius: 12, border: '1px solid var(--line)' }}>
          <button
            className={`btn ${view === 'leaderboard' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '7px 16px', borderRadius: 8, fontSize: '0.82rem' }}
            onClick={() => setView('leaderboard')}
          >
            <Crown size={14} />
            <span>All-Time Rankings</span>
          </button>
          <button
            className={`btn ${view === 'timeline' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '7px 16px', borderRadius: 8, fontSize: '0.82rem' }}
            onClick={() => setView('timeline')}
          >
            <Calendar size={14} />
            <span>Year by Year</span>
          </button>
        </div>
      </Reveal>

      {/* Decade Filter for Timeline */}
      {view === 'timeline' && (
        <Reveal d={2} className="chips" style={{ paddingBottom: 16, marginBottom: 28 }}>
          {DECADES.map((d) => (
            <button
              key={d.id}
              className={`btn ${decade === d.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0 }}
              onClick={() => setDecade(d.id)}
            >
              {d.label}
            </button>
          ))}
        </Reveal>
      )}

      {/* VIEW: All-Time Title Leaderboard */}
      {view === 'leaderboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 20 }}>
          {category === 'drivers'
            ? driverLeaders.map((d, i) => {
                const isLegend = d.years.length >= 4;
                const iso = isoFromNationality(d.nationality);
                return (
                  <Reveal key={d.id} d={(i % 4) + 1}>
                    <div
                      className="panel"
                      style={{
                        padding: 24,
                        border: isLegend ? '1px solid rgba(255, 225, 77, 0.35)' : '1px solid var(--line)',
                        background: isLegend
                          ? 'linear-gradient(145deg, rgba(34, 25, 10, 0.5) 0%, rgba(13, 8, 24, 0.95) 100%)'
                          : 'var(--surface)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {isLegend && (
                        <div style={{ position: 'absolute', top: 12, right: 16, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--yellow)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                          <Crown size={14} /> F1 LEGEND
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <Flag iso={iso} title={d.nationality} />
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>
                          {d.name}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: isLegend ? 'var(--yellow)' : 'var(--purple-hot)' }}>
                          {d.years.length}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                          World {d.years.length === 1 ? 'Title' : 'Titles'}
                        </span>
                      </div>

                      {/* Years Won */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {d.years.map((y) => (
                          <span
                            key={y}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--line)',
                              padding: '2px 8px',
                              borderRadius: 6,
                              color: 'var(--text)',
                            }}
                          >
                            {y}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              })
            : teamLeaders.map((t, i) => {
                const isLegend = t.years.length >= 6;
                const tc = teamColor(t.id);
                return (
                  <Reveal key={t.id} d={(i % 4) + 1}>
                    <div
                      className="panel"
                      style={{
                        padding: 24,
                        border: isLegend ? `1px solid ${tc}55` : '1px solid var(--line)',
                        background: 'var(--surface)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, color: tc }}>
                          {t.name}
                        </h3>
                        {isLegend && (
                          <span style={{ color: 'var(--yellow)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                            ★ DYNASTY
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: 'var(--purple-hot)' }}>
                          {t.years.length}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                          WCC {t.years.length === 1 ? 'Championship' : 'Championships'}
                        </span>
                      </div>

                      {/* Years Won */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {t.years.map((y) => (
                          <span
                            key={y}
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid var(--line)',
                              padding: '2px 8px',
                              borderRadius: 6,
                            }}
                          >
                            {y}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
        </div>
      )}

      {/* VIEW: Year-by-Year Chronological Timeline */}
      {view === 'timeline' && (
        <div style={{ display: 'grid', gap: 12 }}>
          {category === 'drivers'
            ? chronologicalDrivers.map((c) => {
                const iso = isoFromNationality(c.nationality);
                return (
                  <Reveal key={c.year}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr auto auto',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--line)',
                        borderRadius: 12,
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--purple-hot)' }}>
                        {c.year}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Flag iso={iso} title={c.nationality} />
                        <div>
                          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '1.05rem', display: 'block' }}>
                            {c.name}
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)' }}>
                            {c.team} · {c.nationality}
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--green)', fontWeight: 800 }}>{c.wins} wins</span>
                      </div>
                      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 900, color: 'var(--yellow)', minWidth: 70 }}>
                        {c.points} pts
                      </div>
                    </div>
                  </Reveal>
                );
              })
            : chronologicalTeams.map((c) => {
                const tc = teamColor(c.id);
                return (
                  <Reveal key={c.year}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr auto auto',
                        alignItems: 'center',
                        gap: 16,
                        padding: '16px 20px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--line)',
                        borderRadius: 12,
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: 'var(--purple-hot)' }}>
                        {c.year}
                      </span>
                      <div>
                        <span style={{ fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: '1.1rem', color: tc }}>
                          {c.name}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--green)', fontWeight: 800 }}>{c.wins} wins</span>
                      </div>
                      <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 900, color: 'var(--yellow)', minWidth: 70 }}>
                        {c.points} pts
                      </div>
                    </div>
                  </Reveal>
                );
              })}
        </div>
      )}
    </div>
  );
}
