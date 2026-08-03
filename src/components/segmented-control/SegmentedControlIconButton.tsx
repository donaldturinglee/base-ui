import { classNames } from "../../utilities/classnames";
import SegmentedControlSegment, { renderSegmentVisual } from "./SegmentedControlSegment";
import type { SegmentedControlIconButtonProps } from "./SegmentedControl.types";

const classes = {
    // An icon segment is as wide as the control says, which is a square while the row takes
    // only the room it needs and an even share of it once the row fills its container
    button: "w-[var(--segment-icon-width)]",
    visual: "flex shrink-0 items-center text-foreground-muted",
    visualDisabled: "text-foreground-disabled",
};

// One segment of the control, carrying an icon in place of a label. The name it is given is
// read from a tooltip, since there is nothing drawn for a reader to go by
function SegmentedControlIconButton(props: SegmentedControlIconButtonProps) {
    const {
        "aria-label": ariaLabel,
        className,
        description,
        icon,
        selected,
        disabled,
        tooltipDirection,
        // Read by the control to work out which segment it starts on, and nothing the segment
        // itself has anything to do with
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultSelected: _defaultSelected,
        ...rest
    } = props;

    return (
        <SegmentedControlSegment
            component="SegmentedControl.IconButton"
            className={classNames(classes.button, className)}
            selected={selected}
            disabled={disabled}
            // Where there is more to say about the segment the tooltip says that instead, so
            // the segment keeps the name it was given to be read by
            aria-label={description ? ariaLabel : undefined}
            tooltip={description ?? ariaLabel}
            tooltipType={description ? undefined : "label"}
            tooltipDirection={tooltipDirection}
            {...rest}
        >
            <span
                className={classNames(classes.visual, disabled && classes.visualDisabled)}
                data-component="SegmentedControl.Icon"
            >
                {renderSegmentVisual(icon)}
            </span>
        </SegmentedControlSegment>
    );
}

SegmentedControlIconButton.displayName = "SegmentedControl.IconButton";

export default SegmentedControlIconButton;
