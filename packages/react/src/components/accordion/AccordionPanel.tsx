import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AccordionItemContext } from "./AccordionItemContext";
import type { AccordionPanelProps } from "./Accordion.types";

const classes = {
    root: "accordion-panel",
};

// How tall the panel runs out to as it opens. Only the content knows, so it is measured from the
// panel rather than asked for, and handed to the stylesheet as a property so that the animation
// has a number to run to. It is put on the element itself rather than passed as a style, so a
// caller's own `style` is left alone and the measurement is in place before the first paint
const heightProperty = "--accordion-panel-height";

function AccordionPanel<As extends React.ElementType = "div">(
    props: AccordionPanelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as AccordionPanelProps<"div">;
    const { headerId, panelId, isOpen, keepMounted, hiddenUntilFound, setOpen, setPanelPresent } =
        React.useContext(AccordionItemContext);

    const panelRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, panelRef);

    // A panel the browser is to find in has to be there to be found in, so being findable keeps
    // it on the page whatever the accordion said about keeping it
    const isPresent = (keepMounted ?? true) || Boolean(hiddenUntilFound) || Boolean(isOpen);

    // The header points at the panel by name, so it is told when there is nothing at the other
    // end of the name to point at
    useIsomorphicLayoutEffect(() => {
        setPanelPresent?.(isPresent);

        return () => setPanelPresent?.(false);
    }, [isPresent, setPanelPresent]);

    // Measured once the panel is open and on the page, which is where it has a height to be
    // measured at: a hidden panel is drawn by nothing and measures nothing
    useIsomorphicLayoutEffect(() => {
        const panel = panelRef.current;

        if (!panel || !isOpen) {
            return;
        }

        panel.style.setProperty(heightProperty, `${panel.scrollHeight}px`);
    }, [isOpen]);

    // React writes `hidden` as a flag and has no room for the value that leaves the panel where
    // the browser's own find-in-page can still reach it, so it is written back onto the element
    useIsomorphicLayoutEffect(() => {
        const panel = panelRef.current;

        if (!panel || !hiddenUntilFound || isOpen) {
            return;
        }

        panel.setAttribute("hidden", "until-found");
    }, [hiddenUntilFound, isOpen]);

    // What find-in-page turned up opens the item it was found in rather than being left showing
    // inside a panel that still says it is closed
    React.useEffect(() => {
        const panel = panelRef.current;

        if (!panel || !hiddenUntilFound) {
            return;
        }

        const handleBeforeMatch = () => setOpen?.(true);

        panel.addEventListener("beforematch", handleBeforeMatch);

        return () => panel.removeEventListener("beforematch", handleBeforeMatch);
    }, [hiddenUntilFound, setOpen]);

    if (!isPresent) {
        return null;
    }

    return (
        <Component
            ref={mergedRef}
            id={panelId}
            // The panel stays on the page while it is closed, so that the header always has
            // something to point at, and is hidden rather than thrown away
            hidden={!isOpen}
            role="region"
            aria-labelledby={headerId}
            className={classNames(classes.root, className)}
            data-component="Accordion.Panel"
            data-open={Boolean(isOpen)}
            {...rest}
        />
    );
}

AccordionPanel.displayName = "Accordion.Panel";

export default fixedForwardRef(AccordionPanel);
