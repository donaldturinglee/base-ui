import * as React from "react";
import { ActionListVisualContainer } from "./ActionListVisual";
import type { ActionListVisualProps } from "./ActionList.types";

// An icon, or something like one, standing before the item's label
function ActionListLeadingVisual(props: React.PropsWithChildren<ActionListVisualProps>) {
    return <ActionListVisualContainer data-component="ActionList.LeadingVisual" {...props} />;
}

ActionListLeadingVisual.displayName = "ActionList.LeadingVisual";

export default ActionListLeadingVisual;
