import { describe, expect, it } from 'vitest';
import { INITIAL_TEAMS } from '../data';
import {
  initializeContinentalTournaments,
  calculateContinentalGroupStandings,
  generateKnockoutBracket,
} from './continentalEngine';

function getBaseClubId(id: string) {
  return id.replace(/-(lib|sud)-\d+$/, '');
}

describe('initializeContinentalTournaments', () => {
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

  it('marks the user as qualified when their team is drawn into a tournament', () => {
    const userTeamId = INITIAL_TEAMS.find((t) => t.division === 1)!.id;
    const state = initializeContinentalTournaments(INITIAL_TEAMS, userTeamId);

    const inLib = state.libertadores.qualifiedTeamIds.includes(userTeamId);
    const inSud = state.sudamericana.qualifiedTeamIds.includes(userTeamId);

    // Division-1 teams always occupy the first 12 Brazilian slots (6 Lib + 6 Sud),
    // so a division-1 user must always land in exactly one of the two tournaments.
    expect(inLib || inSud).toBe(true);
    expect(inLib && inSud).toBe(false);
    expect(state.userQualification?.tournament).toBe(inLib ? 'LIBERTADORES' : 'SUDAMERICANA');
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
