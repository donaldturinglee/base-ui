import * as React from "react";
import {
    AddRegular,
    ChevronDownRegular,
    SubtractRegular,
    TextAlignCenterRegular,
    TextAlignLeftRegular,
    TextAlignRightRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { IconButton } from "../icon-button";
import { Button } from "../button";
import type { ButtonSize } from "../button";
import { ButtonGroup } from ".";

const SIZES: ButtonSize[] = ["small", "medium", "large"];

export default {
    title: "Components/ButtonGroup/Features",
    parameters: {
        layout: "centered",
    },
};

// Size Scale, where every button in a group carries the same size
export const SizeScale: StoryFn<typeof ButtonGroup> = () => (
    <ButtonGroup>
        {SIZES.map((size) => (
            <Button key={size} size={size}>
                {size}
            </Button>
        ))}
    </ButtonGroup>
);

// Icon Buttons
export const IconButtons: StoryFn<typeof ButtonGroup> = () => (
    <ButtonGroup>
        <IconButton icon={AddRegular} aria-label="Add" />
        <IconButton icon={SubtractRegular} aria-label="Subtract" />
    </ButtonGroup>
);

// Loading Buttons, where the button that is waiting keeps its place in the group
export const LoadingButtons: StoryFn<typeof ButtonGroup> = () => {
    const [loading, setLoading] = React.useState(true);

    return (
        <ButtonGroup>
            <Button
                loading={loading}
                onClick={() => {
                    setLoading(true);
                    window.setTimeout(() => setLoading(false), 2000);
                }}
            >
                Button 1
            </Button>
            <Button>Button 2</Button>
            <Button>Button 3</Button>
        </ButtonGroup>
    );
};

// A Button And A Link, which are squared off and rounded alike
export const ButtonAndLink: StoryFn<typeof ButtonGroup> = () => (
    <ButtonGroup>
        <Button>Button</Button>
        <Button as="a" href="#docs">
            Link
        </Button>
    </ButtonGroup>
);

// A Split Button, where the second button opens the rest of the actions
export const SplitButton: StoryFn<typeof ButtonGroup> = () => (
    <ButtonGroup>
        <Button>Merge pull request</Button>
        <IconButton icon={ChevronDownRegular} aria-label="More merge options" />
    </ButtonGroup>
);

// Inactive Buttons, which read as unavailable while staying in the tab order
export const InactiveButtons: StoryFn<typeof ButtonGroup> = () => (
    <ButtonGroup>
        <Button inactive aria-disabled>
            Button 1
        </Button>
        <IconButton icon={SubtractRegular} inactive aria-disabled aria-label="Subtract" />
    </ButtonGroup>
);

// As A Toolbar, which is a single tab stop that the arrow keys move within
export const AsToolbar: StoryFn<typeof ButtonGroup> = () => (
    <ButtonGroup role="toolbar" aria-label="Text alignment">
        <IconButton icon={TextAlignLeftRegular} aria-label="Align left" />
        <IconButton icon={TextAlignCenterRegular} aria-label="Align centre" />
        <IconButton icon={TextAlignRightRegular} aria-label="Align right" />
    </ButtonGroup>
);
