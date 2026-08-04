/**
 * Terminal/text output for QR codes
 */

export interface TextRenderOptions {
  dark?: string;
  light?: string;
  compact?: boolean;
  margin?: number;
  invert?: boolean;
}

export function renderText(matrix: boolean[][], options: TextRenderOptions = {}): string {
  const { compact = true, margin = 2, invert = false } = options;
  const size = matrix.length;

  if (compact) {
    return renderCompact(matrix, size, margin, invert);
  }

  const dark = options.dark ?? "██";
  const light = options.light ?? "  ";
  const d = invert ? light : dark;
  const l = invert ? dark : light;
  const lines: string[] = [];

  for (let m = 0; m < margin; m++) {
    lines.push(l.repeat(size + margin * 2));
  }

  for (let r = 0; r < size; r++) {
    let line = l.repeat(margin);
    for (let c = 0; c < size; c++) {
      line += matrix[r]![c] ? d : l;
    }
    line += l.repeat(margin);
    lines.push(line);
  }

  for (let m = 0; m < margin; m++) {
    lines.push(l.repeat(size + margin * 2));
  }

  return lines.join("\n");
}

function renderCompact(
  matrix: boolean[][],
  size: number,
  margin: number,
  invert: boolean,
): string {
  // Use Unicode half-block characters: ▀ (upper filled), ▄ (lower filled), █ (both filled), space (neither)
  const BOTH = invert ? " " : "█";
  const TOP = invert ? "▄" : "▀";
  const BOT = invert ? "▀" : "▄";
  const NONE = invert ? "█" : " ";

  const lines: string[] = [];
  const totalCols = size + margin * 2;

  const getModule = (r: number, c: number): boolean => {
    if (r < margin || r >= size + margin || c < margin || c >= size + margin) return false;
    return !!matrix[r - margin]![c - margin];
  };

  const totalRows = size + margin * 2;
  for (let r = 0; r < totalRows; r += 2) {
    let line = "";
    for (let c = 0; c < totalCols; c++) {
      const top = getModule(r, c);
      const bot = r + 1 < totalRows ? getModule(r + 1, c) : false;
      if (top && bot) line += BOTH;
      else if (top) line += TOP;
      else if (bot) line += BOT;
      else line += NONE;
    }
    lines.push(line);
  }

  return lines.join("\n");
}
