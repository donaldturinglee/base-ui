import type { StoryFn } from "@storybook/react-vite";
import { Heading } from "./Heading";

export default {
    title: "Components/Heading/Features",
    parameters: {
        layout: "centered",
    },
};

// Large Size
export const Large: StoryFn<typeof Heading> = () => <Heading size="large">Content heading</Heading>;

// Medium Size
export const Medium: StoryFn<typeof Heading> = () => (
    <Heading size="medium">Content heading</Heading>
);

// Small Size
export const Small: StoryFn<typeof Heading> = () => <Heading size="small">Content heading</Heading>;
