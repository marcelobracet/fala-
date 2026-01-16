import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

// Ensure Node.js runtime for Auth.js routes (providers + crypto).
export const runtime = "nodejs";


