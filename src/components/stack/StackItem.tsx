import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StackItemProps } from "./Stack.types";

const stackItemVariants = cva("stack-item", {
    variants: {
        grow: {
            true: "stack-item-grow",
            false: "stack-item-no-grow",
        },
        shrink: {
            true: "stack-item-shrink",
            false: "stack-item-no-shrink",
        },
    },
});

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
