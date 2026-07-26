import type { StoryFn, Meta } from "@storybook/react-vite";
import { TopicTag } from ".";
import type { TopicTagProps } from "./TopicTag.types";

export default {
    title: "Components/TopicTag",
    component: TopicTag,
} as Meta<typeof TopicTag>;

export const Default: StoryFn<typeof TopicTag> = () => (
    <TopicTag href="/topics/react">react</TopicTag>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TopicTagProps> = (args) => <TopicTag {...args}>react</TopicTag>;

Playground.args = {
    as: "a",
    href: "/topics/react",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["a", "button", "span"],
        description: "HTML element to render",
    },
    href: {
        control: {
            type: "text",
        },
        description: "Topic the tag leads to",
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
