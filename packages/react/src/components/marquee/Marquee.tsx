import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { MarqueeContext } from "./MarqueeContext";
import { useMarquee } from "./useMarquee";
import type { MarqueeElementProps, MarqueeProps, MarqueeSide } from "./Marquee.types";

const classes = {
    root: "marquee",
};

// How far the run travels in a second where the caller has not said. Slow enough that what goes
// by can be read on the way, quick enough that a reader waiting on the end of the run is not
// left waiting on it
export const DEFAULT_MARQUEE_SPEED = 50;

// How many copies a run stands in where it is not being drawn out to fill the window. Two is
// what an unbroken run takes: the second stands where the first was as the first leaves
const DEFAULT_COPY_COUNT = 2;

// Which way the run reads, which is the side it heads towards read as an axis
const isVertical = (side: MarqueeSide) => side === "top" || side === "bottom";

// A run of things travelling past a window cut in the page: logos, headlines, anything short
// enough to be taken in as it goes by.
//
//     <Marquee>
//         <Marquee.Edge side="start" />
//         <Marquee.Viewport>
//             <Marquee.Content>
//                 {sponsors.map((sponsor) => (
//                     <Marquee.Item key={sponsor.name}>{sponsor.name}</Marquee.Item>
//                 ))}
//             </Marquee.Content>
//         </Marquee.Viewport>
//         <Marquee.Edge side="end" />
//     </Marquee>
//
// The marquee itself draws nothing but the ground the parts stand on. It is where the run is
// named, timed and held, since every one of those is the run's rather than any one part's, and
// the parts read what they need of it from here rather than being handed it again by the caller.
//
// The run is given a speed rather than a duration, so what it holds can change without it
// travelling any faster or slower, and it is measured rather than guessed at: the window and one
// copy of the run hand back what they came out as, and between them they say how long the run
// takes to go by and how many copies it takes to leave no gap behind it
function Marquee<As extends React.ElementType = "div">(
    props: MarqueeProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        side = "start",
        speed = DEFAULT_MARQUEE_SPEED,
        delay = 0,
        loopCount = 0,
        autoFill = false,
        spacing,
        reverse = false,
        paused,
        defaultPaused,
        pauseOnInteraction = true,
        onPauseChange,
        onLoopComplete,
        onComplete,
        children,
        ...rest
    } = props as unknown as MarqueeElementProps;

    const marquee = useMarquee({ paused, defaultPaused, onPauseChange });

    const vertical = isVertical(side);

    const viewportRef = React.useRef<HTMLElement>(null);
    const copyRef = React.useRef<HTMLElement>(null);

    // What the window and one copy of the run came out as. The parts hand their elements back
    // through the context, and both are watched rather than measured the once, since either can
    // change under a run that is already going
    const [viewportSize, setViewportSize] = React.useState(0);
    const [copySize, setCopySize] = React.useState(0);

    useIsomorphicLayoutEffect(() => {
        const viewport = viewportRef.current;
        const copy = copyRef.current;

        if (viewport === null || copy === null) {
            return;
        }

        // Nothing is written back where nothing has changed, since the observer reports a
        // window being laid out again whether or not it came out any different
        const measure = () => {
            const nextViewportSize = vertical ? viewport.clientHeight : viewport.clientWidth;
            const nextCopySize = vertical ? copy.offsetHeight : copy.offsetWidth;

            setViewportSize((current) =>
                current === nextViewportSize ? current : nextViewportSize,
            );
            setCopySize((current) => (current === nextCopySize ? current : nextCopySize));
        };

        measure();

        // A run whose contents change is measured again by the same watch, since something
        // else to carry is something else to be as long as
        const observer = new ResizeObserver(measure);
        observer.observe(viewport);
        observer.observe(copy);

        return () => {
            observer.disconnect();
        };
    }, [vertical]);

    // A run stands in as many copies as it takes for one to follow the last without a gap
    // behind it: enough of them to cover the window, and one more so that there is always
    // something coming in
    const copyCount =
        autoFill && copySize > 0
            ? Math.max(Math.ceil(viewportSize / copySize) + 1, DEFAULT_COPY_COUNT)
            : DEFAULT_COPY_COUNT;

    // How long one copy takes to cross its own length at the speed asked for
    const duration = copySize > 0 && speed > 0 ? copySize / speed : 0;

    const { style, onMouseEnter, onMouseLeave, onFocus, onBlur, ...boxProps } =
        rest as React.HTMLAttributes<HTMLElement>;

    // Held rather than stopped: a reader reading something that is on its way out of the window
    // is not read on past. This is kept apart from the run's own state, so a caller holding that
    // is not told about a pointer resting on the run and is not fought over by it
    const [isInteracting, setIsInteracting] = React.useState(false);

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        onMouseEnter?.(event);

        if (pauseOnInteraction) {
            setIsInteracting(true);
        }
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
        onMouseLeave?.(event);
        setIsInteracting(false);
    };

    const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
        onFocus?.(event);

        if (pauseOnInteraction) {
            setIsInteracting(true);
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
        onBlur?.(event);

        // Focus moving from one thing in the run to another has not left it
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsInteracting(false);
        }
    };

    const isPaused = marquee.paused || isInteracting;

    const context = {
        ...marquee,
        side,
        orientation: vertical ? ("vertical" as const) : ("horizontal" as const),
        copyCount,
        viewportRef,
        copyRef,
        onLoopComplete,
        onComplete,
    };

    return (
        <MarqueeContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(classes.root, className)}
                style={
                    {
                        ...style,
                        "--marquee-duration": `${duration}s`,
                        "--marquee-delay": `${delay}ms`,
                        "--marquee-loop-count": loopCount > 0 ? `${loopCount}` : "infinite",
                        ...(spacing === undefined ? null : { "--marquee-spacing": spacing }),
                    } as React.CSSProperties
                }
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                data-component="Marquee"
                data-orientation={vertical ? "vertical" : "horizontal"}
                data-side={side}
                data-reverse={reverse || undefined}
                data-paused={isPaused || undefined}
                // A run sets off once there is something to time it by. A copy that has not been
                // measured has no length to cross and no duration to cross it in, and standing
                // still is nearer to what it will look like than crossing it in no time at all
                data-running={copySize > 0 || undefined}
                {...boxProps}
            >
                {children}
            </Component>
        </MarqueeContext.Provider>
    );
}

Marquee.displayName = "Marquee";

export default fixedForwardRef(Marquee);
