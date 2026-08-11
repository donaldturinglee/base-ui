import type { StoryFn } from "@storybook/react-vite";
import Avatar from "./Avatar";

const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

const sizes = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64];

export default {
    title: "Components/Avatar/Features",
    parameters: {
        layout: "centered",
    },
};

// Square Shape
export const Square: StoryFn<typeof Avatar> = () => (
    <Avatar shape="square" alt="mona" src={source} />
);

// Size
export const Size: StoryFn<typeof Avatar> = () => (
    <div>
        {sizes.map((size) => (
            <Avatar key={size} size={size} alt="mona" src={source} />
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
                alt="mona"
                src={source}
            />
        ))}
    </div>
);
