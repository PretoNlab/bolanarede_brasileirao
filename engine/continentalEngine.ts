import { Team, Fixture, ContinentalGroup, ContinentalMatch, ContinentalTournamentState, ContinentalSeasonState, ContinentalTournamentType } from '../types';
import { SOUTH_AMERICAN_FOREIGN_CLUBS } from '../southAmericaData';

const GROUP_NAMES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const PRIZE_MONEY = {
  GROUP: 3000000,
  ROUND_OF_16: 1250000,
  QUARTER: 1700000,
  SEMI: 2300000,
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
  const allKnownTeams = [...allTeams, ...foreignTeams];
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
  rankedSerieATeamIds: string[] = []
): ContinentalSeasonState {
  const foreignTeams = getForeignTeams();

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

function createTournament(type: ContinentalTournamentType, name: string, pool: Team[]): ContinentalTournamentState {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const qualifiedTeamIds = shuffled.map(t => t.id);

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

function advanceTournamentMatchday(
  tournament: ContinentalTournamentState,
  allTeams: Team[],
  userTeamId: string | null
) {
  if (tournament.currentPhase !== 'GROUPS' || tournament.currentMatchday > 6) {
    return { tournament, prize: 0, userPlayed: false };
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
    currentPhase: groupsFinished ? 'ROUND_OF_16' : tournament.currentPhase,
    bracket: groupsFinished ? generateKnockoutBracket({ ...tournament, groupFixtures }) : tournament.bracket
  };

  const prize = userPlayed && currentMatchday === 1 ? PRIZE_MONEY.GROUP : 0;
  return { tournament: updatedTournament, prize, userPlayed };
}

export function advanceContinentalMatchday(
  state: ContinentalSeasonState,
  allTeams: Team[],
  userTeamId: string | null
) {
  const lib = advanceTournamentMatchday(state.libertadores, allTeams, userTeamId);
  const sud = advanceTournamentMatchday(state.sudamericana, allTeams, userTeamId);
  const userTournament = state.userQualification?.tournament;
  const userAdvance = userTournament === 'LIBERTADORES' ? lib : userTournament === 'SUDAMERICANA' ? sud : null;

  return {
    state: {
      ...state,
      libertadores: lib.tournament,
      sudamericana: sud.tournament
    },
    prize: userAdvance?.prize ?? 0,
    userPlayed: userAdvance?.userPlayed ?? false
  };
}
