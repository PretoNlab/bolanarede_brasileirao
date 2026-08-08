import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const BASE_URL = 'https://www.cbf.com.br';
const TM_BASE_URL = 'https://www.transfermarkt.com.br';
const TM_CACHE_DIR = path.join(process.cwd(), 'scratch', 'tm-cache');
const COMPETITIONS = [
  'campeonato-brasileiro/serie-a',
  'campeonato-brasileiro/serie-b',
];

const TRANSFERMARKT_LEAGUES = [
  'https://www.transfermarkt.com.br/campeonato-brasileiro-serie-a/startseite/wettbewerb/BRA1',
  'https://www.transfermarkt.com.br/campeonato-brasileiro-serie-b/startseite/wettbewerb/BRA2',
];

const APP_TEAM_BY_CBF_NAME = {
  'america mineiro': 'america-mg',
  'america': 'america-mg',
  'america futebol clube': 'america-mg',
  'athletic': 'athletic',
  'athletic saf': 'athletic',
  'athletico paranaense': 'athletico-pr',
  'atletico goianiense': 'atletico-go',
  'atletico goianiense saf': 'atletico-go',
  'atletico mineiro': 'atletico-mg',
  'avai': 'avai',
  'bahia': 'bahia',
  'botafogo': 'botafogo',
  'botafogo sp': 'botafogo-sp',
  'ceara': 'ceara',
  'chapecoense': 'chapecoense',
  'corinthians': 'corinthians',
  'coritiba': 'coritiba',
  'coritiba saf': 'coritiba',
  'crb': 'crb',
  'criciuma': 'criciuma',
  'cruzeiro': 'cruzeiro',
  'cuiaba': 'cuiaba',
  'flamengo': 'flamengo',
  'fluminense': 'fluminense',
  'fortaleza': 'fortaleza',
  'fortaleza saf': 'fortaleza',
  'goias': 'goias',
  'gremio': 'gremio',
  'internacional': 'internacional',
  'juventude': 'juventude',
  'londrina': 'londrina',
  'londrina saf': 'londrina',
  'mirassol': 'mirassol',
  'nautico': 'nautico',
  'novorizontino': 'novorizontino',
  'gremio novorizontino saf': 'novorizontino',
  'operario pr': 'operario',
  'operario': 'operario',
  'palmeiras': 'palmeiras',
  'ponte preta': 'ponte-preta',
  'red bull bragantino': 'bragantino',
  'remo': 'remo',
  'santos fc': 'santos',
  'santos': 'santos',
  'sao bernardo': 'sao-bernardo',
  'sao bernardo saf': 'sao-bernardo',
  'sao paulo': 'saopaulo',
  'sport': 'sport',
  'sport recife': 'sport',
  'vasco da gama saf': 'vasco',
  'vasco da gama': 'vasco',
  'vila nova': 'vila-nova',
  'vitoria': 'vitoria',
};

const APP_TEAM_BY_TRANSFERMARKT_NAME = {
  'aa ponte preta': 'ponte-preta',
  'america mineiro': 'america-mg',
  'athletic club': 'athletic',
  'athletico paranaense': 'athletico-pr',
  'atletico goianiense': 'atletico-go',
  'atletico mineiro': 'atletico-mg',
  'avai fc': 'avai',
  'botafogo fc': 'botafogo-sp',
  'botafogo fr': 'botafogo',
  'ceara sc': 'ceara',
  'chapecoense': 'chapecoense',
  'clube do remo': 'remo',
  'coritiba fc': 'coritiba',
  'crb': 'crb',
  'cr flamengo': 'flamengo',
  'cr vasco da gama': 'vasco',
  'criciuma ec': 'criciuma',
  'cruzeiro ec': 'cruzeiro',
  'cuiaba ec': 'cuiaba',
  'ec bahia': 'bahia',
  'ec juventude': 'juventude',
  'ec vitoria': 'vitoria',
  'fluminense fc': 'fluminense',
  'fortaleza ec': 'fortaleza',
  'goias ec': 'goias',
  'gremio fbpa': 'gremio',
  'gremio novorizontino': 'novorizontino',
  'londrina ec': 'londrina',
  'mirassol fc': 'mirassol',
  'nautico': 'nautico',
  'operario fec': 'operario',
  'rb bragantino': 'bragantino',
  'santos fc': 'santos',
  'sao bernardo fc': 'sao-bernardo',
  'sao paulo fc': 'saopaulo',
  'sc corinthians': 'corinthians',
  'sc internacional': 'internacional',
  'se palmeiras': 'palmeiras',
  'sport recife': 'sport',
  'vila nova fc': 'vila-nova',
};

