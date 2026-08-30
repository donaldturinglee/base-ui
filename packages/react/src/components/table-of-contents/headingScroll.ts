import type * as React from "react";
import type { TableOfContentsRect } from "./TableOfContents.types";

// The heading a line points at, looked for in the document rather than in the contents. A line
// names a heading somewhere on the page, and where that heading is drawn is no business of the
// list standing beside it
export const getHeadingElement = (value: string) => {
    if (typeof document === "undefined") {
        return null;
    }

    return document.getElementById(value);
};

// Brings a heading to the top of whatever is scrolled. A page whose window does the scrolling is
// left to the browser's own way of getting there; one scrolled inside an element is worked out by
// hand, since `scrollIntoView` would carry the window along with it and drag the whole page about.
//
// Answers whether there was anywhere to go, so that a link which could not be followed is handed
// back to the browser rather than quietly doing nothing
export const scrollToHeading = (
    value: string,
    options: { scrollElement?: HTMLElement | null; behavior?: ScrollBehavior } = {},
) => {
    const { scrollElement, behavior } = options;
    const heading = getHeadingElement(value);

    if (!heading) {
        return false;
    }

    if (!scrollElement) {
        heading.scrollIntoView?.({ behavior, block: "start" });
        return true;
    }

    // A heading drawn somewhere else entirely is not this element's to scroll to
    if (!scrollElement.contains(heading)) {
        return false;
    }

    const headingRect = heading.getBoundingClientRect();
    const scrollRect = scrollElement.getBoundingClientRect();

    // Whatever room the page asks to be left above a heading it has been scrolled to is left,
    // so a heading does not come to rest under a bar standing over it
    const scrollPadding = toNumber(
        getComputedStyle(scrollElement).scrollPaddingBlockStart ||
            getComputedStyle(scrollElement).scrollPaddingTop,
    );
    const scrollMargin = toNumber(
        getComputedStyle(heading).scrollMarginBlockStart ||
            getComputedStyle(heading).scrollMarginTop,
    );

    const top =
        headingRect.top - scrollRect.top + scrollElement.scrollTop - scrollPadding - scrollMargin;

    scrollElement.scrollTo({ top, ...(behavior && { behavior }) });
    return true;
};

// The heading a link points at, but only where the link points somewhere on this very page. A
// link off to somewhere else is left alone, since following it is a navigation rather than a jump
export const getSamePageHash = (anchor: HTMLElement) => {
    const href = anchor.getAttribute("href");

    if (!href) {
        return null;
    }

    const url = new URL(href, window.location.href);

    if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search
    ) {
        return null;
    }

    try {
        return decodeURIComponent(url.hash.slice(1)) || null;
    } catch {
        return null;
    }
};

// Writes the heading into the address bar the way following the link would have. The page has
// already been scrolled by hand at this point, so the entry is pushed rather than jumped to, and
// the event the browser would have raised is raised alongside it for anything else listening
export const pushHash = (value: string) => {
    const oldURL = window.location.href;

    window.history.pushState(null, "", `#${value}`);
    window.dispatchEvent(
        new HashChangeEvent("hashchange", { oldURL, newURL: window.location.href }),
    );
};

// A press that is asking for something other than a jump down this page — a new tab, a new
// window, a download, a middle click — is left to the browser to answer
export const isPlainClick = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button !== 0) {
        return false;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return false;
    }

    const anchor = event.currentTarget;

    if (anchor.hasAttribute("download")) {
        return false;
    }

    const target = anchor.getAttribute("target");

    return target === null || target === "" || target === "_self";
};

// Whether the indicator has anything to be drawn against. A list that has not been laid out yet
// measures as nothing at all, and nothing is nearer to what it will look like than a bar sitting
// in the corner at no size
export const isEmptyRect = (rect: TableOfContentsRect | null) =>
    rect === null || (rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0);

export const isSameRect = (one: TableOfContentsRect | null, other: TableOfContentsRect) =>
    one !== null &&
    one.x === other.x &&
    one.y === other.y &&
    one.width === other.width &&
    one.height === other.height;

const toNumber = (value: string) => {
    const parsed = Number.parseFloat(value);

    return Number.isNaN(parsed) ? 0 : parsed;
};
