import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AccordionItemContext } from "./AccordionItemContext";
import type { AccordionPanelProps } from "./Accordion.types";

const classes = {
    root: "accordion-panel",
    // The panel eases in behind the header rather than appearing under it all at once. There
    // is nothing to see on the way out, since a closed panel is taken off the page
    open: "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-short",
};

function AccordionPanel<As extends React.ElementType = "div">(
    props: AccordionPanelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as AccordionPanelProps<"div">;
    const { headerId, panelId, isOpen } = React.useContext(AccordionItemContext);

    return (
        <Component
            ref={ref}
            id={panelId}
            // The panel stays on the page while it is closed, so that the header always has
            // something to point at, and is hidden rather than thrown away
            hidden={!isOpen}
            role="region"
            aria-labelledby={headerId}
            className={classNames(classes.root, isOpen && classes.open, className)}
            data-component="Accordion.Panel"
            data-open={Boolean(isOpen)}
            {...rest}
        />
    );
}

AccordionPanel.displayName = "Accordion.Panel";

export default fixedForwardRef(AccordionPanel);
