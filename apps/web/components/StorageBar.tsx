import type { StorageSummary } from "@/types/next-auth";

interface StorageBarProps {
  storage: StorageSummary;
}

export function StorageBar({ storage }: StorageBarProps) {
  const percent = Math.min(100, (storage.used_bytes / storage.max_bytes) * 100);
  const isNearLimit = percent >= 90;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-900">Storage</span>
        <span className={isNearLimit ? "text-[var(--danger)] font-medium" : "text-[var(--muted)]"}>
          {storage.used_mb} MB / {storage.max_mb} MB
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${
            isNearLimit ? "bg-[var(--danger)]" : "bg-[var(--primary)]"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
