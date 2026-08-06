import type { Meta, StoryFn } from "@storybook/react-vite";
import { Label } from "../label";
import { LabelGroup } from ".";
import type { LabelGroupProps } from "./LabelGroup.types";

const classes = {
    // Narrow enough that the row runs out of room, and dragged wider to watch it work the
    // labels out again
    resizable:
        "w-[var(--overlay-width-medium)] max-w-full min-w-[var(--base-size-96)] resize-x overflow-auto rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] p-[var(--base-size-8)]",
};

const names = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
];

const labels = names.map((name) => <Label key={name}>{name}</Label>);

export default {
    title: "Components/LabelGroup",
    component: LabelGroup,
} as Meta<typeof LabelGroup>;

export const Default: StoryFn<typeof LabelGroup> = () => <LabelGroup>{labels}</LabelGroup>;

export const Playground: StoryFn<LabelGroupProps> = (args) => (
    <div className={classes.resizable}>
        <LabelGroup {...args}>{labels}</LabelGroup>
    </div>
);

Playground.args = {
    overflowStyle: "overlay",
    visibleChildCount: "auto",
};

Playground.argTypes = {
    overflowStyle: {
        control: {
            type: "radio",
        },
        options: ["overlay", "inline"],
        description: "Where the labels that did not fit are shown once they are asked for",
    },
    visibleChildCount: {
        control: {
            type: "select",
        },
        options: ["auto", 3, 5, 8],
        description:
            "How many labels the row shows before it stops. `auto` shows as many as it has room for",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
