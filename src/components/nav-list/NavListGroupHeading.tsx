import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { asSlot } from "../../utilities/slot";
import { ActionList } from "../action-list";
import { groupHeadingSlot } from "../action-list/ActionListGroupHeading";
import { NavListHeadingLevelContext } from "./NavListContext";
import { headingTagForLevel } from "./headingLevel";
import type { FCWithSlotMarker } from "../../utilities/types/slots";
import type { NavListGroupHeadingProps } from "./NavList.types";

const classes = {
    // A heading that is a link is still read as a heading, so it is left looking like one
    // until it is reached for
    root: "[&_a]:[color:inherit] [&_a]:[text-decoration:inherit] [&_a:hover]:underline",
};

// Names a group. This is what `NavList.Group`'s `title` builds, and is written out instead
// wherever the heading holds more than plain text, a link say
function NavListGroupHeading(props: NavListGroupHeadingProps) {
    const { as, className, ...rest } = props;

    const headingLevel = React.useContext(NavListHeadingLevelContext);

    return (
        <ActionList.GroupHeading
            as={as ?? headingTagForLevel(headingLevel)}
            className={classNames(classes.root, className)}
            data-component="NavList.GroupHeading"
            {...rest}
        />
    );
}

NavListGroupHeading.displayName = "NavList.GroupHeading";

// Marked as the heading an `ActionList.Group` looks for, so that a group still finds this
// one among its children rather than leaving it to stand with the items
const GroupHeading: FCWithSlotMarker<NavListGroupHeadingProps> = asSlot(
    NavListGroupHeading,
    groupHeadingSlot,
);

export default GroupHeading;
