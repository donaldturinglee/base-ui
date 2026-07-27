import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AccordionContext } from "./AccordionContext";
import { AccordionItemContext } from "./AccordionItemContext";
import type { AccordionHeaderProps } from "./Accordion.types";

const classes = {
    // The heading is there for the outline rather than for the look, so it takes its type
    // from the button inside it
    heading: "m-0 [font-size:inherit] [font-weight:inherit]",
    button: "flex items-center justify-between gap-[var(--base-size-8)] w-full m-0 py-[var(--base-size-12)] px-[var(--base-size-8)] text-start cursor-pointer appearance-none bg-transparent border-0 rounded-[var(--border-radius-medium)] [color:var(--foreground-color-default)] [font-family:inherit] [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)] [line-height:var(--text-body-line-height-medium)] transition-[background-color] duration-[var(--motion-duration-micro)] ease-[var(--motion-easing-hover)] hover:bg-[var(--control-transparent-background-color-hover)]",
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]",
    disabled:
        "cursor-not-allowed [color:var(--control-foreground-color-disabled)] hover:bg-transparent",
    label: "min-w-0",
    // The chevron turns over to point back the way the panel came from
    indicator:
        "shrink-0 size-[var(--base-size-16)] [color:var(--foreground-color-muted)] transition-transform duration-[var(--motion-duration-short)] ease-[var(--motion-easing-move)] motion-reduce:transition-none",
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
                className={classNames(
                    classes.button,
                    classes.focus,
                    disabled && classes.disabled,
                    className,
                )}
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
