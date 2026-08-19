import type { StoryFn, Meta } from "@storybook/react-vite";
import { PasswordInput } from ".";
import type { PasswordInputProps } from "./PasswordInput.types";

const classes = {
    // Gives the field a container to lay itself out against
    container: "w-[20rem]",
};

export default {
    title: "Components/PasswordInput",
    component: PasswordInput,
} as Meta<typeof PasswordInput>;

export const Default: StoryFn<typeof PasswordInput> = () => (
    <div className={classes.container}>
        <PasswordInput aria-label="Password" autoComplete="current-password" />
    </div>
);

export const Playground: StoryFn<PasswordInputProps> = (args) => (
    <div className={classes.container}>
        <PasswordInput aria-label="Password" {...args} />
    </div>
);

Playground.args = {
    defaultVisible: false,
    hideToggle: false,
    size: "medium",
    block: false,
    disabled: false,
};

Playground.argTypes = {
    defaultVisible: {
        control: {
            type: "boolean",
        },
        description: "Whether the field starts out showing what has been typed",
    },
    hideToggle: {
        control: {
            type: "boolean",
        },
        description: "Leaves the field with no way to show what has been typed",
    },
    showLabel: {
        control: {
            type: "text",
        },
        description: "What the toggle is called while the password is hidden",
    },
    hideLabel: {
        control: {
            type: "text",
        },
        description: "What the toggle is called while the password is shown",
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
