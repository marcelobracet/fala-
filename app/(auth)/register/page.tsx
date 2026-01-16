import Link from "next/link";
import { GoogleSignInButton } from "@/app/(auth)/_components/GoogleSignInButton";
import { CredentialsRegisterForm } from "@/app/(auth)/_components/CredentialsRegisterForm";

export default function RegisterPage() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold tracking-tight">Criar conta</h1>
      <p className="mt-2 text-sm text-zinc-600">
        Estrutura pronta para Email/Senha e Google OAuth. A criação efetiva do usuário será
        implementada na próxima etapa.
      </p>

      <div className="mt-6 grid gap-3">
        <GoogleSignInButton />

        <div className="text-center text-xs text-zinc-500">ou</div>

        <CredentialsRegisterForm />
      </div>

      <p className="mt-6 text-sm text-zinc-600">
        Já tem conta?{" "}
        <Link className="font-medium text-zinc-900 hover:underline" href="/login">
          Entrar
        </Link>
      </p>
    </div>
  );
}


