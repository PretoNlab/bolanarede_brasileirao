import { Team, Fixture, ContinentalGroup, ContinentalMatch, ContinentalTournamentState, ContinentalSeasonState, ContinentalTournamentType, ContinentalPhase } from '../types';
import { SOUTH_AMERICAN_FOREIGN_CLUBS } from '../southAmericaData';
import { CONTINENTAL_2026_EXTRA_CLUBS, CONTINENTAL_2026_GROUPS } from '../continental2026Data';

const GROUP_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const PRIZE_MONEY = {
  GROUP: 3000000,
  ROUND_OF_16: 1250000,
  QUARTER: 1700000,
  SEMI: 2300000,
  FINAL: 4000000,
  RUNNER_UP: 7000000,
  WINNER: 23000000,
};

function getForeignTeams(): Team[] {
  return SOUTH_AMERICAN_FOREIGN_CLUBS.map(t => ({
    ...t,
    instructions: { pressing: 'MEDIA' as const, passing: 'MISTO' as const, tempo: 'PADRAO' as const }
  }));
}

// Only reached if the real club roster (South America + qualified Brazilian
// clubs) still can't fill 32 slots. Clones are clearly numbered so they never
// masquerade as a real, distinct club.
function fillWithClones(pool: Team[], seeds: Team[], tag: 'lib' | 'sud') {
  if (seeds.length === 0) return;

  while (pool.length < 32) {
    const seed = seeds[pool.length % seeds.length];
    pool.push({
      ...seed,
      id: `${seed.id}-${tag}-${pool.length}`,
      name: `${seed.name} ${Math.floor(pool.length / seeds.length) + 1}`
    });
  }
}

function getBaseTeamId(id: string) {
  return id.replace(/-(lib|sud)-\d+$/, '');
}

function findContinentalTeam(teamId: string, allTeams: Team[]) {
  const foreignTeams = getForeignTeams();
  const allKnownTeams = [...allTeams, ...foreignTeams, ...CONTINENTAL_2026_EXTRA_CLUBS];
  return allKnownTeams.find(t => t.id === teamId) || allKnownTeams.find(t => t.id === getBaseTeamId(teamId));
}

function simulateContinentalGoals(team: Team | undefined, opponent: Team | undefined, isHome: boolean) {
  const attack = team?.attack ?? 74;
  const opponentDefense = opponent?.defense ?? 74;
  const moral = team?.moral ?? 70;
  const homeBonus = isHome ? 0.22 : 0;
  const expected = Math.max(0.35, 1.15 + (attack - opponentDefense) * 0.045 + (moral - 70) * 0.01 + homeBonus);

  let goals = 0;
  for (let i = 0; i < 5; i++) {
    if (Math.random() < expected / 5) goals++;
  }
  return goals;
}

