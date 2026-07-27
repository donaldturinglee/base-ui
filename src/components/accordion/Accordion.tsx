import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AccordionContext } from "./AccordionContext";
import type { AccordionProps } from "./Accordion.types";

const classes = {
    // A rule above the first item, with each item carrying the one below it, closes the set off
    root: "block border-t-[length:var(--border-width-thin)] border-t-[color:var(--border-color-muted)]",
};

const accordionSelector = "[data-component='Accordion']";
const headerSelector = "[data-component='Accordion.HeaderButton']:not([disabled])";

// The headers the arrow keys move between. An accordion inside a panel keeps its own headers
// to itself, so the keys never carry a reader out of the set they are working through
const getHeaders = (root: HTMLElement | null) =>
    root
        ? Array.from(root.querySelectorAll<HTMLElement>(headerSelector)).filter(
              (header) => header.closest(accordionSelector) === root,
          )
        : [];

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
        onKeyDown,
        ...rest
    } = props as AccordionProps<"div">;

    const rootRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);

    // An accordion the caller is holding the state of takes what is open from the prop; one
    // that is not keeps its own
    const isControlled = value !== undefined;
    const [selfValue, setSelfValue] = React.useState(() => defaultValue ?? []);
    const open = isControlled ? value : selfValue;

    const toggle = (itemValue: string) => {
        const next = open.includes(itemValue)
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        const toEdge = event.key === "Home" || event.key === "End";

        // An accordion nested in a panel answers the key first, so the one around it stands
        // aside once the move has been made
        if (event.defaultPrevented || (step === 0 && !toEdge)) {
            return;
        }

        const headers = getHeaders(rootRef.current);
        const current = headers.indexOf(document.activeElement as HTMLElement);

        if (current === -1) {
            return;
        }

        event.preventDefault();
        // Moving on from the last header wraps round to the first
        (toEdge
            ? headers[event.key === "Home" ? 0 : headers.length - 1]
            : headers[(current + step + headers.length) % headers.length]
        ).focus();
    };

    return (
        <AccordionContext.Provider value={{ open, toggle, disabled, headingLevel }}>
            <Component
                ref={mergedRef}
                className={classNames(classes.root, className)}
                onKeyDown={handleKeyDown}
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
