import * as React from "react";
import { useIsClipped } from "../../hooks/useIsClipped";
import { ActionBarContext } from "./ActionBarContext";
import { ActionBarItemContext } from "./ActionBarItemContext";

// Stands in for the row where an item has been rendered outside of one
const noRoot: React.RefObject<HTMLElement | null> = { current: null };

// Watches one item of the bar and tells the bar as soon as it no longer fits, so that the
// bar can offer it from its overflow menu instead
export const useActionBarItem = (ref: React.RefObject<HTMLElement | null>) => {
    const { size, rootRef, setOverflowing } = React.useContext(ActionBarContext);
    const { index, inGroup } = React.useContext(ActionBarItemContext);

    const isOverflowing = useIsClipped({
        ref,
        rootRef: rootRef ?? noRoot,
        // A group is carried into the menu whole, so what is inside it is never watched
        disabled: inGroup,
    });

    React.useEffect(() => {
        if (index === undefined) {
            return;
        }

        setOverflowing?.(index, isOverflowing);
    }, [index, isOverflowing, setOverflowing]);

    return { size, isOverflowing };
};
