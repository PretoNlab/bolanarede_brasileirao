
import { Team, Player, Fixture } from './types';

const firstNames = ['Lucas', 'Matheus', 'Gabriel', 'Pedro', 'João', 'Felipe', 'Rafael', 'Daniel', 'Bruno', 'Thiago', 'Marcos', 'André', 'Luiz', 'Gustavo', 'Eduardo', 'Caio', 'Enzo', 'Arthur', 'Diego', 'Victor', 'Ruan', 'Igor', 'Breno', 'Talles', 'Yuri'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Almeida', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Martins', 'Araújo', 'Barbosa', 'Ramos', 'Jesus', 'Alves', 'Rocha', 'Nascimento', 'Teixeira', 'Moraes'];

const generatePlayer = (position: Player['position'], baseRating: number): Player => {
  const isProspect = Math.random() > 0.8;
  const age = isProspect ? Math.floor(Math.random() * 4) + 17 : Math.floor(Math.random() * 15) + 21;
  const overall = Math.min(99, Math.max(40, baseRating + Math.floor(Math.random() * 10) - 5));
  const potential = Math.min(99, overall + (isProspect ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 5)));

  let baseValue = Math.pow(overall, 3.2) * 12;
  if (age < 22) baseValue *= 1.4;
  if (age > 31) baseValue *= 0.7;

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    position,
    age,
    overall,
    energy: 100,
    status: 'fit',
    yellowCards: 0,
    redCards: 0,
    marketValue: Math.round(baseValue / 1000) * 1000,
    goals: 0,
    assists: 0,
    potential,
    contractRounds: Math.floor(Math.random() * 20) + 15,
    stats: generateStats(position, overall, age)
  };
};

const generateStats = (pos: Player['position'], ovr: number, age: number) => {
  // Helper to randomize around a base value
  const r = (base: number) => Math.min(99, Math.max(10, base + Math.floor(Math.random() * 14) - 7));

  // Base stats distribution per position
  let stats = { pace: 50, shooting: 50, passing: 50, dribbling: 50, defending: 50, physical: 50, keeping: 10 };

  if (pos === 'GOL') {
    stats = { pace: r(40), shooting: r(20), passing: r(45), dribbling: r(20), defending: r(50), physical: r(ovr * 0.8), keeping: r(ovr) };
  } else if (pos === 'ZAG') {
    stats = { pace: r(55), shooting: r(30), passing: r(60), dribbling: r(40), defending: r(ovr), physical: r(ovr * 0.9), keeping: 10 };
  } else if (pos === 'LAT') {
    stats = { pace: r(ovr * 0.9), shooting: r(50), passing: r(70), dribbling: r(70), defending: r(ovr * 0.85), physical: r(70), keeping: 10 };
  } else if (pos === 'VOL') {
    stats = { pace: r(60), shooting: r(55), passing: r(75), dribbling: r(65), defending: r(ovr * 0.9), physical: r(80), keeping: 10 };
  } else if (pos === 'MEI') {
    stats = { pace: r(70), shooting: r(70), passing: r(ovr), dribbling: r(ovr * 0.95), defending: r(40), physical: r(60), keeping: 10 };
  } else if (pos === 'ATA') {
    stats = { pace: r(80), shooting: r(ovr), passing: r(65), dribbling: r(75), defending: r(25), physical: r(65), keeping: 10 };
  }

  // Age modifiers (older = slower but stronger/smarter)
  if (age > 30) {
    stats.pace -= 10;
    stats.physical -= 5;
    stats.defending += 5;
    stats.passing += 5;
  }


  return stats;
};

