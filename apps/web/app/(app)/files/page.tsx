import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { FilesPageClient } from "./FilesPageClient";

export default async function FilesPage() {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login");
  }

  return (
    <FilesPageClient accessToken={session.accessToken} userEmail={session.user?.email} />
  );
}
