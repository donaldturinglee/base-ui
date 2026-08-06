import { classNames } from "../../utilities/classnames";
import { Heading } from "../heading";
import type { NavigationListHeadingProps } from "./NavigationList.types";

const classes = {
    root: "navigation-list-heading",
    // A heading is not phrasing content, so it cannot be wrapped in a span to be hidden.
    // The styles go on the heading itself instead
    hidden: "sr-only",
};

// Names the list. The `nav` landmark is named from it, so a list with a heading needs
// nothing else said about it
function NavigationListHeading(props: NavigationListHeadingProps) {
    const { as = "h2", visuallyHidden = false, className, ...rest } = props;

    return (
        <Heading
            as={as}
            size="small"
            className={classNames(visuallyHidden ? classes.hidden : classes.root, className)}
            data-component="NavigationList.Heading"
            {...rest}
        />
    );
}

NavigationListHeading.displayName = "NavigationList.Heading";

export default NavigationListHeading;
