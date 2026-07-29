import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Heading } from "../heading";
import { ActionListContext } from "./ActionListContext";
import type { ActionListHeadingProps } from "./ActionList.types";

const classes = {
    root: "px-[var(--base-size-8)] py-[var(--base-size-6)] [font-size:var(--text-body-size-small)] leading-[var(--text-body-line-height-small)] [font-weight:var(--base-text-weight-semibold)] [color:var(--foreground-color-muted)]",
    // Still read, but no longer drawn, for a list that is named for a screen reader alone
    hidden: "sr-only",
};

// Names the list it stands at the top of. A list inside a menu is named by the button that
// opens the menu instead, so it has no use for one
function ActionListHeading<As extends React.ElementType = "h3">(
    props: ActionListHeadingProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as,
        className,
        visuallyHidden = false,
        id,
        ...rest
    } = props as ActionListHeadingProps<React.ElementType>;
    const { headingId } = React.useContext(ActionListContext);

    return (
        <Heading
            ref={ref}
            as={as}
            id={id ?? headingId}
            className={classNames(classes.root, visuallyHidden && classes.hidden, className)}
            data-component="ActionList.Heading"
            {...rest}
        />
    );
}

ActionListHeading.displayName = "ActionList.Heading";

export default fixedForwardRef(ActionListHeading);
