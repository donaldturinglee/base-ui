import { createNumberFormatter } from "../../utilities/i18n";
import { useLocaleContext } from "./useLocaleContext";
import type { UseNumberFormatterProps } from "./Locale.types";

// A number formatter built for the locale the subtree is read in, so that the grouping and the
// decimal separator follow the reader: the same figure written 1,234.5 in English and 1.234,5 in
// German. As with the collator, the formatter cache is what keeps the identity steady
export const useNumberFormatter = ({ locale, ...options }: UseNumberFormatterProps = {}) => {
    const { locale: activeLocale } = useLocaleContext();

    return createNumberFormatter(locale ?? activeLocale, options);
};
