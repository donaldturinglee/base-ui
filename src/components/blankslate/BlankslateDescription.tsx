import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateDescriptionProps } from "./Blankslate.types";

const classes = {
    // Only the large size gives the description block margins, so the fallback keeps the
    // paragraph flush at the other sizes
    root: "text-center [text-wrap:balance] [margin-inline:0] [margin-block:var(--blankslate-description-margin-block,0)] [font:var(--blankslate-description-text)] text-foreground-muted",
};

function BlankslateDescription(
    props: BlankslateDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <p
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Blankslate.Description"
            {...rest}
        />
    );
}

BlankslateDescription.displayName = "Blankslate.Description";

export default fixedForwardRef(BlankslateDescription);