export function initializeContinentalTournaments(
  allTeams: Team[],
  userTeamId: string | null,
  rankedSerieATeamIds: string[] = [],
  season = 2026
): ContinentalSeasonState {
  const foreignTeams = getForeignTeams();

  if (season === 2026) {
    return initializeOfficial2026Tournaments(allTeams, foreignTeams, userTeamId);
  }

  const serieATeams = allTeams.filter(t => t.division === 1);
  const rankIndex = new Map(rankedSerieATeamIds.map((id, index) => [id, index]));
  const sortedSerieA = [...serieATeams].sort((a, b) => {
    const rankA = rankIndex.get(a.id);
    const rankB = rankIndex.get(b.id);
    if (rankA !== undefined && rankB !== undefined) return rankA - rankB;
    if (rankA !== undefined) return -1;
    if (rankB !== undefined) return 1;
    return b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga);
  });

  // Libertadores Teams (6 Brazilian + up to 26 Foreign)
  const libBrazilian = sortedSerieA.length >= 6 ? sortedSerieA.slice(0, 6) : sortedSerieA;
  const sudBrazilian = sortedSerieA.length >= 12 ? sortedSerieA.slice(6, 12) : sortedSerieA.slice(Math.min(6, sortedSerieA.length));

  // Split the real foreign clubs into two disjoint groups (strongest go to
  // Libertadores) so the same club never plays both continental cups in the
  // same season. Only fabricate numbered clones once this real pool runs out.
  const sortedForeign = [...foreignTeams].sort((a, b) => (b.attack + b.defense) - (a.attack + a.defense));
  const libForeignSlots = Math.max(0, 32 - libBrazilian.length);
  const libForeign = sortedForeign.slice(0, libForeignSlots);
  const sudForeignPool = sortedForeign.slice(libForeign.length);

  const libPool = [...libBrazilian, ...libForeign];
  fillWithClones(libPool, libForeign.length > 0 ? libForeign : sortedForeign, 'lib');

  const sudForeignSlots = Math.max(0, 32 - sudBrazilian.length);
  const sudForeign = sudForeignPool.slice(0, sudForeignSlots);
  const sudPool = [...sudBrazilian, ...sudForeign];
  fillWithClones(sudPool, sudForeign.length > 0 ? sudForeign : sortedForeign, 'sud');

  const libTournament = createTournament('LIBERTADORES', 'Copa Libertadores', libPool);
  const sudTournament = createTournament('SUDAMERICANA', 'Copa Sul-Americana', sudPool);

  let userQual: ContinentalSeasonState['userQualification'] = undefined;

  const inLib = libTournament.qualifiedTeamIds.includes(userTeamId || '');
  if (inLib) {
    const grp = libTournament.groups.find(g => g.teamIds.includes(userTeamId || ''));
    userQual = { tournament: 'LIBERTADORES', groupName: grp?.name };
  } else {
    const inSud = sudTournament.qualifiedTeamIds.includes(userTeamId || '');
    if (inSud) {
      const grp = sudTournament.groups.find(g => g.teamIds.includes(userTeamId || ''));
      userQual = { tournament: 'SUDAMERICANA', groupName: grp?.name };
    }
  }

  return {
    libertadores: libTournament,
    sudamericana: sudTournament,
    userQualification: userQual
  };
}

function initializeOfficial2026Tournaments(
  allTeams: Team[],
  foreignTeams: Team[],
  userTeamId: string | null
): ContinentalSeasonState {
  const knownTeams = [...allTeams, ...foreignTeams, ...CONTINENTAL_2026_EXTRA_CLUBS];
  const knownById = new Map(knownTeams.map(team => [team.id, team]));

  const createOfficialTournament = (type: ContinentalTournamentType, name: string) => {
    const groupIds = CONTINENTAL_2026_GROUPS[type];
    const missingIds = groupIds.flat().filter(id => !knownById.has(id));
    if (missingIds.length > 0) {
      throw new Error(`Clubes continentais 2026 ausentes: ${missingIds.join(', ')}`);
    }

    return createTournament(type, name, groupIds.flat().map(id => knownById.get(id)!), true);
  };

  const libertadores = createOfficialTournament('LIBERTADORES', 'CONMEBOL Libertadores 2026');
  const sudamericana = createOfficialTournament('SUDAMERICANA', 'CONMEBOL Sul-Americana 2026');
  let userQualification: ContinentalSeasonState['userQualification'];

  for (const tournament of [libertadores, sudamericana]) {
    const group = tournament.groups.find(item => item.teamIds.includes(userTeamId || ''));
    if (group) {
      userQualification = { tournament: tournament.type, groupName: group.name };
      break;
    }
  }

  return { libertadores, sudamericana, userQualification };
}

