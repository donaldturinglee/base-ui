import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ClipboardContext } from "./ClipboardContext";
import type { ClipboardControlProps } from "./Clipboard.types";

const classes = {
    root: "clipboard-control",
};

// The row the value and its trigger stand in. Keeping it apart from the clipboard itself is what
// lets a name stand over the row rather than beside it, and it is the only part that has to know
// how the two are set against each other
function ClipboardControl<As extends React.ElementType = "div">(
    props: ClipboardControlProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as ClipboardControlProps<"div">;
    const { copied } = React.useContext(ClipboardContext);

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Clipboard.Control"
            data-copied={Boolean(copied)}
            {...rest}
        />
    );
}

ClipboardControl.displayName = "Clipboard.Control";

export default fixedForwardRef(ClipboardControl);
