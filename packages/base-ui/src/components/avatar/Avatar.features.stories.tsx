import type { StoryFn } from "@storybook/react-vite";
import { Avatar } from ".";

const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

const missing = "https://avatars.githubusercontent.com/u/0?v=0";

const sizes = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64];

const people = [
    { name: "Mona Lisa Octocat", src: source },
    { name: "Hubot", src: missing },
];

export default {
    title: "Components/Avatar/Features",
    parameters: {
        layout: "centered",
    },
};

// Square Shape
export const Square: StoryFn<typeof Avatar> = () => (
    <Avatar shape="square">
        <Avatar.Image src={source} alt="mona" />
    </Avatar>
);

// Size
export const Size: StoryFn<typeof Avatar> = () => (
    <div>
        {sizes.map((size) => (
            <Avatar key={size} size={size}>
                <Avatar.Image src={source} alt="mona" />
            </Avatar>
        ))}
    </div>
);

// Responsive Size
export const SizeResponsive: StoryFn<typeof Avatar> = () => (
    <div>
        {sizes.slice(0, -2).map((size, index) => (
            <Avatar
                key={size}
                size={{ narrow: size, regular: sizes[index + 1], wide: sizes[index + 2] }}
            >
                <Avatar.Image src={source} alt="mona" />
            </Avatar>
        ))}
    </div>
);

// With A Fallback, where the initials worked out from the name stand until the picture arrives and
// stay where it never does
export const WithAFallback: StoryFn<typeof Avatar> = () => (
    <div>
        {people.map((person) => (
            <Avatar key={person.name} size={48}>
                <Avatar.Image src={person.src} alt={person.name} />
                <Avatar.Fallback name={person.name} />
            </Avatar>
        ))}
    </div>
);

// Fallback Only, for whoever has no picture to be shown at all. The letters are set from the size
// of the avatar, so they keep their proportion at every one
export const FallbackOnly: StoryFn<typeof Avatar> = () => (
    <div>
        {sizes.slice(4).map((size) => (
            <Avatar key={size} size={size} shape="square">
                <Avatar.Fallback name="Mona Lisa Octocat" />
            </Avatar>
        ))}
    </div>
);
