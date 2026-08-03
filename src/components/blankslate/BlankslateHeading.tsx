import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateHeadingProps } from "./Blankslate.types";

const classes = {
    root: "blankslate-heading",
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
