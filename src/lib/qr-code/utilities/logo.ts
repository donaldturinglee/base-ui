/**
 * Logo embedding in QR codes
 */

import { InvalidInputError } from "../core/errors";
import type { LogoOptions } from "../types";
import { escapeAttr } from "./common";
import { icoToPngDataURI } from "./ico";

const SVG_DANGEROUS_PATTERN = /<script[\s>]|javascript:|on[a-z]+\s*=|<foreignObject[\s>]/i;

export interface LogoPlacement {
    svg: string;
    hiddenModules: Set<string>;
}

export function calculateLogoPlacement(
    options: LogoOptions,
    moduleCount: number,
    moduleSize: number,
    margin: number,
): LogoPlacement {
    const logoSize = options.size ?? 0.3;
    const logoMargin = options.margin ?? 0;
    const hideBackground = options.hideBackgroundDots ?? true;

    const totalSize = moduleCount * moduleSize;
    const logoPixelSize = totalSize * logoSize;
    const logoX = margin * moduleSize + (totalSize - logoPixelSize) / 2;
    const logoY = margin * moduleSize + (totalSize - logoPixelSize) / 2;

    const hiddenModules = new Set<string>();

    if (hideBackground) {
        const startModule = Math.floor(
            (moduleCount - moduleCount * logoSize) / 2 - logoMargin / moduleSize,
        );
        const endModule = Math.ceil(
            (moduleCount + moduleCount * logoSize) / 2 + logoMargin / moduleSize,
        );

        for (let r = Math.max(0, startModule); r < Math.min(moduleCount, endModule); r++) {
            for (let c = Math.max(0, startModule); c < Math.min(moduleCount, endModule); c++) {
                hiddenModules.add(`${r},${c}`);
            }
        }
    }

    let svg = "";

    if (options.backgroundColor) {
        const bgPad = logoMargin;
        const bgSize = logoPixelSize + 2 * bgPad;
        const bgPos = `x="${logoX - bgPad}" y="${logoY - bgPad}"`;
        const bgFill = `fill="${escapeAttr(options.backgroundColor)}"`;
        svg += `<rect ${bgPos} width="${bgSize}" height="${bgSize}" ${bgFill} rx="4"/>`;
    }

    if (options.svg) {
        if (SVG_DANGEROUS_PATTERN.test(options.svg)) {
            throw new InvalidInputError(
                "logo.svg contains potentially dangerous content " +
                    "(script, event handlers, or foreignObject)",
            );
        }
        const logoPos = `x="${logoX}" y="${logoY}"`;
        const logoDim = `width="${logoPixelSize}" height="${logoPixelSize}"`;
        svg += `<svg ${logoPos} ${logoDim} viewBox="0 0 1 1">`;
        svg += `<g transform="scale(${1})">${options.svg}</g></svg>`;
    } else if (options.path) {
        const pathData = escapeAttr(options.path);
        const transform = `translate(${logoX},${logoY}) scale(${logoPixelSize / 100})`;
        svg += `<path d="${pathData}" transform="${transform}" fill="currentColor"/>`;
    } else if (options.imageUrl) {
        if (!/^(https?:|data:image\/)/i.test(options.imageUrl)) {
            throw new InvalidInputError("imageUrl must use https:, http:, or data:image/ scheme");
        }
        const icoMatch = options.imageUrl.match(
            /^data:image\/(x-icon|vnd\.microsoft\.icon);base64,(.+)$/i,
        );
        let imageUrl = options.imageUrl;
        if (icoMatch) {
            const binary = atob(icoMatch[2]!);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            imageUrl = icoToPngDataURI(bytes);
        }
        const imgW = options.imageWidth ?? logoPixelSize;
        const imgH = options.imageHeight ?? logoPixelSize;
        const imgX = logoX + (logoPixelSize - imgW) / 2;
        const imgY = logoY + (logoPixelSize - imgH) / 2;
        const imgHref = `href="${escapeAttr(imageUrl)}"`;
        const imgPos = `x="${imgX}" y="${imgY}"`;
        svg += `<image ${imgHref} ${imgPos} width="${imgW}" height="${imgH}"/>`;
    }

    return { svg, hiddenModules };
}
