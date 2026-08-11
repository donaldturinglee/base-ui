import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { Dialog } from ".";
import type { DialogProps } from "./Dialog.types";

const body = (
    <Text as="p">
        Deleting this repository takes it away from everyone who can reach it, along with its
        issues, its pull requests and everything that has been said on them. There is no way of
        putting it back once it has gone.
    </Text>
);

export default {
    title: "Components/Dialog",
    component: Dialog,
} as Meta<typeof Dialog>;

export const Default: StoryFn<typeof Dialog> = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const close = () => setIsOpen(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
            {isOpen ? (
                <Dialog
                    title="Delete repository"
                    subtitle="This cannot be undone"
                    onClose={close}
                    footerButtons={[
                        { content: "Cancel", onClick: close },
                        { buttonType: "danger", content: "Delete", onClick: close },
                    ]}
                >
                    {body}
                </Dialog>
            ) : null}
        </>
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<DialogProps> = (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const close = () => setIsOpen(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
            {isOpen ? (
                <Dialog
                    {...args}
                    onClose={close}
                    footerButtons={[
                        { content: "Cancel", onClick: close },
                        { buttonType: "primary", content: "Save", onClick: close, autoFocus: true },
                    ]}
                >
                    {body}
                </Dialog>
            ) : null}
        </>
    );
};

Playground.args = {
    title: "Delete repository",
    subtitle: "This cannot be undone",
    width: "xlarge",
    height: "auto",
    position: "center",
    align: "center",
    role: "dialog",
};

Playground.argTypes = {
    title: {
        control: {
            type: "text",
        },
        description: "Names the dialog to a screen reader as well as titling it",
    },
    subtitle: {
        control: {
            type: "text",
        },
        description: "Describes the dialog to a screen reader, below the title",
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
    position: {
        control: {
            type: "radio",
        },
        options: ["center", "left", "right"],
        description: "Where the dialog sits against the screen",
    },
    align: {
        control: {
            type: "radio",
        },
        options: ["top", "center", "bottom"],
        description: "Where a centred dialog sits down the screen",
    },
    role: {
        control: {
            type: "radio",
        },
        options: ["dialog", "alertdialog"],
        description: "What the dialog is announced as",
    },
    renderHeader: {
        table: {
            disable: true,
        },
    },
    renderBody: {
        table: {
            disable: true,
        },
    },
    renderFooter: {
        table: {
            disable: true,
        },
    },
    footerButtons: {
        table: {
            disable: true,
        },
    },
    onClose: {
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
