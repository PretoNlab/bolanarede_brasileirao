import { describe, it, expect } from 'vitest';
import { calculatePlayerFitForPosition, calculateDynamicTeamStrength } from './tacticsEngine';
import { processMatchResults } from './matchProcessor';
import { Team, Player } from '../types';

describe('Adaptation & Cohesion Engine', () => {
  const dummyPlayer: Player = {
    id: 'p1',
    name: 'Test Player',
    position: 'ATA',
    mainPosition: 'ST',
    secondaryPositions: ['LW'],
    preferredFoot: 'RIGHT',
    age: 24,
    overall: 80,
    energy: 100,
    status: 'fit',
    yellowCards: 0,
    redCards: 0,
    marketValue: 1000000,
    goals: 0,
    assists: 0,
    potential: 85,
    contractRounds: 38,
    history: [],
    seasonStats: { yellowCards: 0, redCards: 0, matchesSuspended: 0 },
    stats: {
      pace: 80, shooting: 80, passing: 70, dribbling: 80, defending: 40, physical: 70, keeping: 10,
      crossing: 60, finishing: 82, tackling: 40, marking: 40, positioning: 80, strength: 70, stamina: 80, vision: 70, longShot: 75, heading: 75, reflexes: 10, handling: 10
    }
  };

  it('improves position multiplier when positionAdaptation increases', () => {
    const initialFit = calculatePlayerFitForPosition(dummyPlayer, 'CB');
    expect(initialFit.multiplier).toBe(0.50);

    const adaptedPlayer: Player = {
      ...dummyPlayer,
      positionAdaptation: { 'CB': 50 }
    };
    const adaptedFit = calculatePlayerFitForPosition(adaptedPlayer, 'CB');
    expect(adaptedFit.multiplier).toBeGreaterThan(0.70);
    expect(adaptedFit.label).toContain('Em Adaptação (50%)');
  });

  it('applies team cohesion boost to team strength', () => {
    const dummyTeam: Team = {
      id: 't1',
      name: 'Test Team',
      shortName: 'TST',
      city: 'Test',
      logoColor1: '#000',
      logoColor2: '#FFF',
      attack: 75,
      defense: 75,
      roster: Array.from({ length: 11 }, (_, i) => ({ ...dummyPlayer, id: `p${i + 1}` })),
      lineup: Array.from({ length: 11 }, (_, i) => `p${i + 1}`),
      formation: '4-4-2',
      style: 'Equilibrado',
      instructions: { pressing: 'BALANÇADA', passing: 'MISTO', tempo: 'NORMAL' },
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, moral: 80, division: 1, stadiumCapacity: 30000,
      cohesion: 50
    };

    const strLowCohesion = calculateDynamicTeamStrength(dummyTeam);
    
    const highCohesionTeam: Team = { ...dummyTeam, cohesion: 100 };
    const strHighCohesion = calculateDynamicTeamStrength(highCohesionTeam);

    expect(strHighCohesion.att).toBeGreaterThan(strLowCohesion.att);
    expect(strHighCohesion.control).toBeGreaterThan(strLowCohesion.control);
  });
});
