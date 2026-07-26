import type { StoryFn } from "@storybook/react-vite";
import { Avatar } from "../avatar";
import AvatarStack from "./AvatarStack";

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
    title: "Components/AvatarStack/Features",
    parameters: {
        layout: "centered",
    },
};

// Align Left
export const AlignLeft: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack>{contributors}</AvatarStack>
);

// Align Right
export const AlignRight: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack alignRight>{contributors}</AvatarStack>
);

// Stack Variant
export const StackVariant: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack variant="stack">{contributors}</AvatarStack>
);

// Square Shape
export const SquareShape: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack shape="square">{contributors}</AvatarStack>
);

// Disable Expand On Hover
export const DisableExpandOnHover: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack disableExpand>{contributors}</AvatarStack>
);

// Custom Size On Parent
export const CustomSizeOnParent: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack size={32}>{contributors}</AvatarStack>
);

// Responsive Size On Parent
export const CustomSizeOnParentResponsive: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack size={{ narrow: 32, regular: 48, wide: 64 }}>{contributors}</AvatarStack>
);

// Custom Size On Children, where the smallest child size wins
export const CustomSizeOnChildren: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack>
        {sources.map((src, index) => (
            <Avatar
                key={src}
                src={src}
                size={[20, 32, 48, 64][index]}
                alt={`Contributor ${index + 1}`}
            />
        ))}
    </AvatarStack>
);

// Single Avatar
export const WithSingleAvatar: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack>
        <Avatar src={sources[0]} alt="Contributor 1" />
    </AvatarStack>
);

// More Than Five Avatars, where the rest appear once the stack expands
export const WithOverflow: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack>
        {[...sources, ...sources].map((src, index) => (
            <Avatar key={index} src={src} alt={`Contributor ${index + 1}`} />
        ))}
    </AvatarStack>
);
