import type { UploadRejection } from "./Upload.types";

// Files are measured in steps of 1024, the way a file system reports them
const FILE_SIZE_STEP = 1024;

const FILE_SIZE_UNITS = ["bytes", "KB", "MB", "GB", "TB"];

// Pure, so a size can be worked out while rendering rather than kept in state
export const formatFileSize = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return `0 ${FILE_SIZE_UNITS[0]}`;
    }

    let value = bytes;
    let unit = 0;

    while (value >= FILE_SIZE_STEP && unit < FILE_SIZE_UNITS.length - 1) {
        value /= FILE_SIZE_STEP;
        unit += 1;
    }

    // Bytes are counted whole; anything above them is worth a decimal place, though a
    // trailing zero says nothing and is dropped
    const rounded = unit === 0 ? Math.round(value) : Math.round(value * 10) / 10;

    return `${rounded} ${FILE_SIZE_UNITS[unit]}`;
};

// Whether a file is one of the types the control takes. The `accept` attribute filters what
// the picker offers but says nothing about what is dropped on the control, so the same three
// rules are applied here: a suffix, a whole type, or a type and a subtype
export const isFileAccepted = (file: File, accept?: string): boolean => {
    const patterns = (accept ?? "")
        .split(",")
        .map((pattern) => pattern.trim().toLowerCase())
        .filter(Boolean);

    // A control that names no types takes them all
    if (patterns.length === 0) {
        return true;
    }

    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return patterns.some((pattern) => {
        if (pattern.startsWith(".")) {
            return name.endsWith(pattern);
        }

        if (pattern.endsWith("/*")) {
            return type.startsWith(pattern.slice(0, -1));
        }

        return type === pattern;
    });
};

export type FileTriage = {
    accepted: File[];
    rejected: UploadRejection[];
};

export type FileTriageOptions = {
    accept?: string;
    maxSize?: number;
    multiple?: boolean;
};

// Sorts what the reader handed over into what the control takes and what it turns away. A
// control that takes one file at a time keeps the first of them and turns the rest away
// rather than dropping them quietly, so a reader who let go of a folder is told why only one
// of it arrived
export const triageFiles = (files: File[], options: FileTriageOptions): FileTriage => {
    const { accept, maxSize, multiple } = options;

    const accepted: File[] = [];
    const rejected: UploadRejection[] = [];

    files.forEach((file) => {
        if (!isFileAccepted(file, accept)) {
            rejected.push({ file, reason: "type" });
            return;
        }

        if (maxSize !== undefined && file.size > maxSize) {
            rejected.push({ file, reason: "size" });
            return;
        }

        if (!multiple && accepted.length > 0) {
            rejected.push({ file, reason: "count" });
            return;
        }

        accepted.push(file);
    });

    return { accepted, rejected };
};