function createTournament(
  type: ContinentalTournamentType,
  name: string,
  pool: Team[],
  preserveOrder = false
): ContinentalTournamentState {
  const qualifiedTeamIds = preserveOrder
    ? pool.map(team => team.id)
    : [...pool].sort(() => Math.random() - 0.5).map(team => team.id);

  const groups: ContinentalGroup[] = GROUP_NAMES.map((gName, idx) => ({
    name: gName,
    teamIds: qualifiedTeamIds.slice(idx * 4, (idx + 1) * 4)
  }));

  const groupFixtures: Fixture[] = [];
  groups.forEach(g => {
    const [t1, t2, t3, t4] = g.teamIds;
    // Matchday 1
    groupFixtures.push({ round: 1, homeTeamId: t1, awayTeamId: t2, played: false });
    groupFixtures.push({ round: 1, homeTeamId: t3, awayTeamId: t4, played: false });
    // Matchday 2
    groupFixtures.push({ round: 2, homeTeamId: t2, awayTeamId: t3, played: false });
    groupFixtures.push({ round: 2, homeTeamId: t4, awayTeamId: t1, played: false });
    // Matchday 3
    groupFixtures.push({ round: 3, homeTeamId: t1, awayTeamId: t3, played: false });
    groupFixtures.push({ round: 3, homeTeamId: t2, awayTeamId: t4, played: false });
    // Matchday 4
    groupFixtures.push({ round: 4, homeTeamId: t2, awayTeamId: t1, played: false });
    groupFixtures.push({ round: 4, homeTeamId: t4, awayTeamId: t3, played: false });
    // Matchday 5
    groupFixtures.push({ round: 5, homeTeamId: t3, awayTeamId: t2, played: false });
    groupFixtures.push({ round: 5, homeTeamId: t1, awayTeamId: t4, played: false });
    // Matchday 6
    groupFixtures.push({ round: 6, homeTeamId: t3, awayTeamId: t1, played: false });
    groupFixtures.push({ round: 6, homeTeamId: t4, awayTeamId: t2, played: false });
  });

  return {
    type,
    name,
    groups,
    groupFixtures,
    bracket: [],
    currentPhase: 'GROUPS',
    currentMatchday: 1,
    qualifiedTeamIds,
    totalPrizePool: PRIZE_MONEY.GROUP
  };
}

export function calculateContinentalGroupStandings(group: ContinentalGroup, fixtures: Fixture[]) {
  const standings = group.teamIds.map(id => ({
    teamId: id,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0
  }));

  const map = new Map(standings.map(s => [s.teamId, s]));

  fixtures
    .filter(f => f.played && group.teamIds.includes(f.homeTeamId) && group.teamIds.includes(f.awayTeamId))
    .forEach(f => {
      const h = map.get(f.homeTeamId);
      const a = map.get(f.awayTeamId);
      if (!h || !a) return;

      const hs = f.homeScore ?? 0;
      const as = f.awayScore ?? 0;

      h.played++; a.played++;
      h.gf += hs; h.ga += as;
      a.gf += as; a.ga += hs;

      if (hs > as) { h.won++; h.points += 3; a.lost++; }
      else if (hs < as) { a.won++; a.points += 3; h.lost++; }
      else { h.drawn++; a.drawn++; h.points++; a.points++; }

      h.gd = h.gf - h.ga;
      a.gd = a.gf - a.ga;
    });

  return standings.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
}

export function generateKnockoutBracket(tournament: ContinentalTournamentState): ContinentalMatch[] {
  const winners: string[] = [];
  const runnersUp: string[] = [];

  tournament.groups.forEach(g => {
    const st = calculateContinentalGroupStandings(g, tournament.groupFixtures);
    if (st.length >= 2) {
      winners.push(st[0].teamId);
      runnersUp.push(st[1].teamId);
    }
  });

  const matches: ContinentalMatch[] = [];
  for (let i = 0; i < 8; i++) {
    matches.push({
      id: `r16-${i + 1}`,
      phase: 'ROUND_OF_16',
      matchNumber: i + 1,
      team1Id: winners[i],
      team2Id: runnersUp[7 - i],
      playedLeg1: false,
      playedLeg2: false
    });
  }

  return matches;
}

function generateSudamericanaPlayoffs(
  sudamericana: ContinentalTournamentState,
  libertadores: ContinentalTournamentState
): ContinentalMatch[] {
  const sudRunnersUp = sudamericana.groups.map(group =>
    calculateContinentalGroupStandings(group, sudamericana.groupFixtures)[1]?.teamId
  );
  const libThirdPlaces = libertadores.groups.map(group =>
    calculateContinentalGroupStandings(group, libertadores.groupFixtures)[2]?.teamId
  );

  return sudRunnersUp.map((team1Id, index) => ({
    id: `playoff-${index + 1}`,
    phase: 'PLAYOFF' as const,
    matchNumber: index + 1,
    team1Id: team1Id || null,
    team2Id: libThirdPlaces[7 - index] || null,
    playedLeg1: false,
    playedLeg2: false,
  }));
}

