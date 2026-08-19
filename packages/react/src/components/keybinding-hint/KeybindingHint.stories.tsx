import type { StoryFn, Meta } from "@storybook/react-vite";
import { KeybindingHint } from ".";
import type { KeybindingHintProps } from "./KeybindingHint.types";

export default {
    title: "Components/KeybindingHint",
    component: KeybindingHint,
} as Meta<typeof KeybindingHint>;

export const Default: StoryFn<typeof KeybindingHint> = () => <KeybindingHint keys="Mod+Shift+K" />;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<KeybindingHintProps> = (args) => <KeybindingHint {...args} />;

Playground.args = {
    keys: "Mod+Shift+K",
    format: "condensed",
    variant: "normal",
    size: "normal",
};

Playground.argTypes = {
    keys: {
        control: {
            type: "text",
        },
        description: "The keys the binding is made of, joined with + and separated by spaces",
    },
    format: {
        control: {
            type: "radio",
        },
        options: ["condensed", "full"],
        description: "Whether the keys are drawn as they are printed or written out",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["normal", "onEmphasis", "onPrimary"],
        description: "What the hint is drawn on",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "normal"],
        description: "How large the keys are drawn",
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
