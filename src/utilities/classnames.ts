import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The semantic typography classes from styles/typography.css each set the whole font
// shorthand, so one has to replace another. Grouping them also stops tailwind-merge from
// reading them as text colours and dropping them when a colour class travels alongside
const twMerge = extendTailwindMerge<"typography">({
    extend: {
        classGroups: {
            typography: [
                "text-body-large",
                "text-body-medium",
                "text-body-small",
                "text-caption",
                "text-code-block",
                "text-code-inline",
                "text-display",
                "text-subtitle",
                "text-title-large",
                "text-title-medium",
                "text-title-small",
            ],
        },
    },
});

export const classNames = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
