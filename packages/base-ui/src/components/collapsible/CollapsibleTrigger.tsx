import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CollapsibleContext } from "./CollapsibleContext";
import type { CollapsibleTriggerProps } from "./Collapsible.types";

const classes = {
    root: "collapsible-trigger",
    disabled: "collapsible-trigger-disabled",
    // A chevron at the end is pushed there by the label, which takes the room between them
    labelEnd: "min-w-0 grow",
    label: "min-w-0",
    indicator: "collapsible-trigger-indicator",
    // A chevron after the label turns over to point back the way the content came from
    indicatorOpen: "rotate-180",
    // One before the label points at what it opens, and turns down onto it
    indicatorStart: "-rotate-90",
    indicatorStartOpen: "rotate-0",
};

// What opens and closes the disclosure. It says what it controls and whether that is open, so
// a reader is told what pressing it did without having to go looking
function CollapsibleTrigger(
    props: CollapsibleTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, indicator = "end", onClick, ...rest } = props;
    const { triggerId, contentId, isOpen, disabled, toggle } = React.useContext(CollapsibleContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A caller that has answered the press itself is left to it
        if (event.defaultPrevented) {
            return;
        }

        toggle?.();
    };

    const chevron =
        indicator === "none" ? null : (
            <ChevronDownRegular
                className={classNames(
                    classes.indicator,
                    indicator === "start"
                        ? isOpen
                            ? classes.indicatorStartOpen
                            : classes.indicatorStart
                        : isOpen && classes.indicatorOpen,
                )}
                aria-hidden="true"
            />
        );

    return (
        <button
            ref={ref}
            type="button"
            id={triggerId}
            className={classNames(classes.root, disabled && classes.disabled, className)}
            onClick={handleClick}
            disabled={disabled}
            aria-expanded={Boolean(isOpen)}
            aria-controls={contentId}
            data-component="Collapsible.Trigger"
            data-open={Boolean(isOpen)}
            data-indicator={indicator}
            {...rest}
        >
            {indicator === "start" ? chevron : null}
            <span className={indicator === "end" ? classes.labelEnd : classes.label}>
                {children}
            </span>
            {indicator === "end" ? chevron : null}
        </button>
    );
}

CollapsibleTrigger.displayName = "Collapsible.Trigger";

export default fixedForwardRef(CollapsibleTrigger);
