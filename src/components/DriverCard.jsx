import React, { useState, useRef } from 'react';
import { TLink } from './Transition';
import { Flag } from './ui';
import { teamLogo } from '../lib/data';

/** Cut-out render that pops out of the card. Falls back to a monogram if no image exists. */
export function DriverCutout({ d, className = '', style = {}, ...rest }) {
  const [bad, setBad] = useState(false);
  if (!d?.img || bad) {
    return (
      <div className={`cutout-fallback ${className}`} style={style} aria-hidden="true">
        {d?.code || '—'}
      </div>
    );
  }
  return (
    <img
      className={`cutout ${className}`}
      src={d.img}
      alt={d.name}
      loading="lazy"
      decoding="async"
      style={style}
      onError={() => setBad(true)}
      {...rest}
    />
  );
}

export default function DriverCard({ d, i = 0, compact = false, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -9;
    const rotY = ((x - centerX) / centerX) * 9;
    el.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
    el.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
    el.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const content = (
    <>
      <div className="dcard-bg" />
      <span className="dcard-num" aria-hidden="true">{d.number}</span>
      <div className="dcard-img-wrap">
        <DriverCutout d={d} className="dcard-img" />
      </div>
      <div className="dcard-info">
        <div className="dcard-top">
          <span className="dcard-pos">P{d.pos}</span>
          <Flag iso={d.iso} title={d.nationality} />
        </div>
        <div className="dcard-name">
          <span>{d.first ? d.first.split(' ')[0] : ''}</span>
          <b>{d.last}</b>
        </div>
        <div className="dcard-team">
          {teamLogo(d.teamId) && <img src={teamLogo(d.teamId)} alt="" width="20" height="20" loading="lazy" />}
          <span>{d.team}</span>
          <em>{d.points} pts</em>
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div
        ref={cardRef}
        className={`dcard ${compact ? 'compact' : ''}`}
        style={{ '--tc': d.color }}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={`${d.name}, ${d.team}`}
      >
        {content}
      </div>
    );
  }

  return (
    <TLink
      ref={cardRef}
      to={`/drivers/${d.id}`}
      className={`dcard ${compact ? 'compact' : ''}`}
      style={{ '--tc': d.color }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label={`${d.name}, ${d.team}`}
    >
      {content}
    </TLink>
  );
}
