import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AlertProps, AlertVariant } from "./Alert.types";

const classes = {
    root: "relative mt-0 p-[var(--base-size-16)] text-foreground-default border-solid border-[length:var(--border-width-thin)] rounded-[var(--border-radius-medium)] [&_p:last-child]:mb-0 [&_svg]:mr-[var(--base-size-8)]",
    variant: {
        default:
            "bg-background-accent-muted border-border-accent-muted [&_svg]:text-foreground-accent",
        success:
            "bg-background-success-muted border-border-success-muted [&_svg]:text-foreground-success",
        warning:
            "bg-background-attention-muted border-border-attention-muted [&_svg]:text-foreground-attention",
        danger: "bg-background-danger-muted border-border-danger-muted [&_svg]:text-foreground-danger",
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
