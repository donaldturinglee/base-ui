import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../lib/classnames";
import { ActionList, ActionListContainerContext } from "../action-list";
import NavigationListHeading from "./NavigationListHeading";
import { NavigationListHeadingLevelContext } from "./NavigationListContext";
import { levelForHeadingTag } from "./headingLevel";
import type { NavigationListProps } from "./NavigationList.types";

const slotsConfig = {
    heading: NavigationListHeading,
};

// What the list tells the items standing inside it about where they are
const containerContextValue = {
    container: "NavigationList",
};

// A list of the places a reader can go from here. It is a landmark of its own, so the parts
// of a page it stands for can be reached without reading through everything around it
function NavigationList(
    props: NavigationListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        children,
        className,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);

    const generatedHeadingId = useId();
    const heading = slots.heading;
    const headingId = heading ? (heading.props.id ?? generatedHeadingId) : undefined;
    const headingLevel = heading ? levelForHeadingTag(heading.props.as ?? "h2") : null;

    // A list named by the caller keeps that name; one with a heading of its own is named by
    // it, so the landmark is never left unnamed where there is something to name it
    const labelledBy = ariaLabelledBy ?? (ariaLabel ? undefined : headingId);

    return (
        <nav
            ref={ref}
            aria-label={ariaLabel}
            aria-labelledby={labelledBy}
            className={classNames(className)}
            data-component="NavigationList"
            {...rest}
        >
            <NavigationListHeadingLevelContext.Provider value={headingLevel}>
                {heading ? React.cloneElement(heading, { id: headingId }) : null}
                <ActionListContainerContext.Provider value={containerContextValue}>
                    <ActionList>{childrenWithoutSlots}</ActionList>
                </ActionListContainerContext.Provider>
            </NavigationListHeadingLevelContext.Provider>
        </nav>
    );
}

NavigationList.displayName = "NavigationList";

export default React.forwardRef(NavigationList);
