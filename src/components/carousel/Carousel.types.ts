import type * as React from "react";

// What brought a slide into view, so a caller can tell a press apart from the clock
export type CarouselChangeReason = "previous" | "next" | "indicator" | "auto";

// A carousel is a landmark of its own, so it has to be named either in its own words or by
// something already on the page
type CarouselLabel = { "aria-label": string } | { "aria-labelledby": string };

// `onChange` means something else on a plain section, so the section's own version is dropped
// in favour of the carousel's
export type CarouselProps = Omit<React.ComponentPropsWithoutRef<"section">, "onChange"> &
    CarouselLabel & {
        // Which slide is showing, where the caller keeps hold of it
        index?: number;
        // Which slide starts out showing, where the carousel keeps hold of it itself
        defaultIndex?: number;
        // Called with the slide that has just come into view, and with what brought it there
        onChange?: (index: number, reason: CarouselChangeReason) => void;
        // Whether moving past either end comes round to the other
        loop?: boolean;
        // Moves on by itself, and holds still while a reader is on it
        autoPlay?: boolean;
        // How long each slide is held before the next one, in milliseconds
        interval?: number;
        className?: string;
    };

export type CarouselSlideProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type CarouselControlsProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type CarouselIndicatorsProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// The buttons carry an icon and nothing else, and the carousel names each of them for a screen
// reader, so there is nothing left for a caller to put in them or to call them
type CarouselButtonProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "aria-label" | "aria-labelledby"
> & {
    className?: string;
};

export type CarouselPreviousButtonProps = CarouselButtonProps;

export type CarouselNextButtonProps = CarouselButtonProps;

export type CarouselPlayButtonProps = CarouselButtonProps;

export type CarouselContextValue = {
    // Which slide is showing, and how many there are to move between
    index: number;
    count: number;
    loop: boolean;
    // Whether the carousel was told it may move on by itself, and whether it is doing so
    autoPlay: boolean;
    isPlaying: boolean;
    goTo: (index: number, reason: CarouselChangeReason) => void;
    previous: () => void;
    next: () => void;
    togglePlaying: () => void;
    // The id of the run of slides, which the buttons beneath it point at
    slidesId: string;
};

// Handed to each slide in turn, so a slide can say where in the run it stands without being
// told by a prop
export type CarouselSlideContextValue = {
    index: number;
};
