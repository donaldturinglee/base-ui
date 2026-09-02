import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StrongProps, StrongSize } from "./Strong.types";

const strongVariants = cva("strong", {
    variants: {
        size: {
            large: "strong-size-large",
            medium: "strong-size-medium",
            small: "strong-size-small",
        } satisfies Record<StrongSize, string>,
    },
});

// A word or two the reader is not to pass over: what cannot be undone, what has to be done first,
// what will be lost. The weight is what says so, and is set here rather than left to the browser,
// so that words marked out this way are set in the weight the library keeps for it however they
// are drawn.
//
// The size is not answered unless a caller asks for one, so the words keep the size of the line
// they are read in rather than setting one of their own against it. There is no weight to ask
// for: the weight is what makes these words important, so it is the component's rather than a
// knob on it. Where a lighter one is wanted the words were not important, and are Text
function Strong<As extends React.ElementType = "strong">(
    props: StrongProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "strong", className, size, ...rest } = props as StrongProps<"strong">;

    return (
        <Component
            ref={ref}
            className={classNames(strongVariants({ size }), className)}
            data-component="Strong"
            data-size={size}
            {...rest}
        />
    );
}

Strong.displayName = "Strong";

export default fixedForwardRef(Strong);
