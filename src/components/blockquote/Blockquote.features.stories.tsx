import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Blockquote } from ".";

const classes = {
    // Gives the quotation a column to wrap within
    container: "w-[20rem]",
    // Hands the rule a colour of its own rather than one off the scale
    repainted: "[--blockquote-border-color:var(--border-color-accent-emphasis)]",
};

const quotation =
    "A quotation stands apart from the page around it, so a reader can see at once that the words were taken from somewhere else.";

export default {
    title: "Components/Blockquote/Features",
};

// Size Scale
export const SizeScale: StoryFn<typeof Blockquote> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["large", "medium", "small"] as const).map((size) => (
            <Stack key={size} gap="condensed">
                <Text size="small">size=&quot;{size}&quot;</Text>
                <Blockquote size={size}>{quotation}</Blockquote>
            </Stack>
        ))}
    </Stack>
);

// Variant Scale
export const VariantScale: StoryFn<typeof Blockquote> = () => (
    <Stack gap="normal" className={classes.container}>
        {(["subtle", "default", "emphasis"] as const).map((variant) => (
            <Stack key={variant} gap="condensed">
                <Text size="small">variant=&quot;{variant}&quot;</Text>
                <Blockquote variant={variant}>{quotation}</Blockquote>
            </Stack>
        ))}
    </Stack>
);

// With An Attribution, where the words are cited and the source named beneath them
export const WithAnAttribution: StoryFn<typeof Blockquote> = () => (
    <Stack as="figure" gap="condensed" className={classes.container}>
        <Blockquote cite="https://example.com/handbook">{quotation}</Blockquote>
        <Text as="figcaption" size="small">
            — The Base UI handbook
        </Text>
    </Stack>
);

// With Several Paragraphs, which the rule runs the whole height of
export const WithSeveralParagraphs: StoryFn<typeof Blockquote> = () => (
    <Blockquote className={classes.container}>
        <Stack gap="condensed">
            <Text as="p">{quotation}</Text>
            <Text as="p">
                Where it runs on past a paragraph, the rule keeps to the whole of it rather than
                starting again at each one.
            </Text>
        </Stack>
    </Blockquote>
);

// Repainted, where the rule is given a colour of its own rather than one off the scale
export const Repainted: StoryFn<typeof Blockquote> = () => (
    <Blockquote className={`${classes.container} ${classes.repainted}`}>{quotation}</Blockquote>
);
