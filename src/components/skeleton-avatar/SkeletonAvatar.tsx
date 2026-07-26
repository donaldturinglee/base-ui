import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames } from "../../utilities/classnames";
import { DEFAULT_AVATAR_SIZE } from "../avatar/Avatar";
import type { AvatarShape } from "../avatar/Avatar.types";
import SkeletonBox from "../skeleton-box/SkeletonBox";
import type { SkeletonAvatarProps } from "./SkeletonAvatar.types";

const classes = {
    root: "inline-block leading-none",
    // The viewport ranges are exclusive, so an unset narrow or wide size keeps the regular one
    responsive:
        "max-medium:size-[var(--avatar-size-narrow,var(--avatar-size-regular))] xxlarge:size-[var(--avatar-size-wide,var(--avatar-size-regular))]",
    shape: {
        circle: "rounded-[var(--border-radius-full)]",
        // The radius grows with the avatar, so small squares stay only slightly rounded
        square: "rounded-[clamp(var(--base-size-4),calc(var(--avatar-size-regular)_-_var(--base-size-24)),var(--border-radius-medium))]",
    } satisfies Record<AvatarShape, string>,
};

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
                classes.root,
                isResponsive && classes.responsive,
                classes.shape[shape],
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
