import * as React from "react";
import {
    CheckmarkCircleRegular,
    DismissRegular,
    ErrorCircleRegular,
    InfoRegular,
    WarningRegular,
} from "@gamecrafters/base-ui-icons";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../lib/classnames";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Spinner } from "../spinner";
import { dismissToast, removeToast } from "./toastStore";
import type {
    ToastAction,
    ToastActionDescriptor,
    ToastCloseReason,
    ToastProps,
    ToastSwipeDirection,
    ToastVariant,
} from "./Toast.types";

const classes = {
    root: "toast",
    animated:
        "motion-safe:[transition:transform_var(--motion-transition-state-change),opacity_var(--motion-transition-state-change),height_var(--motion-transition-state-change)]",
    grabbable: "toast-grabbable",
    lift: {
        top: "toast-lift-top",
        bottom: "toast-lift-bottom",
    },
    bridge: "toast-bridge",
    bridgeTop: "toast-bridge-top",
    bridgeBottom: "toast-bridge-bottom",
    card: "toast-card",
    iconColor: {
        default: "",
        success: "toast-icon-success",
        error: "toast-icon-error",
        warning: "toast-icon-warning",
        info: "toast-icon-info",
        loading: "",
    } satisfies Record<ToastVariant, string>,
    richColors: {
        default: "",
        success: "toast-rich-success",
        error: "toast-rich-error",
        warning: "toast-rich-warning",
        info: "toast-rich-info",
        loading: "",
    } satisfies Record<ToastVariant, string>,
    // A toast that has yet to arrive, one on its way out and one waiting its turn behind the
    // ones that are standing are all there without being seen
    hidden: "opacity-0",
    waiting: "pointer-events-none",
    // Nothing is animated while the toast is being dragged, so that it keeps up with the
    // pointer rather than trailing behind it
    dragging: "select-none",
    body: "toast-body motion-safe:[transition:opacity_var(--motion-transition-state-change)]",
    // A toast lying back in a gathered stack shows only the edge of the card it stands in
    bodyStacked: "opacity-0",
    icon: "toast-icon",
    content: "toast-content",
    title: "toast-title",
    description: "toast-description",
    actions: "toast-actions",
};

const iconForVariant = {
    default: null,
    success: CheckmarkCircleRegular,
    error: ErrorCircleRegular,
    warning: WarningRegular,
    info: InfoRegular,
    loading: null,
} satisfies Record<ToastVariant, React.ElementType | null>;

// How far a toast has to be dragged before letting go of it sees it off, in pixels
const SWIPE_THRESHOLD = 45;

// How far past its own edge a toast carries on once it has been swiped away, so that it is
// well clear of the viewport before it is taken off the list
const SWIPE_CLEARANCE = 32;

// How long a toast is left for after it has been dismissed, to be animated away before it is
// taken off the list. Matches `--motion-duration-short`
const REMOVAL_DELAY = 200;

// How far back each toast behind the front one is laid, as a share of its own size
const STACKED_SCALE_STEP = 0.05;

const isActionDescriptor = (action: unknown): action is ToastActionDescriptor =>
    typeof action === "object" &&
    action !== null &&
    "label" in action &&
    !React.isValidElement(action);

