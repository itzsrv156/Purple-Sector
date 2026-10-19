import React, { useState, useEffect, useRef } from 'react';
import { Zap, RotateCcw, Volume2, VolumeX, Trophy, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';

// Web Audio sound synthesizer for zero-latency, realistic F1 acoustic feedback
class F1SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.rumbleOsc = null;
    this.rumbleGain = null;
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

  beep(freq = 600, duration = 0.12) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context error fallback
    }
  }

  startRumble() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      this.stopRumble();
      this.rumbleOsc = this.ctx.createOscillator();
      this.rumbleGain = this.ctx.createGain();
      this.rumbleOsc.type = 'sawtooth';
      this.rumbleOsc.frequency.setValueAtTime(80, this.ctx.currentTime);
      this.rumbleOsc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 3);
      this.rumbleGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.rumbleOsc.connect(this.rumbleGain);
      this.rumbleGain.connect(this.ctx.destination);
      this.rumbleOsc.start();
    } catch {
      // Ignore
    }
  }

  stopRumble() {
    if (this.rumbleOsc) {
      try {
        this.rumbleGain?.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
        setTimeout(() => {
          this.rumbleOsc?.stop();
          this.rumbleOsc = null;
        }, 120);
      } catch {
        this.rumbleOsc = null;
      }
    }
  }

  launch() {
    if (this.muted) return;
    this.stopRumble();
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.55);
    } catch {
      // Ignore
    }
  }

  penalty() {
    if (this.muted) return;
    this.stopRumble();
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch {
      // Ignore
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
    sounds.stopRumble();
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
    sounds.startRumble();

    // 5 sequential red lights (1 second apart)
    for (let i = 1; i <= 5; i++) {
      const t = setTimeout(() => {
        setActiveLights(i);
        sounds.beep(480 + i * 60, 0.14);
        if (i === 5) {
          setGameState('holding');
          // FIA random blackout delay between 0.6s and 3.2s
          const randomHold = 600 + Math.random() * 2600;
          const outTimeout = setTimeout(() => {
            setActiveLights(0);
            setGameState('out');
            lightsOutTimeRef.current = performance.now();
            sounds.launch();
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
      sounds.penalty();
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
