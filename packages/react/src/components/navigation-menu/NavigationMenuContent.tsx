import * as React from "react";
import { createPortal } from "react-dom";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { navigate } from "./navigate";
import { NavigationMenuContext, NavigationMenuItemContext } from "./NavigationMenuContext";
import { focusFirst, getTabbables } from "./tabOrder";
import type { NavigationMenuContentProps } from "./NavigationMenu.types";

const navigationMenuContentVariants = cva("navigation-menu-content", {
    variants: {
        // A panel standing under its item arrives from the edge of the item, which says where it
        // came from, and one standing beside its item from the item's side. The classes are only
        // carried while it is open, so the panel plays this each time it is shown rather than
        // once when the menu was drawn. A panel drawn in the viewport is left alone: the
        // viewport arrives once, and after that each panel slides in from the way it came
        open: {
            true: "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short motion-safe:data-[orientation=horizontal]:slide-in-from-top-1 motion-safe:data-[orientation=vertical]:slide-in-from-left-1 motion-safe:data-[orientation=vertical]:rtl:slide-in-from-right-1",
            false: "",
        },
    },
});

const classes = {
    // The stand-in the panel leaves behind in the row while it is drawn in the viewport, so that
    // a screen reader still finds the panel after the trigger that opens it
    viewportProxy: "navigation-menu-viewport-proxy",
    // The stop the tab key lands on after the trigger, which steps into the panel wherever on the
    // page it has been drawn. It is kept from a screen reader, since it is a stop and not a thing
    triggerProxy: "navigation-menu-trigger-proxy sr-only",
};

// The panel an item opens. It is drawn whether or not it is open, so that the trigger has
// something to point at either way, and while it is shut it is taken out of the page rather
// than only hidden, so nothing inside it can still be tabbed to or read out.
//
// Where it stands follows the menu. In a row it is a surface under its item, and in a column
// one beside it. A menu drawing its panels in a viewport has each panel carried off into the
// viewport instead, and leaves two stand-ins behind in the row: one that keeps the panel after
// its trigger for a screen reader, and one the tab key lands on to step into it
function NavigationMenuContent<As extends React.ElementType = "div">(
    props: NavigationMenuContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        children,
        onPointerEnter,
        onPointerLeave,
        onKeyDown,
        ...rest
    } = props as NavigationMenuContentProps<"div">;

    const menu = React.useContext(NavigationMenuContext);
    const item = React.useContext(NavigationMenuItemContext);

    // A panel with nothing to open it has nothing to name it either, so there is nothing worth
    // drawing
    if (!menu || !item) {
        return null;
    }

    const { value, isOpen, triggerId, contentId, triggerProxyId } = item;
    const viewport = menu.viewport?.node ?? null;

    // A pointer resting on the panel keeps it standing, and one leaving it starts the wait
    // before it is put away. Only a mouse counts as resting: a finger is lifted rather than
    // moved off, and a menu that does not open on the pointer does not close on it either
    const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerEnter?.(event);

        if (event.pointerType === "mouse") {
            menu.cancelClose();
        }
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event);

        if (
            event.pointerType === "mouse" &&
            !menu.disableHoverTrigger &&
            !menu.disablePointerLeaveClose
        ) {
            menu.closeAfterDelay();
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        const candidates = getTabbables(event.currentTarget);
        const active = document.activeElement as HTMLElement | null;
        const isMetaKey = event.altKey || event.ctrlKey || event.metaKey;

        // The tab key moves through the panel on its own, so that a panel drawn in the viewport
        // is stepped through as though it stood where its trigger does. At either end it is
        // handed to the stop after the trigger, and left to carry on from there
        if (event.key === "Tab" && !isMetaKey) {
            const index = active ? candidates.indexOf(active) : -1;
            const next = event.shiftKey
                ? candidates.slice(0, index).reverse()
                : candidates.slice(index + 1);

            if (focusFirst(next)) {
                event.preventDefault();
            } else {
                menu.getTriggerProxyElement(value)?.focus();
            }

            return;
        }

        // The arrows step through the panel only from the panel itself, for a caller who made
        // it something focus can land on. From anything inside it they are that thing's own
        if (event.target !== event.currentTarget) {
            return;
        }

        const next = navigate(candidates, active, {
            key: event.key,
            direction: menu.direction,
            loop: false,
        });

        if (next) {
            next.focus();
            event.preventDefault();
            event.stopPropagation();
        }
    };

    // Stepping onto the stop after the trigger steps into the panel: from its start where the
    // stop was reached from the trigger, and from its end where it was reached from further on.
    // Reached from inside the panel, it is focus on its way out, and is left to carry on
    const handleProxyFocus = (event: React.FocusEvent<HTMLDivElement>) => {
        const content = menu.getContentElement(value);
        const previous = event.relatedTarget;

        if (!content) {
            return;
        }

        const fromTrigger = previous === menu.getTriggerElement(value);
        const fromContent = previous instanceof Node && content.contains(previous);

        if (fromTrigger || !fromContent) {
            menu.focusContent(value, fromTrigger ? "start" : "end");
        }
    };

    const content = (
        <Component
            ref={ref}
            id={contentId}
            hidden={!isOpen}
            aria-labelledby={triggerId}
            className={classNames(
                navigationMenuContentVariants({ open: isOpen && viewport === null }),
                className,
            )}
            data-component="NavigationMenu.Content"
            data-value={value}
            data-orientation={menu.orientation}
            data-open={isOpen ? "" : undefined}
            data-motion={isOpen && viewport ? (menu.motion ?? undefined) : undefined}
            {...rest}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onKeyDown={handleKeyDown}
        >
            {children}
        </Component>
    );

    if (!viewport) {
        return content;
    }

    return (
        <>
            <div
                hidden={!isOpen}
                aria-owns={isOpen ? contentId : undefined}
                className={classes.viewportProxy}
                data-component="NavigationMenu.ViewportProxy"
            />
            <div
                id={triggerProxyId}
                hidden={!isOpen}
                aria-hidden="true"
                tabIndex={0}
                className={classes.triggerProxy}
                data-component="NavigationMenu.TriggerProxy"
                data-trigger-id={triggerId}
                onFocus={handleProxyFocus}
            />
            {createPortal(content, viewport)}
        </>
    );
}

NavigationMenuContent.displayName = "NavigationMenu.Content";

export default fixedForwardRef(NavigationMenuContent);
