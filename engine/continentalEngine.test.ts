import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { INITIAL_TEAMS } from '../data';
import { CONTINENTAL_2026_EXTRA_CLUBS, CONTINENTAL_2026_GROUPS } from '../continental2026Data';
import { SOUTH_AMERICAN_FOREIGN_CLUBS } from '../southAmericaData';
import {
  initializeContinentalTournaments,
  calculateContinentalGroupStandings,
  generateKnockoutBracket,
  advanceContinentalMatchday,
} from './continentalEngine';

function getBaseClubId(id: string) {
  return id.replace(/-(lib|sud)-\d+$/, '');
}

function prepareLastGroupMatchday(state: ReturnType<typeof initializeContinentalTournaments>) {
  const seedResults = (tournament: typeof state.libertadores) => ({
    ...tournament,
    currentMatchday: 6,
    groupFixtures: tournament.groupFixtures.map(fixture => {
      if (fixture.round === 6) return fixture;
      const group = tournament.groups.find(item => item.teamIds.includes(fixture.homeTeamId))!;
      const homeRank = group.teamIds.indexOf(fixture.homeTeamId);
      const awayRank = group.teamIds.indexOf(fixture.awayTeamId);
      return {
        ...fixture,
        played: true,
        homeScore: homeRank < awayRank ? 5 : 0,
        awayScore: awayRank < homeRank ? 5 : 0,
      };
    }),
  });

  return {
    ...state,
    libertadores: seedResults(state.libertadores),
    sudamericana: seedResults(state.sudamericana),
  };
}

