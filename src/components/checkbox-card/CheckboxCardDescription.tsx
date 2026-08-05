import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CheckboxCardContext } from "./CheckboxCardContext";
import type { CheckboxCardDescriptionProps } from "./CheckboxCard.types";

const classes = {
    root: "checkbox-card-description",
};

function CheckboxCardDescription(
    props: CheckboxCardDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { descriptionId } = React.useContext(CheckboxCardContext);

    return (
        <span
            ref={ref}
            // The checkbox is described by this line, so it takes the id the checkbox is already
            // pointing at unless the caller has named one of their own
            id={id ?? descriptionId}
            className={classNames(classes.root, className)}
            data-component="CheckboxCard.Description"
            {...rest}
        />
    );
}

CheckboxCardDescription.displayName = "CheckboxCard.Description";

export default fixedForwardRef(CheckboxCardDescription);
