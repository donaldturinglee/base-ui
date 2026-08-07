import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../utilities/classnames";
import { getInteractiveNodes } from "../../utilities/interactive";
import { NavigationMenuContext, NavigationMenuItemContext } from "./NavigationMenuContext";
import type { NavigationMenuTriggerProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-trigger",
    // Turns over as the panel opens, so that the arrow always points the way the menu will go
    // rather than the way it has been
    chevron: "navigation-menu-chevron",
};

// What opens an item's panel. It is a button rather than a link, since a panel is not
// somewhere to go, and the panel stands after it rather than inside it
function NavigationMenuTrigger(
    props: NavigationMenuTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, className, onClick, onKeyDown, ...rest } = props;

    const { setOpenValue, orientation } = React.useContext(NavigationMenuContext);
    const { value, triggerId, contentId, isOpen } = React.useContext(NavigationMenuItemContext);

    // Set where the panel was opened by a key that asks for focus to be moved into it as well,
    // so that focus is moved once the panel has been drawn rather than while it is still shut
    const enterOnOpen = React.useRef(false);

    useIsomorphicLayoutEffect(() => {
        if (!isOpen || !enterOnOpen.current) {
            return;
        }

        enterOnOpen.current = false;
        getInteractiveNodes(document.getElementById(contentId))[0]?.focus();
    }, [isOpen, contentId]);

    // A trigger written outside an item has nothing to open, and nothing to name it either
    if (!triggerId) {
        return null;
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        setOpenValue(isOpen ? null : value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        // The key that carries on the way the row does not run: down from a row of items,
        // along from a column of them
        const enterKey = orientation === "vertical" ? "ArrowRight" : "ArrowDown";

        if (event.key !== enterKey) {
            return;
        }

        // Taking the event keeps the page from scrolling away underneath the panel
        event.preventDefault();

        // Opening the panel and stepping into it are the one gesture, so a panel that was
        // still shut is opened and stepped into once it has been drawn
        if (!isOpen) {
            enterOnOpen.current = true;
            setOpenValue(value);
            return;
        }

        getInteractiveNodes(document.getElementById(contentId))[0]?.focus();
    };

    return (
        <button
            ref={ref}
            type="button"
            id={triggerId}
            aria-expanded={isOpen}
            aria-controls={contentId}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.Trigger"
            data-open={isOpen ? "" : undefined}
            {...rest}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            {children}
            {/* The chevron stands beside whatever the caller put here rather than in place of
                it, since only the chevron says whether the panel is open */}
            <ChevronDownRegular className={classes.chevron} />
        </button>
    );
}

NavigationMenuTrigger.displayName = "NavigationMenu.Trigger";

export default React.forwardRef(NavigationMenuTrigger);
