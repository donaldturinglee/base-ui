import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Mark } from ".";

const classes = {
    // Gives the running text a column to wrap within
    container: "w-[20rem]",
};

export default {
    title: "Components/Mark/Features",
    parameters: {
        layout: "centered",
    },
};

// Attention Variant
export const Attention: StoryFn<typeof Mark> = () => <Mark variant="attention">Marked text</Mark>;

// Accent Variant
export const Accent: StoryFn<typeof Mark> = () => <Mark variant="accent">Marked text</Mark>;

// Success Variant
export const Success: StoryFn<typeof Mark> = () => <Mark variant="success">Marked text</Mark>;

// Danger Variant
export const Danger: StoryFn<typeof Mark> = () => <Mark variant="danger">Marked text</Mark>;

// Neutral Variant
export const Neutral: StoryFn<typeof Mark> = () => <Mark variant="neutral">Marked text</Mark>;

// Large Size
export const Large: StoryFn<typeof Mark> = () => <Mark size="large">Marked text</Mark>;

// Medium Size
export const Medium: StoryFn<typeof Mark> = () => <Mark size="medium">Marked text</Mark>;

// Small Size
export const Small: StoryFn<typeof Mark> = () => <Mark size="small">Marked text</Mark>;

// Light Weight
export const LightWeight: StoryFn<typeof Mark> = () => <Mark weight="light">Marked text</Mark>;

// Normal Weight
export const NormalWeight: StoryFn<typeof Mark> = () => <Mark weight="normal">Marked text</Mark>;

// Medium Weight
export const MediumWeight: StoryFn<typeof Mark> = () => <Mark weight="medium">Marked text</Mark>;

// Semibold Weight
export const SemiboldWeight: StoryFn<typeof Mark> = () => (
    <Mark weight="semibold">Marked text</Mark>
);

// In Running Text, where the highlight takes the size of the line it is read in rather than
// setting one of its own against it
export const InRunningText: StoryFn<typeof Mark> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["large", "medium", "small"] as const).map((size) => (
            <Text key={size} as="p" size={size}>
                Deleting this repository takes it away from <Mark>everyone</Mark> who can reach it.
            </Text>
        ))}
    </Stack>
);

// Custom Element, for a run picked out somewhere the mark element itself would not be read as
// part of the running text
export const CustomElement: StoryFn<typeof Mark> = () => <Mark as="span">Marked text</Mark>;
