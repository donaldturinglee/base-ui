import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type BlankslateSize = "small" | "medium" | "large";

export type BlankslateHeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type BlankslateProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        size?: BlankslateSize;
        border?: boolean;
        narrow?: boolean;
        spacious?: boolean;
        className?: string;
    }
>;

export type BlankslateVisualProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type BlankslateHeadingProps = React.ComponentPropsWithoutRef<"h2"> & {
    as?: BlankslateHeadingLevel;
    className?: string;
};

export type BlankslateDescriptionProps = React.ComponentPropsWithoutRef<"p"> & {
    className?: string;
};

export type BlankslateActionProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type BlankslatePrimaryActionProps = BlankslateActionProps;

export type BlankslateSecondaryActionProps = BlankslateActionProps & {
    href?: string;
};
