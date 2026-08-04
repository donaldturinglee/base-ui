/**
 * ICO/BMP to PNG converter for logo embedding
 */

import { encodeTrueColorPNG } from "./png-encoder";

const PNG_SIGNATURE = 0x89504e47;

interface ICOEntry {
  width: number;
  height: number;
  size: number;
  offset: number;
}

export function icoToPngDataURI(icoData: Uint8Array): string {
  const view = new DataView(icoData.buffer, icoData.byteOffset, icoData.byteLength);

  const reserved = view.getUint16(0, true);
  const type = view.getUint16(2, true);
  const count = view.getUint16(4, true);

  if (reserved !== 0 || (type !== 1 && type !== 2) || count === 0) {
    throw new Error("Invalid ICO file");
  }

  let best: ICOEntry | undefined;
  for (let i = 0; i < count; i++) {
    const off = 6 + i * 16;
    const w = view.getUint8(off) || 256;
    const h = view.getUint8(off + 1) || 256;
    const size = view.getUint32(off + 8, true);
    const dataOffset = view.getUint32(off + 12, true);
    if (!best || w * h > best.width * best.height) {
      best = { width: w, height: h, size, offset: dataOffset };
    }
  }

  const entry = best!;
  const entryData = icoData.subarray(entry.offset, entry.offset + entry.size);

  if (entryData.length >= 4 && view.getUint32(entry.offset) === PNG_SIGNATURE) {
    return `data:image/png;base64,${uint8ToBase64(entryData)}`;
  }

  return dibToPngDataURI(entryData, entry.width, entry.height);
}

function dibToPngDataURI(dib: Uint8Array, entryW: number, entryH: number): string {
  const view = new DataView(dib.buffer, dib.byteOffset, dib.byteLength);

  const headerSize = view.getUint32(0, true);
  const bmpWidth = view.getInt32(4, true);
  const width = bmpWidth || entryW;
  const height = entryH;
  const bpp = view.getUint16(14, true);
  const compression = view.getUint32(16, true);

  if (compression !== 0 && compression !== 3) {
    throw new Error(`Unsupported BMP compression: ${compression}`);
  }

  const rgba = new Uint8Array(width * height * 4);

  if (bpp === 32) {
    decode32bpp(dib, headerSize, width, height, rgba);
  } else if (bpp === 24) {
    decode24bpp(dib, headerSize, width, height, rgba);
  } else if (bpp <= 8) {
    decodeIndexed(dib, headerSize, width, height, bpp, rgba);
  } else {
    throw new Error(`Unsupported BMP bit depth: ${bpp}`);
  }

  if (bpp < 32) {
    const pixelDataSize = getPixelDataSize(width, height, bpp);
    const andMaskOffset = headerSize + getColorTableSize(dib, headerSize, bpp) + pixelDataSize;
    if (andMaskOffset < dib.length) {
      applyAndMask(dib, andMaskOffset, width, height, rgba);
    }
  }

  const png = encodeTrueColorPNG(width, height, rgba);
  return `data:image/png;base64,${uint8ToBase64(png)}`;
}

function decode32bpp(dib: Uint8Array, headerSize: number, width: number, height: number, rgba: Uint8Array): void {
  const offset = headerSize;
  const stride = width * 4;
  for (let y = 0; y < height; y++) {
    const srcRow = offset + (height - 1 - y) * stride;
    const dstRow = y * width * 4;
    for (let x = 0; x < width; x++) {
      const si = srcRow + x * 4;
      const di = dstRow + x * 4;
      rgba[di] = dib[si + 2]!;
      rgba[di + 1] = dib[si + 1]!;
      rgba[di + 2] = dib[si]!;
      rgba[di + 3] = dib[si + 3]!;
    }
  }
}

function decode24bpp(dib: Uint8Array, headerSize: number, width: number, height: number, rgba: Uint8Array): void {
  const colorTableSize = getColorTableSize(dib, headerSize, 24);
  const offset = headerSize + colorTableSize;
  const rowStride = Math.ceil((width * 3) / 4) * 4;
  for (let y = 0; y < height; y++) {
    const srcRow = offset + (height - 1 - y) * rowStride;
    const dstRow = y * width * 4;
    for (let x = 0; x < width; x++) {
      const si = srcRow + x * 3;
      const di = dstRow + x * 4;
      rgba[di] = dib[si + 2]!;
      rgba[di + 1] = dib[si + 1]!;
      rgba[di + 2] = dib[si]!;
      rgba[di + 3] = 255;
    }
  }
}

function decodeIndexed(dib: Uint8Array, headerSize: number, width: number, height: number, bpp: number, rgba: Uint8Array): void {
  const colorTableSize = getColorTableSize(dib, headerSize, bpp);
  const colorTable = dib.subarray(headerSize, headerSize + colorTableSize);
  const pixelOffset = headerSize + colorTableSize;
  const rowStride = Math.ceil((width * bpp) / 32) * 4;
  for (let y = 0; y < height; y++) {
    const srcRow = pixelOffset + (height - 1 - y) * rowStride;
    const dstRow = y * width * 4;
    for (let x = 0; x < width; x++) {
      let idx: number;
      if (bpp === 8) {
        idx = dib[srcRow + x]!;
      } else if (bpp === 4) {
        const byte = dib[srcRow + (x >> 1)]!;
        idx = x & 1 ? byte & 0x0f : (byte >> 4) & 0x0f;
      } else {
        const byte = dib[srcRow + (x >> 3)]!;
        idx = (byte >> (7 - (x & 7))) & 1;
      }
      const ci = idx * 4;
      const di = dstRow + x * 4;
      rgba[di] = colorTable[ci + 2]!;
      rgba[di + 1] = colorTable[ci + 1]!;
      rgba[di + 2] = colorTable[ci]!;
      rgba[di + 3] = 255;
    }
  }
}

function getColorTableSize(dib: Uint8Array, headerSize: number, bpp: number): number {
  if (bpp >= 16) return 0;
  const view = new DataView(dib.buffer, dib.byteOffset, dib.byteLength);
  const colorsUsed = headerSize >= 36 ? view.getUint32(32, true) : 0;
  const count = colorsUsed || 1 << bpp;
  return count * 4;
}

function getPixelDataSize(width: number, height: number, bpp: number): number {
  const rowStride = Math.ceil((width * bpp) / 32) * 4;
  return rowStride * height;
}

function applyAndMask(dib: Uint8Array, maskOffset: number, width: number, height: number, rgba: Uint8Array): void {
  const maskStride = Math.ceil(width / 32) * 4;
  for (let y = 0; y < height; y++) {
    const srcRow = maskOffset + (height - 1 - y) * maskStride;
    const dstRow = y * width * 4;
    for (let x = 0; x < width; x++) {
      const byteIdx = srcRow + (x >> 3);
      if (byteIdx >= dib.length) return;
      const bit = (dib[byteIdx]! >> (7 - (x & 7))) & 1;
      if (bit === 1) rgba[dstRow + x * 4 + 3] = 0;
    }
  }
}

function uint8ToBase64(data: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]!);
  }
  return btoa(binary);
}
