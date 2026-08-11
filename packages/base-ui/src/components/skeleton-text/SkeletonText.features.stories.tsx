import type { StoryFn } from "@storybook/react-vite";
import SkeletonText from "./SkeletonText";

export default {
    title: "Components/SkeletonText/Features",
    parameters: {
        layout: "centered",
    },
};

// The skeleton fills its container, so centering it means centering a container with a width

// Custom Size
export const CustomSize: StoryFn<typeof SkeletonText> = () => (
    <div className="w-[320px]">
        <SkeletonText size="titleLarge" />
    </div>
);

// Multiple Lines
export const MultipleLines: StoryFn<typeof SkeletonText> = () => (
    <div className="w-[320px]">
        <SkeletonText lines={3} />
    </div>
);

// Max Width
export const MaxWidth: StoryFn<typeof SkeletonText> = () => (
    // A wider container than the max width, so the clamping is visible. The max width leaves free
    // space rather than centring the skeleton in it, so an auto inline margin does the centring.
    <div className="w-[400px]">
        <SkeletonText maxWidth="200px" className="mx-auto" />
    </div>
);
