import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { FormControlContext } from "../form-control/FormControlContext";
import { useFormControlForwardedProps } from "../form-control/useFormControlForwardedProps";
import type { SelectPanelButtonProps } from "./SelectPanel.types";

// The button that opens the panel. It is taken out of the panel's children and rendered
// where the panel itself stands, so the panel can wire it up as its anchor
function SelectPanelButton(
    props: SelectPanelButtonProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    // A button is not something a `label` can name, so the field it stands in only hands it
    // an id and whatever describes it. Nor can a button be required, so what the field says
    // about that is left off it
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { required: _required, ...buttonProps } = useFormControlForwardedProps(rest);
    const { labelId } = React.useContext(FormControlContext);
    const contentId = useId();

    return (
        <Button
            ref={ref}
            type="button"
            // Named by what is written on it and by the field it stands in, read in that
            // order
            aria-labelledby={labelId ? `${contentId} ${labelId}` : undefined}
            className={classNames(className)}
            data-component="SelectPanel.Button"
            {...buttonProps}
        >
            {labelId ? <span id={contentId}>{children}</span> : children}
        </Button>
    );
}

SelectPanelButton.displayName = "SelectPanel.Button";

export default fixedForwardRef(SelectPanelButton);
