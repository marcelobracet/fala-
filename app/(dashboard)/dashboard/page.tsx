import { auth } from "@/lib/auth";
import { getDashboardAnalyticsMock } from "@/services/analytics.service";
import { KpiCard } from "@/app/(dashboard)/_components/KpiCard";
import { CallsLast14DaysBars } from "@/app/(dashboard)/_components/BarChart";
import { AvgMinutesLast14DaysLine } from "@/app/(dashboard)/_components/LineChart";

export default async function DashboardHomePage() {
  // Server Component: we can read the session safely on the server.
  // The header already shows user info; we keep this here for future ACL/tenant loading.
  await auth();
  const analytics = await getDashboardAnalyticsMock();
  const { totals, series } = analytics;

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Visão geral</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Base inicial do dashboard. Aqui vamos exibir calls, minutos usados, e métricas.
            </p>
          </div>

          <a
            href="/api/dashboard/export"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Exportar Excel
          </a>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Ligações efetuadas"
          value={String(totals.calls)}
          sub="Mock: últimos 14 dias"
        />
        <KpiCard
          label="Agendamentos (conversões)"
          value={String(totals.scheduled)}
          sub={`Taxa de conversão: ${(totals.conversionRate * 100).toFixed(1)}%`}
        />
        <KpiCard
          label="Minuto médio por ligação"
          value={`${totals.avgMinutesPerCall.toFixed(2)} min`}
          sub="Média considerando todas as ligações (mock)"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <CallsLast14DaysBars series={series.last14Days} />
        <AvgMinutesLast14DaysLine series={series.last14Days} />
      </section>
    </div>
  );
}


