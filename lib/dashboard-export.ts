import type { DashboardAnalytics } from "@/types/analytics";

function fmtNumber(n: number, digits = 2) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

function fmtInt(n: number) {
  return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 }).format(n);
}

function joinRow(values: Array<string | number | null | undefined>, delimiter: string) {
  const escaped = values.map((v) => {
    const s = v === null || v === undefined ? "" : String(v);
    // Quote if needed, escape quotes.
    if (new RegExp(`[\"\\n\\r${delimiter}]`).test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  });
  return escaped.join(delimiter);
}

/**
 * Excel-friendly CSV:
 * - Uses delimiter ';' (PT-BR Excel default).
 * - Adds `sep=;` first line so Excel splits columns correctly even in some locales.
 * - Adds BOM for better UTF-8 compatibility.
 * - Organizes data into 2 tables (KPIs + Daily series).
 */
export function buildDashboardExportCsv(
  analytics: DashboardAnalytics,
  { delimiter = ";", includeBom = true }: { delimiter?: string; includeBom?: boolean } = {}
) {
  const lines: string[] = [];

  // Excel separator hint (must be first line).
  lines.push(`sep=${delimiter}`);
  lines.push("");
  lines.push(joinRow(["FalAí — Export do Dashboard"], delimiter));
  lines.push(joinRow([`Gerado em: ${new Date().toLocaleString("pt-BR")}`], delimiter));
  lines.push("");

  // KPIs table (single row, easy to read).
  lines.push(joinRow(["Resumo (KPIs)"], delimiter));
  lines.push(
    joinRow(
      [
        "Ligações (total)",
        "Agendamentos (conversões)",
        "Taxa de conversão (%)",
        "Minutos médios por ligação",
      ],
      delimiter
    )
  );
  lines.push(
    joinRow(
      [
        fmtInt(analytics.totals.calls),
        fmtInt(analytics.totals.scheduled),
        fmtNumber(analytics.totals.conversionRate * 100, 1),
        fmtNumber(analytics.totals.avgMinutesPerCall, 2),
      ],
      delimiter
    )
  );
  lines.push("");

  // Daily series table.
  lines.push(joinRow(["Série diária (últimos 14 dias)"], delimiter));
  lines.push(joinRow(["Data", "Ligações", "Agendamentos", "Taxa conv. (%)", "Min. médios"], delimiter));

  for (const p of analytics.series.last14Days) {
    const rate = p.calls ? (p.scheduled / p.calls) * 100 : 0;
    lines.push(
      joinRow(
        [p.date, fmtInt(p.calls), fmtInt(p.scheduled), fmtNumber(rate, 1), fmtNumber(p.avgMinutes, 2)],
        delimiter
      )
    );
  }

  const csv = lines.join("\n");
  return includeBom ? `\uFEFF${csv}` : csv;
}


