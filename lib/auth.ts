import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

/**
 * Auth.js / NextAuth configuration.
 *
 * Goal: prepare an auth layer with:
 * - Email/Password (MongoDB via Mongoose)
 * - Google OAuth (GCP)
 * - Persistent session (JWT cookie strategy)
 *
 * NOTE: This is intentionally MVP-minimal. Business rules (email verification,
 * onboarding, company provisioning, etc.) should be added in services later.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Helpful especially in dev / local setups.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    // Only register Google provider when it's properly configured.
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    Credentials({
      name: "Email e senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(rawCredentials) {
        const parsed = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(rawCredentials);

        if (!parsed.success) return null;

        // Lazy-load DB dependencies so the auth config stays Edge-safe for middleware evaluation.
        const [{ connectToDatabase }, { UserModel }, bcrypt] = await Promise.all([
          import("@/lib/db"),
          import("@/models/User"),
          import("bcryptjs"),
        ]);

        await connectToDatabase();
        const user = await UserModel.findOne({ email: parsed.data.email }).select("+passwordHash").lean();
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: String(user._id),
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * Ensure Google sign-ins are represented in our DB.
     * We keep this very small: just upsert the user by email.
     */
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      const email = user.email;
      if (!email) return false;

      // Lazy-load DB dependencies so middleware/session checks don't pull in Mongoose.
      const [{ connectToDatabase }, { UserModel }] = await Promise.all([
        import("@/lib/db"),
        import("@/models/User"),
      ]);

      await connectToDatabase();
      await UserModel.updateOne(
        { email },
        {
          $setOnInsert: {
            email,
            name: user.name ?? null,
            authProviders: ["google"],
          },
        },
        { upsert: true }
      );

      return true;
    },
    async jwt({ token, user }) {
      // Persist user id into the JWT on initial sign-in.
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      // Expose user id on the session for server-side access control.
      if (session.user && token.sub) {
        // @ts-expect-error - we extend the session shape in types/auth.d.ts
        session.user.id = token.sub;
      }
      return session;
    },
  },
  // Auth.js requires a secret to sign/encrypt cookies & JWT.
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
});


