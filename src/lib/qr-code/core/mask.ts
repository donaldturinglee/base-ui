/**
 * QR Code mask patterns and penalty evaluation
 * 8 mask patterns, 4 penalty rules
 */

import type { Module } from "./matrix";
import { isDataModule } from "./matrix";

/** Get mask function for a given mask pattern (0-7) */
export function getMaskFn(mask: number): (r: number, c: number) => boolean {
    switch (mask) {
        case 0:
            return (r, c) => (r + c) % 2 === 0;
        case 1:
            return (r) => r % 2 === 0;
        case 2:
            return (_, c) => c % 3 === 0;
        case 3:
            return (r, c) => (r + c) % 3 === 0;
        case 4:
            return (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
        case 5:
            return (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0;
        case 6:
            return (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
        case 7:
            return (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
        default:
            return () => false;
    }
}

/** Apply a mask pattern to the matrix (only data modules) */
export function applyMask(matrix: Module[][], mask: number, size: number, version: number): void {
    const fn = getMaskFn(mask);
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (isDataModule(r, c, size, version)) {
                if (fn(r, c)) {
                    matrix[r]![c] = !matrix[r]![c];
                }
            }
        }
    }
}

/**
 * Select the best mask pattern by evaluating all 8 masks
 * Returns the mask number with the lowest penalty score
 */
export function selectBestMask(
    matrix: Module[][],
    size: number,
    version: number,
    requestedMask?: number,
): number {
    if (requestedMask !== undefined && requestedMask >= 0 && requestedMask <= 7) {
        return requestedMask;
    }

    let bestMask = 0;
    let bestScore = Infinity;

    for (let mask = 0; mask < 8; mask++) {
        const copy = matrix.map((row) => [...row]);
        applyMask(copy, mask, size, version);
        const score = evaluatePenalty(copy, size);
        if (score < bestScore) {
            bestScore = score;
            bestMask = mask;
        }
    }

    return bestMask;
}

/**
 * Evaluate penalty score for a masked matrix
 * Implements all 4 penalty rules from the QR code spec
 */
export function evaluatePenalty(matrix: Module[][], size: number): number {
    return (
        penaltyRule1(matrix, size) +
        penaltyRule2(matrix, size) +
        penaltyRule3(matrix, size) +
        penaltyRule4(matrix, size)
    );
}

function penaltyRule1(matrix: Module[][], size: number): number {
    let score = 0;

    for (let r = 0; r < size; r++) {
        let count = 1;
        for (let c = 1; c < size; c++) {
            if (!!matrix[r]![c] === !!matrix[r]![c - 1]) {
                count++;
                if (count === 5) score += 3;
                else if (count > 5) score++;
            } else {
                count = 1;
            }
        }
    }

    for (let c = 0; c < size; c++) {
        let count = 1;
        for (let r = 1; r < size; r++) {
            if (!!matrix[r]![c] === !!matrix[r - 1]![c]) {
                count++;
                if (count === 5) score += 3;
                else if (count > 5) score++;
            } else {
                count = 1;
            }
        }
    }

    return score;
}

function penaltyRule2(matrix: Module[][], size: number): number {
    let score = 0;

    for (let r = 0; r < size - 1; r++) {
        for (let c = 0; c < size - 1; c++) {
            const val = !!matrix[r]![c];
            if (
                val === !!matrix[r]![c + 1] &&
                val === !!matrix[r + 1]![c] &&
                val === !!matrix[r + 1]![c + 1]
            ) {
                score += 3;
            }
        }
    }

    return score;
}

function penaltyRule3(matrix: Module[][], size: number): number {
    let score = 0;
    const pattern1 = [true, false, true, true, true, false, true, false, false, false, false];
    const pattern2 = [false, false, false, false, true, false, true, true, true, false, true];

    for (let r = 0; r < size; r++) {
        for (let c = 0; c <= size - 11; c++) {
            let match1 = true;
            let match2 = true;
            for (let k = 0; k < 11; k++) {
                if (!!matrix[r]![c + k] !== pattern1[k]) match1 = false;
                if (!!matrix[r]![c + k] !== pattern2[k]) match2 = false;
            }
            if (match1 || match2) score += 40;
        }
    }

    for (let c = 0; c < size; c++) {
        for (let r = 0; r <= size - 11; r++) {
            let match1 = true;
            let match2 = true;
            for (let k = 0; k < 11; k++) {
                if (!!matrix[r + k]![c] !== pattern1[k]) match1 = false;
                if (!!matrix[r + k]![c] !== pattern2[k]) match2 = false;
            }
            if (match1 || match2) score += 40;
        }
    }

    return score;
}

function penaltyRule4(matrix: Module[][], size: number): number {
    let dark = 0;
    const total = size * size;
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r]![c]) dark++;
        }
    }
    const ratio = dark / total;
    const prev = Math.floor(ratio * 20) * 5;
    const next = Math.ceil(ratio * 20) * 5;
    return Math.min(Math.abs(prev - 50), Math.abs(next - 50)) * 2;
}
