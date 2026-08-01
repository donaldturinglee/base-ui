import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import { CommandPalette } from ".";
import type { CommandPaletteProps } from "./CommandPalette.types";

const classes = {
    frame: "w-[var(--overlay-width-medium)] max-w-full",
};

export default {
    title: "Components/CommandPalette",
    component: CommandPalette,
} as Meta<typeof CommandPalette>;

const Items = () => (
    <>
        <CommandPalette.Group heading="Pages">
            <CommandPalette.Item keywords={["home", "overview"]}>Dashboard</CommandPalette.Item>
            <CommandPalette.Item>Projects</CommandPalette.Item>
            <CommandPalette.Item>Settings</CommandPalette.Item>
        </CommandPalette.Group>
        <CommandPalette.Separator />
        <CommandPalette.Group heading="Actions">
            <CommandPalette.Item keywords={["add", "make"]}>New project</CommandPalette.Item>
            <CommandPalette.Item keywords={["ask", "help"]}>Invite a teammate</CommandPalette.Item>
            <CommandPalette.Item disabled>Delete this project</CommandPalette.Item>
        </CommandPalette.Group>
    </>
);

export const Default: StoryFn<typeof CommandPalette> = () => {
    const [picked, setPicked] = React.useState("");

    return (
        <div className={classes.frame}>
            <CommandPalette onSelect={setPicked}>
                <CommandPalette.Input />
                <CommandPalette.List>
                    <CommandPalette.Empty />
                    <Items />
                </CommandPalette.List>
            </CommandPalette>
            <Text>{picked === "" ? "Nothing picked yet" : `Picked ${picked}`}</Text>
        </div>
    );
};

export const Playground: StoryFn<CommandPaletteProps> = (args) => (
    <div className={classes.frame}>
        <CommandPalette {...args}>
            <CommandPalette.Input />
            <CommandPalette.List>
                <CommandPalette.Empty />
                <Items />
            </CommandPalette.List>
        </CommandPalette>
    </div>
);

Playground.args = {
    label: "Command palette",
    shouldFilter: true,
    loop: false,
};

Playground.argTypes = {
    label: {
        control: {
            type: "text",
        },
        description: "Names the palette to a screen reader",
    },
    shouldFilter: {
        control: {
            type: "boolean",
        },
        description: "Whether the palette narrows the list itself, or the caller does it",
    },
    loop: {
        control: {
            type: "boolean",
        },
        description: "Whether moving off either end of the list comes round to the other",
    },
    search: {
        table: {
            disable: true,
        },
    },
    value: {
        table: {
            disable: true,
        },
    },
    filter: {
        table: {
            disable: true,
        },
    },
};
