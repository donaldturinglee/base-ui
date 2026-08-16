import { createContext } from "react";
import { DEFAULT_LOCALE, getLocaleDirection } from "../../utilities/i18n";
import type { LocaleContextValue } from "./Locale.types";

export { DEFAULT_LOCALE };

// The default stands in for a provider that is not there, so `useLocaleContext` answers with a
// locale wherever it is called. It is a fixed tag rather than the browser's, so that a tree drawn
// on the server and the same tree drawn in the browser start from the same one and agree on what
// they drew. Following the reader's own locale is what `locale="auto"` is for
export const LocaleContext = createContext<LocaleContextValue>({
    locale: DEFAULT_LOCALE,
    direction: getLocaleDirection(DEFAULT_LOCALE),
});
