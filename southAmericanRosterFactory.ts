import { REAL_SOUTH_AMERICAN_PLAYERS } from './realSouthAmericanRosters';
import { DetailedPosition, Player } from './types';

function hashText(value: string) {
  return [...value].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261) >>> 0;
}

function genericPosition(mainPosition: DetailedPosition): Player['position'] {
  if (mainPosition === 'GK') return 'GOL';
  if (mainPosition === 'CB') return 'ZAG';
  if (mainPosition === 'RB' || mainPosition === 'LB') return 'LAT';
  if (mainPosition === 'DM') return 'VOL';
  if (mainPosition === 'CM' || mainPosition === 'AM') return 'MEI';
  return 'ATA';
}

function createStats(position: DetailedPosition, overall: number, seed: number): Player['stats'] {
  const variation = (offset: number) => ((seed >>> offset) % 7) - 3;
  const clamp = (value: number) => Math.max(35, Math.min(99, Math.round(value)));
  const isGoalkeeper = position === 'GK';
  const isDefender = ['RB', 'LB', 'CB', 'DM'].includes(position);
  const isAttacker = ['AM', 'RW', 'LW', 'ST'].includes(position);

  return {
    pace: clamp(isGoalkeeper ? 42 : overall + (['RB', 'LB', 'RW', 'LW'].includes(position) ? 4 : -1) + variation(1)),
    shooting: clamp(isAttacker ? overall + variation(3) : overall - 16),
    passing: clamp(['CM', 'AM'].includes(position) ? overall + 2 + variation(5) : overall - 4),
    dribbling: clamp(isAttacker ? overall + variation(7) : overall - 7),
    defending: clamp(isDefender ? overall + variation(9) : overall - 18),
    physical: clamp(overall + (['CB', 'ST'].includes(position) ? 3 : 0) + variation(11)),
    keeping: clamp(isGoalkeeper ? overall + variation(13) : 35),
    crossing: clamp(['RB', 'LB', 'RW', 'LW'].includes(position) ? overall + variation(15) : overall - 10),
    finishing: clamp(position === 'ST' ? overall + 3 : isAttacker ? overall : overall - 17),
    tackling: clamp(isDefender ? overall + variation(17) : overall - 16),
    marking: clamp(isDefender ? overall + variation(19) : overall - 17),
    positioning: clamp(overall + variation(21)),
    strength: clamp(overall + (['CB', 'ST'].includes(position) ? 4 : -1)),
    stamina: clamp(overall + variation(23)),
    vision: clamp(['CM', 'AM'].includes(position) ? overall + 3 : overall - 6),
    longShot: clamp(isAttacker ? overall - 1 : overall - 11),
    heading: clamp(['CB', 'ST'].includes(position) ? overall + 2 : overall - 9),
    reflexes: clamp(isGoalkeeper ? overall + 4 + variation(25) : 35),
    handling: clamp(isGoalkeeper ? overall + 2 + variation(27) : 35),
  };
}

export function createSouthAmericanRoster(teamId: string, teamRating: number): Player[] {
  const seeds = REAL_SOUTH_AMERICAN_PLAYERS[teamId];
  if (!seeds) return [];

  return seeds.map(([espnId, name, mainPos, age]) => {
    const hash = hashText(`${teamId}:${espnId}:${name}`);
    const ageAdjustment = age <= 21 ? 1 : age >= 34 ? -1 : 0;
    const overall = Math.max(62, Math.min(91, teamRating + (hash % 7) - 3 + ageAdjustment));
    const valueFactor = age < 23 ? 18 : age > 31 ? 9 : 14;

    return {
      id: `${teamId}-espn-${espnId}`,
      name,
      position: genericPosition(mainPos),
      mainPosition: mainPos,
      secondaryPositions: [],
      preferredFoot: (mainPos === 'LB' || mainPos === 'LW' ? 'LEFT' : 'RIGHT') as 'LEFT' | 'RIGHT' | 'BOTH',
      age,
      overall,
      energy: 100,
      status: 'fit' as const,
      yellowCards: 0,
      redCards: 0,
      marketValue: Math.round((overall ** 3 * valueFactor) / 1000) * 1000,
      goals: 0,
      assists: 0,
      potential: Math.min(94, overall + (age < 22 ? 7 : 2)),
      dataSource: 'ESPN_MODEL' as const,
      attributesEstimated: true,
      contractRounds: 76,
      history: [],
      seasonStats: { yellowCards: 0, redCards: 0, matchesSuspended: 0 },
      stats: createStats(mainPos, overall, hash),
    };
  }).sort((a, b) => b.overall - a.overall);
}
