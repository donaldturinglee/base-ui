import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { HeadingProps, HeadingSize } from "./Heading.types";

const headingVariants = cva("heading", {
    variants: {
        size: {
            large: "text-title-large",
            medium: "text-title-medium",
            small: "text-title-small",
        } satisfies Record<HeadingSize, string>,
    },
});

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
            className={classNames(headingVariants({ size }), className)}
            data-component="Heading"
            data-size={size}
            {...rest}
        />
    );
}

Heading.displayName = "Heading";

export default fixedForwardRef(Heading);