function createKnockoutRound(
  tournament: ContinentalTournamentState,
  phase: ContinentalMatch['phase'],
  teamIds: string[]
): ContinentalMatch[] {
  const prefix = `${tournament.type.toLowerCase()}-${phase.toLowerCase()}`;
  const matches: ContinentalMatch[] = [];

  for (let index = 0; index < teamIds.length; index += 2) {
    matches.push({
      id: `${prefix}-${index / 2 + 1}`,
      phase,
      matchNumber: index / 2 + 1,
      team1Id: teamIds[index] || null,
      team2Id: teamIds[index + 1] || null,
      playedLeg1: false,
      playedLeg2: false,
    });
  }

  return matches;
}

function simulatePenaltyShootout() {
  let score1 = 3 + Math.floor(Math.random() * 3);
  let score2 = 3 + Math.floor(Math.random() * 3);
  while (score1 === score2) {
    if (Math.random() >= 0.5) score1++;
    else score2++;
  }
  return [score1, score2] as const;
}

function resolveMatchWinner(match: ContinentalMatch, singleLeg: boolean) {
  const aggregate1 = (match.score1Leg1 ?? 0) + (singleLeg ? 0 : match.score1Leg2 ?? 0);
  const aggregate2 = (match.score2Leg1 ?? 0) + (singleLeg ? 0 : match.score2Leg2 ?? 0);

  if (aggregate1 > aggregate2) return { ...match, winnerId: match.team1Id || undefined };
  if (aggregate2 > aggregate1) return { ...match, winnerId: match.team2Id || undefined };

  const [penalties1, penalties2] = simulatePenaltyShootout();
  return {
    ...match,
    penalties1,
    penalties2,
    winnerId: penalties1 > penalties2 ? match.team1Id || undefined : match.team2Id || undefined,
  };
}

function simulateKnockoutLeg(
  match: ContinentalMatch,
  allTeams: Team[],
  leg: 1 | 2,
  singleLeg = false
): ContinentalMatch {
  if (!match.team1Id || !match.team2Id) return match;

  const team1 = findContinentalTeam(match.team1Id, allTeams);
  const team2 = findContinentalTeam(match.team2Id, allTeams);

  if (leg === 1) {
    const simulated = {
      ...match,
      score1Leg1: simulateContinentalGoals(team1, team2, !singleLeg),
      score2Leg1: simulateContinentalGoals(team2, team1, false),
      playedLeg1: true,
      playedLeg2: singleLeg,
    };
    return singleLeg ? resolveMatchWinner(simulated, true) : simulated;
  }

  return resolveMatchWinner({
    ...match,
    score1Leg2: simulateContinentalGoals(team1, team2, false),
    score2Leg2: simulateContinentalGoals(team2, team1, true),
    playedLeg2: true,
  }, false);
}

function getAdvancePrize(phase: ContinentalMatch['phase'], won: boolean) {
  if (phase === 'FINAL') return won ? PRIZE_MONEY.WINNER : PRIZE_MONEY.RUNNER_UP;
  if (!won) return 0;
  if (phase === 'PLAYOFF') return PRIZE_MONEY.ROUND_OF_16;
  if (phase === 'ROUND_OF_16') return PRIZE_MONEY.QUARTER;
  if (phase === 'QUARTER') return PRIZE_MONEY.SEMI;
  if (phase === 'SEMI') return PRIZE_MONEY.FINAL;
  return 0;
}

