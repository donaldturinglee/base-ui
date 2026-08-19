import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useMarquee } from "./useMarquee";
import type { MarqueeProps, MarqueeSide, MarqueeSpacing } from "./Marquee.types";

const classes = {
    track: "marquee-track",
    group: "marquee-group",
};

const marqueeVariants = cva("marquee", {
    variants: {
        // The travel is described once and played backwards for the side facing the other way,
        // rather than being written out twice
        side: {
            start: "marquee-inline",
            end: "marquee-inline marquee-reversed",
            top: "marquee-block",
            bottom: "marquee-block marquee-reversed",
        } satisfies Record<MarqueeSide, string>,
        spacing: {
            none: "marquee-spacing-none",
            tight: "marquee-spacing-tight",
            condensed: "marquee-spacing-condensed",
            cozy: "marquee-spacing-cozy",
            normal: "marquee-spacing-normal",
            spacious: "marquee-spacing-spacious",
        } satisfies Record<MarqueeSpacing, string>,
        pauseOnHover: {
            true: "marquee-pause-on-hover",
            false: "",
        },
        paused: {
            true: "marquee-paused",
            false: "",
        },
    },
});

// A run of content that travels across its own width and comes round again, for a band of logos
// or a line of notices too long to stand still in the room there is for it.
//
// The loop is made of copies rather than of one run restarting: by the time the track has moved
// the width of a single copy, the next copy is standing exactly where the first one was, so
// there is no point at which the content jumps back. Only the first copy is read out; the rest
// are there to keep the run from emptying and are kept out of the accessibility tree.
//
// Content that moves on its own is content some readers cannot hold still, so a run that has
// been asked to stop moving stops: where reduced motion has been asked for it stands where it
// is and is scrolled by hand instead
function Marquee(
    props: MarqueeProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        style,
        side = "start",
        speed = "medium",
        // Left to the stylesheet, which falls back to the same spacing a Stack uses when it is
        // not given one either
        spacing,
        pauseOnHover = true,
        paused = false,
        ...rest
    } = props;

    // How far the track travels, how long it takes, and how many copies that takes are all worked
    // out from the content itself, along whichever axis the run travels
    const { rootRef, groupRef, axis, copies, style: marqueeStyle } = useMarquee({ side, speed });
    const mergedRef = useMergedRefs(ref, rootRef);

    return (
        <div
            ref={mergedRef}
            className={classNames(
                marqueeVariants({ side, spacing, pauseOnHover, paused }),
                className,
            )}
            // The measured properties come last, so a style of the caller's own sits alongside
            // them rather than wiping out what the loop is worked from
            style={{ ...style, ...marqueeStyle }}
            data-component="Marquee"
            data-side={side}
            data-axis={axis}
            data-speed={speed}
            data-spacing={spacing}
            data-paused={paused}
            {...rest}
        >
            <div className={classes.track}>
                {Array.from({ length: copies }, (_, index) => (
                    <div
                        key={index}
                        ref={index === 0 ? groupRef : undefined}
                        // The first copy is the content; the rest are there to keep the run from
                        // emptying, and would otherwise be read out once for every copy
                        aria-hidden={index === 0 ? undefined : true}
                        className={classes.group}
                        data-component="Marquee.Group"
                    >
                        {children}
                    </div>
                ))}
            </div>
        </div>
    );
}

Marquee.displayName = "Marquee";

export default fixedForwardRef(Marquee);
