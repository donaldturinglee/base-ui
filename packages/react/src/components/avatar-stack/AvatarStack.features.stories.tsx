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
    <Avatar key={src}>
        <Avatar.Image src={src} alt={`Contributor ${index + 1}`} />
    </Avatar>
));

// A contributor with no picture to be shown, whose initials stand where it would have been
const people = [
    { name: "Mona Lisa Octocat", src: sources[0] },
    { name: "Hubot", src: undefined },
    { name: "Octo Cat", src: sources[2] },
    { name: "Robot Octocat", src: undefined },
];

const contributorsWithFallback = people.map((person) => (
    <Avatar key={person.name}>
        <Avatar.Image src={person.src} alt={person.name} />
        <Avatar.Fallback name={person.name} />
    </Avatar>
));

export default {
    title: "Components/AvatarStack/Features",
    parameters: {
        layout: "centered",
    },
};

// Align Left
export const AlignLeft: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack align="left">{contributors}</AvatarStack>
);

// Align Right
export const AlignRight: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack align="right">{contributors}</AvatarStack>
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
            <Avatar key={src} size={[20, 32, 48, 64][index]}>
                <Avatar.Image src={src} alt={`Contributor ${index + 1}`} />
            </Avatar>
        ))}
    </AvatarStack>
);

// Single Avatar
export const WithSingleAvatar: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack>
        <Avatar>
            <Avatar.Image src={sources[0]} alt="Contributor 1" />
        </Avatar>
    </AvatarStack>
);

// More Than Five Avatars, where the rest appear once the stack expands
export const WithOverflow: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack>
        {[...sources, ...sources].map((src, index) => (
            <Avatar key={index}>
                <Avatar.Image src={src} alt={`Contributor ${index + 1}`} />
            </Avatar>
        ))}
    </AvatarStack>
);

// With Fallbacks, where the initials of whoever an avatar is of stand in for the picture it has
// none of, so a stack is never a hole in the page
export const WithFallbacks: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack>{contributorsWithFallback}</AvatarStack>
);

// With Fallbacks At A Custom Size, where the letters are set from the stack rather than from the
// size each avatar was given, so they keep their proportion at every one
export const WithFallbacksAtCustomSize: StoryFn<typeof AvatarStack> = () => (
    <AvatarStack size={48}>{contributorsWithFallback}</AvatarStack>
);