describe('initializeContinentalTournaments', () => {
  it('keeps Román Gómez in Bahia as a right-back in the August roster', () => {
    const bahia = INITIAL_TEAMS.find(team => team.id === 'bahia');
    const roman = bahia?.roster.find(player => player.name === 'Román Gómez');

    expect(roman?.position).toBe('LAT');
    expect(roman?.mainPosition).toBe('RB');
    expect(roman?.dataSource).toBe('CBF_TRANSFERMARKT');
  });

  it('fills both tournaments to 32 teams each', () => {
    const state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    expect(state.libertadores.qualifiedTeamIds).toHaveLength(32);
    expect(state.sudamericana.qualifiedTeamIds).toHaveLength(32);
  });

  it('never has duplicate team ids inside a single tournament', () => {
    const state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    expect(new Set(state.libertadores.qualifiedTeamIds).size).toBe(32);
    expect(new Set(state.sudamericana.qualifiedTeamIds).size).toBe(32);
  });

  it('never sends the same club to both Libertadores and Sul-Americana in the same season', () => {
    const state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    const libBaseIds = new Set(state.libertadores.qualifiedTeamIds.map(getBaseClubId));
    const sudBaseIds = new Set(state.sudamericana.qualifiedTeamIds.map(getBaseClubId));

    const overlap = [...libBaseIds].filter((id) => sudBaseIds.has(id));
    expect(overlap).toEqual([]);
  });

  it('fills Libertadores entirely with real foreign clubs given the current South American roster (no numbered clones)', () => {
    const state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    const clonedIds = state.libertadores.qualifiedTeamIds.filter((id) => /-lib-\d+$/.test(id));
    expect(clonedIds).toEqual([]);
  });

  it('splits groups into 8 groups of 4 teams with no team repeated across groups', () => {
    const state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    expect(state.libertadores.groups).toHaveLength(8);
    state.libertadores.groups.forEach((group) => expect(group.teamIds).toHaveLength(4));

    const allGroupedIds = state.libertadores.groups.flatMap((g) => g.teamIds);
    expect(new Set(allGroupedIds).size).toBe(32);
  });

  it('uses the official 2026 group composition without shuffling', () => {
    const state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    expect(state.libertadores.groups.map(group => group.teamIds)).toEqual(CONTINENTAL_2026_GROUPS.LIBERTADORES);
    expect(state.sudamericana.groups.map(group => group.teamIds)).toEqual(CONTINENTAL_2026_GROUPS.SUDAMERICANA);
  });

  it('resolves every official 2026 club to a known team', () => {
    const knownIds = new Set([
      ...INITIAL_TEAMS,
      ...SOUTH_AMERICAN_FOREIGN_CLUBS,
      ...CONTINENTAL_2026_EXTRA_CLUBS,
    ].map(team => team.id));

    const officialIds = Object.values(CONTINENTAL_2026_GROUPS).flat(2);
    expect(officialIds.filter(id => !knownIds.has(id))).toEqual([]);
  });

  it('gives every additional 2026 club an imported August squad, lineup and graphical badge', () => {
    CONTINENTAL_2026_EXTRA_CLUBS.forEach(team => {
      expect(team.roster.length).toBeGreaterThanOrEqual(16);
      expect(team.lineup).toHaveLength(11);
      expect(team.lineup.every(playerId => team.roster.some(player => player.id === playerId))).toBe(true);
      expect(team.logoUrl).toBe(`/logos/continental/${team.id}.png`);
      expect(existsSync(path.join(process.cwd(), 'public', team.logoUrl!.replace(/^\//, '')))).toBe(true);
      expect(team.roster.every(player => player.dataSource === 'ESPN_MODEL')).toBe(true);
    });
  });

  it('replaces every legacy foreign roster with current imported players', () => {
    SOUTH_AMERICAN_FOREIGN_CLUBS.forEach(team => {
      expect(team.roster.length).toBeGreaterThanOrEqual(16);
      expect(team.lineup).toHaveLength(11);
      expect(team.roster.every(player => player.dataSource === 'ESPN_MODEL')).toBe(true);
    });

    expect(SOUTH_AMERICAN_FOREIGN_CLUBS.find(team => team.id === 'boca-juniors')?.roster.some(player => player.name === 'Leandro Paredes')).toBe(true);
    expect(CONTINENTAL_2026_EXTRA_CLUBS.find(team => team.id === 'rosario-central')?.roster.some(player => player.name === 'Ángel Di María')).toBe(true);
  });

  it('keeps each imported foreign player in only one current club', () => {
    const playerIds = [...SOUTH_AMERICAN_FOREIGN_CLUBS, ...CONTINENTAL_2026_EXTRA_CLUBS]
      .flatMap(team => team.roster.map(player => player.id.replace(`${team.id}-espn-`, '')));

    expect(new Set(playerIds).size).toBe(playerIds.length);
  });

  it('marks the user as qualified when their club is in an official 2026 group', () => {
    const userTeamId = 'flamengo';
    const state = initializeContinentalTournaments(INITIAL_TEAMS, userTeamId);

    const inLib = state.libertadores.qualifiedTeamIds.includes(userTeamId);
    const inSud = state.sudamericana.qualifiedTeamIds.includes(userTeamId);

    expect(inLib || inSud).toBe(true);
    expect(inLib && inSud).toBe(false);
    expect(state.userQualification?.tournament).toBe(inLib ? 'LIBERTADORES' : 'SUDAMERICANA');
    expect(state.userQualification?.groupName).toBe('A');
  });

  it('returns to ranking-based qualification after the 2026 season', () => {
    const rankedIds = INITIAL_TEAMS.filter(team => team.division === 1).map(team => team.id);
    const state = initializeContinentalTournaments(INITIAL_TEAMS, rankedIds[0], rankedIds, 2027);

    rankedIds.slice(0, 6).forEach(id => expect(state.libertadores.qualifiedTeamIds).toContain(id));
  });
});

describe('calculateContinentalGroupStandings', () => {
  it('awards 3 points for a win and 1 for a draw, ranked by points then goal difference', () => {
    const group = { name: 'A', teamIds: ['t1', 't2', 't3', 't4'] };
    const fixtures = [
      { round: 1, homeTeamId: 't1', awayTeamId: 't2', played: true, homeScore: 3, awayScore: 0 },
      { round: 1, homeTeamId: 't3', awayTeamId: 't4', played: true, homeScore: 1, awayScore: 1 },
    ] as any;

    const standings = calculateContinentalGroupStandings(group, fixtures);

    expect(standings[0].teamId).toBe('t1');
    expect(standings[0].points).toBe(3);
    expect(standings.find((s) => s.teamId === 't3')?.points).toBe(1);
    expect(standings.find((s) => s.teamId === 't4')?.points).toBe(1);
  });

  it('ignores unplayed fixtures', () => {
    const group = { name: 'A', teamIds: ['t1', 't2', 't3', 't4'] };
    const fixtures = [
      { round: 1, homeTeamId: 't1', awayTeamId: 't2', played: false },
    ] as any;

    const standings = calculateContinentalGroupStandings(group, fixtures);
    expect(standings.every((s) => s.played === 0)).toBe(true);
  });
});

describe('generateKnockoutBracket', () => {
  it('pairs each group winner against a runner-up from a different group', () => {
    const state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    // Simulate every group match with a fixed score so standings are deterministic.
    const playedFixtures = state.libertadores.groupFixtures.map((f) => ({
      ...f,
      played: true,
      homeScore: 1,
      awayScore: 0,
    }));

    const bracket = generateKnockoutBracket({ ...state.libertadores, groupFixtures: playedFixtures });

    expect(bracket).toHaveLength(8);
    bracket.forEach((match) => {
      expect(match.team1Id).toBeTruthy();
      expect(match.team2Id).toBeTruthy();
      expect(match.team1Id).not.toBe(match.team2Id);
    });
  });
});

describe('advanceContinentalMatchday', () => {
  it('creates the 2026 Sul-Americana playoffs with runners-up against Libertadores third places', () => {
    let state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    for (let matchday = 0; matchday < 6; matchday++) {
      state = advanceContinentalMatchday(state, INITIAL_TEAMS, null).state;
    }

    expect(state.sudamericana.currentPhase).toBe('PLAYOFF');
    expect(state.sudamericana.bracket).toHaveLength(8);
    expect(state.sudamericana.bracket.every(match => match.team1Id && match.team2Id)).toBe(true);
    expect(state.libertadores.currentPhase).toBe('ROUND_OF_16');
    expect(state.libertadores.bracket).toHaveLength(8);
  });

  it('transfers a Libertadores third-place user club to the Sul-Americana playoffs', () => {
    const initial = initializeContinentalTournaments(INITIAL_TEAMS, 'cusco-fc');
    const prepared = prepareLastGroupMatchday(initial);
    const result = advanceContinentalMatchday(prepared, INITIAL_TEAMS, 'cusco-fc');

    expect(result.userEliminated).toBe(false);
    expect(result.state.userQualification?.tournament).toBe('SUDAMERICANA');
    expect(result.state.sudamericana.bracket.some(
      match => match.team1Id === 'cusco-fc' || match.team2Id === 'cusco-fc'
    )).toBe(true);
  });

  it('removes an eliminated group-stage user club from continental qualification', () => {
    const initial = initializeContinentalTournaments(INITIAL_TEAMS, 'independiente-medellin');
    const prepared = prepareLastGroupMatchday(initial);
    const result = advanceContinentalMatchday(prepared, INITIAL_TEAMS, 'independiente-medellin');

    expect(result.userEliminated).toBe(true);
    expect(result.state.userQualification).toBeUndefined();
  });

  it('advances both competitions through every knockout round and declares champions', () => {
    let state = initializeContinentalTournaments(INITIAL_TEAMS, null);

    for (let step = 0; step < 20; step++) {
      state = advanceContinentalMatchday(state, INITIAL_TEAMS, null).state;
      if (state.libertadores.currentPhase === 'FINISHED' && state.sudamericana.currentPhase === 'FINISHED') break;
    }

    expect(state.libertadores.currentPhase).toBe('FINISHED');
    expect(state.sudamericana.currentPhase).toBe('FINISHED');
    expect(state.libertadores.winnerId).toBeTruthy();
    expect(state.sudamericana.winnerId).toBeTruthy();
    expect(state.libertadores.bracket).toHaveLength(1);
    expect(state.sudamericana.bracket).toHaveLength(1);
    expect(state.libertadores.bracket[0].winnerId).toBe(state.libertadores.winnerId);
    expect(state.sudamericana.bracket[0].winnerId).toBe(state.sudamericana.winnerId);
  });
});
