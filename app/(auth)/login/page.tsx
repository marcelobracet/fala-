import Link from "next/link";
import { GoogleSignInButton } from "@/app/(auth)/_components/GoogleSignInButton";
import { CredentialsLoginForm } from "@/app/(auth)/_components/CredentialsLoginForm";

export default function LoginPage() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-2 text-sm text-zinc-600">
        No MVP, deixamos a UI pronta e a autenticação preparada (NextAuth) — a lógica de login será
        plugada aqui.
      </p>

      <div className="mt-6 grid gap-3">
        <GoogleSignInButton />

        <div className="text-center text-xs text-zinc-500">ou</div>

        <CredentialsLoginForm />
      </div>

      <p className="mt-6 text-sm text-zinc-600">
        Não tem conta?{" "}
        <Link className="font-medium text-zinc-900 hover:underline" href="/register">
          Criar agora
        </Link>
      </p>
    </div>
  );
}


