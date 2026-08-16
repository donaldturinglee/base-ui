import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { useDirection } from "../direction";
import {
    LocaleProvider,
    useCollator,
    useDateFormatter,
    useFilter,
    useLocaleContext,
    useNumberFormatter,
} from ".";

const classes = {
    panel: "p-[var(--base-size-16)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
    nested: "mt-[var(--base-size-16)]",
    // Logical properties, so the marker moves to whichever side the reading starts from
    marker: "ps-[var(--base-size-12)] border-s-[length:var(--base-size-4)] border-solid border-border-accent-emphasis",
    field: "mt-[var(--base-size-16)] px-[var(--base-size-8)] py-[var(--base-size-4)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
    list: "mt-[var(--base-size-8)] ps-[var(--base-size-16)] list-disc",
};

const ActiveLocale = () => {
    const { locale, direction } = useLocaleContext();

    return (
        <div className={classes.marker}>
            Locale: {locale}
            <br />
            Read {direction === "rtl" ? "right to left" : "left to right"}
        </div>
    );
};

export default {
    title: "Components/LocaleProvider/Features",
};

// Right To Left, where the direction comes from the locale rather than being asked for separately
export const RightToLeft: StoryFn<typeof LocaleProvider> = () => (
    <LocaleProvider locale="ar-EG" className={classes.panel}>
        <ActiveLocale />
    </LocaleProvider>
);

// Auto, following whichever locale the browser is set to read in
export const Auto: StoryFn<typeof LocaleProvider> = () => (
    <LocaleProvider locale="auto" className={classes.panel}>
        <ActiveLocale />
    </LocaleProvider>
);

// Nested
export const Nested: StoryFn<typeof LocaleProvider> = () => (
    <LocaleProvider locale="ar-EG" className={classes.panel}>
        <ActiveLocale />
        {/* Says nothing of its own, so it is read the way the provider above it is */}
        <LocaleProvider className={`${classes.panel} ${classes.nested}`}>
            Inherited from the provider above
            <ActiveLocale />
        </LocaleProvider>
        <LocaleProvider locale="de-DE" className={`${classes.panel} ${classes.nested}`}>
            A subtree read in another locale, which turns back around with it
            <ActiveLocale />
        </LocaleProvider>
    </LocaleProvider>
);

// Controlled, where the locale is the caller's to hold and change
export const Controlled: StoryFn<typeof LocaleProvider> = () => {
    const locales = ["en-US", "de-DE", "ja-JP", "ar-EG"];
    const [locale, setLocale] = React.useState(locales[0]);

    return (
        <LocaleProvider locale={locale} className={classes.panel}>
            <ActiveLocale />
            <select
                className={classes.field}
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
            >
                {locales.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </LocaleProvider>
    );
};

// With Direction, which the rest of the package reads off the context it already read
export const WithDirection: StoryFn<typeof LocaleProvider> = () => {
    // Which way "onwards" points is the reading direction's to say, and the locale settled that
    const Onwards = () => {
        const direction = useDirection();

        return <div className={classes.marker}>Onwards is {direction === "rtl" ? "←" : "→"}</div>;
    };

    return (
        <LocaleProvider locale="he-IL" className={classes.panel}>
            <ActiveLocale />
            <Onwards />
        </LocaleProvider>
    );
};

// With Collator, for sorting that has to order the way the reader does
export const WithCollator: StoryFn<typeof LocaleProvider> = () => {
    const Sorted = () => {
        const collator = useCollator();
        const words = ["Zebra", "Äpfel", "Orange"];

        return (
            <ul className={classes.list}>
                {[...words].sort(collator.compare).map((word) => (
                    <li key={word}>{word}</li>
                ))}
            </ul>
        );
    };

    return (
        <>
            {/* German reads "ä" as an "a", so it comes first; Swedish reads it as a letter of
                its own that comes after "z" */}
            <LocaleProvider locale="de-DE" className={classes.panel}>
                <ActiveLocale />
                <Sorted />
            </LocaleProvider>
            <LocaleProvider locale="sv-SE" className={`${classes.panel} ${classes.nested}`}>
                <ActiveLocale />
                <Sorted />
            </LocaleProvider>
        </>
    );
};

// With Filter, for narrowing a list down by typing into it
export const WithFilter: StoryFn<typeof LocaleProvider> = () => {
    const Search = () => {
        const { contains } = useFilter({ sensitivity: "base" });
        const [term, setTerm] = React.useState("cafe");
        const places = ["Café Central", "Brasserie Lipp", "Konditorei Wien", "Crêperie Josselin"];

        return (
            <>
                <input
                    className={classes.field}
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="Narrow the list down"
                />
                <ul className={classes.list}>
                    {places
                        .filter((place) => contains(place, term))
                        .map((place) => (
                            <li key={place}>{place}</li>
                        ))}
                </ul>
            </>
        );
    };

    return (
        // "cafe" finds "Café", which matching on code points alone would not
        <LocaleProvider locale="fr-FR" className={classes.panel}>
            <ActiveLocale />
            <Search />
        </LocaleProvider>
    );
};

// With Formatters, where a figure and a date are spelled out the way the reader reads them
export const WithFormatters: StoryFn<typeof LocaleProvider> = () => {
    const Reading = () => {
        const date = useDateFormatter({ day: "numeric", month: "long", year: "numeric" });
        const number = useNumberFormatter({ style: "currency", currency: "EUR" });

        return (
            <div className={classes.marker}>
                {date.format(new Date("2026-08-16T00:00:00Z"))}
                <br />
                {number.format(1234.5)}
            </div>
        );
    };

    return (
        <>
            <LocaleProvider locale="en-US" className={classes.panel}>
                <ActiveLocale />
                <Reading />
            </LocaleProvider>
            <LocaleProvider locale="de-DE" className={`${classes.panel} ${classes.nested}`}>
                <ActiveLocale />
                <Reading />
            </LocaleProvider>
        </>
    );
};
