import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlankslateDescriptionProps } from "./Blankslate.types";

const classes = {
    root: "blankslate-description",
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
