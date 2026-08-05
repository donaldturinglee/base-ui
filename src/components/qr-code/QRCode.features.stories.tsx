import type { StoryFn } from "@storybook/react-vite";
import { GlobeRegular } from "@gamecrafters/base-ui-icons";
import { Stack } from "../stack";
import { QRCode } from ".";
import type { QRCodeDotType } from "./QRCode.types";

const classes = {
    // Both colours come through custom properties, so a code can be repainted from a stylesheet
    // without the component having to be told about it
    brand: "[--qr-code-color:var(--background-color-accent-emphasis)]",
    // What the logo sits on, so the mark is read against a surface of its own rather than
    // against the modules the code could not hide
    logoPlate: "bg-[var(--background-color-white)] rounded-[var(--border-radius-medium)] p-1",
};

// Every shape a module can be drawn as, for the wall that shows them read side by side
const dotTypes: QRCodeDotType[] = [
    "square",
    "rounded",
    "dots",
    "diamond",
    "classy",
    "classy-rounded",
    "extra-rounded",
    "vertical-line",
    "horizontal-line",
    "small-square",
    "tiny-square",
];

export default {
    title: "Components/QRCode/Features",
    parameters: {
        layout: "centered",
    },
};

// A Link, which is what most codes carry
export const ALink: StoryFn<typeof QRCode> = () => <QRCode value="https://example.com" />;

// Words rather than a link, for a code that hands over something to be read rather than followed
export const PlainText: StoryFn<typeof QRCode> = () => <QRCode value="BASE-UI-2026-0042" />;

// Wifi Credentials, in the format a phone knows how to join a network from
export const WifiCredentials: StoryFn<typeof QRCode> = () => (
    <QRCode value="WIFI:T:WPA;S:Example Network;P:correct-horse-battery;;" />
);

// Small, for a code standing beside other content rather than carrying a panel of its own
export const SizeSmall: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com" size={96} />
);

// Large, for a code read across a room rather than from the hand
export const SizeLarge: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com" size={320} />
);

// A Narrower Quiet Zone. The spec asks for four modules, and a code given less leaves a scanner
// less to tell it from what surrounds it
export const NarrowMargin: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com" margin={1} />
);

// Every Level Of Error Correction, from a seventh of the code recoverable to a third. The more
// that can be lost, the more modules there are to hold the same data
export const ErrorCorrectionLevels: StoryFn<typeof QRCode> = () => (
    <Stack gap="normal" direction="horizontal" align="center">
        {(["L", "M", "Q", "H"] as const).map((level) => (
            <QRCode
                key={level}
                value="https://example.com"
                ecLevel={level}
                size={120}
                label={`Error correction level ${level}`}
            />
        ))}
    </Stack>
);

// A Version Named Rather Than Chosen. Left alone the smallest code the data fits in is taken, so
// asking for a larger one buys room to spare at the cost of finer modules
export const FixedVersion: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com" version={10} />
);

// Every Shape A Module Can Take. The square is what a scanner was built to read, and each of the
// others trades a little of that away for the look of the thing
export const AllDotTypes: StoryFn<typeof QRCode> = () => (
    <Stack gap="normal" direction="horizontal" align="center" wrap="wrap" justify="center">
        {dotTypes.map((dotType) => (
            <QRCode
                key={dotType}
                value="https://example.com"
                dotType={dotType}
                size={120}
                label={`Modules drawn as ${dotType}`}
            />
        ))}
    </Stack>
);

// Modules Standing Apart, where each fills less of its own cell than the whole of it
export const SmallerDots: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com" dotType="dots" dotSize={0.8} />
);

// Corners Drawn As Shapes Of Their Own, rather than as the modules they are made of
export const StyledCorners: StoryFn<typeof QRCode> = () => (
    <QRCode
        value="https://example.com"
        dotType="rounded"
        corners={{
            topLeft: { outerShape: "extra-rounded", innerShape: "rounded" },
            topRight: { outerShape: "extra-rounded", innerShape: "rounded" },
            bottomLeft: { outerShape: "extra-rounded", innerShape: "rounded" },
        }}
    />
);

// Corners Picked Out From The Modules Around Them, which is as far as a code can be brought
// towards a brand before a scanner starts to lose it
export const ColoredCorners: StoryFn<typeof QRCode> = () => (
    <QRCode
        value="https://example.com"
        dotType="rounded"
        corners={{
            topLeft: { outerShape: "dots", innerShape: "dots", outerColor: "#0969da" },
            topRight: { outerShape: "dots", innerShape: "dots" },
            bottomLeft: { outerShape: "dots", innerShape: "dots" },
        }}
    />
);

// A Code Painted By Hand, for the times a code has to sit inside a palette of its own. The pair
// has to keep its contrast, and stay dark on light, or the code stops being read
export const CustomColors: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com" color="#0969da" background="#eff6ff" />
);

// A Code Painted From The Stylesheet, since both colours come through custom properties
export const ThemedColor: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com" className={classes.brand} />
);

// A Code On The Surface Beneath It, which needs whatever it stands on to be light enough to read
// the modules against
export const TransparentBackground: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com" background="transparent" />
);

// A Mark In The Middle. The modules beneath it are left out and the code is raised to the most
// error correction it can carry, so what the logo covers is made up for by what is left
export const WithALogo: StoryFn<typeof QRCode> = () => (
    <QRCode
        value="https://example.com"
        dotType="rounded"
        logo={<GlobeRegular size={32} />}
        logoSize={0.25}
    />
);

// A Mark On A Plate Of Its Own, for a logo that would otherwise be read against the modules the
// code could not hide
export const LogoOnAPlate: StoryFn<typeof QRCode> = () => (
    <QRCode
        value="https://example.com"
        dotType="rounded"
        logo={<GlobeRegular size={32} className={classes.logoPlate} />}
    />
);

// Words Of Its Own, for the times the value would tell a screen reader less than a name would
export const CustomLabel: StoryFn<typeof QRCode> = () => (
    <QRCode value="https://example.com/tickets/8f2a1c9e4b7d6a3f" label="Scan to open your ticket" />
);

// Nothing To Draw, where an empty value stands a fallback in place of the code
export const EmptyValue: StoryFn<typeof QRCode> = () => (
    <QRCode value="" fallback="Nothing to encode" />
);

// More Than Will Fit, where the data is too long for the version it was pinned to and the
// fallback stands in rather than the render coming down
export const TooMuchData: StoryFn<typeof QRCode> = () => (
    <QRCode
        value={"the quick brown fox jumps over the lazy dog ".repeat(4)}
        version={1}
        fallback="Too much data for this version"
    />
);
