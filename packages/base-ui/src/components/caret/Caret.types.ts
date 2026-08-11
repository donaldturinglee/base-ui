import type * as React from "react";

// Which edge the caret stands on, and where along that edge it stands. The two halves are read in
// that order, so `top-left` is a caret on the top edge over towards the left, while `left-top` is
// one on the left edge up towards the top
export type CaretLocation =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "left-top"
    | "left-bottom"
    | "right-top"
    | "right-bottom";

// The half of a location that names an edge, which is what settles the way the caret points. What
// follows it only says where along that edge it stands
export type CaretEdge = "top" | "right" | "bottom" | "left";

export type CaretProps = React.ComponentPropsWithoutRef<"svg"> & {
    location?: CaretLocation;
    // Half the caret's box, and so how far its point stands out from the edge it is drawn against
    size?: number;
    // What the caret is painted and outlined with. They come through as custom properties rather
    // than being drawn in, so a caret can as readily be repainted from a stylesheet, and each
    // falls back to what the surface it points from is already drawn with
    background?: string;
    borderColor?: string;
    borderWidth?: string | number;
    className?: string;
};
