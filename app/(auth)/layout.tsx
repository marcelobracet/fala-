import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <div className="text-xl font-semibold tracking-tight">Falaê</div>
          <div className="mt-2 text-sm text-zinc-600">
            Acesse sua conta para acompanhar chamadas e minutos.
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}


