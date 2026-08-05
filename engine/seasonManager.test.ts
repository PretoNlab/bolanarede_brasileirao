import { describe, expect, it } from 'vitest';
import { INITIAL_TEAMS } from '../data';
import { processSeasonTransition } from './seasonManager';
import { Team } from '../types';

function withStandings(teams: Team[]): Team[] {
  // Give every team a distinct points total so relegation/promotion order is deterministic.
  const divisionOne = teams.filter((t) => t.division === 1);
  const divisionTwo = teams.filter((t) => t.division === 2);

  return teams.map((team) => {
    const idxInDivision = team.division === 1
      ? divisionOne.findIndex((t) => t.id === team.id)
      : divisionTwo.findIndex((t) => t.id === team.id);

    return { ...team, points: 100 - idxInDivision, gf: 10, ga: 0 };
  });
}

describe('processSeasonTransition', () => {
  const seededTeams = withStandings(INITIAL_TEAMS);

  it('relegates the bottom 4 of division 1 and promotes the top 4 of division 2', () => {
    const divisionOne = seededTeams.filter((t) => t.division === 1).sort((a, b) => b.points - a.points);
    const divisionTwo = seededTeams.filter((t) => t.division === 2).sort((a, b) => b.points - a.points);

    const expectedRelegated = divisionOne.slice(-4).map((t) => t.id);
    const expectedPromoted = divisionTwo.slice(0, 4).map((t) => t.id);

    const result = processSeasonTransition({
      teams: seededTeams,
      userTeamId: null,
      season: 2026,
      hiredStaff: [],
    });

    expectedRelegated.forEach((id) => {
      expect(result.teams.find((t) => t.id === id)?.division).toBe(2);
    });
    expectedPromoted.forEach((id) => {
      expect(result.teams.find((t) => t.id === id)?.division).toBe(1);
    });
  });

  it('resets season stats (played/won/points/moral) for every team', () => {
    const result = processSeasonTransition({
      teams: seededTeams,
      userTeamId: null,
      season: 2026,
      hiredStaff: [],
    });

    result.teams.forEach((team) => {
      expect(team.played).toBe(0);
      expect(team.points).toBe(0);
      expect(team.moral).toBe(70);
    });
  });

  it('keeps every player overall within the valid 40-99 range after aging', () => {
    const result = processSeasonTransition({
      teams: seededTeams,
      userTeamId: null,
      season: 2026,
      hiredStaff: [],
    });

    result.teams.forEach((team) => {
      team.roster.forEach((player) => {
        expect(player.overall).toBeGreaterThanOrEqual(40);
        expect(player.overall).toBeLessThanOrEqual(99);
      });
    });
  });

  it('generates a full fixture list and continental tournament state for the new season', () => {
    const result = processSeasonTransition({
      teams: seededTeams,
      userTeamId: null,
      season: 2026,
      hiredStaff: [],
    });

    expect(result.fixtures.length).toBeGreaterThan(0);
    expect(result.continentalState.libertadores.qualifiedTeamIds).toHaveLength(32);
    expect(result.continentalState.sudamericana.qualifiedTeamIds).toHaveLength(32);
  });

  it('records the champion as the division-1 team with the most points', () => {
    const result = processSeasonTransition({
      teams: seededTeams,
      userTeamId: null,
      season: 2026,
      hiredStaff: [],
    });

    const divisionOneLeader = seededTeams
      .filter((t) => t.division === 1)
      .sort((a, b) => b.points - a.points)[0];

    expect(result.historyEntry.championId).toBe(divisionOneLeader.id);
  });
});
