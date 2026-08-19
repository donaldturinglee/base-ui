import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { FloatingPanelHeaderProps } from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-header",
};

// The band across the top holding the title and the buttons. It is what a panel is usually dragged
// by, which is the drag trigger's job rather than the header's, so the two are written separately
// and a header that should not drag is simply left outside one
function FloatingPanelHeader<As extends React.ElementType = "div">(
    props: FloatingPanelHeaderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as FloatingPanelHeaderProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="FloatingPanel.Header"
            {...rest}
        />
    );
}

FloatingPanelHeader.displayName = "FloatingPanel.Header";

export default fixedForwardRef(FloatingPanelHeader);
