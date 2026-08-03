import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import ScrollableRegion from "./ScrollableRegion";
import type { ScrollableRegionProps } from "./ScrollableRegion.types";

const classes = {
    // Constrains the region so the content inside it actually overflows
    region: "max-w-[20rem] max-h-[6rem] p-[var(--base-size-8)] border-solid border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
    nowrap: "block whitespace-nowrap",
};

export default {
    title: "Components/ScrollableRegion",
    component: ScrollableRegion,
} as Meta<typeof ScrollableRegion>;

export const Default: StoryFn<typeof ScrollableRegion> = () => (
    <ScrollableRegion aria-label="Example scrollable region" className={classes.region}>
        <Text as="p">Example content that triggers overflow.</Text>
        <Text as="p" className={classes.nowrap}>
            The content here does not wrap, so the component makes the container a region, labels
            it, and lets it take focus so it can be scrolled from the keyboard.
        </Text>
    </ScrollableRegion>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ScrollableRegionProps> = (args) => (
    <ScrollableRegion {...args} className={classes.region}>
        <Text as="p">Example content that triggers overflow.</Text>
        <Text as="p" className={classes.nowrap}>
            The content here does not wrap, so the component makes the container a region, labels
            it, and lets it take focus so it can be scrolled from the keyboard.
        </Text>
    </ScrollableRegion>
);

Playground.args = {
    "aria-label": "Example scrollable region",
};

Playground.argTypes = {
    "aria-label": {
        control: {
            type: "text",
        },
        description: "Names the region once the content overflows",
    },
    "aria-labelledby": {
        control: {
            type: "text",
        },
        description: "Names the region from another element instead of aria-label",
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
