import React, { useState, useEffect, useRef } from 'react';
import { Zap, RotateCcw, Volume2, VolumeX, Trophy, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

// Authentic FOM Television Broadcast & FIA Start Audio Engine
class F1SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Authentic 1000Hz - 1100Hz crisp electronic broadcast pip on each red light
  pip(lightIndex = 1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      // Official clean electronic chime tone
      osc.frequency.setValueAtTime(1050 + (lightIndex - 1) * 30, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.075);
    } catch {
      // Audio fallback
    }
  }

  // Realistic high-octane F1 V6 turbo hybrid launch roar at lights out
  launchRoar() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      // Fundamental engine rev scream
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(280, t);
      osc1.frequency.exponentialRampToValueAtTime(980, t + 0.7);

      gain1.gain.setValueAtTime(0.18, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

      // 2nd harmonic
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(560, t);
      osc2.frequency.exponentialRampToValueAtTime(1960, t + 0.7);

      gain2.gain.setValueAtTime(0.12, t);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.75);
      osc2.stop(t + 0.75);
    } catch {
      // Audio fallback
    }
  }

  // Clean FIA radio penalty notification chime on false start
  penaltyChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(580, t + 0.12);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.36);
    } catch {
      // Audio fallback
    }
  }
}

const sounds = new F1SoundEngine();

