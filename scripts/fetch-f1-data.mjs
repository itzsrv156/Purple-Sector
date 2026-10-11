// Purple Sector — data builder
// Pulls REAL data from the Jolpica F1 API (the maintained Ergast successor)
// and writes JSON the website imports. Run:  node scripts/fetch-f1-data.mjs
//
// Responses are cached in scripts/.cache so re-runs are instant and API-friendly.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HISTORICAL_DRIVER_CHAMPIONS, HISTORICAL_CONSTRUCTOR_CHAMPIONS } from './championsData.js';

const BASE = 'https://api.jolpi.ca/ergast/f1';
const OUT = new URL('../src/data/generated/', import.meta.url);
const CACHE = new URL('./.cache/', import.meta.url);
const SEASONS = [2026, 2025, 2024];
const CURRENT = 2026;

await mkdir(OUT, { recursive: true });
await mkdir(CACHE, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let lastCall = 0;

async function api(path, { fresh = false } = {}) {
  const key = createHash('md5').update(path).digest('hex');
  const file = new URL(key + '.json', CACHE);
  // current-season endpoints must always be fresh
  if (!fresh && existsSync(file)) return JSON.parse(await readFile(file, 'utf8'));
  for (let attempt = 0; attempt < 8; attempt++) {
    const wait = Math.max(0, 300 - (Date.now() - lastCall));
    if (wait) await sleep(wait);
    lastCall = Date.now();
    const res = await fetch(BASE + path, { headers: { 'User-Agent': 'purple-sector-site' } });
    if (res.status === 429 || res.status >= 500) {
      await sleep(2000 * (attempt + 1));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status} ${path}`);
    const json = await res.json();
    await writeFile(file, JSON.stringify(json));
    return json;
  }
  throw new Error('Gave up: ' + path);
}

const total = j => Number(j.MRData.total);
const races = j => j.MRData.RaceTable.Races;

const driverName = d => `${d.givenName} ${d.familyName}`;
const slimDriver = d => ({
  id: d.driverId, code: d.code || d.familyName.slice(0, 3).toUpperCase(),
  name: driverName(d), first: d.givenName, last: d.familyName,
  number: d.permanentNumber || null, nationality: d.nationality, dob: d.dateOfBirth, url: d.url,
});

// ---------- per-season ----------
async function buildSeason(year) {
  console.log(`\n=== ${year} ===`);
  const fresh = year === CURRENT;
  const cal = races(await api(`/${year}.json?limit=100`, { fresh }));

  // all results (paged)
  const byRound = {};
  let offset = 0, tot = 1;
  while (offset < tot) {
    const j = await api(`/${year}/results.json?limit=100&offset=${offset}`, { fresh });
    tot = total(j);
    for (const r of races(j)) {
      (byRound[r.round] ||= []).push(...r.Results);
    }
    offset += 100;
  }
  // pole sitters
  const poles = {};
  try {
    const j = await api(`/${year}/qualifying/1.json?limit=100`, { fresh });
    for (const r of races(j)) poles[r.round] = r.QualifyingResults[0];
  } catch (e) { console.warn('poles failed', e.message); }
  // sprint results (winner + points for every driver)
  const sprints = {}, sprintPts = {};
  try {
    let so = 0, st = 1;
    while (so < st) {
      const j = await api(`/${year}/sprint.json?limit=100&offset=${so}`, { fresh });
      st = total(j);
      for (const r of races(j)) {
        for (const x of r.SprintResults) {
          if (x.position === '1') sprints[r.round] = x;
          (sprintPts[r.round] ||= {})[x.Driver.driverId] = Number(x.points);
        }
      }
      so += 100;
    }
  } catch (e) { console.warn('sprint failed', e.message); }

  const rounds = cal.map(r => {
    const res = (byRound[r.round] || []).sort((a, b) => Number(a.position) - Number(b.position));
    const fl = res.find(x => x.FastestLap?.rank === '1');
    const row = x => ({
      pos: Number(x.position), id: x.Driver.driverId, code: x.Driver.code, name: driverName(x.Driver),
      team: x.Constructor.name, teamId: x.Constructor.constructorId, grid: Number(x.grid),
      points: Number(x.points), status: x.status, time: x.Time?.time || null, laps: Number(x.laps),
    });
    const pole = poles[r.round];
    const sp = sprints[r.round];
    return {
      round: Number(r.round), name: r.raceName, date: r.date, time: r.time || null,
      circuitId: r.Circuit.circuitId, circuit: r.Circuit.circuitName,
      locality: r.Circuit.Location.locality, country: r.Circuit.Location.country,
      lat: Number(r.Circuit.Location.lat), long: Number(r.Circuit.Location.long),
      sprint: Boolean(r.Sprint),
      sessions: {
        fp1: r.FirstPractice || null, fp2: r.SecondPractice || null, fp3: r.ThirdPractice || null,
        sq: r.SprintQualifying || r.SprintShootout || null, sprint: r.Sprint || null,
        quali: r.Qualifying || null,
      },
      sprintPoints: sprintPts[r.round] || null,
      completed: res.length > 0,
      classification: res.slice(0, 22).map(row),
      pole: pole ? { id: pole.Driver.driverId, code: pole.Driver.code, name: driverName(pole.Driver), team: pole.Constructor.name } : null,
      fastest: fl ? { id: fl.Driver.driverId, code: fl.Driver.code, name: driverName(fl.Driver), team: fl.Constructor.name, time: fl.FastestLap.Time.time, lap: Number(fl.FastestLap.lap) } : null,
      sprintWinner: sp ? { id: sp.Driver.driverId, code: sp.Driver.code, name: driverName(sp.Driver), team: sp.Constructor.name } : null,
    };
  });

  const ds = await api(`/${year}/driverStandings.json?limit=100`, { fresh });
  const cs = await api(`/${year}/constructorStandings.json?limit=100`, { fresh });
  const dList = ds.MRData.StandingsTable.StandingsLists[0];
  const cList = cs.MRData.StandingsTable.StandingsLists[0];
  const driverStandings = (dList?.DriverStandings || []).map(s => ({
    pos: Number(s.position), points: Number(s.points), wins: Number(s.wins),
    ...slimDriver(s.Driver),
    team: s.Constructors.at(-1)?.name, teamId: s.Constructors.at(-1)?.constructorId,
    teams: s.Constructors.map(c => c.name),
  }));
  const constructorStandings = (cList?.ConstructorStandings || []).map(s => ({
    pos: Number(s.position), points: Number(s.points), wins: Number(s.wins),
    id: s.Constructor.constructorId, name: s.Constructor.name, nationality: s.Constructor.nationality,
  }));

  return { year, roundsPlayed: Number(dList?.round || 0), rounds, driverStandings, constructorStandings };
}

const seasons = {};
for (const y of SEASONS) seasons[y] = await buildSeason(y);

// ---------- 2026 drivers + constructors careers ----------
console.log('\n=== careers ===');
const cur = seasons[CURRENT];
const driverIds = cur.driverStandings.map(d => d.id);
const driverProfiles = {};
for (const s of cur.driverStandings) {
  const id = s.id;
  const q = async p => { try { return total(await api(`/drivers/${id}/${p}?limit=1`)); } catch (e) { console.warn(`   ! ${id} ${p} ${e.message}`); return 0; } };
  const [starts, wins, p2, p3, poles, titles, fastest] = await Promise.all([
    q('results.json'), q('results/1.json'), q('results/2.json'), q('results/3.json'),
    q('qualifying/1.json'), q('driverStandings/1.json'), q('fastest/1/results.json'),
  ]);
  driverProfiles[id] = {
    ...slimDriver({ driverId: id, code: s.code, givenName: s.first, familyName: s.last, permanentNumber: s.number, nationality: s.nationality, dateOfBirth: s.dob, url: s.url }),
    career: { starts, wins, podiums: wins + p2 + p3, poles, titles, fastestLaps: fastest },
  };
  console.log(`  ${s.name}: ${starts} GP, ${wins}W, ${wins + p2 + p3}P, ${poles} poles, ${titles} titles`);
}

const teamProfiles = {};
for (const s of cur.constructorStandings) {
  const id = s.id;
  const q = async p => { try { return total(await api(`/constructors/${id}/${p}?limit=1`)); } catch (e) { console.warn(`   ! ${id} ${p} ${e.message}`); return 0; } };
  const [wins, poles, titles] = await Promise.all([q('results/1.json'), q('qualifying/1.json'), q('constructorStandings/1.json')]);
  teamProfiles[id] = { id, name: s.name, nationality: s.nationality, career: { wins, poles, titles } };
  console.log(`  ${s.name}: ${wins}W, ${poles} poles, ${titles} titles`);
}

// ---------- champions (all-time) ----------
console.log('\n=== champions ===');
const driverChampions = HISTORICAL_DRIVER_CHAMPIONS;
const constructorChampions = HISTORICAL_CONSTRUCTOR_CHAMPIONS;
console.log(`  ${driverChampions.length} driver titles, ${constructorChampions.length} constructor titles`);
// derive title counts (Jolpica's per-driver standings endpoint isn't reliable)
for (const [id, p] of Object.entries(driverProfiles)) p.career.titles = driverChampions.filter(c => c.id === id).length;
for (const [id, p] of Object.entries(teamProfiles)) p.career.titles = constructorChampions.filter(c => c.id === id).length;

// ---------- circuits across all 3 seasons (+ lat/long for layout matching) ----------
const circuits = {};
for (const y of SEASONS) for (const r of seasons[y].rounds) {
  circuits[r.circuitId] ||= { id: r.circuitId, name: r.circuit, locality: r.locality, country: r.country, lat: r.lat, long: r.long };
}

await writeFile(new URL('seasons.json', OUT), JSON.stringify(seasons));
await writeFile(new URL('people.json', OUT), JSON.stringify({ drivers: driverProfiles, teams: teamProfiles }));
await writeFile(new URL('champions.json', OUT), JSON.stringify({ drivers: driverChampions, constructors: constructorChampions }));
await writeFile(new URL('circuits-index.json', OUT), JSON.stringify(circuits));
await writeFile(new URL('meta.json', OUT), JSON.stringify({ generatedAt: new Date().toISOString(), current: CURRENT }));
console.log('\n✓ wrote src/data/generated/*.json');

