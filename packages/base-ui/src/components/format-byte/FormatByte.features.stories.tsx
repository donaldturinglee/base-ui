import type { StoryFn } from "@storybook/react-vite";
import { LocaleProvider } from "../../providers/locale";
import { Stack } from "../stack";
import { Text } from "../text";
import { FormatByte } from ".";

const locales = ["en-US", "de-DE", "fr-FR", "ja-JP", "ar-EG"];

const sizes = [500, 1500, 1.5e6, 1.5e9, 1.5e12];

export default {
    title: "Components/FormatByte/Features",
    parameters: {
        layout: "centered",
    },
};

// Sizes, stepping up a prefix at a time as the size grows
export const Sizes: StoryFn<typeof FormatByte> = () => (
    <Stack gap="condensed">
        {sizes.map((size) => (
            <FormatByte key={size} value={size} />
        ))}
    </Stack>
);

// Unit System, where the same size is counted in thousands or in 1024s
export const UnitSystem: StoryFn<typeof FormatByte> = () => (
    <Stack gap="condensed">
        <Text>
            Decimal: <FormatByte value={1048576} format={{ unitSystem: "decimal" }} />
        </Text>
        <Text>
            Binary: <FormatByte value={1048576} format={{ unitSystem: "binary" }} />
        </Text>
    </Stack>
);

// Bits, for a size that is measured the way a connection is rather than the way a file is
export const Bits: StoryFn<typeof FormatByte> = () => (
    <Stack gap="condensed">
        <FormatByte value={1500} format={{ unit: "bit" }} />
        <FormatByte value={1.5e6} format={{ unit: "bit" }} />
    </Stack>
);

// Unit Display, which is how far the unit itself is spelled out
export const UnitDisplay: StoryFn<typeof FormatByte> = () => (
    <Stack gap="condensed">
        <FormatByte value={1500} format={{ unitDisplay: "short" }} />
        <FormatByte value={1500} format={{ unitDisplay: "long" }} />
        <FormatByte value={1500} format={{ unitDisplay: "narrow" }} />
    </Stack>
);

// Precision, holding the reading to the digits worth writing
export const Precision: StoryFn<typeof FormatByte> = () => (
    <Stack gap="condensed">
        <FormatByte value={1234567} format={{ precision: 1 }} />
        <FormatByte value={1234567} format={{ precision: 3 }} />
        <FormatByte value={1234567} format={{ precision: 5 }} />
    </Stack>
);

// With Locale Provider, where the same size is written the way each reader reads it
export const WithLocaleProvider: StoryFn<typeof FormatByte> = () => (
    <Stack gap="condensed">
        {locales.map((locale) => (
            <LocaleProvider key={locale} locale={locale} contextOnly>
                <Text>
                    {locale}: <FormatByte value={1500} format={{ unitDisplay: "long" }} />
                </Text>
            </LocaleProvider>
        ))}
    </Stack>
);
