import { createCollator } from "../../utilities/i18n";
import { useLocaleContext } from "./useLocaleContext";
import type { UseCollatorProps } from "./Locale.types";

// A collator built for the locale the subtree is read in, for sorting that has to order the way
// the reader does. `localeCompare` builds one of these on every comparison it is asked for, so a
// list sorted through it pays for a collator per pair; this one is built once and handed to the
// sort.
//
// It carries no memo of its own because the formatter cache hands back the same collator for the
// same locale and options, so the identity holds across renders anyway
export const useCollator = ({ locale, ...options }: UseCollatorProps = {}) => {
    const { locale: activeLocale } = useLocaleContext();

    return createCollator(locale ?? activeLocale, options);
};
