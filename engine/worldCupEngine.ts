import { Team, Fixture, MatchResult, MatchEvent, WCGroup, WCBracketMatch, WCPhase, WorldCupGameState } from '../types';
import { ESTABLISHED_GROUPS } from '../worldCupData';
import { calculateDynamicTeamStrength } from './tacticsEngine';

// ========== SORTEIO DE GRUPOS ==========

export function generateWorldCupGroups(teams: Team[]): WCGroup[] {
  // Se os grupos já estiverem estabelecidos no worldCupData, use-os
  if (ESTABLISHED_GROUPS && ESTABLISHED_GROUPS.length === 12) {
    return ESTABLISHED_GROUPS.map(g => ({
      name: g.name,
      teamIds: g.teamIds
    }));
  }

  // Fallback para sorteio por potes (caso os estabelecidos falhem)
  const sorted = [...teams].sort((a, b) => (b.attack + b.defense) - (a.attack + a.defense));
  const pot1 = sorted.slice(0, 12);
  const pot2 = sorted.slice(12, 24);
  const pot3 = sorted.slice(24, 36);
  const pot4 = sorted.slice(36, 48);

  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const p1 = shuffle(pot1);
  const p2 = shuffle(pot2);
  const p3 = shuffle(pot3);
  const p4 = shuffle(pot4);

  const groupNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const groups: WCGroup[] = groupNames.map((name, i) => ({
    name,
    teamIds: [p1[i].id, p2[i].id, p3[i].id, p4[i].id],
  }));

  return groups;
}

// ========== FIXTURES DA FASE DE GRUPOS ==========

export function generateGroupFixtures(groups: WCGroup[]): Fixture[] {
  const fixtures: Fixture[] = [];

  groups.forEach(group => {
    const t = group.teamIds;
    // Rodada 1: t[0] vs t[1], t[2] vs t[3]
    fixtures.push({ round: 1, homeTeamId: t[0], awayTeamId: t[1], played: false });
    fixtures.push({ round: 1, homeTeamId: t[2], awayTeamId: t[3], played: false });
    // Rodada 2: t[0] vs t[2], t[1] vs t[3]
    fixtures.push({ round: 2, homeTeamId: t[0], awayTeamId: t[2], played: false });
    fixtures.push({ round: 2, homeTeamId: t[3], awayTeamId: t[1], played: false });
    // Rodada 3: t[0] vs t[3], t[1] vs t[2]
    fixtures.push({ round: 3, homeTeamId: t[1], awayTeamId: t[0], played: false });
    fixtures.push({ round: 3, homeTeamId: t[3], awayTeamId: t[2], played: false });
  });

  return fixtures;
}

// ========== CLASSIFICAÇÃO DO GRUPO ==========

export interface GroupStanding {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
}

export function calculateGroupStandings(group: WCGroup, fixtures: Fixture[]): GroupStanding[] {
  const standings: Record<string, GroupStanding> = {};

  group.teamIds.forEach(id => {
    standings[id] = { teamId: id, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 };
  });

  fixtures
    .filter(f => f.played && group.teamIds.includes(f.homeTeamId) && group.teamIds.includes(f.awayTeamId))
    .forEach(f => {
      const hs = f.homeScore ?? 0;
      const as = f.awayScore ?? 0;
      const home = standings[f.homeTeamId];
      const away = standings[f.awayTeamId];

      home.played++; away.played++;
      home.gf += hs; home.ga += as;
      away.gf += as; away.ga += hs;

      if (hs > as) { home.won++; home.points += 3; away.lost++; }
      else if (hs < as) { away.won++; away.points += 3; home.lost++; }
      else { home.drawn++; away.drawn++; home.points++; away.points++; }

      home.gd = home.gf - home.ga;
      away.gd = away.gf - away.ga;
    });

  return Object.values(standings).sort((a, b) =>
    b.points - a.points || b.gd - a.gd || b.gf - a.gf
  );
}

// ========== MELHORES TERCEIROS COLOCADOS ==========

export function determineBestThirdPlace(groups: WCGroup[], fixtures: Fixture[]): string[] {
  const thirdPlaced: GroupStanding[] = [];

  groups.forEach(group => {
    const standings = calculateGroupStandings(group, fixtures);
    if (standings.length >= 3) thirdPlaced.push(standings[2]);
  });

  // Ordenar terceiros por pontos, saldo, gols
  thirdPlaced.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);

  // Top 8 avançam
  return thirdPlaced.slice(0, 8).map(s => s.teamId);
}

