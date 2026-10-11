import React, { useState } from 'react';
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
        className={`dcard ${compact ? 'compact' : ''}`}
        style={{ '--tc': d.color }}
        onClick={onClick}
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
      to={`/drivers/${d.id}`}
      className={`dcard ${compact ? 'compact' : ''}`}
      style={{ '--tc': d.color }}
      aria-label={`${d.name}, ${d.team}`}
    >
      {content}
    </TLink>
  );
}
