import React, { useState } from 'react';
import { TLink } from '../components/Transition';
import { Reveal, SplitText, Flag, Counter } from '../components/ui';
import Modal from '../components/Modal';
import { TEAMS, DRIVERS, teamLogo, teamCar } from '../lib/data';
import { DriverCutout } from '../components/DriverCard';
import { Trophy, Wrench, MapPin, Gauge, Shield, ChevronRight } from 'lucide-react';

export default function TeamsPage() {
  const [activeTeam, setActiveTeam] = useState(null);

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36 }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            2026 CONSTRUCTORS CHAMPIONSHIP
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text="FORMULA ONE" by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="TEAMS" by="char" base={120} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 720 }}>
            The 11 constructor powerhouses designing, building and racing multi-million dollar engineering marvels in the 2026 World Championship.
          </p>
        </Reveal>
      </div>

      {/* Grid of Team Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
        {TEAMS.map((t, i) => {
          const carImg = teamCar(t.id);
          const logoImg = teamLogo(t.id);

          return (
            <Reveal key={t.id} d={(i % 4) + 1}>
              <div
                className="tcard"
                style={{ '--tc': t.color }}
                onClick={() => setActiveTeam(t)}
                role="button"
                tabIndex={0}
              >
                {/* Header: Logo and Standing Rank */}
                <div className="tcard-header">
                  <div>
                    {logoImg ? (
                      <img src={logoImg} alt={t.name} className="tcard-logo" loading="lazy" />
                    ) : (
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, color: t.color }}>
                        {t.name}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                      <Flag iso={t.iso} title={t.nationality} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                        {t.base || t.nationality}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="tcard-rank">P{t.pos}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: 'var(--purple-hot)' }}>
                      {t.points} pts
                    </div>
                  </div>
                </div>

                {/* Car Render */}
                {carImg ? (
                  <img src={carImg} alt={`${t.name} 2026 car`} className="tcard-car" loading="lazy" />
                ) : (
                  <div style={{ height: 110, display: 'grid', placeItems: 'center', color: 'var(--dim)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', background: 'rgba(0,0,0,0.2)', borderRadius: 10 }}>
                    2026 Challenger
                  </div>
                )}

                {/* Specs Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  <div className="ccard-spec">
                    <div style={{ color: 'var(--dim)' }}>WINS</div>
                    <b style={{ color: t.wins > 0 ? 'var(--green)' : 'inherit' }}>{t.wins}</b>
                  </div>
                  <div className="ccard-spec">
                    <div style={{ color: 'var(--dim)' }}>TITLES</div>
                    <b style={{ color: t.career?.titles > 0 ? 'var(--yellow)' : 'inherit' }}>{t.career?.titles || 0}</b>
                  </div>
                  <div className="ccard-spec">
                    <div style={{ color: 'var(--dim)' }}>ENGINE</div>
                    <b style={{ fontSize: '0.82rem' }}>{t.pu ? t.pu.split(' ')[0] : 'Hybrid'}</b>
                  </div>
                </div>

                {/* Driver Pairings */}
                <div className="tcard-drivers">
                  {t.drivers?.map((d) => (
                    <TLink
                      key={d.id}
                      to={`/drivers/${d.id}`}
                      className="tcard-driver"
                      onClick={(e) => e.stopPropagation()}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${t.color}22`, border: `1px solid ${t.color}66`, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                        {d.img ? (
                          <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                        ) : (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 800 }}>{d.code}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', lineHeight: 1.1 }}>{d.name}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--dim)' }}>
                          #{d.number} · {d.points} pts
                        </div>
                      </div>
                    </TLink>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Team Detail Modal */}
      {activeTeam && (
        <Modal onClose={() => setActiveTeam(null)} label={`${activeTeam.name} Details`}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {teamLogo(activeTeam.id) && (
                  <img src={teamLogo(activeTeam.id)} alt={activeTeam.name} style={{ height: 48, objectFit: 'contain' }} loading="lazy" />
                )}
                <div>
                  <h2 className="h-display" style={{ fontSize: '2.4rem', margin: 0, textTransform: 'uppercase', color: activeTeam.color }}>
                    {activeTeam.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, color: 'var(--muted)', fontSize: '0.85rem' }}>
                    <Flag iso={activeTeam.iso} title={activeTeam.nationality} />
                    <span>{activeTeam.base || activeTeam.nationality}</span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, color: activeTeam.color }}>
                  P{activeTeam.pos}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--purple-hot)', fontWeight: 800 }}>
                  {activeTeam.points} CHAMPIONSHIP POINTS
                </div>
              </div>
            </div>

            {/* Car profile view */}
            {teamCar(activeTeam.id) && (
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: '24px 16px', display: 'grid', placeItems: 'center', marginBottom: 24, border: '1px solid var(--line)' }}>
                <img src={teamCar(activeTeam.id)} alt={`${activeTeam.name} car`} style={{ maxWidth: '90%', maxHeight: 180, objectFit: 'contain', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.8))' }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--dim)', marginTop: 12 }}>
                  2026 Technical Specification · Power Unit: {activeTeam.pu || 'Hybrid V6 Turbo'}
                </div>
              </div>
            )}

            {/* All-time Achievements */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 10 }}>
                Constructor Legacy
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, textAlign: 'center' }}>
                <div className="panel" style={{ padding: 16 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>WORLD TITLES</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--yellow)' }}>
                    {activeTeam.career?.titles || 0}
                  </div>
                </div>
                <div className="panel" style={{ padding: 16 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>RACE WINS</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--green)' }}>
                    {activeTeam.career?.wins || 0}
                  </div>
                </div>
                <div className="panel" style={{ padding: 16 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>POLE POSITIONS</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, color: 'var(--purple-hot)' }}>
                    {activeTeam.career?.poles || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Driver Lineup */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 12 }}>
                2026 Driver Lineup
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                {activeTeam.drivers?.map((d) => (
                  <TLink
                    key={d.id}
                    to={`/drivers/${d.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: 12,
                      border: '1px solid var(--line)',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${activeTeam.color}33`, border: `1px solid ${activeTeam.color}`, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                      {d.img ? (
                        <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800 }}>{d.code}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{d.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
                        #{d.number} · {d.points} pts (P{d.pos})
                      </div>
                    </div>
                  </TLink>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
