import ContextMenuBase from "./ContextMenu";
import ContextMenuCheckboxItem from "./ContextMenuCheckboxItem";
import ContextMenuContent from "./ContextMenuContent";
import ContextMenuItem from "./ContextMenuItem";
import ContextMenuItemGroup from "./ContextMenuItemGroup";
import ContextMenuItemGroupLabel from "./ContextMenuItemGroupLabel";
import ContextMenuItemIndicator from "./ContextMenuItemIndicator";
import ContextMenuItemText from "./ContextMenuItemText";
import ContextMenuPositioner from "./ContextMenuPositioner";
import ContextMenuRadioItem from "./ContextMenuRadioItem";
import ContextMenuRadioItemGroup from "./ContextMenuRadioItemGroup";
import ContextMenuSeparator from "./ContextMenuSeparator";
import ContextMenuTrigger from "./ContextMenuTrigger";

export const ContextMenu = Object.assign(ContextMenuBase, {
    Trigger: ContextMenuTrigger,
    Positioner: ContextMenuPositioner,
    Content: ContextMenuContent,
    Item: ContextMenuItem,
    ItemText: ContextMenuItemText,
    ItemIndicator: ContextMenuItemIndicator,
    ItemGroup: ContextMenuItemGroup,
    ItemGroupLabel: ContextMenuItemGroupLabel,
    Separator: ContextMenuSeparator,
    CheckboxItem: ContextMenuCheckboxItem,
    RadioItemGroup: ContextMenuRadioItemGroup,
    RadioItem: ContextMenuRadioItem,
});

export {
    ContextMenuTrigger,
    ContextMenuPositioner,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuItemText,
    ContextMenuItemIndicator,
    ContextMenuItemGroup,
    ContextMenuItemGroupLabel,
    ContextMenuSeparator,
    ContextMenuCheckboxItem,
    ContextMenuRadioItemGroup,
    ContextMenuRadioItem,
};
export { ContextMenuContext } from "./ContextMenuContext";
export { ContextMenuItemContext } from "./ContextMenuItemContext";
export { ContextMenuItemGroupContext } from "./ContextMenuItemGroupContext";
export { useContextMenu } from "./useContextMenu";
export { useContextMenuItem } from "./useContextMenuItem";
export type { UseContextMenuItemOptions } from "./useContextMenuItem";
export * from "./ContextMenu.types";
