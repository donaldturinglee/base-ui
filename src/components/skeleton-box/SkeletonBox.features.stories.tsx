import type { StoryFn } from "@storybook/react-vite";
import SkeletonBox from "./SkeletonBox";

export default {
    title: "Components/SkeletonBox/Features",
    parameters: {
        layout: "centered",
    },
};

// Custom Height
export const CustomHeight: StoryFn<typeof SkeletonBox> = () => (
    <SkeletonBox width="320px" height="64px" />
);

// Custom Width
export const CustomWidth: StoryFn<typeof SkeletonBox> = () => <SkeletonBox width="320px" />;
