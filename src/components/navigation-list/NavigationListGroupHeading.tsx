import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { asSlot } from "../../utilities/slot";
import { ActionList } from "../action-list";
import { groupHeadingSlot } from "../action-list/ActionListGroupHeading";
import { NavigationListHeadingLevelContext } from "./NavigationListContext";
import { headingTagForLevel } from "./headingLevel";
import type { FCWithSlotMarker } from "../../utilities/types/slots";
import type { NavigationListGroupHeadingProps } from "./NavigationList.types";

const classes = {
    root: "navigation-list-group-heading",
};

// Names a group. This is what `NavigationList.Group`'s `title` builds, and is written out instead
// wherever the heading holds more than plain text, a link say
function NavigationListGroupHeading(props: NavigationListGroupHeadingProps) {
    const { as, className, ...rest } = props;

    const headingLevel = React.useContext(NavigationListHeadingLevelContext);

    return (
        <ActionList.GroupHeading
            as={as ?? headingTagForLevel(headingLevel)}
            className={classNames(classes.root, className)}
            data-component="NavigationList.GroupHeading"
            {...rest}
        />
    );
}

NavigationListGroupHeading.displayName = "NavigationList.GroupHeading";

// Marked as the heading an `ActionList.Group` looks for, so that a group still finds this
// one among its children rather than leaving it to stand with the items
const GroupHeading: FCWithSlotMarker<NavigationListGroupHeadingProps> = asSlot(
    NavigationListGroupHeading,
    groupHeadingSlot,
);

export default GroupHeading;
