import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Route protection for authenticated areas.
 *
 * We keep the matcher tight (only /dashboard/*) to avoid unnecessary overhead.
 */
export async function middleware(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    const url = new URL("/login", req.url);
    // Optional: preserve where the user was trying to go.
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};


