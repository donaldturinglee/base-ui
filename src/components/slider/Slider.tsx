import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SliderOrientation, SliderProps, SliderSize } from "./Slider.types";

const sliderVariants = cva(
    [
        // The browser's own track and thumb are taken away, and the pseudo-elements below stand
        // in for them. The fallback lives here, so a slider is drawn empty rather than unfilled
        // until it knows where it stands
        "m-0 p-0 appearance-none bg-transparent cursor-pointer [--slider-fill:0%] [--slider-disabled-opacity:0.5]",
        "[--slider-fill-color:var(--control-checked-background-color-rest)] [--slider-track-color:var(--control-track-background-color-rest)] [--slider-thumb-color:var(--control-knob-background-color-rest)] [--slider-thumb-border-color:var(--control-knob-border-color-rest)]",
        // A track drawn in colour says nothing in forced colours, so the fill is left to the
        // system and the thumb is drawn against it
        "forced-colors:[--slider-fill-color:Highlight] forced-colors:[--slider-track-color:Canvas] forced-colors:[--slider-thumb-color:ButtonFace] forced-colors:[--slider-thumb-border-color:ButtonText]",
        // The thickness runs across the control and the length along it, so writing it against
        // the block axis rather than against the height leaves the one rule serving both
        // orientations
        "[block-size:var(--slider-thickness)]",
        // The part behind the thumb is filled and the rest is left as track, drawn as one
        // gradient so that there is nothing laid over the track to keep in step with it. Which
        // way the gradient runs is the orientation's, since a gradient is drawn against the page
        // rather than against the writing mode
        "[&::-webkit-slider-runnable-track]:[block-size:var(--slider-track-size)] [&::-webkit-slider-runnable-track]:rounded-[var(--border-radius-full)] [&::-webkit-slider-runnable-track]:[background-image:linear-gradient(var(--slider-fill-direction),var(--slider-fill-color)_var(--slider-fill),var(--slider-track-color)_var(--slider-fill))] [&::-moz-range-track]:[block-size:var(--slider-track-size)] [&::-moz-range-track]:rounded-[var(--border-radius-full)] [&::-moz-range-track]:[background-image:linear-gradient(var(--slider-fill-direction),var(--slider-fill-color)_var(--slider-fill),var(--slider-track-color)_var(--slider-fill))]",
        // Webkit lays the thumb out from the near edge of the track, so it is pulled back by
        // half of what it stands over. Pulling it along the block axis centres it whichever way
        // the slider runs. Firefox centres it on the track already
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:size-[var(--slider-thumb-size)] [&::-webkit-slider-thumb]:[margin-block-start:calc((var(--slider-track-size)_-_var(--slider-thumb-size))/2)] [&::-webkit-slider-thumb]:rounded-[var(--border-radius-full)] [&::-webkit-slider-thumb]:bg-[var(--slider-thumb-color)] [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-[length:var(--border-width-thin)] [&::-webkit-slider-thumb]:border-[color:var(--slider-thumb-border-color)] [&::-webkit-slider-thumb]:[box-shadow:var(--shadow-resting-small)] [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:size-[var(--slider-thumb-size)] [&::-moz-range-thumb]:rounded-[var(--border-radius-full)] [&::-moz-range-thumb]:bg-[var(--slider-thumb-color)] [&::-moz-range-thumb]:border-solid [&::-moz-range-thumb]:border-[length:var(--border-width-thin)] [&::-moz-range-thumb]:border-[color:var(--slider-thumb-border-color)] [&::-moz-range-thumb]:[box-shadow:var(--shadow-resting-small)]",
        "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]",
        // A slider that cannot be used is faded rather than drained: where it stands is the
        // whole of what it says, and a track redrawn in grey would leave a reader working that
        // out from the shape of the thumb alone
        "disabled:cursor-not-allowed disabled:opacity-[var(--slider-disabled-opacity)]",
    ],
    {
        variants: {
            // The size says how thick the control stands as well as how big the two pieces it is
            // drawn from are, so the rules below only have to be written the once
            size: {
                small: "[--slider-thickness:var(--base-size-12)] [--slider-thumb-size:var(--base-size-12)] [--slider-track-size:var(--base-size-4)]",
                medium: "[--slider-thickness:var(--base-size-16)] [--slider-thumb-size:var(--base-size-16)] [--slider-track-size:var(--base-size-6)]",
                large: "[--slider-thickness:var(--base-size-20)] [--slider-thumb-size:var(--base-size-20)] [--slider-track-size:var(--base-size-8)]",
            } satisfies Record<SliderSize, string>,
            // A vertical writing mode is what stands a range input on its end; the right-to-left
            // inline direction is what puts the bottom of the range at the bottom of the track,
            // the way a fader reads rather than the way a page does. A browser too old for
            // either draws the slider lying down, which still works. The length is only a
            // starting height, since nothing else would give a slider standing up one
            orientation: {
                horizontal: "[--slider-fill-direction:to_right]",
                vertical:
                    "[writing-mode:vertical-lr] [direction:rtl] h-[var(--base-size-128)] [--slider-fill-direction:to_top]",
            } satisfies Record<SliderOrientation, string>,
            block: {
                true: "",
                false: "",
            },
        },
        // Filling means the width of what it stands in lying down, and the height of it
        // standing up
        compoundVariants: [
            { block: true, orientation: "horizontal", class: "block w-full" },
            { block: true, orientation: "vertical", class: "block h-full" },
        ],
    },
);

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
