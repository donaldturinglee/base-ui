import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AlertProps, AlertVariant } from "./Alert.types";

const classes = {
    root: "relative mt-0 p-[var(--base-size-16)] [color:var(--foreground-color-default)] border-solid [&_p:last-child]:mb-0 [&_svg]:mr-[var(--base-size-8)]",
    inset: "border-[length:var(--border-width-thin)] rounded-[var(--border-radius-medium)]",
    // A full width alert spans the page, so the side borders and the radius come off and the
    // top border pulls up over the one above it
    full: "-mt-px border-x-0 border-y-[length:var(--border-width-thin)] rounded-none",
    variant: {
        default:
            "bg-[var(--background-color-accent-muted)] border-[color:var(--border-color-accent-muted)] [&_svg]:[color:var(--foreground-color-accent)]",
        success:
            "bg-[var(--background-color-success-muted)] border-[color:var(--border-color-success-muted)] [&_svg]:[color:var(--foreground-color-success)]",
        warning:
            "bg-[var(--background-color-attention-muted)] border-[color:var(--border-color-attention-muted)] [&_svg]:[color:var(--foreground-color-attention)]",
        danger: "bg-[var(--background-color-danger-muted)] border-[color:var(--border-color-danger-muted)] [&_svg]:[color:var(--foreground-color-danger)]",
    } satisfies Record<AlertVariant, string>,
};

function Alert<As extends React.ElementType = "div">(
    props: AlertProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        variant = "default",
        full,
        ...rest
    } = props as AlertProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(
                classes.root,
                full ? classes.full : classes.inset,
                classes.variant[variant],
                className,
            )}
            data-component="Alert"
            data-variant={variant}
            data-full={full}
            {...rest}
        />
    );
}

Alert.displayName = "Alert";

export default fixedForwardRef(Alert);
