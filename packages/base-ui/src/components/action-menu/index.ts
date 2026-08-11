import { ActionListDivider } from "../action-list";
import ActionMenuBase from "./ActionMenu";
import ActionMenuAnchor from "./ActionMenuAnchor";
import ActionMenuButton from "./ActionMenuButton";
import ActionMenuOverlay from "./ActionMenuOverlay";

export const ActionMenu = Object.assign(ActionMenuBase, {
    Anchor: ActionMenuAnchor,
    Button: ActionMenuButton,
    Overlay: ActionMenuOverlay,
    // The same divider the list uses, so a menu built from parts can be broken up without
    // reaching for the list itself
    Divider: ActionListDivider,
});

export { ActionMenuAnchor, ActionMenuButton, ActionMenuOverlay };
export { ActionMenuContext } from "./ActionMenuContext";
export * from "./ActionMenu.types";
