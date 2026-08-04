/**
 * QR Code format and version info encoding
 * BCH encoding for format info, Golay encoding for version info
 */

import type { Module } from "./matrix";
import type { ErrorCorrectionLevel } from "./types";
import { EC_LEVEL_BITS } from "./types";
import { VERSION_INFO } from "./tables";

const FORMAT_MASK = 0x5412;

/** Generate 15-bit format info for given EC level and mask */
export function generateFormatInfo(ecLevel: ErrorCorrectionLevel, mask: number): number {
  const data = (EC_LEVEL_BITS[ecLevel] << 3) | mask;
  let bch = data << 10;
  let gen = 0x537;

  for (let i = 4; i >= 0; i--) {
    if (bch & (1 << (i + 10))) {
      bch ^= gen << i;
    }
  }

  return ((data << 10) | bch) ^ FORMAT_MASK;
}

/** Write format info to the matrix at the reserved positions */
export function writeFormatInfo(
  matrix: Module[][],
  ecLevel: ErrorCorrectionLevel,
  mask: number,
): void {
  const size = matrix.length;
  const formatInfo = generateFormatInfo(ecLevel, mask);

  const horizontalPositions = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8],
  ];

  for (let i = 0; i < 15; i++) {
    const bit = ((formatInfo >> (14 - i)) & 1) === 1;
    const [r, c] = horizontalPositions[i]!;
    matrix[r]![c] = bit;
  }

  for (let i = 0; i < 7; i++) {
    const bit = ((formatInfo >> (14 - i)) & 1) === 1;
    matrix[size - 1 - i]![8] = bit;
  }

  for (let i = 0; i < 8; i++) {
    const bit = ((formatInfo >> (7 - i)) & 1) === 1;
    matrix[8]![size - 8 + i] = bit;
  }
}

/** Write version info for version 7+ */
export function writeVersionInfo(matrix: Module[][], version: number): void {
  if (version < 7) return;
  const size = matrix.length;
  const versionInfo = VERSION_INFO[version]!;

  for (let i = 0; i < 18; i++) {
    const bit = ((versionInfo >> i) & 1) === 1;
    const row = Math.floor(i / 3);
    const col = i % 3;

    matrix[size - 11 + col]![row] = bit;
    matrix[row]![size - 11 + col] = bit;
  }
}
