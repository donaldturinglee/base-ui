import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type PageSidebarViewport = "narrow" | "regular" | "wide";

// Whether a part of the sidebar is taken off the screen, either everywhere or only at the
// viewport ranges it names
export type PageSidebarHidden = boolean | ResponsiveValue<boolean>;

// Which side of the page the sidebar stands on
export type PageSidebarPosition = "start" | "end";

// The steps match the ones a layout pane is held to, so a sidebar reads the same either way.
// A narrow viewport has no room beside the content, so every step runs the whole width there
export type PageSidebarWidth = "small" | "medium" | "large";

// How much room is left around the sidebar, and between the runs of it
export type PageSidebarSpacing = "none" | "condensed" | "normal" | "spacious";

export type PageSidebarTitleElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// `hidden` means something else on a plain element, so the element's own version is dropped
// in favour of the sidebar's
export type PageSidebarChildProps<As extends React.ElementType = "div"> = Omit<
    PolymorphicProps<As, "div">,
    "hidden"
> & {
    hidden?: PageSidebarHidden;
    className?: string;
};

export type PageSidebarProps<As extends React.ElementType = "aside"> = PolymorphicProps<
    As,
    "aside",
    {
        position?: PageSidebarPosition;
        width?: PageSidebarWidth;
        // The room left around the sidebar
        padding?: PageSidebarSpacing;
        // The room left between the runs of the sidebar
        gap?: PageSidebarSpacing;
        // Holds the sidebar in place as the page scrolls past it
        sticky?: boolean;
        // Draws a line between the sidebar and the page, on whichever edge faces the content
        hasBorder?: boolean;
        className?: string;
    }
>;

// Every heading level takes the same props, so the element is named rather than standing for
// a shape of its own
export type PageSidebarTitleProps = Omit<React.ComponentPropsWithoutRef<"h2">, "hidden"> & {
    as?: PageSidebarTitleElement;
    hidden?: PageSidebarHidden;
    className?: string;
};

// A `nav` and a plain box take the same props, so the element is named rather than standing
// for a shape of its own
export type PageSidebarNavigationProps = Omit<React.ComponentPropsWithoutRef<"div">, "hidden"> & {
    as?: "div" | "nav";
    hidden?: PageSidebarHidden;
    className?: string;
};
