import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AlertProps, AlertVariant } from "./Alert.types";

const classes = {
    root: "relative mt-0 p-[var(--base-size-16)] [color:var(--foreground-color-default)] border-solid border-[length:var(--border-width-thin)] rounded-[var(--border-radius-medium)] [&_p:last-child]:mb-0 [&_svg]:mr-[var(--base-size-8)]",
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
        ...rest
    } = props as AlertProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.variant[variant], className)}
            data-component="Alert"
            data-variant={variant}
            {...rest}
        />
    );
}

Alert.displayName = "Alert";

export default fixedForwardRef(Alert);
