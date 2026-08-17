import type * as React from "react";
import type { AvatarShape, AvatarSize } from "../avatar/Avatar.types";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type AvatarStackVariant = "cascade" | "stack";

// The end of the track the stack is anchored to, which is the end the avatars are dealt from and
// so the one whose avatar is left uncovered. It is named as a side rather than as a start and an
// end, since the stack is turned around by a direction of its own rather than by the reading
// order of the page around it
export type AvatarStackAlign = "left" | "right";

export type AvatarStackProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        variant?: AvatarStackVariant;
        shape?: AvatarShape;
        size?: AvatarSize;
        align?: AvatarStackAlign;
        disableExpand?: boolean;
        className?: string;
    }
>;
