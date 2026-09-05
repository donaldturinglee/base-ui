import { useContext } from "react";
import { NavigationMenuContext } from "./NavigationMenuContext";
import type { NavigationMenuApi } from "./NavigationMenu.types";

// Which item stands open in the menu around whatever is reading this, and the way to open
// another. It is what a caller drawing something of their own inside the menu reaches for, a
// line saying what is open say, or a button that opens a panel from somewhere other than the
// row.
//
// Standing outside of a `NavigationMenu` is a mistake worth stopping at rather than carrying on
// from: there is no menu to read, and nothing to open
export const useNavigationMenu = (): NavigationMenuApi => {
    const context = useContext(NavigationMenuContext);

    if (!context) {
        throw new Error(
            "`useNavigationMenu` has to be called from within a `NavigationMenu` component.",
        );
    }

    const { value, open, orientation, setValue } = context;

    return { value, open, orientation, setValue };
};
