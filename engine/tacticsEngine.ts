
import { Player, DetailedPosition, Team, TacticalSlot, FormationType, PlayingStyle } from '../types';

/**
 * Níveis de adaptação do jogador a uma posição específica.
 */
export type FitLevel = 'PRIMARY' | 'SECONDARY' | 'IMPROVISED';

interface FitResult {
  level: FitLevel;
  multiplier: number;
  label: string;
}

export interface LineupContribution {
  player: Player;
  slot: TacticalSlot;
  fit: FitResult;
  attack: number;
  creativity: number;
  defense: number;
  control: number;
  finishing: number;
  keeping: number;
}

/**
 * Calcula o quão bem um jogador se adapta a um slot tático.
 */
export function calculatePlayerFitForPosition(player: Player, slotPos: DetailedPosition): FitResult {
  // Caso base: Posição Principal
  if (player.mainPosition === slotPos) {
    return { level: 'PRIMARY', multiplier: 1.0, label: 'Ideal' };
  }

  // Progresso de Adaptação Posicional (0 a 100%)
  const adaptationProgress = player.positionAdaptation ? (player.positionAdaptation[slotPos] || 0) : 0;
  if (adaptationProgress >= 100) {
    return { level: 'PRIMARY', multiplier: 0.98, label: 'Adaptado (100%)' };
  }

  // Posições Secundárias Nativas
  if (player.secondaryPositions && player.secondaryPositions.includes(slotPos)) {
    const baseMult = 0.85 + (adaptationProgress / 100) * 0.13;
    return {
      level: 'SECONDARY',
      multiplier: Math.min(0.98, baseMult),
      label: adaptationProgress > 0 ? `Secundária (${adaptationProgress}%)` : 'Secundária'
    };
  }

  // Lógica de "Lado Invertido" ou Posições Próximas
  const proximityBonus = checkProximity(player.mainPosition, slotPos);
  if (proximityBonus > 0) {
    const baseMult = 0.70 + proximityBonus + (adaptationProgress / 100) * 0.20;
    return {
      level: 'SECONDARY',
      multiplier: Math.min(0.95, baseMult),
      label: adaptationProgress > 0 ? `Adaptado (${adaptationProgress}%)` : 'Adaptado'
    };
  }

  // Improviso Total com Progresso Aprendido
  if (adaptationProgress > 0) {
    const baseMult = 0.50 + (adaptationProgress / 100) * 0.42;
    return {
      level: adaptationProgress >= 60 ? 'SECONDARY' : 'IMPROVISED',
      multiplier: Math.min(0.92, baseMult),
      label: `Em Adaptação (${adaptationProgress}%)`
    };
  }

  // Improviso Total Inicial
  return { level: 'IMPROVISED', multiplier: 0.50, label: 'Improvisado' };
}

function roleRating(player: Player, position: DetailedPosition) {
  const stats = player.stats;

  if (position === 'GK') return average([stats.keeping, stats.reflexes, stats.handling, player.overall]);
  if (position === 'CB') return average([stats.defending, stats.marking, stats.tackling, stats.heading, stats.strength]);
  if (position === 'RB' || position === 'LB') return average([stats.defending, stats.pace, stats.stamina, stats.crossing]);
  if (position === 'DM') return average([stats.defending, stats.tackling, stats.passing, stats.positioning]);
  if (position === 'CM') return average([stats.passing, stats.vision, stats.stamina, stats.positioning]);
  if (position === 'AM') return average([stats.passing, stats.vision, stats.dribbling, stats.longShot]);
  if (position === 'RW' || position === 'LW') return average([stats.pace, stats.dribbling, stats.crossing, stats.finishing]);
  return average([stats.finishing, stats.shooting, stats.positioning, stats.heading]);
}

