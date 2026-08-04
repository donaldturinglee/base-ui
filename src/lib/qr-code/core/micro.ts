/**
 * Micro QR Code encoder (M1-M4)
 * ISO/IEC 18004 — single finder pattern, reduced quiet zone
 *
 * M1: 11x11, numeric only, error detection only
 * M2: 13x13, numeric/alphanumeric, EC L/M
 * M3: 15x15, numeric/alphanumeric/byte, EC L/M
 * M4: 17x17, numeric/alphanumeric/byte/kanji, EC L/M/Q
 */

import { CapacityError, InvalidInputError } from "./errors";
import { pushBits, encodeNumericData, encodeAlphanumericData, encodeByteData } from "./mode";
import { generateECCodewords } from "./reed-solomon";

export interface MicroQROptions {
  version?: 1 | 2 | 3 | 4;
  ecLevel?: "L" | "M" | "Q";
  mask?: 0 | 1 | 2 | 3;
}

export const MICRO_QR_SIZES = [11, 13, 15, 17] as const;

interface MicroQRCapacity {
  numeric: number;
  alphanumeric: number;
  byte: number;
  dataCW: number;
  ecCW: number;
}

const CAPACITY: Record<number, Record<string, MicroQRCapacity>> = {
  1: {
    _: { numeric: 5, alphanumeric: 0, byte: 0, dataCW: 3, ecCW: 2 },
  },
  2: {
    L: { numeric: 10, alphanumeric: 6, byte: 0, dataCW: 5, ecCW: 5 },
    M: { numeric: 8, alphanumeric: 5, byte: 0, dataCW: 4, ecCW: 6 },
  },
  3: {
    L: { numeric: 23, alphanumeric: 14, byte: 9, dataCW: 11, ecCW: 6 },
    M: { numeric: 18, alphanumeric: 11, byte: 7, dataCW: 9, ecCW: 8 },
  },
  4: {
    L: { numeric: 35, alphanumeric: 21, byte: 15, dataCW: 16, ecCW: 8 },
    M: { numeric: 30, alphanumeric: 18, byte: 13, dataCW: 14, ecCW: 10 },
    Q: { numeric: 21, alphanumeric: 12, byte: 9, dataCW: 10, ecCW: 14 },
  },
};

const CC_BITS: Record<number, Record<string, number>> = {
  1: { numeric: 3 },
  2: { numeric: 4, alphanumeric: 3 },
  3: { numeric: 5, alphanumeric: 4, byte: 4 },
  4: { numeric: 6, alphanumeric: 5, byte: 5 },
};

const SYMBOL_NUMBER: Record<number, Record<string, number>> = {
  1: { _: 0 },
  2: { L: 1, M: 2 },
  3: { L: 3, M: 4 },
  4: { L: 5, M: 6, Q: 7 },
};

const FORMAT_INFO_MICRO: number[] = [
  0x4445, 0x4172, 0x4e2b, 0x4b1c, 0x55ae, 0x5099, 0x5fc0, 0x5af7, 0x6793, 0x62a4, 0x6dfd,
  0x68ca, 0x7678, 0x734f, 0x7c16, 0x7921, 0x06de, 0x03e9, 0x0cb0, 0x0987, 0x1735, 0x1202,
  0x1d5b, 0x186c, 0x2508, 0x203f, 0x2f66, 0x2a51, 0x34e3, 0x31d4, 0x3e8d, 0x3bba,
];

