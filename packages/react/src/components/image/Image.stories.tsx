import type { StoryFn, Meta } from "@storybook/react-vite";
import { Image } from ".";
import type { ImageProps } from "./Image.types";

const classes = {
    // Gives the picture a box of its own to be fitted into
    box: "w-[12rem] h-[9rem]",
};

// A picture drawn on the page rather than fetched over the network, so the stories stand up
// with nothing behind them
const SOURCE =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
            <rect width="240" height="240" fill="#0969da" />
            <circle cx="120" cy="96" r="48" fill="#ffd642" />
            <path d="M0 240 96 128l72 72 40-40 32 32z" fill="#1a7f37" />
        </svg>`,
    );

export default {
    title: "Components/Image",
    component: Image,
} as Meta<typeof Image>;

export const Default: StoryFn<typeof Image> = () => (
    <Image src={SOURCE} alt="A hillside under a low sun" className={classes.box} />
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ImageProps> = (args) => (
    <Image {...args} className={classes.box} />
);

Playground.args = {
    as: "img",
    src: SOURCE,
    alt: "A hillside under a low sun",
    fit: "cover",
    borderRadius: "none",
};

Playground.argTypes = {
    as: {
        control: {
            type: "radio",
        },
        options: ["img"],
        description: "HTML element to render",
    },
    src: {
        control: {
            type: "text",
        },
        description: "Source the picture is fetched from",
    },
    alt: {
        control: {
            type: "text",
        },
        description: "What the picture tells a reader who cannot see it",
    },
    fit: {
        control: {
            type: "radio",
        },
        options: ["contain", "cover", "fill", "none", "scale-down"],
        description: "How the picture sits in the box it is given",
    },
    borderRadius: {
        control: {
            type: "radio",
        },
        options: ["none", "small", "medium", "large", "full"],
        description: "How far the corners are rounded",
    },
    fallbackSrc: {
        control: {
            type: "text",
        },
        description: "Source put in the place of one that fails to load",
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
