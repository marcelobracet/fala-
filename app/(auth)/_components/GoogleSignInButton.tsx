"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

export function GoogleSignInButton({ callbackUrl = "/dashboard" }: { callbackUrl?: string }) {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 px-4 py-3 font-medium hover:bg-zinc-50"
    >
      <Image src="/google.svg" alt="" width={18} height={18} className="mr-2" />
      Continuar com Google
    </button>
  );
}