const MICRO_MASK_FNS: ((r: number, c: number) => boolean)[] = [
  (r, _c) => r % 2 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

export function encodeMicroQR(text: string, options: MicroQROptions = {}): boolean[][] {
  if (text.length === 0) {
    throw new InvalidInputError("Micro QR input must not be empty");
  }

  const isNum = /^\d+$/.test(text);
  const isAlpha = !isNum && /^[0-9A-Z $%*+\-./:]+$/.test(text);
  const mode: "numeric" | "alphanumeric" | "byte" = isNum
    ? "numeric"
    : isAlpha
      ? "alphanumeric"
      : "byte";

  const { version, cap, ecKey } = selectMicroVersion(text, mode, options);

  const data = new TextEncoder().encode(text);
  const bits = buildMicroDataBits(text, data, mode, version, cap);

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j++) {
      byte = (byte << 1) | bits[i + j]!;
    }
    dataBytes.push(byte);
  }

  const ecBytes = cap.ecCW > 0 ? generateECCodewords(dataBytes, cap.ecCW) : [];

  const allBits: number[] = [];
  const hasFourBitCW = version === 1 || version === 3;
  if (hasFourBitCW) {
    for (let i = 0; i < dataBytes.length - 1; i++) {
      pushBits(allBits, dataBytes[i]!, 8);
    }
    pushBits(allBits, dataBytes[dataBytes.length - 1]! >> 4, 4);
    for (const ec of ecBytes) {
      pushBits(allBits, ec, 8);
    }
  } else {
    for (const byte of [...dataBytes, ...ecBytes]) {
      pushBits(allBits, byte, 8);
    }
  }

  const matrix = buildFunctionPatterns(version * 2 + 9);
  reserveMicroFormatInfo(matrix, version * 2 + 9);
  placeMicroData(matrix, allBits, version * 2 + 9, version);

  const symbolNum = SYMBOL_NUMBER[version]![ecKey]!;
  const bestMask = selectMicroMask(matrix, version * 2 + 9, options.mask);
  applyMicroMask(matrix, bestMask, version * 2 + 9);
  writeMicroFormatInfo(matrix, symbolNum, bestMask);

  return matrix.map((row) => row.map((cell) => cell === 1));
}

function selectMicroVersion(
  text: string,
  mode: string,
  options: MicroQROptions,
): { version: number; cap: MicroQRCapacity; ecKey: string } {
  const requestedEc = options.ecLevel;

  function getEcKey(v: number): string {
    if (v === 1) return "_";
    if (requestedEc && CAPACITY[v]![requestedEc]) return requestedEc;
    return "L";
  }

  if (options.version) {
    const v = options.version;
    const ecKey = getEcKey(v);
    const cap = CAPACITY[v]?.[ecKey];
    if (!cap) throw new CapacityError(`Micro QR M${v} does not support EC level ${ecKey}`);
    return { version: v, cap, ecKey };
  }

  const dataLen = mode === "byte" ? new TextEncoder().encode(text).length : text.length;

  for (let v = 1; v <= 4; v++) {
    const ecKey = getEcKey(v);
    const cap = CAPACITY[v]![ecKey];
    if (!cap) continue;
    const modeKey = mode as keyof MicroQRCapacity;
    if (typeof cap[modeKey] === "number" && dataLen <= (cap[modeKey] as number)) {
      return { version: v, cap, ecKey };
    }
  }

  throw new CapacityError(`Data too long for Micro QR Code with ${mode} mode`);
}

function buildMicroDataBits(
  text: string,
  data: Uint8Array,
  mode: string,
  version: number,
  cap: MicroQRCapacity,
): number[] {
  const bits: number[] = [];

  if (version === 2) {
    pushBits(bits, mode === "numeric" ? 0 : 1, 1);
  } else if (version === 3) {
    pushBits(bits, mode === "numeric" ? 0 : mode === "alphanumeric" ? 1 : 2, 2);
  } else if (version === 4) {
    pushBits(bits, mode === "numeric" ? 0 : mode === "alphanumeric" ? 1 : 2, 3);
  }

  const ccBits = CC_BITS[version]![mode]!;
  const count = mode === "byte" ? data.length : text.length;
  pushBits(bits, count, ccBits);

  if (mode === "numeric") bits.push(...encodeNumericData(text));
  else if (mode === "alphanumeric") bits.push(...encodeAlphanumericData(text));
  else bits.push(...encodeByteData(data));

  const totalBits = cap.dataCW * 8;
  const termLen = Math.min(
    version === 1 ? 3 : version === 2 ? 5 : version === 3 ? 7 : 9,
    totalBits - bits.length,
  );
  pushBits(bits, 0, termLen);

  if (version === 1 || version === 3) {
    while (bits.length < totalBits) bits.push(0);
  } else {
    while (bits.length % 8 !== 0) bits.push(0);
    let toggle = true;
    while (bits.length < totalBits) {
      pushBits(bits, toggle ? 236 : 17, 8);
      toggle = !toggle;
    }
  }

  return bits;
}

