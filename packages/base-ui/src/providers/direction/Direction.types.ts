import type * as React from "react";

// The two directions text is read in, and the two the `dir` attribute settles on. `auto` is
// left out because it resolves to one of these anyway, and only from the content it is given
export type TextDirection = "ltr" | "rtl";

export type DirectionProviderProps = {
    // Which way the subtree is read
    direction?: TextDirection;
    // Hands the direction to descendants without wrapping them in a `[dir]` element.
    // The reading direction then comes from whichever ancestor carries the attribute
    contextOnly?: boolean;
    className?: string;
    children?: React.ReactNode;
};

export type DirectionContextValue = {
    // The direction the subtree settled on, and the one written to `dir`
    direction: TextDirection;
};
