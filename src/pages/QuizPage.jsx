import React, { useState } from 'react';
import { Reveal, SplitText, Counter } from '../components/ui';
import { Zap, Trophy, RotateCcw, CheckCircle, XCircle, ArrowRight, Award, HelpCircle } from 'lucide-react';

const QUESTIONS = [
  {
    q: 'What does setting a "Purple Sector" mean in Formula 1 telemetry?',
    options: [
      'The driver has received a track limits penalty warning',
      'The driver set the fastest sector time of any driver so far in the session',
      'The driver set a personal best time in that sector',
      'The engine is running in high electrical deployment mode',
    ],
    answer: 1,
    trivia: 'A green sector means personal best, while a purple sector means absolute fastest of the whole grid in that session!',
  },
  {
    q: 'Which historic team did 7-time World Champion Lewis Hamilton join for the 2026 championship?',
    options: [
      'Red Bull Racing',
      'Aston Martin F1',
      'Scuderia Ferrari',
      'Cadillac Formula 1 Team',
    ],
    answer: 2,
    trivia: 'Hamilton shocked the sporting world by signing with Scuderia Ferrari to partner Charles Leclerc!',
  },
  {
    q: 'How many World Drivers’ Championships do Michael Schumacher and Lewis Hamilton each hold?',
    options: ['5 Titles', '6 Titles', '7 Titles', '8 Titles'],
    answer: 2,
    trivia: 'Both icons share the all-time record with 7 World Drivers’ Championship crowns each.',
  },
  {
    q: 'Which circuit is famously nicknamed the "Temple of Speed" due to its low downforce and long straights?',
    options: [
      'Circuit de Monaco',
      'Silverstone Circuit',
      'Circuit de Spa-Francorchamps',
      'Autodromo Nazionale di Monza',
    ],
    answer: 3,
    trivia: 'Monza in Italy has been on the F1 calendar since the inaugural 1950 season and sees cars average over 260 km/h!',
  },
  {
    q: 'What does a waving Yellow Flag signal to the drivers during a session?',
    options: [
      'Danger on or near track; reduce speed and no overtaking',
      'The race is suspended; return to pit lane immediately',
      'A faster car is approaching from behind to lap you',
      'The session or race is officially over',
    ],
    answer: 0,
    trivia: 'A single yellow means hazard beside the track; double waved yellows mean hazard blocking track and be prepared to stop.',
  },
  {
    q: 'Which brand-new 11th constructor team joined the Formula 1 grid in 2026?',
    options: [
      'Porsche Motorsport',
      'Cadillac Formula 1 Team',
      'Andretti Ford',
      'Lamborghini Squadra Corse',
    ],
    answer: 1,
    trivia: 'Cadillac F1 entered the grid as the 11th team powered by Ferrari engines before their proprietary power unit debut.',
  },
  {
    q: 'How many championship points are awarded to the winner of a Grand Prix?',
    options: ['20 points', '25 points', '18 points', '30 points'],
    answer: 1,
    trivia: 'The winner receives 25 points, second place receives 18, and third place receives 15 down to 1 point for 10th place.',
  },
  {
    q: 'Which historic circuit in Malaysia was famous for torrential monsoon rain and hosted F1 from 1999 to 2017?',
    options: [
      'Sepang International Circuit',
      'Johor Circuit',
      'Marina Bay Circuit',
      'Buddh International Circuit',
    ],
    answer: 0,
    trivia: 'Designed by Hermann Tilke, Sepang in Kuala Lumpur was beloved by drivers for its wide sweeping straights and overtaking opportunities.',
  },
  {
    q: 'What colour sidewall indicates Pirelli’s Soft tyre compound during a race weekend?',
    options: ['White', 'Yellow', 'Red', 'Green'],
    answer: 2,
    trivia: 'Pirelli uses Red for Softs (fastest, high wear), Yellow for Mediums, and White for Hards (durable, lower grip).',
  },
  {
    q: 'What happens when a driver sets the Fastest Lap of the Grand Prix?',
    options: [
      'They receive 1 bonus championship point if finishing in the top 10',
      'They receive 3 bonus championship points',
      'They get pole position for the following weekend',
      'They receive a cash bonus but zero championship points',
    ],
    answer: 0,
    trivia: 'The fastest lap bonus point was reintroduced in 2019 and is only awarded if the driver finishes inside the top 10.',
  },
];

