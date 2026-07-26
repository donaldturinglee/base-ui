import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateVisualProps } from "./Blankslate.types";

const classes = {
    // `inline-flex` keeps the box the size of the icon inside it. The max width is only set
    // at the small size, so the fallback leaves the icon at its own size otherwise
    root: "inline-flex [color:var(--foreground-color-muted)] mb-[var(--base-size-8)] max-w-[var(--blankslate-visual-size,none)] [&_svg]:w-full",
    tight: "@max-[34rem]/blankslate:max-w-[var(--base-size-24)]",
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
