"use client";

import { useRef, useState } from "react";
import { isSupportedExtension, SUPPORTED_EXTENSIONS_LIST } from "@shared/constants";

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  disabled?: boolean;
}

export function FileUpload({ onUpload, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    setUploading(true);
    try {
      await onUpload(files);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        dragging ? "border-[var(--primary)] bg-blue-50" : "border-[var(--border)] bg-white"
      } ${disabled || uploading ? "opacity-60 pointer-events-none" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFiles(e.dataTransfer.files);
      }}
    >
      <p className="text-sm font-medium text-slate-900">
        {uploading ? "Uploading…" : "Drag and drop files here"}
      </p>
      <p className="mt-1 text-sm text-[var(--muted)]">or</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-3 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
        disabled={disabled || uploading}
      >
        Browse files
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />
      <p className="mt-4 text-xs text-[var(--muted)]">
        Max 15 MB per file · 100 MB total · Supported: {SUPPORTED_EXTENSIONS_LIST.slice(0, 8).join(", ")}, …
      </p>
    </div>
  );
}

export function validateFilesClientSide(files: File[]): string | null {
  for (const file of files) {
    if (!isSupportedExtension(file.name)) {
      return `Unsupported file type: ${file.name}. Supported extensions include .pdf, .docx, .txt, .csv, .py, and more.`;
    }
    if (file.size > 15 * 1024 * 1024) {
      return `${file.name} exceeds the 15 MB per-file limit.`;
    }
    if (file.size === 0) {
      return `${file.name} is empty.`;
    }
  }
  return null;
}
