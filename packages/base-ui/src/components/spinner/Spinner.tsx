import * as React from "react";
import { ArrowClockwiseRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SpinnerProps, SpinnerSize } from "./Spinner.types";

const classes = {
    root: "spinner",
    srOnly: "sr-only",
};

const spinnerIconVariants = cva("motion-safe:animate-spin", {
    variants: {
        size: {
            small: "spinner-small",
            medium: "spinner-medium",
            large: "spinner-large",
        } satisfies Record<SpinnerSize, string>,
    },
});

function Spinner<As extends React.ElementType = "span">(
    props: SpinnerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        size = "medium",
        srText = "Loading",
        className,
        "aria-label": ariaLabel,
        ...rest
    } = props as SpinnerProps<"span">;

    return (
        <Component
            ref={ref}
            role="status"
            aria-label={ariaLabel ?? undefined}
            className={classNames(classes.root, className)}
            data-component="Spinner"
            {...rest}
        >
            <ArrowClockwiseRegular
                className={classNames(spinnerIconVariants({ size }))}
                aria-hidden="true"
            />
            {srText !== null && ariaLabel === undefined ? (
                <span className={classes.srOnly}>{srText}</span>
            ) : null}
        </Component>
    );
}

Spinner.displayName = "Spinner";

export default fixedForwardRef(Spinner);
