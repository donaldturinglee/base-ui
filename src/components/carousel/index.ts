import CarouselBase from "./Carousel";
import CarouselControls from "./CarouselControls";
import CarouselIndicators from "./CarouselIndicators";
import CarouselNextButton from "./CarouselNextButton";
import CarouselPlayButton from "./CarouselPlayButton";
import CarouselPreviousButton from "./CarouselPreviousButton";
import CarouselSlide from "./CarouselSlide";

export const Carousel = Object.assign(CarouselBase, {
    Slide: CarouselSlide,
    Controls: CarouselControls,
    PreviousButton: CarouselPreviousButton,
    NextButton: CarouselNextButton,
    Indicators: CarouselIndicators,
    PlayButton: CarouselPlayButton,
});

export {
    CarouselSlide,
    CarouselControls,
    CarouselPreviousButton,
    CarouselNextButton,
    CarouselIndicators,
    CarouselPlayButton,
};
export { CarouselContext, CarouselSlideContext } from "./CarouselContext";
export * from "./Carousel.types";
