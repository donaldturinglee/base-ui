import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { Tooltip } from "../tooltip";
import type { ButtonVisual } from "../button";
import type { SegmentedControlSegmentProps } from "./SegmentedControl.types";

const classes = {
    item: "segmented-control-segment",
    separator: "segmented-control-segment-separator",
    separatorHidden: "segmented-control-segment-separator-hidden",
    button: "segmented-control-button",
    buttonSelected: "segmented-control-button-selected",
    buttonDisabled: "segmented-control-button-disabled",
    content: "segmented-control-content",
    contentSelected: "segmented-control-content-selected",
    contentInteractive: "segmented-control-content-interactive",
};

// A visual is given either as the component to render, or as an element that is already built
export const renderSegmentVisual = (visual: NonNullable<ButtonVisual>) => {
    const Visual = visual as React.ElementType;

    return React.isValidElement(visual) ? visual : <Visual />;
};

// The look of one segment, shared by the segment that carries a label and the one that carries
// only an icon. The control itself says which segment is being shown, so the shell is told
// rather than holding any of that
function SegmentedControlSegment(props: SegmentedControlSegmentProps) {
    const {
        component,
        className,
        children,
        selected,
        disabled,
        tooltip,
        tooltipType,
        tooltipDirection,
        "aria-disabled": ariaDisabled,
        ...rest
    } = props;

    // A segment that cannot be picked says so rather than being taken out of the tab order,
    // so a reader can still reach it and be told why. It keeps the look of the knob where it
    // is the segment being shown
    const unavailable = Boolean(disabled) || ariaDisabled === true || ariaDisabled === "true";

    const button = (
        <button
            type="button"
            aria-pressed={selected}
            aria-disabled={unavailable || undefined}
            className={classNames(
                classes.button,
                selected && classes.buttonSelected,
                unavailable && !selected && classes.buttonDisabled,
                className,
            )}
            {...rest}
        >
            <span
                className={classNames(
                    classes.content,
                    selected && classes.contentSelected,
                    !selected && !unavailable && classes.contentInteractive,
                )}
            >
                {children}
            </span>
        </button>
    );

    return (
        <li
            className={classNames(classes.item, classes.separator, classes.separatorHidden)}
            data-component={component}
            data-selected={selected ? "" : undefined}
        >
            {tooltip ? (
                <Tooltip text={tooltip} type={tooltipType} direction={tooltipDirection}>
                    {button}
                </Tooltip>
            ) : (
                button
            )}
        </li>
    );
}

SegmentedControlSegment.displayName = "SegmentedControlSegment";

export default SegmentedControlSegment;
