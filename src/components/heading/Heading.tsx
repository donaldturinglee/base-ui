import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { HeadingProps, HeadingSize } from "./Heading.types";

const classes = {
    root: "m-0",
    size: {
        large: "[font:var(--text-title-shorthand-large)]",
        medium: "[font:var(--text-title-shorthand-medium)]",
        small: "[font:var(--text-title-shorthand-small)]",
    } satisfies Record<HeadingSize, string>,
};

function Heading<As extends React.ElementType = "h2">(
    props: HeadingProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "h2",
        className,
        size = "large",
        ...rest
    } = props as HeadingProps<"h2">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.size[size], className)}
            data-component="Heading"
            data-size={size}
            {...rest}
        />
    );
}

Heading.displayName = "Heading";

export default fixedForwardRef(Heading);
