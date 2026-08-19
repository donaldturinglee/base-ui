import type { StoryFn, Meta } from "@storybook/react-vite";
import { NumberInput } from ".";
import type { NumberInputProps } from "./NumberInput.types";

const classes = {
    // Gives the field a container to lay itself out against
    container: "w-[16rem]",
};

export default {
    title: "Components/NumberInput",
    component: NumberInput,
} as Meta<typeof NumberInput>;

export const Default: StoryFn<typeof NumberInput> = () => (
    <div className={classes.container}>
        <NumberInput aria-label="Quantity" defaultValue={1} min={0} />
    </div>
);

export const Playground: StoryFn<NumberInputProps> = (args) => (
    <div className={classes.container}>
        <NumberInput aria-label="Quantity" {...args} />
    </div>
);

Playground.args = {
    defaultValue: 1,
    min: 0,
    max: 10,
    step: 1,
    size: "medium",
    block: false,
    disabled: false,
    hideStepper: false,
};

Playground.argTypes = {
    min: {
        control: {
            type: "number",
        },
        description: "The lowest number the field can be stepped to",
    },
    max: {
        control: {
            type: "number",
        },
        description: "The highest number the field can be stepped to",
    },
    step: {
        control: {
            type: "number",
        },
        description: "How far one press of the stepper, or of an arrow key, moves the value",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Size of the field",
    },
    block: {
        control: {
            type: "boolean",
        },
        description: "Fills the width it is given",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the field being used",
    },
    hideStepper: {
        control: {
            type: "boolean",
        },
        description: "Leaves the field to typing and to the arrow keys",
    },
    validationStatus: {
        control: {
            type: "radio",
        },
        options: [undefined, "error", "success"],
        description: "Draws the field in the colour of the answer",
    },
    ref: {
        table: {
            disable: true,
        },
    },
};