// ========== TIMES CLASSIFICADOS ==========

export function getQualifiedTeams(groups: WCGroup[], fixtures: Fixture[]): string[] {
  const qualified: string[] = [];

  // Top 2 de cada grupo
  groups.forEach(group => {
    const standings = calculateGroupStandings(group, fixtures);
    qualified.push(standings[0].teamId, standings[1].teamId);
  });

  // 8 melhores terceiros
  const bestThirds = determineBestThirdPlace(groups, fixtures);
  qualified.push(...bestThirds);

  return qualified; // 32 times
}

// ========== GERAÇÃO DO BRACKET MATA-MATA ==========

export function generateKnockoutBracket(qualifiedTeamIds: string[]): WCBracketMatch[] {
  const bracket: WCBracketMatch[] = [];
  const shuffled = [...qualifiedTeamIds];
  // Embaralhar para gerar confrontos variados
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Round of 32: 16 jogos
  for (let i = 0; i < 16; i++) {
    bracket.push({
      id: `R32_${i + 1}`,
      phase: 'ROUND_OF_32',
      matchNumber: i + 1,
      team1Id: shuffled[i * 2],
      team2Id: shuffled[i * 2 + 1],
      played: false,
      nextMatchId: `R16_${Math.floor(i / 2) + 1}`,
    });
  }

  // Round of 16: 8 jogos
  for (let i = 0; i < 8; i++) {
    bracket.push({
      id: `R16_${i + 1}`,
      phase: 'ROUND_OF_16',
      matchNumber: i + 1,
      team1Id: null,
      team2Id: null,
      played: false,
      nextMatchId: `QF_${Math.floor(i / 2) + 1}`,
    });
  }

  // Quartas: 4 jogos
  for (let i = 0; i < 4; i++) {
    bracket.push({
      id: `QF_${i + 1}`,
      phase: 'QUARTER',
      matchNumber: i + 1,
      team1Id: null,
      team2Id: null,
      played: false,
      nextMatchId: `SF_${Math.floor(i / 2) + 1}`,
    });
  }

  // Semis: 2 jogos
  for (let i = 0; i < 2; i++) {
    bracket.push({
      id: `SF_${i + 1}`,
      phase: 'SEMI',
      matchNumber: i + 1,
      team1Id: null,
      team2Id: null,
      played: false,
    });
  }

  // Terceiro lugar
  bracket.push({
    id: 'THIRD',
    phase: 'THIRD_PLACE',
    matchNumber: 1,
    team1Id: null,
    team2Id: null,
    played: false,
  });

  // Final
  bracket.push({
    id: 'FINAL',
    phase: 'FINAL',
    matchNumber: 1,
    team1Id: null,
    team2Id: null,
    played: false,
  });

  return bracket;
}

// ========== SIMULAÇÃO DE PARTIDA ==========

