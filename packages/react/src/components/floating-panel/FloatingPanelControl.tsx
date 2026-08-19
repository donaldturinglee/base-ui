import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { FloatingPanelControlProps } from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-control",
};

// The row of buttons at the end of the header. A press that lands on one of them is a press of
// that button rather than the start of a drag, which the drag trigger settles by looking at what
// was pressed, so there is nothing for this to do beyond standing them in a row
function FloatingPanelControl<As extends React.ElementType = "div">(
    props: FloatingPanelControlProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as FloatingPanelControlProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="FloatingPanel.Control"
            {...rest}
        />
    );
}

FloatingPanelControl.displayName = "FloatingPanel.Control";

export default fixedForwardRef(FloatingPanelControl);
