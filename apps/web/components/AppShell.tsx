"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface AppShellProps {
  children: React.ReactNode;
  userEmail?: string | null;
}

export function AppShell({ children, userEmail }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="text-lg font-semibold text-slate-900">MultiFileRAG</span>
            <nav className="flex gap-1">
              <TabLink href="/files" active={pathname.startsWith("/files")}>
                Files
              </TabLink>
              <TabLink href="/chat" active={pathname.startsWith("/chat")}>
                Chat
              </TabLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {userEmail && (
              <span className="text-sm text-[var(--muted)] hidden sm:inline">{userEmail}</span>
            )}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-[var(--muted)] hover:text-slate-900"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-4 py-2 text-sm font-medium ${
        active
          ? "bg-slate-100 text-slate-900"
          : "text-[var(--muted)] hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
}
