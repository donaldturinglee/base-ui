import type { StoryFn } from "@storybook/react-vite";
import { Label } from "../label";
import { Stack } from "../stack";
import { Text } from "../text";
import Hidden from "./Hidden";

export default {
    title: "Components/Hidden/Features",
    parameters: {
        layout: "centered",
    },
};

// Hide Content
export const HideContent: StoryFn<typeof Hidden> = () => (
    <Stack gap="condensed">
        <Hidden when="narrow">
            <Text>Shown while the viewport is regular or wide</Text>
        </Hidden>
        <Hidden when="regular">
            <Text>Shown while the viewport is narrow or wide</Text>
        </Hidden>
        <Hidden when="wide">
            <Text>Shown while the viewport is narrow or regular</Text>
        </Hidden>
    </Stack>
);

// Render Content Responsively
export const RenderContentResponsively: StoryFn<typeof Hidden> = () => (
    <Stack gap="condensed" align="start">
        <Hidden when="narrow">
            <Label variant="accent">Regular and wide</Label>
        </Hidden>
        <Hidden when={["regular", "wide"]}>
            <Label variant="success">Narrow only</Label>
        </Hidden>
    </Stack>
);
