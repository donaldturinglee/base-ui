import {
    BookRegular,
    ChevronRightRegular,
    ShareRegular,
    StarRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { LinkButton } from ".";
import type { ButtonSize, ButtonVariant } from "../button";

const classes = {
    // Gives the block story a container to fill
    container: "w-[18rem]",
};

const VARIANTS: ButtonVariant[] = ["default", "primary", "danger", "invisible", "link"];
const SIZES: ButtonSize[] = ["small", "medium", "large"];

export default {
    title: "Components/LinkButton/Features",
    parameters: {
        layout: "centered",
    },
};

// Variant Scale
export const VariantScale: StoryFn<typeof LinkButton> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {VARIANTS.map((variant) => (
            <LinkButton key={variant} href="#docs" variant={variant}>
                {variant}
            </LinkButton>
        ))}
    </Stack>
);

// Size Scale
export const SizeScale: StoryFn<typeof LinkButton> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {SIZES.map((size) => (
            <LinkButton key={size} href="#docs" size={size}>
                {size}
            </LinkButton>
        ))}
    </Stack>
);

// Leading Visual
export const LeadingVisual: StoryFn<typeof LinkButton> = () => (
    <LinkButton href="#docs" leadingVisual={BookRegular}>
        Read the docs
    </LinkButton>
);

// Trailing Visual
export const TrailingVisual: StoryFn<typeof LinkButton> = () => (
    <LinkButton href="#docs" trailingVisual={ChevronRightRegular}>
        Carry on
    </LinkButton>
);

// Counter
export const Counter: StoryFn<typeof LinkButton> = () => (
    <LinkButton href="#stargazers" leadingVisual={StarRegular} count={128}>
        Stars
    </LinkButton>
);

// Block, which fills the width of its container
export const Block: StoryFn<typeof LinkButton> = () => (
    <div className={classes.container}>
        <LinkButton href="#docs" block>
            Read the docs
        </LinkButton>
    </div>
);

// Opening In A New Tab
export const NewTab: StoryFn<typeof LinkButton> = () => (
    <LinkButton
        href="https://example.com"
        target="_blank"
        rel="noreferrer"
        trailingVisual={ShareRegular}
    >
        Open in a new tab
    </LinkButton>
);

// Inactive
export const Inactive: StoryFn<typeof LinkButton> = () => (
    <LinkButton href="#docs" inactive leadingVisual={BookRegular}>
        Read the docs
    </LinkButton>
);