const generateRoster = (teamRating: number): Player[] => {
  const roster: Player[] = [];
  ['GOL', 'GOL'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['ZAG', 'ZAG', 'ZAG', 'ZAG'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['LAT', 'LAT', 'LAT', 'LAT'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['VOL', 'VOL', 'VOL', 'VOL'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['MEI', 'MEI', 'MEI', 'MEI'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  ['ATA', 'ATA', 'ATA', 'ATA'].forEach(p => roster.push(generatePlayer(p as any, teamRating)));
  return roster.sort((a, b) => b.overall - a.overall);
};

export const INITIAL_TEAMS: Team[] = [
  // SÉRIE A 2026 (Atualizado com Promoções de 2025: Santos, Mirassol, Sport, Ceará)
  { id: 'botafogo', name: 'Botafogo', shortName: 'BOT', city: 'Rio de Janeiro', logoColor1: 'from-gray-900', logoColor2: 'to-white', attack: 94, defense: 92, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 98, division: 1, stadiumCapacity: 46000, rivalId: 'flamengo' },
  { id: 'palmeiras', name: 'Palmeiras', shortName: 'PAL', city: 'São Paulo', logoColor1: 'from-green-700', logoColor2: 'to-white', attack: 92, defense: 91, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 95, division: 1, stadiumCapacity: 43000, rivalId: 'corinthians' },
  { id: 'flamengo', name: 'Flamengo', shortName: 'FLA', city: 'Rio de Janeiro', logoColor1: 'from-red-600', logoColor2: 'to-black', attack: 91, defense: 89, roster: [], lineup: [], formation: '4-4-2', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 90, division: 1, stadiumCapacity: 78000, rivalId: 'vasco' },
  { id: 'fortaleza', name: 'Fortaleza', shortName: 'FOR', city: 'Fortaleza', logoColor1: 'from-blue-600', logoColor2: 'to-red-600', attack: 89, defense: 88, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 90, division: 1, stadiumCapacity: 63000, rivalId: 'ceara' },
  { id: 'internacional', name: 'Internacional', shortName: 'INT', city: 'Porto Alegre', logoColor1: 'from-red-600', logoColor2: 'to-white', attack: 87, defense: 86, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 1, stadiumCapacity: 50000, rivalId: 'gremio' },
  { id: 'saopaulo', name: 'São Paulo', shortName: 'SAO', city: 'São Paulo', logoColor1: 'from-red-600', logoColor2: 'to-black', attack: 86, defense: 85, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 1, stadiumCapacity: 66000, rivalId: 'corinthians' },
  { id: 'santos', name: 'Santos', shortName: 'SAN', city: 'Santos', logoColor1: 'from-white', logoColor2: 'to-black', attack: 82, defense: 80, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 90, division: 1, stadiumCapacity: 16000, rivalId: 'corinthians' },
  { id: 'bahia', name: 'Bahia', shortName: 'BAH', city: 'Salvador', logoColor1: 'from-blue-600', logoColor2: 'to-red-600', attack: 85, defense: 84, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 1, stadiumCapacity: 48000, rivalId: 'vitoria' },
  { id: 'cruzeiro', name: 'Cruzeiro', shortName: 'CRU', city: 'Belo Horizonte', logoColor1: 'from-blue-700', logoColor2: 'to-white', attack: 85, defense: 84, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 1, stadiumCapacity: 62000, rivalId: 'atletico_mg' },
  { id: 'corinthians', name: 'Corinthians', shortName: 'COR', city: 'São Paulo', logoColor1: 'from-gray-900', logoColor2: 'to-white', attack: 84, defense: 83, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 80, division: 1, stadiumCapacity: 49000, rivalId: 'palmeiras' },
  { id: 'atletico_mg', name: 'Atlético-MG', shortName: 'CAM', city: 'Belo Horizonte', logoColor1: 'from-gray-900', logoColor2: 'to-white', attack: 84, defense: 83, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 80, division: 1, stadiumCapacity: 46000, rivalId: 'cruzeiro' },
  { id: 'vasco', name: 'Vasco da Gama', shortName: 'VAS', city: 'Rio de Janeiro', logoColor1: 'from-gray-900', logoColor2: 'to-white', attack: 82, defense: 81, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 80, division: 1, stadiumCapacity: 21000, rivalId: 'flamengo' },
  { id: 'gremio', name: 'Grêmio', shortName: 'GRE', city: 'Porto Alegre', logoColor1: 'from-blue-500', logoColor2: 'to-black', attack: 82, defense: 81, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 80, division: 1, stadiumCapacity: 55000, rivalId: 'internacional' },
  { id: 'fluminense', name: 'Fluminense', shortName: 'FLU', city: 'Rio de Janeiro', logoColor1: 'from-green-700', logoColor2: 'to-red-700', attack: 81, defense: 80, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 75, division: 1, stadiumCapacity: 78000, rivalId: 'flamengo' },
  { id: 'sport', name: 'Sport', shortName: 'SPT', city: 'Recife', logoColor1: 'from-red-600', logoColor2: 'to-black', attack: 79, defense: 78, roster: [], lineup: [], formation: '4-3-3', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 1, stadiumCapacity: 30000, rivalId: 'nautico' },
  { id: 'bragantino', name: 'RB Bragantino', shortName: 'RBB', city: 'Bragança Paulista', logoColor1: 'from-white', logoColor2: 'to-red-600', attack: 78, defense: 77, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 75, division: 1, stadiumCapacity: 17000 },
  { id: 'ceara', name: 'Ceará', shortName: 'CEA', city: 'Fortaleza', logoColor1: 'from-gray-900', logoColor2: 'to-white', attack: 80, defense: 79, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 1, stadiumCapacity: 63000, rivalId: 'fortaleza' },
  { id: 'mirassol', name: 'Mirassol', shortName: 'MIR', city: 'Mirassol', logoColor1: 'from-yellow-400', logoColor2: 'to-green-600', attack: 76, defense: 75, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 1, stadiumCapacity: 15000 },
  { id: 'vitoria', name: 'Vitória', shortName: 'VIT', city: 'Salvador', logoColor1: 'from-red-600', logoColor2: 'to-black', attack: 77, defense: 76, roster: [], lineup: [], formation: '4-3-3', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 1, stadiumCapacity: 30000, rivalId: 'bahia' },
  { id: 'coritiba', name: 'Coritiba', shortName: 'CFC', city: 'Curitiba', logoColor1: 'from-green-700', logoColor2: 'to-white', attack: 77, defense: 76, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 1, stadiumCapacity: 40000, rivalId: 'athletico_pr' },

  // SÉRIE B 2026 (Rebaixados 2024: Athletico, Atlético-GO, Cuiabá, Criciúma + Remanescentes)
  { id: 'athletico_pr', name: 'Athletico-PR', shortName: 'CAP', city: 'Curitiba', logoColor1: 'from-red-600', logoColor2: 'to-black', attack: 82, defense: 81, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 50, division: 2, stadiumCapacity: 42000, rivalId: 'coritiba' },
  { id: 'atletico_go', name: 'Atlético-GO', shortName: 'ACG', city: 'Goiânia', logoColor1: 'from-red-600', logoColor2: 'to-black', attack: 78, defense: 77, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 50, division: 2, stadiumCapacity: 12000, rivalId: 'goias' },
  { id: 'cuiaba', name: 'Cuiabá', shortName: 'CUI', city: 'Cuiabá', logoColor1: 'from-green-600', logoColor2: 'to-yellow-400', attack: 78, defense: 77, roster: [], lineup: [], formation: '5-4-1', style: 'Ultra-Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 50, division: 2, stadiumCapacity: 44000 },
  { id: 'criciuma', name: 'Criciúma', shortName: 'CRI', city: 'Criciúma', logoColor1: 'from-yellow-400', logoColor2: 'to-black', attack: 78, defense: 77, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 50, division: 2, stadiumCapacity: 19000, rivalId: 'avai' },
  { id: 'juventude', name: 'Juventude', shortName: 'JUV', city: 'Caxias do Sul', logoColor1: 'from-green-600', logoColor2: 'to-white', attack: 76, defense: 75, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 60, division: 2, stadiumCapacity: 19000, rivalId: 'caxias' },
  { id: 'america_mg', name: 'América-MG', shortName: 'AMG', city: 'Belo Horizonte', logoColor1: 'from-green-600', logoColor2: 'to-black', attack: 75, defense: 74, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 2, stadiumCapacity: 23000 },
  { id: 'goias', name: 'Goiás', shortName: 'GOI', city: 'Goiânia', logoColor1: 'from-green-600', logoColor2: 'to-white', attack: 75, defense: 74, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 2, stadiumCapacity: 14000, rivalId: 'atletico_go' },
  { id: 'avai', name: 'Avaí', shortName: 'AVA', city: 'Florianópolis', logoColor1: 'from-blue-500', logoColor2: 'to-white', attack: 74, defense: 73, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 65, division: 2, stadiumCapacity: 17000, rivalId: 'figueirense' },
  { id: 'vila_nova', name: 'Vila Nova', shortName: 'VIL', city: 'Goiânia', logoColor1: 'from-red-600', logoColor2: 'to-white', attack: 73, defense: 72, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 65, division: 2, stadiumCapacity: 11000, rivalId: 'goias' },
  { id: 'ponte_preta', name: 'Ponte Preta', shortName: 'PON', city: 'Campinas', logoColor1: 'from-gray-900', logoColor2: 'to-white', attack: 72, defense: 71, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 2, stadiumCapacity: 10000, rivalId: 'guarani' },
  { id: 'chapecoense', name: 'Chapecoense', shortName: 'CHA', city: 'Chapecó', logoColor1: 'from-green-600', logoColor2: 'to-white', attack: 73, defense: 72, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 2, stadiumCapacity: 22000 },
  { id: 'operario', name: 'Operário-PR', shortName: 'OPE', city: 'Ponta Grossa', logoColor1: 'from-gray-900', logoColor2: 'to-white', attack: 71, defense: 70, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 60, division: 2, stadiumCapacity: 10000 },
  { id: 'crb', name: 'CRB', shortName: 'CRB', city: 'Maceió', logoColor1: 'from-red-600', logoColor2: 'to-white', attack: 71, defense: 70, roster: [], lineup: [], formation: '4-4-2', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 60, division: 2, stadiumCapacity: 17000 },
  { id: 'botafogo_sp', name: 'Botafogo-SP', shortName: 'BSP', city: 'Ribeirão Preto', logoColor1: 'from-red-600', logoColor2: 'to-white', attack: 69, defense: 68, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 55, division: 2, stadiumCapacity: 29000 },
  { id: 'novorizontino', name: 'Novorizontino', shortName: 'NOV', city: 'Novo Horizonte', logoColor1: 'from-yellow-400', logoColor2: 'to-black', attack: 72, defense: 71, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 65, division: 2, stadiumCapacity: 12000 },
  { id: 'londrina', name: 'Londrina', shortName: 'LEC', city: 'Londrina', logoColor1: 'from-blue-400', logoColor2: 'to-white', attack: 68, defense: 67, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 2, stadiumCapacity: 30000 },
  { id: 'nautico', name: 'Náutico', shortName: 'NAU', city: 'Recife', logoColor1: 'from-red-600', logoColor2: 'to-white', attack: 69, defense: 68, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 2, stadiumCapacity: 20000, rivalId: 'sport' },
  { id: 'sao_bernardo', name: 'São Bernardo', shortName: 'SBE', city: 'São Bernardo', logoColor1: 'from-yellow-400', logoColor2: 'to-black', attack: 68, defense: 67, roster: [], lineup: [], formation: '4-4-2', style: 'Defensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 70, division: 2, stadiumCapacity: 15000 },
  { id: 'remo', name: 'Remo', shortName: 'REM', city: 'Belém', logoColor1: 'from-blue-900', logoColor2: 'to-white', attack: 70, defense: 69, roster: [], lineup: [], formation: '4-3-3', style: 'Ofensivo', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 85, division: 2, stadiumCapacity: 13000 },
  { id: 'athletic', name: 'Athletic', shortName: 'ATH', city: 'São João del-Rei', logoColor1: 'from-gray-900', logoColor2: 'to-white', attack: 68, defense: 67, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 65, division: 2, stadiumCapacity: 4000 },

  // FREE AGENTS
  { id: 'free_agent', name: 'Sem Clube', shortName: 'LIV', city: 'Mundo', logoColor1: 'from-gray-500', logoColor2: 'to-gray-700', attack: 70, defense: 70, roster: [], lineup: [], formation: '4-3-3', style: 'Equilibrado', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 50, division: 0, stadiumCapacity: 0 }
];

INITIAL_TEAMS.forEach(team => {
  if (team.id === 'free_agent') {
    // Gerar 30 jogadores variados para Free Agents
    const roster: Player[] = [];
    for (let i = 0; i < 30; i++) {
      const positions = ['GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'];
      const pos = positions[Math.floor(Math.random() * positions.length)];
      const rating = Math.floor(Math.random() * (85 - 55) + 55); // OVR entre 55 e 85
      roster.push(generatePlayer(pos as any, rating));
    }
    team.roster = roster.sort((a, b) => b.overall - a.overall);
  } else {
    const rating = Math.floor((team.attack + team.defense) / 2);
    team.roster = generateRoster(rating);
    team.lineup = team.roster.slice(0, 11).map(p => p.id);
  }
});

export const generateSchedule = (teams: Team[]): Fixture[] => {
  const fixtures: Fixture[] = [];
  const div1Ids = teams.filter(t => t.division === 1).map(t => t.id);
  const div2Ids = teams.filter(t => t.division === 2).map(t => t.id);
  const generateForIds = (ids: string[], startRound: number) => {
    const rotation = [...ids];
    const n = ids.length;
    for (let r = 0; r < n - 1; r++) {
      for (let i = 0; i < n / 2; i++) {
        fixtures.push({ round: startRound + r, homeTeamId: rotation[i], awayTeamId: rotation[n - 1 - i], played: false });
        fixtures.push({ round: startRound + r + (n - 1), homeTeamId: rotation[n - 1 - i], awayTeamId: rotation[i], played: false });
      }
      const last = rotation.pop()!;
      rotation.splice(1, 0, last);
    }
  };
  generateForIds(div1Ids, 1);
  generateForIds(div2Ids, 1);
  return fixtures.sort((a, b) => a.round - b.round);
};