export function selectBestLineupForFormation(roster: Player[], formation: FormationType) {
  const available = roster.filter(player => player.status !== 'injured' && !player.isSuspended);
  const selected = new Set<string>();

  return FORMATIONS_SLOTS[formation].map(slot => {
    const best = available
      .filter(player => !selected.has(player.id))
      .map(player => {
        const fit = calculatePlayerFitForPosition(player, slot.position);
        const score = (player.overall * 0.4 + roleRating(player, slot.position) * 0.6) * fit.multiplier;
        return { player, score };
      })
      .sort((a, b) => b.score - a.score || b.player.overall - a.player.overall)[0]?.player;

    if (!best) return '';
    selected.add(best.id);
    return best.id;
  });
}

/**
 * Verifica se as posições são "vizinhas" no campo para reduzir a penalidade de improviso.
 */
function checkProximity(main: DetailedPosition, target: DetailedPosition): number {
  const neighbors: Record<string, string[]> = {
    'RB': ['CB', 'LB', 'DM'],
    'LB': ['CB', 'RB', 'DM'],
    'CB': ['RB', 'LB', 'DM'],
    'DM': ['CB', 'CM'],
    'CM': ['DM', 'AM'],
    'AM': ['CM', 'RW', 'LW', 'ST'],
    'RW': ['AM', 'LW', 'ST'],
    'LW': ['AM', 'RW', 'ST'],
    'ST': ['AM', 'RW', 'LW']
  };

  if (neighbors[main]?.includes(target)) return 0.1;
  return 0;
}

/**
 * Mapa de coordenadas e posições por formação.
 * Y=90 base do campo (Defesa), Y=10 topo do campo (Ataque).
 */
