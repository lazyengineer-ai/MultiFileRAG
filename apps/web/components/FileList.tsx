"use client";

import { formatBytes } from "@shared/constants";
import type { FileRecord } from "@/types/next-auth";

interface FileListProps {
  files: FileRecord[];
  onDelete: (file: FileRecord) => void;
  onReplace: (file: FileRecord, newFile: File) => Promise<void>;
}

const STATUS_STYLES: Record<FileRecord["status"], string> = {
  uploading: "bg-slate-100 text-slate-700",
  processing: "bg-amber-100 text-amber-800",
  ready: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export function FileList({ files, onDelete, onReplace }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="rounded-lg border border-[var(--border)] bg-white p-8 text-center text-sm text-[var(--muted)]">
        No files yet. Upload documents, spreadsheets, or code files to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border)] bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--border)] bg-slate-50 text-[var(--muted)]">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Size</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Uploaded</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id} className="border-b border-[var(--border)] last:border-0">
              <td className="px-4 py-3 font-medium text-slate-900">{file.filename}</td>
              <td className="px-4 py-3 text-[var(--muted)]">{formatBytes(file.size_bytes)}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[file.status]}`}
                >
                  {file.status}
                </span>
              </td>
              <td className="px-4 py-3 text-[var(--muted)]">
                {new Date(file.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <label className="cursor-pointer rounded-md border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-slate-50">
                    Replace
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files?.[0];
                        if (selected) void onReplace(file, selected);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onDelete(file)}
                    className="rounded-md border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--danger)] hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
