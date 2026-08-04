/**
 * QR Code library
 */

import { encodeQR } from "./core/index";
import { renderQRCodeSVG } from "./utilities/svg";
import { renderText } from "./utilities/text";
import { svgToDataURI, svgToBase64 } from "./utilities/data-uri";
import type { QRCodeSVGOptions } from "./types";
import type { QRCodeOptions } from "./core/types";

export function qrcode(text: string, options: QRCodeSVGOptions & QRCodeOptions = {}): string {
    const {
        size,
        margin,
        color,
        background,
        dotType,
        dotSize,
        shape,
        corners,
        logo,
        xmlDeclaration,
        ariaLabel,
        role,
        title,
        desc,
        ...qrOptions
    } = options;
    if (logo && !qrOptions.ecLevel) {
        qrOptions.ecLevel = "H";
    }
    const matrix = encodeQR(text, qrOptions);
    return renderQRCodeSVG(matrix, {
        size,
        margin,
        color,
        background,
        dotType,
        dotSize,
        shape,
        corners,
        logo,
        xmlDeclaration,
        ariaLabel,
        role,
        title,
        desc,
    });
}

export function qrcodeTerminal(text: string, options?: QRCodeOptions): string {
    const matrix = encodeQR(text, options);
    return renderText(matrix);
}

export function qrcodeDataURI(text: string, options?: QRCodeSVGOptions & QRCodeOptions): string {
    return svgToDataURI(qrcode(text, options));
}

export function qrcodeBase64(text: string, options?: QRCodeSVGOptions & QRCodeOptions): string {
    return svgToBase64(qrcode(text, options));
}

export { encodeQR } from "./core/index";
export { encodeMicroQR } from "./core/micro";
export { renderQRCodeSVG } from "./utilities/svg";
export { renderText } from "./utilities/text";
export { svgToDataURI, svgToBase64, svgToBase64Raw } from "./utilities/data-uri";

export type {
    QRCodeSVGOptions,
    DotType,
    GradientOptions,
    CornerOptions,
    LogoOptions,
    TextRenderOptions,
    MeasurementUnit,
} from "./types";
export type { QRCodeOptions, ErrorCorrectionLevel, EncodingMode, QRSegment } from "./core/types";
export type { MicroQROptions } from "./core/micro";