const POSITION_PLAN = [
  ['GOL', 'GK'],
  ['GOL', 'GK'],
  ['ZAG', 'CB'],
  ['ZAG', 'CB'],
  ['ZAG', 'CB'],
  ['LAT', 'RB'],
  ['LAT', 'LB'],
  ['VOL', 'DM'],
  ['VOL', 'DM'],
  ['MEI', 'CM'],
  ['MEI', 'AM'],
  ['MEI', 'AM'],
  ['ATA', 'RW'],
  ['ATA', 'LW'],
  ['ATA', 'ST'],
  ['ATA', 'ST'],
  ['ZAG', 'CB'],
  ['LAT', 'RB'],
  ['VOL', 'DM'],
  ['MEI', 'CM'],
  ['ATA', 'ST'],
];

const POSITION_BY_TRANSFERMARKT_NAME = {
  'goleiro': ['GOL', 'GK'],
  'defensor': ['ZAG', 'CB'],
  'zagueiro': ['ZAG', 'CB'],
  'lateral direito': ['LAT', 'RB'],
  'lateral dir': ['LAT', 'RB'],
  'lateral esquerdo': ['LAT', 'LB'],
  'lateral esq': ['LAT', 'LB'],
  'meia defensivo': ['VOL', 'DM'],
  'volante': ['VOL', 'DM'],
  'meia central': ['MEI', 'CM'],
  'meio campo': ['MEI', 'CM'],
  'meia ofensivo': ['MEI', 'AM'],
  'meia esquerda': ['MEI', 'AM'],
  'meia direita': ['MEI', 'AM'],
  'ponta esquerda': ['ATA', 'LW'],
  'ponta direita': ['ATA', 'RW'],
  'segundo atacante': ['ATA', 'ST'],
  'seg atacante': ['ATA', 'ST'],
  'centroavante': ['ATA', 'ST'],
  'atacante': ['ATA', 'ST'],
};

const POSITION_RATING_BONUS = {
  GK: 0,
  CB: -1,
  RB: -1,
  LB: -1,
  DM: 0,
  CM: 1,
  AM: 2,
  RW: 2,
  LW: 2,
  ST: 2,
};

function normalize(value) {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();
}

function decodeHtml(value) {
  return String(value)
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(value) {
  return decodeHtml(value).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchText(url) {
  if (url.includes('transfermarkt.com.br')) {
    mkdirSync(TM_CACHE_DIR, { recursive: true });
    const cacheKey = normalize(url).replace(/\s+/g, '-').slice(0, 160);
    const cachePath = path.join(TM_CACHE_DIR, `${cacheKey}.html`);
    if (existsSync(cachePath)) return readFileSync(cachePath, 'utf8');

    const html = execFileSync('curl', [
      '-L',
      '-sS',
      '-A',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      '--max-time',
      '45',
      url,
    ], { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
    writeFileSync(cachePath, html);
    return html;
  }

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
        },
      });

      if (response.ok) return response.text();
      lastError = new Error(`HTTP ${response.status} for ${url}`);
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }

    await new Promise(resolve => setTimeout(resolve, 500 * attempt));
  }

  throw lastError;
}

function parseTransfermarktValue(value) {
  const normalized = decodeHtml(value).replace(/\s+/g, ' ').trim();
  if (!normalized || normalized === '-') return undefined;

  const amountMatch = normalized.match(/€\s*([\d,.]+)\s*(bi\.|mil|mi\.)?/i);
  if (!amountMatch) return undefined;

  const amount = Number(amountMatch[1].replace(',', '.'));
  if (!Number.isFinite(amount)) return undefined;

  const unit = (amountMatch[2] || '').toLowerCase();
  if (unit.startsWith('bi')) return Math.round(amount * 1_000_000_000);
  if (unit === 'mil') return Math.round(amount * 1_000);
  if (unit.startsWith('mi')) return Math.round(amount * 1_000_000);
  return Math.round(amount);
}

