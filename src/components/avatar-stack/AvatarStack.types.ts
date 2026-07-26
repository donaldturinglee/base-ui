import type * as React from "react";
import type { AvatarShape, AvatarSize } from "../avatar/Avatar.types";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type AvatarStackVariant = "cascade" | "stack";

export type AvatarStackProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        variant?: AvatarStackVariant;
        shape?: AvatarShape;
        size?: AvatarSize;
        alignRight?: boolean;
        disableExpand?: boolean;
        className?: string;
    }
>;
