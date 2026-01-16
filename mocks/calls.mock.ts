import type { MockCall } from "@/types/analytics";

function isoDay(d: Date) {
  // YYYY-MM-DD in local time (good enough for mocks)
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function seededRandom(seed: number) {
  // Small deterministic PRNG for stable mocks across reloads.
  let t = seed;
  return () => {
    t = (t * 1664525 + 1013904223) % 4294967296;
    return t / 4294967296;
  };
}

/**
 * Generate deterministic mock calls for the last N days.
 * Keeps the UI predictable, while still looking "real".
 */
export function generateMockCalls({
  days = 14,
  seed = 42,
}: {
  days?: number;
  seed?: number;
} = {}): MockCall[] {
  const rand = seededRandom(seed);
  const now = new Date();
  const calls: MockCall[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // Calls per day (roughly 3..18), with light weekly rhythm.
    const weekday = date.getDay(); // 0..6
    const base = 6 + Math.floor(rand() * 8); // 6..13
    const bump = weekday === 6 || weekday === 0 ? -2 : 2; // weekends lower
    const count = Math.max(2, base + bump + Math.floor(rand() * 5) - 2);

    for (let c = 0; c < count; c++) {
      const start = new Date(date);
      start.setMinutes(Math.floor(rand() * 60 * 10)); // within ~10h window

      // Duration ~ 40s..240s (avg around ~2min)
      const durationSeconds = 40 + Math.floor(rand() * 200);

      // Conversion odds depend slightly on duration (longer calls convert more).
      const durationMinutes = durationSeconds / 60;
      const pScheduled = Math.min(0.55, 0.18 + durationMinutes * 0.08);
      const roll = rand();

      const outcome: MockCall["outcome"] =
        roll < pScheduled ? "scheduled" : roll < pScheduled + 0.65 ? "no_interest" : "unknown";

      calls.push({
        id: `${isoDay(date)}-${c}`,
        startedAt: start,
        durationSeconds,
        outcome,
      });
    }
  }

  return calls;
}


