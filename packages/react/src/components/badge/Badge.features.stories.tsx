import type { StoryFn } from "@storybook/react-vite";
import { TagRegular } from "@gamecrafters/base-ui-icons";
import Badge from "./Badge";

export default {
    title: "Components/Badge/Features",
    parameters: {
        layout: "centered",
    },
};

// Primary, filled outright rather than tinted, for the badge that has to be seen first
export const Primary: StoryFn<typeof Badge> = () => <Badge variant="primary">Primary</Badge>;

// Accent
export const Accent: StoryFn<typeof Badge> = () => <Badge variant="accent">Accent</Badge>;

// Success
export const Success: StoryFn<typeof Badge> = () => <Badge variant="success">Success</Badge>;

// Attention
export const Attention: StoryFn<typeof Badge> = () => <Badge variant="attention">Attention</Badge>;

// Severe
export const Severe: StoryFn<typeof Badge> = () => <Badge variant="severe">Severe</Badge>;

// Danger
export const Danger: StoryFn<typeof Badge> = () => <Badge variant="danger">Danger</Badge>;

// Done
export const Done: StoryFn<typeof Badge> = () => <Badge variant="done">Done</Badge>;

// Sponsors
export const Sponsors: StoryFn<typeof Badge> = () => <Badge variant="sponsors">Sponsors</Badge>;

// Outline, which adds no colour of its own, for a badge that has to be read as one of a row
// without standing out from it
export const Outline: StoryFn<typeof Badge> = () => <Badge variant="outline">Outline</Badge>;

// Invisible, with the border off as well, for where a badge is only sometimes the thing to draw
// and the room it takes has to be kept either way
export const Invisible: StoryFn<typeof Badge> = () => <Badge variant="invisible">Invisible</Badge>;

// Link, for a badge that leads somewhere. It is drawn as an anchor rather than left a span, since
// what answers the pointer is put on the badges that actually go somewhere
export const Link: StoryFn<typeof Badge> = () => (
    <Badge as="a" href="https://github.com" variant="link">
        Link
    </Badge>
);

// Dot, where the colour is a dot inside a plain pill rather than the pill itself, so a run of
// them beside one another is read as a column of states rather than a row of colours
export const Dot: StoryFn<typeof Badge> = () => (
    <Badge variant="success" appearance="dot">
        Healthy
    </Badge>
);

// A Leading Visual, which stands before the text and is drawn to whichever size step the badge
// is on
export const LeadingVisual: StoryFn<typeof Badge> = () => (
    <Badge variant="accent" leadingVisual={TagRegular}>
        Release
    </Badge>
);

// A Leading Visual In Place Of The Dot, since two marks before one word is one more than the
// word needs
export const LeadingVisualWithDot: StoryFn<typeof Badge> = () => (
    <Badge variant="success" appearance="dot" leadingVisual={TagRegular}>
        Release
    </Badge>
);

// Large Size
export const SizeLarge: StoryFn<typeof Badge> = () => <Badge size="large">Default</Badge>;

// Medium Size
export const SizeMedium: StoryFn<typeof Badge> = () => <Badge size="medium">Default</Badge>;

// Small Size
export const SizeSmall: StoryFn<typeof Badge> = () => <Badge size="small">Default</Badge>;
