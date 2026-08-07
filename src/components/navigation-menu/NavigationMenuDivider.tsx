import { classNames } from "../../lib/classnames";
import type { NavigationMenuDividerProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-divider",
};

// Sets one group of links apart from what comes before it. It says nothing, so it is left out
// of the accessibility tree
function NavigationMenuDivider(props: NavigationMenuDividerProps) {
    const { className, ...rest } = props;

    return (
        <div
            aria-hidden="true"
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.Divider"
            {...rest}
        />
    );
}

NavigationMenuDivider.displayName = "NavigationMenu.Divider";

export default NavigationMenuDivider;
