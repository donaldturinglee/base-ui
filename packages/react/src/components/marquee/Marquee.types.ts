import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Which end of the window the run heads towards. The two along the line are named for the end
// rather than for a hand, so a run set going leftwards where the page is read left to right
// goes rightwards where it is read the other way
export type MarqueeSide = "start" | "end" | "top" | "bottom";

// Whether the run reads across or down, which follows from the side it heads towards rather
// than being asked for on its own
export type MarqueeOrientation = "horizontal" | "vertical";

// Whether the run is standing still. The marquee and the hook behind it are told the same way,
// so a run held by a control of the caller's own and one left to hold itself are set up alike
type MarqueePauseProps = {
    // Whether the run is held still, where the caller keeps hold of it
    paused?: boolean;
    // Whether it starts out held still, where the marquee keeps hold of it itself
    defaultPaused?: boolean;
};

type MarqueePauseCallback = {
    // Called with whether the run has just been held still
    onPauseChange?: (paused: boolean) => void;
};

type MarqueeCallbacks = MarqueePauseCallback & {
    // Called each time the run has come round, with how many times it has done so
    onLoopComplete?: (loops: number) => void;
    // Called once a run that was given a number of times to go round has finished the last of
    // them. A run that goes round for good never reaches this
    onComplete?: () => void;
};

export type UseMarqueeProps = MarqueePauseProps & MarqueePauseCallback;

export type UseMarqueeReturn = {
    // Whether the run is standing still
    paused: boolean;
    // Holds the run where it is
    pause: () => void;
    // Sets it going again from where it was held
    resume: () => void;
    // Holds a run that is going, and sets going a run that is held
    toggle: () => void;
    // Holds or releases the run outright
    setPaused: (paused: boolean) => void;
};

type MarqueeOwnProps = MarqueePauseProps & {
    // Which end of the window the run heads towards
    side?: MarqueeSide;
    // How far the run travels in a second, in pixels. A speed rather than a duration, so that
    // a longer run takes longer to go by instead of going by faster
    speed?: number;
    // How long the run waits before it sets off, in milliseconds
    delay?: number;
    // How many times the run goes round. Nought goes round for as long as it is on the page
    loopCount?: number;
    // Draws out as many copies as it takes to fill the window, for a run too short to fill it
    // on its own and which would otherwise leave a gap behind it
    autoFill?: boolean;
    // The gap left between one thing in the run and the next, as a CSS length
    spacing?: string;
    // Sends the run the other way without renaming the end it heads towards
    reverse?: boolean;
    // Holds the run still while a reader is on it, whether they arrived with a pointer or with
    // the keyboard
    pauseOnInteraction?: boolean;
    // Fades the run out where it meets either edge of the window rather than cutting it off
    edges?: boolean;
    className?: string;
};

export type MarqueeProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    MarqueeOwnProps
> &
    MarqueeCallbacks;

// The same props at the element a marquee renders by default, for reading inside the component
export type MarqueeElementProps = MarqueeProps<"div">;
