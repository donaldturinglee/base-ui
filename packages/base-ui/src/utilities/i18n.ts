import type { TextDirection } from "../providers/direction/Direction.types";

// The tag everything falls back to: what a locale resolves to before anything has said which one
// to read, and what a tag no formatter can read is replaced with
export const DEFAULT_LOCALE = "en-US";

// Two option objects saying the same thing in a different order stand for the same formatter, so
// the key is written out in a fixed order. An option left undefined is dropped rather than
// spelled out, since leaving it out and passing it as undefined mean the same thing to Intl
const getCacheKey = (locale: string, options?: object) => {
    if (!options) {
        return locale;
    }

    const entries = Object.entries(options)
        .filter(([, value]) => value !== undefined)
        .sort(([left], [right]) => (left < right ? -1 : 1))
        .map(([key, value]) => `${key}=${String(value)}`);

    return `${locale}|${entries.join(",")}`;
};

// An Intl formatter costs far more to build than to use, and a list being filtered or a table
// being redrawn asks for the same locale and options over and over. Each one is built once and
// kept against the pair it was built from, so the cost is paid on the first row rather than on
// every one
const i18nCache = <TFormatter, TOptions extends object>(
    build: (locale: string, options?: TOptions) => TFormatter,
) => {
    const formatters = new Map<string, TFormatter>();

    return (locale: string, options?: TOptions) => {
        const key = getCacheKey(locale, options);
        const cached = formatters.get(key);

        if (cached) {
            return cached;
        }

        const formatter = build(locale, options);
        formatters.set(key, formatter);

        return formatter;
    };
};

// The scripts written right to left, named the way `Intl.Locale` names them. A tag is matched on
// its script rather than on its language, so a language written in more than one script is read
// the way the tag itself spells out
const RTL_SCRIPTS = new Set([
    "Adlm",
    "Arab",
    "Armi",
    "Avst",
    "Hebr",
    "Mand",
    "Mend",
    "Nkoo",
    "Rohg",
    "Samr",
    "Syrc",
    "Thaa",
]);

// The languages written right to left, for engines with no `Intl.Locale` to name a script with.
// A tag that spells out its own script never reaches this, so only the language is looked at
const RTL_LANGUAGES = new Set([
    "ae",
    "ar",
    "arc",
    "bcc",
    "bqi",
    "ckb",
    "dv",
    "fa",
    "glk",
    "he",
    "ku",
    "mzn",
    "nqo",
    "pnb",
    "ps",
    "sd",
    "ug",
    "ur",
    "yi",
]);

// The script a tag is written in, which for a tag that does not spell one out is the script the
// language is usually written in: what turns `ar` into `Arab`. An engine without `Intl.Locale`,
// and a tag it cannot read, are left to the language list instead
const getScript = (locale: string) => {
    try {
        return new Intl.Locale(locale).maximize().script;
    } catch {
        return undefined;
    }
};

export const isRtl = (locale: string) => {
    const script = getScript(locale);

    if (script) {
        return RTL_SCRIPTS.has(script);
    }

    return RTL_LANGUAGES.has(locale.split("-")[0].toLowerCase());
};

export const getLocaleDirection = (locale: string): TextDirection =>
    isRtl(locale) ? "rtl" : "ltr";

// The locale the browser is reading in. A tag it reports that Intl cannot read is no use to a
// formatter, and would throw at the first one built from it, so it falls back here rather than
// being handed on
export const getDefaultLocale = () => {
    const locale = typeof navigator === "undefined" ? undefined : navigator.language;

    if (!locale) {
        return DEFAULT_LOCALE;
    }

    try {
        Intl.DateTimeFormat.supportedLocalesOf([locale]);
        return locale;
    } catch {
        return DEFAULT_LOCALE;
    }
};

const getCollator = i18nCache(
    (locale: string, options?: Intl.CollatorOptions) => new Intl.Collator(locale, options),
);

// Orders strings the way the locale reads them rather than the way their code points run, which
// is what puts "ä" beside "a" in German and after "z" in Swedish
export const createCollator = (locale = DEFAULT_LOCALE, options: Intl.CollatorOptions = {}) =>
    getCollator(locale, options);

export type FilterOptions = Intl.CollatorOptions & {
    locale?: string;
};

export type Filter = {
    startsWith: (text: string, term: string) => boolean;
    endsWith: (text: string, term: string) => boolean;
    contains: (text: string, term: string) => boolean;
};

// Punctuation is stripped a character class at a time rather than by a literal, since the escape
// that names one is newer than the target these sources are compiled down to
const PUNCTUATION_PATTERN = new RegExp("\\p{P}", "gu");

