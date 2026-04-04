
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

  // Posições Secundárias
  if (player.secondaryPositions && player.secondaryPositions.includes(slotPos)) {
    return { level: 'SECONDARY', multiplier: 0.85, label: 'Secundária' };
  }

  // Lógica de "Lado Invertido" ou Posições Próximas
  // Ex: Um RB jogando de LB tem uma penalidade menor que um ST jogando de CB.
  const proximityBonus = checkProximity(player.mainPosition, slotPos);
  if (proximityBonus > 0) {
    return { level: 'SECONDARY', multiplier: 0.70 + proximityBonus, label: 'Adaptado' };
  }

  // Improviso Total
  return { level: 'IMPROVISED', multiplier: 0.50, label: 'Improvisado' };
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
    { id: 'dm1', position: 'DM', x: 35, y: 55, label: 'VOL' },
    { id: 'dm2', position: 'DM', x: 65, y: 55, label: 'VOL' },
    { id: 'lm', position: 'LW', x: 15, y: 35, label: 'ME' },
    { id: 'am', position: 'AM', x: 50, y: 35, label: 'MEI' },
    { id: 'rm', position: 'RW', x: 85, y: 35, label: 'MD' },
    { id: 'st', position: 'ST', x: 50, y: 15, label: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk', position: 'GK', x: 50, y: 90, label: 'GOL' },
    { id: 'cb1', position: 'CB', x: 25, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 50, y: 75, label: 'ZAG' },
    { id: 'cb3', position: 'CB', x: 75, y: 75, label: 'ZAG' },
    { id: 'lwb', position: 'LB', x: 10, y: 50, label: 'ALA' },
    { id: 'dm1', position: 'DM', x: 35, y: 55, label: 'VOL' },
    { id: 'cm', position: 'CM', x: 50, y: 40, label: 'MC' },
    { id: 'dm2', position: 'DM', x: 65, y: 55, label: 'VOL' },
    { id: 'rwb', position: 'RB', x: 90, y: 50, label: 'ALA' },
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
    { id: 'cb1', position: 'CB', x: 20, y: 75, label: 'ZAG' },
    { id: 'cb2', position: 'CB', x: 50, y: 75, label: 'ZAG' },
    { id: 'cb3', position: 'CB', x: 80, y: 75, label: 'ZAG' },
    { id: 'lb', position: 'LB', x: 10, y: 65, label: 'LE' },
    { id: 'rb', position: 'RB', x: 90, y: 65, label: 'LD' },
    { id: 'cm1', position: 'CM', x: 30, y: 45, label: 'MC' },
    { id: 'cm2', position: 'CM', x: 70, y: 45, label: 'MC' },
    { id: 'dm', position: 'DM', x: 50, y: 55, label: 'VOL' },
    { id: 'st1', position: 'ST', x: 35, y: 15, label: 'ATA' },
    { id: 'st2', position: 'ST', x: 65, y: 15, label: 'ATA' },
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
};

/**
 * Calcula a Coesão Tática do time (0-100).
 * Baseado no fit de todos os jogadores da lineup atual vs slots da formação.
 */
export function calculateTacticalCohesion(team: Team, allPlayers: Player[]): number {
  if (!team.lineup || team.lineup.length < 11) return 0;
  
  const slots = FORMATIONS_SLOTS[team.formation];
  if (!slots) return 0;

  let totalFit = 0;
  
  team.lineup.slice(0, 11).forEach((pid, idx) => {
    const player = allPlayers.find(p => p.id === pid);
    const slot = slots[idx];
    if (player && slot) {
      totalFit += calculatePlayerFitForPosition(player, slot.position).multiplier;
    }
  });

  return Math.round((totalFit / 11) * 100);
}

/**
 * Calcula a força de um setor específico (Defesa, Meio, Ataque).
 */
