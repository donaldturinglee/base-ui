import type { StoryFn, Meta } from "@storybook/react-vite";
import { FormatNumber } from ".";

// The controls hand back one option at a time rather than a whole `Intl.NumberFormat` object, so
// the story gathers them back up into the format it passes on
type PlaygroundArgs = {
    value: number;
    locale?: string;
    style?: Intl.NumberFormatOptions["style"];
    currency?: string;
    unit?: string;
    notation?: Intl.NumberFormatOptions["notation"];
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
};

export default {
    title: "Components/FormatNumber",
    component: FormatNumber,
} as Meta<typeof FormatNumber>;

export const Default: StoryFn<typeof FormatNumber> = () => <FormatNumber value={1234.5} />;

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<PlaygroundArgs> = ({ value, locale, ...format }) => (
    <FormatNumber value={value} locale={locale} format={format} />
);

Playground.args = {
    value: 1234.5,
    locale: "en-US",
    style: "decimal",
};

Playground.argTypes = {
    value: {
        control: {
            type: "number",
        },
        description: "The number to write out",
    },
    locale: {
        control: {
            type: "select",
        },
        options: ["en-US", "en-GB", "de-DE", "fr-FR", "sv-SE", "ja-JP", "ar-EG"],
        description: "The locale to write it under, which follows the LocaleProvider when left out",
    },
    style: {
        control: {
            type: "inline-radio",
        },
        options: ["decimal", "currency", "percent", "unit"],
        description: "The shape the number is written in",
    },
    currency: {
        control: {
            type: "select",
        },
        options: [undefined, "USD", "EUR", "GBP", "JPY"],
        description: "Which currency it is money in, where it is written as money",
    },
    unit: {
        control: {
            type: "select",
        },
        options: [undefined, "kilometer-per-hour", "liter", "megabyte", "celsius"],
        description: "Which unit it is counted in, where it is written with one",
    },
    notation: {
        control: {
            type: "inline-radio",
        },
        options: ["standard", "scientific", "engineering", "compact"],
        description: "How a figure too long to write out in full is shortened",
    },
    minimumFractionDigits: {
        control: {
            type: "number",
        },
        description: "The fewest places written after the decimal separator",
    },
    maximumFractionDigits: {
        control: {
            type: "number",
        },
        description: "The most places written after the decimal separator",
    },
};

Playground.parameters = {
    layout: "centered",
};
