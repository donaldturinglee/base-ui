import type { StoryFn } from "@storybook/react-vite";
import Label from "./Label";

export default {
    title: "Components/Label/Features",
    parameters: {
        layout: "centered",
    },
};

// Primary
export const Primary: StoryFn<typeof Label> = () => <Label variant="primary">Primary</Label>;

// Secondary
export const Secondary: StoryFn<typeof Label> = () => <Label variant="secondary">Secondary</Label>;

// Accent
export const Accent: StoryFn<typeof Label> = () => <Label variant="accent">Accent</Label>;

// Success
export const Success: StoryFn<typeof Label> = () => <Label variant="success">Success</Label>;

// Attention
export const Attention: StoryFn<typeof Label> = () => <Label variant="attention">Attention</Label>;

// Severe
export const Severe: StoryFn<typeof Label> = () => <Label variant="severe">Severe</Label>;

// Danger
export const Danger: StoryFn<typeof Label> = () => <Label variant="danger">Danger</Label>;

// Done
export const Done: StoryFn<typeof Label> = () => <Label variant="done">Done</Label>;

// Sponsors
export const Sponsors: StoryFn<typeof Label> = () => <Label variant="sponsors">Sponsors</Label>;

// Large Size
export const SizeLarge: StoryFn<typeof Label> = () => <Label size="large">Default</Label>;

// Medium Size
export const SizeMedium: StoryFn<typeof Label> = () => <Label size="medium">Default</Label>;

// Small Size
export const SizeSmall: StoryFn<typeof Label> = () => <Label size="small">Default</Label>;
