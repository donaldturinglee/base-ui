import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useMarquee } from "./useMarquee";
import type { MarqueeElementProps, MarqueeProps, MarqueeSide } from "./Marquee.types";

const classes = {
    root: "marquee",
    viewport: "marquee-viewport",
    content: "marquee-content",
    edge: "marquee-edge",
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
//     <Marquee edges>
//         {sponsors.map((sponsor) => (
//             <Image key={sponsor.name} src={sponsor.logo} alt={sponsor.name} />
//         ))}
//     </Marquee>
//
// What it is given is laid out in copies, one behind the other, and each copy travels its own
// length and starts over; a copy leaving the window is replaced by the one behind it, which is
// what makes a run that has no end to reach. Only the first copy is read, since the rest are
// there to keep the run going rather than to say anything a reader has not already been told.
//
// The run is given a speed rather than a duration, so what it holds can change without it
// travelling any faster or slower, and it is measured rather than guessed at: a run is timed by
// how long it is, and drawn out to as many copies as the window in front of it takes
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
        edges = false,
        onPauseChange,
        onLoopComplete,
        onComplete,
        children,
        ...rest
    } = props as unknown as MarqueeElementProps;

    const marquee = useMarquee({ paused, defaultPaused, onPauseChange });

    const vertical = isVertical(side);

    const viewportRef = React.useRef<HTMLDivElement>(null);
    const copyRef = React.useRef<HTMLDivElement>(null);

    // The window and one copy of the run, which between them say how long the run takes to go
    // by and how many copies it stands in. Both are watched rather than measured the once,
    // since either can change under a run that is already going
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

    // The run reports each time it comes round, and once more where it was given a number of
    // times to go round and has finished the last of them. The times are counted here rather
    // than read off the animation, which starts over the moment anything about it changes
    const loops = React.useRef(0);

    // Something in the run with an animation of its own reaches the copy on its way up the
    // page, and is not the run coming round
    const isOwnAnimation = (event: React.AnimationEvent<HTMLElement>) =>
        event.target === event.currentTarget;

    const handleAnimationIteration = (event: React.AnimationEvent<HTMLElement>) => {
        if (!isOwnAnimation(event)) {
            return;
        }

        loops.current += 1;
        onLoopComplete?.(loops.current);
    };

    const handleAnimationEnd = (event: React.AnimationEvent<HTMLElement>) => {
        if (!isOwnAnimation(event)) {
            return;
        }

        loops.current += 1;
        onLoopComplete?.(loops.current);
        onComplete?.();
    };

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

    return (
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
            {edges ? (
                <span
                    className={classes.edge}
                    aria-hidden="true"
                    data-component="Marquee.Edge"
                    data-side={vertical ? "top" : "start"}
                />
            ) : null}

            <div ref={viewportRef} className={classes.viewport} data-component="Marquee.Viewport">
                {Array.from({ length: copyCount }, (_, index) => {
                    // The first copy is the run; the rest are it again, so they are kept from
                    // being read out a second time and from being tabbed into on their way past
                    const isFirst = index === 0;

                    return (
                        <div
                            key={index}
                            ref={isFirst ? copyRef : undefined}
                            className={classes.content}
                            aria-hidden={isFirst ? undefined : true}
                            inert={!isFirst}
                            onAnimationIteration={isFirst ? handleAnimationIteration : undefined}
                            onAnimationEnd={isFirst ? handleAnimationEnd : undefined}
                            data-component="Marquee.Content"
                        >
                            {children}
                        </div>
                    );
                })}
            </div>

            {edges ? (
                <span
                    className={classes.edge}
                    aria-hidden="true"
                    data-component="Marquee.Edge"
                    data-side={vertical ? "bottom" : "end"}
                />
            ) : null}
        </Component>
    );
}

Marquee.displayName = "Marquee";

export default fixedForwardRef(Marquee);
