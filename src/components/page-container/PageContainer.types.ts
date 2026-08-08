import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type PageContainerViewport = "narrow" | "regular" | "wide";

// Whether a region of the page is taken off the screen, either everywhere or only at the
// viewport ranges it names
export type PageContainerHidden = boolean | ResponsiveValue<boolean>;

// The widest the page is allowed to run before it is held still and centred. The steps match
// the ones a page layout is held to, so a page reads the same either way
export type PageContainerWidth = "full" | "medium" | "large" | "xlarge";

// How much room is left around the page, and between the regions of it
export type PageContainerSpacing = "none" | "condensed" | "normal" | "spacious";

export type PageContainerProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        width?: PageContainerWidth;
        // The room left between the page and the edge of the viewport
        padding?: PageContainerSpacing;
        // The room left between the regions of the page
        gap?: PageContainerSpacing;
        // Stands the page at least as tall as the viewport, so the foot of a short page falls
        // to the bottom of the screen rather than partway up it
        fullHeight?: boolean;
        className?: string;
    }
>;

// `hidden` means something else on a plain element, so the element's own version is dropped
// in favour of the container's
export type PageContainerRegionProps<As extends React.ElementType = "div"> = Omit<
    PolymorphicProps<As, "div">,
    "hidden"
> & {
    hidden?: PageContainerHidden;
    // Lets the region take whatever height the page has left over, which is what holds the
    // foot of a full-height page at the bottom
    grow?: boolean;
    className?: string;
};
