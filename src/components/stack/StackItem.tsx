import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StackItemProps } from "./Stack.types";

const stackItemVariants = cva(
    // `flex-initial` keeps items at their own size until `grow` or `shrink` opts out
    "flex-initial min-w-0",
    {
        variants: {
            grow: {
                true: "grow",
                false: "grow-0",
            },
            shrink: {
                true: "shrink",
                false: "shrink-0",
            },
        },
    },
);

function StackItem<As extends React.ElementType = "div">(
    props: StackItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        grow,
        shrink,
        ...rest
    } = props as StackItemProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(stackItemVariants({ grow, shrink }), className)}
            data-component="StackItem"
            data-grow={grow}
            data-shrink={shrink}
            {...rest}
        />
    );
}

StackItem.displayName = "StackItem";

export default fixedForwardRef(StackItem);
