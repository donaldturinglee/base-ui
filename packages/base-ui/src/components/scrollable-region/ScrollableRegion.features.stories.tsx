import type { StoryFn } from "@storybook/react-vite";
import { Heading } from "../heading";
import { Stack } from "../stack";
import { Text } from "../text";
import ScrollableRegion from "./ScrollableRegion";

const classes = {
    // Constrains the region so the content inside it actually overflows
    region: "max-w-[20rem] max-h-[6rem] p-[var(--base-size-8)] border-solid border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
    nowrap: "block whitespace-nowrap",
};

export default {
    title: "Components/ScrollableRegion/Features",
    parameters: {
        layout: "centered",
    },
};

// Vertical Overflow
export const VerticalOverflow: StoryFn<typeof ScrollableRegion> = () => (
    <ScrollableRegion aria-label="Release notes" className={classes.region}>
        {Array.from({ length: 8 }, (_, index) => (
            <Text as="p" key={index}>
                Line {index + 1} of content that runs past the height of the container.
            </Text>
        ))}
    </ScrollableRegion>
);

// Horizontal Overflow
export const HorizontalOverflow: StoryFn<typeof ScrollableRegion> = () => (
    <ScrollableRegion aria-label="Command output" className={classes.region}>
        <Text as="p" className={classes.nowrap}>
            This single line of content does not wrap, so it runs past the width of the container
            and the region scrolls sideways instead.
        </Text>
    </ScrollableRegion>
);

// Labelled By Another Element
export const LabelledByAnotherElement: StoryFn<typeof ScrollableRegion> = () => (
    <Stack gap="condensed">
        <Heading id="release-notes-heading" size="small">
            Release notes
        </Heading>
        <ScrollableRegion aria-labelledby="release-notes-heading" className={classes.region}>
            {Array.from({ length: 8 }, (_, index) => (
                <Text as="p" key={index}>
                    Line {index + 1} of content that runs past the height of the container.
                </Text>
            ))}
        </ScrollableRegion>
    </Stack>
);
