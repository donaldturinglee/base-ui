import * as React from "react";
import {
    AddRegular,
    ChevronDownRegular,
    DeleteRegular,
    HeartRegular,
    SearchRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Button } from ".";
import type { ButtonSize, ButtonVariant } from "./Button.types";

const classes = {
    // Gives the block and label wrapping stories a container to work against
    container: "w-[18rem]",
};

const VARIANTS: ButtonVariant[] = ["default", "primary", "danger", "invisible", "link"];
const SIZES: ButtonSize[] = ["small", "medium", "large"];

export default {
    title: "Components/Button/Features",
    parameters: {
        layout: "centered",
    },
};

// Variant Scale
export const VariantScale: StoryFn<typeof Button> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
                {variant}
            </Button>
        ))}
    </Stack>
);

// Size Scale
export const SizeScale: StoryFn<typeof Button> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {SIZES.map((size) => (
            <Button key={size} size={size}>
                {size}
            </Button>
        ))}
    </Stack>
);

// Leading Visual
export const LeadingVisual: StoryFn<typeof Button> = () => (
    <Button leadingVisual={AddRegular}>New issue</Button>
);

// Trailing Visual
export const TrailingVisual: StoryFn<typeof Button> = () => (
    <Button trailingVisual={ChevronDownRegular}>Filters</Button>
);

// Both Visuals
export const BothVisuals: StoryFn<typeof Button> = () => (
    <Button leadingVisual={SearchRegular} trailingVisual={ChevronDownRegular}>
        Search
    </Button>
);

// Trailing Action, which sits outside the label rather than beside it
export const TrailingAction: StoryFn<typeof Button> = () => (
    <Button trailingAction={ChevronDownRegular}>Merge</Button>
);

// Counter
export const Counter: StoryFn<typeof Button> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} count={16}>
                Watch
            </Button>
        ))}
    </Stack>
);

// Counter With A Leading Visual And No Label, which condenses the padding
export const IconWithCounter: StoryFn<typeof Button> = () => (
    <Button leadingVisual={HeartRegular} count={24} aria-label="Sponsors" />
);

// Block, which fills the width of its container
export const Block: StoryFn<typeof Button> = () => (
    <div className={classes.container}>
        <Button block>Save changes</Button>
    </div>
);

// Align Content, which only shows once the button is wider than its content
export const AlignContent: StoryFn<typeof Button> = () => (
    <Stack gap="condensed" className={classes.container}>
        <Button block leadingVisual={SearchRegular} alignContent="center">
            Centered
        </Button>
        <Button block leadingVisual={SearchRegular} alignContent="start">
            Start
        </Button>
    </Stack>
);

// Label Wrap, which lets a long label run onto more than one line
export const LabelWrap: StoryFn<typeof Button> = () => (
    <div className={classes.container}>
        <Button labelWrap leadingVisual={AddRegular}>
            A label long enough that it has to run onto another line
        </Button>
    </div>
);

// Loading, where the spinner stands in for the label when there is no visual to replace
export const Loading: StoryFn<typeof Button> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button loading>Saving</Button>
        <Button loading leadingVisual={AddRegular}>
            Creating
        </Button>
        <Button loading trailingVisual={ChevronDownRegular}>
            Loading
        </Button>
    </Stack>
);

// Loading Toggle, which keeps its width and its focus as the state changes
export const LoadingToggle: StoryFn<typeof Button> = () => {
    const [loading, setLoading] = React.useState(false);

    return (
        <Button
            loading={loading}
            leadingVisual={AddRegular}
            onClick={() => {
                setLoading(true);
                window.setTimeout(() => setLoading(false), 2000);
            }}
        >
            Create issue
        </Button>
    );
};

// Disabled
export const Disabled: StoryFn<typeof Button> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} disabled leadingVisual={DeleteRegular}>
                {variant}
            </Button>
        ))}
    </Stack>
);

// Inactive, which reads as unavailable while staying in the tab order so it can be explained
export const Inactive: StoryFn<typeof Button> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button inactive leadingVisual={AddRegular}>
            New issue
        </Button>
        <Button inactive variant="link">
            Learn more
        </Button>
    </Stack>
);
