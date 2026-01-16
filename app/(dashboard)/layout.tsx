import type { ReactNode } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { UserNav } from "@/app/(dashboard)/_components/UserNav";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link className="font-semibold tracking-tight" href="/dashboard">
              Falaê
            </Link>
            <span className="text-sm text-zinc-500">Dashboard</span>
          </div>

          <UserNav
            name={session?.user?.name}
            email={session?.user?.email}
            imageUrl={session?.user?.image}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
