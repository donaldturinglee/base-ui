import type { StoryFn, Meta } from "@storybook/react-vite";
import { InlineMessage } from ".";
import type { InlineMessageProps } from "./InlineMessage.types";

export default {
    title: "Components/InlineMessage",
    component: InlineMessage,
} as Meta<typeof InlineMessage>;

export const Default: StoryFn<typeof InlineMessage> = () => (
    <InlineMessage variant="unavailable">This branch has already been merged</InlineMessage>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<InlineMessageProps> = (args) => <InlineMessage {...args} />;

Playground.args = {
    children: "This branch has already been merged",
    variant: "unavailable",
    size: "medium",
};

Playground.argTypes = {
    children: {
        control: {
            type: "text",
        },
        description: "What the message says",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["critical", "success", "unavailable", "warning"],
        description: "What the message says of how something stands",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium"],
        description: "How large the message is set",
    },
    leadingVisual: {
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
