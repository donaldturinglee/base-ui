import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import Toast from "./Toast";
import { getServerToasts, getToasts, subscribeToToasts } from "./toastStore";
import type { ToastPlace, ToastPosition, ToastSwipeDirection, ToasterProps } from "./Toast.types";

const toasterVariants = cva(
    // The stack is laid over everything else on the page, since it says what has happened
    // wherever the reader happens to be
    "fixed m-0 list-none p-0 z-popover w-[var(--toaster-width)] max-w-[calc(100dvw_-_2_*_var(--toaster-offset))] [--toaster-offset:var(--toaster-viewport-offset)] max-small:[--toaster-offset:var(--toaster-mobile-offset)]",
    {
        variants: {
            // Every toast is laid at the anchored edge of the stack, so the list itself takes up
            // no room and catches nothing that is not a toast
            position: {
                "top-left": "top-[var(--toaster-offset)] left-[var(--toaster-offset)]",
                "top-center": "top-[var(--toaster-offset)] left-1/2 -translate-x-1/2",
                "top-right": "top-[var(--toaster-offset)] right-[var(--toaster-offset)]",
                "bottom-left": "bottom-[var(--toaster-offset)] left-[var(--toaster-offset)]",
                "bottom-center": "bottom-[var(--toaster-offset)] left-1/2 -translate-x-1/2",
                "bottom-right": "bottom-[var(--toaster-offset)] right-[var(--toaster-offset)]",
            } satisfies Record<ToastPosition, string>,
        },
    },
);

// What a toast is given where neither it nor the Toaster around it says otherwise
const DEFAULT_DURATION = 4000;
const DEFAULT_VISIBLE_TOASTS = 3;
const DEFAULT_GAP = 14;
const DEFAULT_OFFSET = 24;
const DEFAULT_MOBILE_OFFSET = 16;
const DEFAULT_WIDTH = 356;

// The keys that put focus on the stack from wherever the reader is on the page
const DEFAULT_HOTKEY = ["altKey", "KeyT"];

const toLength = (value: number | string) => (typeof value === "number" ? `${value}px` : value);

// The way a toast is swiped away follows the corner the stack is anchored to: always towards
// the edge it came in from, and towards the side it is standing against
const defaultSwipeDirections = (position: ToastPosition): ToastSwipeDirection[] => {
    const [block, inline] = position.split("-");
    const directions: ToastSwipeDirection[] = [block as ToastSwipeDirection];

    if (inline === "left" || inline === "right") {
        directions.push(inline);
    }

    return directions;
};

// The page is not being read while it is out of sight, so nothing on it should be timing out
const subscribeToVisibility = (onStoreChange: () => void) => {
    document.addEventListener("visibilitychange", onStoreChange);

    return () => {
        document.removeEventListener("visibilitychange", onStoreChange);
    };
};

const getIsPageHidden = () => document.visibilityState === "hidden";

const getIsPageHiddenOnServer = () => false;

