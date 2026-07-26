import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AvatarProps, AvatarShape } from "./Avatar.types";

export const DEFAULT_AVATAR_SIZE = 20;

const classes = {
    // `overflow-hidden` keeps the page layout intact in Firefox should the image fail to load
    root: "inline-block overflow-hidden align-middle leading-none [box-shadow:0_0_0_var(--border-width-thin)_var(--avatar-border-color)]",
    size: "size-[var(--avatar-size-regular)]",
    // The viewport ranges are exclusive, so an unset narrow or wide size keeps the regular one
    responsive:
        "max-medium:size-[var(--avatar-size-narrow,var(--avatar-size-regular))] xxlarge:size-[var(--avatar-size-wide,var(--avatar-size-regular))]",
    shape: {
        circle: "rounded-[var(--border-radius-full)]",
        // The radius grows with the avatar, so small squares stay only slightly rounded
        square: "rounded-[clamp(var(--base-size-4),calc(var(--avatar-size-regular)_-_var(--base-size-24)),var(--border-radius-medium))]",
    } satisfies Record<AvatarShape, string>,
};

function Avatar<As extends React.ElementType = "img">(
    props: AvatarProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "img",
        className,
        alt = "",
        size = DEFAULT_AVATAR_SIZE,
        shape = "circle",
        style,
        ...rest
    } = props as AvatarProps<"img">;

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
        <Component
            ref={ref}
            alt={alt}
            // The intrinsic size holds the layout steady before the stylesheet resolves
            width={isResponsive ? undefined : size}
            height={isResponsive ? undefined : size}
            className={classNames(
                classes.root,
                classes.size,
                isResponsive && classes.responsive,
                classes.shape[shape],
                className,
            )}
            style={{ ...style, ...sizeVariables } as React.CSSProperties}
            data-component="Avatar"
            data-responsive={isResponsive || undefined}
            data-shape={shape}
            {...rest}
        />
    );
}

Avatar.displayName = "Avatar";

export default fixedForwardRef(Avatar);
