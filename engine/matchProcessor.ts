import { Team, Player, MatchResult, MatchEvent, StaffMember, PlayerHistoryEvent, TrainingFocus, TrainingIntensity, Infrastructure } from '../types';
import { PlayerSeasonStats } from '../save';
import { clamp, DEFAULT_TICKET_PRICE } from './gameState';
import { calculateDynamicTeamStrength, selectGoalParticipants } from './tacticsEngine';

export interface MatchProcessorInput {
  teams: Team[];
  userTeamId: string | null;
  currentRound: number;
  season: number;
  fixtures: any[];
  matchHistory: MatchResult[];
  playerStats: Record<string, PlayerSeasonStats>;
  funds: number;
  ticketPrice: number;
  ddaFactor: number;
  hiredStaff: StaffMember[];
  squadTrainingFocus: TrainingFocus;
  squadTrainingIntensity: TrainingIntensity;
  infrastructure: Infrastructure;
  isWindowOpen: boolean;

  // Match results from the interactive match
  userGoals: number;
  opponentGoals: number;
  events: MatchEvent[];
}

export interface MatchProcessorOutput {
  teams: Team[];
  playerStats: Record<string, PlayerSeasonStats>;
  matchHistory: MatchResult[];
  funds: number;
  ddaFactor: number;
  news: any[]; // new news items to prepend
  toasts: { type: 'success' | 'error'; message: string; icon?: string }[];
  gameOver: boolean;
  gameOverReason?: string;
  nextRound: number;
  shouldAdvanceSeason: boolean;
}

