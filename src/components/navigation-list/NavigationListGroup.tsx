import * as React from "react";
import { ActionList } from "../action-list";
import { NavigationListHeadingLevelContext } from "./NavigationListContext";
import { headingTagForLevel } from "./headingLevel";
import type { NavigationListGroupProps } from "./NavigationList.types";

// Collects related items under a heading of their own, set apart from what comes before by
// a line
function NavigationListGroup(props: NavigationListGroupProps) {
    const { title, children, hideDivider = false, ...rest } = props;

    const headingLevel = React.useContext(NavigationListHeadingLevelContext);

    return (
        <>
            {hideDivider ? null : <ActionList.Divider />}
            <ActionList.Group data-component="NavigationList.Group" {...rest}>
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

NavigationListGroup.displayName = "NavigationList.Group";

export default NavigationListGroup;
