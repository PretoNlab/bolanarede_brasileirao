import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const API_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer';
const MIN_ROSTER_SIZE = 16;

const CLUBS_BY_LEAGUE = {
  'arg.1': [
    ['boca-juniors', 'Boca Juniors'], ['river-plate', 'River Plate'],
    ['racing-club', 'Racing Club'], ['independiente-avellaneda', 'Independiente'],
    ['san-lorenzo', 'San Lorenzo'], ['velez-sarsfield', 'Vélez Sarsfield'],
    ['talleres-cordoba', 'Talleres (Córdoba)'], ['estudiantes-la-plata', 'Estudiantes de La Plata'],
    ['independiente-rivadavia', 'Independiente Rivadavia'], ['platense', 'Platense'],
    ['lanus', 'Lanús'], ['rosario-central', 'Rosario Central'], ['tigre', 'Tigre'],
    ['deportivo-riestra', 'Deportivo Riestra'], ['barracas-central', 'Barracas Central'],
  ],
  'uru.1': [
    ['penarol', 'Peñarol'], ['nacional-uru', 'Nacional'],
    ['defensor-sporting', 'Defensor Sporting'], ['juventud-uru', 'Juventud'],
    ['boston-river', 'Boston River'], ['montevideo-city-torque', 'Montevideo City Torque'],
  ],
  'ecu.1': [
    ['ldu-quito', 'Liga de Quito'], ['independiente-del-valle', 'Independiente del Valle'],
    ['universidad-catolica', 'Universidad Católica (Quito)'], ['barcelona-sc', 'Barcelona SC'],
    ['emelec', 'Emelec'], ['macara', 'Macará'], ['deportivo-cuenca', 'Deportivo Cuenca'],
  ],
  'par.1': [
    ['olimpia', 'Club Olimpia'], ['cerro-porteno', 'Cerro Porteño'],
    ['libertad-py', 'Libertad'], ['recoleta-py', 'Deportivo Recoleta'],
  ],
  'chi.1': [
    ['colo-colo', 'Colo Colo'], ['universidad-de-chile', 'Universidad de Chile'],
    ['coquimbo-unido', 'Coquimbo Unido'], ['ohiggins', "O'Higgins"],
    ['palestino', 'Palestino'], ['audax-italiano', 'Audax Italiano'],
  ],
  'col.1': [
    ['atletico-nacional', 'Atlético Nacional'], ['millonarios', 'Millonarios'],
    ['junior-barranquilla', 'Atlético Junior'], ['independiente-medellin', 'Independiente Medellín'],
    ['deportes-tolima', 'Deportes Tolima'], ['independiente-santa-fe', 'Independiente Santa Fe'],
    ['america-de-cali', 'América de Cali'],
  ],
  'per.1': [
    ['universitario-per', 'Universitario'], ['alianza-lima', 'Alianza Lima'],
    ['cusco-fc', 'Cusco FC'], ['sporting-cristal', 'Sporting Cristal'],
    ['alianza-atletico', 'Alianza Atlético'], ['cienciano', 'Cienciano del Cusco'],
  ],
  'bol.1': [
    ['bolivar', 'Bolívar'], ['the-strongest', 'The Strongest'],
    ['always-ready', 'Always Ready'], ['independiente-petrolero', 'Independiente Petrolero'],
    ['blooming', 'Blooming'],
  ],
  'ven.1': [
    ['deportivo-tachira', 'Deportivo Táchira'], ['deportivo-la-guaira', 'Deportivo La Guaira'],
    ['ucv-fc', 'UCV FC'], ['puerto-cabello', 'Academia Puerto Cabello'],
    ['caracas', 'Caracas FC'], ['carabobo', 'Carabobo'],
  ],
};

const DETAIL_POSITION_CYCLE = {
  Goalkeeper: ['GK'],
  Defender: ['CB', 'RB', 'CB', 'LB', 'CB', 'RB', 'LB'],
  Midfielder: ['DM', 'CM', 'AM', 'CM', 'DM', 'AM'],
  Forward: ['ST', 'RW', 'LW', 'ST', 'RW', 'LW'],
};

const GENERIC_POSITION = {
  Goalkeeper: 'GOL',
  Defender: 'ZAG',
  Midfielder: 'MEI',
  Forward: 'ATA',
};

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'BolaNaRedeManager/1.0 roster-import' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response.json();
}