// One toast, laid where the Toaster around it says and left to see itself off once its time is
// up. Everything about it comes from the list the Toaster is showing, so there is nothing here
// for a caller to render themselves
function Toast(props: ToastProps) {
    const {
        toast,
        place,
        position,
        height,
        frontHeight,
        stackSize,
        expanded,
        visible,
        paused,
        swipeDirections,
        icons,
        defaults,
        onHeight,
    } = props;

    const { id, variant, title, description, render } = toast;

    const duration = toast.duration ?? defaults.duration;
    const dismissible = toast.dismissible ?? defaults.dismissible;
    const closeButton = toast.closeButton ?? defaults.closeButton;
    const richColors = toast.richColors ?? defaults.richColors;
    const important = toast.important ?? defaults.important ?? false;

    const toastRef = React.useRef<HTMLLIElement>(null);

    const [mounted, setMounted] = React.useState(false);
    const [swipe, setSwipe] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [isSwipedOut, setIsSwipedOut] = React.useState(false);

    const dragStart = React.useRef<{ pointerId: number; x: number; y: number } | null>(null);

    const isRemoved = Boolean(toast.dismissed);
    const isFront = place.index === 0;
    // Only the toast at the front of a gathered stack is shown in full; the rest are laid back
    // behind it and held to its height
    const isStacked = mounted && !expanded && !isFront;
    const isCustom = Boolean(render);
    const anchor = position.startsWith("top") ? "top" : "bottom";

    const close = (reason: ToastCloseReason) => {
        if (toast.dismissed) {
            return;
        }

        dismissToast(id);

        if (reason === "timeout") {
            toast.onAutoClose?.(toast);
        } else {
            toast.onDismiss?.(toast);
        }
    };

    // The toast is laid where it comes in from first and moved into place once it has been
    // painted there, so that there is something for the transition to run between
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // What is left of the toast's time, kept out of the render since counting down is not
    // something to render on
    const remaining = React.useRef({ revision: -1, time: duration });

    React.useEffect(() => {
        // A toast that has been changed where it stands starts its time over
        if (remaining.current.revision !== toast.revision) {
            remaining.current = { revision: toast.revision, time: duration };
        }

        if (paused || isRemoved || duration === Infinity) {
            return;
        }

        const startedAt = Date.now();
        const timer = window.setTimeout(
            () => close("timeout"),
            Math.max(remaining.current.time, 0),
        );

        return () => {
            window.clearTimeout(timer);
            remaining.current.time -= Date.now() - startedAt;
        };
        // `close` is left out on purpose: it is built afresh on every render, and everything
        // it reads is already listed here by way of the toast it belongs to
    }, [toast, duration, paused, isRemoved]);

    // A dismissed toast is only taken off the list once it has finished being animated away,
    // so that it is not pulled out from under its own animation
    React.useEffect(() => {
        if (!isRemoved) {
            return;
        }

        const timer = window.setTimeout(() => removeToast(id), REMOVAL_DELAY);

        return () => {
            window.clearTimeout(timer);
        };
    }, [isRemoved, id]);

    // The toast is let go of for a moment so that its own height can be read, whatever height
    // the stack is holding it at
    useIsomorphicLayoutEffect(() => {
        const element = toastRef.current;

        if (!element) {
            return;
        }

        const held = element.style.height;
        element.style.height = "auto";
        const measured = element.getBoundingClientRect().height;
        element.style.height = held;

        onHeight(id, measured);
    }, [onHeight, id, toast.revision, title, description, expanded]);

    const canSwipe = (direction: ToastSwipeDirection) => swipeDirections.includes(direction);

    // A drag is only followed the ways the toast can be swiped away, so that pulling it any
    // other way does not take it out of the stack
    const along = (delta: number, back: ToastSwipeDirection, forward: ToastSwipeDirection) =>
        delta < 0 ? (canSwipe(back) ? delta : 0) : canSwipe(forward) ? delta : 0;

    const handlePointerDown = (event: React.PointerEvent<HTMLLIElement>) => {
        // A press on one of the toast's own buttons is that button's to answer
        if (!dismissible || event.button !== 0 || (event.target as HTMLElement).closest("button")) {
            return;
        }

        dragStart.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
        // Holding on to the pointer keeps the drag with the toast even once it has moved out
        // from under it. Not every browser offers it, and the drag reads well enough without
        event.currentTarget.setPointerCapture?.(event.pointerId);
        setIsDragging(true);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLLIElement>) => {
        const start = dragStart.current;

        if (!start || start.pointerId !== event.pointerId) {
            return;
        }

        setSwipe({
            x: along(event.clientX - start.x, "left", "right"),
            y: along(event.clientY - start.y, "top", "bottom"),
        });
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLLIElement>) => {
        const start = dragStart.current;

        if (!start || start.pointerId !== event.pointerId) {
            return;
        }

        dragStart.current = null;
        setIsDragging(false);

        if (Math.max(Math.abs(swipe.x), Math.abs(swipe.y)) < SWIPE_THRESHOLD) {
            setSwipe({ x: 0, y: 0 });
            return;
        }

        // The toast carries on the way it was going rather than stopping where it was let go
        // of, and goes far enough to be clear of the viewport before it is taken away
        const bounds = event.currentTarget.getBoundingClientRect();
        const carry = (delta: number, size: number) =>
            delta === 0 ? 0 : Math.sign(delta) * (size + SWIPE_CLEARANCE);

        setSwipe({ x: carry(swipe.x, bounds.width), y: carry(swipe.y, bounds.height) });
        setIsSwipedOut(true);
        close("swipe");
    };

    const handlePointerCancel = () => {
        dragStart.current = null;
        setIsDragging(false);
        setSwipe({ x: 0, y: 0 });
    };

    // Where a toast goes as it arrives, where it rests, and where it goes as it leaves. A
    // gathered toast rests a step of the gap back for every toast in front of it; an open one
    // rests past everything standing in front of it
    const restingShift = expanded
        ? "calc(var(--toast-lift) * var(--toast-offset))"
        : "calc(var(--toast-lift) * var(--toaster-gap) * var(--toast-index))";

    const offscreenShift = "calc(var(--toast-lift) * -100%)";

    const shift = () => {
        if (!mounted) {
            return offscreenShift;
        }

        if (!isRemoved || isSwipedOut) {
            return restingShift;
        }

        // A toast that was standing at the front goes out the way it came in. One from
        // further back only does so where the stack is open and it has somewhere to go
        // without crossing the others
        if (isFront) {
            return offscreenShift;
        }

        return expanded ? `calc(${restingShift} + ${offscreenShift})` : restingShift;
    };

    // A height that has not been measured yet is left to the content, so that the toast is
    // never held at nothing
    const measured = (value: number) => (value > 0 ? `${value}px` : "auto");

    const style = {
        "--toast-index": place.index,
        "--toast-offset": `${place.offset}px`,
        "--toast-z-index": stackSize - place.index,
        "--toast-height": measured(isStacked ? frontHeight : height),
        "--toast-shift": shift(),
        "--toast-scale": isStacked ? Math.max(1 - place.index * STACKED_SCALE_STEP, 0) : 1,
        "--toast-swipe-x": `${swipe.x}px`,
        "--toast-swipe-y": `${swipe.y}px`,
    } as React.CSSProperties;

    const Icon = iconForVariant[variant];
    // An icon given as `null` is a toast asking for none at all, so it is taken at its word
    // rather than falling back on the one the variant carries
    const given = toast.icon !== undefined ? toast.icon : icons?.[variant];

    const icon =
        given !== undefined ? (
            given
        ) : variant === "loading" ? (
            <Spinner size="small" srText={null} />
        ) : Icon ? (
            <Icon />
        ) : null;

    const renderAction = (
        action: ToastAction | undefined,
        reason: ToastCloseReason,
        buttonVariant: "default" | "invisible",
    ) => {
        if (!isActionDescriptor(action)) {
            return action;
        }

        return (
            <Button
                size="small"
                variant={buttonVariant}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    action.onClick?.(event);

                    // A handler that takes the event leaves the toast standing
                    if (!event.defaultPrevented) {
                        close(reason);
                    }
                }}
                data-component={`Toast.${reason === "action" ? "Action" : "Cancel"}`}
            >
                {action.label}
            </Button>
        );
    };

    const hasActions = toast.action !== undefined || toast.cancel !== undefined;

    return (
        <li
            ref={toastRef}
            role={important ? "alert" : "status"}
            aria-live={important ? "assertive" : "polite"}
            aria-atomic="true"
            className={classNames(
                classes.root,
                classes.lift[anchor],
                classes.bridge,
                anchor === "top" ? classes.bridgeTop : classes.bridgeBottom,
                dismissible && classes.grabbable,
                !isCustom && classes.card,
                !isCustom && classes.iconColor[variant],
                !isCustom && richColors && classes.richColors[variant],
                (!mounted || isRemoved || !visible) && classes.hidden,
                !visible && classes.waiting,
                isDragging ? classes.dragging : classes.animated,
                defaults.className,
                toast.className,
            )}
            style={style}
            data-component="Toast"
            data-variant={variant}
            data-position={position}
            data-mounted={mounted}
            data-removed={isRemoved}
            data-front={isFront}
            data-expanded={expanded}
            data-stacked={isStacked}
            data-visible={visible}
            data-dragging={isDragging}
            data-swiped-out={isSwipedOut}
            data-rich-colors={richColors || undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
        >
            {isCustom ? (
                render?.(toast)
            ) : (
                <div
                    className={classNames(classes.body, isStacked && classes.bodyStacked)}
                    data-component="Toast.Body"
                >
                    {icon === null ? null : (
                        // The text is what says how things stand; the icon only shows it
                        // again, so there is nothing in it for a screen reader to read out
                        <span
                            className={classes.icon}
                            aria-hidden="true"
                            data-component="Toast.Icon"
                        >
                            {icon}
                        </span>
                    )}
                    <div className={classes.content} data-component="Toast.Content">
                        <div className={classes.title} data-component="Toast.Title">
                            {title}
                        </div>
                        {description === undefined ? null : (
                            <div className={classes.description} data-component="Toast.Description">
                                {description}
                            </div>
                        )}
                    </div>
                    {hasActions ? (
                        <div className={classes.actions} data-component="Toast.Actions">
                            {renderAction(toast.cancel, "cancel", "invisible")}
                            {renderAction(toast.action, "action", "default")}
                        </div>
                    ) : null}
                    {closeButton && dismissible ? (
                        <IconButton
                            icon={DismissRegular}
                            aria-label="Close"
                            variant="invisible"
                            size="small"
                            onClick={() => close("close-button")}
                            data-component="Toast.CloseButton"
                        />
                    ) : null}
                </div>
            )}
        </li>
    );
}

Toast.displayName = "Toast";

export default Toast;
