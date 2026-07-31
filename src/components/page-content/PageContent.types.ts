import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type PageContentViewport = "narrow" | "regular" | "wide";

// Whether a run of the content is taken off the screen, either everywhere or only at the
// viewport ranges it names
export type PageContentHidden = boolean | ResponsiveValue<boolean>;

// The widest the content is allowed to run before it is held still and centred. The steps
// match the ones a page layout is held to, so a page reads the same either way
export type PageContentWidth = "full" | "medium" | "large" | "xlarge";

// How much room is left around the content, and between the runs of it
export type PageContentSpacing = "none" | "condensed" | "normal" | "spacious";

export type PageContentProps<As extends React.ElementType = "main"> = PolymorphicProps<
    As,
    "main",
    {
        width?: PageContentWidth;
        // The room left around the content
        padding?: PageContentSpacing;
        // The room left between the runs of content
        gap?: PageContentSpacing;
        className?: string;
    }
>;

// `hidden` means something else on a plain element, so the element's own version is dropped
// in favour of the content's
export type PageContentSectionProps<As extends React.ElementType = "section"> = Omit<
    PolymorphicProps<As, "section">,
    "hidden"
> & {
    hidden?: PageContentHidden;
    className?: string;
};