export function processMatchResults(input: MatchProcessorInput): MatchProcessorOutput {
  const {
    teams, userTeamId, currentRound, season, fixtures, matchHistory,
    playerStats, funds, ticketPrice, ddaFactor, hiredStaff,
    squadTrainingIntensity, infrastructure, isWindowOpen,
    userGoals, opponentGoals, events
  } = input;

  const userTeam = teams.find(t => t.id === userTeamId);
  const roundResults: MatchResult[] = [];
  let roundRevenue = 0;
  const toasts: MatchProcessorOutput['toasts'] = [];
  const newNewsItems: any[] = [];

  const physio = hiredStaff.find(s => s.type === 'PHYSIO');
  const physioBonus = physio ? physio.bonus : 0;

  const updatedPlayerStats = { ...playerStats };

  const matchGoals: Record<string, number> = {};
  const matchAssists: Record<string, number> = {};
  const matchYellows: Record<string, number> = {};
  const matchReds: Record<string, number> = {};
  const matchInjuries: Record<string, { type: 'LEVE' | 'MEDIA' | 'GRAVE', duration: number, name: string }> = {};

  const helperUpdateStats = (team: Team, home: boolean, score: number, isUserMatch: boolean) => {
    if (isUserMatch && userTeamId && team.id === userTeamId) {
      const userEvents = events.filter(e => e.teamId === userTeamId);
      userEvents.forEach(e => {
        if (e.type === 'goal') {
          const scorer = team.roster.find(p => p.name === e.playerName);
          if (scorer) matchGoals[scorer.id] = (matchGoals[scorer.id] || 0) + 1;
          const assister = team.roster.find(p => p.name === e.assistName);
          if (assister) matchAssists[assister.id] = (matchAssists[assister.id] || 0) + 1;
        } else if (e.type === 'card_yellow') {
          const p = team.roster.find(x => x.name === e.playerName);
          if (p) matchYellows[p.id] = (matchYellows[p.id] || 0) + 1;
        } else if (e.type === 'card_red') {
          const p = team.roster.find(x => x.name === e.playerName);
          if (p) matchReds[p.id] = (matchReds[p.id] || 0) + 1;
        } else if (e.type === 'injury') {
          const p = team.roster.find(x => x.name === e.playerName);
          if (p) {
            const r = Math.random();
            const type = r > 0.8 ? 'GRAVE' : r > 0.4 ? 'MEDIA' : 'LEVE';
            const duration = type === 'GRAVE' ? 4 + Math.floor(Math.random() * 4) : type === 'MEDIA' ? 2 + Math.floor(Math.random() * 2) : 1;
            matchInjuries[p.id] = { type, duration, name: 'Lesão de Jogo' };
          }
        }
      });
    } else {
      for (let i = 0; i < score; i++) {
        const { scorer, assist } = selectGoalParticipants(team);
        if (scorer) {
          matchGoals[scorer.id] = (matchGoals[scorer.id] || 0) + 1;
          if (assist) {
            matchAssists[assist.id] = (matchAssists[assist.id] || 0) + 1;
          }
        }
      }
      team.roster.forEach(p => {
        if (p.status === 'suspended' || p.status === 'injured') return;
        if (Math.random() < 0.05) matchYellows[p.id] = (matchYellows[p.id] || 0) + 1;
        else if (Math.random() < 0.005) matchReds[p.id] = (matchReds[p.id] || 0) + 1;
      });
    }

    // Systemic injury check
    team.roster.forEach(p => {
      if (p.status === 'suspended' || p.status === 'injured') return;
      if (team.lineup.includes(p.id)) {
        let risk = 0.005;
        if (p.energy < 70) risk += 0.02;
        if (Math.random() < risk) {
          const r = Math.random();
          const type = r > 0.85 ? 'GRAVE' : r > 0.5 ? 'MEDIA' : 'LEVE';
          let duration = type === 'GRAVE' ? 4 + Math.floor(Math.random() * 4) : type === 'MEDIA' ? 2 + Math.floor(Math.random() * 2) : 1;
          if (team.id === userTeamId && physioBonus > 0) {
            duration = Math.max(1, Math.ceil(duration * (1 - physioBonus)));
          }
          matchInjuries[p.id] = { type, duration, name: 'Lesão Muscular' };
        }
      }
    });
  };

  // Process all fixtures for this round
  fixtures.forEach(fix => {
    if (fix.round === currentRound) {
      const hTeamRef = teams.find(t => t.id === fix.homeTeamId)!;
      const aTeamRef = teams.find(t => t.id === fix.awayTeamId)!;
      const isUserMatch = fix.homeTeamId === userTeamId || fix.awayTeamId === userTeamId;

      let hScore = 0;
      let aScore = 0;

      if (isUserMatch) {
        hScore = fix.homeTeamId === userTeamId ? userGoals : opponentGoals;
        aScore = fix.homeTeamId === userTeamId ? opponentGoals : userGoals;
      } else {
        // AI match simulation
        const hStats = calculateDynamicTeamStrength(hTeamRef);
        const aStats = calculateDynamicTeamStrength(aTeamRef);

        const hAtt = hStats.att;
        const hDef = hStats.def;
        const aAtt = aStats.att;
        const aDef = aStats.def;

        const homeAdvantage = 5;
        const isRivalry = hTeamRef.rivalId === aTeamRef.id || aTeamRef.rivalId === hTeamRef.id;
        const tension = isRivalry ? 1.5 : 1.0;

        const hControl = hStats.control || ((hAtt + hDef) / 2);
        const aControl = aStats.control || ((aAtt + aDef) / 2);

        const hPower = hAtt - aDef + (hControl - aControl) * 0.35 + homeAdvantage + (Math.random() * 12 - 6) * tension;
        const aPower = aAtt - hDef + (aControl - hControl) * 0.25 + (Math.random() * 12 - 6) * tension;

        const baseGoals = 1.25;
        let hExpected = Math.max(0.15, baseGoals + (hPower * 0.035));
        let aExpected = Math.max(0.15, baseGoals + (aPower * 0.035));

        if (fix.homeTeamId === userTeamId) {
          aExpected *= ddaFactor;
        } else if (fix.awayTeamId === userTeamId) {
          hExpected *= ddaFactor;
        }

        const simulateGoals = (expect: number) => {
          let g = 0;
          for (let i = 0; i < 5; i++) {
            if (Math.random() < (expect / 5)) g++;
          }
          return g;
        };

        hScore = simulateGoals(hExpected);
        aScore = simulateGoals(aExpected);
      }

      helperUpdateStats(hTeamRef, true, hScore, isUserMatch);
      helperUpdateStats(aTeamRef, false, aScore, isUserMatch);

      if (fix.homeTeamId === userTeamId) {
        const demand = clamp(0.25 + (hTeamRef.moral / 200) - (ticketPrice - DEFAULT_TICKET_PRICE) / 250, 0.2, 0.95);
        roundRevenue = Math.floor(hTeamRef.stadiumCapacity * demand * ticketPrice);
      }

      roundResults.push({
        round: currentRound,
        homeTeamName: hTeamRef.name,
        awayTeamName: aTeamRef.name,
        homeScore: hScore,
        awayScore: aScore,
        isUserMatch,
        events: isUserMatch ? events : undefined
      });
    }
  });

  // Recalculate DDA
  const recentMatches = [...matchHistory, ...roundResults]
    .filter(m => m.isUserMatch)
    .slice(-5);

  let wins = 0;
  let losses = 0;
  recentMatches.forEach(m => {
    const isHome = m.homeTeamName === userTeam?.name;
    const userScored = isHome ? m.homeScore : m.awayScore;
    const opponentScored = isHome ? m.awayScore : m.homeScore;
    if (userScored > opponentScored) wins++;
    else if (userScored < opponentScored) losses++;
  });

  let newDda = 1.0;
  if (wins === 5) newDda = 1.20;
  else if (wins === 4) newDda = 1.12;
  else if (wins === 3) newDda = 1.06;
  else if (losses === 3) newDda = 0.94;
  else if (losses === 4) newDda = 0.88;
  else if (losses === 5) newDda = 0.80;

  // Update teams with match results
  const newTeams = teams.map(team => {
    const match = roundResults.find(m => m.homeTeamName === team.name || m.awayTeamName === team.name);
    if (!match) return team;

    const isHome = match.homeTeamName === team.name;
    const goalsFor = isHome ? match.homeScore : match.awayScore;
    const goalsAgainst = isHome ? match.awayScore : match.homeScore;

    let newPoints = team.points;
    let newWon = team.won;
    let newDrawn = team.drawn;
    let newLost = team.lost;
    let newMoral = team.moral;

    if (goalsFor > goalsAgainst) {
      newWon++; newPoints += 3; newMoral = Math.min(100, newMoral + 5);
    } else if (goalsFor === goalsAgainst) {
      newDrawn++; newPoints += 1;
    } else {
      newLost++; newMoral = Math.max(0, newMoral - 5);
    }

    const newRoster = team.roster.map(p => {
      const g = matchGoals[p.id] || 0;
      const a = matchAssists[p.id] || 0;
      const y = matchYellows[p.id] || 0;
      const r = matchReds[p.id] || 0;
      const injury = matchInjuries[p.id];

      if (g > 0 || a > 0 || match) {
        if (!updatedPlayerStats[p.id]) {
          updatedPlayerStats[p.id] = { games: 0, minutes: 0, goals: 0, assists: 0, motm: 0, ratingSum: 0, lastRatings: [] };
        }
        const s = updatedPlayerStats[p.id];
        s.games += 1;
        s.goals += g;
        s.assists += a;
        const base = 6.0 + (g * 1.0) + (a * 0.5) + (Math.random());
        s.ratingSum += base;
      }

      const newHistory = [...(p.history || [])];
      if (g > 0 && match && (match.homeTeamName === team.name ? match.homeScore > match.awayScore : match.awayScore > match.homeScore)) {
        if (Math.random() > 0.8) {
          newHistory.unshift({
            id: Math.random().toString(36),
            round: currentRound,
            season,
            type: 'GOAL',
            description: `Marcou gol na vitória contra ${match.homeTeamName === team.name ? match.awayTeamName : match.homeTeamName}`
          });
        }
      }

      // Yellow cards and suspensions
      const newYellows = p.yellowCards + y;
      const newReds = p.redCards + r;
      let isSuspended = (p as any).matchesSuspended > 0;
      let matchesSuspended = (p as any).matchesSuspended || 0;

      if (matchesSuspended > 0) {
        matchesSuspended--;
        if (matchesSuspended <= 0) {
          isSuspended = false;
          matchesSuspended = 0;
        }
      }

      if (r > 0) {
        isSuspended = true;
        matchesSuspended = 1;
        newHistory.unshift({
          id: Math.random().toString(36),
          round: currentRound,
          season,
          type: 'RED_CARD',
          description: 'Expulso de campo',
          icon: '🟥'
        });
      } else if (y > 0 && newYellows % 3 === 0) {
        isSuspended = true;
        matchesSuspended = 1;
        newHistory.unshift({
          id: Math.random().toString(36),
          round: currentRound,
          season,
          type: 'YELLOW_CARD',
          description: `Suspenso pelo 3º cartão amarelo`,
          icon: '🟨'
        });
      }

      // Injuries
      let newStatus: Player['status'] = p.status;
      let newInjuryDuration = p.injuryDuration || 0;
      let newInjuryType = p.injuryType;

      if (newStatus === 'injured') {
        newInjuryDuration--;
        if (newInjuryDuration <= 0) {
          newStatus = 'fit';
          newInjuryDuration = 0;
          newInjuryType = undefined;
          newHistory.unshift({
            id: Math.random().toString(36),
            round: currentRound,
            season,
            type: 'INJURY',
            description: 'Recuperado de lesão',
            icon: '✨'
          });
        }
      }

      if (injury) {
        newStatus = 'injured';
        newInjuryDuration = injury.duration;
        newInjuryType = injury.type;
        newHistory.unshift({
          id: Math.random().toString(36),
          round: currentRound,
          season,
          type: 'INJURY',
          description: `Lesão (${injury.type.toLowerCase()}) - Fora por ${injury.duration} jogos`,
          icon: '🤕'
        });
        toasts.push({ type: 'error', message: `${p.name}: ${injury.name} (${injury.duration} jogos)`, icon: '🚑' });
      }

      if (isSuspended) newStatus = 'suspended';

      // Energy management (Depletion for starters, recovery for bench)
      const intensityEnergyMap: Record<string, number> = { 'BAIXA': 5, 'MEDIA': 0, 'ALTA': -8 };
      const trainingTax = team.id === userTeamId ? (intensityEnergyMap[squadTrainingIntensity] || 0) : 0;
      const dmBonus = team.id === userTeamId ? (infrastructure.dm - 1) * 0.1 : 0;
      const staffRecoveryBonus = physioBonus * 1.5;

      let newEnergy = p.energy;
      const isInLineup = team.lineup.includes(p.id);

      if (isInLineup) {
        // MATCH DEPLETION
        let depletion = 15 + Math.random() * 5; // Base depletion per match
        
        if (team.instructions) {
          if (team.instructions.pressing === 'ALTA') depletion += 10;
          if (team.instructions.pressing === 'BAIXA') depletion -= 5;
          if (team.instructions.tempo === 'VELOZ') depletion += 5;
          if (team.instructions.tempo === 'LENTO') depletion -= 3;
        }

        // Apply Staff and Infrastructure mitigations
        depletion = depletion * (1 - staffRecoveryBonus * 0.5) * (1 - dmBonus);
        newEnergy = Math.max(0, newEnergy - depletion + trainingTax);
      } else {
        // RECOVERY
        const baseRec = 15 + Math.round(15 * staffRecoveryBonus) + trainingTax;
        newEnergy = Math.min(100, newEnergy + baseRec * (1 + dmBonus));
      }

      // Training progression
      let trainingProgress = p.trainingProgress;
      let newOverall = p.overall;

      if (team.id === userTeamId && p.overall < p.potential) {
        const coachBonus = hiredStaff.find(s => s.type === 'COACH')?.bonus || 0;
        const ageFactor = p.age < 21 ? 2.0 : p.age < 24 ? 1.5 : p.age < 28 ? 1.0 : 0.5;
        const intensityGrowthMap: Record<string, number> = { 'BAIXA': 0.5, 'MEDIA': 1.0, 'ALTA': 1.8 };
        const intensityGrow = intensityGrowthMap[squadTrainingIntensity] || 1.0;
        const ctBonus = (infrastructure.ct - 1) * 0.15;
        const baseGain = 2 + Math.random() * 3;
        const totalGain = baseGain * intensityGrow * ageFactor * (1 + coachBonus) * (1 + ctBonus);
        trainingProgress += totalGain;

        if (trainingProgress >= 100) {
          trainingProgress -= 100;
          newOverall = Math.min(p.potential, newOverall + 1);
          toasts.push({ type: 'success', message: `Evolução: ${p.name} subiu para OVR ${newOverall}!`, icon: '📈' });
        }
      }

      return {
        ...p,
        energy: newEnergy,
        overall: newOverall,
        trainingProgress,
        goals: p.goals + g,
        assists: p.assists + a,
        yellowCards: newYellows,
        redCards: newReds,
        isSuspended,
        seasonStats: {
          yellowCards: newYellows,
          redCards: newReds,
          matchesSuspended: matchesSuspended
        },
        matchesSuspended,
        status: newStatus,
        injuryDuration: newInjuryDuration,
        injuryType: newInjuryType,
        history: newHistory
      };
    });

    return {
      ...team,
      played: team.played + 1,
      won: newWon,
      drawn: newDrawn,
      lost: newLost,
      gf: team.gf + goalsFor,
      ga: team.ga + goalsAgainst,
      points: newPoints,
      moral: newMoral,
      roster: newRoster
    };
  });

  // Financial calculation
  const wageCost = (userTeam?.roster.length || 0) * 1500;
  const staffSalaries = hiredStaff.reduce((sum, s) => sum + s.salary, 0);
  const finalFunds = funds + roundRevenue - wageCost - staffSalaries;

  // AI Transfer logic
  if (isWindowOpen && currentRound !== 18) {
    const aiTeams = newTeams.filter(t => t.id !== userTeamId);
    const numTransfers = Math.random() > 0.6 ? 2 : 1;

    for (let i = 0; i < numTransfers; i++) {
      const seller = aiTeams[Math.floor(Math.random() * aiTeams.length)];
      if (seller.roster.length > 18) {
        const player = seller.roster.sort((a, b) => b.overall - a.overall)[Math.floor(Math.random() * 5)];
        const potentialBuyers = aiTeams.filter(t => t.id !== seller.id && (t.moral > 50 || t.division === 1));

        if (potentialBuyers.length > 0 && player) {
          const buyer = potentialBuyers[Math.floor(Math.random() * potentialBuyers.length)];
          seller.roster = seller.roster.filter(p => p.id !== player.id);
          (buyer.roster as Player[]).push(player);

          newNewsItems.push({
            id: Math.random().toString(36),
            round: currentRound,
            title: `Mercado: ${player.name} muda de ares`,
            body: `O ${buyer.shortName} anunciou a contratação de ${player.name} (OVR ${player.overall}) do ${seller.shortName}. A negociação agita o mercado local.`,
            category: 'MARKET',
            isRead: false
          });
        }
      }
    }
  }

  // Check game over
  const gameOver = finalFunds < -500000;
  const gameOverReason = gameOver ? "O clube entrou em colapso financeiro. A diretoria não aceita mais as suas dívidas." : undefined;

  const nextR = currentRound + 1;
  const shouldAdvanceSeason = nextR > 38;

  return {
    teams: newTeams,
    playerStats: updatedPlayerStats,
    matchHistory: [...roundResults, ...matchHistory],
    funds: finalFunds,
    ddaFactor: newDda,
    news: newNewsItems,
    toasts,
    gameOver,
    gameOverReason,
    nextRound: nextR,
    shouldAdvanceSeason
  };
}
