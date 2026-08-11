import type { StoryFn, Meta } from "@storybook/react-vite";
import { QRCode } from ".";
import type { QRCodeProps } from "./QRCode.types";

export default {
    title: "Components/QRCode",
    component: QRCode,
} as Meta<typeof QRCode>;

export const Default: StoryFn<typeof QRCode> = () => <QRCode value="https://example.com" />;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<QRCodeProps> = (args) => <QRCode {...args} />;

Playground.args = {
    value: "https://example.com",
    size: 200,
    margin: 4,
    ecLevel: "M",
    dotType: "square",
    dotSize: 1,
};

Playground.argTypes = {
    value: {
        control: {
            type: "text",
        },
        description: "What the code carries",
    },
    size: {
        control: {
            type: "number",
            min: 64,
            max: 512,
            step: 8,
        },
        description: "How wide the code is drawn, in pixels",
    },
    margin: {
        control: {
            type: "number",
            min: 0,
            max: 16,
            step: 1,
        },
        description: "The quiet zone around the code, counted in modules",
    },
    ecLevel: {
        control: {
            type: "radio",
        },
        options: ["L", "M", "Q", "H"],
        description: "How much of the code can be lost and still read",
    },
    dotType: {
        control: {
            type: "select",
        },
        options: [
            "square",
            "rounded",
            "dots",
            "diamond",
            "classy",
            "classy-rounded",
            "extra-rounded",
            "vertical-line",
            "horizontal-line",
            "small-square",
            "tiny-square",
        ],
        description: "What each dark module is drawn as",
    },
    dotSize: {
        control: {
            type: "number",
            min: 0.1,
            max: 1,
            step: 0.05,
        },
        description: "How much of its own cell a module fills",
    },
    color: {
        control: {
            type: "color",
        },
        description: "What the modules are painted",
    },
    background: {
        control: {
            type: "color",
        },
        description: "What the quiet zone is painted",
    },
    logo: {
        table: {
            disable: true,
        },
    },
    fallback: {
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
