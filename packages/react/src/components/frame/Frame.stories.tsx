import type { StoryFn, Meta } from "@storybook/react-vite";
import { Frame } from ".";
import type { FrameProps } from "./Frame.types";

const classes = {
    frame: "[border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
};

// A frame carries none of the page's styles, so anything drawn inside one is written out with
// styles of its own rather than with the classes the rest of a story would reach for
const inlineStyles = {
    body: { font: "14px system-ui, sans-serif", padding: "16px" },
};

export default {
    title: "Components/Frame",
    component: Frame,
} as Meta<typeof Frame>;

export const Default: StoryFn<typeof Frame> = () => (
    <Frame title="A frame" className={classes.frame}>
        <div style={inlineStyles.body}>
            Drawn inside a document of its own, which carries none of the page&apos;s styles.
        </div>
    </Frame>
);

export const Playground: StoryFn<FrameProps> = (args) => (
    <Frame {...args} className={classes.frame}>
        <div style={inlineStyles.body}>
            Drawn inside a document of its own, which carries none of the page&apos;s styles.
        </div>
    </Frame>
);

Playground.args = {
    title: "A frame",
    width: 400,
    height: 200,
};

Playground.argTypes = {
    title: {
        control: {
            type: "text",
        },
        description: "What a screen reader reads the frame by",
    },
    width: {
        control: {
            type: "number",
        },
        description: "How wide the element holding the document is",
    },
    height: {
        control: {
            type: "number",
        },
        description: "How tall it is, since the document within has no say in it",
    },
    head: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};
