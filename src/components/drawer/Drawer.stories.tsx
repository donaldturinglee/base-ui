import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { Drawer } from ".";
import type { DrawerProps } from "./Drawer.types";

const body = (
    <Text as="p">
        A drawer comes in from an edge of the screen and stays anchored to it, for work that runs
        alongside the page rather than in place of it: a set of filters, the details of the row that
        was picked, a form that is filled in without leaving what it belongs to.
    </Text>
);

export default {
    title: "Components/Drawer",
    component: Drawer,
} as Meta<typeof Drawer>;

export const Default: StoryFn<typeof Drawer> = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const close = () => setIsOpen(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Show drawer</Button>
            {isOpen ? (
                <Drawer title="Filters" subtitle="Narrow down what is listed" onClose={close}>
                    {body}
                    <Drawer.Footer>
                        <Button onClick={close}>Cancel</Button>
                        <Button variant="primary" onClick={close}>
                            Apply
                        </Button>
                    </Drawer.Footer>
                </Drawer>
            ) : null}
        </>
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<DrawerProps> = (args) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const close = () => setIsOpen(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Show drawer</Button>
            {isOpen ? (
                <Drawer {...args} onClose={close}>
                    {body}
                    <Drawer.Footer>
                        <Button onClick={close}>Cancel</Button>
                        <Button variant="primary" onClick={close}>
                            Apply
                        </Button>
                    </Drawer.Footer>
                </Drawer>
            ) : null}
        </>
    );
};

Playground.args = {
    title: "Filters",
    subtitle: "Narrow down what is listed",
    position: "right",
    size: "medium",
    modal: true,
};

Playground.argTypes = {
    title: {
        control: {
            type: "text",
        },
        description: "Names the drawer to a screen reader as well as titling it",
    },
    subtitle: {
        control: {
            type: "text",
        },
        description: "Describes the drawer to a screen reader, below the title",
    },
    position: {
        control: {
            type: "radio",
        },
        options: ["left", "right", "top", "bottom"],
        description: "Which edge of the screen the drawer settles against",
    },
    size: {
        control: {
            type: "text",
        },
        description:
            "A step of the overlay scale (small, medium, large, xlarge) or a CSS length of its own",
    },
    modal: {
        control: {
            type: "boolean",
        },
        description: "Holds the page still behind the drawer, and keeps focus within it",
    },
    onClose: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
