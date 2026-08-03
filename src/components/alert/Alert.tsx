import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AlertProps, AlertVariant } from "./Alert.types";

const alertVariants = cva("alert", {
    variants: {
        variant: {
            default: "alert-default",
            success: "alert-success",
            warning: "alert-warning",
            danger: "alert-danger",
        } satisfies Record<AlertVariant, string>,
    },
});

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
            className={classNames(alertVariants({ variant }), className)}
            data-component="Alert"
            data-variant={variant}
            {...rest}
        />
    );
}

Alert.displayName = "Alert";

export default fixedForwardRef(Alert);
