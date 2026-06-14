import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";

export default async function ChatPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell userEmail={session.user?.email}>
      <div className="rounded-lg border border-[var(--border)] bg-white p-12 text-center">
        <h1 className="text-xl font-semibold text-slate-900">Chat</h1>
        <p className="mt-3 text-sm text-[var(--muted)] max-w-md mx-auto">
          Q&A over your documents arrives in Phase 3. Upload files on the Files tab — they will
          show as Processing until ingestion completes in Phase 2.
        </p>
      </div>
    </AppShell>
  );
}
