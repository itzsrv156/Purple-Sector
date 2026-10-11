// Purple Sector — asset builder
// 1) Downloads official 2026 driver renders, team logos and car renders from the F1 media CDN
//    into /public/img (so the site serves them itself — fast, and you can swap any file).
// 2) Builds real circuit layouts (SVG paths) from bacinger/f1-circuits (MIT licence).
//
// Run AFTER fetch-f1-data.mjs:   node scripts/fetch-assets.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const seasons = JSON.parse(await readFile(new URL('src/data/generated/seasons.json', root), 'utf8'));
const circuitsIdx = JSON.parse(await readFile(new URL('src/data/generated/circuits-index.json', root), 'utf8'));
const cur = seasons[2026];

const TEAM_SLUG = {
  mercedes: 'mercedes', ferrari: 'ferrari', mclaren: 'mclaren', red_bull: 'redbullracing',
  rb: 'racingbulls', alpine: 'alpine', haas: 'haasf1team', audi: 'audi', williams: 'williams',
  aston_martin: 'astonmartin', cadillac: 'cadillac',
};
const strip = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z]/g, '');
const CDN = 'https://media.formula1.com/image/upload';

async function download(url, dest) {
  if (existsSync(dest)) return true;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) { console.warn(`  ✗ ${res.status} ${url}`); return false; }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch (e) { console.warn('  ✗', e.message, url); return false; }
}

for (const d of ['drivers', 'teams', 'cars']) await mkdir(new URL(`public/img/${d}/`, root), { recursive: true });

console.log('Drivers…');
const driverImages = {};
for (const d of cur.driverStandings) {
  const team = TEAM_SLUG[d.teamId];
  const code = strip(d.first.split(' ')[0]).slice(0, 3) + strip(d.last).slice(0, 3) + '01';
  const url = `${CDN}/c_lfill,w_700/q_auto/d_common:f1:2026:fallback:driver:2026fallbackdriverright.webp/v1740000001/common/f1/2026/${team}/${code}/2026${team}${code}right.webp`;
  const ok = await download(url, new URL(`public/img/drivers/${d.id}.webp`, root));
  driverImages[d.id] = ok;
  console.log(`  ${ok ? '✓' : '✗'} ${d.name} (${team}/${code})`);
}

console.log('Teams…');
const teamImages = {};
for (const t of cur.constructorStandings) {
  const slug = TEAM_SLUG[t.id];
  if (!slug) { console.warn('  no slug for', t.id); continue; }
  const logo = await download(`${CDN}/c_fit,w_400,h_200/q_auto/v1740000001/common/f1/2026/${slug}/2026${slug}logowhite.webp`, new URL(`public/img/teams/${t.id}.webp`, root));
  const car = await download(`${CDN}/c_lfill,w_1400/q_auto/v1740000001/common/f1/2026/${slug}/2026${slug}carright.webp`, new URL(`public/img/cars/${t.id}.webp`, root));
  teamImages[t.id] = { logo, car };
  console.log(`  ${t.name}: logo ${logo ? '✓' : '✗'} car ${car ? '✓' : '✗'}`);
}
await writeFile(new URL('src/data/generated/images.json', root), JSON.stringify({ drivers: driverImages, teams: teamImages }));

// ---------- circuit layouts ----------
console.log('Circuit layouts…');
const W = 400, H = 300, PAD = 28;
const geo = await (await fetch('https://raw.githubusercontent.com/bacinger/f1-circuits/master/f1-circuits.geojson')).json();

// extra circuits not in 2024-26 calendars (kept as "historic")
circuitsIdx.sepang = { id: 'sepang', name: 'Sepang International Circuit', locality: 'Kuala Lumpur', country: 'Malaysia', lat: 2.7608, long: 101.7381 };

function centroid(coords) {
  const n = coords.length;
  return [coords.reduce((s, c) => s + c[0], 0) / n, coords.reduce((s, c) => s + c[1], 0) / n];
}
function toPath(coords) {
  const midLat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
  const k = Math.cos((midLat * Math.PI) / 180);
  const pts = coords.map(([lon, lat]) => [lon * k, -lat]);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min((W - PAD * 2) / (maxX - minX), (H - PAD * 2) / (maxY - minY));
  const offX = (W - (maxX - minX) * scale) / 2, offY = (H - (maxY - minY) * scale) / 2;
  const proj = pts.map(([x, y]) => [+((x - minX) * scale + offX).toFixed(1), +((y - minY) * scale + offY).toFixed(1)]);
  // thin out points (keeps file small + path smooth enough)
  const thin = proj.filter((_, i) => i % 2 === 0 || i === proj.length - 1);
  return { d: 'M' + thin.map(p => p.join(',')).join(' L') + ' Z', start: proj[0] };
}

const tracks = {};
for (const c of Object.values(circuitsIdx)) {
  let best = null, bestDist = Infinity;
  for (const f of geo.features) {
    const coords = f.geometry.type === 'MultiLineString' ? f.geometry.coordinates.flat() : f.geometry.coordinates;
    const [lon, lat] = centroid(coords);
    const dist = Math.hypot(lon - c.long, lat - c.lat);
    if (dist < bestDist) { bestDist = dist; best = { f, coords }; }
  }
  if (best && bestDist < 0.08) {
    tracks[c.id] = toPath(best.coords);
    console.log(`  ✓ ${c.name} ← ${best.f.properties.Name} (${bestDist.toFixed(3)}°)`);
  } else {
    console.warn(`  ✗ no layout for ${c.name} (nearest ${best?.f.properties.Name} @ ${bestDist.toFixed(2)}°)`);
  }
}
await writeFile(new URL('src/data/generated/tracks.json', root), JSON.stringify(tracks));
await writeFile(new URL('src/data/generated/circuits-index.json', root), JSON.stringify(circuitsIdx));
console.log('✓ done');
