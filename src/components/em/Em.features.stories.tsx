import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Em } from ".";

const classes = {
    // Gives the running text a column to wrap within
    container: "w-[20rem]",
};

export default {
    title: "Components/Em/Features",
    parameters: {
        layout: "centered",
    },
};

// Large Size
export const Large: StoryFn<typeof Em> = () => <Em size="large">Emphasised text</Em>;

// Medium Size
export const Medium: StoryFn<typeof Em> = () => <Em size="medium">Emphasised text</Em>;

// Small Size
export const Small: StoryFn<typeof Em> = () => <Em size="small">Emphasised text</Em>;

// Light Weight
export const LightWeight: StoryFn<typeof Em> = () => <Em weight="light">Emphasised text</Em>;

// Normal Weight
export const NormalWeight: StoryFn<typeof Em> = () => <Em weight="normal">Emphasised text</Em>;

// Medium Weight
export const MediumWeight: StoryFn<typeof Em> = () => <Em weight="medium">Emphasised text</Em>;

// Semibold Weight
export const SemiboldWeight: StoryFn<typeof Em> = () => <Em weight="semibold">Emphasised text</Em>;

// In Running Text, where the emphasis takes the size of the line it is read in rather than
// setting one of its own against it
export const InRunningText: StoryFn<typeof Em> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["large", "medium", "small"] as const).map((size) => (
            <Text key={size} as="p" size={size}>
                Deleting this repository takes it away from <Em>everyone</Em> who can reach it.
            </Text>
        ))}
    </Stack>
);

// Custom Element, for words set apart for some reason other than the stress they are read with
export const CustomElement: StoryFn<typeof Em> = () => <Em as="i">Emphasised text</Em>;
