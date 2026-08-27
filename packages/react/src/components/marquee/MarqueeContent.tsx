import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { MarqueeContext } from "./MarqueeContext";
import type { MarqueeContentProps } from "./Marquee.types";

const classes = {
    root: "marquee-content",
};

// What the run is made of, written the once and laid out as many times as the window takes. Each
// copy travels its own length and starts over, so the copy behind stands where the one leaving
// was and the run has no end to reach.
//
// Only the first copy is read: the rest say nothing a reader has not already been told, so they
// are kept from being read out again and from being tabbed into on their way past. The first is
// also the one that is measured and the one that reports the run coming round, since one copy
// carries the whole of what the marquee needs to know
function MarqueeContent<As extends React.ElementType = "div">(
    props: MarqueeContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        children,
        ...rest
    } = props as MarqueeContentProps<"div">;

    const { copyCount = 1, copyRef, onLoopComplete, onComplete } = React.useContext(MarqueeContext);

    const firstCopyRef = useMergedRefs(ref, copyRef);

    // The times round are counted here rather than read off the animation, which starts over
    // the moment anything about it changes
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

    return (
        <>
            {Array.from({ length: copyCount }, (_, index) => {
                const isFirst = index === 0;

                return (
                    <Component
                        key={index}
                        ref={isFirst ? firstCopyRef : undefined}
                        className={classNames(classes.root, className)}
                        aria-hidden={isFirst ? undefined : true}
                        inert={!isFirst}
                        onAnimationIteration={isFirst ? handleAnimationIteration : undefined}
                        onAnimationEnd={isFirst ? handleAnimationEnd : undefined}
                        data-component="Marquee.Content"
                        {...rest}
                    >
                        {children}
                    </Component>
                );
            })}
        </>
    );
}

MarqueeContent.displayName = "Marquee.Content";

export default fixedForwardRef(MarqueeContent);
