import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type CardElement = "div" | "section";

export type CardPadding = "none" | "condensed" | "normal";

export type CardBorderRadius = "medium" | "large";

export type CardLayout = "default" | "compact";

export type CardHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

export type CardProps<As extends CardElement = "div"> = PolymorphicProps<
    As,
    "div",
    {
        padding?: CardPadding;
        borderRadius?: CardBorderRadius;
        layout?: CardLayout;
        className?: string;
    }
>;

export type CardHeadingProps = React.ComponentPropsWithoutRef<"h3"> & {
    as?: CardHeadingLevel;
    className?: string;
};

export type CardDescriptionProps = React.ComponentPropsWithoutRef<"p"> & {
    className?: string;
};

export type CardIconProps = React.ComponentPropsWithoutRef<"span"> & {
    icon: React.ElementType;
    className?: string;
};

export type CardImageProps = React.ComponentPropsWithoutRef<"img"> & {
    className?: string;
};

export type CardActionProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type CardMetadataProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type CardContextValue = {
    titleId?: string;
    layout?: CardLayout;
};
