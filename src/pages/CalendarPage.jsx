import React, { useState } from 'react';
import { TLink } from '../components/Transition';
import { Reveal, SplitText, Flag, TrackMap } from '../components/ui';
import Modal from '../components/Modal';
import { SEASONS, YEARS, CURRENT, CIRCUITS, fmtDate, raceDate, isRaceWeekend, nextRace, teamColor, teamName } from '../lib/data';
import { Calendar as CalIcon, Flag as FlagIcon, Zap, Trophy, Timer, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function CalendarPage() {
  const [year, setYear] = useState(CURRENT);
  const [filter, setFilter] = useState('all'); // 'all' | 'upcoming' | 'completed' | 'sprint'
  const [selectedRace, setSelectedRace] = useState(null);

  const season = SEASONS[year] || SEASONS[CURRENT];
  const rounds = season.rounds || [];
  const nxt = year === CURRENT ? nextRace() : null;

  const filteredRounds = rounds.filter((r) => {
    if (filter === 'upcoming') return !r.completed;
    if (filter === 'completed') return r.completed;
    if (filter === 'sprint') return r.sprint;
    return true;
  });

  const completedCount = rounds.filter((r) => r.completed).length;
  const totalCount = rounds.length;

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36 }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            FORMULA ONE WORLD CHAMPIONSHIP
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text={`${year} RACE`} by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="CALENDAR" by="char" base={140} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 720 }}>
            All {totalCount} Grand Prix weekends mapped with real GPS circuit layouts, sprint weekend alerts, pole positions, and race classifications.
          </p>
        </Reveal>
      </div>

      {/* Season & Category Filters */}
      <Reveal d={1} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
        {/* Status filters */}
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6, background: 'rgba(255, 255, 255, 0.04)', padding: 4, borderRadius: 12, border: '1px solid var(--line)' }}>
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'upcoming', label: `Upcoming (${totalCount - completedCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'sprint', label: 'Sprint Weekends' },
          ].map((f) => (
            <button
              key={f.id}
              className={`btn ${filter === f.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '7px 16px', borderRadius: 8, fontSize: '0.82rem' }}
              onClick={() => setFilter(f.id)}
            >
              {f.id === 'sprint' && <Zap size={14} style={{ color: 'var(--yellow)' }} />}
              <span>{f.label}</span>
            </button>
          ))}
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
              onClick={() => {
                setYear(y);
                setFilter('all');
              }}
            >
              {y} {y === CURRENT && <span style={{ fontSize: '0.65rem', marginLeft: 4, color: 'var(--green)' }}>LIVE</span>}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Calendar Progress Indicator */}
      <Reveal d={2} className="panel" style={{ padding: '16px 24px', marginBottom: 36, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <CheckCircle2 size={20} style={{ color: 'var(--green)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 600 }}>
            Season Progress: <b style={{ color: 'var(--purple-hot)' }}>{completedCount}</b> of <b>{totalCount}</b> Rounds Completed
          </span>
        </div>
        <div style={{ width: 220, height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${(completedCount / totalCount) * 100}%`, height: '100%', background: 'linear-gradient(90deg, var(--purple), var(--green))' }} />
        </div>
      </Reveal>

      {/* Grid of Races */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
        {filteredRounds.map((r, i) => {
          const circuit = CIRCUITS.find((c) => c.id === r.circuitId) || {};
          const isNext = nxt && nxt.round === r.round;
          const winner = r.classification?.[0];
          const pole = r.pole;

          return (
            <Reveal key={r.round} d={(i % 6) + 1}>
              <div
                className={`rcard ${isNext ? 'current' : ''}`}
                onClick={() => setSelectedRace({ ...r, circuit })}
                role="button"
                tabIndex={0}
              >
                <div className="rcard-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="rcard-round">ROUND {String(r.round).padStart(2, '0')}</span>
                    {r.sprint && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 900, background: 'rgba(255, 225, 77, 0.15)', color: 'var(--yellow)', border: '1px solid rgba(255, 225, 77, 0.3)', padding: '2px 8px', borderRadius: 999 }}>
                        ⚡ SPRINT
                      </span>
                    )}
                  </div>
                  <span className="rcard-date">{fmtDate(r, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>

                {/* Grand Prix & Country */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Flag iso={circuit.iso} title={circuit.country} lg />
                  <div>
                    <h3 className="rcard-title" style={{ fontSize: '1.45rem', margin: 0 }}>
                      {r.name.replace(' Grand Prix', ' GP')}
                    </h3>
                    <div className="rcard-circuit" style={{ fontSize: '0.8rem', marginTop: 2 }}>
                      {circuit.locality || circuit.name}, {circuit.country}
                    </div>
                  </div>
                </div>

                {/* Circuit Miniature Map */}
                <div style={{ height: 110, background: 'rgba(0, 0, 0, 0.3)', borderRadius: 10, padding: 8, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                  <TrackMap id={r.circuitId} draw={false} color={isNext ? 'var(--green)' : 'var(--purple-hot)'} />
                </div>

                {/* Bottom Status / Winner */}
                {r.completed && winner ? (
                  <div className="rcard-winner">
                    <Trophy size={16} style={{ color: 'var(--yellow)' }} />
                    <div style={{ flex: 1, minWidth: 0, fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 800 }}>{winner.name}</span>
                      <span style={{ color: teamColor(winner.teamId), marginLeft: 6, fontSize: '0.78rem' }}>
                        ({winner.team})
                      </span>
                    </div>
                    <span className="rcard-winner-badge">WINNER</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 8, border: '1px solid var(--line)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: isNext ? 'var(--green)' : 'var(--muted)' }}>
                      {isNext ? '● UP NEXT' : 'SCHEDULED'}
                    </span>
                    <span style={{ color: 'var(--purple-hot)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Details <ChevronRight size={14} />
                    </span>
                  </div>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Race Details Modal */}
      {selectedRace && (
        <Modal onClose={() => setSelectedRace(null)} label={`Round ${selectedRace.round} Details`}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span className="rcard-round" style={{ fontSize: '0.85rem' }}>ROUND {selectedRace.round}</span>
              {selectedRace.sprint && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 900, background: 'rgba(255, 225, 77, 0.15)', color: 'var(--yellow)', padding: '2px 8px', borderRadius: 999 }}>
                  ⚡ SPRINT WEEKEND
                </span>
              )}
            </div>

            <h2 className="h-display" style={{ fontSize: '2.4rem', textTransform: 'uppercase', marginBottom: 8 }}>
              {selectedRace.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 24 }}>
              <Flag iso={selectedRace.circuit?.iso} title={selectedRace.circuit?.country} />
              <span>{selectedRace.circuit?.name || selectedRace.name} · {selectedRace.circuit?.locality}, {selectedRace.circuit?.country}</span>
            </div>

            {/* Circuit specs */}
            <div className="panel" style={{ padding: 20, marginBottom: 24 }}>
              <div style={{ height: 160, display: 'grid', placeItems: 'center', marginBottom: 16 }}>
                <TrackMap id={selectedRace.circuitId} dot color="var(--purple-hot)" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>LENGTH</div>
                  <b>{selectedRace.circuit?.km ? `${selectedRace.circuit.km} km` : '—'}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>TURNS</div>
                  <b>{selectedRace.circuit?.turns || '—'}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>LAPS</div>
                  <b>{selectedRace.circuit?.laps || '—'}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>FIRST GP</div>
                  <b>{selectedRace.circuit?.firstGP || '—'}</b>
                </div>
              </div>
            </div>

            {/* Results if completed */}
            {selectedRace.completed && selectedRace.classification?.length > 0 ? (
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: 14 }}>
                  Race Classification
                </h3>
                <div style={{ display: 'grid', gap: 6, maxHeight: 300, overflowY: 'auto', paddingRight: 4 }}>
                  {selectedRace.classification.map((row) => (
                    <div
                      key={row.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr auto auto',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 14px',
                        background: row.pos <= 3 ? 'rgba(178, 75, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 8,
                        border: '1px solid var(--line)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span style={{ fontWeight: 800, color: row.pos <= 3 ? 'var(--purple-hot)' : 'inherit' }}>
                        P{row.pos}
                      </span>
                      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                        {row.name}{' '}
                        <span style={{ color: teamColor(row.teamId), fontSize: '0.8rem', fontWeight: 500 }}>
                          ({row.team})
                        </span>
                      </div>
                      <span style={{ color: 'var(--dim)', fontSize: '0.78rem' }}>
                        Grid: P{row.grid}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--green)' }}>
                        +{row.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: 24, textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 12, border: '1px solid var(--line)' }}>
                <Timer size={28} style={{ color: 'var(--purple-hot)', margin: '0 auto 12px' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Grand Prix Weekend Coming Soon
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: 4 }}>
                  Official sessions commence on {fmtDate(selectedRace, { day: 'numeric', month: 'long', year: 'numeric' })}.
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
