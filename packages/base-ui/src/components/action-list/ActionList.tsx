import * as React from "react";
import { useFocusZone } from "../../hooks/useFocusZone";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useSlots } from "../../hooks/useSlots";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ActionListHeading from "./ActionListHeading";
import { ActionListContainerContext } from "./ActionListContainerContext";
import { ActionListContext } from "./ActionListContext";
import type { ActionListProps, ActionListVariant } from "./ActionList.types";

const actionListVariants = cva("action-list", {
    variants: {
        variant: {
            inset: "action-list-inset",
            full: "action-list-full",
        } satisfies Record<ActionListVariant, string>,
        dividers: {
            true: "action-list-dividers",
            false: "",
        },
    },
});

const slotsConfig = {
    heading: ActionListHeading,
};

// The roles that are read as a list of things to move between, which is what the arrow keys
// are for
const focusZoneRoles = ["menu", "menubar", "listbox"];

// A list of actions, links or things to pick. What it is read as is the caller's to decide,
// or the container's where it has been put inside one
function ActionList<As extends React.ElementType = "ul">(
    props: ActionListProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "ul",
        className,
        children,
        variant = "inset",
        selectionVariant,
        showDividers = false,
        disableFocusZone = false,
        role,
        ...rest
    } = props as ActionListProps<React.ElementType>;

    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);
    const headingId = useId();

    const {
        listRole: listRoleFromContainer,
        listLabelledBy,
        selectionVariant: selectionVariantFromContainer,
        enableFocusZone: enableFocusZoneFromContainer,
    } = React.useContext(ActionListContainerContext);

    const listRole = role ?? listRoleFromContainer;
    // A list inside a container is told how its items are picked, unless it says so itself
    const listSelectionVariant = selectionVariant ?? selectionVariantFromContainer;
    // A list with a heading of its own is named by it; one inside a container is named by
    // whatever the container says names it
    const labelledBy = slots.heading ? (slots.heading.props.id ?? headingId) : listLabelledBy;

    const listRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, listRef);

    const enableFocusZone =
        enableFocusZoneFromContainer ??
        (listRole !== undefined && !disableFocusZone && focusZoneRoles.includes(listRole));

    useFocusZone({
        containerRef: listRef,
        disabled: !enableFocusZone,
        // A menu is read round and round; a listbox stops at either end
        wrap: listRole === "menu",
    });

    const listContextValue = React.useMemo(
        () => ({
            variant,
            selectionVariant: listSelectionVariant,
            showDividers,
            role: listRole,
            headingId,
        }),
        [variant, listSelectionVariant, showDividers, listRole, headingId],
    );

    return (
        <ActionListContext.Provider value={listContextValue}>
            {slots.heading}
            <Component
                ref={mergedRef}
                role={listRole}
                aria-labelledby={labelledBy}
                className={classNames(
                    actionListVariants({ variant, dividers: showDividers }),
                    className,
                )}
                data-component="ActionList"
                data-variant={variant}
                data-dividers={showDividers ? "" : undefined}
                {...rest}
            >
                {childrenWithoutSlots}
            </Component>
        </ActionListContext.Provider>
    );
}

ActionList.displayName = "ActionList";

export default fixedForwardRef(ActionList);
