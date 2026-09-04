import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useResizableContext } from "./ResizableContext";
import type { ResizableResizeTriggerProps } from "./Resizable.types";

const classes = {
    root: "resizable-resize-trigger",
};

// Which way a trigger runs is the group's, the other way about: panels side by side are parted by
// a line standing up, and panels stacked one on another by a line lying down
const RUNS = {
    horizontal: "vertical",
    vertical: "horizontal",
} as const;

// What stands between one panel and the next, and what a reader takes hold of to move it. It is
// reached by the keyboard as well as by a pointer: the arrow keys move it a step at a time, Home
// and End take it as far as it will go either way, F6 steps from one trigger to the next, and Enter
// folds away a panel that may be collapsed and brings it back. Double-clicking a trigger puts the
// panel before it back to the size it started at.
//
// What it is drawn as is left to the caller, and put within it: a separator draws the line the
// panels are parted by, and an indicator the grip standing on that line. A trigger only meant to
// part two panels and one meant to be taken hold of are told apart by what they are given rather
// than by a prop.
//
// A trigger is not required between two panels, but a group without one has nothing for a reader
// to take hold of and nothing for a keyboard to reach
function ResizableResizeTrigger(
    props: ResizableResizeTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        disabled = false,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        onPointerEnter,
        onPointerLeave,
        onKeyDown,
        onDoubleClick,
        ...rest
    } = props;

    const element = React.useRef<HTMLDivElement | null>(null);
    const mergedRef = useMergedRefs(ref, element);
    const {
        orientation = "horizontal",
        startDrag,
        moveDrag,
        endDrag,
        handleTriggerKeyDown,
        resetAt,
    } = useResizableContext();

    // Whether a pointer is within reach of the trigger, and whether it is being dragged, is
    // written on the element rather than kept in state: the drag writes it as it takes hold, and
    // a state that had to be drawn again on every pointer move would draw the whole group with it
    const [hovered, setHovered] = React.useState(false);

    const handle =
        <E extends React.SyntheticEvent>(
            own: ((event: E) => void) | undefined,
            act: (event: E) => void,
        ) =>
        (event: E) => {
            own?.(event);

            // A caller that has answered the event itself is left to it
            if (!event.defaultPrevented) {
                act(event);
            }
        };

    return (
        <div
            ref={mergedRef}
            role="separator"
            tabIndex={disabled ? undefined : 0}
            aria-orientation={RUNS[orientation]}
            aria-disabled={disabled || undefined}
            className={classNames(classes.root, className)}
            data-component="Resizable.ResizeTrigger"
            data-separator={disabled ? "disabled" : hovered ? "hover" : "inactive"}
            onPointerDown={handle(onPointerDown, (event) => {
                if (element.current) {
                    startDrag?.(element.current, event);
                }
            })}
            onPointerMove={handle(onPointerMove, (event) => moveDrag?.(event))}
            onPointerUp={handle(onPointerUp, (event) => {
                if (element.current) {
                    endDrag?.(element.current, event);
                }
            })}
            onPointerCancel={handle(onPointerCancel, (event) => {
                if (element.current) {
                    endDrag?.(element.current, event);
                }
            })}
            onPointerEnter={handle(onPointerEnter, () => setHovered(true))}
            onPointerLeave={handle(onPointerLeave, () => setHovered(false))}
            onKeyDown={handle(onKeyDown, (event) => {
                if (element.current) {
                    handleTriggerKeyDown?.(element.current, event);
                }
            })}
            onDoubleClick={handle(onDoubleClick, () => {
                if (element.current) {
                    resetAt?.(element.current);
                }
            })}
            {...rest}
        />
    );
}

ResizableResizeTrigger.displayName = "Resizable.ResizeTrigger";

export default fixedForwardRef(ResizableResizeTrigger);
