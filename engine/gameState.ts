import {
  Team, Player, ScreenState, MatchResult, Fixture, MatchEvent, NewsItem,
  TransferOffer, TransferLog, Coach, SeasonHistory, PlayerHistoryEvent,
  StaffMember, TrainingFocus, TrainingIntensity, Infrastructure, InfrastructureType,
  PlayingStyle, FormationType
} from '../types';
import { PlayerSeasonStats, SaveGame, SaveSlotId } from '../save';

export const DEFAULT_TICKET_PRICE = 50;

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function formatCurrency(val: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
}

export interface GameState {
  currentScreen: ScreenState;
  teams: Team[];
  userTeamId: string | null;
  currentRound: number;
  funds: number;
  matchHistory: MatchResult[];
  fixtures: Fixture[];
  news: NewsItem[];
  gameOverReason: string;
  season: number;
  ticketPrice: number;
  playerStats: Record<string, PlayerSeasonStats>;
  coach: Coach | null;
  pastSeasons: SeasonHistory[];
  ddaFactor: number;
  hasSeenOnboarding: boolean;
  activeSlot: SaveSlotId;
  lastScreen: ScreenState;
  hiredStaff: StaffMember[];
  staffMarket: StaffMember[];
  squadTrainingFocus: TrainingFocus;
  squadTrainingIntensity: TrainingIntensity;
  infrastructure: Infrastructure;
  youthRoster: Player[];
}

export function buildSaveFromState(state: GameState): SaveGame {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    season: state.season,
    currentRound: state.currentRound,
    funds: state.funds,
    ticketPrice: state.ticketPrice,
    teams: state.teams,
    userTeamId: state.userTeamId,
    matchHistory: state.matchHistory,
    fixtures: state.fixtures,
    news: state.news,
    playerStats: state.playerStats,
    coach: state.coach,
    pastSeasons: state.pastSeasons,
    ddaFactor: state.ddaFactor,
    hasSeenOnboarding: state.hasSeenOnboarding,
    hiredStaff: state.hiredStaff,
    staffMarket: state.staffMarket,
    squadTrainingFocus: state.squadTrainingFocus,
    squadTrainingIntensity: state.squadTrainingIntensity,
    infrastructure: state.infrastructure,
    youthRoster: state.youthRoster
  };
}
