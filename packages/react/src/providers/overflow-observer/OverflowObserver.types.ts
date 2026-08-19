import type * as React from "react";

// Puts one element on the shared observer and hands back the way to take it off again. More than
// one caller can watch the same element, so it is only let go once the last of them has gone
export type ObserveFn = (
    element: Element,
    onClippedChange: (isClipped: boolean) => void,
) => () => void;

export type OverflowObserverProviderProps = {
    // The element that does the clipping, which is whatever holds the row and hides what runs
    // past it. The shared observer is scoped to it, so a child pushed onto a row that is hidden
    // is reported as cut off rather than as merely off screen
    rootRef: React.RefObject<HTMLElement | null>;
    children?: React.ReactNode;
};
