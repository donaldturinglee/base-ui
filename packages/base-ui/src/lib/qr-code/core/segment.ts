/**
 * Optimal segment mode switching for QR codes
 */

import type { QRSegment } from "./types";
import { getCharCountBits, ALPHANUMERIC_CHARS } from "./tables";

type Mode = "numeric" | "alphanumeric" | "byte";

function bitsPerChar(mode: Mode): number {
    switch (mode) {
        case "numeric":
            return 10 / 3;
        case "alphanumeric":
            return 11 / 2;
        case "byte":
            return 8;
    }
}

function switchCost(version: number, targetMode: Mode): number {
    return 4 + getCharCountBits(version, targetMode);
}

function charMode(char: string): Mode {
    if (char >= "0" && char <= "9") return "numeric";
    if (ALPHANUMERIC_CHARS.includes(char)) return "alphanumeric";
    return "byte";
}

/**
 * Split text into optimized segments that minimize total encoded bit length.
 */
export function optimizeSegments(text: string, version: number): QRSegment[] {
    if (text.length === 0) return [];

    const segments: QRSegment[] = [];
    let currentMode: Mode = charMode(text[0]!);
    let segStart = 0;

    let i = 1;
    while (i < text.length) {
        const cm = charMode(text[i]!);

        if (cm === currentMode) {
            i++;
            continue;
        }

        let runLen = 1;
        let j = i + 1;
        while (j < text.length && charMode(text[j]!) === cm) {
            runLen++;
            j++;
        }

        const costInCurrent = runLen * bitsPerChar(currentMode);
        const costInNew = switchCost(version, cm) + runLen * bitsPerChar(cm);

        if (costInNew < costInCurrent) {
            pushSegment(segments, text, segStart, i, currentMode);
            currentMode = cm;
            segStart = i;
        }

        i = j;
    }

    pushSegment(segments, text, segStart, text.length, currentMode);

    return segments;
}

function pushSegment(
    segments: QRSegment[],
    text: string,
    start: number,
    end: number,
    mode: Mode,
): void {
    const segText = text.substring(start, end);
    const data = new TextEncoder().encode(segText);
    segments.push({
        mode,
        data,
        charCount: mode === "byte" ? data.length : segText.length,
    });
}
