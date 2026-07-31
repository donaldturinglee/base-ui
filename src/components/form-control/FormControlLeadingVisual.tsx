import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { FormControlContext } from "./FormControlContext";
import type { FormControlLeadingVisualProps } from "./FormControl.types";

const classes = {
    // The visual stands between the box and the name beside it, and is sized from the line it
    // is set against rather than from the icon given to it
    root: "flex items-center ms-[var(--base-size-8)] [--leading-visual-size:var(--base-size-16)] [color:var(--foreground-color-default)] [&>*]:min-w-[var(--leading-visual-size)] [&>*]:min-h-[var(--leading-visual-size)] [&>*]:fill-current",
    disabled: "[color:var(--control-foreground-color-disabled)]",
    // A caption puts a second line under the name, so the visual grows to stand against both
    withCaption: "[--leading-visual-size:var(--base-size-24)]",
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
