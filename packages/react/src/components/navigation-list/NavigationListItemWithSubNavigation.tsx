import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useSlots } from "../../hooks/useSlots";
import { ActionList } from "../action-list";
import { NavigationListItemWithSubNavigationContext } from "./NavigationListContext";
import type { NavigationListItemWithSubNavigationContextValue } from "./NavigationListContext";
import type { NavigationListSubNavigationProps } from "./NavigationList.types";

const classes = {
    // Turns over as the item opens, so that the arrow always points the way the list will
    // go rather than the way it has been
    chevron: "navigation-list-chevron",
};

export type NavigationListItemWithSubNavigationProps = {
    children?: React.ReactNode;
    // The list the item opens. It is held by a ref so that the item can tell whether the
    // page being read stands somewhere within it
    subNavigation: React.ReactElement<
        NavigationListSubNavigationProps & { ref?: React.Ref<HTMLUListElement> }
    >;
    defaultOpen?: boolean;
    className?: string;
};

const slotsConfig = {
    trailingVisual: ActionList.TrailingVisual,
};

// Whether the page being read stands somewhere within what was written. The tree is walked
// rather than the page, so that an item holding the current page is already open on the
// first render rather than springing open after it
const holdsCurrentItem = (node: React.ReactNode): boolean => {
    if (
        !React.isValidElement<{
            children?: React.ReactNode;
            "aria-current"?: string | boolean;
        }>(node)
    ) {
        return false;
    }

    const current = node.props["aria-current"];

    if (Boolean(current) && current !== "false") {
        return true;
    }

    return React.Children.toArray(node.props.children).some(holdsCurrentItem);
};

// An item that opens a list of its own rather than going anywhere. The row is a button, so
// the list it holds stands after that button rather than inside it
function NavigationListItemWithSubNavigation(props: NavigationListItemWithSubNavigationProps) {
    const { children, subNavigation, defaultOpen, className } = props;

    const buttonId = useId();
    const subNavigationId = useId();

    const subNavigationRef = React.useRef<HTMLUListElement>(null);
    const holdsCurrent = React.useMemo(() => holdsCurrentItem(subNavigation), [subNavigation]);

    const [isOpen, setIsOpen] = React.useState(defaultOpen ?? holdsCurrent);
    const [containsCurrent, setContainsCurrent] = React.useState(holdsCurrent);

    useIsomorphicLayoutEffect(() => {
        // The tree says which items were given `aria-current` as a prop; the page catches
        // link components that work out for themselves which page they stand for
        const current =
            holdsCurrent ||
            Boolean(
                subNavigationRef.current?.querySelector(
                    "[aria-current]:not([aria-current='false'])",
                ),
            );

        setContainsCurrent(current);

        if (current) {
            setIsOpen(true);
        }
    }, [holdsCurrent, subNavigation]);

    const contextValue = React.useMemo<NavigationListItemWithSubNavigationContextValue>(
        () => ({ buttonId, subNavigationId, isOpen }),
        [buttonId, subNavigationId, isOpen],
    );

    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);

    return (
        <NavigationListItemWithSubNavigationContext.Provider value={contextValue}>
            <ActionList.Item
                id={buttonId}
                // A closed item stands in for whatever it holds, so that a list scrolled
                // away from the current page still says where the reader is
                active={!isOpen && containsCurrent}
                aria-expanded={isOpen}
                aria-controls={subNavigationId}
                onSelect={() => setIsOpen((open) => !open)}
                className={className}
                data-component="NavigationList.Item"
            >
                {childrenWithoutSlots}
                {/* The chevron stands beside whatever the caller put here rather than in
                    place of it, since only the chevron says whether the item is open */}
                <ActionList.TrailingVisual>
                    {slots.trailingVisual?.props.children}
                    <ChevronDownRegular className={classes.chevron} />
                </ActionList.TrailingVisual>
                <ActionList.SubItem>
                    {React.cloneElement(subNavigation, { ref: subNavigationRef })}
                </ActionList.SubItem>
            </ActionList.Item>
        </NavigationListItemWithSubNavigationContext.Provider>
    );
}

NavigationListItemWithSubNavigation.displayName = "NavigationList.ItemWithSubNavigation";

export default NavigationListItemWithSubNavigation;