export function simulateWCMatch(home: Team, away: Team): { homeScore: number; awayScore: number; events: MatchEvent[] } {
  const events: MatchEvent[] = [];

  const hStats = calculateDynamicTeamStrength(home);
  const aStats = calculateDynamicTeamStrength(away);

  const homePower = (hStats.att - aStats.def) + 5 + (Math.random() * 20 - 10);
  const awayPower = (aStats.att - hStats.def) + (Math.random() * 20 - 10);

  const homeExpected = Math.max(0.3, 1.25 + (homePower * 0.04));
  const awayExpected = Math.max(0.3, 1.25 + (awayPower * 0.04));

  let homeScore = 0;
  let awayScore = 0;

  for (let i = 0; i < 6; i++) {
    if (Math.random() < homeExpected / 6) {
      homeScore++;
      const minute = Math.floor(Math.random() * 90) + 1;
      const roster = home.roster.filter(p => p.position === 'ATA' || p.position === 'MEI');
      const scorer = (roster.length > 0 ? roster[Math.floor(Math.random() * roster.length)] : home.roster[0]);
      
      if (!scorer) continue; // Pular gol se não houver jogadores válidos

      // Assist logic
      let assistName: string | undefined;
      if (Math.random() < 0.75) {
        const potentialAssisters = home.roster.filter(p => p.name !== scorer.name && (p.position === 'MEI' || p.position === 'LAT' || p.position === 'ATA'));
        if (potentialAssisters.length > 0) {
          assistName = potentialAssisters[Math.floor(Math.random() * potentialAssisters.length)].name;
        }
      }

      events.push({ 
        minute, 
        type: 'goal', 
        teamId: home.id, 
        playerName: scorer.name, 
        assistName,
        description: `GOL! ${scorer.name} marca para ${home.shortName}!${assistName ? ` (Assist: ${assistName})` : ''}` 
      });
    }
    if (Math.random() < awayExpected / 6) {
      awayScore++;
      const minute = Math.floor(Math.random() * 90) + 1;
      const roster = away.roster.filter(p => p.position === 'ATA' || p.position === 'MEI');
      const scorer = (roster.length > 0 ? roster[Math.floor(Math.random() * roster.length)] : away.roster[0]);

      if (!scorer) continue; // Pular gol se não houver jogadores válidos

      // Assist logic
      let assistName: string | undefined;
      if (Math.random() < 0.75) {
        const potentialAssisters = away.roster.filter(p => p.name !== scorer.name && (p.position === 'MEI' || p.position === 'LAT' || p.position === 'ATA'));
        if (potentialAssisters.length > 0) {
          assistName = potentialAssisters[Math.floor(Math.random() * potentialAssisters.length)].name;
        }
      }

      events.push({ 
        minute, 
        type: 'goal', 
        teamId: away.id, 
        playerName: scorer.name, 
        assistName,
        description: `GOL! ${scorer.name} marca para ${away.shortName}!${assistName ? ` (Assist: ${assistName})` : ''}` 
      });
    }
  }

  // Cartões
  home.roster.slice(0, 14).forEach(p => {
    if (Math.random() < 0.06) {
      const minute = Math.floor(Math.random() * 90) + 1;
      events.push({ minute, type: 'card_yellow', teamId: home.id, playerName: p.name, description: `Cartão amarelo para ${p.name}` });
    }
  });
  away.roster.slice(0, 14).forEach(p => {
    if (Math.random() < 0.06) {
      const minute = Math.floor(Math.random() * 90) + 1;
      events.push({ minute, type: 'card_yellow', teamId: away.id, playerName: p.name, description: `Cartão amarelo para ${p.name}` });
    }
  });

  events.sort((a, b) => a.minute - b.minute);

  return { homeScore, awayScore, events };
}

// ========== SIMULAÇÃO DE PÊNALTIS ==========

export function simulatePenalties(team1: Team, team2: Team): { score1: number; score2: number } {
  let s1 = 0, s2 = 0;
  const gk1 = team1.roster.find(p => p.position === 'GOL');
  const gk2 = team2.roster.find(p => p.position === 'GOL');
  const gk1Skill = gk1 ? gk1.overall / 100 : 0.5;
  const gk2Skill = gk2 ? gk2.overall / 100 : 0.5;

  // 5 cobranças cada
  for (let i = 0; i < 5; i++) {
    if (Math.random() > gk2Skill * 0.3) s1++;
    if (Math.random() > gk1Skill * 0.3) s2++;
  }

  // Morte súbita se empate
  while (s1 === s2) {
    if (Math.random() > gk2Skill * 0.3) s1++; else s1 += 0;
    if (Math.random() > gk1Skill * 0.3) s2++; else s2 += 0;
    if (s1 !== s2) break;
    // Se os dois acertam ou erram, mais uma rodada
    if (s1 === s2) {
      const r1 = Math.random() > gk2Skill * 0.35;
      const r2 = Math.random() > gk1Skill * 0.35;
      if (r1 && !r2) { s1++; break; }
      if (!r1 && r2) { s2++; break; }
      if (r1 && r2) { s1++; s2++; }
    }
  }

  return { score1: s1, score2: s2 };
}

// ========== AVANÇAR NO BRACKET ==========

