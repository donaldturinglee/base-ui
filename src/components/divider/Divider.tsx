import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DividerOrientation, DividerProps, DividerVariant } from "./Divider.types";

const classes = {
    // The line is drawn as a fill rather than as a border, so the same rules serve both
    // orientations and nothing can shrink it away in a flex row
    root: "shrink-0 m-0 p-0 border-0 bg-[var(--divider-color)]",
    orientation: {
        horizontal: "w-full h-[var(--border-width-thin)]",
        // A vertical line takes its height from whatever it stands beside, and keeps a
        // minimum of its own so it is still there where nothing stretches it
        vertical: "self-stretch w-[var(--border-width-thin)] h-auto min-h-[var(--base-size-16)]",
    } satisfies Record<DividerOrientation, string>,
    variant: {
        subtle: "[--divider-color:var(--border-color-muted)]",
        default: "[--divider-color:var(--border-color-default)]",
        emphasis: "[--divider-color:var(--border-color-emphasis)]",
    } satisfies Record<DividerVariant, string>,
};

function Divider<As extends React.ElementType = "div">(
    props: DividerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        orientation = "horizontal",
        variant = "default",
        ...rest
    } = props as DividerProps<"div">;

    return (
        <Component
            ref={ref}
            // The line stands between one section and the next, so it says as much. A
            // divider that is only decoration can be given `role="presentation"` instead
            role="separator"
            // A separator is read as horizontal unless it says otherwise
            aria-orientation={orientation === "vertical" ? "vertical" : undefined}
            className={classNames(
                classes.root,
                classes.orientation[orientation],
                classes.variant[variant],
                className,
            )}
            data-component="Divider"
            data-orientation={orientation}
            data-variant={variant}
            {...rest}
        />
    );
}

Divider.displayName = "Divider";

export default fixedForwardRef(Divider);
