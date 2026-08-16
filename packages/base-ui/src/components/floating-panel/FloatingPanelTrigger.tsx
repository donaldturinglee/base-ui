import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import type { FloatingPanelTriggerProps } from "./FloatingPanel.types";

const classes = {
    root: "floating-panel-trigger",
};

// What opens the panel. It says what it controls and whether that is showing, so a reader is told
// what pressing it did without having to go looking for the panel
function FloatingPanelTrigger(
    props: FloatingPanelTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onClick, ...rest } = props;
    const { open, setOpen, triggerId, contentId } = useFloatingPanelContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (event.defaultPrevented) {
            return;
        }

        setOpen(!open);
    };

    return (
        <button
            ref={ref}
            type="button"
            id={triggerId}
            className={classNames(classes.root, className)}
            onClick={handleClick}
            aria-expanded={open}
            aria-controls={open ? contentId : undefined}
            data-component="FloatingPanel.Trigger"
            data-open={open ? "" : undefined}
            {...rest}
        />
    );
}

FloatingPanelTrigger.displayName = "FloatingPanel.Trigger";

export default fixedForwardRef(FloatingPanelTrigger);
