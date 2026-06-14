import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & {
      id?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    userId?: string;
  }
}

export type FileStatus = "uploading" | "processing" | "ready" | "failed";

export interface FileRecord {
  id: string;
  filename: string;
  extension: string;
  size_bytes: number;
  status: FileStatus;
  error_message: string | null;
  created_at: string;
}

export interface StorageSummary {
  used_bytes: number;
  max_bytes: number;
  used_mb: number;
  max_mb: number;
}

export interface FileListResponse {
  files: FileRecord[];
  storage: StorageSummary;
}

export interface ApiError {
  detail: string;
}
