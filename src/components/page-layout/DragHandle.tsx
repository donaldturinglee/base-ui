import * as React from "react";
import { classNames } from "../../utilities/classnames";
import {
    ARROW_KEY_STEP,
    formatPaneValueText,
    removeDraggingStyles,
    setDraggingStyles,
} from "./paneUtils";
import type { DragHandleProps } from "./PageLayout.types";

const classes = {
    root: "page-layout-drag-handle",
};

const isArrowKey = (key: string) =>
    key === "ArrowLeft" || key === "ArrowRight" || key === "ArrowUp" || key === "ArrowDown";

const isShrinkKey = (key: string) => key === "ArrowLeft" || key === "ArrowDown";

// Reports what the reader is doing with the divider. Writing the width is left to whoever
// owns it, so the handle itself holds no state beyond the drag. The element is reached
// through `handleRef` rather than through a forwarded ref, since the same ref is what the
// ARIA values are written to during a drag
function DragHandle(props: DragHandleProps) {
    const {
        className,
        handleRef,
        onDragStart,
        onDrag,
        onDragEnd,
        onDoubleClick,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-valuemin": ariaValueMin,
        "aria-valuemax": ariaValueMax,
        "aria-valuenow": ariaValueNow,
        dragTargetRef,
        contentWrapperRef,
    } = props;

    // The callbacks are held in refs so a fresh one does not have to re-bind the drag
    const callbacks = React.useRef({ onDragStart, onDrag, onDragEnd });

    React.useEffect(() => {
        callbacks.current = { onDragStart, onDrag, onDragEnd };
    });

    const isDragging = React.useRef(false);
    const frame = React.useRef<number | null>(null);
    const pendingClientX = React.useRef<number | null>(null);

    const startDragging = React.useCallback(() => {
        if (isDragging.current) {
            return;
        }

        setDraggingStyles({
            handle: handleRef.current,
            pane: dragTargetRef?.current ?? null,
            contentWrapper: contentWrapperRef?.current ?? null,
        });
        isDragging.current = true;
    }, [handleRef, dragTargetRef, contentWrapperRef]);

    const endDragging = React.useCallback(() => {
        if (!isDragging.current) {
            return;
        }

        removeDraggingStyles({
            handle: handleRef.current,
            pane: dragTargetRef?.current ?? null,
            contentWrapper: contentWrapperRef?.current ?? null,
        });
        isDragging.current = false;
    }, [handleRef, dragTargetRef, contentWrapperRef]);

    React.useEffect(
        () => () => {
            if (frame.current !== null) {
                cancelAnimationFrame(frame.current);
                frame.current = null;
            }
        },
        [],
    );

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();

        // Capturing the pointer keeps the drag going once it leaves the handle. It is only
        // ever a convenience, so nothing rests on it being granted
        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
            // Pointer capture unavailable
        }

        callbacks.current.onDragStart(event.clientX);
        startDragging();
    };

    // One report a frame, with wherever the pointer last was
    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current) {
            return;
        }

        event.preventDefault();
        pendingClientX.current = event.clientX;

        if (frame.current === null) {
            frame.current = requestAnimationFrame(() => {
                frame.current = null;

                if (pendingClientX.current !== null) {
                    callbacks.current.onDrag(pendingClientX.current, false);
                    pendingClientX.current = null;
                }
            });
        }
    };

    // Letting the pointer go is what ends the drag, whether it was released or taken away
    const handleLostPointerCapture = () => {
        if (!isDragging.current) {
            return;
        }

        if (frame.current !== null) {
            cancelAnimationFrame(frame.current);
            frame.current = null;
            pendingClientX.current = null;
        }

        endDragging();
        callbacks.current.onDragEnd();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isArrowKey(event.key)) {
            return;
        }

        event.preventDefault();
        startDragging();
        callbacks.current.onDrag(isShrinkKey(event.key) ? -ARROW_KEY_STEP : ARROW_KEY_STEP, true);
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isArrowKey(event.key)) {
            return;
        }

        event.preventDefault();
        endDragging();
        callbacks.current.onDragEnd();
    };

    return (
        <div
            ref={handleRef}
            role="slider"
            tabIndex={0}
            aria-label={ariaLabelledBy ? undefined : (ariaLabel ?? "Draggable pane splitter")}
            aria-labelledby={ariaLabelledBy}
            aria-valuemin={ariaValueMin}
            aria-valuemax={ariaValueMax}
            aria-valuenow={ariaValueNow}
            aria-valuetext={
                ariaValueNow === undefined ? undefined : formatPaneValueText(ariaValueNow)
            }
            className={classNames(classes.root, className)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => event.preventDefault()}
            onLostPointerCapture={handleLostPointerCapture}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onDoubleClick={onDoubleClick}
            data-component="PageLayout.DragHandle"
        />
    );
}

DragHandle.displayName = "PageLayout.DragHandle";

export default DragHandle;