export default function QuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQ = QUESTIONS[currentIdx];
  const isAnswered = selectedOpt !== null;

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    if (idx === currentQ.answer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setShowResult(false);
    setQuizStarted(true);
  };

  const getRank = (sc) => {
    if (sc === 10) return { title: 'World Champion', aura: 'var(--yellow)', desc: 'Flawless driving! You have encyclopedic knowledge of Formula 1.' };
    if (sc >= 8) return { title: 'Podium Finisher', aura: 'var(--purple-hot)', desc: 'Sensational race pace! You know your F1 history and technicals.' };
    if (sc >= 5) return { title: 'Points Scorer', aura: 'var(--green)', desc: 'Solid drive into the top 10! A true fan of the sport.' };
    return { title: 'Rookie in the Pits', aura: 'var(--dim)', desc: 'Fresh out of the junior formula! Time to watch more Grand Prix weekends.' };
  };

  return (
    <div className="page container" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ paddingTop: 'clamp(32px, 6vw, 64px)', marginBottom: 36, textAlign: 'center' }}>
        <Reveal>
          <div className="kicker" style={{ marginBottom: 12 }}>
            THE ULTIMATE FAN CHALLENGE
          </div>
        </Reveal>
        <h1 className="h-display h-title" style={{ marginBottom: 16 }}>
          <SplitText text="PURPLE SECTOR" by="char" />{' '}
          <span className="outline-purple">
            <SplitText text="QUIZ" by="char" base={120} />
          </span>
        </h1>
        <Reveal d={1}>
          <p className="lead" style={{ maxWidth: 640, margin: '0 auto' }}>
            Test your racing IQ with 10 questions covering 2026 regulations, driver moves, historic circuits, and F1 rules.
          </p>
        </Reveal>
      </div>

      {/* Start Screen */}
      {!quizStarted && !showResult && (
        <Reveal d={2}>
          <div className="quiz-card" style={{ textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(178, 75, 255, 0.15)', display: 'grid', placeItems: 'center', color: 'var(--purple-hot)', margin: '0 auto 16px', border: '1px solid var(--purple)' }}>
              <Zap size={32} />
            </div>
            <h2 className="h-display" style={{ fontSize: '2.2rem', textTransform: 'uppercase', margin: 0 }}>
              Ready on the Starting Grid?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.95rem', maxWidth: 440, margin: '0 auto' }}>
              10 questions. Instant feedback. Test whether you deserve a World Championship trophy or a drive-through penalty!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
              <button className="btn btn-primary btn-lg" onClick={() => setQuizStarted(true)}>
                <span>Lights Out & Away We Go</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      )}

      {/* Active Question View */}
      {quizStarted && !showResult && (
        <Reveal d={1}>
          <div className="quiz-card">
            {/* Progress Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--purple-hot)', fontWeight: 800 }}>
                QUESTION {String(currentIdx + 1).padStart(2, '0')} / {QUESTIONS.length}
              </span>
              <span style={{ color: 'var(--green)', fontWeight: 800 }}>
                SCORE: {score} PTS
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 999, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--purple), var(--green))',
                  transition: 'width 0.4s var(--ease)',
                }}
              />
            </div>

            {/* Question Title */}
            <h2 className="h-display" style={{ fontSize: '1.9rem', lineHeight: 1.2, margin: '8px 0' }}>
              {currentQ.q}
            </h2>

            {/* 4 Options */}
            <div style={{ display: 'grid', gap: 12 }}>
              {currentQ.options.map((opt, idx) => {
                const letters = ['A', 'B', 'C', 'D'];
                let stateCls = '';
                if (isAnswered) {
                  if (idx === currentQ.answer) stateCls = 'correct';
                  else if (idx === selectedOpt) stateCls = 'wrong';
                }

                return (
                  <button
                    key={idx}
                    className={`quiz-opt ${stateCls}`}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                  >
                    <span className="quiz-opt-letter">{letters[idx]}</span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    {isAnswered && idx === currentQ.answer && <CheckCircle size={20} style={{ color: 'var(--green)' }} />}
                    {isAnswered && idx === selectedOpt && idx !== currentQ.answer && <XCircle size={20} style={{ color: 'var(--magenta)' }} />}
                  </button>
                );
              })}
            </div>

            {/* Trivia snippet & Next Button */}
            {isAnswered && (
              <div style={{ marginTop: 12, padding: 18, background: 'rgba(178, 75, 255, 0.08)', borderRadius: 12, border: '1px solid var(--line)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--purple-hot)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>
                  <HelpCircle size={15} /> Did You Know?
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', margin: '0 0 16px' }}>
                  {currentQ.trivia}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-primary" onClick={handleNext}>
                    <span>{currentIdx + 1 === QUESTIONS.length ? 'See Final Results' : 'Next Sector'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {/* Result Screen */}
      {showResult && (
        <Reveal d={1}>
          <div className="quiz-card" style={{ textAlign: 'center' }}>
            {(() => {
              const rank = getRank(score);
              return (
                <>
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255, 225, 77, 0.15)', display: 'grid', placeItems: 'center', color: rank.aura, margin: '0 auto 16px', border: `2px solid ${rank.aura}` }}>
                    <Trophy size={40} />
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.12em', color: rank.aura, textTransform: 'uppercase' }}>
                    Final Classification
                  </div>
                  <h2 className="h-display" style={{ fontSize: '2.8rem', textTransform: 'uppercase', margin: '6px 0 8px' }}>
                    {rank.title}
                  </h2>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, color: 'var(--purple-hot)', margin: '12px 0' }}>
                    {score} <span style={{ fontSize: '2rem', color: 'var(--dim)' }}>/ {QUESTIONS.length}</span>
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 440, margin: '0 auto 28px' }}>
                    {rank.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                    <button className="btn btn-primary" onClick={handleRestart}>
                      <RotateCcw size={16} />
                      <span>Take Quiz Again</span>
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </Reveal>
      )}
    </div>
  );
}
