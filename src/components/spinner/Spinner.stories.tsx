import type { StoryFn, Meta } from "@storybook/react-vite";
import Spinner from "./Spinner";
import type { SpinnerProps } from "./Spinner.types";

export default {
    title: "Components/Spinner",
    component: Spinner,
} as Meta<typeof Spinner>;

export const Default: StoryFn<typeof Spinner> = () => <Spinner size="medium" />;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<SpinnerProps> = (args) => <Spinner {...args} />;

Playground.args = {
    size: "medium",
    srText: "Loading",
};

Playground.argTypes = {
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Size variant of the spinner",
    },
    srText: {
        control: "text",
        description: "Visually hidden text announced to assistive technology",
    },
    ref: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
