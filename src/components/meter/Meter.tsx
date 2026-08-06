import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { clampToRange } from "../number-input/numberValue";
import { MeterContext } from "./MeterContext";
import MeterIndicator from "./MeterIndicator";
import MeterLabel from "./MeterLabel";
import MeterTrack from "./MeterTrack";
import MeterValue from "./MeterValue";
import { formatMeterValue, valueToPercent } from "./meterReading";
import type { MeterElementProps, MeterProps, MeterSize, MeterVariant } from "./Meter.types";

const classes = {
    header: "meter-header",
    hidden: "sr-only",
};

const meterVariants = cva("meter", {
    variants: {
        size: {
            small: "meter-small",
            medium: "meter-medium",
            large: "meter-large",
        } satisfies Record<MeterSize, string>,
        variant: {
            accent: "meter-accent",
            attention: "meter-attention",
            danger: "meter-danger",
            done: "meter-done",
            neutral: "meter-neutral",
            severe: "meter-severe",
            sponsors: "meter-sponsors",
            success: "meter-success",
        } satisfies Record<MeterVariant, string>,
    },
});

// A reading within a range that is already known: how much of the disk is taken, how loud the
// room is, how far through its quota an account has run.
//
//     <Meter value={72}>
//         <Meter.Label>Storage used</Meter.Label>
//         <Meter.Value />
//     </Meter>
//
// It is not a ProgressBar, which says how far through a piece of work something has got and is
// expected to reach the end of it. A meter is not going anywhere: it stands where it stands, and
// either end of it is as ordinary a place to be as the middle.
//
// The value is handed to the stylesheet as a custom property rather than turned into a width
// here, so how far the indicator runs is settled in the same place as the colour and the height
// it is drawn with. A meter given no groove of its own is drawn one, since a reading with nothing
// to read it against is only a number
function Meter<As extends React.ElementType = "div">(
    props: MeterProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        style,
        value,
        min = 0,
        max = 100,
        format,
        getAriaValueText,
        size = "medium",
        variant = "success",
        children,
        id: idProp,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props as unknown as MeterElementProps;

    const id = useId(idProp);
    const labelId = `${id}-label`;

    const [slots, extras] = useSlots(children, {
        label: MeterLabel,
        value: MeterValue,
        track: MeterTrack,
    });

    // A reading past either end of the range is brought back to the end it ran past, and one that
    // is no number at all is read as standing at the start rather than nowhere
    const clampedValue = clampToRange(Number.isNaN(value) ? min : value, min, max);
    const percentage = clampToRange(valueToPercent(clampedValue, min, max), 0, 100);

    const formattedValue = formatMeterValue(clampedValue, percentage, format);
    const valueText = getAriaValueText ? getAriaValueText(formattedValue, value) : formattedValue;

    // The meter is named after the line naming what it measures, unless the caller has named it
    // themselves
    const labelledBy = ariaLabelledBy ?? (slots.label && !ariaLabel ? labelId : undefined);

    const context = { value: clampedValue, percentage, formattedValue, labelId };

    return (
        <MeterContext.Provider value={context}>
            <Component
                ref={ref}
                id={idProp}
                role="meter"
                aria-valuenow={clampedValue}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuetext={valueText}
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                className={classNames(meterVariants({ size, variant }), className)}
                style={
                    {
                        ...style,
                        "--meter-percentage": `${percentage}%`,
                    } as React.CSSProperties
                }
                data-component="Meter"
                data-size={size}
                data-variant={variant}
                data-value={clampedValue}
                {...rest}
            >
                {/* The name is set at the start and the reading at the end, so a meter carrying
                    both lays out without being told where either stands */}
                {slots.label || slots.value ? (
                    <span className={classes.header}>
                        {slots.label}
                        {slots.value}
                    </span>
                ) : null}

                {slots.track ?? (
                    <MeterTrack>
                        <MeterIndicator />
                    </MeterTrack>
                )}

                {extras}

                {/* A meter carries its reading in an attribute rather than in anything that can
                    be read off the page, and NVDA passes over an element whose contents are all
                    attribute. One character it will not draw is enough to have it stop and read
                    the name and the reading out. See mui/base-ui#4184 */}
                <span role="presentation" className={classes.hidden}>
                    x
                </span>
            </Component>
        </MeterContext.Provider>
    );
}

Meter.displayName = "Meter";

export default fixedForwardRef(Meter);
