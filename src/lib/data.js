import seasonsJson from '../data/generated/seasons.json';
import peopleJson from '../data/generated/people.json';
import championsJson from '../data/generated/champions.json';
import tracksJson from '../data/generated/tracks.json';
import circuitsIndex from '../data/generated/circuits-index.json';
import imagesJson from '../data/generated/images.json';
import metaJson from '../data/generated/meta.json';
import { CIRCUIT_FACTS } from './circuitFacts';
import { TEAM_META, teamColor, teamName } from './teams';
import { isoFromCountry, isoFromNationality } from './flags';

export const TRACKS = tracksJson;
export const SEASONS = seasonsJson;
export const CHAMPIONS = championsJson;
export const META = metaJson;
export const YEARS = [2026, 2025, 2024];
export const CURRENT = metaJson.current || 2026;

/* ---------- helpers ---------- */
export const raceDate = (r) => new Date(`${r.date}T${r.time || '12:00:00Z'}`);
export const shortGP = (name) => name.replace(' Grand Prix', '');
export const fmtDate = (r, opts = { day: 'numeric', month: 'short' }) => raceDate(r).toLocaleDateString('en-GB', opts);
export const ordinal = (n) => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
export const ageOf = (dob) => { const d = new Date(dob), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n < new Date(n.getFullYear(), d.getMonth(), d.getDate())) a--; return a; };

export const driverImg = (id) => (imagesJson.drivers[id] ? `/img/drivers/${id}.webp` : null);
export const teamLogo = (id) => (imagesJson.teams[id]?.logo ? `/img/teams/${id}.webp` : null);
export const teamCar = (id) => (imagesJson.teams[id]?.car ? `/img/cars/${id}.webp` : null);
export { teamColor, teamName };

export const getSeason = (y) => SEASONS[y];

/* ---------- 2026 drivers ---------- */
const cur = SEASONS[CURRENT];
const roundsDone = cur.rounds.filter((r) => r.completed);

function seasonLine(id) {
  const line = [];
  let podiums = 0, poles = 0, fastest = 0, dnfs = 0, bestFinish = 99, sprintWins = 0;
  for (const r of roundsDone) {
    const row = r.classification.find((c) => c.id === id);
    const sprintPts = r.sprintPoints?.[id] || 0;
    if (row) {
      line.push({ round: r.round, name: shortGP(r.name), pos: row.pos, grid: row.grid, pts: row.points + sprintPts, status: row.status, circuitId: r.circuitId });
      if (row.pos <= 3) podiums++;
      if (row.pos < bestFinish) bestFinish = row.pos;
      if (!/Finished|\+\d+ Lap/.test(row.status)) dnfs++;
    } else if (sprintPts) {
      line.push({ round: r.round, name: shortGP(r.name), pos: null, grid: null, pts: sprintPts, status: 'n/a', circuitId: r.circuitId });
    }
    if (r.pole?.id === id) poles++;
    if (r.fastest?.id === id) fastest++;
    if (r.sprintWinner?.id === id) sprintWins++;
  }
  return { line, podiums, poles, fastest, dnfs, bestFinish: bestFinish === 99 ? null : bestFinish, sprintWins };
}

export const DRIVERS = cur.driverStandings.map((s) => {
  const p = peopleJson.drivers[s.id] || {};
  const season = seasonLine(s.id);
  return {
    id: s.id, code: s.code, name: s.name, first: s.first, last: s.last, number: s.number,
    nationality: s.nationality, iso: isoFromNationality(s.nationality), dob: s.dob, url: s.url,
    team: teamName(s.teamId, s.team), teamId: s.teamId, color: teamColor(s.teamId),
    pos: s.pos, points: s.points, wins: s.wins, img: driverImg(s.id),
    career: p.career || { starts: 0, wins: 0, podiums: 0, poles: 0, titles: 0, fastestLaps: 0 },
    season,
  };
});
export const driverById = (id) => DRIVERS.find((d) => d.id === id);

