import type { StoryFn, Meta } from "@storybook/react-vite";
import { RichTextEditor } from ".";
import type { RichTextEditorProps } from "./RichTextEditor.types";

const classes = {
    box: "w-[var(--overlay-width-medium)]",
};

export default {
    title: "Components/RichTextEditor",
    component: RichTextEditor,
} as Meta<typeof RichTextEditor>;

export const Default: StoryFn<typeof RichTextEditor> = () => (
    <div className={classes.box}>
        <RichTextEditor aria-label="Description" placeholder="Write a description" minHeight={160}>
            <RichTextEditor.Toolbar />
            <RichTextEditor.Content />
        </RichTextEditor>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<RichTextEditorProps> = (args) => (
    <div className={classes.box}>
        <RichTextEditor {...args} aria-label="Description">
            <RichTextEditor.Toolbar />
            <RichTextEditor.Content />
        </RichTextEditor>
    </div>
);

Playground.args = {
    placeholder: "Write a description",
    minHeight: 160,
    maxHeight: 320,
    readOnly: false,
};

Playground.argTypes = {
    placeholder: {
        control: {
            type: "text",
        },
        description: "What is shown in the writing's place while nothing has been written",
    },
    minHeight: {
        control: {
            type: "number",
        },
        description: "How tall the writing area stands before it has been written in",
    },
    maxHeight: {
        control: {
            type: "number",
        },
        description: "How tall it is let grow before what is written is scrolled through",
    },
    readOnly: {
        control: {
            type: "boolean",
        },
        description: "Leaves what is written to be read and copied but not changed",
    },
    defaultValue: {
        table: {
            disable: true,
        },
    },
    nodes: {
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
