import type { StoryFn, Meta } from "@storybook/react-vite";
import { ClipboardText } from ".";
import type { ClipboardTextProps } from "./ClipboardText.types";

const classes = {
    // Gives the row a container to lay itself out against
    container: "w-[var(--overlay-width-medium)]",
};

const value = "https://github.com/donaldturinglee/base-ui.git";

export default {
    title: "Components/ClipboardText",
    component: ClipboardText,
} as Meta<typeof ClipboardText>;

export const Default: StoryFn<typeof ClipboardText> = () => (
    <div className={classes.container}>
        <ClipboardText value={value}>
            <ClipboardText.Input aria-label="Repository URL" />
            <ClipboardText.Trigger />
        </ClipboardText>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ClipboardTextProps> = (args) => (
    <div className={classes.container}>
        <ClipboardText {...args}>
            <ClipboardText.Input aria-label="Repository URL" />
            <ClipboardText.Trigger />
        </ClipboardText>
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
