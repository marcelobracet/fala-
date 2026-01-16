"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";

function initialsFrom(name?: string | null, email?: string | null) {
  const base = (name ?? "").trim() || (email ?? "").trim();
  if (!base) return "?";

  const parts = base.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + (second ?? "")).toUpperCase();
}

export function UserNav({
  name,
  email,
  imageUrl,
}: {
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
}) {
  const initials = initialsFrom(name, email);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-3 py-1.5">
        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-zinc-100">
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill sizes="32px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-zinc-600">
              {initials}
            </div>
          )}
        </div>

        <div className="leading-tight">
          <div className="max-w-[180px] truncate text-sm font-medium text-zinc-900">
            {name || "Usuário"}
          </div>
          <div className="max-w-[180px] truncate text-xs text-zinc-500">{email ?? ""}</div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Sair
      </button>
    </div>
  );
}


