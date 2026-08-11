import type * as React from "react";
import type { CornerOptions, DotType } from "../../lib/qr-code/types";
import type {
    EncodingMode,
    ErrorCorrectionLevel,
    QRCodeOptions,
} from "../../lib/qr-code/core/types";

// What each dark module is drawn as. The square is what a scanner was built to read, and every
// other shape trades a little of that away for the look of the thing, so the further one strays
// from the square the more the code leans on the error correction behind it
export type QRCodeDotType = DotType;

// Which of the eight patterns the modules are laid under. The encoder weighs every one of them
// and keeps whichever reads most evenly, so this is only worth naming to hold a code to a shape
// that is already known
export type QRCodeMask = NonNullable<QRCodeOptions["mask"]>;

// How one of the three finder squares is drawn. The colours are named rather than left to the
// code's own, so a corner can be picked out from the modules around it
export type QRCodeCornerOptions = {
    outerShape?: CornerOptions["outerShape"];
    innerShape?: CornerOptions["innerShape"];
    outerColor?: string;
    innerColor?: string;
};

// The squares a scanner finds the code by. There are three rather than four: the fourth corner
// is left bare, and that is what tells a scanner which way up the code is
export type QRCodeCorners = {
    topLeft?: QRCodeCornerOptions;
    topRight?: QRCodeCornerOptions;
    bottomLeft?: QRCodeCornerOptions;
};

export type QRCodeProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    // What the code carries. It stands as the accessible name where no label is given, since a
    // reader who cannot point a camera at the picture is better told what it holds
    value: string;
    // How wide the code is drawn, in pixels. It is drawn as vectors, so this settles the room it
    // takes rather than how finely it is drawn
    size?: number;
    // The quiet zone around the code, counted in modules. The spec asks for four, and less than
    // that leaves a scanner nothing to tell the code from what surrounds it
    margin?: number;
    // How much of the code can be lost and still read: L a seventh, M a fifth, Q a quarter, H a
    // third. A code carrying a logo is raised to H unless a level is named here
    ecLevel?: ErrorCorrectionLevel;
    // Which of the forty sizes the code is drawn at. Left out, the smallest one the data fits in
    // is taken, which is what keeps the modules as large as they can be
    version?: number;
    // How the data is packed. Digits and upper case letters pack tighter than bytes do, and the
    // encoder picks the tightest the data allows unless it is told otherwise
    mode?: EncodingMode;
    mask?: QRCodeMask;
    dotType?: QRCodeDotType;
    // How much of its own cell a module fills, as a share of it. Anything under one leaves the
    // modules standing apart, which is the look a scanner has the most trouble with
    dotSize?: number;
    corners?: QRCodeCorners;
    // What the modules and the quiet zone are painted. A code is read as dark on light, so both
    // fall back to a fixed black on white rather than following the theme around them
    color?: string;
    background?: string;
    // What sits in the middle of the code. It is laid over the modules rather than drawn into
    // them, so it can be anything React can draw, and the modules beneath it are left out
    logo?: React.ReactNode;
    // How much of the code the logo covers, as a share of it. Past about a third there is more
    // missing than the error correction can make up for
    logoSize?: number;
    // What a screen reader is told the code is. The value stands in where this is left out
    label?: string;
    // What is drawn in place of a code that cannot be made: an empty value, or data too long for
    // the version and the level it was given
    fallback?: React.ReactNode;
    className?: string;
};
