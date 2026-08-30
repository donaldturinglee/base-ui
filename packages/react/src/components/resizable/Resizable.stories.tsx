import type { Decorator, StoryFn, Meta } from "@storybook/react-vite";
import { Resizable } from ".";
import type { ResizableProps } from "./Resizable.types";

const classes = {
    // A group of panels fills the room it is given, so the stories give it some to fill
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
    title: "Components/Resizable",
    component: Resizable,
    decorators: [withContainer],
} as Meta<typeof Resizable>;

export const Default: StoryFn<typeof Resizable> = () => (
    <Resizable>
        <Resizable.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Content</Resizable.Panel>
    </Resizable>
);

export const Playground: StoryFn<ResizableProps> = (args) => (
    <Resizable {...args}>
        <Resizable.Panel defaultSize="30" className={classes.panel}>
            Sidebar
        </Resizable.Panel>
        <Resizable.ResizeTrigger>
            <Resizable.ResizeTriggerSeparator />
            <Resizable.ResizeTriggerIndicator />
        </Resizable.ResizeTrigger>
        <Resizable.Panel className={classes.panel}>Content</Resizable.Panel>
    </Resizable>
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
    resizableRef: {
        table: {
            disable: true,
        },
    },
};
