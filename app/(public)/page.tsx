import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="font-semibold tracking-tight">Falaê</div>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            className="text-zinc-700 hover:text-zinc-900"
            href="#como-funciona"
          >
            Como funciona
          </Link>
          <Link className="text-zinc-700 hover:text-zinc-900" href="#preco">
            Preço
          </Link>
          <Link
            className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800"
            href="/register"
          >
            Começar agora
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pb-16">
        <section className="py-14">
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight">
            IA que atende ligações e transforma chamadas em oportunidades.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            Perfeito para negócios que perdem clientes no telefone. O Falaê
            atende, conversa e registra tudo — e você acompanha no dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
              href="/register"
            >
              Criar conta
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-6 py-3 font-medium text-zinc-900 hover:bg-zinc-50"
              href="/login"
            >
              Já tenho conta
            </Link>
          </div>
        </section>

        <section id="como-funciona" className="py-14">
          <h2 className="text-2xl font-semibold tracking-tight">
            Como funciona
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 p-6">
              <div className="text-sm font-medium text-zinc-500">1</div>
              <div className="mt-2 font-semibold">O cliente liga</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                A chamada inbound cai no número configurado e é roteada pela
                Retell.ai.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6">
              <div className="text-sm font-medium text-zinc-500">2</div>
              <div className="mt-2 font-semibold">A IA atende</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                O agente conduz a conversa (ex.: até 3 minutos) e registra o
                contexto.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-6">
              <div className="text-sm font-medium text-zinc-500">3</div>
              <div className="mt-2 font-semibold">Você acompanha</div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Após o fim da chamada, recebemos um webhook, salvamos a call no
                MongoDB e exibimos tudo no dashboard.
              </p>
            </div>
          </div>
        </section>

        <section id="preco" className="py-14">
          <h2 className="text-2xl font-semibold tracking-tight">Preço</h2>
          <div className="mt-6 rounded-2xl border border-zinc-200 p-8">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <div className="text-sm font-medium text-zinc-500">
                  Plano único
                </div>
                <div className="mt-1 text-xl font-semibold">Básico</div>
                <p className="mt-2 text-sm text-zinc-600">
                  Inclui 60 minutos/mês. Excedente: R$2,50 por minuto.
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-semibold tracking-tight">
                  R$97
                </div>
                <div className="text-sm text-zinc-500">por mês</div>
              </div>
            </div>
            <div className="mt-8">
              <Link
                className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
                href="/register"
              >
                Assinar e começar
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8 text-sm text-zinc-500">
          <div>© {new Date().getFullYear()} Falaê</div>
          <div className="flex gap-4">
            <span>Multi-tenant por Company</span>
            <span>•</span>
            <span>Stripe + Retell + Resend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
