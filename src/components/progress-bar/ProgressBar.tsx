import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ProgressBarItem from "./ProgressBarItem";
import type { ProgressBarProps, ProgressBarSize } from "./ProgressBar.types";

const classes = {
    root: "flex overflow-hidden gap-[var(--base-size-2)] bg-[var(--progress-bar-track-background-color)] rounded-[var(--border-radius-small)] outline-solid outline-[length:var(--border-width-thin)] outline-[color:var(--progress-bar-track-border-color)] -outline-offset-1",
    inline: "inline-flex",
    forcedColors: "forced-colors:[forced-color-adjust:none] forced-colors:bg-[color:CanvasText]",
    // The track heights are 5px, 8px and 10px, which the base size scale has no steps for
    size: {
        small: "h-[0.3125rem]",
        medium: "h-[0.5rem]",
        large: "h-[0.625rem]",
    } satisfies Record<ProgressBarSize, string>,
};

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
            className={classNames(
                classes.root,
                classes.size[size],
                inline && classes.inline,
                classes.forcedColors,
                className,
            )}
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