function convertRoster(athletes) {
  const positionCounts = new Map();
  return athletes
    .filter(athlete => athlete.displayName && GENERIC_POSITION[athlete.position?.name])
    .map(athlete => {
      const positionName = athlete.position.name;
      const index = positionCounts.get(positionName) || 0;
      positionCounts.set(positionName, index + 1);
      const details = DETAIL_POSITION_CYCLE[positionName];
      return {
        espnId: athlete.id,
        name: athlete.displayName,
        pos: GENERIC_POSITION[positionName],
        mainPos: details[index % details.length],
        age: athlete.age || 24,
      };
    });
}

const rosters = {};
const sourceUrls = [];
const espnTeamIdByAppId = {};
const importedAt = new Date().toISOString();

for (const [league, clubs] of Object.entries(CLUBS_BY_LEAGUE)) {
  const teamsUrl = `${API_BASE}/${league}/teams?limit=100`;
  const directory = await fetchJson(teamsUrl);
  sourceUrls.push(teamsUrl);
  const teams = directory.sports?.[0]?.leagues?.[0]?.teams?.map(entry => entry.team) || [];
  const byName = new Map(teams.map(team => [normalize(team.displayName), team]));

  for (const [appId, espnName] of clubs) {
    const team = byName.get(normalize(espnName));
    if (!team) throw new Error(`Clube não encontrado na ${league}: ${espnName}`);
    espnTeamIdByAppId[appId] = team.id;

    const rosterUrl = `${API_BASE}/${league}/teams/${team.id}/roster`;
    const payload = await fetchJson(rosterUrl);
    sourceUrls.push(rosterUrl);
    const roster = convertRoster(payload.athletes || []);
    if (roster.length < MIN_ROSTER_SIZE) {
      throw new Error(`Elenco incompleto para ${appId}: ${roster.length} jogadores`);
    }
    rosters[appId] = roster;
    console.log(`${appId}: ${roster.length}`);
  }
}

const athleteTeams = new Map();
for (const [appId, roster] of Object.entries(rosters)) {
  for (const player of roster) {
    const teams = athleteTeams.get(player.espnId) || [];
    teams.push(appId);
    athleteTeams.set(player.espnId, teams);
  }
}

for (const [athleteId, appIds] of athleteTeams) {
  if (appIds.length < 2) continue;
  const athleteUrl = `https://site.api.espn.com/apis/common/v3/sports/soccer/athletes/${athleteId}`;
  const profile = await fetchJson(athleteUrl);
  sourceUrls.push(athleteUrl);
  const currentEspnTeamId = profile.playerSwitcher?.team?.id;
  const currentAppId = appIds.find(appId => espnTeamIdByAppId[appId] === currentEspnTeamId);
  if (!currentAppId) {
    throw new Error(`Vínculo atual não resolvido para atleta ${athleteId}: ${appIds.join(', ')}`);
  }

  for (const appId of appIds) {
    if (appId !== currentAppId) {
      rosters[appId] = rosters[appId].filter(player => player.espnId !== athleteId);
    }
  }
}

const body = Object.entries(rosters)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([teamId, players]) => {
    const tuples = players.map(player => [player.espnId, player.name, player.mainPos, player.age]);
    return `  ${JSON.stringify(teamId)}: ${JSON.stringify(tuples)},`;
  })
  .join('\n');

const output = `import { DetailedPosition } from './types';

export type RealSouthAmericanPlayerSeed = readonly [
  espnId: string,
  name: string,
  mainPos: DetailedPosition,
  age: number,
];

export const SOUTH_AMERICAN_ROSTER_DATA_VERSION = ${JSON.stringify(`espn-${importedAt.slice(0, 10)}-v1`)};
export const SOUTH_AMERICAN_ROSTER_UPDATED_AT = ${JSON.stringify(importedAt)};

// Current-club, player name, age and broad position come from ESPN's public
// 2026 league rosters. Detailed positions and all gameplay ratings are modeled.
// Sources:
${sourceUrls.map(url => `// - ${url}`).join('\n')}
export const REAL_SOUTH_AMERICAN_PLAYERS: Record<string, RealSouthAmericanPlayerSeed[]> = {
${body}
};
`;

await writeFile(path.resolve('realSouthAmericanRosters.ts'), output);
console.log(`Imported ${Object.keys(rosters).length} South American rosters at ${importedAt}.`);
