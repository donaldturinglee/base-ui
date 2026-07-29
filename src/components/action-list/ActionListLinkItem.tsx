import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ActionListItem from "./ActionListItem";
import type { ActionListLinkItemProps } from "./ActionList.types";

// An item that is somewhere to go rather than something to do. The anchor fills the item,
// so the whole row is what is followed rather than the label alone
function ActionListLinkItem<As extends React.ElementType = "a">(
    props: ActionListLinkItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as, ...rest } = props as ActionListLinkItemProps<React.ElementType>;

    return <ActionListItem ref={ref} as={as ?? "a"} {...rest} />;
}

ActionListLinkItem.displayName = "ActionList.LinkItem";

export default fixedForwardRef(ActionListLinkItem);
