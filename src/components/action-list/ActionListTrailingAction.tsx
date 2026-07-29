import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import type { ActionListTrailingActionProps } from "./ActionList.types";

const classes = {
    // The action stands at the end of the row, outside the part of the item that is picked
    root: "flex shrink-0 items-center",
    // It is only drawn once the item is under the pointer or holds focus, so a list of them
    // does not read as a row of buttons
    action: "invisible [li:hover_&]:visible [li:focus-within_&]:visible focus-visible:visible",
};

// A second thing an item can do, standing beside the item rather than inside it. A list
// that is read as a menu has nowhere to put one, so it is left out there
function ActionListTrailingAction(
    props: ActionListTrailingActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, icon, label, ...rest } = props;

    return (
        <span className={classes.root} data-component="ActionList.TrailingAction">
            {icon ? (
                <IconButton
                    ref={ref}
                    icon={icon}
                    aria-label={label}
                    variant="invisible"
                    size="small"
                    className={classNames(classes.action, className)}
                    {...rest}
                />
            ) : (
                <Button
                    ref={ref}
                    variant="invisible"
                    size="small"
                    className={classNames(classes.action, className)}
                    {...rest}
                >
                    {label}
                </Button>
            )}
        </span>
    );
}

ActionListTrailingAction.displayName = "ActionList.TrailingAction";

export default fixedForwardRef(ActionListTrailingAction);
