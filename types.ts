
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
  mainPosition: DetailedPosition;
  secondaryPositions: DetailedPosition[];
  preferredFoot: 'LEFT' | 'RIGHT' | 'BOTH';
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
    // Current (Compatibility)
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    keeping: number;

    // Detailed (New)
    crossing: number;
    finishing: number;
    tackling: number;
    marking: number;
    positioning: number;
    strength: number;
    stamina: number;
    vision: number;
    longShot: number;
    heading: number;
    reflexes: number;
    handling: number;
  };
  individualFocus?: string;
  trainingProgress?: number;
}

export interface WCTeamPlayer {
  name: string;
  position: 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA';
  age: number;
  overall: number;
  mainPosition?: DetailedPosition;
  secondaryPositions?: DetailedPosition[];
  preferredFoot?: 'LEFT' | 'RIGHT' | 'BOTH';
  statsOverrides?: Partial<Player['stats']>;
  potential?: number;
}

// ========== TÁTICA AVANÇADA ==========

export type DetailedPosition =
  | 'GK'
  | 'RB'
  | 'LB'
  | 'CB'
  | 'DM'
  | 'CM'
  | 'AM'
  | 'RW'
  | 'LW'
  | 'ST';

export interface TacticalSlot {
  id: string;
  position: DetailedPosition;
  x: number; // 0-100 (horizontal)
  y: number; // 0-100 (vertical)
  label: string;
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
    [key: string]: any;
  };
};

export interface NewsItem {
  id: string;
  round: number;
  title: string;
  body: string;
  category: 'FINANCE' | 'MORAL' | 'HEALTH' | 'MARKET' | 'BOARD' | 'TRAINING' | 'MEDICAL';
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
  logoUrl?: string; // New field for real shields
  attack: number;
  defense: number;
  roster: Player[];
  lineup: string[];
  formation: FormationType;
  style: PlayingStyle;
  instructions: TacticalInstructions;
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
  stadiumName?: string;
  socioCount?: number;
  rivalId?: string;
  managerName?: string;
  description?: string;
  financeStatus?: string;
  seasonExpectation?: string;
}

export interface MatchResult {
  round: number;
  homeTeamId?: string;
  awayTeamId?: string;
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

export type FormationType =
  | '4-4-2'
  | '4-3-3'
  | '4-2-3-1'
  | '3-5-2'
  | '4-5-1'
  | '5-3-2'
  | '5-4-1'
  | '3-4-3'
  | '4-1-4-1'
  | '4-1-2-1-2'
  | '4-2-4';
export type PlayingStyle = 'Ultra-Defensivo' | 'Defensivo' | 'Equilibrado' | 'Ofensivo' | 'Tudo-ou-Nada';

export interface TacticalInstructions {
  pressing: 'BAIXA' | 'MEDIA' | 'ALTA';
  passing: 'CURTO' | 'MISTO' | 'LONGO';
  tempo: 'LENTO' | 'PADRAO' | 'VELOZ';
}

export type TrainingIntensity = 'BAIXA' | 'MEDIA' | 'ALTA';
export type TrainingFocus = 'ATAQUE' | 'DEFESA' | 'FISICO' | 'BALANCEADO' | 'TATICO';

export type StaffType = 'COACH' | 'PHYSIO' | 'SCOUT';
export type StaffLevel = 'BRONZE' | 'SILVER' | 'GOLD';

export interface StaffMember {
  id: string;
  name: string;
  type: StaffType;
  level: StaffLevel;
  salary: number;
  description: string;
  bonus?: number; // Optional numeric bonus value
}

export type InfrastructureType = 'ct' | 'dm' | 'scout';

export interface Infrastructure {
  ct: number;    // Centro de Treinamento (1-3)
  dm: number;    // Departamento Médico (1-3)
  scout: number; // Escritório de Scouting (1-3)
}

export type ScreenState = 'SPLASH' | 'PRE_MATCH' | 'COACH_SETUP' | 'TEAM_SELECT' | 'DASHBOARD' | 'SQUAD' | 'TACTICS' | 'MATCH' | 'MARKET' | 'FINANCE' | 'CALENDAR' | 'LEAGUE' | 'NEWS' | 'STATS' | 'SETTINGS' | 'CHAMPION' | 'GAME_OVER' | 'PROFILE' | 'TRAINING' | 'INFRASTRUCTURE' | 'STAFF' | 'YOUTH' | 'WC_TEAM_SELECT' | 'WC_SQUAD_CALLUP' | 'WC_DASHBOARD' | 'WC_GROUPS' | 'WC_BRACKET' | 'WC_PRE_MATCH' | 'WC_MATCH' | 'WC_CHAMPION' | 'WC_ELIMINATED';

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

// ========== COPA DO MUNDO 2026 ==========

export type WCConfederation = 'UEFA' | 'CONMEBOL' | 'CONCACAF' | 'AFC' | 'CAF' | 'OFC';

export type WCPhase = 'GROUP' | 'ROUND_OF_32' | 'ROUND_OF_16' | 'QUARTER' | 'SEMI' | 'THIRD_PLACE' | 'FINAL' | 'FINISHED';

export interface WCGroup {
  name: string;
  teamIds: string[];
}

export interface WCBracketMatch {
  id: string;
  phase: WCPhase;
  matchNumber: number;
  team1Id: string | null;
  team2Id: string | null;
  score1?: number;
  score2?: number;
  penalties1?: number;
  penalties2?: number;
  played: boolean;
  winnerId?: string;
  nextMatchId?: string;
}

export interface WorldCupGameState {
  groups: WCGroup[];
  bracket: WCBracketMatch[];
  fixtures: Fixture[];
  currentPhase: WCPhase;
  currentMatchday: number;
  teams: Team[];
  userTeamId: string;
  matchHistory: MatchResult[];
  isEliminated: boolean;
  provisionalSquad?: Player[]; // Lista de 40 nomes
}

export interface WCTeamData {
  id: string;
  name: string;
  shortName: string;
  confederation: WCConfederation;
  logoColor1: string;
  logoColor2: string;
  logoUrl?: string;
  attack: number;
  defense: number;
  players: WCTeamPlayer[];
  managerName?: string;
}
