import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    BookmarkRegular,
    CopyRegular,
    DeleteRegular,
    EditRegular,
    ShareRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionBar } from ".";
import type { ActionBarProps } from "./ActionBar.types";

const classes = {
    // The bar is only as wide as it is given room for, which is what decides how much of it
    // is moved into the overflow menu
    container:
        "w-[24rem] border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)] rounded-[var(--border-radius-medium)]",
};

export default {
    title: "Components/ActionBar",
    component: ActionBar,
} as Meta<typeof ActionBar>;

export const Default: StoryFn<typeof ActionBar> = () => (
    <div className={classes.container}>
        <ActionBar aria-label="File actions">
            <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
            <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
            <ActionBar.IconButton icon={ShareRegular} aria-label="Share" />
            <ActionBar.Divider />
            <ActionBar.IconButton icon={BookmarkRegular} aria-label="Bookmark" />
            <ActionBar.IconButton icon={DeleteRegular} aria-label="Delete" />
        </ActionBar>
    </div>
);

Default.parameters = {
    layout: "centered",
};

// The bar is named by the story itself, so the controls are only over the rest of it
type PlaygroundArgs = Omit<ActionBarProps, "aria-label" | "aria-labelledby">;

export const Playground: StoryFn<PlaygroundArgs> = (args) => (
    <div className={classes.container}>
        <ActionBar {...args} aria-label="File actions">
            <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
            <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
            <ActionBar.IconButton icon={ShareRegular} aria-label="Share" />
            <ActionBar.Divider />
            <ActionBar.IconButton icon={BookmarkRegular} aria-label="Bookmark" />
        </ActionBar>
    </div>
);

Playground.args = {
    size: "medium",
    flush: false,
    gap: "condensed",
};

Playground.argTypes = {
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "How much room each item of the bar is given",
    },
    flush: {
        control: {
            type: "boolean",
        },
        description: "Lets the bar sit flush with whatever holds it",
    },
    gap: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed"],
        description: "How much room is left between one item and the next",
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
