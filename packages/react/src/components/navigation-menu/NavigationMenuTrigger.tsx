import * as React from "react";
import { ChevronDownRegular, ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { navigate } from "./navigate";
import { NavigationMenuContext, NavigationMenuItemContext } from "./NavigationMenuContext";
import type { NavigationMenuTriggerProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-trigger",
    // Says which way the panel opens: turning over as it does across a row, and pointing at the
    // panel standing beside the item down a column
    chevron: "navigation-menu-chevron",
};

// What opens an item's panel. It is a button rather than a link, since a panel is not somewhere
// to go, and the panel stands after it rather than inside it
function NavigationMenuTrigger(
    props: NavigationMenuTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        children,
        className,
        disabled: disabledProp,
        onPointerEnter,
        onPointerLeave,
        onClick,
        onKeyDown,
        ...rest
    } = props;

    const menu = React.useContext(NavigationMenuContext);
    const item = React.useContext(NavigationMenuItemContext);

    // A trigger written outside an item has nothing to open, and nothing to name it either
    if (!menu || !item) {
        return null;
    }

    const { value, isOpen, triggerId, contentId } = item;
    const disabled = disabledProp ?? item.disabled;

    // A panel that opens on the pointer is a pointer affordance. A touch screen sends one of
    // these on a tap, and a panel opened that way would stand with no pointer to move off it
    // again, so a tap is left to the press the trigger already answers
    const answersPointer = (event: React.PointerEvent<HTMLButtonElement>) =>
        !menu.disableHoverTrigger && !disabled && event.pointerType === "mouse";

    const handlePointerEnter = (event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(event);

        if (answersPointer(event)) {
            menu.openAfterDelay(value);
        }
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(event);

        if (answersPointer(event)) {
            menu.cancelOpen(value);
            menu.closeAfterDelay();
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || menu.disableClickTrigger) {
            return;
        }

        menu.toggle(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
            return;
        }

        // The key that carries on the way the row does not run: down from a row of items, and
        // along from a column of them, the way the page is read
        const entryKey =
            menu.orientation === "horizontal"
                ? "ArrowDown"
                : menu.direction === "rtl"
                  ? "ArrowLeft"
                  : "ArrowRight";

        if (event.key === entryKey) {
            // Taking the event keeps the page from scrolling away underneath the panel
            event.preventDefault();
            event.stopPropagation();
            menu.focusContent(value, "start");
            return;
        }

        const next = navigate(menu.getTopLevelElements(), event.currentTarget, {
            key: event.key,
            orientation: menu.orientation,
            direction: menu.direction,
            loop: false,
        });

        if (next) {
            next.focus();
            event.preventDefault();
            event.stopPropagation();
        }
    };

    const Chevron = menu.orientation === "horizontal" ? ChevronDownRegular : ChevronRightRegular;

    return (
        <button
            ref={ref}
            type="button"
            id={triggerId}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-controls={contentId}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.Trigger"
            data-value={value}
            data-orientation={menu.orientation}
            data-open={isOpen ? "" : undefined}
            data-disabled={disabled ? "" : undefined}
            {...rest}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            {children}
            {/* The chevron stands beside whatever the caller put here rather than in place of
                it, since only the chevron says whether the panel is open */}
            <Chevron className={classes.chevron} />
        </button>
    );
}

NavigationMenuTrigger.displayName = "NavigationMenu.Trigger";

export default React.forwardRef(NavigationMenuTrigger);
