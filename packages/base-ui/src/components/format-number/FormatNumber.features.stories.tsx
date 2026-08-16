import type { StoryFn } from "@storybook/react-vite";
import { LocaleProvider } from "../../providers/locale";
import { Stack } from "../stack";
import { Text } from "../text";
import { FormatNumber } from ".";

const locales = ["en-US", "de-DE", "fr-FR", "ja-JP", "ar-EG"];

export default {
    title: "Components/FormatNumber/Features",
    parameters: {
        layout: "centered",
    },
};

// Currency, where the locale settles which side the sign sits on as well as how it is written
export const Currency: StoryFn<typeof FormatNumber> = () => (
    <Stack gap="condensed">
        <FormatNumber value={1234.5} format={{ style: "currency", currency: "USD" }} />
        <FormatNumber value={1234.5} format={{ style: "currency", currency: "EUR" }} />
        <FormatNumber value={1234.5} format={{ style: "currency", currency: "JPY" }} />
    </Stack>
);

// Percent, where the figure is a share of one rather than of a hundred
export const Percent: StoryFn<typeof FormatNumber> = () => (
    <Stack gap="condensed">
        <FormatNumber value={0.256} format={{ style: "percent" }} />
        <FormatNumber value={0.256} format={{ style: "percent", minimumFractionDigits: 1 }} />
    </Stack>
);

// Unit, which is named and placed the way the locale names and places it
export const Unit: StoryFn<typeof FormatNumber> = () => (
    <Stack gap="condensed">
        <FormatNumber value={72} format={{ style: "unit", unit: "kilometer-per-hour" }} />
        <FormatNumber
            value={72}
            format={{ style: "unit", unit: "kilometer-per-hour", unitDisplay: "long" }}
        />
        <FormatNumber value={21} format={{ style: "unit", unit: "celsius" }} />
    </Stack>
);

// Notation, for a figure too long to be worth writing out in full
export const Notation: StoryFn<typeof FormatNumber> = () => (
    <Stack gap="condensed">
        <FormatNumber value={1234567} />
        <FormatNumber value={1234567} format={{ notation: "compact" }} />
        <FormatNumber value={1234567} format={{ notation: "scientific" }} />
    </Stack>
);

// Fraction Digits, holding a reading to the places it is worth writing
export const FractionDigits: StoryFn<typeof FormatNumber> = () => (
    <Stack gap="condensed">
        <FormatNumber value={3.14159} format={{ maximumFractionDigits: 2 }} />
        <FormatNumber value={3} format={{ minimumFractionDigits: 2 }} />
    </Stack>
);

// With Locale Provider, where the same figure is written the way each reader reads it
export const WithLocaleProvider: StoryFn<typeof FormatNumber> = () => (
    <Stack gap="condensed">
        {locales.map((locale) => (
            <LocaleProvider key={locale} locale={locale}>
                <Text>
                    {locale}: <FormatNumber value={1234567.891} />
                </Text>
            </LocaleProvider>
        ))}
    </Stack>
);

// With A Locale Of Its Own, for the odd reading that has to be written in another
export const WithLocaleOfItsOwn: StoryFn<typeof FormatNumber> = () => (
    <LocaleProvider locale="de-DE">
        <Stack gap="condensed">
            <Text>
                Read under de-DE: <FormatNumber value={1234.5} />
            </Text>
            <Text>
                Written in en-US: <FormatNumber locale="en-US" value={1234.5} />
            </Text>
        </Stack>
    </LocaleProvider>
);
