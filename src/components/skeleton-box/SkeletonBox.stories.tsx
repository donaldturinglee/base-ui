import type { StoryFn, Meta } from "@storybook/react-vite";
import SkeletonBox from "./SkeletonBox";
import type { SkeletonBoxProps } from "./SkeletonBox.types";

export default {
    title: "Components/SkeletonBox",
    component: SkeletonBox,
} as Meta<typeof SkeletonBox>;

export const Default: StoryFn<typeof SkeletonBox> = () => <SkeletonBox width="320px" />;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<SkeletonBoxProps> = (args) => <SkeletonBox {...args} />;

Playground.args = {
    as: "div",
    width: "320px",
    height: "16px",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["div", "section", "span"],
        description: "HTML element to render",
    },
    width: {
        control: {
            type: "text",
        },
        description: "Width of the skeleton box as a CSS length",
    },
    height: {
        control: {
            type: "text",
        },
        description: "Height of the skeleton box as a CSS length",
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
