import type { ActionListSubItemProps } from "./ActionList.types";

// Holds a list nested within an item. It draws nothing of its own: it is only there to be
// found, so that the item can stand the list after the row that opens it rather than
// inside it
function ActionListSubItem({ children }: ActionListSubItemProps) {
    return <>{children}</>;
}

ActionListSubItem.displayName = "ActionList.SubItem";

export default ActionListSubItem;
