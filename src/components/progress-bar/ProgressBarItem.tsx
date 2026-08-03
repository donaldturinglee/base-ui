import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ProgressBarItemProps, ProgressBarVariant } from "./ProgressBar.types";

const classes = {
    // The fallback lives in the class, so leaving the progress unset renders an empty segment
    root: "w-[var(--progress-bar-item-width,0%)]",
    shimmer: "motion-safe:shimmer",
    forcedColors: "forced-colors:[forced-color-adjust:none] forced-colors:bg-[color:LinkText]",
    variant: {
        accent: "bg-[var(--progress-bar-background-color-accent)]",
        attention: "bg-[var(--progress-bar-background-color-attention)]",
        danger: "bg-[var(--progress-bar-background-color-danger)]",
        done: "bg-[var(--progress-bar-background-color-done)]",
        neutral: "bg-[var(--progress-bar-background-color-neutral)]",
        severe: "bg-[var(--progress-bar-background-color-severe)]",
        sponsors: "bg-[var(--progress-bar-background-color-sponsors)]",
        success: "bg-[var(--progress-bar-background-color-success)]",
    } satisfies Record<ProgressBarVariant, string>,
};

function ProgressBarItem<As extends React.ElementType = "span">(
    props: ProgressBarItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        progress = 0,
        variant = "success",
        animated,
        style,
        "aria-valuenow": ariaValueNow,
        ...rest
    } = props as ProgressBarItemProps<"span">;

    return (
        <Component
            ref={ref}
            role="progressbar"
            aria-valuenow={ariaValueNow ?? Math.round(Math.max(progress, 0))}
            aria-valuemin={0}
            aria-valuemax={100}
            className={classNames(
                classes.root,
                classes.variant[variant],
                animated && classes.shimmer,
                classes.forcedColors,
                className,
            )}
            style={
                {
                    ...style,
                    "--progress-bar-item-width": `${progress}%`,
                } as React.CSSProperties
            }
            data-component="ProgressBar.Item"
            data-variant={variant}
            data-animated={animated}
            {...rest}
        />
    );
}

ProgressBarItem.displayName = "ProgressBar.Item";

export default fixedForwardRef(ProgressBarItem);
