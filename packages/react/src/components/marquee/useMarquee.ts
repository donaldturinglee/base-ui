import * as React from "react";
import type { UseMarqueeProps, UseMarqueeReturn } from "./Marquee.types";

// Everything a run needs to be held and let go of and nothing that draws one: whether it is
// standing still, and the ways of changing that. The marquee is built on this, so a control of
// the caller's own is working from the same state the run is.
//
//     const marquee = useMarquee();
//
//     <Marquee paused={marquee.paused}>{items}</Marquee>
//     <Button onClick={marquee.toggle}>{marquee.paused ? "Play" : "Pause"}</Button>
export const useMarquee = (props: UseMarqueeProps = {}): UseMarqueeReturn => {
    const { paused, defaultPaused, onPauseChange } = props;

    // A caller holding the state takes it from the prop; one that is not leaves the hook
    // holding it instead
    const isControlled = paused !== undefined;
    const [selfPaused, setSelfPaused] = React.useState(defaultPaused ?? false);
    const isPaused = isControlled ? paused : selfPaused;

    const setPaused = (next: boolean) => {
        // Holding a run that is already held is not a change, and is not reported as one
        if (next === isPaused) {
            return;
        }

        if (!isControlled) {
            setSelfPaused(next);
        }

        onPauseChange?.(next);
    };

    return {
        paused: isPaused,
        pause: () => setPaused(true),
        resume: () => setPaused(false),
        toggle: () => setPaused(!isPaused),
        setPaused,
    };
};
