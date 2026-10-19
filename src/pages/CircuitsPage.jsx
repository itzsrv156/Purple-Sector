import React, { useState } from 'react';
import { Reveal, SplitText, Flag, TrackMap } from '../components/ui';
import Modal from '../components/Modal';
import Track3DRibbon from '../components/Track3DRibbon';
import { CIRCUITS, teamColor } from '../lib/data';
import { MapPin, Search, Compass, Trophy, Timer, CornerDownRight, CheckCircle2, History, Layers } from 'lucide-react';

export default function CircuitsPage() {
  const [filter, setFilter] = useState('all'); // 'all' | '2026' | 'street' | 'historic'
  const [search, setSearch] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState(null);
  const [trackView, setTrackView] = useState('3d'); // '3d' | '2d'

  const filteredCircuits = CIRCUITS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.locality.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === '2026') return c.on2026;
    if (filter === 'historic') return !c.on2026 || c.historic;
    if (filter === 'street') return c.type === 'Street';
    return true;
  });

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36 }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            ICONIC RACING ARENAS
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text="WORLD" by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="CIRCUITS" by="char" base={120} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 720 }}>
            26 iconic asphalt arenas. GPS-accurate apex layouts, DRS zones, corner counts, all-time race lap records, and qualifying pole benchmarks.
          </p>
        </Reveal>
      </div>

      {/* Search & Type Filters */}
      <Reveal d={1} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 36 }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: 260, flex: '1 1 280px', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--dim)' }} />
          <input
            type="text"
            className="input"
            placeholder="Search circuit, city or country (e.g. Sepang, Bahrain, Monaco)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              borderRadius: 12,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--line)',
              color: 'var(--text)',
              fontSize: '0.9rem',
            }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6, background: 'rgba(255, 255, 255, 0.04)', padding: 4, borderRadius: 12, border: '1px solid var(--line)' }}>
          {[
            { id: 'all', label: `All Circuits (${CIRCUITS.length})` },
            { id: '2026', label: '2026 Calendar' },
            { id: 'street', label: 'Street Tracks' },
            { id: 'historic', label: 'Classics & Historic' },
          ].map((f) => (
            <button
              key={f.id}
              className={`btn ${filter === f.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '7px 16px', borderRadius: 8, fontSize: '0.82rem' }}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Grid of Circuit Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 24 }}>
        {filteredCircuits.map((c, i) => (
          <Reveal key={c.id} d={(i % 4) + 1}>
            <div
              className="ccard"
              onClick={() => setSelectedCircuit(c)}
              role="button"
              tabIndex={0}
            >
              {/* Map Preview with interactive SVG */}
              <div className="ccard-map-wrap">
                <TrackMap id={c.id} color="var(--purple-hot)" />
              </div>

              {/* Title & Location */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Flag iso={c.iso} title={c.country} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                      {c.locality}, {c.country}
                    </span>
                  </div>
                  {c.on2026 ? (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 900, background: 'rgba(54, 255, 143, 0.12)', color: 'var(--green)', border: '1px solid rgba(54, 255, 143, 0.3)', padding: '2px 8px', borderRadius: 999 }}>
                      2026 CALENDAR
                    </span>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 900, background: 'rgba(255, 255, 255, 0.05)', color: 'var(--dim)', padding: '2px 8px', borderRadius: 999 }}>
                      CLASSIC / HISTORIC
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, margin: '2px 0 6px' }}>
                  {c.short || c.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--dim)', margin: 0, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.blurb || `${c.name} in ${c.country}.`}
                </p>
              </div>

              {/* Specs */}
              <div className="ccard-specs">
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>LENGTH</div>
                  <b>{c.km ? `${c.km} km` : '—'}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>TURNS</div>
                  <b>{c.turns || '—'}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>TYPE</div>
                  <b style={{ color: c.type === 'Street' ? 'var(--yellow)' : 'var(--purple-hot)' }}>{c.type || 'Permanent'}</b>
                </div>
              </div>

              {/* Lap Record & Pole Lap Benchmarks */}
              {(c.lapRecord || c.poleLap) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
                  <div style={{ padding: '8px 10px', background: 'rgba(178, 75, 255, 0.08)', borderRadius: 8, border: '1px solid var(--line)' }}>
                    <div style={{ color: 'var(--purple-hot)', fontWeight: 800 }}>⚡ POLE BENCHMARK</div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', marginTop: 2 }}>
                      {c.poleLap?.time || '—'}
                    </div>
                    <div style={{ color: 'var(--dim)', fontSize: '0.68rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.poleLap?.driver}
                    </div>
                  </div>
                  <div style={{ padding: '8px 10px', background: 'rgba(54, 255, 143, 0.06)', borderRadius: 8, border: '1px solid var(--line)' }}>
                    <div style={{ color: 'var(--green)', fontWeight: 800 }}>⏱️ LAP RECORD</div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', marginTop: 2 }}>
                      {c.lapRecord?.time || '—'}
                    </div>
                    <div style={{ color: 'var(--dim)', fontSize: '0.68rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.lapRecord?.driver} ({c.lapRecord?.year})
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Circuit Detail Modal */}
      {selectedCircuit && (
        <Modal onClose={() => setSelectedCircuit(null)} label={`${selectedCircuit.name} Details`}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Flag iso={selectedCircuit.iso} title={selectedCircuit.country} lg />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--muted)' }}>
                  {selectedCircuit.locality}, {selectedCircuit.country}
                </div>
                <h2 className="h-display" style={{ fontSize: '2.4rem', textTransform: 'uppercase', margin: 0 }}>
                  {selectedCircuit.name}
                </h2>
              </div>
            </div>

            {/* Interactive Track Visualizer: 3D Elevation Ribbon vs 2D GPS Map */}
            <div className="panel" style={{ padding: '16px 20px', margin: '20px 0', background: 'rgba(0,0,0,0.45)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 800, color: 'var(--purple-hot)', letterSpacing: '0.12em' }}>
                  CIRCUIT TELEMETRY VISUALIZER
                </span>
                <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.05)', padding: 3, borderRadius: 10, border: '1px solid var(--line)' }}>
                  <button
                    type="button"
                    className={`btn ${trackView === '3d' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '5px 12px', fontSize: '0.75rem', borderRadius: 7 }}
                    onClick={() => setTrackView('3d')}
                  >
                    3D Elevation Ribbon
                  </button>
                  <button
                    type="button"
                    className={`btn ${trackView === '2d' ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '5px 12px', fontSize: '0.75rem', borderRadius: 7 }}
                    onClick={() => setTrackView('2d')}
                  >
                    2D GPS Map
                  </button>
                </div>
              </div>

              {trackView === '3d' ? (
                <Track3DRibbon circuitId={selectedCircuit.id} circuitName={selectedCircuit.name} height={280} />
              ) : (
                <div style={{ height: 260, display: 'grid', placeItems: 'center' }}>
                  <TrackMap id={selectedCircuit.id} dot color="var(--purple-hot)" style={{ maxWidth: 380 }} />
                </div>
              )}

              <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--dim)' }}>
                {trackView === '3d'
                  ? 'Drag to orbit circuit in 3D · Real-time simulated telemetry with speed & DRS status'
                  : 'Official GPS racing line · Green beacon highlights start/finish line'}
              </div>
            </div>

            {/* Description blurb */}
            {selectedCircuit.blurb && (
              <p className="lead" style={{ fontSize: '1rem', color: 'var(--muted)', marginBottom: 20 }}>
                {selectedCircuit.blurb}
              </p>
            )}

            {/* Speed & Lap Records Showcase */}
            {(selectedCircuit.lapRecord || selectedCircuit.poleLap) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
                {selectedCircuit.poleLap && (
                  <div className="panel" style={{ padding: '14px 18px', borderLeft: '4px solid var(--purple-hot)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--purple-hot)', textTransform: 'uppercase', fontWeight: 800 }}>
                      ⚡ Pole Position Benchmark
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 900, margin: '2px 0', color: '#fff' }}>
                      {selectedCircuit.poleLap.time}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)' }}>
                      Set by {selectedCircuit.poleLap.driver} ({selectedCircuit.poleLap.year})
                    </div>
                  </div>
                )}
                {selectedCircuit.lapRecord && (
                  <div className="panel" style={{ padding: '14px 18px', borderLeft: '4px solid var(--green)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--green)', textTransform: 'uppercase', fontWeight: 800 }}>
                      ⏱️ All-Time Race Lap Record
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 900, margin: '2px 0', color: '#fff' }}>
                      {selectedCircuit.lapRecord.time}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--muted)' }}>
                      Set by {selectedCircuit.lapRecord.driver} ({selectedCircuit.lapRecord.year})
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Circuit Technical Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center', marginBottom: 28, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              <div className="ccard-spec">
                <div style={{ color: 'var(--dim)' }}>CIRCUIT LENGTH</div>
                <b>{selectedCircuit.km ? `${selectedCircuit.km} km` : '—'}</b>
              </div>
              <div className="ccard-spec">
                <div style={{ color: 'var(--dim)' }}>TOTAL TURNS</div>
                <b>{selectedCircuit.turns || '—'}</b>
              </div>
              <div className="ccard-spec">
                <div style={{ color: 'var(--dim)' }}>RACE LAPS</div>
                <b>{selectedCircuit.laps || '—'}</b>
              </div>
              <div className="ccard-spec">
                <div style={{ color: 'var(--dim)' }}>DEBUT YEAR</div>
                <b style={{ color: 'var(--yellow)' }}>{selectedCircuit.firstGP || '—'}</b>
              </div>
            </div>

            {/* Past Winners on this track */}
            {selectedCircuit.winners && selectedCircuit.winners.length > 0 && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--purple-hot)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Recent Grand Prix Winners at this Circuit
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {selectedCircuit.winners.map((w, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1fr auto',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 10,
                        border: '1px solid var(--line)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span style={{ fontWeight: 800, color: 'var(--purple-hot)' }}>{w.year} GP</span>
                      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>
                        {w.winner ? (
                          <>
                            🏆 {w.winner.name}{' '}
                            <span style={{ color: teamColor(w.winner.teamId), fontSize: '0.8rem', fontWeight: 500 }}>
                              ({w.winner.team})
                            </span>
                          </>
                        ) : (
                          <span style={{ color: 'var(--dim)', fontStyle: 'italic' }}>Upcoming race</span>
                        )}
                      </div>
                      {w.pole && (
                        <span style={{ color: 'var(--dim)', fontSize: '0.78rem' }}>
                          Pole: {w.pole.name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
