import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CollapsibleContext } from "./CollapsibleContext";
import type { CollapsibleContentProps } from "./Collapsible.types";

const classes = {
    root: "collapsible-content",
    // The content eases in behind the trigger rather than appearing under it all at once.
    // There is nothing to see on the way out, since closed content is taken off the page
    open: "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-short",
};

// What the disclosure holds. It stays on the page while it is closed, so that the trigger
// always has something to point at, and is hidden rather than thrown away
function CollapsibleContent<As extends React.ElementType = "div">(
    props: CollapsibleContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as CollapsibleContentProps<"div">;
    const { contentId, isOpen } = React.useContext(CollapsibleContext);

    return (
        <Component
            ref={ref}
            id={contentId}
            hidden={!isOpen}
            className={classNames(classes.root, isOpen && classes.open, className)}
            data-component="Collapsible.Content"
            data-open={Boolean(isOpen)}
            {...rest}
        />
    );
}

CollapsibleContent.displayName = "Collapsible.Content";

export default fixedForwardRef(CollapsibleContent);
