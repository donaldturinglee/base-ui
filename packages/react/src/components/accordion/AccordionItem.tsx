import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AccordionContext } from "./AccordionContext";
import { AccordionItemContext } from "./AccordionItemContext";
import type { AccordionItemProps } from "./Accordion.types";

const classes = {
    root: "accordion-item",
};

function AccordionItem<As extends React.ElementType = "div">(
    props: AccordionItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        value,
        disabled,
        ...rest
    } = props as AccordionItemProps<"div">;

    const {
        open,
        setOpen,
        toggle,
        disabled: accordionDisabled,
        keepMounted,
        hiddenUntilFound,
    } = React.useContext(AccordionContext);

    const uuid = useId();
    // An item that was not named stands for itself, so an accordion can be put together
    // without naming every item it holds
    const itemValue = value ?? uuid;
    const isOpen = open?.includes(itemValue) ?? false;
    const isDisabled = disabled ?? accordionDisabled ?? false;

    // A panel is on the page unless it says otherwise, which is what an item written without a
    // panel at all comes to as well
    const [isPanelPresent, setPanelPresent] = React.useState(true);

    const context = {
        headerId: `${uuid}-header`,
        panelId: `${uuid}-panel`,
        isOpen,
        disabled: isDisabled,
        // What the accordion was told about keeping its panels is settled once, for all of
        // them, rather than said again on every panel it holds
        keepMounted,
        hiddenUntilFound,
        isPanelPresent,
        setPanelPresent,
        setOpen: (nextOpen: boolean) => setOpen?.(itemValue, nextOpen),
        toggle: () => toggle?.(itemValue),
    };

    return (
        <AccordionItemContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="Accordion.Item"
                data-value={itemValue}
                data-open={isOpen}
                data-disabled={isDisabled}
                {...rest}
            />
        </AccordionItemContext.Provider>
    );
}

AccordionItem.displayName = "Accordion.Item";

export default fixedForwardRef(AccordionItem);
