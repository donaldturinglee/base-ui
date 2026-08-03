import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ProgressBarItemProps, ProgressBarVariant } from "./ProgressBar.types";

const progressBarItemVariants = cva("progress-bar-item", {
    variants: {
        variant: {
            accent: "progress-bar-item-accent",
            attention: "progress-bar-item-attention",
            danger: "progress-bar-item-danger",
            done: "progress-bar-item-done",
            neutral: "progress-bar-item-neutral",
            severe: "progress-bar-item-severe",
            sponsors: "progress-bar-item-sponsors",
            success: "progress-bar-item-success",
        } satisfies Record<ProgressBarVariant, string>,
        animated: {
            true: "motion-safe:shimmer",
            false: "",
        },
    },
});

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
            className={classNames(progressBarItemVariants({ variant, animated }), className)}
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
