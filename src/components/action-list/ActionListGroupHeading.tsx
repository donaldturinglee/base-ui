import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { asSlot } from "../../utilities/slot";
import { ActionListContext } from "./ActionListContext";
import { ActionListGroupContext } from "./ActionListGroupContext";
import type { ActionListGroupHeadingProps, ActionListGroupVariant } from "./ActionList.types";
import type { FCWithSlotMarker, SlotMarker } from "../../utilities/types/slots";

// Marks what stands as a group's heading, so that a component built on this one is still
// found by the group it is written inside rather than left among the group's items
export const groupHeadingSlot: SlotMarker = { __SLOT__: Symbol("ActionList.GroupHeading") };

const classes = {
    heading: "action-list-group-heading-label",
    auxiliary: "action-list-group-heading-auxiliary",
};

const actionListGroupHeadingVariants = cva("action-list-group-heading", {
    variants: {
        variant: {
            subtle: "",
            filled: "action-list-group-heading-filled",
        } satisfies Record<ActionListGroupVariant, string>,
    },
});

// Names the group it stands at the top of. In a plain list that is a real heading, so it
// needs a level; in a menu or a listbox there is nowhere in the accessibility tree to put
// one, so it is drawn but not read and the group is named from its text instead
function ActionListGroupHeading(props: ActionListGroupHeadingProps) {
    const { as, className, children, variant = "subtle", auxiliaryText, ...rest } = props;
    const { role: listRole } = React.useContext(ActionListContext);
    const { groupHeadingId } = React.useContext(ActionListGroupContext);

    const isPresentational = listRole !== undefined && listRole !== "list";
    const Component = as ?? "h3";

    return (
        <div
            className={classNames(actionListGroupHeadingVariants({ variant }))}
            data-component="ActionList.GroupHeading"
            data-variant={variant}
            {...(isPresentational ? { role: "presentation", "aria-hidden": true } : {})}
        >
            {isPresentational ? (
                <span
                    id={groupHeadingId}
                    className={classNames(classes.heading, className)}
                    {...rest}
                >
                    {children}
                </span>
            ) : (
                <Component
                    id={groupHeadingId}
                    className={classNames(classes.heading, className)}
                    {...rest}
                >
                    {children}
                </Component>
            )}
            {auxiliaryText ? <div className={classes.auxiliary}>{auxiliaryText}</div> : null}
        </div>
    );
}

ActionListGroupHeading.displayName = "ActionList.GroupHeading";

const GroupHeading: FCWithSlotMarker<ActionListGroupHeadingProps> = asSlot(
    ActionListGroupHeading,
    groupHeadingSlot,
);

export default GroupHeading;
