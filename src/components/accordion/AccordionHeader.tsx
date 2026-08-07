import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AccordionContext } from "./AccordionContext";
import { AccordionItemContext } from "./AccordionItemContext";
import type { AccordionHeaderProps } from "./Accordion.types";

const classes = {
    heading: "accordion-header",
    button: "accordion-header-button",
    disabled: "accordion-header-button-disabled",
    label: "min-w-0",
    indicator: "accordion-header-indicator",
    indicatorOpen: "rotate-180",
};

function AccordionHeader(
    props: AccordionHeaderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, headingLevel, ...rest } = props;
    const { headingLevel: accordionHeadingLevel } = React.useContext(AccordionContext);
    const { headerId, panelId, isOpen, disabled, toggle } = React.useContext(AccordionItemContext);

    const Heading = headingLevel ?? accordionHeadingLevel ?? "h3";

    return (
        <Heading className={classes.heading} data-component="Accordion.Header">
            <button
                ref={ref}
                type="button"
                id={headerId}
                className={classNames(classes.button, disabled && classes.disabled, className)}
                onClick={toggle}
                disabled={disabled}
                aria-expanded={Boolean(isOpen)}
                aria-controls={panelId}
                data-component="Accordion.HeaderButton"
                data-open={Boolean(isOpen)}
                {...rest}
            >
                <span className={classes.label}>{children}</span>
                <ChevronDownRegular
                    className={classNames(classes.indicator, isOpen && classes.indicatorOpen)}
                    aria-hidden="true"
                />
            </button>
        </Heading>
    );
}

AccordionHeader.displayName = "Accordion.Header";

export default fixedForwardRef(AccordionHeader);
