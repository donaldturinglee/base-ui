import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateActionProps } from "./Blankslate.types";

const classes = {
    // The last action carries the blankslate's bottom padding, so the two actions can sit
    // together without doubling the gap beneath them
    root: "[font:var(--blankslate-description-text)] mt-[var(--base-size-16)] last-of-type:mb-[var(--blankslate-action-margin-block-end)]",
    tight: "@max-[34rem]/blankslate:mt-[var(--base-size-8)] @max-[34rem]/blankslate:first-of-type:mt-[var(--base-size-16)] @max-[34rem]/blankslate:last-of-type:mb-[calc(var(--base-size-8)/2)]",
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
