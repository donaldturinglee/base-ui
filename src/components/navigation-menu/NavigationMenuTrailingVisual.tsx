import { classNames } from "../../lib/classnames";
import { NavigationMenuVisualContainer } from "./NavigationMenuVisual";
import type { NavigationMenuVisualProps } from "./NavigationMenu.types";

const classes = {
    // Stands at the end of the row rather than beside the label, so that a count or a mark
    // reads straight down a column of links
    root: "navigation-menu-visual-trailing",
};

// An icon, a count, or something like one, standing after the link's label
function NavigationMenuTrailingVisual(props: NavigationMenuVisualProps) {
    const { className, ...rest } = props;

    return (
        <NavigationMenuVisualContainer
            className={classNames(classes.root, className)}
            data-component="NavigationMenu.TrailingVisual"
            {...rest}
        />
    );
}

NavigationMenuTrailingVisual.displayName = "NavigationMenu.TrailingVisual";

export default NavigationMenuTrailingVisual;
