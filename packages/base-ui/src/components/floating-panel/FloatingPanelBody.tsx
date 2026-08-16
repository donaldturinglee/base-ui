import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import type { FloatingPanelBodyProps } from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-body",
};

// What the panel is for. It takes the room left below the header and scrolls whatever will not fit
// in it, so that resizing a panel smaller than its contents shortens the panel rather than pushing
// the contents out through the bottom of it.
//
// A minimized panel is drawn as its header alone, which is done by taking the body away rather
// than by hiding it, so that nothing within it is left reachable by tab from a panel that is not
// showing it
function FloatingPanelBody<As extends React.ElementType = "div">(
    props: FloatingPanelBodyProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as FloatingPanelBodyProps<"div">;

    const { stage } = useFloatingPanelContext();

    if (stage === "minimized") {
        return null;
    }

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="FloatingPanel.Body"
            {...rest}
        />
    );
}

FloatingPanelBody.displayName = "FloatingPanel.Body";

export default fixedForwardRef(FloatingPanelBody);
