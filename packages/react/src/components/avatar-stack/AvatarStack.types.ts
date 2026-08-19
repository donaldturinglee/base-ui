import type * as React from "react";
import type { AvatarProps, AvatarShape, AvatarSize } from "../avatar/Avatar.types";
import type { DistributiveOmit, PolymorphicProps } from "../../utilities/polymorphic";

export type AvatarStackVariant = "cascade" | "stack";

// The end of the track the stack is anchored to, which is the end the avatars are dealt from and
// so the one whose avatar is left uncovered. It is named as a side rather than as a start and an
// end, since the stack is turned around by a direction of its own rather than by the reading
// order of the page around it
export type AvatarStackAlign = "left" | "right";

// What a stack is made of. Each child is dealt a slot in the run, and the size the slot is cut to
// is read off the avatar while the edge that separates it from the one before it is drawn on the
// avatar's own class, so a bare picture is neither measured nor separated. Naming the children
// says so, rather than leaving a stack to come out half dressed
export type AvatarStackChild = React.ReactElement<AvatarProps>;

// `as` and `children` are put back on the outside rather than left inside: the element the stack
// is drawn as is read off the one, and the other has to stand clear of the `ReactNode` a span
// would otherwise hand it, which an intersection would only add to
export type AvatarStackProps<As extends React.ElementType = "span"> = DistributiveOmit<
    PolymorphicProps<
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
    >,
    "as" | "children"
> & {
    as?: As;
    children?: AvatarStackChild | AvatarStackChild[];
};
