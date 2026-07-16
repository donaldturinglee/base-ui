import type { StoryFn } from "@storybook/react-vite";
import Text from "./Text";

export default {
    title: "Components/Text/Features",
    parameters: {
        layout: "centered",
    },
};

// Large Size
export const Large: StoryFn<typeof Text> = () => <Text size="large">Body text</Text>;

// Medium Size
export const Medium: StoryFn<typeof Text> = () => <Text size="medium">Body text</Text>;

// Small Size
export const Small: StoryFn<typeof Text> = () => <Text size="small">Body text</Text>;

// Light Weight
export const LightWeight: StoryFn<typeof Text> = () => <Text weight="light">Body text</Text>;

// Normal Weight
export const NormalWeight: StoryFn<typeof Text> = () => <Text weight="normal">Body text</Text>;

// Medium Weight
export const MediumWeight: StoryFn<typeof Text> = () => <Text weight="medium">Body text</Text>;

// Semibold Weight
export const SemiboldWeight: StoryFn<typeof Text> = () => <Text weight="semibold">Body text</Text>;

// Custom Element
export const CustomElement: StoryFn<typeof Text> = () => <Text as="p">Body text</Text>;

// White Space
export const WhiteSpace: StoryFn<typeof Text> = () => (
    <Text whiteSpace="pre">{"Body    text\nwith preserved white space"}</Text>
);
