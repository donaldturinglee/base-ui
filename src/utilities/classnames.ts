import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The semantic typography classes from styles/typography.css each set the whole font
// shorthand, so one has to replace another. Grouping them also stops tailwind-merge from
// reading them as text colours and dropping them when a colour class travels alongside.
// The semantic motion and z-index classes from styles/variables.css, and the shimmer class from
// styles/motion.css, carry names tailwind-merge cannot recognise on its own, so they join the
// built-in groups they belong to
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
            animate: ["shimmer"],
            duration: ["duration-micro", "duration-short", "duration-medium", "duration-long"],
            ease: ["ease-enter", "ease-exit", "ease-hover", "ease-move"],
            z: [
                "z-behind",
                "z-default",
                "z-dropdown",
                "z-modal",
                "z-overlay",
                "z-popover",
                "z-skip-link",
                "z-sticky",
            ],
        },
    },
});

export const classNames = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// class-variance-authority builds a variant's class list but leaves conflicting classes sitting
// next to one another, so a component hands the result to classNames and lets the extended
// tailwind-merge above settle it against whatever className the caller passed
export { cva } from "class-variance-authority";
