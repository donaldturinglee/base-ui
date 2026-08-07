import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { NavigationMenuContext } from "./NavigationMenuContext";
import type { NavigationMenuListProps, NavigationMenuOrientation } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-list",
};

// The triggers and links the arrow keys move between, in the order they are written and so in
// the order they are read down the page.
//
// In a row, what a panel holds is left out: the panel stands over the page, and is reached by
// opening it rather than by moving along the row. In a column the panel is drawn in the flow
// under the item that opened it, so what it holds stands in the column as well and the keys
// run straight on through it, the way they would down a navigation list. Either way what a
// shut panel holds is left out, since a panel that is shut is not on the page to be moved to,
// and a disabled item is passed over rather than landed on
const getFocusableItems = (list: HTMLElement, orientation: NavigationMenuOrientation) =>
    Array.from(
        list.querySelectorAll<HTMLElement>(
            "[data-component='NavigationMenu.Trigger'], [data-component='NavigationMenu.Link']",
        ),
    ).filter((item) => {
        const panel = item.closest("[data-component='NavigationMenu.Content']");

        if (panel && (orientation === "horizontal" || panel.hasAttribute("hidden"))) {
            return false;
        }

        return !item.hasAttribute("disabled") && item.getAttribute("aria-disabled") !== "true";
    });

// The row the items stand in, and what answers the keys that move between them
function NavigationMenuList(
    props: NavigationMenuListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, className, onKeyDown, ...rest } = props;

    const { orientation, openValue, setOpenValue } = React.useContext(NavigationMenuContext);

    const listRef = React.useRef<HTMLUListElement>(null);
    const mergedRef = useMergedRefs(ref, listRef);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
        onKeyDown?.(event);

        const list = listRef.current;

        if (event.defaultPrevented || !list) {
            return;
        }

        // Standing the items in a column rather than a row turns the keys onto the other axis
        const isVertical = orientation === "vertical";
        const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
        const previousKey = isVertical ? "ArrowUp" : "ArrowLeft";

        // Down a column the keys that run across it are left over, and the one pointing back
        // the way the panel opened folds it away again, as it would a sub-list
        if (isVertical && event.key === "ArrowLeft") {
            const active = document.activeElement;

            if (openValue === null || !(active instanceof HTMLElement) || !list.contains(active)) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            const panel = active.closest("[data-component='NavigationMenu.Content']");

            // From inside the panel focus goes back to the trigger that opened it, before the
            // panel is folded away from under it
            panel
                ?.closest("li")
                ?.querySelector<HTMLElement>("[data-component='NavigationMenu.Trigger']")
                ?.focus();

            setOpenValue(null);
            return;
        }

        const toEdge = event.key === "Home" || event.key === "End";
        const step = event.key === nextKey ? 1 : event.key === previousKey ? -1 : 0;

        if (step === 0 && !toEdge) {
            return;
        }

        const items = getFocusableItems(list, orientation);
        const current = items.indexOf(document.activeElement as HTMLElement);

        // Only while focus is on something the keys move between. Anywhere else these are
        // whatever the panel holds makes of them, a text field or a list of its own say
        if (current === -1) {
            return;
        }

        // The keys belong to the menu rather than to the page around it
        event.preventDefault();
        event.stopPropagation();

        // A panel standing over the page belongs to the item it was opened from, so moving on
        // along the row takes it away again. One standing in the flow of a column is part of
        // the column being moved down, so it is left where it is
        if (!isVertical && openValue !== null) {
            setOpenValue(null);
        }

        if (toEdge) {
            items[event.key === "Home" ? 0 : items.length - 1].focus();
            return;
        }

        // Moving on from the last item wraps round to the first
        items[(current + step + items.length) % items.length].focus();
    };

    return (
        <ul
            ref={mergedRef}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.List"
            data-orientation={orientation}
            {...rest}
            onKeyDown={handleKeyDown}
        >
            {children}
        </ul>
    );
}

NavigationMenuList.displayName = "NavigationMenu.List";

export default React.forwardRef(NavigationMenuList);
