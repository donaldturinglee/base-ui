import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import type { ActionListTrailingActionProps } from "./ActionList.types";

const classes = {
    root: "action-list-trailing-action",
    action: "action-list-trailing-action-button",
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