export function advanceBracket(bracket: WCBracketMatch[], matchId: string, winnerId: string): WCBracketMatch[] {
  const updated = bracket.map(m => ({ ...m }));
  const match = updated.find(m => m.id === matchId);
  if (!match) return updated;

  // Se é semifinal, os perdedores vão para a disputa de 3º lugar
  if (match.phase === 'SEMI') {
    const loserId = match.team1Id === winnerId ? match.team2Id : match.team1Id;
    const thirdPlace = updated.find(m => m.id === 'THIRD');
    if (thirdPlace) {
      if (!thirdPlace.team1Id) thirdPlace.team1Id = loserId;
      else if (!thirdPlace.team2Id) thirdPlace.team2Id = loserId;
    }

    const final = updated.find(m => m.id === 'FINAL');
    if (final) {
      if (!final.team1Id) final.team1Id = winnerId;
      else if (!final.team2Id) final.team2Id = winnerId;
    }
    return updated;
  }

  // Para outras fases, avançar vencedor para o próximo jogo
  if (match.nextMatchId) {
    const next = updated.find(m => m.id === match.nextMatchId);
    if (next) {
      if (!next.team1Id) next.team1Id = winnerId;
      else if (!next.team2Id) next.team2Id = winnerId;
    }
  }

  return updated;
}

// ========== PROCESSAR RODADA DA COPA ==========

export function processWCMatchday(state: WorldCupGameState): WorldCupGameState {
  const newState = {
    ...state,
    fixtures: state.fixtures.map(f => ({ ...f })),
    teams: state.teams.map(t => ({ ...t, roster: t.roster.map(p => ({ ...p })) })),
    matchHistory: [...state.matchHistory],
    bracket: state.bracket.map(m => ({ ...m })),
  };

  if (state.currentPhase === 'GROUP') {
    // Simular todas as partidas da rodada atual (exceto do usuário, que já foi jogada)
    const roundFixtures = newState.fixtures.filter(f => f.round === state.currentMatchday && !f.played);

    roundFixtures.forEach(fixture => {
      const home = newState.teams.find(t => t.id === fixture.homeTeamId);
      const away = newState.teams.find(t => t.id === fixture.awayTeamId);
      if (!home || !away) return;

      const result = simulateWCMatch(home, away);
      fixture.played = true;
      fixture.homeScore = result.homeScore;
      fixture.awayScore = result.awayScore;

      // Atualizar stats do time
      home.played++; away.played++;
      home.gf += result.homeScore; home.ga += result.awayScore;
      away.gf += result.awayScore; away.ga += result.homeScore;

      if (result.homeScore > result.awayScore) {
        home.won++; home.points += 3; away.lost++;
      } else if (result.homeScore < result.awayScore) {
        away.won++; away.points += 3; home.lost++;
      } else {
        home.drawn++; away.drawn++; home.points++; away.points++;
      }

      newState.matchHistory.push({
        round: state.currentMatchday,
        homeTeamId: home.id,
        awayTeamId: away.id,
        homeTeamName: home.name,
        awayTeamName: away.name,
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        isUserMatch: false,
        events: result.events,
      });
    });

    // Avançar para próxima rodada ou fase
    if (state.currentMatchday >= 3) {
      // Fase de grupos encerrada, gerar bracket
      const qualified = getQualifiedTeams(newState.groups, newState.fixtures);
      const userQualified = qualified.includes(state.userTeamId);

      newState.bracket = generateKnockoutBracket(qualified);
      newState.currentPhase = 'ROUND_OF_32';
      newState.currentMatchday = 1;
      newState.isEliminated = !userQualified;
    } else {
      newState.currentMatchday = state.currentMatchday + 1;
    }
  } else if (state.currentPhase !== 'FINISHED') {
    // Mata-mata: simular todas as partidas da fase atual (exceto do usuário)
    const currentPhaseMatches = newState.bracket.filter(m => m.phase === state.currentPhase && !m.played);

    currentPhaseMatches.forEach(match => {
      if (!match.team1Id || !match.team2Id) return;

      const team1 = newState.teams.find(t => t.id === match.team1Id);
      const team2 = newState.teams.find(t => t.id === match.team2Id);
      if (!team1 || !team2) return;

      const result = simulateWCMatch(team1, team2);
      match.played = true;
      match.score1 = result.homeScore;
      match.score2 = result.awayScore;

      let winnerId: string;
      if (result.homeScore === result.awayScore) {
        const pens = simulatePenalties(team1, team2);
        match.penalties1 = pens.score1;
        match.penalties2 = pens.score2;
        winnerId = pens.score1 > pens.score2 ? match.team1Id! : match.team2Id!;
      } else {
        winnerId = result.homeScore > result.awayScore ? match.team1Id! : match.team2Id!;
      }

      match.winnerId = winnerId;
      newState.bracket = advanceBracket(newState.bracket, match.id, winnerId);

      newState.matchHistory.push({
        round: 100, // Mata-mata
        homeTeamName: team1.name,
        awayTeamName: team2.name,
        homeScore: result.homeScore,
        awayScore: result.awayScore,
        isUserMatch: false,
        events: result.events,
      });
    });

    // Avançar fase
    const nextPhaseMap: Record<string, WCPhase> = {
      'ROUND_OF_32': 'ROUND_OF_16',
      'ROUND_OF_16': 'QUARTER',
      'QUARTER': 'SEMI',
      'SEMI': 'THIRD_PLACE',
      'THIRD_PLACE': 'FINAL',
      'FINAL': 'FINISHED',
    };
    newState.currentPhase = nextPhaseMap[state.currentPhase] || 'FINISHED';
    newState.currentMatchday = 1;
  }

  return newState;
}

