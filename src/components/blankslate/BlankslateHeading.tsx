import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateHeadingProps } from "./Blankslate.types";

const classes = {
    // The size prop sets the type and the block margins, so both fall back to nothing when
    // the heading is used outside a blankslate
    root: "text-center [text-wrap:balance] [margin-inline:0] [margin-block:var(--blankslate-heading-margin-block,0)] [font:var(--blankslate-heading-text)]",
};

function BlankslateHeading(
    props: BlankslateHeadingProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h2", className, ...rest } = props;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Blankslate.Heading"
            {...rest}
        />
    );
}

BlankslateHeading.displayName = "Blankslate.Heading";

export default fixedForwardRef(BlankslateHeading);