export function calculateSectionStrength(players: Player[], positions: DetailedPosition[]): number {
  if (players.length === 0) return 0;
  
  const totalOverall = players.reduce((sum, p) => sum + p.overall, 0);
  return Math.round(totalOverall / players.length);
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampStat(value: number) {
  return Math.max(1, Math.min(99, value));
}

function roleFootBonus(player: Player, slotPos: DetailedPosition) {
  const isLeft = slotPos === 'LB' || slotPos === 'LW';
  const isRight = slotPos === 'RB' || slotPos === 'RW';
  const isWide = isLeft || isRight;

  if (!isWide) return { attack: 0, creativity: 0 };

  const sameSideFoot =
    (isLeft && player.preferredFoot === 'LEFT') ||
    (isRight && player.preferredFoot === 'RIGHT');
  const invertedFoot =
    (isLeft && player.preferredFoot === 'RIGHT') ||
    (isRight && player.preferredFoot === 'LEFT');

  if (slotPos === 'LW' || slotPos === 'RW') {
    if (invertedFoot) return { attack: 3, creativity: 1 };
    if (sameSideFoot) return { attack: 0, creativity: 3 };
  }

  if (slotPos === 'LB' || slotPos === 'RB') {
    if (sameSideFoot) return { attack: 0, creativity: 2 };
    if (invertedFoot) return { attack: 1, creativity: 0 };
  }

  return { attack: 0, creativity: 0 };
}

export function getTeamLineupContributions(team: Team): LineupContribution[] {
  if (!team.lineup || team.lineup.length < 11) return [];

  const slots = FORMATIONS_SLOTS[team.formation];
  if (!slots) return [];

  return team.lineup.slice(0, 11).flatMap((pid, idx) => {
    const player = team.roster.find((p) => p.id === pid);
    const slot = slots[idx];

    if (!player || !slot) return [];

    const fit = calculatePlayerFitForPosition(player, slot.position);
    const fitMultiplier = fit.multiplier;
    const footBonus = roleFootBonus(player, slot.position);
    const stats = player.stats;

    const attackBase = average([
      player.overall,
      stats.finishing,
      stats.dribbling,
      stats.pace,
      stats.positioning,
      stats.longShot,
    ]) + footBonus.attack;

    const creativityBase = average([
      player.overall,
      stats.passing,
      stats.vision,
      stats.dribbling,
      stats.crossing,
    ]) + footBonus.creativity;

    const defenseBase = average([
      player.overall,
      stats.defending,
      stats.marking,
      stats.tackling,
      stats.positioning,
      stats.strength,
    ]);

    const controlBase = average([
      player.overall,
      stats.passing,
      stats.vision,
      stats.stamina,
      stats.positioning,
    ]);

    const keepingBase = average([
      player.overall,
      stats.keeping,
      stats.reflexes,
      stats.handling,
      stats.positioning,
    ]);

    return [{
      player,
      slot,
      fit,
      attack: clampStat(attackBase * fitMultiplier),
      creativity: clampStat(creativityBase * fitMultiplier),
      defense: clampStat(defenseBase * fitMultiplier),
      control: clampStat(controlBase * fitMultiplier),
      finishing: clampStat(average([stats.finishing, stats.heading, stats.positioning, player.overall]) * fitMultiplier),
      keeping: clampStat(keepingBase * fitMultiplier),
    }];
  });
}

function getWeightedAverage(contributions: LineupContribution[], filter: (entry: LineupContribution) => boolean, key: keyof LineupContribution) {
  const selected = contributions.filter(filter);
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
  const attackingPlayers = activePlayers.filter((entry) => ['AM', 'RW', 'LW', 'ST', 'CM', 'DM'].includes(entry.slot.position));

  const scorer = pickWeightedPlayer(
    attackingPlayers.map((entry) => entry.player),
    (player) => {
      const entry = attackingPlayers.find((item) => item.player.id === player.id);
      if (!entry) return 0;
      const aerialBonus = entry.player.stats.heading * (entry.slot.position === 'ST' || entry.slot.position === 'CB' ? 0.15 : 0.05);
      return entry.attack * 0.45 + entry.finishing * 0.45 + aerialBonus;
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
 * Calcula a força REAL de um time baseado na escalação atual e fit de cada jogador.
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

    // Pressing: ALTA enhances DEF but drains energy (energy in matchEngine)
    if (pressing === 'ALTA')  { defPower *= 1.05; attPower *= 1.02; controlPower *= 0.98; }
    if (pressing === 'BAIXA') { defPower *= 0.95; controlPower *= 1.03; }

    // Passing: CURTO enhances Cohesion/Control, LONGO enhances direct ATT
    if (passing === 'CURTO')  { attPower *= 0.98; defPower *= 1.02; controlPower *= 1.06; }
    if (passing === 'LONGO')  { attPower *= 1.05; defPower *= 0.95; controlPower *= 0.94; }

    // Tempo: VELOZ enhances ATT but riskier
    if (tempo === 'VELOZ') { attPower *= 1.05; defPower *= 0.97; controlPower *= 0.97; }
    if (tempo === 'LENTO') { attPower *= 0.95; defPower *= 1.03; controlPower *= 1.04; }
  }

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
