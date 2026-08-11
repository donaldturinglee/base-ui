import type { StoryFn, Meta } from "@storybook/react-vite";
import { getResponsiveControlValues } from "../../utilities/responsive";
import { Avatar } from "../avatar";
import { DEFAULT_AVATAR_SIZE } from "../avatar/Avatar";
import AvatarStack from "./AvatarStack";
import type { AvatarStackProps } from "./AvatarStack.types";

const sources = [
    "https://avatars.githubusercontent.com/u/7143434?v=4",
    "https://avatars.githubusercontent.com/github",
    "https://avatars.githubusercontent.com/atom",
    "https://avatars.githubusercontent.com/u/13171334?v=4",
];

const contributors = sources.map((src, index) => (
    <Avatar key={src} src={src} alt={`Contributor ${index + 1}`} />
));

export default {
    title: "Components/AvatarStack",
    component: AvatarStack,
} as Meta<typeof AvatarStack>;

export const Default: StoryFn<typeof AvatarStack> = () => <AvatarStack>{contributors}</AvatarStack>;

Default.parameters = {
    layout: "centered",
};

// The responsive ranges are flattened into their own controls, so each one gets a number input
type PlaygroundArgs = Omit<AvatarStackProps, "size"> & {
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
    <AvatarStack
        {...args}
        size={getResponsiveControlValues(size, {
            narrow: sizeAtNarrow,
            regular: sizeAtRegular,
            wide: sizeAtWide,
        })}
    >
        {contributors}
    </AvatarStack>
);

Playground.args = {
    size: DEFAULT_AVATAR_SIZE,
    variant: "cascade",
    shape: "circle",
    alignRight: false,
    disableExpand: false,
};

Playground.argTypes = {
    variant: {
        control: {
            type: "radio",
        },
        options: ["cascade", "stack"],
        description: "Fades and spreads the avatars, or overlaps them evenly",
    },
    shape: {
        control: {
            type: "radio",
        },
        options: ["circle", "square"],
        description: "Rounds the avatars fully or squares them off",
    },
    size: {
        control: {
            type: "number",
        },
        description: "Size of every avatar in pixels, overriding the children",
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
    alignRight: {
        control: {
            type: "boolean",
        },
        description: "Stacks the avatars from the right instead of the left",
    },
    disableExpand: {
        control: {
            type: "boolean",
        },
        description: "Keeps the stack collapsed on hover and focus",
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
