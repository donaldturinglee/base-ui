import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../lib/classnames";
import { Portal } from "../portal";
import { getAnchoredPosition } from "../tooltip/anchoredPosition";
import { HoverCardContext } from "./HoverCardContext";
import HoverCardContent from "./HoverCardContent";
import HoverCardTrigger from "./HoverCardTrigger";
import type { AnchoredPosition } from "../tooltip/anchoredPosition";
import type { HoverCardProps } from "./HoverCard.types";

const classes = {
    root: [
        "hover-card",
        // It arrives from the edge of the trigger it stands off, which says where it came from
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short motion-safe:data-[side=outside-bottom]:slide-in-from-top-2 motion-safe:data-[side=outside-top]:slide-in-from-bottom-2 motion-safe:data-[side=outside-right]:slide-in-from-left-2 motion-safe:data-[side=outside-left]:slide-in-from-right-2",
    ],
    // Held back until it has been placed, so it is never seen where it does not belong
    unplaced: "invisible",
};

// Long enough that a pointer crossing the page does not leave a trail of cards behind it, and
// short enough that one that stopped to read is not kept waiting
const DEFAULT_OPEN_DELAY = 500;

// Long enough to cross the gap between the trigger and the card without it closing on the way
const DEFAULT_CLOSE_DELAY = 300;

// Whether the card ended up where it already was, which is the only thing worth not rendering
// it again for
const isSamePosition = (one: AnchoredPosition, other: AnchoredPosition) =>
    one.top === other.top &&
    one.left === other.left &&
    one.anchorSide === other.anchorSide &&
    one.anchorAlign === other.anchorAlign;

