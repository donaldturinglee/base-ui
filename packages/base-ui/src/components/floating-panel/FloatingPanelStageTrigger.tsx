import * as React from "react";
import {
    ArrowMaximizeRegular,
    ArrowMinimizeRegular,
    SubtractRegular,
} from "@gamecrafters/base-ui-icons";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { useFloatingPanelContext } from "./FloatingPanelContext";
import type { FloatingPanelStage, FloatingPanelStageTriggerProps } from "./FloatingPanel.types";

// What each stage is drawn and named as. Restoring is the one that has no stage of its own to be
// named after, since it is the default stage a panel goes back to
const stages: Record<FloatingPanelStage, { icon: typeof SubtractRegular; label: string }> = {
    minimized: { icon: SubtractRegular, label: "Minimize panel" },
    maximized: { icon: ArrowMaximizeRegular, label: "Maximize panel" },
    default: { icon: ArrowMinimizeRegular, label: "Restore panel" },
};

// Puts the panel into one of its stages. Pressing the one the panel is already at puts it back to
// the default, so the same button both minimizes and restores rather than needing a pair of them
// that swap places
function FloatingPanelStageTrigger(
    props: FloatingPanelStageTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { stage: target, onClick, ...rest } = props;
    const { stage, setStage, disabled } = useFloatingPanelContext();

    const isAtStage = stage === target;
    // A button that would put the panel where it already is takes it back to the default instead,
    // and says so in the icon it draws and the name it carries
    const next = isAtStage ? "default" : target;
    const { icon, label } = stages[next];

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        setStage(next);
    };

    return (
        <IconButton
            ref={ref}
            icon={icon}
            aria-label={label}
            variant="invisible"
            size="small"
            disabled={disabled}
            onClick={handleClick}
            data-component="FloatingPanel.StageTrigger"
            data-stage={target}
            data-active={isAtStage ? "" : undefined}
            {...rest}
        />
    );
}

FloatingPanelStageTrigger.displayName = "FloatingPanel.StageTrigger";

export default fixedForwardRef(FloatingPanelStageTrigger);
