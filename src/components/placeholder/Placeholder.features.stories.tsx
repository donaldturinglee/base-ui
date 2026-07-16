import type { StoryFn } from "@storybook/react-vite";
import Placeholder from "./Placeholder";

export default {
    title: "Components/Placeholder/Features",
    parameters: {
        layout: "centered",
    },
};

// Pixel Height
export const PixelHeight: StoryFn<typeof Placeholder> = () => (
    <Placeholder height="64px" label="Placeholder" />
);

// Rem Height
export const RemHeight: StoryFn<typeof Placeholder> = () => (
    <Placeholder height="4rem" label="Placeholder" />
);

// Pixel Width
export const PixelWidth: StoryFn<typeof Placeholder> = () => (
    <Placeholder width="320px" height="64px" label="Placeholder" />
);

// Percentage Width
export const PercentageWidth: StoryFn<typeof Placeholder> = () => (
    // A percentage width resolves against the containing block, so it needs one with a set width
    <div className="w-[400px]">
        <Placeholder width="50%" height="64px" label="Placeholder" />
    </div>
);

// Full Width
export const FullWidth: StoryFn<typeof Placeholder> = () => (
    <Placeholder height="64px" label="Placeholder" />
);

// Without Label
export const WithoutLabel: StoryFn<typeof Placeholder> = () => (
    <Placeholder width="320px" height="64px" />
);

// Custom Element
export const CustomElement: StoryFn<typeof Placeholder> = () => (
    <Placeholder as="section" height="64px" label="Placeholder" />
);
