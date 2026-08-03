import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ProgressBarItem from "./ProgressBarItem";
import type { ProgressBarProps, ProgressBarSize } from "./ProgressBar.types";

const progressBarVariants = cva("progress-bar", {
    variants: {
        size: {
            small: "progress-bar-small",
            medium: "progress-bar-medium",
            large: "progress-bar-large",
        } satisfies Record<ProgressBarSize, string>,
        inline: {
            true: "progress-bar-inline",
            false: "",
        },
    },
});

function ProgressBar<As extends React.ElementType = "span">(
    props: ProgressBarProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        progress,
        size = "medium",
        variant = "success",
        inline,
        animated,
        children,
        "aria-label": ariaLabel,
        "aria-valuenow": ariaValueNow,
        "aria-valuetext": ariaValueText,
        ...rest
    } = props as ProgressBarProps<"span">;

    if (children && progress) {
        throw new Error("Pass either `progress` or children to ProgressBar, not both.");
    }

    // Counts the children that actually render, so booleans, null and undefined do not
    // stand in for a segment
    const hasChildren = React.Children.toArray(children).length > 0;

    return (
        <Component
            ref={ref}
            className={classNames(progressBarVariants({ size, inline }), className)}
            data-component="ProgressBar"
            data-size={size}
            data-inline={inline}
            {...rest}
        >
            {hasChildren ? (
                children
            ) : (
                <ProgressBarItem
                    progress={progress}
                    variant={variant}
                    animated={animated}
                    aria-label={ariaLabel}
                    aria-valuenow={ariaValueNow}
                    aria-valuetext={ariaValueText}
                />
            )}
        </Component>
    );
}

ProgressBar.displayName = "ProgressBar";

export default fixedForwardRef(ProgressBar);
