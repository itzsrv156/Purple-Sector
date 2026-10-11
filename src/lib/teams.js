// Team presentation data (colours, bases, power units). Stats come from the API, not from here.
export const TEAM_META = {
  mercedes:     { name: 'Mercedes',        color: '#27F4D2', base: 'Brackley, United Kingdom', pu: 'Mercedes',      country: 'DE' },
  ferrari:      { name: 'Ferrari',         color: '#ED1131', base: 'Maranello, Italy',         pu: 'Ferrari',       country: 'IT' },
  mclaren:      { name: 'McLaren',         color: '#FF8000', base: 'Woking, United Kingdom',   pu: 'Mercedes',      country: 'GB' },
  red_bull:     { name: 'Red Bull Racing', color: '#4B7BFF', base: 'Milton Keynes, United Kingdom', pu: 'Red Bull Ford', country: 'AT' },
  rb:           { name: 'Racing Bulls',    color: '#6C9BFF', base: 'Faenza, Italy',            pu: 'Red Bull Ford', country: 'IT' },
  alpine:       { name: 'Alpine',          color: '#FF5FB5', base: 'Enstone, United Kingdom',  pu: 'Mercedes',      country: 'FR' },
  haas:         { name: 'Haas',            color: '#B8BCC6', base: 'Kannapolis, United States', pu: 'Ferrari',      country: 'US' },
  audi:         { name: 'Audi',            color: '#FF2D55', base: 'Hinwil, Switzerland',      pu: 'Audi',          country: 'DE' },
  williams:     { name: 'Williams',        color: '#3DB0FF', base: 'Grove, United Kingdom',    pu: 'Mercedes',      country: 'GB' },
  aston_martin: { name: 'Aston Martin',    color: '#1FB88A', base: 'Silverstone, United Kingdom', pu: 'Honda',      country: 'GB' },
  cadillac:     { name: 'Cadillac',        color: '#C9CED9', base: 'Fishers, United States',   pu: 'Ferrari',       country: 'US' },
  // past seasons
  sauber:       { name: 'Kick Sauber',     color: '#52E252', base: 'Hinwil, Switzerland',      pu: 'Ferrari',       country: 'CH' },
  alphatauri:   { name: 'AlphaTauri',      color: '#8FA3C8', base: 'Faenza, Italy',            pu: 'Honda RBPT',    country: 'IT' },
};

export const teamColor = id => TEAM_META[id]?.color || '#b24bff';
export const teamName = (id, fallback = '') => TEAM_META[id]?.name || fallback;
