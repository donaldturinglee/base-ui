/**
 * QR Code SVG renderer with styling support
 */

import type { QRCodeSVGOptions, CornerOptions } from "../types";
import { getModulePath, getFinderOuterPath, getFinderInnerPath } from "./shapes";
import { isGradient, generateGradientDef, resetGradientCounter } from "./gradient";
import { calculateLogoPlacement } from "./logo";
import { escapeAttr } from "./common";

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function renderQRCodeSVG(matrix: boolean[][], options: QRCodeSVGOptions = {}): string {
    const {
        size = 200,
        color = "#000",
        background = "#fff",
        margin = 4,
        dotType = "square",
        dotSize = 1,
        shape = "square",
        corners,
        logo,
        xmlDeclaration = false,
        unit,
        ariaLabel,
        role = "img",
        title,
        desc,
    } = options;

    resetGradientCounter();

    const moduleCount = matrix.length;
    const totalModules = moduleCount + margin * 2;
    const moduleSize = size / totalModules;
    const sizeAttr = unit ? `${size}${unit}` : `${size}`;

    const defs: string[] = [];
    const parts: string[] = [];

    if (xmlDeclaration) {
        parts.push('<?xml version="1.0" encoding="UTF-8"?>');
    }

    let svgOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"`;
    svgOpen += ` width="${sizeAttr}" height="${sizeAttr}" role="${escapeAttr(role)}"`;
    if (ariaLabel) {
        svgOpen += ` aria-label="${escapeAttr(ariaLabel)}"`;
    }
    svgOpen += ">";

    parts.push(svgOpen);

    if (title) {
        parts.push(`<title>${escapeXml(title)}</title>`);
    }
    if (desc) {
        parts.push(`<desc>${escapeXml(desc)}</desc>`);
    }

    if (background !== "transparent") {
        if (isGradient(background)) {
            const grad = generateGradientDef(background);
            defs.push(grad.svg);
            parts.push(`<rect width="100%" height="100%" fill="url(#${grad.id})"/>`);
        } else {
            parts.push(
                `<rect width="100%" height="100%" fill="${escapeAttr(background as string)}"/>`,
            );
        }
    }

    let moduleColor = "#000";
    if (isGradient(color)) {
        const grad = generateGradientDef(color);
        defs.push(grad.svg);
        moduleColor = `url(#${grad.id})`;
    } else {
        moduleColor = escapeAttr(color as string);
    }

    let hiddenModules: Set<string> | undefined;
    let logoSvg = "";
    if (logo) {
        const placement = calculateLogoPlacement(logo, moduleCount, moduleSize, margin);
        hiddenModules = placement.hiddenModules;
        logoSvg = placement.svg;
    }

    const finderPositions = [
        { row: 0, col: 0, key: "topLeft" as const },
        { row: 0, col: moduleCount - 7, key: "topRight" as const },
        { row: moduleCount - 7, col: 0, key: "bottomLeft" as const },
    ];

    const finderModules = new Set<string>();
    for (const fp of finderPositions) {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                finderModules.add(`${fp.row + r},${fp.col + c}`);
            }
        }
    }

    if (corners) {
        for (const fp of finderPositions) {
            const cornerOpts: CornerOptions | undefined = corners[fp.key];
            const x = (fp.col + margin) * moduleSize;
            const y = (fp.row + margin) * moduleSize;

            const outerShape = cornerOpts?.outerShape ?? "square";
            let outerColor = moduleColor;
            if (cornerOpts?.outerColor) {
                if (isGradient(cornerOpts.outerColor)) {
                    const grad = generateGradientDef(cornerOpts.outerColor);
                    defs.push(grad.svg);
                    outerColor = `url(#${grad.id})`;
                } else {
                    outerColor = escapeAttr(cornerOpts.outerColor);
                }
            }
            const outerPath = getFinderOuterPath(x, y, moduleSize, outerShape);
            parts.push(`<path d="${outerPath}" fill="${outerColor}" fill-rule="evenodd"/>`);

            const innerShape = cornerOpts?.innerShape ?? "square";
            let innerColor = moduleColor;
            if (cornerOpts?.innerColor) {
                if (isGradient(cornerOpts.innerColor)) {
                    const grad = generateGradientDef(cornerOpts.innerColor);
                    defs.push(grad.svg);
                    innerColor = `url(#${grad.id})`;
                } else {
                    innerColor = escapeAttr(cornerOpts.innerColor);
                }
            }
            const innerPath = getFinderInnerPath(x, y, moduleSize, innerShape);
            parts.push(`<path d="${innerPath}" fill="${innerColor}"/>`);
        }
    } else {
        finderModules.clear();
    }

    const pathParts: string[] = [];
    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (!matrix[r]![c]) continue;
            if (hiddenModules?.has(`${r},${c}`)) continue;
            if (finderModules.has(`${r},${c}`)) continue;

            const x = (c + margin) * moduleSize;
            const y = (r + margin) * moduleSize;
            pathParts.push(getModulePath(x, y, moduleSize, dotType, dotSize));
        }
    }

    if (pathParts.length > 0) {
        parts.push(`<path d="${pathParts.join("")}" fill="${moduleColor}"/>`);
    }

    if (logoSvg) {
        parts.push(logoSvg);
    }

    if (shape === "circle") {
        const cx = size / 2;
        const cy = size / 2;
        const r = size / 2;
        defs.push(
            `<clipPath id="qr-circle-clip"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath>`,
        );
        let bgIndex = xmlDeclaration ? 2 : 1;
        if (title) bgIndex++;
        if (desc) bgIndex++;
        const contentStart = background !== "transparent" ? bgIndex + 1 : bgIndex;
        const content = parts.splice(contentStart);
        parts.push('<g clip-path="url(#qr-circle-clip)">');
        parts.push(...content);
        parts.push("</g>");
    }

    if (defs.length > 0) {
        const defsIndex = xmlDeclaration ? 2 : 1;
        parts.splice(defsIndex, 0, `<defs>${defs.join("")}</defs>`);
    }

    parts.push("</svg>");
    return parts.join("");
}
