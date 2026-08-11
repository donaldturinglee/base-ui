import type { StoryFn } from "@storybook/react-vite";
import { ProgressBar } from ".";

const classes = {
    // A centered story shrinks to fit its content, so the track needs a width of its own
    track: "w-[20rem]",
    inlineTrack: "w-[6.25rem]",
};

export default {
    title: "Components/ProgressBar/Features",
    parameters: {
        layout: "centered",
    },
};

// Progress Zero
export const ProgressZero: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar progress={0} className={classes.track} aria-label="Upload test.png" />
);

// Progress Half
export const ProgressHalf: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar progress={50} className={classes.track} aria-label="Upload test.png" />
);

// Progress Done
export const ProgressDone: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar progress={100} className={classes.track} aria-label="Upload test.png" />
);

// Small Size
export const SizeSmall: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar
        progress={66}
        size="small"
        className={classes.track}
        aria-label="Upload test.png"
    />
);

// Large Size
export const SizeLarge: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar
        progress={66}
        size="large"
        className={classes.track}
        aria-label="Upload test.png"
    />
);

// Inline
export const Inline: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar
        inline
        progress={66}
        className={classes.inlineTrack}
        aria-label="Upload test.png"
    />
);

// Animated
export const Animated: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar animated progress={50} className={classes.track} aria-label="Upload test.png" />
);

// Multiple Items
export const MultipleItems: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar className={classes.track}>
        <ProgressBar.Item progress={33} variant="accent" aria-label="Photo usage" />
        <ProgressBar.Item progress={23} variant="danger" aria-label="Application usage" />
        <ProgressBar.Item progress={14} variant="severe" aria-label="Music usage" />
    </ProgressBar>
);

// All Colours
export const AllColors: StoryFn<typeof ProgressBar> = () => (
    <ProgressBar className={classes.track}>
        <ProgressBar.Item progress={16} variant="accent" aria-label="Photo usage" />
        <ProgressBar.Item progress={14} variant="danger" aria-label="Application usage" />
        <ProgressBar.Item progress={12} variant="severe" aria-label="Music usage" />
        <ProgressBar.Item progress={11} variant="done" aria-label="Video usage" />
        <ProgressBar.Item progress={10} variant="sponsors" aria-label="Document usage" />
        <ProgressBar.Item progress={9} variant="neutral" aria-label="Backup usage" />
        <ProgressBar.Item progress={8} variant="attention" aria-label="Cache usage" />
        <ProgressBar.Item progress={7} variant="success" aria-label="Other usage" />
    </ProgressBar>
);
