import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Strong } from ".";

const classes = {
    // Gives the running text a column to wrap within
    container: "w-[20rem]",
};

export default {
    title: "Components/Strong/Features",
    parameters: {
        layout: "centered",
    },
};

// Large Size
export const Large: StoryFn<typeof Strong> = () => <Strong size="large">Important text</Strong>;

// Medium Size
export const Medium: StoryFn<typeof Strong> = () => <Strong size="medium">Important text</Strong>;

// Small Size
export const Small: StoryFn<typeof Strong> = () => <Strong size="small">Important text</Strong>;

// In Running Text, where the words take the size of the line they are read in rather than
// setting one of their own against it
export const InRunningText: StoryFn<typeof Strong> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["large", "medium", "small"] as const).map((size) => (
            <Text key={size} as="p" size={size}>
                Deleting this repository <Strong>cannot be undone</Strong>.
            </Text>
        ))}
    </Stack>
);

// Custom Element, for words set apart without being the ones that matter most: a term as it is
// introduced, or a name the reader is meant to pick out of the line
export const CustomElement: StoryFn<typeof Strong> = () => <Strong as="b">Important text</Strong>;
