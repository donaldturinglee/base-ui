import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { NavigationMenuContext, NavigationMenuItemContext } from "./NavigationMenuContext";
import type {
    NavigationMenuItemContextValue,
    NavigationMenuItemProps,
} from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-item",
};

// One place in the row, being either a link of its own or a trigger and the panel it opens.
// The pointer is answered here rather than on the trigger, so that a panel standing under an
// item is somewhere the pointer can travel to without the item being left on the way
function NavigationMenuItem(
    props: NavigationMenuItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        children,
        className,
        value: valueProp,
        onPointerEnter,
        onPointerLeave,
        ...rest
    } = props;

    const generatedValue = useId();
    const value = valueProp ?? generatedValue;

    const triggerId = useId();
    const contentId = useId();

    const { openValue, openOn, openAfterDelay, closeAfterDelay } =
        React.useContext(NavigationMenuContext);

    const isOpen = openValue === value;

    const handlePointerEnter = (event: React.PointerEvent<HTMLLIElement>) => {
        onPointerEnter?.(event);

        // A menu that opens on hover is a pointer affordance. A touch screen sends one of
        // these on a tap, and a panel opened that way would stand with no pointer to move off
        // it again, so a tap is left to the press the trigger already answers
        if (openOn !== "hover" || event.pointerType === "touch") {
            return;
        }

        openAfterDelay(value);
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLLIElement>) => {
        onPointerLeave?.(event);

        if (openOn !== "hover" || event.pointerType === "touch") {
            return;
        }

        closeAfterDelay();
    };

    const context = React.useMemo<NavigationMenuItemContextValue>(
        () => ({ value, triggerId, contentId, isOpen }),
        [value, triggerId, contentId, isOpen],
    );

    return (
        <NavigationMenuItemContext.Provider value={context}>
            <li
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="NavigationMenu.Item"
                data-open={isOpen ? "" : undefined}
                {...rest}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
            >
                {children}
            </li>
        </NavigationMenuItemContext.Provider>
    );
}

NavigationMenuItem.displayName = "NavigationMenu.Item";

export default React.forwardRef(NavigationMenuItem);
