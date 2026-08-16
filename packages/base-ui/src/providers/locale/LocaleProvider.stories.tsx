import type { StoryFn, Meta } from "@storybook/react-vite";
import { LocaleProvider, useLocaleContext } from ".";
import type { LocaleProviderProps } from "./Locale.types";

const classes = {
    panel: "p-[var(--base-size-16)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default",
};

export default {
    title: "Components/LocaleProvider",
    component: LocaleProvider,
} as Meta<typeof LocaleProvider>;

const ActiveLocale = () => {
    const { locale, direction } = useLocaleContext();

    return (
        <div>
            Locale: {locale}
            <br />
            Reading direction: {direction}
        </div>
    );
};

export const Default: StoryFn<typeof LocaleProvider> = () => (
    <LocaleProvider className={classes.panel}>
        <ActiveLocale />
    </LocaleProvider>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<LocaleProviderProps> = (args) => (
    <LocaleProvider {...args} className={classes.panel}>
        <ActiveLocale />
    </LocaleProvider>
);

Playground.args = {
    locale: "en-US",
    contextOnly: false,
};

Playground.argTypes = {
    locale: {
        control: {
            type: "select",
        },
        options: ["auto", "en-US", "en-GB", "de-DE", "fr-FR", "sv-SE", "ja-JP", "ar-EG", "he-IL"],
        description: "Which locale the subtree is read in, where auto follows the browser",
    },
    contextOnly: {
        control: {
            type: "boolean",
        },
        description: "Hands the locale to descendants without wrapping them in an element",
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
