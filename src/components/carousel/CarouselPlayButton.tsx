import * as React from "react";
import { PauseRegular, PlayRegular } from "@gamecrafters/base-ui-icons";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { CarouselContext } from "./CarouselContext";
import type { CarouselPlayButtonProps } from "./Carousel.types";

// Starts and stops a run that moves on by itself. A carousel that moves without being asked to
// has to be able to be stopped, so this stands in the bar for as long as it may move at all
function CarouselPlayButton(
    props: CarouselPlayButtonProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onClick, ...rest } = props;
    const { isPlaying, togglePlaying, slidesId } = React.useContext(CarouselContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
            togglePlaying();
        }
    };

    return (
        <IconButton
            ref={ref}
            icon={isPlaying ? PauseRegular : PlayRegular}
            // The name says what pressing the button does rather than what the run is doing
            aria-label={isPlaying ? "Stop automatic slide show" : "Start automatic slide show"}
            aria-controls={slidesId || undefined}
            variant="invisible"
            onClick={handleClick}
            className={className}
            data-component="Carousel.PlayButton"
            data-playing={isPlaying || undefined}
            {...rest}
        />
    );
}

CarouselPlayButton.displayName = "Carousel.PlayButton";

export default fixedForwardRef(CarouselPlayButton);
