import * as React from "react";
import type {
    PresenceAttributes,
    PresenceHideMode,
    PresenceState,
    UsePresenceOptions,
    UsePresenceReturn,
} from "./Presence.types";

// React 19.2 brought `Activity`, which keeps hidden content mounted with its effects paused.
// It is looked for rather than counted on, since the library also runs on a React without it
const Activity = (React as Partial<typeof React>).Activity;

// The event the element is sent once it has left, for anything holding it that would rather
// listen than be called
const EXIT_COMPLETE_EVENT = "exitcomplete";

const getAnimationName = (styles: CSSStyleDeclaration | null) => styles?.animationName || "none";

// Whether the element is running an animation there is any point waiting on. One that is not
// drawn, or that runs for no time at all, ends as soon as it starts
const isAnimating = (styles: CSSStyleDeclaration | null) =>
    getAnimationName(styles) !== "none" &&
    styles?.display !== "none" &&
    styles?.animationDuration !== "0s";

// Whether something is there, as far as the page is concerned. What is asked for and what is
// drawn come apart at the moment the content leaves: the content is asked to go, but stays on
// the page until whatever animation it leaves with has run, and only then is hidden or taken
// off. Everything here is about that gap, which the stylesheet reads as `data-state` on the
// element and the page reads as `hidden`
export const usePresence = (options: UsePresenceOptions = {}): UsePresenceReturn => {
    const {
        present = false,
        lazyMount = false,
        unmountOnExit = false,
        hideMode = "display-none",
        skipAnimationOnMount = false,
        onEnterComplete,
        onExitComplete,
    } = options;

    const nodeRef = React.useRef<HTMLElement | null>(null);

    const [state, setState] = React.useState<PresenceState>(present ? "mounted" : "unmounted");

    // Whether the content has changed since it was first drawn. Until it has, the animation
    // it would start with is the one that runs on mounting, which a caller can ask to skip
    const [initial, setInitial] = React.useState(false);

    // The animation the element was running before it was asked to leave, and the one it was
    // asked to leave with. An exit that would run the same animation as before is nothing to
    // wait on, since nothing new is going to play
    const prevAnimationNameRef = React.useRef<string | null>(null);
    const unmountAnimationNameRef = React.useRef<string | null>(null);

    // The callbacks are read through refs, so a fresh function does not restart the effects
    // that call them
    const onEnterCompleteRef = React.useRef(onEnterComplete);
    const onExitCompleteRef = React.useRef(onExitComplete);

    React.useEffect(() => {
        onEnterCompleteRef.current = onEnterComplete;
        onExitCompleteRef.current = onExitComplete;
    }, [onEnterComplete, onExitComplete]);

    // Content that is asked back is put back at once, in the render the change arrives in, so
    // it is never drawn as absent for a frame it is meant to be there. Leaving takes longer,
    // and is answered below once the styles it leaves with can be read
    const [previousPresent, setPreviousPresent] = React.useState(present);

    if (present !== previousPresent) {
        setPreviousPresent(present);
        setInitial(true);

        if (present) {
            setState("mounted");
        }
    }

    // The styles are read afresh each time rather than kept, so what is read is what the
    // element is drawn with now. They are asked of the window the element belongs to, which is
    // not always the one this code runs in
    const getStyles = () => {
        const node = nodeRef.current;

        return node ? (node.ownerDocument.defaultView ?? window).getComputedStyle(node) : null;
    };

    const setNode = React.useCallback((node: HTMLElement | null) => {
        // The element is kept once it has gone, so that what it is sent as it leaves has
        // somewhere to go
        if (node) {
            nodeRef.current = node;
        }
    }, []);

    const unmount = React.useCallback(() => {
        setState("unmounted");
        prevAnimationNameRef.current = null;
        onExitCompleteRef.current?.();
        nodeRef.current?.dispatchEvent(new CustomEvent(EXIT_COMPLETE_EVENT, { bubbles: false }));
    }, []);

    // Content asked to leave waits a frame, which is when the state it was given on this
    // render has been drawn and the animation it leaves with can be read off it. Where there
    // is one, the content stays until it has run; where there is none, it goes at once
    React.useEffect(() => {
        if (present || state !== "mounted") {
            return;
        }

        // A page the reader cannot see runs no animations, so there is nothing to wait for
        if (nodeRef.current?.ownerDocument.visibilityState === "hidden") {
            unmount();
            return;
        }

        const frame = requestAnimationFrame(() => {
            const styles = getStyles();
            const animationName = getAnimationName(styles);
            unmountAnimationNameRef.current = animationName;

            if (!isAnimating(styles) || animationName === prevAnimationNameRef.current) {
                unmount();
            } else {
                setState("unmountSuspended");
            }
        });

        return () => cancelAnimationFrame(frame);
    }, [present, state, unmount]);

    // What the element animates with once it has arrived is remembered, so that leaving can
    // be told apart from it
    React.useEffect(() => {
        if (!present || state !== "mounted") {
            return;
        }

        const frame = requestAnimationFrame(() => {
            prevAnimationNameRef.current = getAnimationName(getStyles());
        });

        return () => cancelAnimationFrame(frame);
    }, [present, state]);

    // While the content is on its way off, its animation is watched for its end. The last
    // frame is held rather than let go, so the content does not flash back into place in the
    // moment between the animation ending and the content being hidden
    React.useEffect(() => {
        const node = nodeRef.current;

        if (state !== "unmountSuspended" || !node) {
            return;
        }

        const handleStart = (event: AnimationEvent) => {
            if (event.target === node) {
                prevAnimationNameRef.current = getAnimationName(getStyles());
            }
        };

        const handleEnd = (event: AnimationEvent) => {
            const animationName = getAnimationName(getStyles());

            if (
                event.target === node &&
                animationName === unmountAnimationNameRef.current &&
                !present
            ) {
                unmount();
            }
        };

        const handleCancel = (event: AnimationEvent) => {
            if (event.target === node && !present) {
                unmount();
            }
        };

        node.addEventListener("animationstart", handleStart);
        node.addEventListener("animationend", handleEnd);
        node.addEventListener("animationcancel", handleCancel);

        const previousFillMode = node.style.animationFillMode;
        node.style.animationFillMode = "forwards";

        return () => {
            node.removeEventListener("animationstart", handleStart);
            node.removeEventListener("animationend", handleEnd);
            node.removeEventListener("animationcancel", handleCancel);

            // Put back a tick later, once whatever the content is hidden by has been drawn
            setTimeout(() => {
                node.style.animationFillMode = previousFillMode;
            }, 0);
        };
    }, [state, present, unmount]);

    // Content that has arrived is watched for the end of whatever it arrived with, for a
    // caller that wants to know. Content that was there from the start arrived with nothing
    React.useEffect(() => {
        if (!present || state !== "mounted" || !initial || !onEnterCompleteRef.current) {
            return;
        }

        let frame: number;
        let node: HTMLElement | null = null;

        const handleEnd = (event: AnimationEvent) => {
            if (!node || event.target !== node) {
                return;
            }

            node.removeEventListener("animationend", handleEnd);
            onEnterCompleteRef.current?.();
        };

        const track = () => {
            frame = requestAnimationFrame(() => {
                // The element may not be on the page yet, so it is looked for again next frame
                if (!nodeRef.current?.isConnected) {
                    track();
                    return;
                }

                node = nodeRef.current;

                if (!isAnimating(getStyles())) {
                    onEnterCompleteRef.current?.();
                    return;
                }

                node.addEventListener("animationend", handleEnd);
            });
        };

        track();

        return () => {
            cancelAnimationFrame(frame);
            node?.removeEventListener("animationend", handleEnd);
        };
    }, [present, state, initial]);

    // On the page, or on its way off it: either way there is something there to be drawn
    const isPresent = state !== "unmounted";

    // Kept so that content drawn only once it is asked for can be told from content taken off
    // once it has left, both of which are off the page while not present
    const wasEverPresentRef = React.useRef(present);

    if (isPresent) {
        wasEverPresentRef.current = true;
    }

    const unmounted =
        (!isPresent && !wasEverPresentRef.current && lazyMount) ||
        (unmountOnExit && !isPresent && wasEverPresentRef.current);

    const resolvedHideMode: PresenceHideMode =
        hideMode === "activity" && Activity ? "activity" : "display-none";

    const skip = !initial;

    const getPresenceProps = (): PresenceAttributes => ({
        // The state is what the stylesheet animates from, so leaving it off is what leaves
        // the animation out
        "data-state": skip && skipAnimationOnMount ? undefined : present ? "open" : "closed",
        // Content held by React is hidden by React, so it is not hidden here as well
        hidden: resolvedHideMode === "activity" ? false : !isPresent,
    });

    return {
        ref: setNode,
        getPresenceProps,
        present: isPresent,
        unmounted,
        hideMode: resolvedHideMode,
        skip,
    };
};
