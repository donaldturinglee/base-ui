import * as React from "react";
import { classNames } from "../../lib/classnames";
import { ContextMenuContext } from "./ContextMenuContext";
import type { ContextMenuTriggerProps } from "./ContextMenu.types";

const classes = {
    trigger: "context-menu-trigger",
};

// How long a finger has to rest before the press is read as a call for the menu rather than
// as a tap. This is what the platforms themselves wait, so it is what a reader expects
const LONG_PRESS_DELAY = 500;

// How far the finger can wander in that time and still be resting. Past this it is scrolling
// or dragging, and no longer asking for anything
const TOUCH_MOVE_THRESHOLD = 10;

// How much room the menu is stood clear of a finger, so that it does not open underneath the
// one that asked for it. A pointer covers nothing, so it is given none
const TOUCH_POINT_SIZE = 10;

// The area the menu is opened from, by right click or by long press. It is drawn as a plain
// box around whatever it is given, since the menu is about the content rather than about
// anything the trigger would add to it
function ContextMenuTrigger(props: ContextMenuTriggerProps) {
    const {
        children,
        className,
        onContextMenu,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel,
        ...rest
    } = props;

    const menu = React.useContext(ContextMenuContext);
    const disabled = Boolean(menu?.disabled);
    const onOpen = menu?.onOpen;

    // Where the finger came down, kept so that a press can be told from a scroll, and the
    // wait it started, kept so that it can be called off
    const touchPointRef = React.useRef<{ x: number; y: number } | null>(null);
    const longPressTimeout = React.useRef<number | null>(null);

    const cancelLongPress = React.useCallback(() => {
        if (longPressTimeout.current !== null) {
            window.clearTimeout(longPressTimeout.current);
            longPressTimeout.current = null;
        }

        touchPointRef.current = null;
    }, []);

    React.useEffect(() => cancelLongPress, [cancelLongPress]);

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        onContextMenu?.(event);

        // A trigger nested inside another one has already answered the press, and a caller
        // that answered it themselves is left to it
        if (disabled || event.defaultPrevented) {
            return;
        }

        // The browser would show a menu of its own here, and this one stands in its place
        event.preventDefault();
        cancelLongPress();
        onOpen?.({ x: event.clientX, y: event.clientY, size: 0 });
    };

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        onTouchStart?.(event);
        cancelLongPress();

        // Only a single finger resting in one place is a press. Anything else is a gesture
        // meant for the page rather than for the menu
        if (disabled || event.defaultPrevented || event.touches.length !== 1) {
            return;
        }

        // Held here, so that a trigger nested inside another one does not start the outer
        // one waiting as well and leave two menus standing
        event.stopPropagation();

        const touch = event.touches[0];
        const point = { x: touch.clientX, y: touch.clientY };
        touchPointRef.current = point;

        longPressTimeout.current = window.setTimeout(() => {
            longPressTimeout.current = null;
            onOpen?.({ ...point, size: TOUCH_POINT_SIZE });
        }, LONG_PRESS_DELAY);
    };

    const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
        onTouchMove?.(event);

        const start = touchPointRef.current;

        if (!start) {
            return;
        }

        if (event.touches.length !== 1) {
            cancelLongPress();
            return;
        }

        const touch = event.touches[0];

        if (
            Math.abs(touch.clientX - start.x) > TOUCH_MOVE_THRESHOLD ||
            Math.abs(touch.clientY - start.y) > TOUCH_MOVE_THRESHOLD
        ) {
            cancelLongPress();
        }
    };

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        onTouchEnd?.(event);
        cancelLongPress();
    };

    const handleTouchCancel = (event: React.TouchEvent<HTMLDivElement>) => {
        onTouchCancel?.(event);
        cancelLongPress();
    };

    return (
        <div
            ref={menu?.triggerRef}
            // Focus lands back here once the menu closes, without the area itself becoming
            // somewhere the reader has to tab through on the way past
            tabIndex={-1}
            className={classNames(classes.trigger, className)}
            onContextMenu={handleContextMenu}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            data-component="ContextMenu.Trigger"
            data-open={menu?.open ? "" : undefined}
            {...rest}
        >
            {children}
        </div>
    );
}

ContextMenuTrigger.displayName = "ContextMenu.Trigger";

export default ContextMenuTrigger;
