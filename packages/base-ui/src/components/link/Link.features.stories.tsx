import type { StoryFn } from "@storybook/react-vite";
import Link from "./Link";

export default {
    title: "Components/Link/Features",
    parameters: {
        layout: "centered",
    },
};

// Muted
export const Muted: StoryFn<typeof Link> = () => (
    <Link href="#" muted>
        Link
    </Link>
);

// Inline
export const Inline: StoryFn<typeof Link> = () => (
    <div data-a11y-link-underlines="true">
        <Link href="#" inline>
            Link
        </Link>
    </div>
);
