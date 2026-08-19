import * as React from "react";
import { ActionListVisualContainer } from "./ActionListVisual";
import { ActionListItemContext } from "./ActionListItemContext";
import type { ActionListVisualProps } from "./ActionList.types";

// An icon, a keyboard shortcut, or something like one, standing after the item's label. It
// is read as part of the item's name, so it is given the id the item points at
function ActionListTrailingVisual(props: React.PropsWithChildren<ActionListVisualProps>) {
    const { trailingVisualId } = React.useContext(ActionListItemContext);

    return (
        <ActionListVisualContainer
            id={trailingVisualId}
            data-component="ActionList.TrailingVisual"
            {...props}
        />
    );
}

ActionListTrailingVisual.displayName = "ActionList.TrailingVisual";

export default ActionListTrailingVisual;
