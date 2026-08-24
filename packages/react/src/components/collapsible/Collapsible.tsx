import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CollapsibleContext } from "./CollapsibleContext";
import type { CollapsibleProps } from "./Collapsible.types";

const classes = {
    root: "block",
};

// A disclosure standing on its own: something to press, and content that is only there once
// it has been pressed. A set of these that open and close together is an Accordion instead
function Collapsible<As extends React.ElementType = "div">(
    props: CollapsibleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        open,
        defaultOpen,
        disabled,
        onChange,
        ...rest
    } = props as CollapsibleProps<"div">;

    const uuid = useId();

    // A disclosure the caller is holding the state of takes whether it is open from the prop;
    // one that is not keeps its own
    const isControlled = open !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(Boolean(defaultOpen));
    const isOpen = isControlled ? open : selfOpen;

    // A panel is on the page unless it says otherwise, which is what one written without a
    // panel at all comes to as well
    const [isPanelPresent, setPanelPresent] = React.useState(true);

    const setOpen = (next: boolean) => {
        if (disabled) {
            return;
        }

        if (!isControlled) {
            setSelfOpen(next);
        }

        onChange?.(next);
    };

    const context = {
        triggerId: `${uuid}-trigger`,
        panelId: `${uuid}-panel`,
        isOpen,
        disabled: Boolean(disabled),
        isPanelPresent,
        setPanelPresent,
        setOpen,
        toggle: () => setOpen(!isOpen),
    };

    return (
        <CollapsibleContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="Collapsible"
                data-open={isOpen}
                data-disabled={Boolean(disabled)}
                {...rest}
            />
        </CollapsibleContext.Provider>
    );
}

Collapsible.displayName = "Collapsible";

export default fixedForwardRef(Collapsible);
