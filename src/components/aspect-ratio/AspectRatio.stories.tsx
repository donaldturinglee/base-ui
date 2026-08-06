import type { Decorator, StoryFn, Meta } from "@storybook/react-vite";
import { Placeholder } from "../placeholder";
import { AspectRatio } from ".";
import type { AspectRatioProps } from "./AspectRatio.types";

const classes = {
    // The box takes its height from its width, so the stories give it a width to work from
    container: "w-[20rem]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/AspectRatio",
    component: AspectRatio,
    decorators: [withContainer],
} as Meta<typeof AspectRatio>;

export const Default: StoryFn<typeof AspectRatio> = () => (
    <AspectRatio>
        <Placeholder height="100%" label="1 / 1" />
    </AspectRatio>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<AspectRatioProps> = (args) => (
    <AspectRatio {...args}>
        <Placeholder height="100%" label="Content" />
    </AspectRatio>
);

Playground.args = {
    as: "div",
    ratio: 16 / 9,
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["div", "section", "span"],
        description: "HTML element to render",
    },
    ratio: {
        control: {
            type: "number",
        },
        description: "Shape the box keeps, as a width divided by a height",
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
