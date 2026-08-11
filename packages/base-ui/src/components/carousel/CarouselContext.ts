import { createContext } from "react";
import type { CarouselContextValue, CarouselSlideContextValue } from "./Carousel.types";

const noop = () => {};

// The defaults stand for a carousel with nothing in it, so a part rendered outside one draws
// itself rather than throwing
export const CarouselContext = createContext<CarouselContextValue>({
    index: 0,
    count: 0,
    loop: false,
    autoPlay: false,
    isPlaying: false,
    goTo: noop,
    previous: noop,
    next: noop,
    togglePlaying: noop,
    slidesId: "",
});

export const CarouselSlideContext = createContext<CarouselSlideContextValue>({ index: 0 });
