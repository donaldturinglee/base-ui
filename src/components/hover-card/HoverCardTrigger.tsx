import * as React from "react";
import { HoverCardContext } from "./HoverCardContext";
import type { HoverCardTriggerProps } from "./HoverCard.types";

type TriggerElementProps = {
    ref?: React.Ref<HTMLElement>;
    "aria-describedby"?: string;
    onPointerEnter?: React.PointerEventHandler;
    onPointerLeave?: React.PointerEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
};

// What the card is about. Nothing is drawn around it: the one element it is given is the one
// the card is measured against, so the card stands against the words themselves rather than
// against a wrapper that may run wider than they do.
//
// That element has to be something a reader can reach, since a card that only answered the
// pointer would be shut to anyone who does not use one
function HoverCardTrigger(props: HoverCardTriggerProps) {
    const { children } = props;
    const { triggerHandlers } = React.useContext(HoverCardContext);

    const child = React.Children.only(children);

    if (!React.isValidElement<TriggerElementProps>(child) || !triggerHandlers) {
        return null;
    }

    const childProps = child.props;

    return React.cloneElement(child, {
        ref: triggerHandlers.ref,
        // The card is added to whatever already describes the trigger rather than standing in
        // place of it
        "aria-describedby":
            [childProps["aria-describedby"], triggerHandlers["aria-describedby"]]
                .filter(Boolean)
                .join(" ") || undefined,
        onPointerEnter: (event: React.PointerEvent) => {
            triggerHandlers.onPointerEnter(event);
            childProps.onPointerEnter?.(event);
        },
        onPointerLeave: (event: React.PointerEvent) => {
            triggerHandlers.onPointerLeave(event);
            childProps.onPointerLeave?.(event);
        },
        onFocus: (event: React.FocusEvent) => {
            triggerHandlers.onFocus(event);
            childProps.onFocus?.(event);
        },
        onBlur: (event: React.FocusEvent) => {
            triggerHandlers.onBlur(event);
            childProps.onBlur?.(event);
        },
    });
}

HoverCardTrigger.displayName = "HoverCard.Trigger";

export default HoverCardTrigger;
