import type { PageContentHidden, PageContentViewport } from "./PageContent.types";

export const viewports: PageContentViewport[] = ["narrow", "regular", "wide"];

const classes = {
    all: "hidden",
    // The ranges are exclusive, so hiding at one viewport leaves the other two untouched
    when: {
        narrow: "max-medium:hidden",
        regular: "medium:max-xxlarge:hidden",
        wide: "xxlarge:hidden",
    } satisfies Record<PageContentViewport, string>,
};

// Which viewport ranges a run of the content is taken off the screen at. A run hidden
// outright names all three
export const getHiddenViewports = (hidden: PageContentHidden = false): PageContentViewport[] => {
    if (typeof hidden === "boolean") {
        return hidden ? [...viewports] : [];
    }

    return viewports.filter((viewport) => hidden[viewport]);
};

// Picks the class for each range in the set. Where every range is named, the one class that
// covers them all stands in for the three of them
export const getViewportClassName = (
    matched: PageContentViewport[],
    all: string,
    when: Record<PageContentViewport, string>,
) => (matched.length === viewports.length ? all : matched.map((viewport) => when[viewport]));

// What takes the run off the screen
export const getHiddenClassName = (hiddenViewports: PageContentViewport[]) =>
    getViewportClassName(hiddenViewports, classes.all, classes.when);

// What a run says about itself, so that whether it is showing can be read off the DOM
export const getHiddenAttribute = (hiddenViewports: PageContentViewport[]) =>
    hiddenViewports.length > 0 ? hiddenViewports.join(" ") : undefined;
