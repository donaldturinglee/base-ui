import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// The room left inside the box, on the same scale a stack leaves between its children, so the
// room inside a box and the room between boxes read the same
export type BoxPadding = "none" | "tight" | "condensed" | "cozy" | "normal" | "spacious";

// The fill drawn behind whatever the box holds
export type BoxBackground = "none" | "default" | "muted" | "inset" | "emphasis";

// The line drawn around the box
export type BoxBorder = "none" | "default" | "muted";

// How far the corners are turned in
export type BoxRadius = "none" | "small" | "medium" | "large" | "full";

// How far the box is lifted off the page. The steps are the resting ones, since a box sits on
// the page rather than floating over it
export type BoxShadow = "none" | "xsmall" | "small" | "medium";

// Whether whatever is inside is allowed to spill past the edges, or is cropped to them. A box
// that should scroll what it cannot show is a scrollable region instead
export type BoxOverflow = "visible" | "hidden";

export type BoxProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        padding?: BoxPadding;
        paddingBlock?: BoxPadding;
        paddingInline?: BoxPadding;
        background?: BoxBackground;
        border?: BoxBorder;
        radius?: BoxRadius;
        shadow?: BoxShadow;
        overflow?: BoxOverflow;
        className?: string;
    }
>;
