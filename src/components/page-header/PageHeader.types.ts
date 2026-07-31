import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type PageHeaderViewport = "narrow" | "regular" | "wide";

// Whether a part of the header is taken off the screen, either everywhere or only at the
// viewport ranges it names
export type PageHeaderHidden = boolean | ResponsiveValue<boolean>;

// The title is drawn in one of three sizes. Medium is the usual page title; large is for
// something a reader wrote, an issue or a pull request say; subtitle is for a page that
// already carries a title of its own
export type PageHeaderTitleVariant = "subtitle" | "medium" | "large";

export type PageHeaderTitleElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// `hidden` means something else on a plain element, so the element's own version is dropped
// in favour of the header's
export type PageHeaderChildProps<As extends React.ElementType = "div"> = Omit<
    PolymorphicProps<As, "div">,
    "hidden"
> & {
    hidden?: PageHeaderHidden;
    className?: string;
};

export type PageHeaderProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // Draws a line under the header. It is left off wherever a navigation is showing at
        // the foot of the header, since that already sets the header apart from the page
        hasBorder?: boolean;
        className?: string;
    }
>;

export type PageHeaderTitleAreaProps = PageHeaderChildProps & {
    variant?: PageHeaderTitleVariant | ResponsiveValue<PageHeaderTitleVariant>;
};

// Every heading level takes the same props, so the element is named rather than standing for
// a shape of its own
export type PageHeaderTitleProps = Omit<React.ComponentPropsWithoutRef<"h2">, "hidden"> & {
    as?: PageHeaderTitleElement;
    hidden?: PageHeaderHidden;
    className?: string;
};

export type PageHeaderParentLinkProps<As extends React.ElementType = "a"> = Omit<
    PolymorphicProps<As, "a">,
    "hidden"
> & {
    hidden?: PageHeaderHidden;
    className?: string;
};

// A `nav` and a plain box take the same props, so the element is named rather than standing
// for a shape of its own
export type PageHeaderNavigationProps = Omit<React.ComponentPropsWithoutRef<"div">, "hidden"> & {
    as?: "div" | "nav";
    hidden?: PageHeaderHidden;
    className?: string;
};
