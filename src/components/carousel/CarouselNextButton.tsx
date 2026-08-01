import * as React from "react";
import { ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { CarouselContext } from "./CarouselContext";
import type { CarouselNextButtonProps } from "./Carousel.types";

// Steps the run on by one. The carousel around the button is what it asks to move, so a bar of
// the caller's own does not have to be told how
function CarouselNextButton(
    props: CarouselNextButtonProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onClick, ...rest } = props;
    const { index, count, loop, next, slidesId } = React.useContext(CarouselContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
            next();
        }
    };

    return (
        <IconButton
            ref={ref}
            icon={ChevronRightRegular}
            aria-label="Next slide"
            aria-controls={slidesId || undefined}
            variant="invisible"
            // A run that does not come round has nothing standing after its last slide
            disabled={!loop && index >= count - 1}
            onClick={handleClick}
            className={className}
            data-component="Carousel.NextButton"
            {...rest}
        />
    );
}

CarouselNextButton.displayName = "Carousel.NextButton";

export default fixedForwardRef(CarouselNextButton);
