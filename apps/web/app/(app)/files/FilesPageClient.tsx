"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { FileList } from "@/components/FileList";
import { FileUpload, validateFilesClientSide } from "@/components/FileUpload";
import { StorageBar } from "@/components/StorageBar";
import { apiFetch, apiUpload } from "@/lib/api-client";
import type { FileListResponse, FileRecord } from "@/types/next-auth";

interface FilesPageClientProps {
  accessToken: string;
  userEmail?: string | null;
}

export function FilesPageClient({ accessToken, userEmail }: FilesPageClientProps) {
  const [data, setData] = useState<FileListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<FileRecord | null>(null);

  const showToast = (type: "error" | "success", message: string) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 5000);
  };

  const refresh = useCallback(async () => {
    try {
      const result = await apiFetch<FileListResponse>("/v1/files", accessToken);
      setData(result);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleUpload(files: File[]) {
    const clientError = validateFilesClientSide(files);
    if (clientError) {
      showToast("error", clientError);
      return;
    }

    let successCount = 0;
    for (const file of files) {
      const formData = new FormData();
      formData.append("upload", file);
      try {
        await apiUpload("/v1/files", accessToken, formData);
        successCount += 1;
      } catch (err) {
        showToast("error", err instanceof Error ? err.message : `Failed to upload ${file.name}`);
      }
    }

    if (successCount > 0) {
      showToast("success", `Uploaded ${successCount} file${successCount === 1 ? "" : "s"}`);
      await refresh();
    }
  }

  async function handleDeleteConfirm() {
    if (!pendingDelete) return;
    try {
      await apiFetch<void>(`/v1/files/${pendingDelete.id}`, accessToken, { method: "DELETE" });
      showToast("success", `Deleted ${pendingDelete.filename}`);
      setPendingDelete(null);
      await refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete file");
    }
  }

  async function handleReplace(file: FileRecord, newFile: File) {
    const clientError = validateFilesClientSide([newFile]);
    if (clientError) {
      showToast("error", clientError);
      return;
    }

    const formData = new FormData();
    formData.append("upload", newFile);
    try {
      await apiUpload(`/v1/files/${file.id}`, accessToken, formData, "PUT");
      showToast("success", `Replaced ${file.filename}`);
      await refresh();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to replace file");
    }
  }

  return (
    <AppShell userEmail={userEmail}>
      {toast && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            toast.type === "error"
              ? "border border-red-200 bg-red-50 text-red-800"
              : "border border-green-200 bg-green-50 text-green-800"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-6">
        {data && <StorageBar storage={data.storage} />}
        <FileUpload onUpload={handleUpload} disabled={loading} />
        {loading ? (
          <p className="text-sm text-[var(--muted)]">Loading files…</p>
        ) : (
          data && (
            <FileList
              files={data.files}
              onDelete={(file) => setPendingDelete(file)}
              onReplace={handleReplace}
            />
          )
        )}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete file?"
        message={`Are you sure you want to delete "${pendingDelete?.filename}"? This cannot be undone.`}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => setPendingDelete(null)}
      />
    </AppShell>
  );
}