function positionFromTransfermarkt(positionName, fallbackIndex) {
  const normalized = normalize(decodeHtml(positionName));
  const exact = POSITION_BY_TRANSFERMARKT_NAME[normalized];
  if (exact) return exact;

  if (normalized.includes('goleiro')) return ['GOL', 'GK'];
  if (normalized.includes('zagueiro') || normalized.includes('defensor')) return ['ZAG', 'CB'];
  if (normalized.includes('direito') || normalized.includes(' dir')) return ['LAT', 'RB'];
  if (normalized.includes('esquerdo') || normalized.includes(' esq')) return ['LAT', 'LB'];
  if (normalized.includes('volante') || normalized.includes('defensivo')) return ['VOL', 'DM'];
  if (normalized.includes('ofensivo')) return ['MEI', 'AM'];
  if (normalized.includes('meia') || normalized.includes('meio')) return ['MEI', 'CM'];
  if (normalized.includes('ponta') && normalized.includes('direita')) return ['ATA', 'RW'];
  if (normalized.includes('ponta') && normalized.includes('esquerda')) return ['ATA', 'LW'];
  if (normalized.includes('atacante') || normalized.includes('centroavante')) return ['ATA', 'ST'];

  return POSITION_PLAN[fallbackIndex % POSITION_PLAN.length];
}

function overallFromMarketValue(marketValue, age, mainPos, teamRating, rosterIndex) {
  if (!marketValue) {
    return Math.max(58, Math.min(88, teamRating + 3 - Math.floor(rosterIndex / 4)));
  }

  const millions = marketValue / 1_000_000;
  const valueRating = 61 + Math.log10(Math.max(0.12, millions) * 10) * 10;
  const ageBonus = age <= 20 ? 2 : age <= 23 ? 1 : age >= 34 ? -3 : age >= 31 ? -1 : 0;
  const positionBonus = POSITION_RATING_BONUS[mainPos] ?? 0;

  return Math.max(55, Math.min(94, Math.round(valueRating + ageBonus + positionBonus)));
}

