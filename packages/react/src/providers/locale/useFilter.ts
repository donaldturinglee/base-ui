import { createFilter } from "../../utilities/i18n";
import { useLocaleContext } from "./useLocaleContext";
import type { UseFilterProps } from "./Locale.types";

// Matching typed text against listed text in the locale the subtree is read in, for the places a
// reader narrows a list down by typing into it. What comes back is the same filter for the same
// locale and options, so it can be held in a dependency list without a memo around it
export const useFilter = ({ locale, ...options }: UseFilterProps = {}) => {
    const { locale: activeLocale } = useLocaleContext();

    return createFilter({ locale: locale ?? activeLocale, ...options });
};