/* ---------- 2026 teams ---------- */
export const TEAMS = cur.constructorStandings.map((s) => {
  const p = peopleJson.teams[s.id] || {};
  const meta = TEAM_META[s.id] || {};
  const drivers = DRIVERS.filter((d) => d.teamId === s.id);
  let podiums = 0, poles = 0;
  for (const r of roundsDone) {
    podiums += r.classification.filter((c) => c.pos <= 3 && c.teamId === s.id).length;
    poles += r.pole && r.pole.team && teamNameMatch(r.pole.team, s) ? 1 : 0;
  }
  return {
    id: s.id, name: meta.name || s.name, apiName: s.name, color: teamColor(s.id), pos: s.pos, points: s.points, wins: s.wins,
    base: meta.base, pu: meta.pu, iso: isoFromNationality(s.nationality), nationality: s.nationality,
    logo: teamLogo(s.id), car: teamCar(s.id), drivers, career: p.career || { wins: 0, poles: 0, titles: 0 },
    seasonPodiums: podiums, seasonPoles: poles,
  };
});
function teamNameMatch(poleTeam, s) { return poleTeam === s.name; }
export const teamById = (id) => TEAMS.find((t) => t.id === id);

/* ---------- calendar ---------- */
export function nextRace() {
  const now = Date.now();
  return cur.rounds.find((r) => !r.completed && raceDate(r).getTime() + 4 * 3600e3 > now) || null;
}
export function isRaceWeekend(r) {
  const t = raceDate(r).getTime(), now = Date.now();
  return now > t - 2.5 * 86400e3 && now < t + 4 * 3600e3;
}
export const lastRace = () => [...roundsDone].pop() || null;

/* ---------- standings / points progression ---------- */
export function pointsProgress(year, topN = 5) {
  const s = SEASONS[year];
  const done = s.rounds.filter((r) => r.completed);
  const top = s.driverStandings.slice(0, topN);
  const series = top.map((d) => {
    let acc = 0;
    const pts = done.map((r) => {
      const row = r.classification.find((c) => c.id === d.id);
      acc += (row?.points || 0) + (r.sprintPoints?.[d.id] || 0);
      return acc;
    });
    return { id: d.id, code: d.code, name: d.name, teamId: d.teamId, color: teamColor(d.teamId), pts };
  });
  return { rounds: done.map((r) => ({ round: r.round, name: shortGP(r.name) })), series };
}

/* ---------- circuits ---------- */
export const CIRCUITS = Object.values(circuitsIndex)
  .map((c) => {
    const f = CIRCUIT_FACTS[c.id] || {};
    const winners = [];
    let on2026 = false;
    for (const y of YEARS) {
      for (const r of SEASONS[y].rounds) {
        if (r.circuitId !== c.id) continue;
        if (y === CURRENT) on2026 = true;
        winners.push({ year: y, round: r.round, gp: r.name, date: r.date, completed: r.completed, winner: r.classification[0] || null, pole: r.pole });
      }
    }
    winners.sort((a, b) => b.year - a.year);
    return { ...c, ...f, iso: isoFromCountry(c.country), country: c.country === 'UK' ? 'United Kingdom' : c.country, on2026, winners, hasTrack: !!TRACKS[c.id] };
  })
  .sort((a, b) => Number(b.on2026) - Number(a.on2026) || a.name.localeCompare(b.name));

/* ---------- champions ---------- */
export const driverTitleCounts = () => {
  const m = {};
  for (const c of CHAMPIONS.drivers) { (m[c.id] ||= { id: c.id, name: c.name, nationality: c.nationality, years: [] }).years.push(c.year); }
  return Object.values(m).sort((a, b) => b.years.length - a.years.length || a.years[0] - b.years[0]);
};
export const constructorTitleCounts = () => {
  const m = {};
  for (const c of CHAMPIONS.constructors) { (m[c.id] ||= { id: c.id, name: c.name, years: [] }).years.push(c.year); }
  return Object.values(m).sort((a, b) => b.years.length - a.years.length);
};
