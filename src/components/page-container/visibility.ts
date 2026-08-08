import type { PageContainerHidden, PageContainerViewport } from "./PageContainer.types";

export const viewports: PageContainerViewport[] = ["narrow", "regular", "wide"];

const classes = {
    all: "hidden",
    // The same ranges the Hidden component is drawn from, since taking a region of the page
    // off the screen at a viewport is the same thing said in another place
    when: {
        narrow: "hidden-narrow",
        regular: "hidden-regular",
        wide: "hidden-wide",
    } satisfies Record<PageContainerViewport, string>,
};

// Which viewport ranges a region of the page is taken off the screen at. A region hidden
// outright names all three
export const getHiddenViewports = (
    hidden: PageContainerHidden = false,
): PageContainerViewport[] => {
    if (typeof hidden === "boolean") {
        return hidden ? [...viewports] : [];
    }

    return viewports.filter((viewport) => hidden[viewport]);
};

// Picks the class for each range in the set. Where every range is named, the one class that
// covers them all stands in for the three of them
export const getViewportClassName = (
    matched: PageContainerViewport[],
    all: string,
    when: Record<PageContainerViewport, string>,
) => (matched.length === viewports.length ? all : matched.map((viewport) => when[viewport]));

// What takes the region off the screen
export const getHiddenClassName = (hiddenViewports: PageContainerViewport[]) =>
    getViewportClassName(hiddenViewports, classes.all, classes.when);

// What a region says about itself, so that whether it is showing can be read off the DOM
export const getHiddenAttribute = (hiddenViewports: PageContainerViewport[]) =>
    hiddenViewports.length > 0 ? hiddenViewports.join(" ") : undefined;
