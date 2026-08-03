import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { FormControlContext } from "./FormControlContext";
import type { FormControlCaptionProps } from "./FormControl.types";

const classes = {
    root: "block [font-size:var(--text-body-size-small)] text-foreground-muted",
    disabled: "[color:var(--control-foreground-color-disabled)]",
};

function FormControlCaption(
    props: FormControlCaptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, ...rest } = props;
    const { captionId, disabled } = React.useContext(FormControlContext);

    return (
        <span
            ref={ref}
            id={id ?? captionId}
            className={classNames(classes.root, disabled && classes.disabled, className)}
            data-component="FormControl.Caption"
            data-control-disabled={disabled}
            {...rest}
        />
    );
}

FormControlCaption.displayName = "FormControl.Caption";

export default fixedForwardRef(FormControlCaption);
