import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateVisualProps } from "./Blankslate.types";

const classes = {
    root: "blankslate-visual",
    tight: "blankslate-visual-tight",
};

function BlankslateVisual(
    props: BlankslateVisualProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, classes.tight, className)}
            data-component="Blankslate.Visual"
            {...rest}
        />
    );
}

BlankslateVisual.displayName = "Blankslate.Visual";

export default fixedForwardRef(BlankslateVisual);
