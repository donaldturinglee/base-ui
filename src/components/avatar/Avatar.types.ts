import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type AvatarSize = number | ResponsiveValue<number>;

export type AvatarShape = "circle" | "square";

export type AvatarProps<As extends React.ElementType = "img"> = PolymorphicProps<
    As,
    "img",
    {
        size?: AvatarSize;
        shape?: AvatarShape;
        className?: string;
    }
>;
