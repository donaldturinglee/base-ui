import * as React from "react";
import { classNames } from "../../lib/classnames";
import { NavigationMenuLinkContext } from "./NavigationMenuContext";
import type { NavigationMenuDescriptionProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-description",
};

// Secondary text saying more about a link than its label does. A panel is often the first a
// reader sees of what stands behind a link, so there is room here to say what that is
function NavigationMenuDescription(props: NavigationMenuDescriptionProps) {
    const { className, ...rest } = props;

    const { descriptionId } = React.useContext(NavigationMenuLinkContext);

    return (
        <span
            id={descriptionId}
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.Description"
            {...rest}
        />
    );
}

NavigationMenuDescription.displayName = "NavigationMenu.Description";

export default NavigationMenuDescription;
