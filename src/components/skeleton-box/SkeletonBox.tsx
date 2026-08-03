import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SkeletonBoxProps } from "./SkeletonBox.types";

const classes = {
    root: "skeleton-box",
    shimmer: "motion-safe:shimmer",
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
            className={classNames(classes.root, classes.shimmer, className)}
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
