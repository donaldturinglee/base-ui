import * as React from "react";
import { encodeQR } from "../../lib/qr-code/core/index";
import { calculateLogoPlacement } from "../../lib/qr-code/utilities/logo";
import {
    getFinderInnerPath,
    getFinderOuterPath,
    getModulePath,
} from "../../lib/qr-code/utilities/shapes";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { QRCodeCornerOptions, QRCodeProps } from "./QRCode.types";

const classes = {
    root: "qr-code",
    canvas: "qr-code-canvas",
    background: "qr-code-background",
    modules: "qr-code-modules",
    corner: "qr-code-corner",
    logo: "qr-code-logo",
    fallback: "qr-code-fallback",
};

// The library's own defaults, so a code drawn here is the code the library would have drawn
const DEFAULT_SIZE = 200;
const DEFAULT_MARGIN = 4;
const DEFAULT_LOGO_SIZE = 0.3;

// A finder square is seven modules to a side, in every version of the spec
const FINDER_SIZE = 7;

// Which of the three corners a finder sits in, read off the size of the code. The fourth corner
// carries no finder, which is what a scanner reads the orientation from
const getFinderPositions = (moduleCount: number) =>
    [
        { key: "topLeft", row: 0, col: 0 },
        { key: "topRight", row: 0, col: moduleCount - FINDER_SIZE },
        { key: "bottomLeft", row: moduleCount - FINDER_SIZE, col: 0 },
    ] as const;

// A code drawn as vectors from a string, with the modules, the corners and the middle each open
// to being drawn differently from the rest.
//
// The picture is kept from a screen reader and the whole is named instead, since a reader who
// cannot point a camera at a code is better told what it carries than what it looks like. The
// value stands as that name unless a label says otherwise.
//
// Colour comes through custom properties rather than being drawn in, so a caller can repaint a
// code from a stylesheet. What it falls back to is a fixed black on white rather than the theme
// around it: a scanner reads a code as dark on light, and one that inverted with the theme would
// stop being read in half the places it was put
function QRCode(
    props: QRCodeProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        value,
        size = DEFAULT_SIZE,
        margin = DEFAULT_MARGIN,
        ecLevel,
        version,
        mode,
        mask,
        dotType = "square",
        dotSize = 1,
        corners,
        color,
        background,
        logo,
        logoSize = DEFAULT_LOGO_SIZE,
        label,
        fallback = null,
        className,
        style,
        ...rest
    } = props;

    // A logo covers modules that then cannot be read, so a code carrying one is encoded with as
    // much error correction as it can hold to make up for what is lost beneath it. A level asked
    // for by name is left alone, since a caller weighing redundancy against size has already
    // chosen between them
    const level = ecLevel ?? (logo ? "H" : undefined);

    // Encoding walks the data and then the matrix eight times over to weigh the masks, so it is
    // only done again when what it reads changes rather than on every render.
    //
    // Data too long for the version or the level it was given throws rather than coming back as
    // a code that cannot be read. That is caught here so a caller's mistake shows as a fallback
    // where the code would have been, rather than taking the page down with it
    const matrix = React.useMemo(() => {
        if (!value) return null;
        try {
            return encodeQR(value, { ecLevel: level, version, mode, mask });
        } catch {
            return null;
        }
    }, [value, level, version, mode, mask]);

    if (!matrix) {
        return (
            <div
                ref={ref}
                className={classNames(classes.root, className)}
                style={style}
                data-component="QRCode"
                data-empty="true"
                {...rest}
            >
                {fallback ? <span className={classes.fallback}>{fallback}</span> : null}
            </div>
        );
    }

    const moduleCount = matrix.length;
    const totalModules = moduleCount + margin * 2;
    const moduleSize = size / totalModules;

    // Which modules a logo covers is the library's to settle, so a logo laid over the code here
    // hides the modules the library would have hidden had it drawn the logo itself. Only that
    // set is wanted: what the middle holds is drawn by React rather than written into the SVG
    const covered = logo
        ? calculateLogoPlacement({ size: logoSize }, moduleCount, moduleSize, margin).hiddenModules
        : undefined;

    const finders = getFinderPositions(moduleCount);

    // Where the corners are drawn as shapes of their own, the modules beneath them are left out
    // of the run so the two are not laid one on top of the other. Where they are not, the
    // corners are drawn as ordinary modules and take the shape the rest of the code is drawn in
    const finderModules = new Set<string>();
    if (corners) {
        for (const finder of finders) {
            for (let row = 0; row < FINDER_SIZE; row++) {
                for (let col = 0; col < FINDER_SIZE; col++) {
                    finderModules.add(`${finder.row + row},${finder.col + col}`);
                }
            }
        }
    }

    // Every module is drawn into one path rather than a shape of its own, so a code of several
    // thousand of them is one node in the document instead of several thousand
    const segments: string[] = [];
    for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
            if (!matrix[row]![col]) continue;
            const key = `${row},${col}`;
            if (covered?.has(key) || finderModules.has(key)) continue;
            segments.push(
                getModulePath(
                    (col + margin) * moduleSize,
                    (row + margin) * moduleSize,
                    moduleSize,
                    dotType,
                    dotSize,
                ),
            );
        }
    }

    const drawCorner = (options: QRCodeCornerOptions | undefined, row: number, col: number) => {
        const x = (col + margin) * moduleSize;
        const y = (row + margin) * moduleSize;

        return (
            <>
                {/* The outer shape is a ring drawn as one path, so the hole through the middle
                    of it is what the fill rule leaves out rather than a second shape painted
                    back over it in the background colour */}
                <path
                    className={classes.corner}
                    d={getFinderOuterPath(x, y, moduleSize, options?.outerShape)}
                    fillRule="evenodd"
                    style={{ fill: options?.outerColor }}
                />
                <path
                    className={classes.corner}
                    d={getFinderInnerPath(x, y, moduleSize, options?.innerShape)}
                    style={{ fill: options?.innerColor }}
                />
            </>
        );
    };

    // The logo is measured against the whole box while the share it was given is a share of the
    // code, so the quiet zone around it is taken back out before the stylesheet is told
    const logoShare = (logoSize * moduleCount) / totalModules;

    return (
        <div
            ref={ref}
            role="img"
            aria-label={label ?? value}
            className={classNames(classes.root, className)}
            style={
                {
                    ...style,
                    "--qr-code-color": color,
                    "--qr-code-background": background,
                    "--qr-code-logo-size": logo ? `${logoShare * 100}%` : undefined,
                } as React.CSSProperties
            }
            data-component="QRCode"
            data-dot-type={dotType}
            {...rest}
        >
            <svg
                className={classes.canvas}
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
            >
                <rect className={classes.background} width="100%" height="100%" />
                {corners
                    ? finders.map((finder) => (
                          <React.Fragment key={finder.key}>
                              {drawCorner(corners[finder.key], finder.row, finder.col)}
                          </React.Fragment>
                      ))
                    : null}
                {segments.length > 0 ? (
                    <path className={classes.modules} d={segments.join("")} />
                ) : null}
            </svg>
            {logo ? (
                <span className={classes.logo} aria-hidden="true">
                    {logo}
                </span>
            ) : null}
        </div>
    );
}

QRCode.displayName = "QRCode";

export default fixedForwardRef(QRCode);
