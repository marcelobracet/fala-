import type { DashboardAnalytics, DailySeriesPoint, MockCall } from "@/types/analytics";
import { generateMockCalls } from "@/mocks/calls.mock";

function isoDay(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function computeDailySeries(calls: MockCall[], days: number): DailySeriesPoint[] {
  const map = new Map<
    string,
    { calls: number; scheduled: number; durationSeconds: number }
  >();

  for (const call of calls) {
    const day = isoDay(call.startedAt);
    const prev = map.get(day) ?? { calls: 0, scheduled: 0, durationSeconds: 0 };
    prev.calls += 1;
    prev.durationSeconds += call.durationSeconds;
    if (call.outcome === "scheduled") prev.scheduled += 1;
    map.set(day, prev);
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const points: DailySeriesPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const day = isoDay(d);
    const v = map.get(day) ?? { calls: 0, scheduled: 0, durationSeconds: 0 };
    points.push({
      date: day,
      calls: v.calls,
      scheduled: v.scheduled,
      avgMinutes: v.calls ? round2(v.durationSeconds / 60 / v.calls) : 0,
    });
  }

  return points;
}

/**
 * Returns mocked analytics for the dashboard.
 * Later, swap the generator for a DB query filtered by companyId.
 */
export async function getDashboardAnalyticsMock({
  days = 14,
  seed = 42,
}: {
  days?: number;
  seed?: number;
} = {}): Promise<DashboardAnalytics> {
  const calls = generateMockCalls({ days, seed });

  const totalCalls = calls.length;
  const scheduled = calls.filter((c) => c.outcome === "scheduled").length;
  const durationSeconds = calls.reduce((acc, c) => acc + c.durationSeconds, 0);

  const conversionRate = totalCalls ? scheduled / totalCalls : 0;
  const avgMinutesPerCall = totalCalls ? durationSeconds / 60 / totalCalls : 0;

  return {
    totals: {
      calls: totalCalls,
      scheduled,
      conversionRate,
      avgMinutesPerCall: round2(avgMinutesPerCall),
    },
    series: {
      last14Days: computeDailySeries(calls, Math.min(days, 14)),
    },
  };
}


