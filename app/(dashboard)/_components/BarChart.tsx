import type { DailySeriesPoint } from "@/types/analytics";

function max(n: number, m: number) {
  return n > m ? n : m;
}

export function BarChart({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: number }[];
}) {
  const maxValue = data.reduce((acc, d) => max(acc, d.value), 0) || 1;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="text-sm font-medium text-zinc-900">{title}</div>
      <div className="mt-4 flex h-36 items-end gap-2">
        {data.map((d) => {
          const h = Math.round((d.value / maxValue) * 100);
          return (
            <div key={d.label} className="flex w-full flex-col items-center gap-2">
              <div
                className="w-full rounded-xl bg-zinc-900/90"
                style={{ height: `${Math.max(6, h)}%` }}
                title={`${d.label}: ${d.value}`}
              />
              <div className="text-[10px] text-zinc-500">{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CallsLast14DaysBars({ series }: { series: DailySeriesPoint[] }) {
  // Show a compact set of labels: every ~3 days.
  const data = series.map((p, idx) => ({
    label: idx % 3 === 0 ? p.date.slice(5) : "",
    value: p.calls,
  }));
  return <BarChart title="Ligações (últimos 14 dias)" data={data} />;
}