export const FORMATIONS_SLOTS: Record<FormationType, TacticalSlot[]> = {
  '4-4-2': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 15, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 38, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 62, y: 75, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 85, y: 75, label: 'LD' },
    { id: 'lm', position: 'LW', x: 15, y: 45, label: 'ME' },
    { id: 'cm1', position: 'CM', x: 38, y: 45, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 62, y: 45, label: 'MC' },
    { id: 'rm', position: 'RW', x: 85, y: 45, label: 'MD' },
    { id: 'st1', position: 'ST', x: 35, y: 15, label: 'ATA' },
    { id: 'st2', position: 'ST', x: 65, y: 15, label: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 15, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 38, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 62, y: 75, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 85, y: 75, label: 'LD' },
    { id: 'dm', position: 'DM', x: 50, y: 55, label: 'VOL' },
    { id: 'cm1', position: 'CM', x: 30, y: 40, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 70, y: 40, label: 'MC' },
    { id: 'lw', position: 'LW', x: 20, y: 15, label: 'PE' },
    { id: 'st', position: 'ST', x: 50, y: 10, label: 'ATA' },
    { id: 'rw', position: 'RW', x: 80, y: 15, label: 'PD' },
  ],
  '4-2-3-1': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 15, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 38, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 62, y: 75, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 85, y: 75, label: 'LD' },
    { id: 'dm1', position: 'DM', x: 35, y: 60, label: 'VOL' },
    { id: 'dm2', position: 'DM', x: 65, y: 60, label: 'VOL' },
    { id: 'lw', position: 'LW', x: 20, y: 35, label: 'PE' },
    { id: 'am', position: 'AM', x: 50, y: 35, label: 'MEI' },
    { id: 'rw', position: 'RW', x: 80, y: 35, label: 'PD' },
    { id: 'st', position: 'ST', x: 50, y: 15, label: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'cb1', position: 'CB', x: 25, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 50, y: 75, label: 'ZAG' },
    { id: 'cb3', position: 'CB', x: 75, y: 75, label: 'ZAG' },
    { id: 'lm', position: 'LW', x: 15, y: 50, label: 'ME' },
    { id: 'dm1', position: 'DM', x: 38, y: 55, label: 'VOL' },
    { id: 'dm2', position: 'DM', x: 62, y: 55, label: 'VOL' },
    { id: 'rm', position: 'RW', x: 85, y: 50, label: 'MD' },
    { id: 'am', position: 'AM', x: 50, y: 35, label: 'MEI' },
    { id: 'st1', position: 'ST', x: 35, y: 15, label: 'ATA' },
    { id: 'st2', position: 'ST', x: 65, y: 15, label: 'ATA' },
  ],
  '4-5-1': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 15, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 38, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 62, y: 75, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 85, y: 75, label: 'LD' },
    { id: 'dm', position: 'DM', x: 50, y: 60, label: 'VOL' },
    { id: 'lm', position: 'LW', x: 15, y: 40, label: 'ME' },
    { id: 'cm1', position: 'CM', x: 35, y: 40, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 65, y: 40, label: 'MC' },
    { id: 'rm', position: 'RW', x: 85, y: 40, label: 'MD' },
    { id: 'st', position: 'ST', x: 50, y: 15, label: 'ATA' },
  ],
  '5-3-2': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 15, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 32, y: 78, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 50, y: 80, label: 'ZAG' },
    { id: 'cb3', position: 'CB', x: 68, y: 78, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 85, y: 75, label: 'LD' },
    { id: 'dm', position: 'DM', x: 50, y: 55, label: 'VOL' },
    { id: 'cm1', position: 'CM', x: 32, y: 45, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 68, y: 45, label: 'MC' },
    { id: 'st1', position: 'ST', x: 38, y: 18, label: 'ATA' },
    { id: 'st2', position: 'ST', x: 62, y: 18, label: 'ATA' },
  ],
  '5-4-1': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 10, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 30, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 50, y: 75, label: 'ZAG' },
    { id: 'cb3', position: 'CB', x: 70, y: 75, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 90, y: 75, label: 'LD' },
    { id: 'lm', position: 'LW', x: 20, y: 45, label: 'ME' },
    { id: 'cm1', position: 'CM', x: 40, y: 45, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 60, y: 45, label: 'MC' },
    { id: 'rm', position: 'RW', x: 80, y: 45, label: 'MD' },
    { id: 'st', position: 'ST', x: 50, y: 15, label: 'ATA' },
  ],
  '3-4-3': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'cb1', position: 'CB', x: 25, y: 76, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 50, y: 74, label: 'ZAG' },
    { id: 'cb3', position: 'CB', x: 75, y: 76, label: 'ZAG' },
    { id: 'lm', position: 'LB', x: 12, y: 48, label: 'ALA' },
    { id: 'cm1', position: 'CM', x: 38, y: 48, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 62, y: 48, label: 'MC' },
    { id: 'rm', position: 'RB', x: 88, y: 48, label: 'ALA' },
    { id: 'lw', position: 'LW', x: 20, y: 16, label: 'PE' },
    { id: 'st', position: 'ST', x: 50, y: 10, label: 'ATA' },
    { id: 'rw', position: 'RW', x: 80, y: 16, label: 'PD' },
  ],
  '4-1-4-1': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 15, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 38, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 62, y: 75, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 85, y: 75, label: 'LD' },
    { id: 'dm', position: 'DM', x: 50, y: 58, label: 'VOL' },
    { id: 'lm', position: 'LW', x: 14, y: 38, label: 'ME' },
    { id: 'cm1', position: 'CM', x: 38, y: 38, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 62, y: 38, label: 'MC' },
    { id: 'rm', position: 'RW', x: 86, y: 38, label: 'MD' },
    { id: 'st', position: 'ST', x: 50, y: 14, label: 'ATA' },
  ],
  '4-1-2-1-2': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 15, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 38, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 62, y: 75, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 85, y: 75, label: 'LD' },
    { id: 'dm', position: 'DM', x: 50, y: 58, label: 'VOL' },
    { id: 'cm1', position: 'CM', x: 35, y: 40, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 65, y: 40, label: 'MC' },
    { id: 'am', position: 'AM', x: 50, y: 28, label: 'MEI' },
    { id: 'st1', position: 'ST', x: 38, y: 12, label: 'ATA' },
    { id: 'st2', position: 'ST', x: 62, y: 12, label: 'ATA' },
  ],
  '4-2-4': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'lb', position: 'LB', x: 15, y: 75, label: 'LE' },
    { id: 'cb1', position: 'CB', x: 38, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 62, y: 75, label: 'ZAG' },
    { id: 'rb', position: 'RB', x: 85, y: 75, label: 'LD' },
    { id: 'cm1', position: 'CM', x: 38, y: 48, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 62, y: 48, label: 'MC' },
    { id: 'lw', position: 'LW', x: 16, y: 20, label: 'PE' },
    { id: 'st1', position: 'ST', x: 40, y: 10, label: 'ATA' },
    { id: 'st2', position: 'ST', x: 60, y: 10, label: 'ATA' },
    { id: 'rw', position: 'RW', x: 84, y: 20, label: 'PD' },
  ],
};

