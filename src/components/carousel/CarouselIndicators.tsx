import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CarouselContext } from "./CarouselContext";
import type { CarouselIndicatorsProps } from "./Carousel.types";

const classes = {
    root: "carousel-indicators",
    dot: "carousel-indicator",
    current: "carousel-indicator-current",
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
                        className={classNames(classes.dot, isCurrent && classes.current)}
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
