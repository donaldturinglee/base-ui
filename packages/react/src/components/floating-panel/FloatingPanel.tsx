import * as React from "react";
import { useId } from "../../hooks/useId";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { FloatingPanelContext } from "./FloatingPanelContext";
import {
    DEFAULT_FLOATING_PANEL_MIN_SIZE,
    DEFAULT_FLOATING_PANEL_POSITION,
    DEFAULT_FLOATING_PANEL_SIZE,
    getBoundaryRect,
    moveRect,
    resizeRect,
} from "./floatingPanelRect";
import type {
    FloatingPanelPoint,
    FloatingPanelProps,
    FloatingPanelRect,
    FloatingPanelResizeAxis,
    FloatingPanelSize,
    FloatingPanelStage,
} from "./FloatingPanel.types";

// What is being dragged, where the pointer was when it was taken hold of, and the panel as it
// stood at that moment. Every step is measured from that starting rect rather than from the last
// one, so a pointer dragged back over its own path lands where it began instead of drifting
type Gesture = {
    origin: FloatingPanelPoint;
    rect: FloatingPanelRect;
    // Where the panel has reached, so that letting go can report the place it landed
    latest: FloatingPanelRect;
} & ({ kind: "drag" } | { kind: "resize"; axis: FloatingPanelResizeAxis });

