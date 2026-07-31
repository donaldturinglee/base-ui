import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type PageFooterViewport = "narrow" | "regular" | "wide";

// Whether a part of the footer is taken off the screen, either everywhere or only at the
// viewport ranges it names
export type PageFooterHidden = boolean | ResponsiveValue<boolean>;

// The footer is set in one of two sizes. Normal is the foot of a site, which the reader is
// meant to read; condensed is the foot of a page inside an app, which is only there to be
// found when it is looked for
export type PageFooterVariant = "normal" | "condensed";

// `hidden` means something else on a plain element, so the element's own version is dropped
// in favour of the footer's
export type PageFooterChildProps<As extends React.ElementType = "div"> = Omit<
    PolymorphicProps<As, "div">,
    "hidden"
> & {
    hidden?: PageFooterHidden;
    className?: string;
};

export type PageFooterProps<As extends React.ElementType = "footer"> = PolymorphicProps<
    As,
    "footer",
    {
        variant?: PageFooterVariant | ResponsiveValue<PageFooterVariant>;
        // Draws a line above the footer. It is left off wherever a navigation is showing at
        // the head of the footer, since that already sets the footer apart from the page
        hasBorder?: boolean;
        className?: string;
    }
>;

// A `nav` and a plain box take the same props, so the element is named rather than standing
// for a shape of its own
export type PageFooterNavigationProps = Omit<React.ComponentPropsWithoutRef<"div">, "hidden"> & {
    as?: "div" | "nav";
    hidden?: PageFooterHidden;
    className?: string;
};
