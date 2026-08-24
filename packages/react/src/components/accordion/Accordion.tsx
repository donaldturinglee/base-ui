import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AccordionContext } from "./AccordionContext";
import type { AccordionProps } from "./Accordion.types";

const classes = {
    root: "accordion",
};

// A set of disclosures that open and close together. One standing on its own is a Collapsible
// instead.
//
// The headers are ordinary tab stops rather than one stop the arrow keys move within. The APG
// pattern called for the second until the arrow keys were taken back out of it, on the grounds
// that a set of buttons already reads as a set of buttons and moving between them by arrow was
// a rule a reader had to be told rather than one they could guess
function Accordion<As extends React.ElementType = "div">(
    props: AccordionProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        value,
        defaultValue,
        onChange,
        multiple = false,
        disabled,
        headingLevel = "h3",
        keepMounted = true,
        hiddenUntilFound = false,
        ...rest
    } = props as AccordionProps<"div">;

    // An accordion the caller is holding the state of takes what is open from the prop; one
    // that is not keeps its own
    const isControlled = value !== undefined;
    const [selfValue, setSelfValue] = React.useState(() => defaultValue ?? []);
    const open = isControlled ? value : selfValue;

    const setOpen = (itemValue: string, nextOpen: boolean) => {
        if (disabled) {
            return;
        }

        const isOpen = open.includes(itemValue);

        if (isOpen === nextOpen) {
            return;
        }

        const next = !nextOpen
            ? open.filter((entry) => entry !== itemValue)
            : multiple
              ? [...open, itemValue]
              : // Only one item stands open at a time, so opening one closes the rest
                [itemValue];

        if (!isControlled) {
            setSelfValue(next);
        }

        onChange?.(next);
    };

    const context = {
        open,
        setOpen,
        toggle: (itemValue: string) => setOpen(itemValue, !open.includes(itemValue)),
        disabled,
        headingLevel,
        keepMounted,
        hiddenUntilFound,
    };

    return (
        <AccordionContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="Accordion"
                data-multiple={multiple}
                data-disabled={Boolean(disabled)}
                {...rest}
            />
        </AccordionContext.Provider>
    );
}

Accordion.displayName = "Accordion";

export default fixedForwardRef(Accordion);
