import { Team, Player, SeasonHistory, PlayerHistoryEvent, StaffMember } from '../types';
import { generateSchedule } from '../data';

export interface SeasonTransitionInput {
  teams: Team[];
  userTeamId: string | null;
  season: number;
  hiredStaff: StaffMember[];
}

export interface SeasonTransitionOutput {
  teams: Team[];
  fixtures: any[];
  historyEntry: SeasonHistory;
}

export function processSeasonTransition(input: SeasonTransitionInput): SeasonTransitionOutput {
  const { teams, userTeamId, season, hiredStaff } = input;

  // Calculate final standings
  const standingsA = [...teams].filter(t => t.division === 1).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));
  const standingsB = [...teams].filter(t => t.division === 2).sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga));

  const relegatedIds = standingsA.slice(-4).map(t => t.id);
  const promotedIds = standingsB.slice(0, 4).map(t => t.id);

  // Record history
  const champion = standingsA[0];
  const runnerUp = standingsA[1];

  let topScorer = { name: 'Ninguém', goals: 0, teamShort: '-' };
  let maxG = -1;

  teams.forEach(t => {
    t.roster.forEach(p => {
      if (p.goals > maxG) {
        maxG = p.goals;
        topScorer = { name: p.name, goals: p.goals, teamShort: t.shortName };
      }
    });
  });

  const userTeam = teams.find(t => t.id === userTeamId);
  const userPos = standingsA.findIndex(t => t.id === userTeamId);
  const userPosB = standingsB.findIndex(t => t.id === userTeamId);
  const finalPos = userPos !== -1 ? userPos + 1 : (userPosB !== -1 ? userPosB + 1 : 0);

  const historyEntry: SeasonHistory = {
    year: season,
    championId: champion.id,
    championName: champion.name,
    runnerUpId: runnerUp.id,
    runnerUpName: runnerUp.name,
    userFinishPosition: finalPos,
    userDivision: userTeam?.division || 1,
    topScorer
  };

  const coachBonus = hiredStaff.find(s => s.type === 'COACH')?.bonus || 0;

  // Update teams
  const updatedTeams = teams.map(team => {
    let newDiv = team.division;
    if (relegatedIds.includes(team.id)) newDiv = 2;
    if (promotedIds.includes(team.id)) newDiv = 1;

    const updatedRoster = team.roster.map(player => {
      const isUserTeam = team.id === userTeamId;
      const isYoung = player.age < 23;
      const isOld = player.age > 30;
      const efficiency = isUserTeam ? (1 + coachBonus) : 1.0;

      let newOvr = player.overall;

      if (isYoung) {
        const growth = Math.floor(Math.random() * 4) + 1;
        newOvr = Math.min(player.potential, newOvr + Math.round(growth * efficiency));
      }

      let ovrChange = 0;
      if (isYoung && Math.random() > 0.4) ovrChange = Math.floor(Math.random() * 3);
      else if (isOld && Math.random() > 0.5) ovrChange = -Math.floor(Math.random() * 2);

      const history: PlayerHistoryEvent[] = [...(player.history || [])];
      if (player.goals > 0 || player.assists > 0) {
        history.unshift({
          id: Math.random().toString(36),
          round: 38,
          season,
          type: 'AWARD',
          description: `Temporada ${season}: ${player.goals} gols, ${player.assists} assistências`,
          icon: '📊'
        });
      }

      return {
        ...player,
        age: player.age + 1,
        overall: Math.min(99, Math.max(40, player.overall + ovrChange)),
        goals: 0,
        assists: 0,
        energy: 100,
        yellowCards: 0,
        redCards: 0,
        matchesSuspended: 0,
        isSuspended: false,
        status: 'fit' as const,
        seasonStats: { yellowCards: 0, redCards: 0, matchesSuspended: 0 },
        history
      };
    });

    return {
      ...team,
      division: newDiv,
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0,
      roster: updatedRoster,
      moral: 70
    };
  });

  const newFixtures = generateSchedule(updatedTeams);

  return {
    teams: updatedTeams,
    fixtures: newFixtures,
    historyEntry
  };
}
