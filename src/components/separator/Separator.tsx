import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SeparatorOrientation, SeparatorProps, SeparatorVariant } from "./Separator.types";

const separatorVariants = cva(
    // The line is drawn as a fill rather than as a border, so one set of rules serves both
    // orientations. Its colour comes through a custom property, so a caller can repaint the
    // line without having to unpick the class it came with
    "shrink-0 m-0 p-0 border-0 bg-[var(--separator-color)]",
    {
        variants: {
            orientation: {
                horizontal: "w-full h-[var(--border-width-thin)]",
                // A vertical line takes its height from whatever it stands beside, and keeps a
                // minimum of its own so it is still there where nothing stretches it
                vertical:
                    "self-stretch w-[var(--border-width-thin)] h-auto min-h-[var(--base-size-16)]",
            } satisfies Record<SeparatorOrientation, string>,
            variant: {
                subtle: "[--separator-color:var(--border-color-muted)]",
                default: "[--separator-color:var(--border-color-default)]",
                emphasis: "[--separator-color:var(--border-color-emphasis)]",
            } satisfies Record<SeparatorVariant, string>,
        },
    },
);

function Separator<As extends React.ElementType = "div">(
    props: SeparatorProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        orientation = "horizontal",
        variant = "default",
        ...rest
    } = props as SeparatorProps<"div">;

    return (
        <Component
            ref={ref}
            // The separator stands between one group of things and the next, and says which
            // way it runs whichever way that happens to be. A line that is only decoration can
            // be given `role="presentation"` instead
            role="separator"
            aria-orientation={orientation}
            className={classNames(separatorVariants({ orientation, variant }), className)}
            data-component="Separator"
            data-orientation={orientation}
            data-variant={variant}
            {...rest}
        />
    );
}

Separator.displayName = "Separator";

export default fixedForwardRef(Separator);
