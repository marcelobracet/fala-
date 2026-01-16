import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var __mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

/**
 * Mongoose connection helper.
 *
 * - Uses a global cache to avoid creating multiple connections during hot-reload in dev.
 * - Keeps the implementation small and side-effect free (no auto-connect on import).
 */
export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing env var: MONGODB_URI");
  }

  const cached = global.__mongooseConn ?? { conn: null, promise: null };
  global.__mongooseConn = cached;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      // Keep default options; add more as needed (e.g., serverSelectionTimeoutMS).
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


