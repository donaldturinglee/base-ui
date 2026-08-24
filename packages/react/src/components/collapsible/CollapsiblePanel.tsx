import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CollapsibleContext } from "./CollapsibleContext";
import type { CollapsiblePanelProps } from "./Collapsible.types";

const classes = {
    root: "collapsible-panel",
};

// How tall the panel runs out to as it opens. Only the content knows, so it is measured from the
// panel rather than asked for, and handed to the stylesheet as a property so that the animation
// has a number to run to. It is put on the element itself rather than passed as a style, so a
// caller's own `style` is left alone and the measurement is in place before the first paint
const heightProperty = "--collapsible-panel-height";

// What the disclosure holds. It stays on the page while it is closed, so that the trigger always
// has something to point at, and is hidden rather than thrown away; a caller that would rather
// not draw it at all until it is asked for says so with `keepMounted`
function CollapsiblePanel<As extends React.ElementType = "div">(
    props: CollapsiblePanelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        keepMounted = true,
        hiddenUntilFound = false,
        ...rest
    } = props as CollapsiblePanelProps<"div">;
    const { panelId, isOpen, setOpen, setPanelPresent } = React.useContext(CollapsibleContext);

    const panelRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, panelRef);

    // A panel the browser is to find in has to be there to be found in, so being findable keeps
    // it on the page whatever it was told about being kept
    const isPresent = keepMounted || hiddenUntilFound || Boolean(isOpen);

    // The trigger points at the panel by name, so it is told when there is nothing at the other
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

    // What find-in-page turned up is opened properly rather than left showing inside a panel
    // that still says it is closed
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
            hidden={!isOpen}
            className={classNames(classes.root, className)}
            data-component="Collapsible.Panel"
            data-open={Boolean(isOpen)}
            {...rest}
        />
    );
}

CollapsiblePanel.displayName = "Collapsible.Panel";

export default fixedForwardRef(CollapsiblePanel);
