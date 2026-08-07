import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { NavigationMenuHeadingLevelContext } from "./NavigationMenuContext";
import { headingTagForLevel } from "./headingLevel";
import type { NavigationMenuGroupHeadingProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-group-heading",
};

// Names the group it stands at the top of. This is what `NavigationMenu.Group`'s `title`
// builds, and is written out instead wherever the heading holds more than plain text, a link
// say
function NavigationMenuGroupHeading(props: NavigationMenuGroupHeadingProps) {
    const { as, className, ...rest } = props;

    const headingLevel = React.useContext(NavigationMenuHeadingLevelContext);
    const Component = as ?? headingTagForLevel(headingLevel);

    return (
        <Component
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.GroupHeading"
            {...rest}
        />
    );
}

NavigationMenuGroupHeading.displayName = "NavigationMenu.GroupHeading";

export default NavigationMenuGroupHeading;