// The place every toast is showing is left standing wherever the toasts are shown from, so
// there is one of these for the whole page rather than one for every place a toast is raised.
// It renders nothing of its own; the toasts come from `toast()`
function Toaster(
    props: ToasterProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        position = "bottom-right",
        expand = false,
        visibleToasts = DEFAULT_VISIBLE_TOASTS,
        toastOptions,
        duration = DEFAULT_DURATION,
        closeButton = false,
        richColors = false,
        gap = DEFAULT_GAP,
        offset = DEFAULT_OFFSET,
        mobileOffset = DEFAULT_MOBILE_OFFSET,
        width = DEFAULT_WIDTH,
        hotkey = DEFAULT_HOTKEY,
        swipeDirections,
        icons,
        containerAriaLabel = "Notifications",
        className,
        style,
        ...rest
    } = props;

    const toasts = React.useSyncExternalStore(subscribeToToasts, getToasts, getServerToasts);
    const isPageHidden = React.useSyncExternalStore(
        subscribeToVisibility,
        getIsPageHidden,
        getIsPageHiddenOnServer,
    );

    const listRef = React.useRef<HTMLOListElement>(null);
    const mergedRef = useMergedRefs(ref, listRef);

    const [heights, setHeights] = React.useState<Record<string, number>>({});
    // Whether the reader is on the stack, either with a pointer or with the keyboard, which
    // both opens it out and holds every toast in it where it is
    const [isEngaged, setIsEngaged] = React.useState(false);

    const isExpanded = expand || isEngaged;

    const reportHeight = React.useCallback((id: string, height: number) => {
        setHeights((current) => (current[id] === height ? current : { ...current, [id]: height }));
    }, []);

    // The height of a toast that has been taken off the list is let go of with it, rather than
    // being held on to for the life of the page
    React.useEffect(() => {
        setHeights((current) => {
            const kept = Object.keys(current).filter((id) => toasts.some((item) => item.id === id));

            if (kept.length === Object.keys(current).length) {
                return current;
            }

            return Object.fromEntries(kept.map((id) => [id, current[id]]));
        });
    }, [toasts]);

    // A toast that is on its way out is no longer part of the stack, so the ones behind it
    // come forward into its place while it is still being animated away
    const standing = toasts.filter((item) => !item.dismissed);

    const places = new Map<string, ToastPlace>();
    let laid = 0;

    standing.forEach((item, index) => {
        places.set(item.id, { index, offset: laid });
        laid += (heights[item.id] ?? 0) + gap;
    });

    // A toast on its way out holds the place it was standing in, so that it goes away from
    // where it was rather than dropping back to the edge first
    const restingPlaces = React.useRef(places);

    for (const item of toasts) {
        if (!places.has(item.id)) {
            const held = restingPlaces.current.get(item.id);

            if (held) {
                places.set(item.id, held);
            }
        }
    }

    restingPlaces.current = places;

    const frontHeight = standing.length > 0 ? (heights[standing[0].id] ?? 0) : 0;

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const list = listRef.current;
            const isWithin =
                list !== null &&
                (document.activeElement === list || list.contains(document.activeElement));

            // Escape hands the page back and gathers the stack up again, rather than seeing
            // the toasts off, since they may not have been read yet
            if (event.code === "Escape" && isWithin) {
                setIsEngaged(false);
                return;
            }

            // Every part of the hotkey has to hold, each of them read either as a property of
            // the event or as the code of the key that was pressed
            const isHotkey = hotkey.every(
                (key) =>
                    Boolean((event as unknown as Record<string, unknown>)[key]) ||
                    event.code === key,
            );

            if (isHotkey) {
                setIsEngaged(true);
                listRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [hotkey]);

    const defaults = {
        duration,
        closeButton,
        richColors,
        dismissible: true,
        ...toastOptions,
    };

    const swipe = swipeDirections ?? defaultSwipeDirections(position);

    return (
        <Portal>
            {/* The region is left standing whether there are toasts in it or not, so that a
                screen reader has somewhere to read the first one from */}
            <section
                aria-label={containerAriaLabel}
                aria-live="polite"
                aria-relevant="additions text"
                aria-atomic="false"
                tabIndex={-1}
                data-component="Toaster.Region"
            >
                <ol
                    ref={mergedRef}
                    tabIndex={-1}
                    className={classNames(toasterVariants({ position }), className)}
                    style={
                        {
                            ...style,
                            "--toaster-width": toLength(width),
                            "--toaster-viewport-offset": toLength(offset),
                            "--toaster-mobile-offset": toLength(mobileOffset),
                            "--toaster-gap": `${gap}px`,
                        } as React.CSSProperties
                    }
                    data-component="Toaster"
                    data-position={position}
                    data-expanded={isExpanded}
                    onPointerEnter={() => setIsEngaged(true)}
                    onPointerLeave={() => setIsEngaged(false)}
                    onFocus={() => setIsEngaged(true)}
                    onBlur={(event) => {
                        if (!event.currentTarget.contains(event.relatedTarget)) {
                            setIsEngaged(false);
                        }
                    }}
                    {...rest}
                >
                    {toasts.map((item) => {
                        const place = places.get(item.id) ?? { index: 0, offset: 0 };

                        return (
                            <Toast
                                key={item.id}
                                toast={item}
                                place={place}
                                position={position}
                                height={heights[item.id] ?? 0}
                                frontHeight={frontHeight}
                                stackSize={toasts.length}
                                expanded={isExpanded}
                                // Only so many toasts stand at once; the rest wait behind them
                                // until there is room
                                visible={place.index < visibleToasts}
                                // Nothing times out while it is being read, or while the page
                                // it is on is out of sight altogether
                                paused={isEngaged || isPageHidden}
                                swipeDirections={swipe}
                                icons={icons}
                                defaults={defaults}
                                onHeight={reportHeight}
                            />
                        );
                    })}
                </ol>
            </section>
        </Portal>
    );
}

Toaster.displayName = "Toaster";

export default fixedForwardRef(Toaster);