export function getTeamLineupContributions(team: Team): LineupContribution[] {
  if (!team.lineup || team.lineup.length < 11) return [];

  const slots = FORMATIONS_SLOTS[team.formation];
  const contributions: LineupContribution[] = [];

  team.lineup.slice(0, 11).forEach((pid, idx) => {
    const player = team.roster.find((p) => p.id === pid);
    const slot = slots[idx];
    if (!player || !slot) return;

    const fit = calculatePlayerFitForPosition(player, slot.position);
    const mult = fit.multiplier;
    const stats = player.stats;

    contributions.push({
      player,
      slot,
      fit,
      attack: (stats.shooting * 0.4 + stats.dribbling * 0.3 + stats.pace * 0.3) * mult,
      creativity: (stats.passing * 0.5 + stats.vision * 0.3 + stats.dribbling * 0.2) * mult,
      defense: (stats.defending * 0.5 + stats.tackling * 0.3 + stats.marking * 0.2) * mult,
      control: (stats.passing * 0.4 + stats.positioning * 0.3 + stats.stamina * 0.3) * mult,
      finishing: (stats.finishing * 0.7 + stats.shooting * 0.3) * mult,
      keeping: (stats.keeping * 0.5 + stats.reflexes * 0.3 + stats.handling * 0.2) * mult,
    });
  });

  return contributions;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, curr) => acc + curr, 0) / values.length;
}

function getWeightedAverage(
  contributions: LineupContribution[],
  filterSlot: (entry: LineupContribution) => boolean,
  key: keyof Omit<LineupContribution, 'player' | 'slot' | 'fit'>
): number {
  const selected = contributions.filter(filterSlot);
  if (selected.length === 0) return 0;

  return average(selected.map((entry) => Number(entry[key])));
}

export function pickWeightedPlayer(players: Player[], getWeight: (player: Player) => number): Player | null {
  const weighted = players
    .map((player) => ({ player, weight: Math.max(0, getWeight(player)) }))
    .filter((entry) => entry.weight > 0);

  if (weighted.length === 0) return players[0] || null;

  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let threshold = Math.random() * total;

  for (const entry of weighted) {
    threshold -= entry.weight;
    if (threshold <= 0) return entry.player;
  }

  return weighted[weighted.length - 1]?.player || null;
}

export function selectGoalParticipants(team: Team): { scorer: Player | null; assist: Player | null } {
  const activePlayers = getTeamLineupContributions(team);
  const scoringPositionMultiplier: Partial<Record<DetailedPosition, number>> = {
    ST: 1.85,
    RW: 1.35,
    LW: 1.35,
    AM: 1.08,
    CM: 0.58,
    DM: 0.22,
    RB: 0.08,
    LB: 0.08,
    CB: 0.05,
    GK: 0,
  };

  const attackingPlayers = activePlayers.filter((entry) =>
    ['AM', 'RW', 'LW', 'ST', 'CM', 'DM', 'RB', 'LB', 'CB'].includes(entry.slot.position)
  );

  const scorer = pickWeightedPlayer(
    attackingPlayers.map((entry) => entry.player),
    (player) => {
      const entry = attackingPlayers.find((item) => item.player.id === player.id);
      if (!entry) return 0;
      if (entry.slot.position === 'GK') return 0;

      const positionMultiplier = scoringPositionMultiplier[entry.slot.position] ?? 0.1;
      const aerialBonus =
        entry.slot.position === 'CB'
          ? entry.player.stats.heading * 0.018
          : entry.slot.position === 'ST'
            ? entry.player.stats.heading * 0.08
            : entry.player.stats.heading * 0.025;

      const buildUpBonus =
        entry.slot.position === 'AM' || entry.slot.position === 'CM'
          ? entry.control * 0.08
          : 0;

      return (
        (entry.attack * 0.42 + entry.finishing * 0.46 + buildUpBonus + aerialBonus) *
        positionMultiplier
      );
    }
  );

  const assistPool = activePlayers
    .filter((entry) => entry.player.id !== scorer?.id)
    .filter((entry) => ['AM', 'RW', 'LW', 'CM', 'DM', 'RB', 'LB'].includes(entry.slot.position));

  const assist = pickWeightedPlayer(
    assistPool.map((entry) => entry.player),
    (player) => {
      const entry = assistPool.find((item) => item.player.id === player.id);
      if (!entry) return 0;
      return entry.creativity * 0.6 + entry.control * 0.25 + entry.player.stats.crossing * 0.15;
    }
  );

  return { scorer, assist };
}