export default function LightsOutGame() {
  // 'idle' | 'staging' | 'holding' | 'out' | 'jump' | 'done'
  const [gameState, setGameState] = useState('idle');
  const [activeLights, setActiveLights] = useState(0); // 0 to 5
  const [reactionTime, setReactionTime] = useState(null);
  const [personalBest, setPersonalBest] = useState(() => {
    try {
      return localStorage.getItem('f1_reaction_pb') ? Number(localStorage.getItem('f1_reaction_pb')) : null;
    } catch {
      return null;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  const lightsOutTimeRef = useRef(0);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    sounds.muted = !soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const startSequence = () => {
    clearAllTimeouts();
    setGameState('staging');
    setActiveLights(0);
    setReactionTime(null);

    // 5 sequential red lights (clean broadcast pips)
    for (let i = 1; i <= 5; i++) {
      const t = setTimeout(() => {
        setActiveLights(i);
        sounds.pip(i);
        if (i === 5) {
          setGameState('holding');
          // FIA random blackout delay between 0.6s and 3.2s
          const randomHold = 600 + Math.random() * 2600;
          const outTimeout = setTimeout(() => {
            setActiveLights(0);
            setGameState('out');
            lightsOutTimeRef.current = performance.now();
            sounds.launchRoar();
          }, randomHold);
          timeoutsRef.current.push(outTimeout);
        }
      }, i * 950);
      timeoutsRef.current.push(t);
    }
  };

  const handleAction = () => {
    if (gameState === 'idle' || gameState === 'done' || gameState === 'jump') {
      startSequence();
      return;
    }

    if (gameState === 'staging' || gameState === 'holding') {
      // Jump start!
      clearAllTimeouts();
      sounds.penaltyChime();
      setGameState('jump');
      setActiveLights(5);
      return;
    }

    if (gameState === 'out') {
      // Valid reaction!
      const elapsed = Math.round(performance.now() - lightsOutTimeRef.current);
      setReactionTime(elapsed);
      setGameState('done');

      if (!personalBest || elapsed < personalBest) {
        setPersonalBest(elapsed);
        try {
          localStorage.setItem('f1_reaction_pb', String(elapsed));
        } catch {
          // Ignore
        }
      }
    }
  };

  const getBenchmark = (ms) => {
    if (!ms) return null;
    if (ms < 190) {
      return {
        badge: 'SUPERHUMAN REFLEXES',
        color: '#d58bff',
        note: 'Faster than Verstappen & Hamilton off the line! Front row pole launch into Turn 1.',
      };
    }
    if (ms < 240) {
      return {
        badge: 'GRAND PRIX WINNER PACE',
        color: '#36ff8f',
        note: 'Elite F1 driver launch. Held position and defended the inside line into Turn 1.',
      };
    }
    if (ms < 290) {
      return {
        badge: 'SOLID MIDFIELD REACTION',
        color: '#ffc83b',
        note: 'Decent launch. Matched the grid average, maintaining tire grip without wheelspin.',
      };
    }
    if (ms < 370) {
      return {
        badge: 'SLOW AWAY OFF THE LINE',
        color: '#ff8a50',
        note: 'Slight wheelspin and hesitation. Lost 2 positions on the run down to the apex.',
      };
    }
    return {
      badge: 'STALLED ON THE GRID',
      color: '#ff4365',
      note: 'Antistall kicked in! Yellow flags waving in Sector 1.',
    };
  };

  const benchmark = getBenchmark(reactionTime);

  return (
    <div className="lights-game-card">
      {/* Top Header */}
      <div className="lgc-head">
        <div className="lgc-title-wrap">
          <span className="lgc-kicker">
            <Zap size={14} style={{ color: 'var(--magenta)' }} /> FIA OFFICIAL START PROCEDURE
          </span>
          <h3 className="lgc-title">FIVE RED LIGHTS CHALLENGE</h3>
          <p className="lgc-sub">
            Wait for all 5 red lights to illuminate. When the lights extinguish — tap, click, or spacebar immediately!
          </p>
        </div>

        <div className="lgc-actions">
          {personalBest && (
            <div className="lgc-pb">
              <Trophy size={14} style={{ color: '#ffc83b' }} />
              <span>PB: <b>{personalBest} ms</b></span>
            </div>
          )}
          <button
            type="button"
            className="lgc-sound-btn"
            onClick={() => setSoundEnabled((s) => !s)}
            aria-label={soundEnabled ? 'Mute engine audio' : 'Enable engine audio'}
            title={soundEnabled ? 'Mute engine audio' : 'Enable engine audio'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Official 5-Post Gantry */}
      <div className="gantry-container" onClick={handleAction} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleAction(); } }}>
        <div className="gantry-frame">
          {[1, 2, 3, 4, 5].map((lightIdx) => {
            const isRed = (gameState === 'staging' || gameState === 'holding' || gameState === 'jump') && activeLights >= lightIdx;
            return (
              <div key={lightIdx} className="gantry-column">
                <div className="gantry-hood" />
                <div className="gantry-housing">
                  {/* Pair of official start lights */}
                  <div className={`f1-bulb ${isRed ? 'lit red' : ''}`} />
                  <div className={`f1-bulb ${isRed ? 'lit red' : ''}`} />
                  {/* Auxiliary lower indicators */}
                  <div className="f1-bulb sub" />
                  <div className="f1-bulb sub" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Interactive Prompt / Status Bar */}
        <div className={`gantry-trigger-area state-${gameState}`}>
          {gameState === 'idle' && (
            <div className="gta-msg">
              <span className="gta-main">TAP OR PRESS SPACE TO START SEQUENCE</span>
              <span className="gta-sub">Watch the red lights closely. Do not jump start!</span>
            </div>
          )}

          {gameState === 'staging' && (
            <div className="gta-msg">
              <span className="gta-main pulsing">LIGHTS STAGING ({activeLights} OF 5)...</span>
              <span className="gta-sub">Engines at full revs on the grid</span>
            </div>
          )}

          {gameState === 'holding' && (
            <div className="gta-msg">
              <span className="gta-main holding">HOLD ON... READY FOR LIGHTS OUT</span>
              <span className="gta-sub">Do not tap yet or suffer a +5s penalty!</span>
            </div>
          )}

          {gameState === 'out' && (
            <div className="gta-msg burst">
              <span className="gta-main green">LIGHTS OUT! TAP NOW!!</span>
              <span className="gta-sub">AND AWAY WE GO!</span>
            </div>
          )}

          {gameState === 'jump' && (
            <div className="gta-msg penalty">
              <span className="gta-main penalty">
                <AlertTriangle size={18} /> FALSE START! +5.00s PENALTY
              </span>
              <span className="gta-sub">You jumped the lights before they went out. Tap to retry.</span>
            </div>
          )}

          {gameState === 'done' && reactionTime && (
            <div className="gta-result">
              <div className="result-time-row">
                <span className="rt-val">{reactionTime}</span>
                <span className="rt-unit">ms</span>
                <span className="rt-sec">({(reactionTime / 1000).toFixed(3)}s)</span>
              </div>
              {benchmark && (
                <div className="result-badge-wrap" style={{ '--bc': benchmark.color }}>
                  <span className="rt-badge">{benchmark.badge}</span>
                  <p className="rt-note">{benchmark.note}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Driver Benchmark Comparison Table */}
      <div className="lgc-benchmarks">
        <span className="bench-title">F1 PADDOCK BENCHMARKS</span>
        <div className="bench-grid">
          <div className="bench-item">
            <span className="bi-driver">Max Verstappen</span>
            <span className="bi-time">~205 ms</span>
          </div>
          <div className="bench-item">
            <span className="bi-driver">Lewis Hamilton</span>
            <span className="bi-time">~215 ms</span>
          </div>
          <div className="bench-item">
            <span className="bi-driver">Lando Norris</span>
            <span className="bi-time">~220 ms</span>
          </div>
          <div className="bench-item">
            <span className="bi-driver">Charles Leclerc</span>
            <span className="bi-time">~225 ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
