import type { StoryFn, Meta } from "@storybook/react-vite";
import { Markdown } from ".";
import type { MarkdownProps } from "./Markdown.types";

const classes = {
    box: "w-[var(--overlay-width-medium)]",
};

const SAMPLE = `# Release notes

This release is mostly housekeeping. **Nothing here changes an API**, and the
one thing that moved is written up below.

## What changed

- Faster first paint
- Fewer bytes shipped
- A quieter \`console\`

> The best release is the one nobody notices.

Read the [full changelog](https://example.com) for the rest.`;

export default {
    title: "Components/Markdown",
    component: Markdown,
} as Meta<typeof Markdown>;

export const Default: StoryFn<typeof Markdown> = () => (
    <div className={classes.box}>
        <Markdown>{SAMPLE}</Markdown>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<MarkdownProps> = (args) => (
    <div className={classes.box}>
        <Markdown {...args} />
    </div>
);

Playground.args = {
    children: SAMPLE,
    preserveNewLines: false,
};

Playground.argTypes = {
    children: {
        control: {
            type: "text",
        },
        description: "The markdown itself, as one string",
    },
    preserveNewLines: {
        control: {
            type: "boolean",
        },
        description: "Keeps every line break as it was written, rather than joining the lines",
    },
    transformers: {
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
