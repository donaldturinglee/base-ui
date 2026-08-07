import type { NavigationMenuHeadingLevel } from "./NavigationMenu.types";

// The deepest a heading in the menu is allowed to go. The page title is the h1 and the menu
// is named an h2 or an h3, so a group heading never runs past an h4
const DEEPEST_LEVEL = 4;

// A menu with no heading of its own says nothing about how deep its groups stand, so they
// fall back to where they have always been
const FALLBACK_GROUP_LEVEL = 3;

export const levelForHeadingTag = (as: NavigationMenuHeadingLevel) =>
    Number.parseInt(as.slice(1), 10);

// A group heading stands one level below the menu's own heading, so that the menu reads as a
// shallow tree rather than as a run of headings all at the same level
export const headingTagForLevel = (menuLevel: number | null) => {
    const level = menuLevel === null ? FALLBACK_GROUP_LEVEL : menuLevel + 1;

    return `h${Math.min(Math.max(level, 1), DEEPEST_LEVEL)}` as "h1" | "h2" | "h3" | "h4";
};
