import { signIn } from "@/auth";

interface LoginPageProps {
  searchParams: { callbackUrl?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const callbackUrl = searchParams.callbackUrl || "/files";

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">MultiFileRAG</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign in to upload documents and ask questions grounded in your files.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-lg bg-[var(--primary)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
            >
              Continue with Google
            </button>
          </form>

          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: callbackUrl });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              Continue with GitHub
            </button>
          </form>
        </div>

        <p className="mt-6 text-xs text-[var(--muted)]">
          OAuth only — no email/password. Google and GitHub accounts are separate.
        </p>
      </div>
    </main>
  );
}
