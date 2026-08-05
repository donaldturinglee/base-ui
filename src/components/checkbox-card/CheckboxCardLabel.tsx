import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CheckboxCardContext } from "./CheckboxCardContext";
import type { CheckboxCardLabelProps } from "./CheckboxCard.types";

const classes = {
    root: "checkbox-card-label",
};

function CheckboxCardLabel(
    props: CheckboxCardLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { labelId } = React.useContext(CheckboxCardContext);

    return (
        <span
            ref={ref}
            // The checkbox is named after this line, so it takes the id the checkbox is already
            // pointing at unless the caller has named one of their own
            id={id ?? labelId}
            className={classNames(classes.root, className)}
            data-component="CheckboxCard.Label"
            {...rest}
        />
    );
}

CheckboxCardLabel.displayName = "CheckboxCard.Label";

export default fixedForwardRef(CheckboxCardLabel);
