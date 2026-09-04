import type { StoryFn, Meta } from "@storybook/react-vite";
import { Clipboard } from ".";
import type { ClipboardProps } from "./Clipboard.types";

const classes = {
    // Gives the row a container to lay itself out against
    container: "w-[var(--overlay-width-medium)]",
};

const value = "https://github.com/gamecrafters-io/base-ui.git";

export default {
    title: "Components/Clipboard",
    component: Clipboard,
} as Meta<typeof Clipboard>;

export const Default: StoryFn<typeof Clipboard> = () => (
    <Clipboard value={value}>
        <Clipboard.Control>
            <Clipboard.Trigger />
        </Clipboard.Control>
    </Clipboard>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ClipboardProps> = (args) => (
    <div className={classes.container}>
        <Clipboard {...args}>
            <Clipboard.Label>Repository URL</Clipboard.Label>
            <Clipboard.Control>
                <Clipboard.Input />
                <Clipboard.Trigger />
            </Clipboard.Control>
        </Clipboard>
    </div>
);

Playground.args = {
    value,
    timeout: 3000,
    disabled: false,
};

Playground.argTypes = {
    value: {
        control: {
            type: "text",
        },
        description: "The text the clipboard is given, where the caller keeps hold of it",
    },
    defaultValue: {
        control: {
            type: "text",
        },
        description: "The text it starts out holding, where the clipboard keeps hold of it itself",
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
