import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CarouselContext } from "./CarouselContext";
import CarouselIndicators from "./CarouselIndicators";
import CarouselNextButton from "./CarouselNextButton";
import CarouselPlayButton from "./CarouselPlayButton";
import CarouselPreviousButton from "./CarouselPreviousButton";
import type { CarouselControlsProps } from "./Carousel.types";

const classes = {
    root: "flex items-center justify-center gap-[var(--base-size-8)]",
};

// The bar beneath the run. Left empty it holds the steps, the dots and, where the run may move
// on by itself, the button that stops it; given children it holds those instead
function CarouselControls(
    props: CarouselControlsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const { autoPlay } = React.useContext(CarouselContext);

    const hasChildren = React.Children.toArray(children).length > 0;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Carousel.Controls"
            {...rest}
        >
            {hasChildren ? (
                children
            ) : (
                <>
                    <CarouselPreviousButton />
                    <CarouselIndicators />
                    <CarouselNextButton />
                    {autoPlay ? <CarouselPlayButton /> : null}
                </>
            )}
        </div>
    );
}

CarouselControls.displayName = "Carousel.Controls";

export default fixedForwardRef(CarouselControls);
