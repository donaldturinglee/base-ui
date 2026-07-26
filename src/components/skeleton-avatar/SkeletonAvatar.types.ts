import type * as React from "react";
import type { AvatarShape, AvatarSize } from "../avatar/Avatar.types";

export type SkeletonAvatarProps = React.ComponentPropsWithoutRef<"div"> & {
    size?: AvatarSize;
    shape?: AvatarShape;
    className?: string;
};
