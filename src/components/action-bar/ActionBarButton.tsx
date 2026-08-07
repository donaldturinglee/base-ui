import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { useActionBarItem } from "./useActionBarItem";
import type { ActionBarButtonProps } from "./ActionBar.types";

const classes = {
    // An item that no longer fits is left where it is and taken out of sight, so the row it
    // was measured in does not change shape as it goes
    overflowing: "invisible",
};

// A button in the bar. Where the row runs out of room it is offered from the overflow menu
// instead, so the label it carries is what the menu shows
function ActionBarButton(
    props: ActionBarButtonProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRefs(ref, buttonRef);
    const { size, isOverflowing } = useActionBarItem(buttonRef);

    return (
        <Button
            ref={mergedRef}
            size={size}
            variant="invisible"
            className={classNames(isOverflowing && classes.overflowing, className)}
            data-component="ActionBar.Button"
            data-overflowing={isOverflowing ? "" : undefined}
            {...rest}
        />
    );
}

ActionBarButton.displayName = "ActionBar.Button";

export default fixedForwardRef(ActionBarButton);
