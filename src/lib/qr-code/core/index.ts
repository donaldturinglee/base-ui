/**
 * QR Code core encoder — main entry point
 */

export type { ErrorCorrectionLevel, EncodingMode, QRCodeOptions, QRSegment } from "./types";
export { encodeData } from "./data";
export { createMatrix, placeFunctionPatterns, placeData } from "./matrix";
export { selectBestMask, applyMask } from "./mask";
export { writeFormatInfo, writeVersionInfo } from "./format";
export { encodeMicroQR } from "./micro";
export type { MicroQROptions } from "./micro";

import type { QRCodeOptions } from "./types";
import { encodeData } from "./data";
import { createMatrix, placeFunctionPatterns, placeData } from "./matrix";
import { selectBestMask, applyMask } from "./mask";
import { writeFormatInfo, writeVersionInfo } from "./format";

/**
 * Encode text into a QR code matrix.
 * Returns a 2D boolean array — true = dark module.
 */
export function encodeQR(text: string, options: QRCodeOptions = {}): boolean[][] {
  const { version, ecLevel, bits } = encodeData(text, options);
  const size = version * 4 + 17;
  const matrix = createMatrix(size);
  placeFunctionPatterns(matrix, version);
  placeData(matrix, bits, version);
  const bestMask = selectBestMask(matrix, size, version, options.mask);
  applyMask(matrix, bestMask, size, version);
  writeFormatInfo(matrix, ecLevel, bestMask);
  if (version >= 7) writeVersionInfo(matrix, version);
  return matrix.map((row) => row.map((cell) => cell === true));
}
