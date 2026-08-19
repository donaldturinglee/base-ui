import type { StoryFn } from "@storybook/react-vite";
import { Stack } from "../stack";
import SkeletonAvatar from "./SkeletonAvatar";

const sizes = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64];

export default {
    title: "Components/SkeletonAvatar/Features",
    parameters: {
        layout: "centered",
    },
};

// Square Shape
export const Square: StoryFn<typeof SkeletonAvatar> = () => <SkeletonAvatar shape="square" />;

// Size
export const Size: StoryFn<typeof SkeletonAvatar> = () => (
    <div>
        {sizes.map((size) => (
            <SkeletonAvatar key={size} size={size} />
        ))}
    </div>
);

// Responsive Size
export const SizeResponsive: StoryFn<typeof SkeletonAvatar> = () => (
    <div>
        {sizes.slice(0, -2).map((size, index) => (
            <SkeletonAvatar
                key={size}
                size={{ narrow: size, regular: sizes[index + 1], wide: sizes[index + 2] }}
            />
        ))}
    </div>
);

// In A Stack
export const InAStack: StoryFn<typeof SkeletonAvatar> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <SkeletonAvatar size={32} />
        <SkeletonAvatar size={32} />
        <SkeletonAvatar size={32} />
        <SkeletonAvatar size={32} />
    </Stack>
);
