"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function CredentialsRegisterForm() {
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, name, email, password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      if (body?.error === "email_in_use") setError("Esse e-mail já está em uso.");
      else setError("Não foi possível criar a conta. Verifique os dados e tente novamente.");
      setLoading(false);
      return;
    }

    // Auto sign-in after successful registration.
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: true,
    });

    setLoading(false);
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
      <label className="grid gap-1 text-sm">
        <span className="text-zinc-700">Empresa</span>
        <input
          className="h-11 rounded-xl border border-zinc-200 px-3 outline-none focus:ring-2 focus:ring-zinc-300"
          name="companyName"
          type="text"
          placeholder="Salão da Ana"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          autoComplete="organization"
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="text-zinc-700">Seu nome</span>
        <input
          className="h-11 rounded-xl border border-zinc-200 px-3 outline-none focus:ring-2 focus:ring-zinc-300"
          name="name"
          type="text"
          placeholder="Ana Silva"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="text-zinc-700">E-mail</span>
        <input
          className="h-11 rounded-xl border border-zinc-200 px-3 outline-none focus:ring-2 focus:ring-zinc-300"
          name="email"
          type="email"
          placeholder="voce@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label className="grid gap-1 text-sm">
        <span className="text-zinc-700">Senha</span>
        <input
          className="h-11 rounded-xl border border-zinc-200 px-3 outline-none focus:ring-2 focus:ring-zinc-300"
          name="password"
          type="password"
          placeholder="mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          minLength={8}
        />
      </label>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <button
        className="mt-1 h-11 rounded-xl bg-zinc-900 px-4 font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar conta"}
      </button>
    </form>
  );
}


