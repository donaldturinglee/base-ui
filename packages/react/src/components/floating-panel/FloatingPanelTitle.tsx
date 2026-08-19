import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import type { FloatingPanelTitleProps } from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-title",
};

// Names the panel to a screen reader as well as titling it, which is what the content points at
function FloatingPanelTitle<As extends React.ElementType = "h2">(
    props: FloatingPanelTitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h2", className, ...rest } = props as FloatingPanelTitleProps<"h2">;

    const { titleId } = useFloatingPanelContext();

    return (
        <Component
            ref={ref}
            id={titleId}
            className={classNames(classes.root, className)}
            data-component="FloatingPanel.Title"
            {...rest}
        />
    );
}

FloatingPanelTitle.displayName = "FloatingPanel.Title";

export default fixedForwardRef(FloatingPanelTitle);
