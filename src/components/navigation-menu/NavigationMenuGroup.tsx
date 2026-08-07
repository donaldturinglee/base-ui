import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../lib/classnames";
import NavigationMenuDivider from "./NavigationMenuDivider";
import NavigationMenuGroupHeading from "./NavigationMenuGroupHeading";
import type { NavigationMenuGroupProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu-group",
};

const slotsConfig = {
    groupHeading: NavigationMenuGroupHeading,
};

// Collects related links under a heading of their own, set apart from what comes before by a
// line. A panel holding a few of these reads as several short lists rather than as one long
// one, which is what tells a reader where to stop looking
function NavigationMenuGroup(props: NavigationMenuGroupProps) {
    const { title, children, className, hideDivider = false, ...rest } = props;

    const generatedHeadingId = useId();
    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);

    // A heading written out stands in place of the one `title` would have built, since a group
    // named twice over is named neither way
    const heading =
        slots.groupHeading ??
        (title ? <NavigationMenuGroupHeading>{title}</NavigationMenuGroupHeading> : null);

    const headingId = heading ? (heading.props.id ?? generatedHeadingId) : undefined;

    return (
        <>
            {hideDivider ? null : <NavigationMenuDivider />}
            {/* Named by its heading rather than only headed by it, so that a reader stepping
                through the panel is told which group they have arrived in */}
            <div
                role="group"
                aria-labelledby={headingId}
                className={classNames(classes.root, className)}
                data-component="NavigationMenu.Group"
                {...rest}
            >
                {heading ? React.cloneElement(heading, { id: headingId }) : null}
                {childrenWithoutSlots}
            </div>
        </>
    );
}

NavigationMenuGroup.displayName = "NavigationMenu.Group";

export default NavigationMenuGroup;
