import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The semantic typography classes from styles/base/typography.css each set the whole font
// shorthand, so one has to replace another. Grouping them also stops tailwind-merge from
// reading them as text colours and dropping them when a colour class travels alongside.
// The Text component's own classes from styles/components/text.css are grouped for the same
// reason, a size and a weight to a group so that only a second size replaces a size.
// The semantic motion and z-index classes from styles/utilities/variables.css, and the shimmer
// class from styles/base/animations.css, carry names tailwind-merge cannot recognise on its
// own, so they join the built-in groups they belong to
const twMerge = extendTailwindMerge<"typography" | "textSize" | "textWeight">({
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
            textSize: ["text-size-large", "text-size-medium", "text-size-small"],
            textWeight: [
                "text-weight-light",
                "text-weight-normal",
                "text-weight-medium",
                "text-weight-semibold",
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
