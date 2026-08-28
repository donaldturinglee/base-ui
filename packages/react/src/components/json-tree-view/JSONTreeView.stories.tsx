import type { StoryFn, Meta } from "@storybook/react-vite";
import { JSONTreeView } from ".";
import type { JSONTreeViewProps } from "./JSONTreeView.types";

const classes = {
    // Gives the tree a column to stand in rather than the width of the page, since a value nested
    // a few levels down would otherwise be read across the whole of it
    container: "w-[var(--overlay-width-medium)]",
};

const data = {
    name: "John Doe",
    age: 30,
    email: "john.doe@example.com",
    active: true,
    tags: ["design", "research", "writing"],
    address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "12345",
    },
};

export default {
    title: "Components/JSONTreeView",
    component: JSONTreeView,
} as Meta<typeof JSONTreeView>;

export const Default: StoryFn<typeof JSONTreeView> = () => (
    <div className={classes.container}>
        <JSONTreeView data={data} />
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<JSONTreeViewProps> = (args) => (
    <div className={classes.container}>
        <JSONTreeView {...args} />
    </div>
);

Playground.args = {
    data,
    defaultExpandedDepth: 1,
    quotesOnKeys: false,
    showNonEnumerable: false,
    maxPreviewItems: 5,
    collapseStringsAfterLength: 0,
    groupArraysAfterLength: 0,
};

Playground.argTypes = {
    defaultExpandedDepth: {
        control: {
            type: "number",
            min: 0,
            max: 5,
            step: 1,
        },
        description: "How many levels down stand open to begin with",
    },
    quotesOnKeys: {
        control: {
            type: "boolean",
        },
        description: "Draws quotes around the names, the way a JSON file writes them",
    },
    showNonEnumerable: {
        control: {
            type: "boolean",
        },
        description: "Shows the names an ordinary walk of a thing passes over",
    },
    maxPreviewItems: {
        control: {
            type: "number",
            min: 0,
            max: 20,
            step: 1,
        },
        description: "How many of the names it holds a closed row gives away",
    },
    collapseStringsAfterLength: {
        control: {
            type: "number",
            min: 0,
            max: 200,
            step: 10,
        },
        description: "How long a string is allowed to run before it is cut",
    },
    groupArraysAfterLength: {
        control: {
            type: "number",
            min: 0,
            max: 100,
            step: 10,
        },
        description: "Breaks a long list into runs of this many",
    },
    data: {
        table: {
            disable: true,
        },
    },
    renderValue: {
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
