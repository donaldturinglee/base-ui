/**
 * PNG encoder — assembles valid PNG files from pixel data
 */

import { crc32 } from "./crc32";
import { zlibCompress } from "./deflate";

const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

function createChunk(type: string, data: Uint8Array): Uint8Array {
    const typeBytes = new Uint8Array([
        type.charCodeAt(0),
        type.charCodeAt(1),
        type.charCodeAt(2),
        type.charCodeAt(3),
    ]);
    const chunk = new Uint8Array(4 + 4 + data.length + 4);
    const view = new DataView(chunk.buffer);

    view.setUint32(0, data.length);
    chunk.set(typeBytes, 4);
    chunk.set(data, 8);
    const crcData = new Uint8Array(4 + data.length);
    crcData.set(typeBytes, 0);
    crcData.set(data, 4);
    view.setUint32(8 + data.length, crc32(crcData));

    return chunk;
}

export function encodePNG(
    width: number,
    height: number,
    rows: Uint8Array[],
    fg: [number, number, number],
    bg: [number, number, number],
    useUpFilter = false,
): Uint8Array {
    const ihdrData = new Uint8Array(13);
    const ihdrView = new DataView(ihdrData.buffer);
    ihdrView.setUint32(0, width);
    ihdrView.setUint32(4, height);
    ihdrData[8] = 8;
    ihdrData[9] = 3;
    ihdrData[10] = 0;
    ihdrData[11] = 0;
    ihdrData[12] = 0;

    const plteData = new Uint8Array(6);
    plteData[0] = bg[0];
    plteData[1] = bg[1];
    plteData[2] = bg[2];
    plteData[3] = fg[0];
    plteData[4] = fg[1];
    plteData[5] = fg[2];

    const rawSize = height * (1 + width);
    const rawData = new Uint8Array(rawSize);
    let pos = 0;

    for (let y = 0; y < height; y++) {
        const row = rows[y]!;
        if (useUpFilter && y > 0) {
            const prevRow = rows[y - 1]!;
            rawData[pos++] = 2;
            for (let x = 0; x < width; x++) {
                rawData[pos++] = (row[x]! - prevRow[x]!) & 0xff;
            }
        } else {
            rawData[pos++] = 0;
            rawData.set(row.subarray(0, width), pos);
            pos += width;
        }
    }

    const compressed = zlibCompress(rawData);
    const ihdr = createChunk("IHDR", ihdrData);
    const plte = createChunk("PLTE", plteData);
    const idat = createChunk("IDAT", compressed);
    const iend = createChunk("IEND", new Uint8Array(0));

    const totalLength =
        PNG_SIGNATURE.length + ihdr.length + plte.length + idat.length + iend.length;
    const png = new Uint8Array(totalLength);
    let offset = 0;
    png.set(PNG_SIGNATURE, offset);
    offset += PNG_SIGNATURE.length;
    png.set(ihdr, offset);
    offset += ihdr.length;
    png.set(plte, offset);
    offset += plte.length;
    png.set(idat, offset);
    offset += idat.length;
    png.set(iend, offset);

    return png;
}

export function encodeTrueColorPNG(width: number, height: number, rgba: Uint8Array): Uint8Array {
    const ihdrData = new Uint8Array(13);
    const ihdrView = new DataView(ihdrData.buffer);
    ihdrView.setUint32(0, width);
    ihdrView.setUint32(4, height);
    ihdrData[8] = 8;
    ihdrData[9] = 6;
    ihdrData[10] = 0;
    ihdrData[11] = 0;
    ihdrData[12] = 0;

    const stride = width * 4;
    const rawSize = height * (1 + stride);
    const rawData = new Uint8Array(rawSize);
    let pos = 0;

    for (let y = 0; y < height; y++) {
        rawData[pos++] = 0;
        rawData.set(rgba.subarray(y * stride, y * stride + stride), pos);
        pos += stride;
    }

    const compressed = zlibCompress(rawData);
    const ihdr = createChunk("IHDR", ihdrData);
    const idat = createChunk("IDAT", compressed);
    const iend = createChunk("IEND", new Uint8Array(0));

    const totalLength = PNG_SIGNATURE.length + ihdr.length + idat.length + iend.length;
    const png = new Uint8Array(totalLength);
    let offset = 0;
    png.set(PNG_SIGNATURE, offset);
    offset += PNG_SIGNATURE.length;
    png.set(ihdr, offset);
    offset += ihdr.length;
    png.set(idat, offset);
    offset += idat.length;
    png.set(iend, offset);

    return png;
}
