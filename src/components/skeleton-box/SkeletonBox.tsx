import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SkeletonBoxProps } from "./SkeletonBox.types";

const classes = {
    root: "block bg-[var(--skeleton-loader-background-color)] rounded-[var(--border-radius-small)]",
    dimensions: "w-[var(--skeleton-box-width,auto)] h-[var(--skeleton-box-height,1rem)]",
    shimmer:
        "motion-safe:[mask-image:linear-gradient(75deg,#000_30%,rgb(0,0,0,0.65)_80%)] motion-safe:[mask-size:200%] motion-safe:animate-shimmer",
    forcedColors:
        "forced-colors:outline-1 forced-colors:outline-transparent forced-colors:-outline-offset-1",
};

function SkeletonBox<As extends React.ElementType = "div">(
    props: SkeletonBoxProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        width,
        height,
        style,
        ...rest
    } = props as SkeletonBoxProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(
                classes.root,
                classes.dimensions,
                classes.shimmer,
                classes.forcedColors,
                className,
            )}
            style={
                {
                    ...style,
                    // The fallbacks live in the class, so leaving these unset renders a
                    // full width box one line tall
                    "--skeleton-box-width": width,
                    "--skeleton-box-height": height,
                } as React.CSSProperties
            }
            data-component="SkeletonBox"
            {...rest}
        />
    );
}

SkeletonBox.displayName = "SkeletonBox";

export default fixedForwardRef(SkeletonBox);
