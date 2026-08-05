import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RadioCardContext } from "./RadioCardContext";
import type { RadioCardDescriptionProps } from "./RadioCard.types";

const classes = {
    root: "radio-card-description",
};

function RadioCardDescription(
    props: RadioCardDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { descriptionId } = React.useContext(RadioCardContext);

    return (
        <span
            ref={ref}
            // The radio is described by this line, so it takes the id the radio is already
            // pointing at unless the caller has named one of their own
            id={id ?? descriptionId}
            className={classNames(classes.root, className)}
            data-component="RadioCard.Description"
            {...rest}
        />
    );
}

RadioCardDescription.displayName = "RadioCard.Description";

export default fixedForwardRef(RadioCardDescription);
