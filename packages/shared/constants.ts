import extensions from "./supported_extensions.json";

export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
export const MAX_ACCOUNT_STORAGE_BYTES = 100 * 1024 * 1024;

const allExtensions = [
  ...extensions.documents,
  ...extensions.spreadsheets,
  ...extensions.source_code,
];

export const SUPPORTED_EXTENSIONS = new Set(
  allExtensions.map((ext) => ext.toLowerCase()),
);

export const SUPPORTED_EXTENSIONS_LIST = Array.from(SUPPORTED_EXTENSIONS).sort();

export function isSupportedExtension(filename: string): boolean {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return false;
  return SUPPORTED_EXTENSIONS.has(filename.slice(dot + 1).toLowerCase());
}

export function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return "";
  return filename.slice(dot + 1).toLowerCase();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
