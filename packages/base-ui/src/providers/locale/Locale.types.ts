import type * as React from "react";
import type { FilterOptions } from "../../utilities/i18n";
import type { TextDirection } from "../direction/Direction.types";

export type LocaleProviderProps = {
    // Which locale the subtree is read in, as a BCP 47 tag such as "en-GB" or "ar-EG".
    // The one tag that does not name a locale is "auto", which follows the browser instead
    locale?: string;
    // Hands the locale to descendants without wrapping them in a `[lang]` element. The language
    // and the reading direction then come from whichever ancestor carries those attributes
    contextOnly?: boolean;
    className?: string;
    children?: React.ReactNode;
};

export type LocaleContextValue = {
    // The tag the subtree settled on, and the one written to `lang`
    locale: string;
    // Which way that locale is read. It is worked out from the tag rather than asked for
    // separately, since a language is not read in a direction of the caller's choosing
    direction: TextDirection;
};

// Each of these takes a locale of its own for the odd case that has to be spelled out in a
// locale other than the one it is being read under, such as a language picker naming its own
// options. Left out, they follow the provider

export type UseCollatorProps = Intl.CollatorOptions & {
    locale?: string;
};

export type UseFilterProps = FilterOptions;

export type UseDateFormatterProps = Intl.DateTimeFormatOptions & {
    locale?: string;
};

export type UseNumberFormatterProps = Intl.NumberFormatOptions & {
    locale?: string;
};
