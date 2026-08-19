import {
    DeleteRegular,
    DismissRegular,
    MoreHorizontalRegular,
    StarRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import { IconButton } from ".";
import type { ButtonSize, ButtonVariant } from "../button";

const VARIANTS: ButtonVariant[] = ["default", "primary", "danger", "invisible", "link"];
const SIZES: ButtonSize[] = ["small", "medium", "large"];

export default {
    title: "Components/IconButton/Features",
    parameters: {
        layout: "centered",
    },
};

// Variant Scale
export const VariantScale: StoryFn<typeof IconButton> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {VARIANTS.map((variant) => (
            <IconButton
                key={variant}
                icon={StarRegular}
                variant={variant}
                aria-label={`Star (${variant})`}
            />
        ))}
    </Stack>
);

// Size Scale
export const SizeScale: StoryFn<typeof IconButton> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {SIZES.map((size) => (
            <IconButton
                key={size}
                icon={MoreHorizontalRegular}
                size={size}
                aria-label={`More (${size})`}
            />
        ))}
    </Stack>
);

// Loading
export const Loading: StoryFn<typeof IconButton> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {SIZES.map((size) => (
            <IconButton
                key={size}
                icon={StarRegular}
                size={size}
                loading
                aria-label={`Star (${size})`}
            />
        ))}
    </Stack>
);

// Disabled
export const Disabled: StoryFn<typeof IconButton> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        {VARIANTS.map((variant) => (
            <IconButton
                key={variant}
                icon={DeleteRegular}
                variant={variant}
                disabled
                aria-label={`Delete (${variant})`}
            />
        ))}
    </Stack>
);

// Inactive
export const Inactive: StoryFn<typeof IconButton> = () => (
    <IconButton icon={DismissRegular} inactive aria-label="Dismiss" />
);

// Named By Another Element, for when the label is already on the page
export const NamedByAnotherElement: StoryFn<typeof IconButton> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <span id="dismiss-label">Dismiss</span>
        <IconButton icon={DismissRegular} aria-labelledby="dismiss-label" />
    </Stack>
);
