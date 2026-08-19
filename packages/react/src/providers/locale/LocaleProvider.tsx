import * as React from "react";
import { DEFAULT_LOCALE, getDefaultLocale, getLocaleDirection } from "../../utilities/i18n";
import { DirectionContext } from "../direction/DirectionContext";
import { LocaleContext } from "./LocaleContext";
import { useLocaleContext } from "./useLocaleContext";
import type { LocaleProviderProps } from "./Locale.types";

// The one value of `locale` that names no locale, standing for whichever one the browser is set
// to read in
export const AUTO_LOCALE = "auto";

// The language a browser is set to can change under a page that is already open, so it is read as
// a store rather than once at startup. `window` is not there on the server, and `languagechange`
// is not fired by every engine, so every reach for it is guarded
const subscribeToBrowserLocale = (onStoreChange: () => void) => {
    window?.addEventListener?.("languagechange", onStoreChange);
    return () => window?.removeEventListener?.("languagechange", onStoreChange);
};

// The server has no reader to ask, so it falls back to the same tag the context defaults to and
// the first render in the browser matches what was sent
const getServerLocale = () => DEFAULT_LOCALE;

const useBrowserLocale = () =>
    React.useSyncExternalStore(subscribeToBrowserLocale, getDefaultLocale, getServerLocale);

// Settles on a locale and puts it within reach of everything below, both as the `lang` attribute
// the page is read under and as a tag a formatter can be built from. The reading direction the
// tag implies is handed down with it, so that a subtree in Arabic turns around without being
// asked to twice
function LocaleProvider({ children, className, ...props }: LocaleProviderProps) {
    // What the caller leaves out comes from a LocaleProvider further up, so a nested provider
    // only has to say what it changes
    const { locale: inheritedLocale } = useLocaleContext();
    const browserLocale = useBrowserLocale();

    const requestedLocale = props.locale ?? inheritedLocale;
    const locale = requestedLocale === AUTO_LOCALE ? browserLocale : requestedLocale;
    const direction = getLocaleDirection(locale);

    const context = React.useMemo(() => ({ locale, direction }), [locale, direction]);

    // The direction is put on the context the rest of the package already reads, rather than only
    // on this one, so that `useDirection` and the `dir` attribute below cannot disagree about the
    // subtree they are both describing. A caller wanting the two apart can still nest a
    // DirectionProvider inside this one
    const directionContext = React.useMemo(() => ({ direction }), [direction]);

    return (
        <LocaleContext.Provider value={context}>
            <DirectionContext.Provider value={directionContext}>
                <div
                    className={className}
                    data-component="LocaleProvider"
                    // What tells a screen reader which voice to read the subtree in, and what the
                    // `:lang()` selectors and the browser's own hyphenation are written against
                    lang={locale}
                    // Logical properties and the `:dir()` selectors in `styles` read the direction
                    // off the document rather than off context, so this attribute is what turns
                    // the subtree around
                    dir={direction}
                >
                    {children}
                </div>
            </DirectionContext.Provider>
        </LocaleContext.Provider>
    );
}

LocaleProvider.displayName = "LocaleProvider";

export default LocaleProvider;
