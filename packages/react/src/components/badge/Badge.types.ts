import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonVisual } from "../button";

// What the badge is saying, rather than the colour it happens to be drawn in, so a scheme can be
// changed underneath it without every name going stale. The set is the one Label carries, less
// the two that only make sense on an outline: a badge is filled, and a fill has nothing to say
// twice over
export type BadgeVariant =
    | "default"
    | "primary"
    | "accent"
    | "success"
    | "attention"
    | "severe"
    | "danger"
    | "done"
    | "sponsors";

// Whether the colour is the badge's own ground, or a dot standing inside a plain one. A row of
// filled badges is read as a row of colours; a row of dots is read as a column of states, which
// is what a badge following something that changes is usually for
export type BadgeAppearance = "filled" | "dot";

export type BadgeSize = "small" | "medium" | "large";

export type BadgeProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        variant?: BadgeVariant;
        appearance?: BadgeAppearance;
        size?: BadgeSize;
        // Stands before the text. The dot appearance already puts a mark there, so one given
        // here stands in its place rather than beside it
        leadingVisual?: ButtonVisual;
        className?: string;
    }
>;