// Matching what was typed against what is listed, the way the locale reads both. A plain
// `includes` answers on code points, so "cafe" would not find "café" and an accent the reader
// cannot easily type would keep an option out of reach. Searching is what a collator loosens
// under `usage: "search"`, and what the rest of this is built on.
//
// Each comparison is made against a window as long as the term, so what is matched is what is
// spelled with the same number of characters. A locale that reads one letter as two, as German
// reads "ö" as "oe", is matched on the letter rather than on the pair
const buildFilter = (locale: string, options: Intl.CollatorOptions = {}): Filter => {
    const collator = getCollator(locale, { usage: "search", ...options });

    // The same character can be written as one code point or as a letter and a mark after it, and
    // the two spellings look identical on the page. Both are put in one form before anything is
    // compared, so what is read as the same is treated as the same
    const normalize = (value: string) => {
        const normalized = value.normalize("NFC");

        return collator.resolvedOptions().ignorePunctuation
            ? normalized.replace(PUNCTUATION_PATTERN, "")
            : normalized;
    };

    const isEqual = (text: string, term: string) => collator.compare(text, term) === 0;

    const startsWith = (text: string, term: string) => {
        if (term.length === 0) {
            return true;
        }

        const [haystack, needle] = [normalize(text), normalize(term)];

        return isEqual(haystack.slice(0, needle.length), needle);
    };

    const endsWith = (text: string, term: string) => {
        if (term.length === 0) {
            return true;
        }

        const [haystack, needle] = [normalize(text), normalize(term)];

        return isEqual(haystack.slice(-needle.length), needle);
    };

    // Walked a window at a time rather than by an index, because two strings the collator reads
    // as equal need not be the same length, so there is no position to look the term up at
    const contains = (text: string, term: string) => {
        if (term.length === 0) {
            return true;
        }

        const [haystack, needle] = [normalize(text), normalize(term)];

        for (let start = 0; start + needle.length <= haystack.length; start++) {
            if (isEqual(haystack.slice(start, start + needle.length), needle)) {
                return true;
            }
        }

        return false;
    };

    return { startsWith, endsWith, contains };
};

// Kept alongside the formatters so that the same locale and options hand back the same filter
// rather than a new one on every render, which is what lets a caller hold it in a dependency list
const getFilter = i18nCache(buildFilter);

export const createFilter = ({ locale, ...options }: FilterOptions = {}) =>
    getFilter(locale ?? DEFAULT_LOCALE, options);

const getNumberFormatter = i18nCache(
    (locale: string, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, options),
);

export const createNumberFormatter = (
    locale = DEFAULT_LOCALE,
    options: Intl.NumberFormatOptions = {},
) => getNumberFormatter(locale, options);

export const formatNumber = (
    value: number,
    locale = DEFAULT_LOCALE,
    options: Intl.NumberFormatOptions = {},
) => getNumberFormatter(locale, options).format(value);

const getListFormatter = i18nCache(
    (locale: string, options?: Intl.ListFormatOptions) => new Intl.ListFormat(locale, options),
);

// Spells a list out as a sentence does, which is where the "and" comes from and where the comma
// before it goes when the locale does not want one
export const formatList = (
    list: string[],
    locale = DEFAULT_LOCALE,
    options: Intl.ListFormatOptions = {},
) => getListFormatter(locale, options).format(list);

const getDateFormatter = i18nCache(
    (locale: string, options?: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat(locale, options),
);

export const createDateFormatter = (
    locale = DEFAULT_LOCALE,
    options: Intl.DateTimeFormatOptions = {},
) => getDateFormatter(locale, options);

const BIT_PREFIXES = ["", "kilo", "mega", "giga", "tera"];
const BYTE_PREFIXES = ["", "kilo", "mega", "giga", "tera", "peta"];

export type FormatBytesOptions = {
    // How many significant digits the reading is cut down to
    precision?: number;
    // Whether a kilobyte is a thousand bytes or 1024 of them
    unitSystem?: "binary" | "decimal";
    unit?: "bit" | "byte";
    // How the unit is spelled out, from "kilobytes" through "kB" to "k"
    unitDisplay?: "long" | "short" | "narrow";
};

// A size the way it would be read aloud rather than the number of bytes behind it. The unit comes
// from `Intl` along with the number, so it is named and placed the way the locale names and
// places it.
//
// Note that Intl has no name for the binary units, so counting in 1024s is still read out as
// "kB" rather than as "KiB"
export const formatBytes = (
    bytes: number,
    locale = DEFAULT_LOCALE,
    options: FormatBytesOptions = {},
) => {
    if (Number.isNaN(bytes)) {
        return "";
    }

    if (bytes === 0) {
        return "0 B";
    }

    const { precision = 3, unitSystem = "decimal", unit = "byte", unitDisplay = "short" } = options;

    const factor = unitSystem === "binary" ? 1024 : 1000;
    const prefixes = unit === "bit" ? BIT_PREFIXES : BYTE_PREFIXES;

    // Stepped up a prefix at a time rather than worked out with a logarithm, so that a size past
    // the largest prefix there is a name for keeps that name instead of running off the end
    let value = Math.abs(bytes);
    let index = 0;

    while (value >= factor && index < prefixes.length - 1) {
        value /= factor;
        index++;
    }

    const rounded = parseFloat(value.toPrecision(precision));

    return formatNumber(bytes < 0 ? -rounded : rounded, locale, {
        style: "unit",
        unit: prefixes[index] + unit,
        unitDisplay,
    });
};
