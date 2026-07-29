import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { ActionListContext } from "./ActionListContext";
import { ActionListGroupContext } from "./ActionListGroupContext";
import type { ActionListGroupHeadingProps, ActionListGroupVariant } from "./ActionList.types";

const classes = {
    wrap: "px-[var(--base-size-8)] py-[var(--base-size-6)]",
    variant: {
        subtle: "",
        // A filled group is set apart from the items around it by what it is drawn on
        filled: "bg-[var(--background-color-muted)] border-y-[length:var(--border-width-thin)] border-y-[color:var(--border-color-muted)] mt-[var(--base-size-8)]",
    } satisfies Record<ActionListGroupVariant, string>,
    heading:
        "m-0 [font-size:var(--text-body-size-small)] leading-[var(--text-body-line-height-small)] [font-weight:var(--base-text-weight-semibold)] [color:var(--foreground-color-muted)]",
    auxiliary:
        "[font-size:var(--text-body-size-small)] leading-[var(--text-body-line-height-small)] [color:var(--foreground-color-muted)]",
};

// Names the group it stands at the top of. In a plain list that is a real heading, so it
// needs a level; in a menu or a listbox there is nowhere in the accessibility tree to put
// one, so it is drawn but not read and the group is named from its text instead
function ActionListGroupHeading(props: ActionListGroupHeadingProps) {
    const { as, className, children, variant = "subtle", auxiliaryText, ...rest } = props;
    const { role: listRole } = React.useContext(ActionListContext);
    const { groupHeadingId } = React.useContext(ActionListGroupContext);

    const isPresentational = listRole !== undefined && listRole !== "list";
    const Component = as ?? "h3";

    return (
        <div
            className={classNames(classes.wrap, classes.variant[variant])}
            data-component="ActionList.GroupHeading"
            data-variant={variant}
            {...(isPresentational ? { role: "presentation", "aria-hidden": true } : {})}
        >
            {isPresentational ? (
                <span
                    id={groupHeadingId}
                    className={classNames(classes.heading, className)}
                    {...rest}
                >
                    {children}
                </span>
            ) : (
                <Component
                    id={groupHeadingId}
                    className={classNames(classes.heading, className)}
                    {...rest}
                >
                    {children}
                </Component>
            )}
            {auxiliaryText ? <div className={classes.auxiliary}>{auxiliaryText}</div> : null}
        </div>
    );
}

ActionListGroupHeading.displayName = "ActionList.GroupHeading";

export default ActionListGroupHeading;
