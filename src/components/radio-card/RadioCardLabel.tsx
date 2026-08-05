import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RadioCardContext } from "./RadioCardContext";
import type { RadioCardLabelProps } from "./RadioCard.types";

const classes = {
    root: "radio-card-label",
};

function RadioCardLabel(
    props: RadioCardLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { labelId } = React.useContext(RadioCardContext);

    return (
        <span
            ref={ref}
            // The radio is named after this line, so it takes the id the radio is already
            // pointing at unless the caller has named one of their own
            id={id ?? labelId}
            className={classNames(classes.root, className)}
            data-component="RadioCard.Label"
            {...rest}
        />
    );
}

RadioCardLabel.displayName = "RadioCard.Label";

export default fixedForwardRef(RadioCardLabel);
