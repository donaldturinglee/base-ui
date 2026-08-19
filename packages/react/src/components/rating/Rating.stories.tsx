import type { StoryFn, Meta } from "@storybook/react-vite";
import { Rating } from ".";
import type { RatingProps } from "./Rating.types";

export default {
    title: "Components/Rating",
    component: Rating,
} as Meta<typeof Rating>;

export const Default: StoryFn<typeof Rating> = () => (
    <Rating defaultValue={3} aria-label="Rate this article" />
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<RatingProps> = (args) => (
    <Rating {...args} aria-label="Rate this article" />
);

Playground.args = {
    count: 5,
    defaultValue: 3,
    size: "medium",
    readOnly: false,
    disabled: false,
    clearable: false,
};

Playground.argTypes = {
    count: {
        control: {
            type: "number",
            min: 0,
            max: 10,
            step: 1,
        },
        description: "How many stars the rating is read out of",
    },
    defaultValue: {
        control: {
            type: "number",
            min: 0,
            max: 10,
            step: 0.5,
        },
        description: "Which star the rating starts out at",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "How big the stars are drawn",
    },
    readOnly: {
        control: {
            type: "boolean",
        },
        description: "Draws the rating as a reading, with nothing behind the stars to pick",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the rating being moved",
    },
    clearable: {
        control: {
            type: "boolean",
        },
        description: "Lets the star the rating stands at be picked again to clear it",
    },
    value: {
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
