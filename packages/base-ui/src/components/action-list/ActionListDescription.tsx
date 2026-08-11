import * as React from "react";
import { classNames } from "../../lib/classnames";
import { ActionListItemContext } from "./ActionListItemContext";
import type { ActionListDescriptionProps } from "./ActionList.types";

const classes = {
    root: "action-list-description",
    // Standing beside the label, the description gives way first when there is not enough
    // room for both
    inline: "min-w-0 truncate",
};

// Secondary text saying more about an item than its label does
function ActionListDescription(props: React.PropsWithChildren<ActionListDescriptionProps>) {
    const { className, variant = "inline", ...rest } = props;
    const { blockDescriptionId, inlineDescriptionId } = React.useContext(ActionListItemContext);

    return (
        <span
            id={variant === "block" ? blockDescriptionId : inlineDescriptionId}
            className={classNames(classes.root, variant === "inline" && classes.inline, className)}
            data-component="ActionList.Description"
            data-variant={variant}
            {...rest}
        />
    );
}

ActionListDescription.displayName = "ActionList.Description";

export default ActionListDescription;
