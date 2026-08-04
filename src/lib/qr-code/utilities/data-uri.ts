/**
 * Data URI encoding utilities
 */

export function svgToDataURI(svg: string): string {
    const encoded = svg
        .replace(/\s+/g, " ")
        .replace(/%/g, "%25")
        .replace(/"/g, "'")
        .replace(/#/g, "%23")
        .replace(/{/g, "%7B")
        .replace(/}/g, "%7D")
        .replace(/</g, "%3C")
        .replace(/>/g, "%3E");

    return `data:image/svg+xml,${encoded}`;
}

function utf8ToBinary(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }
    return binary;
}

export function svgToBase64(svg: string): string {
    const base64 = btoa(utf8ToBinary(svg));
    return `data:image/svg+xml;base64,${base64}`;
}

export function svgToBase64Raw(svg: string): string {
    return btoa(utf8ToBinary(svg));
}
