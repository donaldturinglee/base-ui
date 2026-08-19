import type { StoryFn } from "@storybook/react-vite";
import { AspectRatio } from "../aspect-ratio";
import { Placeholder } from "../placeholder";
import { Stack } from "../stack";
import { Text } from "../text";
import { Box } from ".";

const classes = {
    // The cropping story holds its boxes to a width, since what is inside takes its height
    // from the width it is given
    column: "w-[12rem]",
};

export default {
    title: "Components/Box/Features",
};

const ScaleLabel = ({ label }: { label: string }) => (
    <Text size="small" className="text-foreground-muted">
        {label}
    </Text>
);

// Padding Scale
export const PaddingScale: StoryFn<typeof Box> = () => (
    <Stack gap="spacious">
        {(["none", "tight", "condensed", "cozy", "normal", "spacious"] as const).map((padding) => (
            <Stack key={padding} gap="condensed">
                <ScaleLabel label={`padding="${padding}"`} />
                <Box padding={padding} background="inset">
                    <Placeholder height="48px" label="Content" />
                </Box>
            </Stack>
        ))}
    </Stack>
);

// Directional Padding
export const DirectionalPadding: StoryFn<typeof Box> = () => (
    <Stack gap="normal">
        <Box padding="normal" background="inset">
            <Placeholder height="48px" label='padding="normal" (all sides)' />
        </Box>
        <Box padding="normal" paddingInline="spacious" background="inset">
            <Placeholder height="48px" label='padding="normal" paddingInline="spacious"' />
        </Box>
        <Box paddingBlock="condensed" paddingInline="spacious" background="inset">
            <Placeholder height="48px" label='paddingBlock="condensed" paddingInline="spacious"' />
        </Box>
    </Stack>
);

// Background Fills
export const BackgroundFills: StoryFn<typeof Box> = () => (
    <Stack gap="spacious">
        {(["none", "default", "muted", "inset", "emphasis"] as const).map((background) => (
            <Stack key={background} gap="condensed">
                <ScaleLabel label={`background="${background}"`} />
                <Box padding="normal" background={background} border="muted" radius="medium">
                    <Text>The fill drawn behind whatever the box holds</Text>
                </Box>
            </Stack>
        ))}
    </Stack>
);

// Borders
export const Borders: StoryFn<typeof Box> = () => (
    <Stack gap="spacious">
        {(["none", "default", "muted"] as const).map((border) => (
            <Stack key={border} gap="condensed">
                <ScaleLabel label={`border="${border}"`} />
                <Box padding="normal" border={border} radius="medium">
                    <Text>The line drawn around the box</Text>
                </Box>
            </Stack>
        ))}
    </Stack>
);

// Radius Scale
export const RadiusScale: StoryFn<typeof Box> = () => (
    <Stack gap="spacious">
        {(["none", "small", "medium", "large", "full"] as const).map((radius) => (
            <Stack key={radius} gap="condensed" align="start">
                <ScaleLabel label={`radius="${radius}"`} />
                <Box padding="normal" background="muted" border="default" radius={radius}>
                    <Text>How far the corners are turned in</Text>
                </Box>
            </Stack>
        ))}
    </Stack>
);

// Shadow Scale
export const ShadowScale: StoryFn<typeof Box> = () => (
    <Stack gap="spacious">
        {(["none", "xsmall", "small", "medium"] as const).map((shadow) => (
            <Stack key={shadow} gap="condensed">
                <ScaleLabel label={`shadow="${shadow}"`} />
                <Box padding="normal" background="default" radius="medium" shadow={shadow}>
                    <Text>How far the box is lifted off the page</Text>
                </Box>
            </Stack>
        ))}
    </Stack>
);

// Cropping To The Corners, where an image left to itself squares off a rounded box
export const CroppingToTheCorners: StoryFn<typeof Box> = () => (
    <Stack direction="horizontal" gap="normal">
        {(["visible", "hidden"] as const).map((overflow) => (
            <Stack key={overflow} gap="condensed" className={classes.column}>
                <ScaleLabel label={`overflow="${overflow}"`} />
                <Box radius="large" border="default" overflow={overflow}>
                    <AspectRatio ratio={16 / 9}>
                        <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
                    </AspectRatio>
                </Box>
            </Stack>
        ))}
    </Stack>
);

// Custom Element
export const CustomElement: StoryFn<typeof Box> = () => (
    <Box as="aside" padding="normal" background="muted" border="muted" radius="medium">
        <Text>An aside, standing on the surface the library names</Text>
    </Box>
);
