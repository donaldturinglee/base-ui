import { classNames } from "../../utilities/classnames";
import { CounterLabel } from "../counter-label";
import SegmentedControlSegment, { renderSegmentVisual } from "./SegmentedControlSegment";
import type { SegmentedControlButtonProps } from "./SegmentedControl.types";

const classes = {
    visual: "segmented-control-visual",
    visualDisabled: "segmented-control-visual-disabled",
    text: "segmented-control-text",
    textHidden: "segmented-control-text-hidden",
    counter: "segmented-control-counter",
};

// One segment of the control, carrying a label and whatever is read with it
function SegmentedControlButton(props: SegmentedControlButtonProps) {
    const {
        children,
        className,
        count,
        leadingVisual,
        selected,
        disabled,
        // Read by the control to work out which segment it starts on, and nothing the segment
        // itself has anything to do with
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        defaultSelected: _defaultSelected,
        ...rest
    } = props;

    return (
        <SegmentedControlSegment
            component="SegmentedControl.Button"
            className={className}
            selected={selected}
            disabled={disabled}
            {...rest}
        >
            {leadingVisual ? (
                <span
                    className={classNames(classes.visual, disabled && classes.visualDisabled)}
                    data-component="SegmentedControl.LeadingVisual"
                >
                    {renderSegmentVisual(leadingVisual)}
                </span>
            ) : null}
            {/* The label is laid out at the weight it takes once the segment is the one being
                shown as well, so the row does not shift as the reader moves along it */}
            <span
                className={classNames(classes.text, classes.textHidden)}
                data-component="SegmentedControl.Text"
                data-text={children}
            >
                {children}
            </span>
            {count !== undefined ? (
                <span className={classes.counter}>
                    <CounterLabel>{count}</CounterLabel>
                </span>
            ) : null}
        </SegmentedControlSegment>
    );
}

SegmentedControlButton.displayName = "SegmentedControl.Button";

export default SegmentedControlButton;
