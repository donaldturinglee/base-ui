import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import { ConfirmationDialog } from ".";
import type { ConfirmationDialogProps } from "./ConfirmationDialog.types";

const body =
    "Deleting the universe could have disastrous effects, including but not limited to destroying all life on Earth.";

export default {
    title: "Components/ConfirmationDialog",
    component: ConfirmationDialog,
} as Meta<typeof ConfirmationDialog>;

export const Default: StoryFn<typeof ConfirmationDialog> = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
            {isOpen ? (
                <ConfirmationDialog
                    title="Delete universe?"
                    confirmButtonContent="Delete it!"
                    confirmButtonType="danger"
                    onClose={() => setIsOpen(false)}
                >
                    {body}
                </ConfirmationDialog>
            ) : null}
        </>
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ConfirmationDialogProps> = (args) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
            {isOpen ? (
                <ConfirmationDialog {...args} onClose={() => setIsOpen(false)}>
                    {body}
                </ConfirmationDialog>
            ) : null}
        </>
    );
};

Playground.args = {
    title: "Delete universe?",
    cancelButtonContent: "Cancel",
    confirmButtonContent: "Delete it!",
    confirmButtonType: "danger",
    cancelButtonLoading: false,
    confirmButtonLoading: false,
    width: "medium",
    height: "auto",
};

Playground.argTypes = {
    title: {
        control: {
            type: "text",
        },
        description: "The question being asked, which names the dialog to a screen reader",
    },
    cancelButtonContent: {
        control: {
            type: "text",
        },
        description: "What the button that turns the action down reads",
    },
    confirmButtonContent: {
        control: {
            type: "text",
        },
        description: "What the button that carries the action reads",
    },
    confirmButtonType: {
        control: {
            type: "radio",
        },
        options: ["normal", "primary", "danger"],
        description: "How grave the action is, which is also what decides where focus opens",
    },
    cancelButtonLoading: {
        control: {
            type: "boolean",
        },
        description: "Swaps the cancel button for a spinner while it is waiting on something",
    },
    confirmButtonLoading: {
        control: {
            type: "boolean",
        },
        description: "Swaps the confirm button for a spinner while it is waiting on something",
    },
    overrideButtonFocus: {
        control: {
            type: "radio",
        },
        options: [undefined, "cancel", "confirm"],
        description: "Opens with this button focused, in place of the one the type calls for",
    },
    width: {
        control: {
            type: "text",
        },
        description:
            "A step of the overlay scale (small, medium, large, xlarge) or a CSS width of its own",
    },
    height: {
        control: {
            type: "radio",
        },
        options: ["small", "large", "auto"],
        description: "How tall the dialog stands, where it is not simply as tall as it needs to be",
    },
    onClose: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
