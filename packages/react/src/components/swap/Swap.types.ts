import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Which of the two an indicator is: the one shown while the swap is on, or the one shown while it
// is off
export type SwapIndicatorType = "on" | "off";

// How one indicator gives way to the other. Each is a pair of movements that cross, one standing
// back as the other comes forward, so the two read as one thing changing rather than as two things
// taking turns
export type SwapTransition = "fade" | "flip" | "rotate" | "scale" | "none";

// The swap is the ground its two indicators take turns on rather than a thing of its own, so it is
// drawn as a span and can be laid inside whatever presses it
export type SwapProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        // Which of the two indicators is shown. The caller holds this: a swap has nothing to press
        // and only says what it was told
        swap?: boolean;
        transition?: SwapTransition;
        className?: string;
    }
>;

type SwapIndicatorOwnProps = {
    type: SwapIndicatorType;
    className?: string;
};

export type SwapIndicatorProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    SwapIndicatorOwnProps
>;

// The same props with the element pinned, for reading inside the component
export type SwapIndicatorElementProps = PolymorphicProps<"span", "span", SwapIndicatorOwnProps>;

// Which indicator is shown, answered once on the swap so the two take turns rather than each
// deciding for itself
export type SwapContextValue = {
    swap?: boolean;
};
