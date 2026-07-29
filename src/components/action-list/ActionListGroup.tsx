import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import ActionListGroupHeading from "./ActionListGroupHeading";
import { ActionListContext } from "./ActionListContext";
import { ActionListGroupContext } from "./ActionListGroupContext";
import type { ActionListGroupProps } from "./ActionList.types";

const classes = {
    root: "list-none",
    list: "list-none m-0 p-0",
};

const slotsConfig = {
    groupHeading: ActionListGroupHeading,
};

// Collects related items together under a heading of their own. The items keep the list
// they are in, so the group is a list within a list rather than a list of its own
function ActionListGroup(props: React.PropsWithChildren<ActionListGroupProps>) {
    const { className, children, selectionVariant, role, "aria-label": ariaLabel, ...rest } = props;

    const generatedId = useId();
    const { role: listRole } = React.useContext(ActionListContext);
    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);

    const groupHeadingId = slots.groupHeading
        ? (slots.groupHeading.props.id ?? generatedId)
        : undefined;

    const groupContextValue = React.useMemo(
        () => ({ selectionVariant, groupHeadingId }),
        [selectionVariant, groupHeadingId],
    );

    // A heading inside a menu or a listbox is hidden from the accessibility tree, so what it
    // says is given to the group as a name instead
    const headingText =
        listRole && typeof slots.groupHeading?.props.children === "string"
            ? slots.groupHeading.props.children
            : undefined;

    return (
        <li
            className={classNames(classes.root, className)}
            data-component="ActionList.Group"
            role={listRole ? "none" : undefined}
            {...rest}
        >
            <ActionListGroupContext.Provider value={groupContextValue}>
                {slots.groupHeading}
                <ul
                    className={classes.list}
                    role={role ?? (listRole ? "group" : undefined)}
                    aria-labelledby={listRole ? undefined : groupHeadingId}
                    aria-label={ariaLabel ?? headingText}
                >
                    {childrenWithoutSlots}
                </ul>
            </ActionListGroupContext.Provider>
        </li>
    );
}

ActionListGroup.displayName = "ActionList.Group";

export default ActionListGroup;
