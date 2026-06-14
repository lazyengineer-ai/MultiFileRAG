import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

async function syncUser(
  provider: string,
  oauthSubject: string,
  email: string | null | undefined,
): Promise<{ user_id: string; access_token: string }> {
  const apiUrl = process.env.API_URL || "http://localhost:8000";
  const response = await fetch(`${apiUrl}/v1/auth/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.API_AUTH_SECRET || "",
    },
    body: JSON.stringify({
      provider,
      oauth_subject: oauthSubject,
      email: email ?? null,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Auth sync failed: ${text}`);
  }

  return response.json();
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider && account.providerAccountId) {
        const email =
          typeof profile === "object" && profile && "email" in profile
            ? (profile.email as string | undefined)
            : token.email;

        const synced = await syncUser(account.provider, account.providerAccountId, email);
        token.accessToken = synced.access_token;
        token.userId = synced.user_id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
  trustHost: true,
});
