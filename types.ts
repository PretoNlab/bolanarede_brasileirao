

export interface PlayerHistoryEvent {
  id: string;
  round: number;
  season: number;
  type: 'GOAL' | 'ASSIST' | 'YELLOW_CARD' | 'RED_CARD' | 'INJURY' | 'TRANSFER' | 'CONTRACT' | 'AWARD';
  description: string;
  icon?: string; // Optional icon override
}

export interface Player {
  id: string;
  name: string;
  position: 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA';
  age: number;
  overall: number;
  energy: number;
  status: 'fit' | 'injured' | 'suspended';
  yellowCards: number;
  redCards: number; // Novo campo
  isSuspended?: boolean;
  marketValue: number;
  goals: number;
  assists: number;
  potential: number;
  contractRounds: number;
  isOnLoan?: boolean;
  originalTeamId?: string;
  isForSale?: boolean;
  isListedForLoan?: boolean;
  valueTrend?: 'up' | 'down' | 'stable';

  // New Fields
  history: PlayerHistoryEvent[];
  seasonStats: {
    yellowCards: number;
    redCards: number;
    matchesSuspended: number;
  };
  injuryType?: 'LEVE' | 'MEDIA' | 'GRAVE';
  injuryDuration?: number;

  // New Detailed Attributes
  stats: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    keeping: number; // For GOL
  };
}

export interface Coach {
  name: string;
  style: 'Motivador' | 'Tático' | 'Negociador' | 'Disciplinador';
  bonusDescription: string;
  personalFunds: number; // Salário acumulado
  items: string[]; // Carro, Casa, Relógio...
}

export interface NewsChoice {
  label: string;
  impact: {
    funds?: number;
    moral?: number;
    newsText?: string;
  };
}

export interface NewsItem {
  id: string;
  round: number;
  title: string;
  body: string;
  category: 'FINANCE' | 'MORAL' | 'HEALTH' | 'MARKET' | 'BOARD';
  impactText?: string;
  isRead: boolean;
  choices?: NewsChoice[];
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  city: string;
  logoColor1: string;
  logoColor2: string;
  attack: number;
  defense: number;
  roster: Player[];
  lineup: string[];
  formation: FormationType;
  style: PlayingStyle;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  points: number;
  moral: number;
  division: 0 | 1 | 2;
  prestige?: number;
  stadiumCapacity: number;
  rivalId?: string;
}

export interface MatchResult {
  round: number;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  isUserMatch: boolean;
  events?: MatchEvent[];
}

export interface Fixture {
  round: number;
  homeTeamId: string;
  awayTeamId: string;
  played: boolean;
  homeScore?: number;
  awayScore?: number;
}

export interface MatchEvent {
  minute: number;
  type: 'goal' | 'whistle' | 'card_yellow' | 'card_red' | 'injury' | 'commentary';
  teamId?: string;
  playerName?: string;
  assistName?: string;
  description: string;
}

export interface TransferOffer {
  id: string;
  offeringTeamId: string;
  offeringTeamName: string;
  playerId: string;
  playerName: string;
  value: number;
  round: number;
}

export interface TransferLog {
  id: string;
  round: number;
  playerName: string;
  fromTeamName: string;
  toTeamName: string;
  value: number;
  type: 'buy' | 'sell' | 'loan';
}

export type FormationType = '4-4-2' | '4-3-3' | '3-5-2' | '5-4-1' | '4-5-1' | '5-3-2';
export type PlayingStyle = 'Ultra-Defensivo' | 'Defensivo' | 'Equilibrado' | 'Ofensivo' | 'Tudo-ou-Nada';

export type ScreenState = 'SPLASH' | 'PRE_MATCH' | 'COACH_SETUP' | 'TEAM_SELECT' | 'DASHBOARD' | 'SQUAD' | 'TACTICS' | 'MATCH' | 'MARKET' | 'FINANCE' | 'CALENDAR' | 'LEAGUE' | 'NEWS' | 'STATS' | 'SETTINGS' | 'CHAMPION' | 'GAME_OVER' | 'PROFILE';

export interface SeasonHistory {
  year: number;
  championId: string;
  championName: string;
  runnerUpId: string;
  runnerUpName: string;
  userFinishPosition: number;
  userDivision: 1 | 2;
  topScorer: { name: string; goals: number; teamShort: string };
}
