import type { StoryFn } from "@storybook/react-vite";
import { LockClosedRegular, RocketRegular } from "@gamecrafters/base-ui-icons";
import { Stack } from "../stack";
import { Text } from "../text";
import { InlineMessage } from ".";
import type { InlineMessageVariant } from "./InlineMessage.types";

const classes = {
    // Holds the message to a width a line of it has to break within
    narrow: "max-w-[30ch]",
};

const variants: InlineMessageVariant[] = ["critical", "success", "unavailable", "warning"];

export default {
    title: "Components/InlineMessage/Features",
    parameters: {
        layout: "centered",
    },
};

// Variant Scale, which is what the message says of how something stands
export const VariantScale: StoryFn<typeof InlineMessage> = () => (
    <Stack gap="normal">
        {variants.map((variant) => (
            <InlineMessage key={variant} variant={variant}>
                An example inline message
            </InlineMessage>
        ))}
    </Stack>
);

// Sizes, for a message set beside text of its own size
export const Sizes: StoryFn<typeof InlineMessage> = () => (
    <Stack gap="normal">
        <InlineMessage variant="success" size="small">
            An example inline message
        </InlineMessage>
        <InlineMessage variant="success" size="medium">
            An example inline message
        </InlineMessage>
    </Stack>
);

// Without A Variant, where the message only tells the reader something
export const WithoutAVariant: StoryFn<typeof InlineMessage> = () => (
    <InlineMessage>Only the owner of the repository can change this</InlineMessage>
);

// With A Custom Visual, which stands in place of the icon the variant carries
export const WithACustomVisual: StoryFn<typeof InlineMessage> = () => (
    <Stack gap="normal">
        <InlineMessage variant="unavailable" leadingVisual={LockClosedRegular}>
            This repository is private
        </InlineMessage>
        <InlineMessage variant="success" leadingVisual={<RocketRegular />}>
            The deploy has finished
        </InlineMessage>
    </Stack>
);

// Multiline, where the message keeps to its own column rather than wrapping under the icon
export const Multiline: StoryFn<typeof InlineMessage> = () => (
    <div className={classes.narrow}>
        <InlineMessage variant="success">
            An example inline message that runs on for long enough to take more than one line
        </InlineMessage>
    </div>
);

// Beside A Field, which is where a message of this kind is most often read
export const BesideAField: StoryFn<typeof InlineMessage> = () => (
    <Stack gap="condensed" className={classes.narrow}>
        <Text weight="semibold">Repository name</Text>
        <Text size="small">base-ui</Text>
        <InlineMessage variant="warning" size="small">
            Renaming the repository takes every link to it with it
        </InlineMessage>
    </Stack>
);
