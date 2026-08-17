import type { StoryFn, Meta } from "@storybook/react-vite";
import { getResponsiveControlValues } from "../../utilities/responsive";
import { Avatar, DEFAULT_AVATAR_SIZE } from ".";
import type { AvatarProps } from "./Avatar.types";

const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

export default {
    title: "Components/Avatar",
    component: Avatar,
} as Meta<typeof Avatar>;

export const Default: StoryFn<typeof Avatar> = () => (
    <Avatar>
        <Avatar.Image src={source} />
    </Avatar>
);

Default.parameters = {
    layout: "centered",
};

// The responsive ranges are flattened into their own controls, so each one gets a number input
type PlaygroundArgs = Omit<AvatarProps, "size"> & {
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
    <Avatar
        {...args}
        size={getResponsiveControlValues(size, {
            narrow: sizeAtNarrow,
            regular: sizeAtRegular,
            wide: sizeAtWide,
        })}
    >
        <Avatar.Image src={source} alt="mona" />
    </Avatar>
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
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
