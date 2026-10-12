import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reveal, SplitText, Flag, Counter } from '../components/ui';
import DriverCard, { DriverCutout } from '../components/DriverCard';
import Modal from '../components/Modal';
import { DRIVERS, TEAMS, teamLogo, ageOf } from '../lib/data';
import { Search, Trophy, Flag as FlagIcon, Zap, Activity, Award, User, ChevronRight } from 'lucide-react';

export default function DriversPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [activeDriver, setActiveDriver] = useState(null);

  // If URL has /drivers/:id, open modal for that driver
  useEffect(() => {
    if (id) {
      const match = DRIVERS.find((d) => d.id === id);
      if (match) setActiveDriver(match);
    }
  }, [id]);

  const handleCloseModal = () => {
    setActiveDriver(null);
    if (id) navigate('/drivers', { replace: true });
  };

  const filteredDrivers = DRIVERS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.team.toLowerCase().includes(search.toLowerCase()) ||
      String(d.number).includes(search);
    const matchesTeam = selectedTeam === 'all' || d.teamId === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36 }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            2026 GRID LINEUP
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text="WORLD" by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="DRIVERS" by="char" base={100} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 720 }}>
            The 2026 grid. 22 drivers, 11 teams, and one trophy. Full season pace, career victories, and head-to-head garage battles.
          </p>
        </Reveal>
      </div>

      {/* Search and Filters */}
      <Reveal d={1} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 36 }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: 260, flex: '1 1 280px', maxWidth: 400 }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--dim)' }} />
          <input
            type="text"
            className="input"
            placeholder="Search driver, code, number or team..."
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

        {/* Team filter dropdown / pills */}
        <div className="chips" style={{ maxWidth: '100%', paddingBottom: 6 }}>
          <button
            className={`btn ${selectedTeam === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '7px 16px', borderRadius: 8, fontSize: '0.82rem', whiteSpace: 'nowrap', flexShrink: 0 }}
            onClick={() => setSelectedTeam('all')}
          >
            All Teams ({DRIVERS.length})
          </button>
          {TEAMS.map((t) => (
            <button
              key={t.id}
              className={`btn ${selectedTeam === t.id ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: '0.82rem',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                borderColor: selectedTeam === t.id ? t.color : 'var(--line)',
                color: selectedTeam === t.id ? '#fff' : 'var(--muted)',
              }}
              onClick={() => setSelectedTeam(t.id)}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, display: 'inline-block' }} />
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Grid of Driver Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {filteredDrivers.map((d, i) => (
          <Reveal key={d.id} d={(i % 6) + 1}>
            <DriverCard d={d} i={i} onClick={() => setActiveDriver(d)} />
          </Reveal>
        ))}
      </div>

      {/* Driver Detail Modal */}
      {activeDriver && (
        <Modal onClose={handleCloseModal} label={`${activeDriver.name} Details`}>
          <div className="driver-modal-grid" style={{ '--tc': activeDriver.color }}>
            {/* Left Hero Stage: Driver Cutout Standing Tall */}
            <div className="driver-modal-stage">
              <span className="driver-modal-stage-num" aria-hidden="true">
                {activeDriver.number}
              </span>
              <DriverCutout d={activeDriver} className="driver-modal-img" />
            </div>

            {/* Right Information & Performance Details */}
            <div>
              {/* Name & Basic Info */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Flag iso={activeDriver.iso} title={activeDriver.nationality} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--muted)' }}>
                    {activeDriver.nationality} · Age {ageOf(activeDriver.dob)}
                  </span>
                </div>
                <h2 className="h-display" style={{ fontSize: '2.8rem', lineHeight: 0.95, textTransform: 'uppercase', margin: '4px 0 8px' }}>
                  {activeDriver.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {teamLogo(activeDriver.teamId) && (
                    <img src={teamLogo(activeDriver.teamId)} alt="" width="26" height="26" loading="lazy" />
                  )}
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', color: activeDriver.color }}>
                    {activeDriver.team}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: 'var(--text)' }}>
                    #{activeDriver.number}
                  </span>
                </div>
              </div>

            {/* 2026 Season Performance Cards */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--purple-hot)', textTransform: 'uppercase', marginBottom: 10 }}>
                2026 Season Form
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, textAlign: 'center' }}>
                <div className="panel" style={{ padding: 12 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>CHAMPIONSHIP</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--purple-hot)' }}>
                    P{activeDriver.pos}
                  </div>
                </div>
                <div className="panel" style={{ padding: 12 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>POINTS</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900 }}>
                    {activeDriver.points}
                  </div>
                </div>
                <div className="panel" style={{ padding: 12 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>2026 WINS</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--green)' }}>
                    {activeDriver.wins}
                  </div>
                </div>
                <div className="panel" style={{ padding: 12 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--dim)', fontFamily: 'var(--font-mono)' }}>PODIUMS</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--yellow)' }}>
                    {activeDriver.season?.podiums || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* All-Time Career Stats */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 10 }}>
                All-Time Career Record
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, textAlign: 'center' }}>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>GP STARTS</div>
                  <b>{activeDriver.career?.starts || 0}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>CAREER WINS</div>
                  <b style={{ color: 'var(--green)' }}>{activeDriver.career?.wins || 0}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>PODIUMS</div>
                  <b>{activeDriver.career?.podiums || 0}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>POLE POSITIONS</div>
                  <b>{activeDriver.career?.poles || 0}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>WORLD TITLES</div>
                  <b style={{ color: 'var(--yellow)' }}>{activeDriver.career?.titles || 0}</b>
                </div>
                <div className="ccard-spec">
                  <div style={{ color: 'var(--dim)' }}>FASTEST LAPS</div>
                  <b>{activeDriver.career?.fastestLaps || 0}</b>
                </div>
              </div>
            </div>

            {/* 2026 Round-by-Round Log */}
            {activeDriver.season?.line?.length > 0 && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.12em', color: 'var(--dim)', textTransform: 'uppercase', marginBottom: 10 }}>
                  2026 Grand Prix Log
                </div>
                <div style={{ display: 'grid', gap: 6, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }}>
                  {activeDriver.season.line.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '40px 1fr auto auto',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 12px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: 8,
                        border: '1px solid var(--line)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <span style={{ color: 'var(--dim)' }}>R{item.round}</span>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                      <span style={{ color: item.pos <= 3 ? 'var(--purple-hot)' : 'inherit', fontWeight: 700 }}>
                        {item.pos ? `Finish: P${item.pos}` : 'DNF'}
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--green)' }}>
                        +{item.pts} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
