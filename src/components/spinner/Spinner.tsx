import * as React from "react";
import { ArrowClockwiseRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import type { SpinnerProps } from "./Spinner.types";

const classes = {
    root: "inline-flex flex-col items-center",
    icon: "motion-safe:animate-spin",
    srOnly: "sr-only",
    size: {
        small: "size-[var(--spinner-size-small)]",
        medium: "size-[var(--spinner-size-medium)]",
        large: "size-[var(--spinner-size-large)]",
    } satisfies Record<NonNullable<SpinnerProps["size"]>, string>,
};

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
    { size = "medium", srText = "Loading", className, "aria-label": ariaLabel, ...rest },
    ref,
) {
    return (
        <span
            ref={ref}
            role="status"
            aria-label={ariaLabel ?? undefined}
            className={classNames(classes.root, className)}
            {...rest}
        >
            <ArrowClockwiseRegular
                className={classNames(classes.icon, classes.size[size])}
                aria-hidden="true"
            />
            {srText !== null && ariaLabel === undefined ? (
                <span className={classes.srOnly}>{srText}</span>
            ) : null}
        </span>
    );
});

Spinner.displayName = "Spinner";

export { Spinner };
