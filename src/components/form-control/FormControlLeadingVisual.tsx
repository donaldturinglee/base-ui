import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { FormControlContext } from "./FormControlContext";
import type { FormControlLeadingVisualProps } from "./FormControl.types";

const classes = {
    root: "form-control-leading-visual",
    disabled: "form-control-leading-visual-disabled",
    withCaption: "form-control-leading-visual-with-caption",
};

function FormControlLeadingVisual(
    props: FormControlLeadingVisualProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const { captionId, disabled } = React.useContext(FormControlContext);

    return (
        <div
            ref={ref}
            className={classNames(
                classes.root,
                captionId && classes.withCaption,
                disabled && classes.disabled,
                className,
            )}
            data-component="FormControl.LeadingVisual"
            data-control-disabled={disabled}
            data-has-caption={captionId ? true : undefined}
            {...rest}
        />
    );
}

FormControlLeadingVisual.displayName = "FormControl.LeadingVisual";

export default fixedForwardRef(FormControlLeadingVisual);