/**
 * Calcula a força REAL de um time baseado na escalação atual, fit de cada jogador e coesão tática.
 * Centralizado para uso em todas as engines de simulação.
 */
export function calculateDynamicTeamStrength(team: Team) {
  if (!team.lineup || team.lineup.length < 11) {
    return { att: team.attack * 0.5, def: team.defense * 0.5, control: ((team.attack + team.defense) / 2) * 0.5 };
  }

  const contributions = getTeamLineupContributions(team);
  if (contributions.length === 0) return { att: team.attack, def: team.defense, control: (team.attack + team.defense) / 2 };

  let attPower =
    getWeightedAverage(contributions, (entry) => ['ST', 'RW', 'LW', 'AM'].includes(entry.slot.position), 'attack') * 0.55 +
    getWeightedAverage(contributions, (entry) => ['ST', 'RW', 'LW', 'AM', 'CM', 'DM'].includes(entry.slot.position), 'creativity') * 0.25 +
    getWeightedAverage(contributions, (entry) => ['ST', 'RW', 'LW', 'AM', 'CM'].includes(entry.slot.position), 'control') * 0.20;

  let defPower =
    getWeightedAverage(contributions, (entry) => ['GK'].includes(entry.slot.position), 'keeping') * 0.28 +
    getWeightedAverage(contributions, (entry) => ['CB', 'RB', 'LB', 'DM'].includes(entry.slot.position), 'defense') * 0.52 +
    getWeightedAverage(contributions, (entry) => ['CB', 'RB', 'LB', 'DM', 'CM'].includes(entry.slot.position), 'control') * 0.20;

  let controlPower =
    getWeightedAverage(contributions, (entry) => ['DM', 'CM', 'AM'].includes(entry.slot.position), 'control') * 0.55 +
    getWeightedAverage(contributions, (entry) => ['DM', 'CM', 'AM', 'RW', 'LW'].includes(entry.slot.position), 'creativity') * 0.25 +
    getWeightedAverage(contributions, (entry) => ['DM', 'CM', 'AM', 'CB'].includes(entry.slot.position), 'defense') * 0.20;

  // Apply Playing Style Modifiers
  const styleMultipliers: Record<PlayingStyle, { att: number, def: number }> = {
    'Ultra-Defensivo': { att: 0.6, def: 1.4 },
    'Defensivo':       { att: 0.8, def: 1.2 },
    'Equilibrado':    { att: 1.0, def: 1.0 },
    'Ofensivo':       { att: 1.2, def: 0.8 },
    'Tudo-ou-Nada':   { att: 1.5, def: 0.5 }
  };

  const mod = styleMultipliers[team.style || 'Equilibrado'];
  attPower *= (mod?.att || 1);
  defPower *= (mod?.def || 1);
  controlPower *= team.style === 'Ultra-Defensivo' ? 0.9 : team.style === 'Tudo-ou-Nada' ? 0.95 : 1.02;

  // Apply Tactical Instructions Modifiers
  if (team.instructions) {
    const { pressing, passing, tempo } = team.instructions;

    if (pressing === 'ALTA')  { defPower *= 1.05; attPower *= 1.02; controlPower *= 0.98; }
    if (pressing === 'BAIXA') { defPower *= 0.95; controlPower *= 1.03; }

    if (passing === 'CURTO')  { attPower *= 0.98; defPower *= 1.02; controlPower *= 1.06; }
    if (passing === 'LONGO')  { attPower *= 1.05; defPower *= 0.95; controlPower *= 0.94; }

    if (tempo === 'VELOZ') { attPower *= 1.05; defPower *= 0.97; controlPower *= 0.97; }
    if (tempo === 'LENTO') { attPower *= 0.95; defPower *= 1.03; controlPower *= 1.04; }
  }

  // Apply Team Cohesion Modifier
  const cohesionScore = team.cohesion ?? 75;
  const cohesionFactor = (cohesionScore - 75) / 100;
  attPower *= (1 + cohesionFactor * 0.12);
  defPower *= (1 + cohesionFactor * 0.12);
  controlPower *= (1 + cohesionFactor * 0.20);

  return {
    att: attPower,
    def: defPower,
    control: controlPower,
  };
}