// ========== ENCONTRAR PRÓXIMO JOGO DO USUÁRIO ==========

export function findUserNextMatch(state: WorldCupGameState): { fixture?: Fixture; bracketMatch?: WCBracketMatch; opponent?: Team } | null {
  const { userTeamId, currentPhase, fixtures, bracket, teams } = state;

  if (state.isEliminated) return null;

  if (currentPhase === 'GROUP') {
    const fixture = fixtures.find(f =>
      !f.played && f.round === state.currentMatchday &&
      (f.homeTeamId === userTeamId || f.awayTeamId === userTeamId)
    );
    if (fixture) {
      const opponentId = fixture.homeTeamId === userTeamId ? fixture.awayTeamId : fixture.homeTeamId;
      const opponent = teams.find(t => t.id === opponentId);
      return { fixture, opponent };
    }
  } else if (currentPhase !== 'FINISHED') {
    const bracketMatch = bracket.find(m =>
      m.phase === currentPhase && !m.played &&
      (m.team1Id === userTeamId || m.team2Id === userTeamId)
    );
    if (bracketMatch) {
      const opponentId = bracketMatch.team1Id === userTeamId ? bracketMatch.team2Id : bracketMatch.team1Id;
      const opponent = teams.find(t => t.id === opponentId!);
      return { bracketMatch, opponent };
    }
  }

  return null;
}

// ========== LABELS DE FASE ==========

export const PHASE_LABELS: Record<WCPhase, string> = {
  GROUP: 'Fase de Grupos',
  ROUND_OF_32: 'Segunda Fase (32 avos)',
  ROUND_OF_16: 'Oitavas de Final',
  QUARTER: 'Quartas de Final',
  SEMI: 'Semifinal',
  THIRD_PLACE: 'Disputa de 3º Lugar',
  FINAL: 'Grande Final',
  FINISHED: 'Encerrado',
};

export interface PlayerStat {
  name: string;
  teamShort: string;
  value: number;
}

export function getTournamentStats(matchHistory: MatchResult[]) {
  const scorerMap: Record<string, { name: string, teamShort: string, value: number }> = {};
  const assisterMap: Record<string, { name: string, teamShort: string, value: number }> = {};

  matchHistory.forEach(match => {
    match.events?.forEach(e => {
      // Determine team display name for the event
      const teamShort = e.teamId === match.homeTeamId ? match.homeTeamName : match.awayTeamName;
      
      if (e.type === 'goal') {
        // Track goals
        if (e.playerName) {
          if (!scorerMap[e.playerName]) {
            scorerMap[e.playerName] = { name: e.playerName, teamShort: teamShort || '', value: 0 };
          }
          scorerMap[e.playerName].value++;
        }

        // Track assists
        if (e.assistName) {
          if (!assisterMap[e.assistName]) {
            assisterMap[e.assistName] = { name: e.assistName, teamShort: teamShort || '', value: 0 };
          }
          assisterMap[e.assistName].value++;
        }
      }
    });
  });

  const topScorers = Object.values(scorerMap).sort((a, b) => b.value - a.value).slice(0, 10);
  const topAssisters = Object.values(assisterMap).sort((a, b) => b.value - a.value).slice(0, 10);

  return { topScorers, topAssisters };
}
