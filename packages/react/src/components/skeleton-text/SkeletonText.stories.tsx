import type { StoryFn, Meta } from "@storybook/react-vite";
import SkeletonText from "./SkeletonText";
import type { SkeletonTextProps } from "./SkeletonText.types";

export default {
    title: "Components/SkeletonText",
    component: SkeletonText,
} as Meta<typeof SkeletonText>;

export const Default: StoryFn<typeof SkeletonText> = () => (
    // The skeleton fills its container, so centering it means centering a container with a width
    <div className="w-[320px]">
        <SkeletonText />
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<SkeletonTextProps> = (args) => (
    <div className="w-[400px]">
        <SkeletonText {...args} />
    </div>
);

Playground.args = {
    size: "bodyMedium",
    lines: 1,
    maxWidth: "320px",
};

Playground.argTypes = {
    size: {
        control: {
            type: "select",
        },
        options: [
            "display",
            "titleLarge",
            "titleMedium",
            "titleSmall",
            "bodyLarge",
            "bodyMedium",
            "bodySmall",
            "subtitle",
        ],
        description: "Size of the text that the skeleton is replacing",
    },
    lines: {
        control: {
            type: "number",
        },
        description: "Number of lines of skeleton text to render",
    },
    maxWidth: {
        control: {
            type: "text",
        },
        description: "Maximum width the line(s) of skeleton text can take up",
    },
};

Playground.parameters = {
    layout: "centered",
};
