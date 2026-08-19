import type { Meta, StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Heading } from "../heading";
import { Text } from "../text";
import { Popover } from ".";
import type { PopoverContentProps, PopoverProps } from "./Popover.types";

const classes = {
    // Gives the popover room to stand in, rather than against the edge of the frame
    container: "p-[var(--base-size-40)]",
    // The surface stands clear of whatever the popover was written after, leaving the gap the
    // caret is drawn into
    content: "mt-[var(--base-size-8)]",
    body: "flex flex-col items-start gap-[var(--base-size-8)]",
};

export default {
    title: "Components/Popover",
    component: Popover,
} as Meta<typeof Popover>;

export const Default: StoryFn<typeof Popover> = () => (
    <div className={classes.container}>
        <Popover open relative caret="top">
            <Popover.Content className={classes.content}>
                <div className={classes.body}>
                    <Heading size="small">Popover heading</Heading>
                    <Text as="p">Message about popovers</Text>
                    <Button>Got it!</Button>
                </div>
            </Popover.Content>
        </Popover>
    </div>
);

export const Playground: StoryFn<PopoverProps & PopoverContentProps> = (args) => (
    <div className={classes.container}>
        <Popover caret={args.caret} open={args.open} relative={args.relative}>
            <Popover.Content
                className={classes.content}
                width={args.width}
                height={args.height}
                overflow={args.overflow}
            >
                <div className={classes.body}>
                    <Heading size="small">Popover heading</Heading>
                    <Text as="p">Message about popovers</Text>
                    <Button>Got it!</Button>
                </div>
            </Popover.Content>
        </Popover>
    </div>
);

Playground.args = {
    caret: "top",
    open: true,
    relative: true,
    width: "small",
    height: "fit-content",
    overflow: "visible",
};

Playground.argTypes = {
    caret: {
        control: {
            type: "select",
        },
        options: [
            "top",
            "bottom",
            "left",
            "right",
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "left-top",
            "left-bottom",
            "right-top",
            "right-bottom",
        ],
        description: "Which edge the caret stands on, and where along that edge",
    },
    open: {
        control: {
            type: "boolean",
        },
        description: "Whether the popover is shown",
    },
    relative: {
        control: {
            type: "boolean",
        },
        description: "Stands the popover in the flow rather than laying it out against an ancestor",
    },
    width: {
        control: {
            type: "radio",
        },
        options: ["xsmall", "small", "medium", "large", "xlarge", "auto"],
        description: "How wide the surface stands",
    },
    height: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large", "xlarge", "auto", "fit-content"],
        description: "How tall the surface stands",
    },
    overflow: {
        control: {
            type: "radio",
        },
        options: ["auto", "hidden", "scroll", "visible"],
        description:
            "What becomes of content the surface has no room for. Anything that clips takes the caret with it",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
