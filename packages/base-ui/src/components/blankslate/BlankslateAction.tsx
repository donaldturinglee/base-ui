import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateActionProps } from "./Blankslate.types";

const classes = {
    root: "blankslate-action",
    tight: "blankslate-action-tight",
};

// Shared layout for the two action slots. Not part of the public Blankslate namespace.
function BlankslateAction(
    props: BlankslateActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div ref={ref} className={classNames(classes.root, classes.tight, className)} {...rest} />
    );
}

BlankslateAction.displayName = "Blankslate.Action";

export default fixedForwardRef(BlankslateAction);