function advanceGroupMatchday(
  tournament: ContinentalTournamentState,
  allTeams: Team[],
  userTeamId: string | null
): { tournament: ContinentalTournamentState; prize: number; userPlayed: boolean; userEliminated: boolean; champion?: string } {
  if (tournament.currentPhase !== 'GROUPS' || tournament.currentMatchday > 6) {
    return { tournament, prize: 0, userPlayed: false, userEliminated: false, champion: undefined as string | undefined };
  }

  let userPlayed = false;
  const currentMatchday = tournament.currentMatchday;
  const groupFixtures = tournament.groupFixtures.map(fixture => {
    if (fixture.round !== currentMatchday || fixture.played) return fixture;

    const home = findContinentalTeam(fixture.homeTeamId, allTeams);
    const away = findContinentalTeam(fixture.awayTeamId, allTeams);
    const homeScore = simulateContinentalGoals(home, away, true);
    const awayScore = simulateContinentalGoals(away, home, false);

    if (userTeamId && (fixture.homeTeamId === userTeamId || fixture.awayTeamId === userTeamId)) {
      userPlayed = true;
    }

    return {
      ...fixture,
      played: true,
      homeScore,
      awayScore
    };
  });

  const nextMatchday = currentMatchday + 1;
  const groupsFinished = nextMatchday > 6;
  const updatedTournament: ContinentalTournamentState = {
    ...tournament,
    groupFixtures,
    currentMatchday: nextMatchday,
    currentPhase: groupsFinished
      ? (tournament.type === 'SUDAMERICANA' ? ('PLAYOFF' as ContinentalPhase) : ('ROUND_OF_16' as ContinentalPhase))
      : tournament.currentPhase,
    bracket: groupsFinished && tournament.type === 'LIBERTADORES'
      ? generateKnockoutBracket({ ...tournament, groupFixtures })
      : tournament.bracket
  };

  const prize = userPlayed && currentMatchday === 1 ? PRIZE_MONEY.GROUP : 0;
  let userEliminated = false;
  if (groupsFinished && userTeamId) {
    const userGroup = updatedTournament.groups.find(group => group.teamIds.includes(userTeamId));
    if (userGroup) {
      const position = calculateContinentalGroupStandings(userGroup, groupFixtures)
        .findIndex(standing => standing.teamId === userTeamId);
      userEliminated = tournament.type === 'LIBERTADORES' ? position >= 3 : position >= 2;
    }
  }

  return { tournament: updatedTournament, prize, userPlayed, userEliminated, champion: undefined as string | undefined };
}

function advanceKnockoutStage(
  tournament: ContinentalTournamentState,
  allTeams: Team[],
  userTeamId: string | null
): { tournament: ContinentalTournamentState; prize: number; userPlayed: boolean; userEliminated: boolean; champion?: string } {
  if (tournament.currentPhase === 'GROUPS' || tournament.currentPhase === 'FINISHED' || tournament.bracket.length === 0) {
    return { tournament, prize: 0, userPlayed: false, userEliminated: false, champion: undefined as string | undefined };
  }

  const phase = tournament.currentPhase;
  const singleLeg = phase === 'FINAL';
  const playingFirstLeg = tournament.bracket.some(match => !match.playedLeg1);
  const playingSecondLeg = !singleLeg && !playingFirstLeg && tournament.bracket.some(match => !match.playedLeg2);
  const userPlayed = Boolean(userTeamId && tournament.bracket.some(
    match => match.team1Id === userTeamId || match.team2Id === userTeamId
  ));

  if (!playingFirstLeg && !playingSecondLeg) {
    return { tournament, prize: 0, userPlayed: false, userEliminated: false, champion: undefined as string | undefined };
  }

  const bracket = tournament.bracket.map(match => {
    if (playingFirstLeg && !match.playedLeg1) return simulateKnockoutLeg(match, allTeams, 1, singleLeg);
    if (playingSecondLeg && !match.playedLeg2) return simulateKnockoutLeg(match, allTeams, 2);
    return match;
  });
  const stageFinished = bracket.every(match => match.winnerId);

  if (!stageFinished) {
    return {
      tournament: { ...tournament, bracket },
      prize: 0,
      userPlayed,
      userEliminated: false,
      champion: undefined as string | undefined,
    };
  }

  const winners = bracket.map(match => match.winnerId).filter((id): id is string => Boolean(id));
  const userWon = Boolean(userTeamId && winners.includes(userTeamId));
  const userEliminated = userPlayed && !userWon;
  const prize = userPlayed ? getAdvancePrize(phase, userWon) : 0;

  if (phase === 'FINAL') {
    return {
      tournament: {
        ...tournament,
        bracket,
        currentPhase: 'FINISHED' as const,
        winnerId: winners[0],
      },
      prize,
      userPlayed,
      userEliminated,
      champion: winners[0],
    };
  }

  if (phase === 'PLAYOFF') {
    const groupWinners = tournament.groups.map(group =>
      calculateContinentalGroupStandings(group, tournament.groupFixtures)[0]?.teamId
    ).filter((id): id is string => Boolean(id));
    const roundOf16Teams = groupWinners.flatMap((groupWinner, index) => [groupWinner, winners[7 - index]]);
    return {
      tournament: {
        ...tournament,
        bracket: createKnockoutRound(tournament, 'ROUND_OF_16', roundOf16Teams),
        currentPhase: 'ROUND_OF_16' as const,
      },
      prize,
      userPlayed,
      userEliminated,
      champion: undefined as string | undefined,
    };
  }

  const nextPhase: ContinentalPhase = phase === 'ROUND_OF_16'
    ? 'QUARTER'
    : phase === 'QUARTER'
      ? 'SEMI'
      : 'FINAL';

  return {
    tournament: {
      ...tournament,
      bracket: createKnockoutRound(tournament, nextPhase, winners),
      currentPhase: nextPhase,
    },
    prize,
    userPlayed,
    userEliminated,
    champion: undefined as string | undefined,
  };
}

