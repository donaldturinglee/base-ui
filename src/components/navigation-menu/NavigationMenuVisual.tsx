import { classNames } from "../../lib/classnames";
import type { NavigationMenuVisualProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-visual",
};

// The box a leading or trailing visual is drawn in. Both stand it in the same place, so they
// only differ in where the link puts them
export const NavigationMenuVisualContainer = ({
    className,
    ...rest
}: NavigationMenuVisualProps) => <span className={classNames(classes.root, className)} {...rest} />;
