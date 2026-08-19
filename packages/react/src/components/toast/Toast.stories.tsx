import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import { Toaster, toast } from ".";
import type { ToasterProps } from "./Toast.types";

const classes = {
    row: "flex flex-wrap gap-[var(--base-size-8)]",
};

export default {
    title: "Components/Toast",
    component: Toaster,
} as Meta<typeof Toaster>;

export const Default: StoryFn<typeof Toaster> = () => (
    <>
        <div className={classes.row}>
            <Button onClick={() => toast("Your changes have been saved")}>Show a toast</Button>
            <Button
                onClick={() =>
                    toast.success("Your changes have been saved", {
                        description: "Everything is up to date",
                    })
                }
            >
                Show a success
            </Button>
        </div>
        <Toaster />
    </>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ToasterProps> = (args) => (
    <>
        <div className={classes.row}>
            <Button onClick={() => toast("Your changes have been saved")}>Show a toast</Button>
            <Button
                onClick={() =>
                    toast.success("Your changes have been saved", {
                        description: "Everything is up to date",
                        action: { label: "Undo" },
                    })
                }
            >
                Show a success
            </Button>
            <Button onClick={() => toast.error("Your changes could not be saved")}>
                Show an error
            </Button>
        </div>
        <Toaster {...args} />
    </>
);

Playground.args = {
    position: "bottom-right",
    expand: false,
    visibleToasts: 3,
    duration: 4000,
    closeButton: false,
    richColors: false,
    gap: 14,
    offset: 24,
    width: 356,
};

Playground.argTypes = {
    position: {
        control: {
            type: "select",
        },
        options: [
            "top-left",
            "top-center",
            "top-right",
            "bottom-left",
            "bottom-center",
            "bottom-right",
        ],
        description: "The corner or the edge of the viewport the toasts gather at",
    },
    expand: {
        control: {
            type: "boolean",
        },
        description: "Lays the stack out in full rather than gathering it into a pile",
    },
    visibleToasts: {
        control: {
            type: "number",
        },
        description: "How many toasts stand at once",
    },
    duration: {
        control: {
            type: "number",
        },
        description: "How long a toast stands before it goes away by itself, in milliseconds",
    },
    closeButton: {
        control: {
            type: "boolean",
        },
        description: "Gives every toast a button that sees it off",
    },
    richColors: {
        control: {
            type: "boolean",
        },
        description: "Colours the whole toast after what it is saying, rather than only its icon",
    },
    gap: {
        control: {
            type: "number",
        },
        description: "The room between one toast and the next, in pixels",
    },
    offset: {
        control: {
            type: "number",
        },
        description: "How far the stack stands from the edges of the viewport",
    },
    width: {
        control: {
            type: "number",
        },
        description: "How wide the toasts are",
    },
    icons: {
        table: {
            disable: true,
        },
    },
    toastOptions: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
