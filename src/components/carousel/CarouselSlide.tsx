import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CarouselContext, CarouselSlideContext } from "./CarouselContext";
import type { CarouselSlideProps } from "./Carousel.types";

const classes = {
    root: "carousel-slide",
};

// One slide of the run. Where in the run it stands is taken from the carousel around it rather
// than counted out by the caller
function CarouselSlide(
    props: CarouselSlideProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const { index: current, count } = React.useContext(CarouselContext);
    const { index } = React.useContext(CarouselSlideContext);

    const isCurrent = index === current;

    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            // A reader stepping through the run is told how far into it they have got
            aria-label={`${index + 1} of ${count}`}
            // A slide that has been stepped past is out of the way as well as out of sight, so
            // nothing standing in one is read out or tabbed into from off screen
            inert={!isCurrent}
            className={classNames(classes.root, className)}
            data-component="Carousel.Slide"
            data-current={isCurrent || undefined}
            {...rest}
        />
    );
}

CarouselSlide.displayName = "Carousel.Slide";

export default fixedForwardRef(CarouselSlide);