function parseTransfermarktTeams(html) {
  const teams = {};
  const regex = /<td class="hauptlink no-border-links"><a title="([^"]+)" href="[^"]+">[^<]+<\/a>[\s\S]*?<a title="[^"]+" href="([^"]*\/kader\/verein\/\d+\/saison_id\/2025)"/g;
  let match;

  while ((match = regex.exec(html))) {
    const [, title, href] = match;
    const appId = APP_TEAM_BY_TRANSFERMARKT_NAME[normalize(title)];
    if (appId) {
      teams[appId] = `${TM_BASE_URL}${decodeHtml(href)}`;
    }
  }

  return teams;
}

function parseTransfermarktRoster(html) {
  const players = [];
  const blocks = html.split(/<td class="zentriert rueckennummer[^"]*" title="([^"]+)">/).slice(1);

  for (let i = 0; i < blocks.length; i += 2) {
    const broadPosition = blocks[i];
    const block = blocks[i + 1] || '';
    const nameMatch = block.match(/<a href="\/[^"]+\/profil\/spieler\/(\d+)">\s*([\s\S]*?)\s*<\/a>/);
    const detailPositionMatch = block.match(/<\/tr>\s*<tr>\s*<td>\s*([^<]+?)\s*<\/td>\s*<\/tr>/);
    const ageMatch = block.match(/<\/table>\s*<\/td><td class="zentriert">(\d+)<\/td>/);
    const valueMatch = block.match(/<td class="rechts hauptlink">(?:<a [^>]+>)?([^<]+)(?:<\/a>)?<\/td>/);

    if (!nameMatch || !ageMatch) continue;

    const positionName = detailPositionMatch?.[1] || broadPosition;
    const [, playerId, rawName] = nameMatch;
    const name = stripTags(rawName);
    const [pos, mainPos] = positionFromTransfermarkt(positionName, players.length);

    players.push({
      playerId,
      name: decodeHtml(name).trim(),
      normalizedName: normalize(name),
      positionName: decodeHtml(positionName).trim(),
      pos,
      mainPos,
      age: Number(ageMatch[1]),
      marketValue: parseTransfermarktValue(valueMatch?.[1] || '-'),
    });
  }

  return players;
}

function similarityScore(a, b) {
  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.includes(b) || b.includes(a)) return 86;

  const aTokens = new Set(a.split(' ').filter(token => token.length > 2));
  const bTokens = new Set(b.split(' ').filter(token => token.length > 2));
  const overlap = [...aTokens].filter(token => bTokens.has(token)).length;
  return overlap === 0 ? 0 : Math.round((overlap / Math.max(aTokens.size, bTokens.size)) * 75);
}

function findTransfermarktPlayer(athlete, tmPlayers, usedTmPlayerIds) {
  const cbfNames = [
    athlete.Atleta_apelido,
    athlete.atleta_nome,
    `${athlete.Atleta_apelido || ''} ${athlete.atleta_nome || ''}`,
  ].map(normalize).filter(Boolean);

  let bestMatch;
  let bestScore = 0;
  for (const tmPlayer of tmPlayers) {
    if (usedTmPlayerIds.has(tmPlayer.playerId)) continue;
    const score = Math.max(...cbfNames.map(name => similarityScore(name, tmPlayer.normalizedName)));
    if (score > bestScore) {
      bestScore = score;
      bestMatch = tmPlayer;
    }
  }

  if (bestScore < 72 || !bestMatch) return undefined;
  usedTmPlayerIds.add(bestMatch.playerId);
  return { ...bestMatch, matchScore: bestScore };
}

function parseTeams(html, competition) {
  const normalizedHtml = html.replace(/\\"/g, '"');
  const teams = [];
  const regex = /"time_id":"(\d+)","nome_completo":"([^"]+)","nome_popular":"([^"]+)","time_uf":"([^"]+)"/g;
  let match;

  while ((match = regex.exec(normalizedHtml))) {
    const [, cbfId, fullName, popularName, uf] = match;
    const normalizedPopularName = normalize(popularName);
    const appId = normalizedPopularName === 'botafogo' && uf === 'SP'
      ? 'botafogo-sp'
      : APP_TEAM_BY_CBF_NAME[normalizedPopularName];
    if (!appId) {
      console.warn(`Skipping unmapped CBF club: ${popularName}`);
      continue;
    }

    teams.push({
      appId,
      cbfId,
      fullName: decodeHtml(fullName),
      popularName: decodeHtml(popularName),
      uf,
      url: `${BASE_URL}/futebol-brasileiro/times/${competition}/2026/${cbfId}`,
    });
  }

  return teams;
}

