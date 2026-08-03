import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SliderOrientation, SliderProps, SliderSize } from "./Slider.types";

const sliderVariants = cva("slider", {
    variants: {
        size: {
            small: "slider-small",
            medium: "slider-medium",
            large: "slider-large",
        } satisfies Record<SliderSize, string>,
        orientation: {
            horizontal: "slider-horizontal",
            vertical: "slider-vertical",
        } satisfies Record<SliderOrientation, string>,
        block: {
            true: "",
            false: "",
        },
    },
    // Filling means the width of what it stands in lying down, and the height of it standing up
    compoundVariants: [
        { block: true, orientation: "horizontal", class: "slider-block-horizontal" },
        { block: true, orientation: "vertical", class: "slider-block-vertical" },
    ],
});

// How far along the track the slider stands, as a share of the whole of it
const getFill = (value: number, min: number, max: number) => {
    if (max <= min) {
        return 0;
    }

    const fill = ((value - min) / (max - min)) * 100;

    return Math.min(Math.max(fill, 0), 100);
};

// A control for picking a number out of a range by sliding along it. The native control does
// the pointing, the dragging and the arrow keys; everything here is what it is drawn as
function Slider(
    props: SliderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        size = "medium",
        orientation = "horizontal",
        block,
        min = 0,
        max = 100,
        step = 1,
        value,
        defaultValue,
        disabled,
        onChange,
        ...rest
    } = props;

    // A slider the caller is holding the value of takes where it stands from the prop; one
    // that is not keeps its own, since the fill has to be worked out from it either way
    const isControlled = value !== undefined;
    const [selfValue, setSelfValue] = React.useState(() => defaultValue ?? min);
    const currentValue = isControlled ? value : selfValue;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = Number(event.currentTarget.value);

        if (!isControlled) {
            setSelfValue(next);
        }

        onChange?.(next, event);
    };

    return (
        <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            disabled={disabled}
            onChange={handleChange}
            className={classNames(sliderVariants({ size, orientation, block }), className)}
            style={
                {
                    ...style,
                    "--slider-fill": `${getFill(currentValue, min, max)}%`,
                } as React.CSSProperties
            }
            // A slider is read as lying down unless it says otherwise
            aria-orientation={orientation === "vertical" ? "vertical" : undefined}
            data-component="Slider"
            data-size={size}
            data-orientation={orientation}
            data-block={block}
            data-disabled={disabled}
            {...rest}
        />
    );
}

Slider.displayName = "Slider";

export default fixedForwardRef(Slider);
