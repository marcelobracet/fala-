import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { buildDashboardExportCsv } from "@/lib/dashboard-export";
import { getDashboardAnalyticsMock } from "@/services/analytics.service";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // MVP: export mocked analytics. Later, swap to DB-backed analytics by companyId.
  const analytics = await getDashboardAnalyticsMock();

  // Excel-friendly CSV (PT-BR): separator ; + BOM + 2 readable tables.
  const csv = buildDashboardExportCsv(analytics, { delimiter: ";" });
  const filename = `falae-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}


