import { createDateFormatter } from "../../utilities/i18n";
import { useLocaleContext } from "./useLocaleContext";
import type { UseDateFormatterProps } from "./Locale.types";

// A date formatter built for the locale the subtree is read in, so that the order the day, the
// month and the year come in follows the reader rather than the source. As with the collator, the
// formatter cache is what keeps the identity steady across renders
export const useDateFormatter = ({ locale, ...options }: UseDateFormatterProps = {}) => {
    const { locale: activeLocale } = useLocaleContext();

    return createDateFormatter(locale ?? activeLocale, options);
};
