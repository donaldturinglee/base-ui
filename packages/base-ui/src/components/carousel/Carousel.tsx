import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CarouselContext, CarouselSlideContext } from "./CarouselContext";
import CarouselControls from "./CarouselControls";
import CarouselSlide from "./CarouselSlide";
import type { CarouselChangeReason, CarouselProps } from "./Carousel.types";

const classes = {
    root: "carousel",
    viewport: "carousel-viewport",
    track: "carousel-track",
    // The run moves where a reader is happy to watch it move, and cuts straight to the slide
    // where they are not
    motion: "motion-safe:[transition:translate_var(--motion-transition-state-change)]",
};

// How long each slide is held before the next one, where the caller has not said
const DEFAULT_INTERVAL = 5000;

// Where a step lands. A run that comes round carries on past either end; one that does not
// stops there rather than going past it
const getSlideIndex = (next: number, count: number, loop: boolean) => {
    if (count <= 0) {
        return 0;
    }

    if (loop) {
        return ((next % count) + count) % count;
    }

    return Math.min(Math.max(next, 0), count - 1);
};

// A run of slides shown one at a time, stepped through by the bar beneath it. The slides are
// written straight into the carousel; anything else given to it stands below the bar
function Carousel(
    props: CarouselProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        index,
        defaultIndex = 0,
        onChange,
        loop = false,
        autoPlay = false,
        interval = DEFAULT_INTERVAL,
        ...rest
    } = props as CarouselProps & { "aria-label"?: string; "aria-labelledby"?: string };

    const slidesId = useId();

    // A carousel the caller is holding the state of takes what is showing from the prop; one
    // that is not keeps its own
    const isControlled = index !== undefined;
    const [selfIndex, setSelfIndex] = React.useState(defaultIndex);

    // A run only moves on by itself once it has been told it may, and stops for good once the
    // reader says so
    const [isPlaying, setIsPlaying] = React.useState(autoPlay);
    // Held rather than stopped: a reader reading a slide is not read on past
    const [isPaused, setIsPaused] = React.useState(false);

    // Kept to one side so that a caller handing over a fresh callback on every render does not
    // put the clock below back to the start of the slide
    const latestOnChange = React.useRef(onChange);

    useIsomorphicLayoutEffect(() => {
        latestOnChange.current = onChange;
    }, [onChange]);

    // The slides are picked out of the children so the carousel knows how long the run is; a
    // bar of the caller's own takes the place of the default one, and the rest stands below
    const slides: React.ReactElement[] = [];
    const extras: React.ReactNode[] = [];
    let controls: React.ReactNode = null;

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
            extras.push(child);
            return;
        }

        if (child.type === CarouselSlide) {
            slides.push(child);
            return;
        }

        if (child.type === CarouselControls && controls === null) {
            controls = child;
            return;
        }

        extras.push(child);
    });

    const count = slides.length;
    const currentIndex = getSlideIndex(isControlled ? index : selfIndex, count, loop);

    const goTo = (next: number, reason: CarouselChangeReason) => {
        const landing = getSlideIndex(next, count, loop);

        if (!isControlled) {
            setSelfIndex(landing);
        }

        latestOnChange.current?.(landing, reason);
    };

    // A run moves on by itself only while it is playing, only while the reader is off it, and
    // only where there is somewhere else to go
    React.useEffect(() => {
        if (!isPlaying || isPaused || count < 2) {
            return;
        }

        const timer = window.setTimeout(() => {
            // A run that has reached its end and does not come round stops there, rather than
            // holding on a slide that is never going to change
            if (!loop && currentIndex >= count - 1) {
                setIsPlaying(false);
                return;
            }

            const landing = getSlideIndex(currentIndex + 1, count, loop);

            if (!isControlled) {
                setSelfIndex(landing);
            }

            latestOnChange.current?.(landing, "auto");
        }, interval);

        return () => {
            window.clearTimeout(timer);
        };
    }, [isPlaying, isPaused, count, currentIndex, interval, loop, isControlled]);

    const context = {
        index: currentIndex,
        count,
        loop,
        autoPlay,
        isPlaying,
        goTo,
        previous: () => goTo(currentIndex - 1, "previous"),
        next: () => goTo(currentIndex + 1, "next"),
        togglePlaying: () => setIsPlaying((playing) => !playing),
        slidesId,
    };

    const { onMouseEnter, onMouseLeave, onFocus, onBlur, ...sectionProps } =
        rest as React.ComponentPropsWithoutRef<"section">;

    // A run holds still while a reader is on it, whether they arrived with a pointer or with
    // the keyboard, and picks up again once they have moved off
    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        onMouseEnter?.(event);
        setIsPaused(true);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        onMouseLeave?.(event);
        setIsPaused(false);
    };

    const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
        onFocus?.(event);
        setIsPaused(true);
    };

    const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
        onBlur?.(event);

        // Focus moving from one part of the carousel to another has not left it
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsPaused(false);
        }
    };

    const isRotating = isPlaying && !isPaused;

    return (
        <CarouselContext.Provider value={context}>
            <section
                ref={ref}
                aria-roledescription="carousel"
                className={classNames(classes.root, className)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                data-component="Carousel"
                data-count={count}
                data-index={currentIndex}
                data-playing={isRotating || undefined}
                {...sectionProps}
            >
                <div
                    id={slidesId}
                    className={classes.viewport}
                    // The run is announced as it is stepped through by hand, and left alone
                    // while it is moving on by itself, so a reader is not interrupted every
                    // few seconds by a slide they did not ask for
                    aria-live={isRotating ? "off" : "polite"}
                    aria-atomic="false"
                    data-component="Carousel.Viewport"
                >
                    <div
                        className={classNames(classes.track, classes.motion)}
                        style={{ "--carousel-index": currentIndex } as React.CSSProperties}
                        data-component="Carousel.Track"
                    >
                        {slides.map((slide, position) => (
                            <CarouselSlideContext.Provider
                                key={slide.key ?? position}
                                value={{ index: position }}
                            >
                                {slide}
                            </CarouselSlideContext.Provider>
                        ))}
                    </div>
                </div>

                {controls ?? <CarouselControls />}
                {extras}
            </section>
        </CarouselContext.Provider>
    );
}

Carousel.displayName = "Carousel";

export default fixedForwardRef(Carousel);
