import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames, cva } from "../../lib/classnames";
import { DEFAULT_AVATAR_SIZE } from "../avatar/Avatar";
import type { AvatarShape } from "../avatar/Avatar.types";
import SkeletonBox from "../skeleton-box/SkeletonBox";
import type { SkeletonAvatarProps } from "./SkeletonAvatar.types";

const skeletonAvatarVariants = cva("skeleton-avatar", {
    variants: {
        shape: {
            circle: "skeleton-avatar-circle",
            square: "skeleton-avatar-square",
        } satisfies Record<AvatarShape, string>,
        responsive: {
            true: "skeleton-avatar-responsive",
            false: "",
        },
    },
});

function SkeletonAvatar({
    size = DEFAULT_AVATAR_SIZE,
    shape = "circle",
    className,
    style,
    ...rest
}: SkeletonAvatarProps) {
    const isResponsive = isResponsiveValue(size);
    const sizeVariables: Record<string, string> = {
        // Seeded so the avatar keeps a size when a responsive value leaves the regular range out
        "--avatar-size-regular": `${DEFAULT_AVATAR_SIZE}px`,
    };

    if (isResponsive) {
        for (const [range, value] of Object.entries(size)) {
            if (value !== undefined) {
                sizeVariables[`--avatar-size-${range}`] = `${value}px`;
            }
        }
    } else {
        sizeVariables["--avatar-size-regular"] = `${size}px`;
    }

    return (
        <SkeletonBox
            width="var(--avatar-size-regular)"
            height="var(--avatar-size-regular)"
            className={classNames(
                skeletonAvatarVariants({ shape, responsive: isResponsive }),
                className,
            )}
            style={{ ...style, ...sizeVariables } as React.CSSProperties}
            {...rest}
            data-component="SkeletonAvatar"
            data-responsive={isResponsive || undefined}
            data-shape={shape}
        />
    );
}

SkeletonAvatar.displayName = "SkeletonAvatar";

export default SkeletonAvatar;
