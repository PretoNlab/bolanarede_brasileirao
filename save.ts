export type SaveSlotId = 1 | 2 | 3;

export interface PlayerSeasonStats {
  games: number;
  minutes: number;
  goals: number;
  assists: number;
  motm: number;
  ratingSum: number;
  lastRatings: number[]; // latest first
}

export interface SaveGame {
  version: 1;
  savedAt: string; // ISO
  season: number;
  currentRound: number;
  funds: number;
  ticketPrice: number;
  teams: any[];
  userTeamId: string | null;
  matchHistory: any[];
  fixtures: any[];
  news: any[];
  playerStats?: Record<string, PlayerSeasonStats>;
  coach?: any; // Coach
  pastSeasons?: any[]; // SeasonHistory[]
  ddaFactor?: number;
  hasSeenOnboarding?: boolean;
  hiredStaff?: any[]; // StaffMember[]
  staffMarket?: any[]; // StaffMember[]
  infrastructure?: any; // Infrastructure
  squadFocus?: string; // TrainingFocus
  squadTrainingFocus?: string; // TrainingFocus (alias)
  trainingIntensity?: string; // TrainingIntensity
  squadTrainingIntensity?: string; // TrainingIntensity (alias)
  youthRoster?: any[]; // Player[]
  // Copa do Mundo
  worldCupState?: any; // WorldCupGameState
  isWorldCupMode?: boolean;
}

const KEY_PREFIX = 'bolanarede_save_slot_';

export function slotKey(slot: SaveSlotId) {
  return `${KEY_PREFIX}${slot}`;
}

export function readSlot(slot: SaveSlotId): SaveGame | null {
  try {
    const raw = localStorage.getItem(slotKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidSaveGame(parsed)) return null;
    return parsed as SaveGame;
  } catch {
    return null;
  }
}

export function writeSlot(slot: SaveSlotId, save: SaveGame) {
  localStorage.setItem(slotKey(slot), JSON.stringify(save));
}

export function deleteSlot(slot: SaveSlotId) {
  localStorage.removeItem(slotKey(slot));
}

export function listSlots(): { slot: SaveSlotId; save: SaveGame }[] {
  const slots: SaveSlotId[] = [1, 2, 3];
  const out: { slot: SaveSlotId; save: SaveGame }[] = [];
  for (const s of slots) {
    const save = readSlot(s);
    if (save) out.push({ slot: s, save });
  }
  return out;
}

export function hasAnyLocalSave() {
  return listSlots().length > 0;
}

export function getLatestLocalSave() {
  const slots = listSlots();
  if (!slots.length) return null;

  return slots.reduce((latest, current) => {
    const latestTime = Date.parse(latest.save.savedAt || '');
    const currentTime = Date.parse(current.save.savedAt || '');

    if (Number.isNaN(latestTime)) return current;
    if (Number.isNaN(currentTime)) return latest;
    return currentTime > latestTime ? current : latest;
  });
}

export function downloadJson(filename: string, obj: any) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function readFileAsJson(file: File): Promise<any> {
  const text = await file.text();
  return JSON.parse(text);
}

export function isValidSaveGame(value: unknown): value is SaveGame {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Record<string, unknown>;

  return (
    candidate.version === 1 &&
    typeof candidate.savedAt === 'string' &&
    typeof candidate.season === 'number' &&
    typeof candidate.currentRound === 'number' &&
    typeof candidate.funds === 'number' &&
    typeof candidate.ticketPrice === 'number' &&
    Array.isArray(candidate.teams) &&
    (typeof candidate.userTeamId === 'string' || candidate.userTeamId === null) &&
    Array.isArray(candidate.matchHistory) &&
    Array.isArray(candidate.fixtures) &&
    Array.isArray(candidate.news)
  );
}
