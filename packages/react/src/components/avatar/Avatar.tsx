import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AvatarContext } from "./AvatarContext";
import type { AvatarLoadingStatus, AvatarProps, AvatarShape } from "./Avatar.types";

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

// An avatar is the ground a picture and a fallback take turns on, composed of the parts it is
// handed rather than being a picture of its own:
//
//     <Avatar size={40}>
//         <Avatar.Image src="mona.png" alt="mona" />
//         <Avatar.Fallback name="Mona Lisa Octocat" />
//     </Avatar>
//
// It is drawn as a span, since an image holds nothing inside it, and the alt text and the
// intrinsic dimensions go to the picture within rather than being written on the ground it sits on
function Avatar<As extends React.ElementType = "span">(
    props: AvatarProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        size = DEFAULT_AVATAR_SIZE,
        shape = "circle",
        style,
        children,
        ...rest
    } = props as AvatarProps<"span">;

    const [status, setStatus] = React.useState<AvatarLoadingStatus>("idle");
    const context = React.useMemo(() => ({ status, setStatus }), [status]);

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
        <AvatarContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(
                    avatarVariants({ shape, responsive: isResponsive }),
                    className,
                )}
                style={{ ...style, ...sizeVariables } as React.CSSProperties}
                data-component="Avatar"
                data-responsive={isResponsive || undefined}
                data-shape={shape}
                data-status={status}
                {...rest}
            >
                {children}
            </Component>
        </AvatarContext.Provider>
    );
}

Avatar.displayName = "Avatar";

export default fixedForwardRef(Avatar);
