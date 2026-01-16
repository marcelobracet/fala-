export type CallOutcome = "scheduled" | "no_interest" | "unknown";

export type MockCall = {
  id: string;
  startedAt: Date;
  durationSeconds: number;
  outcome: CallOutcome;
};

export type DailySeriesPoint = {
  date: string; // YYYY-MM-DD
  calls: number;
  scheduled: number;
  avgMinutes: number;
};

export type DashboardAnalytics = {
  totals: {
    calls: number;
    scheduled: number;
    conversionRate: number; // 0..1
    avgMinutesPerCall: number;
  };
  series: {
    last14Days: DailySeriesPoint[];
  };
};


