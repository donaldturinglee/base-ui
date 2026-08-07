import { classNames } from "../../utilities/classnames";
import { Heading } from "../heading";
import type { NavigationMenuHeadingProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-heading",
    // A heading is not phrasing content, so it cannot be wrapped in a span to be hidden. The
    // styles go on the heading itself instead
    hidden: "sr-only",
};

// Names the menu. The `nav` landmark is named from it, so a menu with a heading needs nothing
// else said about it
function NavigationMenuHeading(props: NavigationMenuHeadingProps) {
    const { as = "h2", visuallyHidden = false, className, ...rest } = props;

    return (
        <Heading
            as={as}
            size="small"
            className={classNames(visuallyHidden ? classes.hidden : classes.root, className)}
            data-component="NavigationMenu.Heading"
            {...rest}
        />
    );
}

NavigationMenuHeading.displayName = "NavigationMenu.Heading";

export default NavigationMenuHeading;
