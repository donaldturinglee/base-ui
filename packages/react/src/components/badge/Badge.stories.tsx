import type { StoryFn, Meta } from "@storybook/react-vite";
import { TagRegular } from "@gamecrafters/base-ui-icons";
import Badge from "./Badge";
import type { BadgeProps } from "./Badge.types";

export default {
    title: "Components/Badge",
    component: Badge,
} as Meta<typeof Badge>;

export const Default: StoryFn<typeof Badge> = () => <Badge>Default</Badge>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<BadgeProps> = (args) => (
    <Badge {...args} leadingVisual={args.leadingVisual ? TagRegular : undefined}>
        Badge
    </Badge>
);

Playground.args = {
    as: "span",
    variant: "default",
    appearance: "filled",
    size: "small",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["span", "div", "a"],
        description: "HTML element to render",
    },
    variant: {
        control: {
            type: "select",
        },
        options: [
            "default",
            "primary",
            "accent",
            "success",
            "attention",
            "severe",
            "danger",
            "done",
            "sponsors",
            "outline",
            "invisible",
            "link",
        ],
        description: "Color variant of the badge",
    },
    appearance: {
        control: {
            type: "inline-radio",
        },
        options: ["filled", "dot"],
        description: "Whether the colour is the badge's ground or a dot inside a plain one",
    },
    size: {
        control: {
            type: "inline-radio",
        },
        options: ["small", "medium", "large"],
        description: "Size variant of the badge",
    },
    leadingVisual: {
        control: {
            type: "boolean",
        },
        description: "Stands before the text, in place of the dot where there is one",
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