// A panel that floats above the page, is dragged about by its header and resized by its edges.
//
//     <FloatingPanel defaultOpen>
//         <FloatingPanel.Trigger>Open</FloatingPanel.Trigger>
//         <FloatingPanel.Positioner>
//             <FloatingPanel.Content>
//                 <FloatingPanel.DragTrigger>
//                     <FloatingPanel.Header>
//                         <FloatingPanel.Title>Panel</FloatingPanel.Title>
//                         <FloatingPanel.Control>
//                             <FloatingPanel.StageTrigger stage="minimized" />
//                             <FloatingPanel.CloseTrigger />
//                         </FloatingPanel.Control>
//                     </FloatingPanel.Header>
//                 </FloatingPanel.DragTrigger>
//                 <FloatingPanel.Body>...</FloatingPanel.Body>
//                 <FloatingPanel.ResizeTrigger axis="nw" />
//                 <FloatingPanel.ResizeTrigger axis="ne" />
//                 <FloatingPanel.ResizeTrigger axis="sw" />
//                 <FloatingPanel.ResizeTrigger axis="se" />
//             </FloatingPanel.Content>
//         </FloatingPanel.Positioner>
//     </FloatingPanel>
//
// Which edges and corners can be taken hold of is settled by which resize triggers are rendered,
// so the four corners above are what a panel is usually given and a panel given none of them
// cannot be resized at all. The eight of them are each a stop on the way past the panel, which is
// why they are not drawn for the caller.
//
// The root draws nothing of its own. What it holds is where the panel stands, how large it is and
// which stage it is at, and a wrapper around a trigger that is meant to sit inline would put an
// element in the flow that the caller never asked for
function FloatingPanel(props: FloatingPanelProps) {
    const {
        open,
        defaultOpen,
        onOpenChange,
        position,
        defaultPosition,
        onPositionChange,
        onPositionChangeEnd,
        size,
        defaultSize,
        onSizeChange,
        onSizeChangeEnd,
        stage,
        defaultStage,
        onStageChange,
        minSize = DEFAULT_FLOATING_PANEL_MIN_SIZE,
        maxSize,
        draggable = true,
        resizable = true,
        disabled = false,
        closeOnEscape = true,
        lockAspectRatio,
        allowOverflow,
        gridSize,
        strategy = "fixed",
        getBoundaryElement,
        children,
    } = props;

    const uuid = useId();

    // A panel the caller is holding the state of takes each of these from the prop; one that is
    // not keeps its own, since the panel has to be drawn from them either way
    const isOpenControlled = open !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(Boolean(defaultOpen));
    const isOpen = isOpenControlled ? open : selfOpen;

    const isPositionControlled = position !== undefined;
    const [selfPosition, setSelfPosition] = React.useState(
        () => defaultPosition ?? DEFAULT_FLOATING_PANEL_POSITION,
    );
    const currentPosition = isPositionControlled ? position : selfPosition;

    const isSizeControlled = size !== undefined;
    const [selfSize, setSelfSize] = React.useState(
        () => defaultSize ?? DEFAULT_FLOATING_PANEL_SIZE,
    );
    const currentSize = isSizeControlled ? size : selfSize;

    const isStageControlled = stage !== undefined;
    const [selfStage, setSelfStage] = React.useState<FloatingPanelStage>(
        () => defaultStage ?? "default",
    );
    const currentStage = isStageControlled ? stage : selfStage;

    const [dragging, setDragging] = React.useState(false);
    const [resizing, setResizing] = React.useState(false);
    const gesture = React.useRef<Gesture | null>(null);

    const setOpen = (next: boolean) => {
        if (!isOpenControlled) {
            setSelfOpen(next);
        }

        onOpenChange?.(next);
    };

    const setStage = (next: FloatingPanelStage) => {
        if (!isStageControlled) {
            setSelfStage(next);
        }

        onStageChange?.(next);
    };

    const commitPosition = (next: FloatingPanelPoint) => {
        if (!isPositionControlled) {
            setSelfPosition(next);
        }

        onPositionChange?.(next);
    };

    const commitSize = (next: FloatingPanelSize) => {
        if (!isSizeControlled) {
            setSelfSize(next);
        }

        onSizeChange?.(next);
    };

    const boundaryOptions = () => ({
        boundary: getBoundaryRect(getBoundaryElement?.()),
        allowOverflow,
        gridSize,
    });

    useOnEscapePress((event) => {
        if (!isOpen || !closeOnEscape) {
            return;
        }

        setOpen(false);
        // Taking the event keeps whatever the panel was opened from standing
        event.preventDefault();
    });

    // A maximized panel is laid out from the room it was given rather than from the rect it was
    // dragged to, so a drag would have nothing to move. A minimized one is still stood at its own
    // corner and only drawn shorter, so it can be carried about like any other.
    //
    // A minimized panel is still held within the room its full size needs rather than the room the
    // header alone takes up, so that wherever it is put down it can be opened back up without
    // hanging off the edge. That is why one dragged to the bottom stops short of it
    const canDrag = !disabled && draggable && currentStage !== "maximized";

    // Resizing needs a rect to resize. A minimized panel is as tall as its header and no taller,
    // and a maximized one fills its boundary, so neither has one of its own to work on
    const canResize = !disabled && resizable && currentStage === "default";

    const startGesture = (event: React.PointerEvent, next: Gesture) => {
        // Stops the press being read as the start of a selection, which would drag the words
        // inside the panel about rather than the panel itself
        event.preventDefault();
        gesture.current = next;

        if (next.kind === "drag") {
            setDragging(true);
        } else {
            setResizing(true);
        }
    };

    const startDrag = (event: React.PointerEvent) => {
        if (!canDrag) {
            return;
        }

        const rect = { ...currentPosition, ...currentSize };

        startGesture(event, {
            kind: "drag",
            origin: { x: event.clientX, y: event.clientY },
            rect,
            latest: rect,
        });
    };

    const startResize = (event: React.PointerEvent, axis: FloatingPanelResizeAxis) => {
        if (!canResize) {
            return;
        }

        const rect = { ...currentPosition, ...currentSize };

        startGesture(event, {
            kind: "resize",
            axis,
            origin: { x: event.clientX, y: event.clientY },
            rect,
            latest: rect,
        });
    };

    // The gesture is followed on the window rather than on the trigger it started from, so a
    // pointer that runs ahead of the panel, or off it altogether, keeps hold of it
    React.useEffect(() => {
        if (!dragging && !resizing) {
            return;
        }

        const handleMove = (event: PointerEvent) => {
            const active = gesture.current;

            if (!active) {
                return;
            }

            const delta = {
                x: event.clientX - active.origin.x,
                y: event.clientY - active.origin.y,
            };

            if (active.kind === "drag") {
                const next = moveRect(active.rect, delta, boundaryOptions());

                // A drag settles where the panel stands and leaves how large it is alone, so the
                // size comes from the rect the gesture started at
                active.latest = { ...active.rect, ...next };
                commitPosition(next);
                return;
            }

            const next = resizeRect(active.rect, active.axis, delta, {
                ...boundaryOptions(),
                minSize,
                maxSize,
                lockAspectRatio,
            });

            active.latest = next;
            commitPosition({ x: next.x, y: next.y });
            commitSize({ width: next.width, height: next.height });
        };

        const handleEnd = () => {
            const active = gesture.current;

            gesture.current = null;
            setDragging(false);
            setResizing(false);

            if (!active) {
                return;
            }

            onPositionChangeEnd?.({ x: active.latest.x, y: active.latest.y });

            if (active.kind === "resize") {
                onSizeChangeEnd?.({
                    width: active.latest.width,
                    height: active.latest.height,
                });
            }
        };

        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleEnd);
        window.addEventListener("pointercancel", handleEnd);

        return () => {
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleEnd);
            window.removeEventListener("pointercancel", handleEnd);
        };
        // Deliberately without a dependency list: the handlers read the props and the state as
        // they stand, and re-reading them on every render is what keeps a gesture following a
        // panel whose bounds or grid changed underneath it. Nothing is listened for until a
        // gesture is under way, so a render outside one costs the early return above
    });

    // The same two moves from the keyboard. Each press is a gesture of its own, so where it landed
    // is reported alongside the step itself
    const moveBy = (delta: FloatingPanelPoint) => {
        if (!canDrag) {
            return;
        }

        const rect = { ...currentPosition, ...currentSize };
        const next = moveRect(rect, delta, boundaryOptions());

        commitPosition(next);
        onPositionChangeEnd?.(next);
    };

    const resizeBy = (axis: FloatingPanelResizeAxis, delta: FloatingPanelPoint) => {
        if (!canResize) {
            return;
        }

        const rect = { ...currentPosition, ...currentSize };
        const next = resizeRect(rect, axis, delta, {
            ...boundaryOptions(),
            minSize,
            maxSize,
            lockAspectRatio,
        });

        commitPosition({ x: next.x, y: next.y });
        commitSize({ width: next.width, height: next.height });
        onPositionChangeEnd?.({ x: next.x, y: next.y });
        onSizeChangeEnd?.({ width: next.width, height: next.height });
    };

    const context = {
        open: isOpen,
        setOpen,
        position: currentPosition,
        size: currentSize,
        stage: currentStage,
        setStage,
        dragging,
        resizing,
        draggable,
        resizable,
        canDrag,
        canResize,
        disabled,
        strategy,
        triggerId: `${uuid}-trigger`,
        contentId: `${uuid}-content`,
        titleId: `${uuid}-title`,
        startDrag,
        startResize,
        moveBy,
        resizeBy,
    };

    return (
        <FloatingPanelContext.Provider value={context}>{children}</FloatingPanelContext.Provider>
    );
}

FloatingPanel.displayName = "FloatingPanel";

export default FloatingPanel;
