import React, { useEffect, useState } from 'react';
import { Gauge, Wind, Zap } from 'lucide-react';

export default function LapProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const cur = window.scrollY;
      const pct = total > 0 ? Math.min(100, Math.max(0, Math.round((cur / total) * 100))) : 0;
      setProgress(pct);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const speed = 190 + Math.round(progress * 1.6);
  const isDrs = progress > 30 && progress < 85;
  const sector = progress < 33 ? 'S1' : progress < 66 ? 'S2' : 'S3 PURPLE';

  return (
    <div className="lap-telemetry-dock" aria-hidden="true">
      <div className="ltd-bar-track">
        <div className="ltd-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="ltd-info">
        <span className="ltd-tag">LAP PROGRESS: <b>{progress}%</b></span>
        <span className="ltd-sep">•</span>
        <span className="ltd-sec">{sector}</span>
        <span className="ltd-sep">•</span>
        <span className={`ltd-drs ${isDrs ? 'on' : ''}`}>
          <Wind size={11} /> {isDrs ? 'DRS ACTIVE' : 'DRS AVAIL'}
        </span>
      </div>
    </div>
  );
}
