import { ActionListDivider } from "../action-list";
import ContextMenuBase from "./ContextMenu";
import ContextMenuOverlay from "./ContextMenuOverlay";
import ContextMenuTrigger from "./ContextMenuTrigger";

export const ContextMenu = Object.assign(ContextMenuBase, {
    Trigger: ContextMenuTrigger,
    Overlay: ContextMenuOverlay,
    // The same divider the list uses, so a menu built from parts can be broken up without
    // reaching for the list itself
    Divider: ActionListDivider,
});

export { ContextMenuTrigger, ContextMenuOverlay };
export { ContextMenuContext } from "./ContextMenuContext";
export * from "./ContextMenu.types";
