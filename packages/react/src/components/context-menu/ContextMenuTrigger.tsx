import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useContextMenu } from "./useContextMenu";
import type { ContextMenuPoint, ContextMenuTriggerProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-trigger",
};

// How long a finger has to rest before the press is read as a call for the menu rather than
// as a tap. This is what the platforms themselves wait, so it is what a reader expects
const LONG_PRESS_DELAY = 500;

// How far the finger can wander in that time and still be resting. Past this it is scrolling
// or dragging, and no longer asking for anything
const LONG_PRESS_SLOP = 10;

// How much room the menu is stood clear of a finger, so that it does not open underneath the
// one that asked for it. A pointer covers nothing, so it is given none
const TOUCH_POINT_SIZE = 10;

type LongPress = {
    point: ContextMenuPoint;
    timeout: number;
};

const getPoint = (
    event: React.MouseEvent | React.PointerEvent,
    size: number,
): ContextMenuPoint => ({
    x: event.clientX,
    y: event.clientY,
    size,
});

// The area the menu is opened from, by right click or by long press. It is drawn as a plain
// box around whatever it is given, since the menu is about the content rather than about
// anything the trigger would add to it. It can take focus, so that a reader on the keyboard
// can ask for the menu from it the way they would from anything else on the page
function ContextMenuTrigger(
    props: ContextMenuTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        onContextMenu,
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onPointerCancel,
        ...rest
    } = props;

    const { triggerRef, triggerId, open, disabled, onOpen } = useContextMenu();
    const mergedRef = useMergedRefs(ref, triggerRef);

    // Where the finger came down and the wait it started, kept so that a press can be told
    // from a scroll and the wait can be called off
    const longPressRef = React.useRef<LongPress | null>(null);

    const cancelLongPress = React.useCallback(() => {
        if (longPressRef.current) {
            window.clearTimeout(longPressRef.current.timeout);
            longPressRef.current = null;
        }
    }, []);

    React.useEffect(() => cancelLongPress, [cancelLongPress]);

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        onContextMenu?.(event);

        // A caller that answered the press themselves is left to it, and so is the browser
        // where the menu has been turned off
        if (disabled || event.defaultPrevented) {
            return;
        }

        // The browser would show a menu of its own here, and this one stands in its place
        event.preventDefault();
        cancelLongPress();
        onOpen(getPoint(event, 0));
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(event);
        cancelLongPress();

        // A mouse asks for the menu with a button of its own, so only a finger or a pen is
        // waited on, and only the first of them where more than one has come down
        if (
            disabled ||
            event.defaultPrevented ||
            event.pointerType === "mouse" ||
            event.isPrimary === false
        ) {
            return;
        }

        const point = getPoint(event, TOUCH_POINT_SIZE);

        longPressRef.current = {
            point,
            timeout: window.setTimeout(() => {
                longPressRef.current = null;
                onOpen(point);
            }, LONG_PRESS_DELAY),
        };
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event);

        const press = longPressRef.current;

        if (!press) {
            return;
        }

        if (
            Math.abs(event.clientX - press.point.x) > LONG_PRESS_SLOP ||
            Math.abs(event.clientY - press.point.y) > LONG_PRESS_SLOP
        ) {
            cancelLongPress();
        }
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerUp?.(event);
        cancelLongPress();
    };

    const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerCancel?.(event);
        cancelLongPress();
    };

    return (
        <div
            ref={mergedRef}
            id={triggerId}
            tabIndex={0}
            className={classNames(classes.root, className)}
            onContextMenu={handleContextMenu}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            data-component="ContextMenu.Trigger"
            data-state={open ? "open" : "closed"}
            data-disabled={disabled ? "" : undefined}
            {...rest}
        >
            {children}
        </div>
    );
}

ContextMenuTrigger.displayName = "ContextMenu.Trigger";

export default fixedForwardRef(ContextMenuTrigger);
