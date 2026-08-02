import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Placeholder } from "../placeholder";
import { SkeletonBox } from "../skeleton-box";
import { Stack } from "../stack";
import { Text } from "../text";
import { AspectRatio } from ".";

const classes = {
    // The box takes its height from its width, so the stories give it a width to work from
    container: "w-[20rem]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/AspectRatio/Features",
    decorators: [withContainer],
    parameters: {
        layout: "centered",
    },
};

// Ratio Scale
export const RatioScale: StoryFn<typeof AspectRatio> = () => (
    <Stack gap="normal">
        {(["1:1", "16:9", "4:3"] as const).map((ratio) => (
            <Stack key={ratio} gap="condensed">
                <Text size="small">ratio=&quot;{ratio}&quot;</Text>
                <AspectRatio ratio={ratio}>
                    <Placeholder height="100%" label={ratio} />
                </AspectRatio>
            </Stack>
        ))}
    </Stack>
);

// Custom Ratio, worked out from the width and height beside it
export const CustomRatio: StoryFn<typeof AspectRatio> = () => (
    <AspectRatio ratio="custom" width={3} height={4}>
        <Placeholder height="100%" label="3:4" />
    </AspectRatio>
);

// With An Image, cropped to the box rather than sized by hand
export const WithAnImage: StoryFn<typeof AspectRatio> = () => (
    <AspectRatio ratio="16:9">
        <img src="https://avatars.githubusercontent.com/u/7143434?v=4" alt="" />
    </AspectRatio>
);

// Holding Space, where the box keeps its place before anything has loaded
export const HoldingSpace: StoryFn<typeof AspectRatio> = () => (
    <AspectRatio ratio="4:3">
        <SkeletonBox height="100%" />
    </AspectRatio>
);

// Custom Element
export const CustomElement: StoryFn<typeof AspectRatio> = () => (
    <AspectRatio as="section" ratio="16:9">
        <Placeholder height="100%" label="16:9" />
    </AspectRatio>
);
