import type { StoryFn } from "@storybook/react-vite";
import CounterLabel from "./CounterLabel";

export default {
    title: "Components/CounterLabel/Features",
    parameters: {
        layout: "centered",
    },
};

// Primary
export const Primary: StoryFn<typeof CounterLabel> = () => (
    <CounterLabel variant="primary">12</CounterLabel>
);

// Secondary
export const Secondary: StoryFn<typeof CounterLabel> = () => (
    <CounterLabel variant="secondary">12</CounterLabel>
);
