import type { StoryFn, Meta } from "@storybook/react-vite";
import { Clipboard } from ".";
import type { ClipboardProps } from "./Clipboard.types";

const classes = {
    // Gives the row a container to lay itself out against
    container: "w-[var(--overlay-width-medium)]",
};

const value = "https://github.com/donaldturinglee/base-ui.git";

export default {
    title: "Components/Clipboard",
    component: Clipboard,
} as Meta<typeof Clipboard>;

export const Default: StoryFn<typeof Clipboard> = () => (
    <div className={classes.container}>
        <Clipboard value={value}>
            <Clipboard.Input aria-label="Repository URL" />
            <Clipboard.Trigger />
        </Clipboard>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ClipboardProps> = (args) => (
    <div className={classes.container}>
        <Clipboard {...args}>
            <Clipboard.Input aria-label="Repository URL" />
            <Clipboard.Trigger />
        </Clipboard>
    </div>
);

Playground.args = {
    value,
    timeout: 2000,
    disabled: false,
};

Playground.argTypes = {
    value: {
        control: {
            type: "text",
        },
        description: "The text the clipboard is given",
    },
    timeout: {
        control: {
            type: "number",
            min: 0,
            max: 10000,
            step: 250,
        },
        description: "How long the tick stands before the trigger goes back to offering a copy",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the value being copied",
    },
    copiedAnnouncement: {
        control: {
            type: "text",
        },
        description: "What a screen reader is told once the value has been copied",
    },
    children: {
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
