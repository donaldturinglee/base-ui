import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import AvatarFallback from "./AvatarFallback";
import AvatarImage from "./AvatarImage";
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
        composed: {
            true: "avatar-composed",
            false: "",
        },
    },
});

// Whether the avatar was handed parts to compose rather than a picture to be. A fragment is looked
// through rather than counted as a part, since parts built from a list arrive wrapped in one
const hasParts = (children: React.ReactNode): boolean =>
    React.Children.toArray(children).some((child) => {
        if (!React.isValidElement(child)) {
            return false;
        }

        if (child.type === AvatarImage || child.type === AvatarFallback) {
            return true;
        }

        if (child.type === React.Fragment) {
            const { children: nested } = child.props as { children?: React.ReactNode };
            return hasParts(nested);
        }

        return false;
    });

// An avatar is the picture itself or the ground a picture and a fallback take turns on, settled by
// what it was given rather than by a prop:
//
//     <Avatar src="mona.png" alt="mona" />
//
//     <Avatar size={40}>
//         <Avatar.Image src="mona.png" alt="mona" />
//         <Avatar.Fallback name="Mona Lisa Octocat" />
//     </Avatar>
//
// Handed parts it is drawn as a span, since an image holds nothing inside it, and the alt text and
// the intrinsic dimensions go to the picture within rather than being written on the ground it
// sits on
function Avatar<As extends React.ElementType = "img">(
    props: AvatarProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as,
        className,
        alt = "",
        size = DEFAULT_AVATAR_SIZE,
        shape = "circle",
        style,
        children,
        ...rest
    } = props as AvatarProps<"img">;

    const composed = hasParts(children);
    const Component = as ?? (composed ? "span" : "img");

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
                alt={composed ? undefined : alt}
                // The intrinsic size holds the layout steady before the stylesheet resolves
                width={isResponsive || composed ? undefined : size}
                height={isResponsive || composed ? undefined : size}
                className={classNames(
                    avatarVariants({ shape, responsive: isResponsive, composed }),
                    className,
                )}
                style={{ ...style, ...sizeVariables } as React.CSSProperties}
                data-component="Avatar"
                data-responsive={isResponsive || undefined}
                data-shape={shape}
                data-status={composed ? status : undefined}
                {...rest}
            >
                {children}
            </Component>
        </AvatarContext.Provider>
    );
}

Avatar.displayName = "Avatar";

export default fixedForwardRef(Avatar);
