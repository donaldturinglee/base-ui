import type { StoryFn, Meta } from "@storybook/react-vite";
import CounterLabel from "./CounterLabel";
import type { CounterLabelProps } from "./CounterLabel.types";

export default {
    title: "Components/CounterLabel",
    component: CounterLabel,
} as Meta<typeof CounterLabel>;

export const Default: StoryFn<typeof CounterLabel> = () => <CounterLabel>12</CounterLabel>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<CounterLabelProps> = (args) => (
    <CounterLabel {...args}>12</CounterLabel>
);

Playground.args = {
    variant: "secondary",
};

Playground.argTypes = {
    variant: {
        control: {
            type: "radio",
        },
        options: ["primary", "secondary"],
        description: "Uses an emphasised background with inverse text, or a muted one",
    },
    children: {
        table: {
            disable: true,
        },
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
