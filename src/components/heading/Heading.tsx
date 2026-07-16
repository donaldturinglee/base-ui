import * as React from "react";
import { classNames } from "../../utilities/classnames";
import type { ForwardRefComponent } from "../../utilities/polymorphic";
import type { HeadingProps } from "./Heading.types";

const classes = {
    root: "m-0",
    size: {
        large: "[font:var(--text-title-shorthand-large)]",
        medium: "[font:var(--text-title-shorthand-medium)]",
        small: "[font:var(--text-title-shorthand-small)]",
    } satisfies Record<NonNullable<HeadingProps["size"]>, string>,
};

const Heading = React.forwardRef<
    HTMLHeadingElement,
    HeadingProps & React.HTMLAttributes<HTMLHeadingElement> & { as?: React.ElementType }
>(function Heading({ as, size = "large", className, ...rest }, ref) {
    const Component = as ?? "h2";
    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.size[size], className)}
            data-component="Heading"
            data-size={size}
            {...rest}
        />
    );
}) as ForwardRefComponent<"h2", HeadingProps>;

Heading.displayName = "Heading";

export { Heading };
