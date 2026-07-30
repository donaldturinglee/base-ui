import * as React from "react";
import { ActionList } from "../action-list";
import { NavListHeadingLevelContext } from "./NavListContext";
import { headingTagForLevel } from "./headingLevel";
import type { NavListGroupProps } from "./NavList.types";

// Collects related items under a heading of their own, set apart from what comes before by
// a line
function NavListGroup(props: NavListGroupProps) {
    const { title, children, hideDivider = false, ...rest } = props;

    const headingLevel = React.useContext(NavListHeadingLevelContext);

    return (
        <>
            {hideDivider ? null : <ActionList.Divider />}
            <ActionList.Group data-component="NavList.Group" {...rest}>
                {title ? (
                    <ActionList.GroupHeading as={headingTagForLevel(headingLevel)}>
                        {title}
                    </ActionList.GroupHeading>
                ) : null}
                {children}
            </ActionList.Group>
        </>
    );
}

NavListGroup.displayName = "NavList.Group";

export default NavListGroup;
