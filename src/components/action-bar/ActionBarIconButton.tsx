import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { useActionBarItem } from "./useActionBarItem";
import type { ActionBarIconButtonProps } from "./ActionBar.types";

const classes = {
    // An item that no longer fits is left where it is and taken out of sight, so the row it
    // was measured in does not change shape as it goes
    overflowing: "invisible",
};

// An icon button in the bar. Its name is what the overflow menu shows, since the icon it
// carries says nothing on its own
function ActionBarIconButton(
    props: ActionBarIconButtonProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props as ActionBarIconButtonProps & { className?: string };

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRefs(ref, buttonRef);
    const { size, isOverflowing } = useActionBarItem(buttonRef);

    return (
        <IconButton
            ref={mergedRef}
            size={size}
            variant="invisible"
            className={classNames(isOverflowing && classes.overflowing, className)}
            data-component="ActionBar.IconButton"
            data-overflowing={isOverflowing ? "" : undefined}
            {...rest}
        />
    );
}

ActionBarIconButton.displayName = "ActionBar.IconButton";

export default fixedForwardRef(ActionBarIconButton);
