import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CarouselContext } from "./CarouselContext";
import type { CarouselIndicatorsProps } from "./Carousel.types";

const classes = {
    root: "flex items-center justify-center gap-[var(--base-size-4)]",
    dot: "shrink-0 p-0 m-0 size-[var(--base-size-8)] appearance-none border-0 rounded-[var(--border-radius-full)] bg-[var(--control-track-background-color-rest)] cursor-pointer transition-[background-color] duration-micro ease-hover hover:bg-[var(--control-track-background-color-hover)]",
    // The ring is drawn outside the dot, which is too small to hold one within it
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--base-size-2)]",
    // The hover fill is restated so the slide being shown keeps its colour under the pointer
    current:
        "bg-[var(--control-checked-background-color-rest)] hover:bg-[var(--control-checked-background-color-rest)]",
    // A dot drawn in colour says nothing in forced colours, so the run is marked out by an
    // outline instead and the one being shown is filled
    forcedColors:
        "forced-colors:[forced-color-adjust:none] forced-colors:bg-[color:Canvas] forced-colors:outline-solid forced-colors:outline-[length:var(--border-width-thin)] forced-colors:outline-[color:ButtonText]",
    currentForcedColors: "forced-colors:bg-[color:Highlight]",
};

// A dot for each slide, saying how long the run is and where in it the reader stands
function CarouselIndicators(
    props: CarouselIndicatorsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const { index, count, goTo, slidesId } = React.useContext(CarouselContext);

    // Nothing to point at, so nothing to draw
    if (count === 0) {
        return null;
    }

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Carousel.Indicators"
            {...rest}
        >
            {Array.from({ length: count }, (_, position) => {
                const isCurrent = position === index;

                return (
                    <button
                        key={position}
                        type="button"
                        aria-label={`Slide ${position + 1}`}
                        aria-current={isCurrent || undefined}
                        aria-controls={slidesId || undefined}
                        onClick={() => goTo(position, "indicator")}
                        className={classNames(
                            classes.dot,
                            classes.focus,
                            classes.forcedColors,
                            isCurrent && classes.current,
                            isCurrent && classes.currentForcedColors,
                        )}
                        data-component="Carousel.Indicator"
                        data-current={isCurrent || undefined}
                    />
                );
            })}
        </div>
    );
}

CarouselIndicators.displayName = "Carousel.Indicators";

export default fixedForwardRef(CarouselIndicators);
