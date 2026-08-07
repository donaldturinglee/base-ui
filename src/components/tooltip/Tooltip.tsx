import * as React from "react";
import { apply, isSupported } from "@oddbird/popover-polyfill/fn";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getAnchoredPosition } from "./anchoredPosition";
import { TooltipContext } from "./TooltipContext";
import type { AnchorAlignment, AnchorSide } from "./anchoredPosition";
import type { TooltipDelay, TooltipDirection, TooltipProps } from "./Tooltip.types";

const classes = {
    root: "tooltip",
    open: "tooltip-open motion-safe:[&:popover-open]:animate-in motion-safe:[&:popover-open]:fade-in motion-safe:[&:popover-open]:duration-100",
    // A browser without the popover API is served by the polyfill, which marks an open
    // popover with a class named `:popover-open` rather than with the pseudo-class. It
    // rewrites the selectors it is asked for at runtime, but not the ones already in a
    // stylesheet, so that state is matched here as well
    openPolyfilled:
        "tooltip-open-polyfilled motion-safe:[&[class~=':popover-open']]:animate-in motion-safe:[&[class~=':popover-open']]:fade-in motion-safe:[&[class~=':popover-open']]:duration-100",
    bridge: "tooltip-bridge",
    bridgeVertical: "tooltip-bridge-vertical",
    bridgeHorizontal: "tooltip-bridge-horizontal",
};

const directionToPosition: Record<TooltipDirection, { side: AnchorSide; align: AnchorAlignment }> =
    {
        nw: { side: "outside-top", align: "end" },
        n: { side: "outside-top", align: "center" },
        ne: { side: "outside-top", align: "start" },
        e: { side: "outside-right", align: "center" },
        se: { side: "outside-bottom", align: "start" },
        s: { side: "outside-bottom", align: "center" },
        sw: { side: "outside-bottom", align: "end" },
        w: { side: "outside-left", align: "center" },
    };

const positionToDirection: Record<string, TooltipDirection> = {
    "outside-top-end": "nw",
    "outside-top-center": "n",
    "outside-top-start": "ne",
    "outside-right-center": "e",
    "outside-bottom-start": "se",
    "outside-bottom-center": "s",
    "outside-bottom-end": "sw",
    "outside-left-center": "w",
};

// For where these come from, see https://github.com/github/primer/issues/3313
const delayTimes: Record<TooltipDelay, number> = {
    short: 50,
    medium: 400,
    long: 1200,
};

// What counts as something a reader can reach, taken from the rule GitHub audits against
const interactiveSelectors = [
    "a[href]",
    "button:not([disabled])",
    "summary",
    "select",
    "input:not([type=hidden])",
    "textarea",
];

const isInteractive = (element: HTMLElement) =>
    interactiveSelectors.some((selector) => element.matches(selector)) ||
    element.getAttribute("role") === "button";

// The trigger itself, or anything within two levels of it, has to be reachable
const hasInteractiveContent = (element: HTMLElement) =>
    isInteractive(element) ||
    Array.from(element.childNodes).some(
        (child) =>
            (child instanceof HTMLElement && isInteractive(child)) ||
            Array.from(child.childNodes).some(
                (grandChild) => grandChild instanceof HTMLElement && isInteractive(grandChild),
            ),
    );

type TriggerProps = {
    ref?: React.Ref<HTMLElement>;
    "aria-describedby"?: string;
    "aria-labelledby"?: string;
    onBlur?: React.FocusEventHandler;
    onFocus?: React.FocusEventHandler;
    onMouseEnter?: React.MouseEventHandler;
    onMouseOverCapture?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onTouchEnd?: React.TouchEventHandler;
};

