import type { StoryFn, Meta } from "@storybook/react-vite";
import Text from "./Text";
import type { TextProps } from "./Text.types";

export default {
    title: "Components/Text",
    component: Text,
} as Meta<typeof Text>;

export const Default: StoryFn<typeof Text> = () => <Text size="medium">Body text</Text>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TextProps> = (args) => <Text {...args}>Body text</Text>;

Playground.args = {
    as: "span",
    size: "medium",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["span", "p", "div", "label", "strong", "em"],
        description: "HTML element to render",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["large", "medium", "small"],
        description: "Size variant of the text",
    },
    weight: {
        control: {
            type: "radio",
        },
        options: ["light", "normal", "medium", "semibold"],
        description: "Font weight of the text",
    },
    whiteSpace: {
        control: {
            type: "radio",
        },
        options: ["pre", "normal", "nowrap", "pre-wrap", "pre-line"],
        description: "White space handling of the text",
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
