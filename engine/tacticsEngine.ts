
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

/**
 * Calcula a força REAL de um time baseado na escalação atual e fit de cada jogador.
 * Centralizado para uso em todas as engines de simulação.
 */
export function calculateDynamicTeamStrength(team: Team) {
  if (!team.lineup || team.lineup.length < 11) {
    return { att: team.attack * 0.5, def: team.defense * 0.5 };
  }

  const slots = FORMATIONS_SLOTS[team.formation];
  if (!slots) return { att: team.attack, def: team.defense };

  let totalAtt = 0;
  let totalDef = 0;
  let countAtt = 0;
  let countDef = 0;

  team.lineup.slice(0, 11).forEach((pid, idx) => {
    const player = team.roster.find(p => p.id === pid);
    const slot = slots[idx];
    
    if (player && slot) {
      const fit = calculatePlayerFitForPosition(player, slot.position).multiplier;
      const effectiveOvr = player.overall * fit;
      
      // Assign weight based on zone
      if (['ST', 'RW', 'LW', 'AM'].includes(slot.position)) {
        totalAtt += effectiveOvr;
        countAtt++;
      } else if (['GK', 'CB', 'RB', 'LB'].includes(slot.position)) {
        totalDef += effectiveOvr;
        countDef++;
      } else {
        // Core Midfield counts for both but less
        totalAtt += effectiveOvr * 0.5;
        totalDef += effectiveOvr * 0.5;
        countAtt += 0.5;
        countDef += 0.5;
      }
    }
  });

  let attPower = countAtt > 0 ? totalAtt / countAtt : 40;
  let defPower = countDef > 0 ? totalDef / countDef : 40;

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

  // Apply Tactical Instructions Modifiers
  if (team.instructions) {
    const { pressing, passing, tempo } = team.instructions;

    // Pressing: ALTA enhances DEF but drains energy (energy in matchEngine)
    if (pressing === 'ALTA')  { defPower *= 1.05; attPower *= 1.02; }
    if (pressing === 'BAIXA') { defPower *= 0.95; }

    // Passing: CURTO enhances Cohesion/Control, LONGO enhances direct ATT
    if (passing === 'CURTO')  { attPower *= 0.98; defPower *= 1.02; } // Control
    if (passing === 'LONGO')  { attPower *= 1.05; defPower *= 0.95; } // Direct

    // Tempo: VELOZ enhances ATT but riskier
    if (tempo === 'VELOZ') { attPower *= 1.05; defPower *= 0.97; }
    if (tempo === 'LENTO') { attPower *= 0.95; defPower *= 1.03; }
  }

  return {
    att: attPower,
    def: defPower
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
