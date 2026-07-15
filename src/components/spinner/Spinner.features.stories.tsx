import type { StoryFn } from "@storybook/react-vite";
import { Spinner } from "./Spinner";

export default {
    title: "Components/Spinner/Features",
    parameters: {
        layout: "centered",
    },
};

// Large Size
export const Large: StoryFn<typeof Spinner> = () => <Spinner size="large" />;

// Medium Size
export const Medium: StoryFn<typeof Spinner> = () => <Spinner size="medium" />;

// Small Size
export const Small: StoryFn<typeof Spinner> = () => <Spinner size="small" />;
