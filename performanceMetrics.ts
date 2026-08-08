export type PerformanceEventName =
  | 'app_opened'
  | 'landing_viewed'
  | 'start_clicked'
  | 'continue_clicked'
  | 'play_loaded'
  | 'career_started'
  | 'coach_created'
  | 'team_selected'
  | 'dashboard_reached'
  | 'prematch_opened'
  | 'first_match_started';

export interface PerformanceEvent {
  name: PerformanceEventName;
  at: number;
  path?: string;
  data?: Record<string, string | number | boolean | null>;
}

const EVENTS_KEY = 'bolanarede_perf_events';
const MARKS_KEY = 'bolanarede_perf_marks';
const MAX_EVENTS = 120;

function now() {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return Math.round(performance.now());
  }
  return Date.now();
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;

  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Metrics must never affect gameplay.
  }
}

function readMarks() {
  return readJson<Record<string, number>>(MARKS_KEY, {});
}

export function trackPerformanceEvent(
  name: PerformanceEventName,
  data: Record<string, string | number | boolean | null> = {}
) {
  if (typeof window === 'undefined') return;

  const event: PerformanceEvent = {
    name,
    at: now(),
    path: window.location.pathname,
    data,
  };

  const events = readJson<PerformanceEvent[]>(EVENTS_KEY, []);
  writeJson(EVENTS_KEY, [event, ...events].slice(0, MAX_EVENTS));

  window.dispatchEvent(new CustomEvent('bnr:performance-event', { detail: event }));

  const win = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof win.gtag === 'function') {
    try {
      win.gtag('event', name, data);
    } catch {
      // Ignore analytics failures
    }
  }
}

export function markPerformance(name: PerformanceEventName) {
  if (typeof window === 'undefined') return;

  const marks = readMarks();
  marks[name] = now();
  writeJson(MARKS_KEY, marks);
  trackPerformanceEvent(name);
}

export function markFirstMatchStarted() {
  if (typeof window === 'undefined') return;

  const marks = readMarks();
  const firstMatchAlreadyTracked = Boolean(marks.first_match_started);
  const current = now();
  const appOpenedAt = marks.app_opened ?? 0;
  const startClickedAt = marks.start_clicked;
  const careerStartedAt = marks.career_started;

  marks.first_match_started = marks.first_match_started ?? current;
  writeJson(MARKS_KEY, marks);

  if (firstMatchAlreadyTracked) {
    trackPerformanceEvent('first_match_started', { repeat: true });
    return;
  }

  trackPerformanceEvent('first_match_started', {
    repeat: false,
    app_open_to_first_match_ms: appOpenedAt ? current - appOpenedAt : null,
    start_click_to_first_match_ms: startClickedAt ? current - startClickedAt : null,
    career_start_to_first_match_ms: careerStartedAt ? current - careerStartedAt : null,
  });
}

export function resetCareerPerformanceMarks() {
  if (typeof window === 'undefined') return;

  const marks = readMarks();
  delete marks.career_started;
  delete marks.coach_created;
  delete marks.team_selected;
  delete marks.dashboard_reached;
  delete marks.prematch_opened;
  delete marks.first_match_started;
  writeJson(MARKS_KEY, marks);
}

export function getStoredPerformanceEvents() {
  return readJson<PerformanceEvent[]>(EVENTS_KEY, []);
}
