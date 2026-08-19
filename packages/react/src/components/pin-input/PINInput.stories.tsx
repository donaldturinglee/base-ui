import type { StoryFn, Meta } from "@storybook/react-vite";
import { PINInput } from ".";
import type { PINInputProps } from "./PINInput.types";

export default {
    title: "Components/PINInput",
    component: PINInput,
} as Meta<typeof PINInput>;

export const Default: StoryFn<typeof PINInput> = () => (
    <PINInput aria-label="Verification code" autoComplete="one-time-code" />
);

export const Playground: StoryFn<PINInputProps> = (args) => (
    <PINInput aria-label="Verification code" {...args} />
);

Playground.args = {
    length: 6,
    type: "numeric",
    mask: false,
    size: "medium",
    disabled: false,
};

Playground.argTypes = {
    length: {
        control: {
            type: "number",
        },
        description: "How many boxes the code is typed into",
    },
    type: {
        control: {
            type: "radio",
        },
        options: ["numeric", "alphanumeric"],
        description: "What the boxes will take",
    },
    mask: {
        control: {
            type: "boolean",
        },
        description: "Holds what has been typed back, the way a password field does",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Size of the boxes",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the code being typed",
    },
    validationStatus: {
        control: {
            type: "radio",
        },
        options: [undefined, "error", "success"],
        description: "Draws the boxes in the colour of the answer",
    },
    ref: {
        table: {
            disable: true,
        },
    },
};
