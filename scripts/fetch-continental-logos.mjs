import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const clubs = [
  ['cusco-fc', 'Cusco'],
  ['independiente-medellin', 'Independiente Medellin'],
  ['coquimbo-unido', 'Coquimbo Unido'],
  ['deportes-tolima', 'Deportes Tolima'],
  ['deportivo-la-guaira', 'Deportivo La Guaira'],
  ['independiente-rivadavia', 'Independiente Rivadavia'],
  ['independiente-santa-fe', 'Independiente Santa Fe'],
  ['platense', 'Platense'],
  ['sporting-cristal', 'Sporting Cristal'],
  ['lanus', 'Lanus'],
  ['always-ready', 'Always Ready'],
  ['rosario-central', 'Rosario Central'],
  ['ucv-fc', 'Universidad Central Venezuela'],
  ['america-de-cali', 'America de Cali'],
  ['tigre', 'Tigre Argentina', 'https://a.espncdn.com/i/teamlogos/soccer/500/7767.png'],
  ['macara', 'Macara'],
  ['alianza-atletico', 'Alianza Atletico'],
  ['cienciano', 'Cienciano'],
  ['puerto-cabello', 'Academia Puerto Cabello'],
  ['juventud-uru', 'Juventud Las Piedras'],
  ['boston-river', 'Boston River'],
  ['ohiggins', "O'Higgins", 'https://a.espncdn.com/i/teamlogos/soccer/500/6072.png'],
  ['deportivo-cuenca', 'Deportivo Cuenca'],
  ['recoleta-py', 'Deportivo Recoleta Paraguay', 'https://a.espncdn.com/i/teamlogos/soccer/500/22517.png'],
  ['caracas', 'Caracas FC'],
  ['independiente-petrolero', 'Independiente Petrolero'],
  ['palestino', 'Palestino'],
  ['montevideo-city-torque', 'Montevideo City Torque'],
  ['deportivo-riestra', 'Deportivo Riestra'],
  ['audax-italiano', 'Audax Italiano'],
  ['barracas-central', 'Barracas Central', 'https://a.espncdn.com/i/teamlogos/soccer/500-dark/10060.png'],
  ['blooming', 'Blooming Bolivia', 'https://a.espncdn.com/combiner/i?img=%2Fi%2Fteamlogos%2Fsoccer%2F500%2F6047.png'],
  ['carabobo', 'Carabobo FC', 'https://a.espncdn.com/i/teamlogos/soccer/500/6037.png'],
];

const outputDirectory = path.resolve('public/logos/continental');
await mkdir(outputDirectory, { recursive: true });

const missing = [];
for (const [id, query, directBadge] of clubs) {
  const outputPath = path.join(outputDirectory, `${id}.png`);
  if (id !== 'tigre') {
    try {
      await access(outputPath);
      continue;
    } catch {
      // Continue with the missing asset.
    }
  }

  if (directBadge) {
    const imageResponse = await fetch(directBadge);
    if (!imageResponse.ok) throw new Error(`Badge download failed for ${query}: ${imageResponse.status}`);
    await writeFile(outputPath, Buffer.from(await imageResponse.arrayBuffer()));
    console.log(`${id}: direct source`);
    continue;
  }

  const searchUrl = `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=${encodeURIComponent(query)}`;
  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) throw new Error(`Search failed for ${query}: ${searchResponse.status}`);
  const payload = await searchResponse.json();
  const team = payload.teams?.find(candidate => candidate.strSport === 'Soccer' && candidate.strBadge) || payload.teams?.[0];

  if (!team?.strBadge) {
    missing.push(`${id} (${query})`);
    continue;
  }

  const imageResponse = await fetch(team.strBadge);
  if (!imageResponse.ok) throw new Error(`Badge download failed for ${query}: ${imageResponse.status}`);
  await writeFile(outputPath, Buffer.from(await imageResponse.arrayBuffer()));
  console.log(`${id}: ${team.strTeam}`);
}

if (missing.length > 0) {
  throw new Error(`Missing badges: ${missing.join(', ')}`);
}