// Says more about the one thing it is wrapped around. The trigger has to be something a
// reader can reach, since a tooltip only ever appears on hover or focus
function Tooltip(
    props: TooltipProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        text,
        id,
        direction = "s",
        type = "description",
        delay = "short",
        ...rest
    } = props;

    const tooltipId = useId(id);
    const child = React.Children.only(children);

    const triggerRef = React.useRef<HTMLElement>(null);
    const mergedTriggerRef = useMergedRefs(ref, triggerRef);
    const tooltipRef = React.useRef<HTMLSpanElement>(null);
    const openTimeout = React.useRef<number | null>(null);
    const closeTimeout = React.useRef<number | null>(null);

    const [isOpen, setIsOpen] = React.useState(false);
    const [placedDirection, setPlacedDirection] = React.useState<TooltipDirection>(direction);

    const clearTimers = () => {
        if (openTimeout.current !== null) {
            window.clearTimeout(openTimeout.current);
            openTimeout.current = null;
        }

        if (closeTimeout.current !== null) {
            window.clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
    };

    React.useEffect(() => clearTimers, []);

    const openTooltip = () => {
        const tooltip = tooltipRef.current;
        const trigger = triggerRef.current;

        if (!tooltip || !trigger) {
            return;
        }

        // Showing a popover that is already showing throws, and there is nothing to do in
        // that case anyway
        try {
            tooltip.showPopover();
        } catch {
            return;
        }

        setIsOpen(true);

        const { side, align } = directionToPosition[direction];
        const { top, left, anchorSide, anchorAlign } = getAnchoredPosition(tooltip, trigger, {
            side,
            align,
        });

        // Where there was no room the tooltip has been moved, so the bridge is drawn on
        // whichever side it actually ended up
        setPlacedDirection(positionToDirection[`${anchorSide}-${anchorAlign}`] ?? direction);
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
    };

    const closeTooltip = () => {
        clearTimers();
        setIsOpen(false);

        try {
            tooltipRef.current?.hidePopover();
        } catch {
            // Hiding a popover that is not showing throws, and there is nothing to do
        }
    };

    React.useEffect(() => {
        const tooltip = tooltipRef.current;
        const trigger = triggerRef.current;

        if (!tooltip || !trigger) {
            return;
        }

        // A tooltip that cannot be reached cannot be read, so this is a mistake worth
        // stopping at rather than shipping
        if (!hasInteractiveContent(trigger)) {
            throw new Error(
                "The `Tooltip` component expects a single React element that contains interactive content. Consider using a `<button>` or an equivalent element instead.",
            );
        }

        // The polyfill stands in for the popover API where a browser does not have it. It
        // is applied here rather than on import so that nothing is patched while rendering
        // on a server, and it does nothing where the API is already there
        if (typeof window !== "undefined" && !isSupported()) {
            apply();
        }

        // Manual rather than auto, because an auto popover hands focus back to whatever
        // held it when the popover closes. A reader tabbing off the trigger would be
        // pulled straight back to it, and the tooltip would open again. A tooltip never
        // takes focus, so it has no business giving it back either. It also means opening
        // one does not close a menu or a dialog standing open beside it
        tooltip.setAttribute("popover", "manual");
    }, []);

    useOnEscapePress((event) => {
        if (!isOpen) {
            return;
        }

        event.preventDefault();
        closeTooltip();
    });

    const value = React.useMemo(() => ({ tooltipId }), [tooltipId]);

    if (!React.isValidElement<TriggerProps>(child)) {
        return null;
    }

    const childProps = child.props;

    const trigger = React.cloneElement(child, {
        ref: mergedTriggerRef,
        // A description is added to whatever already describes the trigger; a label stands
        // in place of its own
        "aria-describedby":
            type === "description"
                ? [childProps["aria-describedby"], tooltipId].filter(Boolean).join(" ")
                : childProps["aria-describedby"],
        "aria-labelledby": type === "label" ? tooltipId : childProps["aria-labelledby"],
        onFocus: (event: React.FocusEvent) => {
            // Only a reader who arrived by keyboard is shown the tooltip
            try {
                if (!event.target.matches(":focus-visible")) {
                    return;
                }
            } catch {
                // jsdom does not know the selector, and a test is keyboard enough
            }

            openTooltip();
            childProps.onFocus?.(event);
        },
        onBlur: (event: React.FocusEvent) => {
            closeTooltip();
            childProps.onBlur?.(event);
        },
        // Captured on the way down, so the wait starts before anything else the trigger
        // does can cancel it
        onMouseOverCapture: (event: React.MouseEvent) => {
            openTimeout.current = window.setTimeout(() => {
                // The pointer may have moved on while the wait was running
                if (openTimeout.current === null) {
                    return;
                }

                openTooltip();
                childProps.onMouseEnter?.(event);
            }, delayTimes[delay]);
        },
        onMouseLeave: (event: React.MouseEvent) => {
            closeTooltip();
            childProps.onMouseLeave?.(event);
        },
        onTouchEnd: (event: React.TouchEvent) => {
            childProps.onTouchEnd?.(event);

            // A tap closes the tooltip again, which leaves press-and-hold as the way to
            // read one on a touch screen
            closeTimeout.current = window.setTimeout(closeTooltip, 10);
        },
    });

    return (
        <TooltipContext.Provider value={value}>
            {trigger}
            <span
                ref={tooltipRef}
                id={tooltipId}
                // Only a description is a tooltip in its own right; a label is read as the
                // name of the trigger instead
                role={type === "description" ? "tooltip" : undefined}
                // Either way it is announced through the trigger, so it is not announced
                // again in its own right
                aria-hidden="true"
                className={classNames(
                    classes.root,
                    classes.open,
                    classes.openPolyfilled,
                    classes.bridge,
                    classes.bridgeVertical,
                    classes.bridgeHorizontal,
                    className,
                )}
                // The pointer is allowed to rest on the tooltip itself
                onMouseEnter={openTooltip}
                onMouseLeave={closeTooltip}
                data-component="Tooltip"
                data-direction={placedDirection}
                {...rest}
            >
                {text}
            </span>
        </TooltipContext.Provider>
    );
}

Tooltip.displayName = "Tooltip";

export default fixedForwardRef(Tooltip);
