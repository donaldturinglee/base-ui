import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { MessageContext } from "../message/MessageContext";
import { BubbleContext } from "./BubbleContext";
import { BubbleGroupContext } from "./BubbleGroupContext";
import type { BubbleAlign, BubbleProps, BubbleVariant } from "./Bubble.types";

const bubbleVariants = cva("bubble", {
    variants: {
        align: {
            start: "bubble-align-start",
            end: "bubble-align-end",
        } satisfies Record<BubbleAlign, string>,
        variant: {
            default: "bubble-default",
            secondary: "bubble-secondary",
            muted: "bubble-muted",
            tinted: "bubble-tinted",
            outline: "bubble-outline",
            ghost: "bubble-ghost",
            danger: "bubble-danger",
        } satisfies Record<BubbleVariant, string>,
    },
});

// One turn in a conversation: what was said, and whatever has since been hung off it.
//
//     <Bubble>
//         <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
//     </Bubble>
//
// The bubble is the frame rather than the surface. What the variant paints is handed down to the
// content through custom properties instead of being set here, so a turn carrying a timestamp or
// a line of controls below the words keeps them off the painted surface without either part
// having to know which variant it is standing in.
//
// It takes only as much width as its words need, up to a share of the room it was given, since a
// turn run to the full width would leave nothing to say which side of the conversation it came
// from. It holds ground of its own because the reactions are pinned to it
function Bubble<As extends React.ElementType = "div">(
    props: BubbleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        variant = "default",
        align,
        ...rest
    } = props as BubbleProps<"div">;

    const { align: groupAlign } = React.useContext(BubbleGroupContext);
    const { align: messageAlign } = React.useContext(MessageContext);

    // A turn stands where its run stands, and a run stands where the message carrying it stands,
    // unless any of the three has been told to stand elsewhere. The nearer of them wins, so a
    // bubble inside a message is placed without the side having to be written on it again
    const resolvedAlign = align ?? groupAlign ?? messageAlign ?? "start";

    const context = { align: resolvedAlign, variant };

    return (
        <BubbleContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(bubbleVariants({ align: resolvedAlign, variant }), className)}
                data-component="Bubble"
                data-variant={variant}
                data-align={resolvedAlign}
                {...rest}
            />
        </BubbleContext.Provider>
    );
}

Bubble.displayName = "Bubble";

export default fixedForwardRef(Bubble);
