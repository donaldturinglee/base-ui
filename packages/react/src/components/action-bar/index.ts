import ActionBarBase from "./ActionBar";
import ActionBarButton from "./ActionBarButton";
import ActionBarDivider from "./ActionBarDivider";
import ActionBarGroup from "./ActionBarGroup";
import ActionBarIconButton from "./ActionBarIconButton";
import ActionBarMenu from "./ActionBarMenu";

export const ActionBar = Object.assign(ActionBarBase, {
    Button: ActionBarButton,
    IconButton: ActionBarIconButton,
    Divider: ActionBarDivider,
    Group: ActionBarGroup,
    Menu: ActionBarMenu,
});

export { ActionBarButton, ActionBarIconButton, ActionBarDivider, ActionBarGroup, ActionBarMenu };
export { ActionBarContext } from "./ActionBarContext";
export { ActionBarItemContext } from "./ActionBarItemContext";
export * from "./ActionBar.types";
