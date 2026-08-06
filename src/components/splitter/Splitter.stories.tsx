import type { Decorator, StoryFn, Meta } from "@storybook/react-vite";
import { Splitter } from ".";
import type { SplitterProps } from "./Splitter.types";

const classes = {
    // A splitter fills the room it is given, so the stories give it some to fill
    container:
        "w-[var(--overlay-width-medium)] max-w-full h-[var(--overlay-height-small)] border-solid border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
    panel: "flex items-center justify-center p-[var(--base-size-8)] [font-weight:var(--base-text-weight-semibold)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Splitter",
    component: Splitter,
    decorators: [withContainer],
} as Meta<typeof Splitter>;

export const Default: StoryFn<typeof Splitter> = () => (
    <Splitter>
        <Splitter.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Content</Splitter.Panel>
    </Splitter>
);

export const Playground: StoryFn<SplitterProps> = (args) => (
    <Splitter {...args}>
        <Splitter.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Splitter.Panel>
        <Splitter.ResizeTrigger>
            <Splitter.ResizeTriggerSeparator />
            <Splitter.ResizeTriggerIndicator />
        </Splitter.ResizeTrigger>
        <Splitter.Panel className={classes.panel}>Content</Splitter.Panel>
    </Splitter>
);

Playground.args = {
    orientation: "horizontal",
    disabled: false,
    disableCursor: false,
};

Playground.argTypes = {
    orientation: {
        control: {
            type: "radio",
        },
        options: ["horizontal", "vertical"],
        description: "Which way the panels are laid out",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Holds every panel where it stands",
    },
    disableCursor: {
        control: {
            type: "boolean",
        },
        description: "Leaves the pointer as it is rather than showing what a handle will do",
    },
    children: {
        table: {
            disable: true,
        },
    },
    defaultLayout: {
        table: {
            disable: true,
        },
    },
    onLayoutChange: {
        table: {
            disable: true,
        },
    },
    onLayoutChanged: {
        table: {
            disable: true,
        },
    },
    splitterRef: {
        table: {
            disable: true,
        },
    },
};