// Says more about the thing it is wrapped around, in a surface the reader can move the pointer
// onto and read at their own pace.
//
// This is what sets it apart from a tooltip: a tooltip holds a line of text and closes the
// moment the pointer leaves, while a card holds whatever the caller puts in it and waits, so
// that a link or a button inside it can be reached. What it holds should be a fuller telling
// of something the reader can get at some other way as well, since a surface that only ever
// opens on hover is closed to anyone who cannot hover
function HoverCard(props: HoverCardProps) {
    const {
        className,
        children,
        side = "outside-bottom",
        align = "start",
        anchorOffset,
        alignmentOffset,
        openDelay = DEFAULT_OPEN_DELAY,
        closeDelay = DEFAULT_CLOSE_DELAY,
        open: openProp,
        onOpenChange,
        disabled = false,
        portalContainerName,
    } = props;

    const contentId = useId();

    const [slots] = useSlots(children, {
        trigger: HoverCardTrigger,
        content: HoverCardContent,
    });

    const triggerRef = React.useRef<HTMLElement>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const openTimeout = React.useRef<number | null>(null);
    const closeTimeout = React.useRef<number | null>(null);

    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

    // A card the caller is holding open follows them; one left to itself keeps its own state.
    // Either way a card that has been turned off stays shut
    const isControlled = openProp !== undefined;
    const isOpen = (isControlled ? openProp : uncontrolledOpen) && !disabled;

    // Where the card was last placed, kept beside the state so that placing it again can be
    // told apart from placing it somewhere new without waiting for a render
    const placedRef = React.useRef<AnchoredPosition | null>(null);
    const [position, setPosition] = React.useState<AnchoredPosition | null>(null);

    const clearTimers = React.useCallback(() => {
        if (openTimeout.current !== null) {
            window.clearTimeout(openTimeout.current);
            openTimeout.current = null;
        }

        if (closeTimeout.current !== null) {
            window.clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
    }, []);

    React.useEffect(() => clearTimers, [clearTimers]);

    const setOpen = (next: boolean) => {
        clearTimers();

        if (!isControlled) {
            setUncontrolledOpen(next);
        }

        onOpenChange?.(next);
    };

    const openAfterDelay = () => {
        if (disabled) {
            return;
        }

        clearTimers();
        openTimeout.current = window.setTimeout(() => {
            openTimeout.current = null;
            setOpen(true);
        }, openDelay);
    };

    const closeAfterDelay = () => {
        clearTimers();
        closeTimeout.current = window.setTimeout(() => {
            closeTimeout.current = null;
            setOpen(false);
        }, closeDelay);
    };

    const updatePosition = React.useCallback(() => {
        const trigger = triggerRef.current;
        const card = cardRef.current;

        if (!trigger || !card) {
            return;
        }

        const placed = getAnchoredPosition(card, trigger, {
            side,
            align,
            anchorOffset,
            alignmentOffset,
        });

        if (placedRef.current && isSamePosition(placedRef.current, placed)) {
            return;
        }

        placedRef.current = placed;
        setPosition(placed);
    }, [side, align, anchorOffset, alignmentOffset]);

    // Placed before the browser paints, so the card is never seen standing anywhere but against
    // its trigger
    useIsomorphicLayoutEffect(() => {
        if (!isOpen) {
            // Forgotten, so that a card opened again is placed from scratch rather than from
            // wherever it was last time
            placedRef.current = null;
            setPosition(null);
            return;
        }

        updatePosition();

        // The trigger moves whenever the page is laid out again, and the card moves with
        // whatever it grows to hold
        const observer = new ResizeObserver(updatePosition);

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        window.addEventListener("resize", updatePosition);
        // Caught on the way down, so that a card standing over a scrolling region follows its
        // trigger as the region is scrolled rather than only the page
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [isOpen, updatePosition]);

    useOnEscapePress((event) => {
        if (!isOpen) {
            return;
        }

        // Taking the event keeps a layer this card was opened over standing
        event.preventDefault();
        setOpen(false);
    });

    const triggerHandlers = {
        ref: triggerRef,
        // Only worth pointing at while there is something standing there to be read
        "aria-describedby": isOpen ? contentId : undefined,
        onPointerEnter: (event: React.PointerEvent) => {
            // A card is a pointer affordance. A touch screen sends one of these on a tap, and
            // a card opened that way would stand with no pointer to move off it again
            if (event.pointerType === "touch") {
                return;
            }

            openAfterDelay();
        },
        onPointerLeave: (event: React.PointerEvent) => {
            if (event.pointerType === "touch") {
                return;
            }

            closeAfterDelay();
        },
        onFocus: (event: React.FocusEvent) => {
            // Only a reader who arrived by keyboard is shown the card, and they are shown it at
            // once: the wait is there to spare a pointer crossing the page, and a reader who
            // tabbed to the trigger meant to stop on it
            try {
                if (!event.target.matches(":focus-visible")) {
                    return;
                }
            } catch {
                // jsdom does not know the selector, and a test is keyboard enough
            }

            setOpen(true);
        },
        onBlur: (event: React.FocusEvent) => {
            // Focus landing on the card is not focus leaving it. Without this, clicking a link
            // inside the card would pull focus off the trigger and close the card out from
            // under the click
            if (
                event.relatedTarget instanceof Node &&
                cardRef.current?.contains(event.relatedTarget)
            ) {
                return;
            }

            setOpen(false);
        },
    };

    return (
        <HoverCardContext.Provider value={{ triggerHandlers }}>
            {slots.trigger}

            {isOpen ? (
                <Portal containerName={portalContainerName}>
                    <div
                        ref={cardRef}
                        id={contentId}
                        className={classNames(
                            classes.root,
                            !position && classes.unplaced,
                            className,
                        )}
                        style={
                            {
                                "--hover-card-top": `${position?.top ?? 0}px`,
                                "--hover-card-left": `${position?.left ?? 0}px`,
                            } as React.CSSProperties
                        }
                        // The pointer is allowed to rest on the card itself, which is the whole
                        // of what a card is for and what a tooltip does not allow
                        onPointerEnter={clearTimers}
                        onPointerLeave={closeAfterDelay}
                        data-component="HoverCard"
                        data-side={position?.anchorSide ?? side}
                        data-align={position?.anchorAlign ?? align}
                        data-visibility={position ? "visible" : "hidden"}
                    >
                        {slots.content}
                    </div>
                </Portal>
            ) : null}
        </HoverCardContext.Provider>
    );
}

HoverCard.displayName = "HoverCard";

export default HoverCard;
