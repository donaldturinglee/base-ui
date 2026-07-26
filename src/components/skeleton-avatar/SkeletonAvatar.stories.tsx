import type { StoryFn, Meta } from "@storybook/react-vite";
import { getResponsiveControlValues } from "../../utilities/responsive";
import { DEFAULT_AVATAR_SIZE } from "../avatar/Avatar";
import SkeletonAvatar from "./SkeletonAvatar";
import type { SkeletonAvatarProps } from "./SkeletonAvatar.types";

export default {
    title: "Components/SkeletonAvatar",
    component: SkeletonAvatar,
} as Meta<typeof SkeletonAvatar>;

export const Default: StoryFn<typeof SkeletonAvatar> = () => <SkeletonAvatar />;

Default.parameters = {
    layout: "centered",
};

// The responsive ranges are flattened into their own controls, so each one gets a number input
type PlaygroundArgs = Omit<SkeletonAvatarProps, "size"> & {
    size?: number;
    sizeAtNarrow?: number;
    sizeAtRegular?: number;
    sizeAtWide?: number;
};

export const Playground: StoryFn<PlaygroundArgs> = ({
    size = DEFAULT_AVATAR_SIZE,
    sizeAtNarrow,
    sizeAtRegular,
    sizeAtWide,
    ...args
}) => (
    <SkeletonAvatar
        {...args}
        size={getResponsiveControlValues(size, {
            narrow: sizeAtNarrow,
            regular: sizeAtRegular,
            wide: sizeAtWide,
        })}
    />
);

Playground.args = {
    size: DEFAULT_AVATAR_SIZE,
    shape: "circle",
};

Playground.argTypes = {
    size: {
        control: {
            type: "number",
        },
        description: "Width and height of the avatar in pixels",
    },
    sizeAtNarrow: {
        name: "size.narrow",
        control: {
            type: "number",
        },
        description: "Size in pixels below the medium breakpoint",
    },
    sizeAtRegular: {
        name: "size.regular",
        control: {
            type: "number",
        },
        description: "Size in pixels from the medium breakpoint up",
    },
    sizeAtWide: {
        name: "size.wide",
        control: {
            type: "number",
        },
        description: "Size in pixels from the xxlarge breakpoint up",
    },
    shape: {
        control: {
            type: "radio",
        },
        options: ["circle", "square"],
        description: "Rounds the corners instead of rendering a circle",
    },
};

Playground.parameters = {
    layout: "centered",
};
