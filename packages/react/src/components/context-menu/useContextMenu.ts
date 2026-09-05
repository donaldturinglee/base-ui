import { useContext } from "react";
import { ContextMenuContext } from "./ContextMenuContext";
import type { ContextMenuContextValue } from "./ContextMenu.types";

// Everything a part of the menu needs from the menu around it. Standing outside of a
// `ContextMenu` is a mistake worth stopping at rather than carrying on from: nothing below it
// can know whether the menu is open, or where it was asked for
export const useContextMenu = (): ContextMenuContextValue => {
    const context = useContext(ContextMenuContext);

    if (!context) {
        throw new Error("The parts of a context menu all have to stand within a `ContextMenu`.");
    }

    return context;
};
