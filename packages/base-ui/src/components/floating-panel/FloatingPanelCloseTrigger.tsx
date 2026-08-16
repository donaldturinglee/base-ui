import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import type { FloatingPanelCloseTriggerProps } from "./FloatingPanel.types";

// Closes the panel. It is named for a screen reader by the panel rather than by whatever it is
// given, since a close button is the same thing wherever it stands
function FloatingPanelCloseTrigger(
    props: FloatingPanelCloseTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { onClick, ...rest } = props;
    const { setOpen } = useFloatingPanelContext();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        setOpen(false);
    };

    return (
        <IconButton
            ref={ref}
            icon={DismissRegular}
            aria-label="Close panel"
            variant="invisible"
            size="small"
            onClick={handleClick}
            data-component="FloatingPanel.CloseTrigger"
            {...rest}
        />
    );
}

FloatingPanelCloseTrigger.displayName = "FloatingPanel.CloseTrigger";

export default fixedForwardRef(FloatingPanelCloseTrigger);