function buildFunctionPatterns(size: number): number[][] {
  const matrix: number[][] = Array.from({ length: size }, () =>
    Array.from<number>({ length: size }).fill(0x2),
  );

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (r === 7 || c === 7) {
        matrix[r]![c] = 0;
      } else {
        const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[r]![c] = isOuter || isInner ? 1 : 0;
      }
    }
  }

  for (let i = 8; i < size; i++) {
    matrix[0]![i] = i % 2 === 0 ? 1 : 0;
    matrix[i]![0] = i % 2 === 0 ? 1 : 0;
  }

  return matrix;
}

function reserveMicroFormatInfo(matrix: number[][], size: number): void {
  for (let i = 1; i <= 8; i++) {
    if (i < size) {
      matrix[8]![i] = 0;
      matrix[i]![8] = 0;
    }
  }
}

function placeMicroData(matrix: number[][], bits: number[], size: number, version: number): void {
  const inc = version === 1 || version === 3 ? 2 : 0;
  let bitIdx = 0;

  for (let right = size - 1; right >= 1; right -= 2) {
    for (let vertical = 0; vertical < size; vertical++) {
      for (let z = 0; z < 2; z++) {
        const j = right - z;
        if (j < 0) continue;
        const upwards = ((right + inc) & 2) === 0;
        const i = upwards ? size - 1 - vertical : vertical;
        if (matrix[i]![j] === 0x2) {
          matrix[i]![j] = bitIdx < bits.length ? bits[bitIdx]! : 0;
          bitIdx++;
        }
      }
    }
  }
}

function isMicroDataModule(_matrix: number[][], r: number, c: number): boolean {
  if (r <= 7 && c <= 7) return false;
  if (r === 0) return false;
  if (c === 0) return false;
  if (r === 8 && c >= 1 && c <= 8) return false;
  if (c === 8 && r >= 1 && r <= 8) return false;
  return true;
}

function evaluateMicroMask(matrix: number[][], size: number): number {
  let sum1 = 0;
  let sum2 = 0;

  for (let i = 1; i < size; i++) {
    sum1 += matrix[i]![size - 1]!;
    sum2 += matrix[size - 1]![i]!;
  }

  return sum1 <= sum2 ? sum1 * 16 + sum2 : sum2 * 16 + sum1;
}

function selectMicroMask(matrix: number[][], size: number, requestedMask?: number): number {
  if (requestedMask !== undefined && requestedMask >= 0 && requestedMask <= 3) {
    return requestedMask;
  }

  let bestMask = 0;
  let bestScore = -1;

  for (let mask = 0; mask < 4; mask++) {
    const copy = matrix.map((row) => [...row]);
    applyMicroMask(copy, mask, size);
    const score = evaluateMicroMask(copy, size);
    if (score > bestScore) {
      bestScore = score;
      bestMask = mask;
    }
  }

  return bestMask;
}

function applyMicroMask(matrix: number[][], mask: number, size: number): void {
  const fn = MICRO_MASK_FNS[mask]!;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isMicroDataModule(matrix, r, c)) {
        if (fn(r, c)) {
          matrix[r]![c] = matrix[r]![c]! ^ 1;
        }
      }
    }
  }
}

function writeMicroFormatInfo(matrix: number[][], symbolNum: number, mask: number): void {
  const formatIdx = (symbolNum << 2) | mask;
  const formatInfo = FORMAT_INFO_MICRO[formatIdx]!;

  for (let i = 0; i < 8; i++) {
    const bit = (formatInfo >> i) & 1;
    matrix[i + 1]![8] = bit;
  }

  for (let i = 0; i < 8; i++) {
    const bit = (formatInfo >> (14 - i)) & 1;
    matrix[8]![i + 1] = bit;
  }
}