export interface TacticalAnalysis {
  strengths: string[];
  weaknesses: string[];
  summary: string;
}

/**
 * Gera um feedback textual sobre a tática atual do time.
 */
export function generateTacticalFeedback(team: Team): TacticalAnalysis {
  const analysis: TacticalAnalysis = {
    strengths: [],
    weaknesses: [],
    summary: ""
  };

  if (!team.lineup || team.lineup.length < 11) {
    analysis.summary = "Escalação incompleta. Você precisa de 11 jogadores.";
    return analysis;
  }

  const slots = FORMATIONS_SLOTS[team.formation];
  const playersInLineup = team.lineup.slice(0, 11).map((pid, idx) => {
    return {
      player: team.roster.find(p => p.id === pid),
      slot: slots[idx]
    };
  });

  // Check Fit
  const improvCount = playersInLineup.filter(item => 
    item.player && calculatePlayerFitForPosition(item.player, item.slot.position).level === 'IMPROVISED'
  ).length;

  if (improvCount > 3) {
    analysis.weaknesses.push(`Excesso de improvisos (${improvCount} jogadores fora de posição)`);
  } else if (improvCount === 0) {
    analysis.strengths.push("Time taticamente organizado (sem improvisos)");
  }

  // Check Sectors
  const dynPower = calculateDynamicTeamStrength(team);
  const attStrength = dynPower.att;
  const defStrength = dynPower.def;

  if (attStrength > 80) analysis.strengths.push("Ataque extremamente perigoso");
  if (defStrength > 80) analysis.strengths.push("Defesa muito sólida");
  
  if (attStrength < 65) analysis.weaknesses.push("Dificuldade na criação e finalização");
  if (defStrength < 65) analysis.weaknesses.push("Sistema defensivo vulnerável");

  // Instructions Synergy
  if (team.instructions) {
    if (team.instructions.pressing === 'ALTA' && team.style === 'Ultra-Defensivo') {
      analysis.weaknesses.push("Pressão Alta com Estilo Retrancado gera fadiga inútil");
    }
    if (team.instructions.passing === 'CURTO' && team.instructions.tempo === 'VELOZ') {
      analysis.weaknesses.push("Passe Curto em Ritmo Veloz aumenta erros individuais");
    }
    if (team.instructions.passing === 'LONGO' && team.instructions.tempo === 'LENTO') {
      analysis.weaknesses.push("Passe Longo em Ritmo Lento facilita a interceptação");
    }
    if (team.instructions.pressing === 'ALTA' && team.instructions.tempo === 'VELOZ') {
      analysis.strengths.push("Intensidade sufocante (Blitz)");
    }
  }

  // Style Check
  if (team.style === 'Ultra-Defensivo' && defStrength > 75) {
    analysis.summary = "Um 'ônibus estacionado' difícil de ser batido, mas com pouco poder ofensivo.";
  } else if (team.style === 'Tudo-ou-Nada') {
    analysis.summary = "Estratégia de alto risco: ataque total com defesa exposta.";
  } else {
    analysis.summary = "Time equilibrado buscando controle do jogo.";
  }

  return analysis;
}
