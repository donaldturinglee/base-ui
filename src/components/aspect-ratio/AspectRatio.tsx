import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { AspectRatioProps } from "./AspectRatio.types";

const classes = {
    root: "aspect-ratio",
};

function AspectRatio<As extends React.ElementType = "div">(
    props: AspectRatioProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        // A box that is not told what shape to keep is square
        ratio = 1,
        style,
        ...rest
    } = props as AspectRatioProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            style={
                {
                    ...style,
                    // The shape is the one thing the class cannot settle on its own, since it
                    // is the caller who says what it should be
                    "--aspect-ratio": ratio,
                } as React.CSSProperties
            }
            data-component="AspectRatio"
            {...rest}
        />
    );
}

AspectRatio.displayName = "AspectRatio";

export default fixedForwardRef(AspectRatio);
