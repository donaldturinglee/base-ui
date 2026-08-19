import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { BubbleContext } from "./BubbleContext";
import type { BubbleAlign, BubbleReactionsProps, BubbleReactionsSide } from "./Bubble.types";

const bubbleReactionsVariants = cva("bubble-reactions", {
    variants: {
        side: {
            top: "bubble-reactions-top",
            bottom: "bubble-reactions-bottom",
        } satisfies Record<BubbleReactionsSide, string>,
        align: {
            start: "bubble-reactions-align-start",
            end: "bubble-reactions-align-end",
        } satisfies Record<BubbleAlign, string>,
    },
});

// What has been hung on a turn since it was taken, gathered into a pill sitting astride one of
// the bubble's edges.
//
// It is lifted out of the flow so that reacting to a turn does not push everything said after it
// down the page, and it is ringed in the colour of the ground the conversation stands on, which
// is what makes the pill read as sitting over the bubble rather than as part of it.
//
// The corner it gathers at follows the side the bubble stands on, so a conversation running down
// both edges of the page keeps its reactions on the outside, where there is room for them. A
// caller who wants them somewhere else names the corner themselves
function BubbleReactions<As extends React.ElementType = "div">(
    props: BubbleReactionsProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        side = "bottom",
        align,
        ...rest
    } = props as BubbleReactionsProps<"div">;

    const { align: bubbleAlign } = React.useContext(BubbleContext);
    const resolvedAlign = align ?? bubbleAlign ?? "end";

    return (
        <Component
            ref={ref}
            className={classNames(
                bubbleReactionsVariants({ side, align: resolvedAlign }),
                className,
            )}
            data-component="Bubble.Reactions"
            data-side={side}
            data-align={resolvedAlign}
            {...rest}
        />
    );
}

BubbleReactions.displayName = "Bubble.Reactions";

export default fixedForwardRef(BubbleReactions);
