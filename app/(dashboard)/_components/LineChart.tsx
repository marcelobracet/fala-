import type { DailySeriesPoint } from "@/types/analytics";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function LineChart({
  title,
  values,
  formatValue,
}: {
  title: string;
  values: { label: string; value: number }[];
  formatValue?: (v: number) => string;
}) {
  const w = 520;
  const h = 140;
  const pad = 10;

  const maxV = values.reduce((acc, v) => Math.max(acc, v.value), 0) || 1;
  const minV = values.reduce((acc, v) => Math.min(acc, v.value), values[0]?.value ?? 0);
  const range = maxV - minV || 1;

  const stepX = values.length > 1 ? (w - pad * 2) / (values.length - 1) : 0;

  const points = values
    .map((v, i) => {
      const x = pad + i * stepX;
      const y = pad + (1 - (v.value - minV) / range) * (h - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-medium text-zinc-900">{title}</div>
        <div className="text-xs text-zinc-500">
          {formatValue ? formatValue(values[values.length - 1]?.value ?? 0) : values[values.length - 1]?.value}
        </div>
      </div>

      <div className="mt-4">
        <svg viewBox={`0 0 ${w} ${h}`} className="h-36 w-full">
          <polyline
            fill="none"
            stroke="rgb(24 24 27)"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={points}
          />
          {values.map((v, i) => {
            const x = pad + i * stepX;
            const y = pad + (1 - (v.value - minV) / range) * (h - pad * 2);
            return <circle key={v.label} cx={x} cy={y} r={3} fill="rgb(24 24 27)" />;
          })}
        </svg>

        <div className="mt-2 flex justify-between text-[10px] text-zinc-500">
          <span>{values[0]?.label ?? ""}</span>
          <span>{values[values.length - 1]?.label ?? ""}</span>
        </div>
      </div>
    </div>
  );
}

export function AvgMinutesLast14DaysLine({ series }: { series: DailySeriesPoint[] }) {
  const values = series.map((p) => ({
    label: p.date.slice(5),
    value: clamp(p.avgMinutes, 0, 20),
  }));
  return (
    <LineChart
      title="Minutos médios por ligação (últimos 14 dias)"
      values={values}
      formatValue={(v) => `${v.toFixed(2)} min`}
    />
  );
}


