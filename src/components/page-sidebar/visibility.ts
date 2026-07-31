import type { PageSidebarHidden, PageSidebarViewport } from "./PageSidebar.types";

export const viewports: PageSidebarViewport[] = ["narrow", "regular", "wide"];

const classes = {
    all: "hidden",
    // The ranges are exclusive, so hiding at one viewport leaves the other two untouched
    when: {
        narrow: "max-medium:hidden",
        regular: "medium:max-xxlarge:hidden",
        wide: "xxlarge:hidden",
    } satisfies Record<PageSidebarViewport, string>,
};

// Which viewport ranges a part of the sidebar is taken off the screen at. A part hidden
// outright names all three
export const getHiddenViewports = (hidden: PageSidebarHidden = false): PageSidebarViewport[] => {
    if (typeof hidden === "boolean") {
        return hidden ? [...viewports] : [];
    }

    return viewports.filter((viewport) => hidden[viewport]);
};

// Picks the class for each range in the set. Where every range is named, the one class that
// covers them all stands in for the three of them
export const getViewportClassName = (
    matched: PageSidebarViewport[],
    all: string,
    when: Record<PageSidebarViewport, string>,
) => (matched.length === viewports.length ? all : matched.map((viewport) => when[viewport]));

// What takes the part off the screen
export const getHiddenClassName = (hiddenViewports: PageSidebarViewport[]) =>
    getViewportClassName(hiddenViewports, classes.all, classes.when);

// What a part says about itself, so that whether it is showing can be read off the DOM
export const getHiddenAttribute = (hiddenViewports: PageSidebarViewport[]) =>
    hiddenViewports.length > 0 ? hiddenViewports.join(" ") : undefined;