export function advanceContinentalMatchday(
  state: ContinentalSeasonState,
  allTeams: Team[],
  userTeamId: string | null
) {
  const lib = state.libertadores.currentPhase === 'GROUPS'
    ? advanceGroupMatchday(state.libertadores, allTeams, userTeamId)
    : advanceKnockoutStage(state.libertadores, allTeams, userTeamId);
  const sud = state.sudamericana.currentPhase === 'GROUPS'
    ? advanceGroupMatchday(state.sudamericana, allTeams, userTeamId)
    : advanceKnockoutStage(state.sudamericana, allTeams, userTeamId);
  const sudamericana: ContinentalTournamentState = sud.tournament.currentPhase === 'PLAYOFF' && sud.tournament.bracket.length === 0
    ? {
        ...sud.tournament,
        bracket: generateSudamericanaPlayoffs(sud.tournament, lib.tournament),
      }
    : sud.tournament;
  const userTournament = state.userQualification?.tournament;
  const userAdvance = userTournament === 'LIBERTADORES' ? lib : userTournament === 'SUDAMERICANA' ? sud : null;
  const transferredToSudamericana = Boolean(
    userTeamId && sudamericana.bracket.some(
      match => match.team1Id === userTeamId || match.team2Id === userTeamId
    )
  );
  const userQualification = userAdvance?.userEliminated
    ? undefined
    : transferredToSudamericana && userTournament === 'LIBERTADORES'
      ? { tournament: 'SUDAMERICANA' as const }
      : state.userQualification;

  return {
    state: {
      ...state,
      libertadores: lib.tournament,
      sudamericana,
      userQualification,
    },
    prize: userAdvance?.prize ?? 0,
    userPlayed: userAdvance?.userPlayed ?? false,
    userEliminated: userAdvance?.userEliminated ?? false,
    champions: [
      lib.champion ? {
        teamId: lib.champion,
        teamName: findContinentalTeam(lib.champion, allTeams)?.name || lib.champion,
        tournament: 'LIBERTADORES' as const,
      } : null,
      sud.champion ? {
        teamId: sud.champion,
        teamName: findContinentalTeam(sud.champion, allTeams)?.name || sud.champion,
        tournament: 'SUDAMERICANA' as const,
      } : null,
    ].filter((champion): champion is NonNullable<typeof champion> => Boolean(champion)),
  };
}
