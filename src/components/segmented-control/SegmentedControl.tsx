import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { classNames, cva } from "../../utilities/classnames";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { ActionList } from "../action-list";
import { ActionMenu } from "../action-menu";
import SegmentedControlButton from "./SegmentedControlButton";
import SegmentedControlIconButton from "./SegmentedControlIconButton";
import { renderSegmentVisual } from "./SegmentedControlSegment";
import type { ActionListSelectEvent } from "../action-list";
import type { ButtonVisual } from "../button";
import type {
    SegmentedControlButtonProps,
    SegmentedControlElementProps,
    SegmentedControlIconButtonProps,
    SegmentedControlProps,
    SegmentedControlSize,
} from "./SegmentedControl.types";

const classes = {
    // ...and only there is the menu drawn in its place
    dropdown: "segmented-control-dropdown",
};

const segmentedControlVariants = cva("segmented-control", {
    variants: {
        size: {
            small: "segmented-control-small",
            // A medium control takes the size the track is already drawn at
            medium: "",
        } satisfies Record<SegmentedControlSize, string>,
    },
});

type SegmentedControlChild = React.ReactElement<
    SegmentedControlButtonProps | SegmentedControlIconButtonProps
>;

const getSegments = (children: React.ReactNode): SegmentedControlChild[] =>
    React.Children.toArray(children).filter((child): child is SegmentedControlChild =>
        React.isValidElement(child),
    );

const isLabelSegment = (
    child: SegmentedControlChild,
): child is React.ReactElement<SegmentedControlButtonProps> =>
    child.type === SegmentedControlButton;

const isIconSegment = (
    child: SegmentedControlChild,
): child is React.ReactElement<SegmentedControlIconButtonProps> =>
    child.type === SegmentedControlIconButton;

// What the menu shows for a segment: the label it carries, or the name an icon segment was
// given in place of one
const getSegmentLabel = (child: SegmentedControlChild | undefined) => {
    if (child === undefined) {
        return undefined;
    }

    if (isLabelSegment(child)) {
        return child.props.children;
    }

    return isIconSegment(child) ? child.props["aria-label"] : undefined;
};

const getSegmentVisual = (child: SegmentedControlChild | undefined): ButtonVisual => {
    if (child === undefined) {
        return null;
    }

    if (isLabelSegment(child)) {
        return child.props.leadingVisual ?? null;
    }

    return isIconSegment(child) ? child.props.icon : null;
};

const isSegmentDisabled = (child: SegmentedControlChild) => {
    const ariaDisabled = child.props["aria-disabled"];

    return child.props.disabled === true || ariaDisabled === true || ariaDisabled === "true";
};

// A row of segments, one of which is the one being shown. Where there is no room for the row
// it either drops its labels or gives way to a menu offering the same segments
function SegmentedControl(props: SegmentedControlProps) {
    const {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        className,
        children,
        fullWidth,
        onChange,
        size = "medium",
        variant = "default",
        ...rest
    } = props as SegmentedControlElementProps;

    const segments = getSegments(children);

    // A control that is told what to do on a change, and is not handed a segment to start on,
    // is one the caller is holding the state of
    const isUncontrolled =
        onChange === undefined ||
        segments.some((segment) => segment.props.defaultSelected !== undefined);

    const givenIndex = segments.findIndex(
        (segment) => segment.props.defaultSelected || segment.props.selected,
    );
    // With nothing said about which segment is being shown, it is the first of them
    const selectedFromProps = givenIndex === -1 ? 0 : givenIndex;
    const [ownIndex, setOwnIndex] = React.useState(selectedFromProps);
    const selectedIndex = isUncontrolled ? ownIndex : selectedFromProps;
    const selectedSegment = segments[selectedIndex];

    const selectSegment = (
        index: number,
        segment: SegmentedControlChild,
        event: ActionListSelectEvent,
    ) => {
        // A segment that reads as unavailable is not picked, however it was reached
        if (isSegmentDisabled(segment)) {
            return;
        }

        if (isUncontrolled) {
            setOwnIndex(index);
        }

        onChange?.(index);
        segment.props.onClick?.(event as React.MouseEvent<HTMLButtonElement>);
    };

    const control = (
        <ul
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={classNames(segmentedControlVariants({ size }), className)}
            data-component="SegmentedControl"
            data-size={size}
            {...getResponsiveAttributes("full-width", fullWidth)}
            {...getResponsiveAttributes("variant", variant)}
            {...rest}
        >
            {segments.map((segment, index) =>
                React.cloneElement(segment, {
                    selected: index === selectedIndex,
                    onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
                        selectSegment(index, segment, event),
                }),
            )}
        </ul>
    );

    // The menu is only built where the control was told to fall back to one, so a control that
    // never does carries none of it
    const hasDropdown = isResponsiveValue(variant) && Object.values(variant).includes("dropdown");

    if (!hasDropdown) {
        return control;
    }

    return (
        <>
            <div
                className={classes.dropdown}
                data-component="SegmentedControl.Dropdown"
                {...getResponsiveAttributes("variant", variant)}
            >
                <ActionMenu>
                    {/* The name of the control is only a fallback for one that was given no
                        label of its own to be read by. Either way the button says which
                        segment is the one being shown */}
                    <ActionMenu.Button
                        aria-label={
                            ariaLabel && `${getSegmentLabel(selectedSegment)}, ${ariaLabel}`
                        }
                        leadingVisual={getSegmentVisual(selectedSegment)}
                    >
                        {getSegmentLabel(selectedSegment)}
                    </ActionMenu.Button>
                    <ActionMenu.Overlay aria-labelledby={ariaLabelledBy}>
                        <ActionList selectionVariant="single">
                            {segments.map((segment, index) => {
                                const visual = getSegmentVisual(segment);

                                return (
                                    <ActionList.Item
                                        key={index}
                                        selected={index === selectedIndex}
                                        disabled={isSegmentDisabled(segment)}
                                        onSelect={(event) => selectSegment(index, segment, event)}
                                    >
                                        {visual ? (
                                            <ActionList.LeadingVisual>
                                                {renderSegmentVisual(visual)}
                                            </ActionList.LeadingVisual>
                                        ) : null}
                                        {getSegmentLabel(segment)}
                                    </ActionList.Item>
                                );
                            })}
                        </ActionList>
                    </ActionMenu.Overlay>
                </ActionMenu>
            </div>
            {control}
        </>
    );
}

SegmentedControl.displayName = "SegmentedControl";

export default SegmentedControl;
