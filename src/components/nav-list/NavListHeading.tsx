import { classNames } from "../../utilities/classnames";
import { Heading } from "../heading";
import type { NavListHeadingProps } from "./NavList.types";

const classes = {
    // Lined up with the labels of the items below it rather than with the edge of the list,
    // since the items are held in from that edge by their own padding
    root: "mb-[var(--base-size-8)] ms-[calc(var(--control-medium-padding-inline-condensed)_+_var(--base-size-8))]",
    // A heading is not phrasing content, so it cannot be wrapped in a span to be hidden.
    // The styles go on the heading itself instead
    hidden: "sr-only",
};

// Names the list. The `nav` landmark is named from it, so a list with a heading needs
// nothing else said about it
function NavListHeading(props: NavListHeadingProps) {
    const { as = "h2", visuallyHidden = false, className, ...rest } = props;

    return (
        <Heading
            as={as}
            size="small"
            className={classNames(visuallyHidden ? classes.hidden : classes.root, className)}
            data-component="NavList.Heading"
            {...rest}
        />
    );
}

NavListHeading.displayName = "NavList.Heading";

export default NavListHeading;
