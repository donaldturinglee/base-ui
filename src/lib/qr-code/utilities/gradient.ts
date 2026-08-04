/**
 * SVG gradient generation
 */

import type { GradientOptions, LinearGradientOptions, RadialGradientOptions } from "../types";
import { escapeAttr } from "./common";

let gradientCounter = 0;

function nextGradientId(): string {
  return `qr-grad-${gradientCounter++}`;
}

export function resetGradientCounter(): void {
  gradientCounter = 0;
}

export function isGradient(color: string | GradientOptions | undefined): color is GradientOptions {
  return typeof color === "object" && color !== null && "type" in color;
}

export function generateGradientDef(options: GradientOptions): { id: string; svg: string } {
  const id = nextGradientId();
  if (options.type === "linear") {
    return { id, svg: generateLinearGradient(id, options) };
  } else {
    return { id, svg: generateRadialGradient(id, options) };
  }
}

function generateLinearGradient(id: string, options: LinearGradientOptions): string {
  const rotation = options.rotation ?? 0;
  const rad = (rotation * Math.PI) / 180;
  const x1 = Math.round((50 - Math.sin(rad) * 50) * 100) / 100;
  const y1 = Math.round((50 + Math.cos(rad) * 50) * 100) / 100;
  const x2 = Math.round((50 + Math.sin(rad) * 50) * 100) / 100;
  const y2 = Math.round((50 - Math.cos(rad) * 50) * 100) / 100;

  const stops = options.stops
    .map((s) => `<stop offset="${s.offset * 100}%" stop-color="${escapeAttr(s.color)}"/>`)
    .join("");

  return `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stops}</linearGradient>`;
}

function generateRadialGradient(id: string, options: RadialGradientOptions): string {
  const stops = options.stops
    .map((s) => `<stop offset="${s.offset * 100}%" stop-color="${escapeAttr(s.color)}"/>`)
    .join("");

  return `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`;
}
