import type { PageFooterHidden, PageFooterViewport } from "./PageFooter.types";

export const viewports: PageFooterViewport[] = ["narrow", "regular", "wide"];

const classes = {
    all: "hidden",
    // The same ranges the Hidden component is drawn from, since taking a part of the footer
    // off the screen at a viewport is the same thing said in another place
    when: {
        narrow: "hidden-narrow",
        regular: "hidden-regular",
        wide: "hidden-wide",
    } satisfies Record<PageFooterViewport, string>,
};

// Which viewport ranges a part of the footer is taken off the screen at. A part hidden
// outright names all three
export const getHiddenViewports = (hidden: PageFooterHidden = false): PageFooterViewport[] => {
    if (typeof hidden === "boolean") {
        return hidden ? [...viewports] : [];
    }

    return viewports.filter((viewport) => hidden[viewport]);
};

// Picks the class for each range in the set. Where every range is named, the one class that
// covers them all stands in for the three of them
export const getViewportClassName = (
    matched: PageFooterViewport[],
    all: string,
    when: Record<PageFooterViewport, string>,
) => (matched.length === viewports.length ? all : matched.map((viewport) => when[viewport]));

// What takes the part off the screen
export const getHiddenClassName = (hiddenViewports: PageFooterViewport[]) =>
    getViewportClassName(hiddenViewports, classes.all, classes.when);

// What a part says about itself, so that whether it is showing can be read off the DOM
export const getHiddenAttribute = (hiddenViewports: PageFooterViewport[]) =>
    hiddenViewports.length > 0 ? hiddenViewports.join(" ") : undefined;
