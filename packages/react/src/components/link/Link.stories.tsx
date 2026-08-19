import type { StoryFn, Meta } from "@storybook/react-vite";
import Link from "./Link";
import type { LinkProps } from "./Link.types";

export default {
    title: "Components/Link",
    component: Link,
} as Meta<typeof Link>;

export const Default: StoryFn<typeof Link> = () => <Link href="#">Links are great</Link>;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<LinkProps> = (args) => <Link {...args}>Links are great</Link>;

Playground.args = {
    as: "a",
    href: "#",
    muted: false,
    inline: false,
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["a", "button"],
        description: "HTML element to render",
    },
    href: {
        control: {
            type: "text",
        },
        description: "URL the link points to",
    },
    muted: {
        control: {
            type: "boolean",
        },
        description: "Uses a less prominent shade, and the default link shade on hover",
    },
    inline: {
        control: {
            type: "boolean",
        },
        description: "Underlines links adjacent to text for clear visibility",
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
