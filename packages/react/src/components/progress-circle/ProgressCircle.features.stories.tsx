import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { ProgressCircle } from ".";

const classes = {
    // The thickness of the line comes through a custom property, so a caller can thin the ring
    // without having to unpick the class it came with
    thinRing: "[--progress-circle-stroke-width:2]",
};

// Every colour an arc can be painted, for the row that shows them read side by side
const variants = [
    "accent",
    "attention",
    "danger",
    "done",
    "neutral",
    "severe",
    "sponsors",
    "success",
] as const;

export default {
    title: "Components/ProgressCircle/Features",
    parameters: {
        layout: "centered",
    },
};

// Progress Zero
export const ProgressZero: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle progress={0} aria-label="Upload test.png" />
);

// Progress Half
export const ProgressHalf: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle progress={50} aria-label="Upload test.png" />
);

// Progress Done
export const ProgressDone: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle progress={100} aria-label="Upload test.png" />
);

// Small Size
export const SizeSmall: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle progress={66} size="small" aria-label="Upload test.png" />
);

// Medium Size
export const SizeMedium: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle progress={66} size="medium" aria-label="Upload test.png" />
);

// Large Size
export const SizeLarge: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle progress={66} size="large" aria-label="Upload test.png" />
);

// Every Size, read together so the line can be seen keeping its proportions as the circle grows
export const AllSizes: StoryFn<typeof ProgressCircle> = () => (
    <Stack gap="normal" direction="horizontal" align="center">
        {(["small", "medium", "large"] as const).map((size) => (
            <ProgressCircle key={size} progress={66} size={size} aria-label="Upload test.png" />
        ))}
    </Stack>
);

// With A Label, where the percentage is read in the middle of the ring it fills. A progressbar
// keeps its contents from a screen reader, so the words there are what the eye reads and
// aria-valuenow is what is announced
export const WithALabel: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle progress={66} size="large" aria-label="Upload test.png">
        66%
    </ProgressCircle>
);

// All Colours
export const AllColors: StoryFn<typeof ProgressCircle> = () => (
    <Stack gap="normal" direction="horizontal" align="center">
        {variants.map((variant) => (
            <ProgressCircle
                key={variant}
                progress={66}
                variant={variant}
                aria-label={`${variant} usage`}
            />
        ))}
    </Stack>
);

// A Thinner Ring, for a reading that sits beside other content rather than carrying a panel of
// its own
export const ThinnerRing: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle
        progress={66}
        size="large"
        className={classes.thinRing}
        aria-label="Upload test.png"
    >
        66%
    </ProgressCircle>
);

// Words Of Its Own, where aria-valuetext says what the bare number would not
export const CustomValueText: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle
        progress={66}
        size="large"
        aria-label="Upload test.png"
        aria-valuetext="66 percent, about a minute left"
    >
        66%
    </ProgressCircle>
);

// Custom Element, for a reading that is laid out as a block of its own rather than as part of a
// line
export const CustomElement: StoryFn<typeof ProgressCircle> = () => (
    <ProgressCircle as="div" progress={66} aria-label="Upload test.png" />
);