function extractJsonArray(html, marker) {
  const normalizedHtml = html.replace(/\\"/g, '"');
  const markerIndex = normalizedHtml.indexOf(marker);
  if (markerIndex === -1) return [];

  const start = normalizedHtml.indexOf('[', markerIndex);
  if (start === -1) return [];

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < normalizedHtml.length; i++) {
    const char = normalizedHtml[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') inString = true;
    else if (char === '[') depth++;
    else if (char === ']') {
      depth--;
      if (depth === 0) {
        return JSON.parse(normalizedHtml.slice(start, i + 1));
      }
    }
  }

  return [];
}

function makePlayerSeed(athlete, index, teamRating, tmPlayer) {
  const [fallbackPos, fallbackMainPos] = POSITION_PLAN[index % POSITION_PLAN.length];
  const pos = tmPlayer?.pos || fallbackPos;
  const mainPos = tmPlayer?.mainPos || fallbackMainPos;
  const age = tmPlayer?.age || (index < 18 ? 24 + (index % 9) : 18 + (index % 8));
  const marketValue = tmPlayer?.marketValue;
  const ovr = overallFromMarketValue(marketValue, age, mainPos, teamRating, index);

  return {
    name: tmPlayer?.name || athlete.Atleta_apelido || athlete.atleta_nome,
    pos,
    mainPos,
    ovr,
    age,
    marketValue,
    source: tmPlayer ? 'CBF+Transfermarkt' : 'CBF+Modelo',
  };
}

function renderRosterFile(rosters, sourceUrls, generatedAt) {
  const body = Object.entries(rosters)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([teamId, players]) => {
      const renderedPlayers = players.map(player => {
        const marketValue = player.marketValue ? `, marketValue: ${player.marketValue}` : '';
        return `    { name: ${JSON.stringify(player.name)}, pos: '${player.pos}', mainPos: '${player.mainPos}', ovr: ${player.ovr}, age: ${player.age}${marketValue}, source: '${player.source}' }`;
      }).join(',\n');

      return `  '${teamId}': [\n${renderedPlayers}\n  ]`;
    })
    .join(',\n');

  return `import { DetailedPosition, Player } from './types';

export type RealBrazilianPlayerSeed = {
  name: string;
  pos: Player['position'];
  mainPos: DetailedPosition;
  ovr: number;
  age: number;
  marketValue?: number;
  source: 'CBF+Transfermarkt' | 'CBF+Modelo';
  foot?: 'LEFT' | 'RIGHT' | 'BOTH';
};

export const ROSTER_DATA_VERSION = ${JSON.stringify(`cbf-tm-${generatedAt.slice(0, 10)}-v5`)};

// Generated from public CBF 2026 competition pages and Transfermarkt 2026 squad pages.
// Source URLs:
${sourceUrls.map(url => `// - ${url}`).join('\n')}
// CBF is the roster/current-club source. Transfermarkt enriches matched players with
// position, age and market value. OVR/stats are gameplay ratings derived from those
// public values, not official player ability data.
export const REAL_BRAZILIAN_PLAYERS: Record<string, RealBrazilianPlayerSeed[]> = {
${body}
};
`;
}

const indexes = await Promise.all(
  COMPETITIONS.map(async competition => {
    const url = `${BASE_URL}/futebol-brasileiro/times/${competition}/2026`;
    return {
      competition,
      html: await fetchText(url),
      url,
    };
  })
);

const teams = indexes.flatMap(({ html, competition }) => parseTeams(html, competition));
const rosters = {};
const sourceUrls = indexes.map(index => index.url);
const tmLeaguePages = await Promise.all(TRANSFERMARKT_LEAGUES.map(async url => ({ url, html: await fetchText(url) })));
const tmTeamUrls = Object.assign({}, ...tmLeaguePages.map(page => parseTransfermarktTeams(page.html)));
const tmRosters = {};
sourceUrls.push(...tmLeaguePages.map(page => page.url));

for (const [teamId, url] of Object.entries(tmTeamUrls)) {
  const html = await fetchText(url);
  tmRosters[teamId] = parseTransfermarktRoster(html);
  sourceUrls.push(url);
  await new Promise(resolve => setTimeout(resolve, 250));
}

for (const team of teams) {
  const html = await fetchText(team.url);
  sourceUrls.push(team.url);

  const athletes = extractJsonArray(html, '"atletas":');
  const currentClubName = normalize(team.popularName);
  const filtered = athletes.filter(athlete => normalize(athlete.clube_nome_popular) === currentClubName);
  const selected = filtered.length >= 16 ? filtered : athletes;

  const teamRating = team.appId.includes('flamengo') || team.appId.includes('palmeiras') ? 86 : 78;
  const usedTmPlayerIds = new Set();
  rosters[team.appId] = selected.map((athlete, index) => {
    const tmPlayer = findTransfermarktPlayer(athlete, tmRosters[team.appId] || [], usedTmPlayerIds);
    return makePlayerSeed(athlete, index, teamRating, tmPlayer);
  });
}

const generatedAt = new Date().toISOString();
mkdirSync(path.join(process.cwd(), 'scratch'), { recursive: true });
writeFileSync(
  path.join(process.cwd(), 'scratch', 'cbf-roster-import.json'),
  JSON.stringify({ generatedAt, teams, rosters }, null, 2)
);
writeFileSync(
  path.join(process.cwd(), 'realBrazilianRosters.ts'),
  renderRosterFile(rosters, sourceUrls, generatedAt)
);

console.log(`Imported ${Object.keys(rosters).length} rosters from CBF.`);
const verifiedCount = Object.values(rosters).flat().filter(player => player.source === 'CBF+Transfermarkt').length;
const totalCount = Object.values(rosters).flat().length;
console.log(`Verified position/age/value: ${verifiedCount}/${totalCount} (${Math.round((verifiedCount / totalCount) * 100)}%).`);
for (const [teamId, players] of Object.entries(rosters).sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`${teamId}: ${players.length}`);
}
