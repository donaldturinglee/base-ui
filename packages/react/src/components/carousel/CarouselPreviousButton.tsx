import * as React from "react";
import { ChevronLeftRegular } from "@gamecrafters/base-ui-icons";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { CarouselContext } from "./CarouselContext";
import type { CarouselPreviousButtonProps } from "./Carousel.types";

// Steps the run back by one. The carousel around the button is what it asks to move, so a bar
// of the caller's own does not have to be told how
function CarouselPreviousButton(
    props: CarouselPreviousButtonProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onClick, ...rest } = props;
    const { index, loop, previous, slidesId } = React.useContext(CarouselContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
            previous();
        }
    };

    return (
        <IconButton
            ref={ref}
            icon={ChevronLeftRegular}
            aria-label="Previous slide"
            aria-controls={slidesId || undefined}
            variant="invisible"
            // A run that does not come round has nothing standing before its first slide
            disabled={!loop && index <= 0}
            onClick={handleClick}
            className={className}
            data-component="Carousel.PreviousButton"
            {...rest}
        />
    );
}

CarouselPreviousButton.displayName = "Carousel.PreviousButton";

export default fixedForwardRef(CarouselPreviousButton);
