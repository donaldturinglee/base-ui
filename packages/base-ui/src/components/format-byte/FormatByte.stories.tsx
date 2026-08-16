import type { StoryFn, Meta } from "@storybook/react-vite";
import { FormatByte } from ".";
import type { FormatBytesOptions } from "./FormatByte.types";

// The controls hand back one option at a time rather than a whole format object, so the story
// gathers them back up into the format it passes on
type PlaygroundArgs = FormatBytesOptions & {
    value: number;
    locale?: string;
};

export default {
    title: "Components/FormatByte",
    component: FormatByte,
} as Meta<typeof FormatByte>;

export const Default: StoryFn<typeof FormatByte> = () => <FormatByte value={1500} />;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PlaygroundArgs> = ({ value, locale, ...format }) => (
    <FormatByte value={value} locale={locale} format={format} />
);

Playground.args = {
    value: 1500,
    locale: "en-US",
    unit: "byte",
    unitDisplay: "short",
    unitSystem: "decimal",
    precision: 3,
};

Playground.argTypes = {
    value: {
        control: {
            type: "number",
        },
        description: "The size to write out, in bytes",
    },
    locale: {
        control: {
            type: "select",
        },
        options: ["en-US", "en-GB", "de-DE", "fr-FR", "sv-SE", "ja-JP", "ar-EG"],
        description: "The locale to write it under, which follows the LocaleProvider when left out",
    },
    unit: {
        control: {
            type: "inline-radio",
        },
        options: ["byte", "bit"],
        description: "Which unit the size is counted in",
    },
    unitDisplay: {
        control: {
            type: "inline-radio",
        },
        options: ["short", "long", "narrow"],
        description: "How far the unit is spelled out",
    },
    unitSystem: {
        control: {
            type: "inline-radio",
        },
        options: ["decimal", "binary"],
        description: "Whether a kilobyte is a thousand bytes or 1024 of them",
    },
    precision: {
        control: {
            type: "number",
        },
        description: "How many significant digits the reading is cut down to",
    },
};

Playground.parameters = {
    layout: "centered",
};
