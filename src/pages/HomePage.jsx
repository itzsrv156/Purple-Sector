import React, { useEffect, useState } from 'react';
import { TLink } from '../components/Transition';
import { Reveal, SplitText, Scramble, Typewriter, Counter, Flag, TrackMap, Marquee } from '../components/ui';
import DriverCard from '../components/DriverCard';
import LightsOutGame from '../components/LightsOutGame';
import { DRIVERS, TEAMS, CIRCUITS, nextRace, lastRace, shortGP, fmtDate, raceDate } from '../lib/data';
import { isoFromCountry } from '../lib/flags';
import { ArrowRight, Trophy, Calendar as CalIcon, Users, MapPin, Zap, Flame } from 'lucide-react';

function Countdown({ target }) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div style={{ display: 'flex', gap: 14 }}>
      {[
        { l: 'DAYS', v: left.d },
        { l: 'HRS', v: left.h },
        { l: 'MIN', v: left.m },
        { l: 'SEC', v: left.s },
      ].map((item, i) => (
        <div key={i} style={{ textAlign: 'center', background: 'rgba(255, 255, 255, 0.04)', padding: '8px 12px', borderRadius: 8, minWidth: 54, border: '1px solid var(--line)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--purple-hot)' }}>{String(item.v).padStart(2, '0')}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--dim)', letterSpacing: '0.1em' }}>{item.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const nxt = nextRace();
  const nextCircuit = nxt ? CIRCUITS.find((c) => c.id === nxt.circuitId) : null;
  const nextIso = nextCircuit?.iso || (nxt ? isoFromCountry(nxt.country) : null);
  const prev = lastRace();
  const topDrivers = DRIVERS.slice(0, 5);
  const featuredDrivers = DRIVERS.slice(0, 6);

  return (
    <div className="page">
      {/* ---------- HERO SECTION ---------- */}
      <section className="section" style={{ paddingTop: 'clamp(40px, 8vw, 90px)', paddingBottom: 60 }}>
        <div className="container">
          <Reveal>
            <div className="kicker" style={{ marginBottom: 18 }}>
              2026 FIA FORMULA ONE WORLD CHAMPIONSHIP
            </div>
          </Reveal>

          <h1 className="h-display h-mega" style={{ marginBottom: 20 }}>
            <SplitText text="PURPLE" by="char" />
            <br />
            <span className="outline">
              <SplitText text="SECTOR" by="char" base={120} />
            </span>
          </h1>

          <Reveal d={2}>
            <p className="lead" style={{ marginBottom: 36 }}>
              Built for pure racing speed. Live 2026 title fights, raw grid rivalries, real circuit records, and the thrill of five red lights going out.
            </p>
          </Reveal>

          <Reveal d={3} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <TLink to="/standings" className="btn btn-primary">
              <span>Explore Standings</span>
              <ArrowRight />
            </TLink>
            <TLink to="/quiz" className="btn btn-ghost">
              <Zap style={{ color: 'var(--yellow)' }} />
              <span>Take the F1 Quiz</span>
            </TLink>
          </Reveal>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 16, marginTop: 64 }}>
            {[
              { label: 'Rounds on Calendar', val: 24, icon: CalIcon, color: 'var(--purple)' },
              { label: 'Full Grid Drivers', val: DRIVERS.length || 22, icon: Users, color: 'var(--green)' },
              { label: 'Constructor Teams', val: TEAMS.length || 11, icon: Trophy, color: 'var(--magenta)' },
              { label: 'Circuits Mapped', val: 26, icon: MapPin, color: 'var(--yellow)' },
            ].map((stat, i) => (
              <Reveal key={i} d={i + 1} className="panel" style={{ padding: '20px 24px' }}>
                <stat.icon size={20} style={{ color: stat.color, marginBottom: 12 }} />
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>
                  <Counter value={stat.val} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 4 }}>{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- LIVE MARQUEE TICKER ---------- */}
      <Marquee speed={45}>
        <span className="marquee-item"><span className="rd">LIVE 2026</span> SEASON IN FULL SWING <span className="sep">✦</span></span>
        {DRIVERS.slice(0, 8).map(d => (
          <span key={d.id} className="marquee-item">
            <span className="rd">P{d.pos}</span> {d.name.toUpperCase()} ({d.points} PTS) <span className="sep">✦</span>
          </span>
        ))}
      </Marquee>

      {/* ---------- NEXT RACE SPOTLIGHT ---------- */}
      {nxt && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="kicker"><Flame size={14} style={{ color: 'var(--magenta)' }} /> UP NEXT ON THE TRACK</span>
              <h2 className="h-display h-lg">ROUND {nxt.round}: {nxt.name.toUpperCase()}</h2>
            </div>

            <div className="panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, padding: 'clamp(24px, 4vw, 44px)' }}>
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Flag iso={nextIso} lg title={nextCircuit?.country || nxt.country} />
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--purple-hot)' }}>{fmtDate(nxt, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{nxt.circuit}</div>
                  </div>
                </div>

                <div style={{ padding: '16px 20px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 12, border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>COUNTDOWN TO LIGHTS OUT</div>
                  <Countdown target={raceDate(nxt)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.85rem' }}>
                  <div className="panel" style={{ padding: '12px 16px' }}>
                    <span className="muted">Locality:</span> <b>{nxt.locality}</b>
                  </div>
                  <div className="panel" style={{ padding: '12px 16px' }}>
                    <span className="muted">Format:</span> <b>{nxt.sprint ? 'Sprint Weekend' : 'Standard GP'}</b>
                  </div>
                </div>

                <TLink to={`/calendar`} className="btn btn-primary" style={{ justifySelf: 'start', marginTop: 10 }}>
                  <span>View Full Weekend Schedule</span>
                  <ArrowRight />
                </TLink>
              </div>

              <div style={{ display: 'grid', placeItems: 'center', background: 'rgba(0, 0, 0, 0.4)', borderRadius: 18, padding: 24, minHeight: 260 }}>
                <TrackMap id={nxt.circuitId} dot color="var(--purple-hot)" style={{ maxWidth: 380 }} />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--dim)', marginTop: 8 }}>Official GPS Track Outline (Interactive)</div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* ---------- TOP 5 TIMING TOWER & RECENT WINNER ---------- */}
      <section className="section" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(178, 75, 255, 0.04) 50%, transparent 100%)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="section-head">
                <span className="kicker">CHAMPIONSHIP STANDINGS</span>
                <h2 className="h-display h-lg">LEADERBOARD</h2>
                <p className="sub">Live official points standings across all completed rounds of the 2026 season.</p>
              </div>

              <div className="tower">
                {topDrivers.map((d) => (
                  <TLink key={d.id} to={`/drivers/${d.id}`} className={`tower-row ${d.pos === 1 ? 'lead' : ''}`} style={{ '--tc': d.color }}>
                    <div className="pos">{d.pos}</div>
                    <div className="bar" style={{ background: d.color }} />
                    <div className="nm">
                      <Flag iso={d.iso} title={d.nationality} />
                      <span className="code">{d.code}</span>
                      <span className="full">{d.name}</span>
                    </div>
                    <div className="pts">{d.points} PTS</div>
                  </TLink>
                ))}
              </div>

              <div style={{ marginTop: 24 }}>
                <TLink to="/standings" className="btn btn-ghost">
                  <span>Full Championship Tables</span>
                  <ArrowRight />
                </TLink>
              </div>
            </div>

            {prev && prev.classification[0] && (
              <div className="panel" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
                <span className="kicker" style={{ marginBottom: 12 }}>MOST RECENT WINNER</span>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase' }}>
                  {prev.name}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', margin: '8px 0 16px' }}>
                  {prev.classification[0].name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--purple-hot)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  <span>{prev.classification[0].team}</span>
                  <span>•</span>
                  <span>Winner from P{prev.classification[0].grid}</span>
                </div>
                {DRIVERS.find(d => d.id === prev.classification[0].id)?.img && (
                  <img
                    src={DRIVERS.find(d => d.id === prev.classification[0].id).img}
                    alt=""
                    style={{ position: 'absolute', right: -20, bottom: -20, height: '80%', opacity: 0.25, pointerEvents: 'none', filter: 'grayscale(0.3)' }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- FEATURED DRIVERS (PNG POP-OUT SHOWCASE) ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span className="kicker">THE 2026 GRID</span>
              <h2 className="h-display h-lg">FEATURED DRIVERS</h2>
              <p className="sub">Full 2026 driver grid — tap any driver for in-depth race telemetry and championship form.</p>
            </div>
            <TLink to="/drivers" className="btn btn-ghost">
              <span>View All 22 Drivers</span>
              <ArrowRight />
            </TLink>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 28, marginTop: 24 }}>
            {featuredDrivers.map((d, i) => (
              <Reveal key={d.id} d={i % 3}>
                <DriverCard d={d} i={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FIA FIVE RED LIGHTS REACTION CHALLENGE ---------- */}
      <section className="section">
        <div className="container">
          <LightsOutGame />
        </div>
      </section>

      {/* ---------- CALL TO ACTION BANNER ---------- */}
      <section className="section" style={{ paddingBottom: 100 }}>
        <div className="container">
          <div className="panel" style={{ padding: 'clamp(32px, 6vw, 64px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <h2 className="h-display h-lg" style={{ marginBottom: 16 }}>THINK YOU KNOW FORMULA 1?</h2>
            <p className="lead" style={{ margin: '0 auto 28px' }}>
              Test your racing IQ across 10 intense rounds — 2026 active aero changes, legendary overtakes, and historic championship deciders.
            </p>
            <TLink to="/quiz" className="btn btn-primary" style={{ padding: '18px 36px', fontSize: '1.05rem' }}>
              <Zap style={{ color: 'var(--yellow)' }} />
              <span>Launch F1 Trivia Quiz</span>
            </TLink>
          </div>
        </div>
      </section>
    </div>
  );
}
