"use client";

import { useState } from "react";
import { signIn, type SignInResponse } from "next-auth/react";

export function CredentialsLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res: SignInResponse | undefined = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
      redirect: false,
    });

    if (res?.error) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    if (res?.url) window.location.href = res.url;
    else setLoading(false);
  }

  return (
    <form className="grid gap-3" onSubmit={onSubmit}>
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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <button
        className="mt-1 h-11 rounded-xl bg-zinc-900 px-4 font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}


