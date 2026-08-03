import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AvatarProps, AvatarShape } from "./Avatar.types";

export const DEFAULT_AVATAR_SIZE = 20;

const avatarVariants = cva("avatar", {
    variants: {
        shape: {
            circle: "avatar-circle",
            square: "avatar-square",
        } satisfies Record<AvatarShape, string>,
        responsive: {
            true: "avatar-responsive",
            false: "",
        },
    },
});

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
            className={classNames(avatarVariants({ shape, responsive: isResponsive }), className)}
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
