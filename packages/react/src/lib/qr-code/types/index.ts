export type DotType =
    | "square"
    | "rounded"
    | "dots"
    | "diamond"
    | "classy"
    | "classy-rounded"
    | "extra-rounded"
    | "vertical-line"
    | "horizontal-line"
    | "small-square"
    | "tiny-square";

export interface LinearGradientOptions {
    type: "linear";
    rotation?: number;
    stops: Array<{ offset: number; color: string }>;
}

export interface RadialGradientOptions {
    type: "radial";
    stops: Array<{ offset: number; color: string }>;
}

export type GradientOptions = LinearGradientOptions | RadialGradientOptions;

export interface CornerOptions {
    outerShape?: "square" | "rounded" | "dots" | "extra-rounded" | "classy";
    innerShape?: "square" | "dots" | "rounded";
    outerColor?: string | GradientOptions;
    innerColor?: string | GradientOptions;
}

export interface LogoOptions {
    svg?: string;
    path?: string;
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    size?: number;
    margin?: number;
    hideBackgroundDots?: boolean;
    backgroundColor?: string;
}

export interface SVGAccessibilityOptions {
    ariaLabel?: string;
    role?: string;
    title?: string;
    desc?: string;
}

export interface QRCodeSVGOptions extends SVGAccessibilityOptions {
    size?: number;
    margin?: number;
    unit?: MeasurementUnit;
    color?: string | GradientOptions;
    background?: string | GradientOptions | "transparent";
    dotType?: DotType;
    dotSize?: number;
    shape?: "square" | "circle";
    corners?: {
        topLeft?: CornerOptions;
        topRight?: CornerOptions;
        bottomLeft?: CornerOptions;
    };
    logo?: LogoOptions;
    xmlDeclaration?: boolean;
}

export type MeasurementUnit = "px" | "mm" | "in" | "pt" | "cm";

export interface TextRenderOptions {
    dark?: string;
    light?: string;
    compact?: boolean;
    margin?: number;
    invert?: boolean;
}
