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
    if (!parsed || parsed.version !== 1) return null;
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
