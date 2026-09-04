import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// A region can be taken away for good, or only within a range of viewports
export type PageHeaderHidden = boolean | ResponsiveValue<boolean>;

// Medium is the size a static page title takes. Large is for a title the reader wrote, such
// as an issue or a pull request. Subtitle is for a header standing under another title on the
// page, as in a split layout
export type PageHeaderTitleVariant = "subtitle" | "medium" | "large";

export type PageHeaderTitleLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type PageHeaderProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // Draws a line beneath the header. It is left off wherever a navigation region is
        // showing, since the navigation draws a line of its own
        hasBorder?: boolean;
        className?: string;
    }
>;

// The native `hidden` attribute is dropped throughout, so a region can be taken away one
// viewport range at a time rather than only outright
export type PageHeaderRegionProps = Omit<React.ComponentPropsWithoutRef<"div">, "hidden"> & {
    hidden?: PageHeaderHidden;
    className?: string;
};

export type PageHeaderContextAreaProps = PageHeaderRegionProps;

export type PageHeaderContextBarProps = PageHeaderRegionProps;

export type PageHeaderContextAreaActionsProps = PageHeaderRegionProps;

export type PageHeaderLeadingActionProps = PageHeaderRegionProps;

export type PageHeaderBreadcrumbsProps = PageHeaderRegionProps;

export type PageHeaderLeadingVisualProps = PageHeaderRegionProps;

export type PageHeaderTrailingVisualProps = PageHeaderRegionProps;

export type PageHeaderTrailingActionProps = PageHeaderRegionProps;

export type PageHeaderActionsProps = PageHeaderRegionProps;

export type PageHeaderDescriptionProps = PageHeaderRegionProps;

export type PageHeaderParentLinkProps<As extends React.ElementType = "a"> = Omit<
    PolymorphicProps<As, "a", { className?: string }>,
    "hidden"
> & {
    hidden?: PageHeaderHidden;
};

export type PageHeaderTitleAreaProps = PageHeaderRegionProps & {
    variant?: PageHeaderTitleVariant | ResponsiveValue<PageHeaderTitleVariant>;
};

export type PageHeaderTitleProps = Omit<React.ComponentPropsWithoutRef<"h2">, "hidden"> & {
    as?: PageHeaderTitleLevel;
    hidden?: PageHeaderHidden;
    className?: string;
};

// A `nav` landmark has to be named for a screen reader, in its own words or by something
// already on the page, while a plain `div` is no landmark and carries no label
type PageHeaderNavigationLandmark =
    | { as: "nav"; "aria-label": string; "aria-labelledby"?: undefined }
    | { as: "nav"; "aria-label"?: undefined; "aria-labelledby": string }
    | { as?: "div"; "aria-label"?: undefined; "aria-labelledby"?: undefined };

export type PageHeaderNavigationProps = Omit<
    React.ComponentPropsWithoutRef<"nav">,
    "hidden" | "aria-label" | "aria-labelledby"
> & {
    hidden?: PageHeaderHidden;
    className?: string;
} & PageHeaderNavigationLandmark;

// The same props with the landmark left open, for reading inside the component
export type PageHeaderNavigationElementProps = Omit<
    React.ComponentPropsWithoutRef<"nav">,
    "hidden"
> & {
    as?: "nav" | "div";
    hidden?: PageHeaderHidden;
    className?: string;
};
