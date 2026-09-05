import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { classNames } from "../../lib/classnames";
import { useDirection } from "../../providers/direction/useDirection";
import { NavigationMenuContext } from "./NavigationMenuContext";
import { focusFirst, getTabbables, removeFromTabOrder } from "./tabOrder";
import { getViewportPosition } from "./viewportPosition";
import type { TextDirection } from "../../providers/direction/Direction.types";
import type {
    NavigationMenuContextValue,
    NavigationMenuFocusSide,
    NavigationMenuItemRegistration,
    NavigationMenuMotion,
    NavigationMenuPoint,
    NavigationMenuProps,
    NavigationMenuRect,
    NavigationMenuSize,
    NavigationMenuViewportRegistration,
} from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu",
};

// Long enough that a pointer crossing the row does not open every panel on its way past, and
// short enough that one that stopped on an item is not kept waiting
const DEFAULT_OPEN_DELAY = 200;

// Long enough to cross the gap between an item and the panel it opened without it closing on
// the way
const DEFAULT_CLOSE_DELAY = 300;

const ROOT_SELECTOR = "[data-component='NavigationMenu']";
const CONTENT_SELECTOR = "[data-component='NavigationMenu.Content']";
const TRIGGER_SELECTOR = "[data-component='NavigationMenu.Trigger']";
const LINK_SELECTOR = "[data-component='NavigationMenu.Link']";
const TRIGGER_PROXY_SELECTOR = "[data-component='NavigationMenu.TriggerProxy']";

// The nearest thing a part can belong to: a menu, or a panel standing in one. A part belongs to
// whichever of the two stands closest around it, so a menu written inside another's panel keeps
// its parts to itself
const SCOPE_SELECTOR = `${ROOT_SELECTOR}, ${CONTENT_SELECTOR}`;

const belongsTo = (element: Element, scope: Element | null) =>
    element.closest(SCOPE_SELECTOR) === scope;

// Whether what is under a press or under focus is one of this menu's own triggers, or the
// stand-in for one, which the menu leaves to the trigger to answer
const isOwnTrigger = (target: Node, root: Element | null) => {
    if (!(target instanceof Element)) {
        return false;
    }

    const trigger = target.closest(`${TRIGGER_SELECTOR}, ${TRIGGER_PROXY_SELECTOR}`);

    return trigger !== null && belongsTo(trigger, root);
};

// What a measurement is held against, so that measuring the same thing again is not rendering
// everything drawn from it again
const keep = <T extends Record<string, number>>(current: T | null, next: T) =>
    current !== null && Object.keys(next).every((key) => current[key] === next[key])
        ? current
        : next;

const px = (value: number | undefined) => (value === undefined ? undefined : `${value}px`);

// Which way a panel arrives from in the viewport, told from where its trigger stands in the row
// against where the trigger of the panel it took the place of stood. Nothing where the menu was
// shut before, since a panel that took the place of nothing came from nowhere
const getMotion = (
    triggers: HTMLElement[],
    value: string,
    previousValue: string,
    direction: TextDirection,
): NavigationMenuMotion | null => {
    if (!value || !previousValue) {
        return null;
    }

    const values = triggers.map((trigger) => trigger.dataset.value ?? "");

    // A row read right to left is drawn the other way round from the order it is written, and
    // it is the drawing that says which way a panel came from
    if (direction === "rtl") {
        values.reverse();
    }

    const index = values.indexOf(value);
    const previousIndex = values.indexOf(previousValue);

    if (index === -1 || previousIndex === -1 || index === previousIndex) {
        return null;
    }

    return index > previousIndex ? "from-end" : "from-start";
};

// Which item was open before the one that is, kept beside it so that the parts sliding along the
// row know whether they have anywhere to slide from
type Transition = {
    value: string;
    previousValue: string;
    motion: NavigationMenuMotion | null;
};

// A panel asked to be stepped into before it was drawn, so that it can be stepped into once it
// has been
type PendingFocus = {
    value: string;
    side: NavigationMenuFocusSide;
};

// A row of the places a reader can go from here, where some of those places are a panel of
// links rather than a link of their own. It is a landmark of its own, so the parts of a site it
// stands for can be reached without reading through everything around it.
//
//     <NavigationMenu aria-label="Main">
//         <NavigationMenu.List>
//             <NavigationMenu.Item value="product">
//                 <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
//                 <NavigationMenu.Content>
//                     <NavigationMenu.Link href="/features">Features</NavigationMenu.Link>
//                 </NavigationMenu.Content>
//             </NavigationMenu.Item>
//             <NavigationMenu.Item value="pricing">
//                 <NavigationMenu.Link href="/pricing">Pricing</NavigationMenu.Link>
//             </NavigationMenu.Item>
//         </NavigationMenu.List>
//     </NavigationMenu>
//
// Only one panel stands open at a time, which is what makes it a menu rather than a page. A
// press opens one, and so does the pointer resting on its trigger, and either way it is closed
// by a press or the pointer going elsewhere, by Escape, or by a link in it being followed.
//
// A panel stands under the item that opened it across a row, and beside it down a column. A
// menu drawing every panel in one `NavigationMenu.Viewport` instead has the viewport slide
// along the row and grow to fit each panel as the reader moves between items
function NavigationMenu(
    props: NavigationMenuProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        children,
        className,
        style,
        value: valueProp,
        defaultValue = "",
        onValueChange,
        orientation = "horizontal",
        openDelay = DEFAULT_OPEN_DELAY,
        closeDelay = DEFAULT_CLOSE_DELAY,
        disableClickTrigger = false,
        disableHoverTrigger = false,
        disablePointerLeaveClose = false,
        ...rest
    } = props;

    const direction = useDirection();

    const rootRef = React.useRef<HTMLElement>(null);
    const listRef = React.useRef<HTMLUListElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);

    /* Which item stands open */

    // A menu the caller is holding the state of takes what stands open from the prop; one that
    // is not keeps its own
    const isControlled = valueProp !== undefined;
    const [selfValue, setSelfValue] = React.useState(defaultValue);
    const value = isControlled ? valueProp : selfValue;
    const open = value !== "";

    // Read by the timers and the listeners, which are set up once rather than again each time
    // the value moves
    const latestValue = React.useRef(value);
    const latestOnValueChange = React.useRef(onValueChange);

    useIsomorphicLayoutEffect(() => {
        latestValue.current = value;
        latestOnValueChange.current = onValueChange;
    });

    /* The parts, by the item they belong to */

    const items = React.useRef(new Map<string, NavigationMenuItemRegistration>());

    const registerItem = React.useCallback(
        (itemValue: string, registration: NavigationMenuItemRegistration) => {
            items.current.set(itemValue, registration);

            return () => {
                if (items.current.get(itemValue) === registration) {
                    items.current.delete(itemValue);
                }
            };
        },
        [],
    );

    const getTriggerElement = React.useCallback((itemValue: string) => {
        const id = items.current.get(itemValue)?.triggerId;

        return id ? document.getElementById(id) : null;
    }, []);

    const getContentElement = React.useCallback((itemValue: string) => {
        const id = items.current.get(itemValue)?.contentId;

        return id ? document.getElementById(id) : null;
    }, []);

    const getTriggerProxyElement = React.useCallback((itemValue: string) => {
        const id = items.current.get(itemValue)?.triggerProxyId;

        return id ? document.getElementById(id) : null;
    }, []);

    // The triggers standing in the row, in the order they are written. Read from the page
    // rather than from the items as they were registered, since an item written into the middle
    // of the row registers after the ones either side of it
    const getTopLevelTriggers = React.useCallback(() => {
        const list = listRef.current;

        if (!list) {
            return [];
        }

        return Array.from(list.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR)).filter((trigger) =>
            belongsTo(trigger, rootRef.current),
        );
    }, []);

    // The triggers and links the arrow keys move between, in the order they are written. What
    // a panel holds is left out, since a panel is reached by stepping into it rather than by
    // moving along the row, and a disabled trigger is passed over rather than landed on
    const getTopLevelElements = React.useCallback(() => {
        const list = listRef.current;

        if (!list) {
            return [];
        }

        return Array.from(
            list.querySelectorAll<HTMLElement>(`${TRIGGER_SELECTOR}, ${LINK_SELECTOR}`),
        ).filter(
            (element) =>
                belongsTo(element, rootRef.current) &&
                !element.matches(":disabled, [aria-disabled='true']"),
        );
    }, []);

    const getContentLinks = React.useCallback(
        (itemValue: string) => {
            const content = getContentElement(itemValue);

            if (!content) {
                return [];
            }

            return Array.from(content.querySelectorAll<HTMLElement>(LINK_SELECTOR)).filter((link) =>
                belongsTo(link, content),
            );
        },
        [getContentElement],
    );

    /* Which item was open before */

    // Put back while rendering rather than in an effect afterwards, so that the parts sliding
    // along the row are never drawn for a frame as though they had somewhere to slide from
    // when they do not. The row is read for which way the panel came from, which is the one
    // thing here that reaches the page during a render: the triggers are already standing there
    // from the render before, and only the render that moves the value reads them
    const [transition, setTransition] = React.useState<Transition>({
        value,
        previousValue: "",
        motion: null,
    });

    if (transition.value !== value) {
        setTransition({
            value,
            previousValue: transition.value,
            motion: getMotion(getTopLevelTriggers(), value, transition.value, direction),
        });
    }

    const { previousValue, motion } = transition;
    const still = open && previousValue === "";

    /* The timers the pointer sets going */

    const openTimeouts = React.useRef(new Map<string, number>());
    const closeTimeout = React.useRef<number | null>(null);

    const cancelClose = React.useCallback(() => {
        if (closeTimeout.current !== null) {
            window.clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
    }, []);

    const cancelOpen = React.useCallback((itemValue: string) => {
        const timeout = openTimeouts.current.get(itemValue);

        if (timeout !== undefined) {
            window.clearTimeout(timeout);
            openTimeouts.current.delete(itemValue);
        }
    }, []);

    const cancelOpens = React.useCallback(() => {
        openTimeouts.current.forEach((timeout) => window.clearTimeout(timeout));
        openTimeouts.current.clear();
    }, []);

    React.useEffect(
        () => () => {
            cancelClose();
            cancelOpens();
        },
        [cancelClose, cancelOpens],
    );

    const setValue = React.useCallback(
        (next: string) => {
            // Whatever the pointer had asked for is given up, since something has settled the
            // matter ahead of it
            cancelClose();
            cancelOpens();

            if (next === latestValue.current) {
                return;
            }

            if (!isControlled) {
                setSelfValue(next);
                latestValue.current = next;
            }

            latestOnValueChange.current?.({ value: next });
        },
        [cancelClose, cancelOpens, isControlled],
    );

    const toggle = React.useCallback(
        (itemValue: string) => setValue(latestValue.current === itemValue ? "" : itemValue),
        [setValue],
    );

    const openAfterDelay = React.useCallback(
        (itemValue: string) => {
            cancelClose();

            // Once one panel stands open the menu is already showing, so moving along the row
            // switches to the next one at once rather than making the reader wait again
            if (latestValue.current !== "") {
                setValue(itemValue);
                return;
            }

            cancelOpen(itemValue);

            const timeout = window.setTimeout(() => {
                openTimeouts.current.delete(itemValue);
                setValue(itemValue);
            }, openDelay);

            openTimeouts.current.set(itemValue, timeout);
        },
        [cancelClose, cancelOpen, openDelay, setValue],
    );

    const closeAfterDelay = React.useCallback(() => {
        cancelClose();

        closeTimeout.current = window.setTimeout(() => {
            closeTimeout.current = null;
            setValue("");
        }, closeDelay);
    }, [cancelClose, closeDelay, setValue]);

    /* Focus, and where it is let go */

    const restoreTabOrderRef = React.useRef<(() => void) | null>(null);

    const restoreTabOrder = React.useCallback(() => {
        restoreTabOrderRef.current?.();
        restoreTabOrderRef.current = null;
    }, []);

    // Takes what a panel holds out of the tab order while focus is elsewhere in the menu. A panel
    // drawn in the viewport stands after the whole row, and without this it would be tabbed into
    // from the end of the row rather than from the trigger that opened it
    const removeContentFromTabOrder = React.useCallback(
        (itemValue: string) => {
            const candidates = getTabbables(getContentElement(itemValue));

            if (candidates.length === 0) {
                return;
            }

            const restore = removeFromTabOrder(candidates);
            const previous = restoreTabOrderRef.current;

            restoreTabOrderRef.current = () => {
                restore();
                previous?.();
            };
        },
        [getContentElement],
    );

    const focusInto = React.useCallback(
        (itemValue: string, side: NavigationMenuFocusSide) => {
            const candidates = getTabbables(getContentElement(itemValue));

            focusFirst(side === "start" ? candidates : candidates.reverse());
        },
        [getContentElement],
    );

    const pendingFocus = React.useRef<PendingFocus | null>(null);

    const focusContent = React.useCallback(
        (itemValue: string, side: NavigationMenuFocusSide) => {
            restoreTabOrder();

            if (latestValue.current === itemValue) {
                focusInto(itemValue, side);
                return;
            }

            // Opening the panel and stepping into it are the one gesture, so a panel that was
            // still shut is stepped into once it has been drawn
            pendingFocus.current = { value: itemValue, side };
            setValue(itemValue);
        },
        [focusInto, restoreTabOrder, setValue],
    );

    const close = React.useCallback(() => {
        const current = latestValue.current;

        // Focus goes back to the trigger the panel was opened from, which is where it was
        // before, and is read before the panel is taken away from under it
        if (getContentElement(current)?.contains(document.activeElement)) {
            getTriggerElement(current)?.focus();
        }

        setValue("");
    }, [getContentElement, getTriggerElement, setValue]);

    // A panel that has just been opened is put back in the tab order, whatever was done to it
    // while focus was elsewhere, and stepped into where that was what opened it
    useIsomorphicLayoutEffect(() => {
        restoreTabOrder();

        const pending = pendingFocus.current;
        pendingFocus.current = null;

        if (pending && pending.value === value) {
            focusInto(value, pending.side);
        }
    }, [focusInto, restoreTabOrder, value]);

    useOnEscapePress((event) => {
        if (latestValue.current === "") {
            return;
        }

        // Taking the event keeps a layer this menu was opened over from answering as well
        event.preventDefault();
        close();
    });

    /* The viewport, where there is one */

    const [viewport, setViewport] = React.useState<NavigationMenuViewportRegistration | null>(null);

    // A press anywhere but the panel puts the menu away, which is what a panel standing over
    // the page rather than in it needs. A press on a trigger is left to the trigger, which
    // opens or closes its own panel, and taking the panel away first would only put it back
    React.useEffect(() => {
        if (!open) {
            return;
        }

        const handlePress = (event: MouseEvent | TouchEvent) => {
            const { target } = event;

            if (!(target instanceof Node)) {
                return;
            }

            const surface = viewport?.node ?? getContentElement(latestValue.current);

            if (surface?.contains(target) || isOwnTrigger(target, rootRef.current)) {
                return;
            }

            close();
        };

        document.addEventListener("mousedown", handlePress);
        document.addEventListener("touchstart", handlePress);

        return () => {
            document.removeEventListener("mousedown", handlePress);
            document.removeEventListener("touchstart", handlePress);
        };
    }, [close, getContentElement, open, viewport]);

    // Focus leaving the panel for elsewhere in the menu takes what the panel holds out of the
    // tab order, and focus leaving the menu altogether closes it. Focus landing on a trigger is
    // neither: it is the reader moving along the row, with the panel left standing for them
    React.useEffect(() => {
        if (!open) {
            return;
        }

        const handleFocusIn = (event: FocusEvent) => {
            const { target } = event;

            if (!(target instanceof Node)) {
                return;
            }

            const surface = viewport?.node ?? getContentElement(latestValue.current);

            if (surface?.contains(target) || isOwnTrigger(target, rootRef.current)) {
                return;
            }

            removeContentFromTabOrder(latestValue.current);

            if (rootRef.current?.contains(target)) {
                return;
            }

            close();
        };

        document.addEventListener("focusin", handleFocusIn);

        return () => {
            document.removeEventListener("focusin", handleFocusIn);
        };
    }, [close, getContentElement, open, removeContentFromTabOrder, viewport]);

    /* Where the open item and its panel stand */

    const [triggerRect, setTriggerRect] = React.useState<NavigationMenuRect | null>(null);
    const [viewportSize, setViewportSize] = React.useState<NavigationMenuSize | null>(null);
    const [viewportPosition, setViewportPosition] = React.useState<NavigationMenuPoint | null>(
        null,
    );

    // Measured before the browser paints, so an indicator is never seen standing anywhere but
    // under the open item, and the viewport never anywhere but against it
    useIsomorphicLayoutEffect(() => {
        if (!open) {
            setTriggerRect(null);
            setViewportSize(null);
            setViewportPosition(null);
            return;
        }

        const root = rootRef.current;
        const list = listRef.current;
        const trigger = getTriggerElement(value);
        const content = getContentElement(value);

        if (!root || !trigger) {
            return;
        }

        const measure = () => {
            // Measured against whatever the trigger is laid out in, which is what an indicator
            // standing in the row is laid out against as well
            setTriggerRect((current) =>
                keep(current, {
                    x: trigger.offsetLeft,
                    y: trigger.offsetTop,
                    width: trigger.offsetWidth,
                    height: trigger.offsetHeight,
                }),
            );

            if (!viewport || !content) {
                return;
            }

            setViewportSize((current) =>
                keep(current, { width: content.offsetWidth, height: content.offsetHeight }),
            );
            setViewportPosition((current) =>
                keep(current, getViewportPosition(root, trigger, content, viewport.align)),
            );
        };

        measure();

        // The trigger moves whenever the row is laid out again, the viewport with whatever the
        // panel grows to hold, and both with the page being resized around them. Measuring is
        // left to the next frame, so a burst of changes is measured once
        let frame = 0;

        const observer = new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(measure);
        });

        [trigger, list, root, document.body, viewport ? content : null].forEach((element) => {
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
        };
    }, [getContentElement, getTriggerElement, open, value, viewport]);

    /* What the parts are handed */

    const context = React.useMemo<NavigationMenuContextValue>(
        () => ({
            value,
            open,
            orientation,
            setValue,
            direction,
            motion,
            still,
            triggerRect,
            viewportSize,
            viewportPosition,
            viewport,
            disableClickTrigger,
            disableHoverTrigger,
            disablePointerLeaveClose,
            toggle,
            openAfterDelay,
            cancelOpen,
            closeAfterDelay,
            cancelClose,
            close,
            focusContent,
            registerItem,
            registerViewport: setViewport,
            getTriggerElement,
            getContentElement,
            getTriggerProxyElement,
            getTopLevelElements,
            getContentLinks,
            listRef,
        }),
        [
            cancelClose,
            cancelOpen,
            close,
            closeAfterDelay,
            direction,
            disableClickTrigger,
            disableHoverTrigger,
            disablePointerLeaveClose,
            focusContent,
            getContentElement,
            getContentLinks,
            getTopLevelElements,
            getTriggerElement,
            getTriggerProxyElement,
            motion,
            open,
            openAfterDelay,
            orientation,
            registerItem,
            setValue,
            still,
            toggle,
            triggerRect,
            value,
            viewport,
            viewportPosition,
            viewportSize,
        ],
    );

    return (
        <NavigationMenuContext.Provider value={context}>
            <nav
                ref={mergedRef}
                className={classNames(classes.root, className)}
                // Where the open item's trigger and the viewport stand are handed to the
                // stylesheet, so that an indicator and the viewport can be laid out against
                // the trigger without either measuring anything for itself
                style={
                    {
                        ...style,
                        "--navigation-menu-trigger-width": px(triggerRect?.width),
                        "--navigation-menu-trigger-height": px(triggerRect?.height),
                        "--navigation-menu-trigger-x": px(triggerRect?.x),
                        "--navigation-menu-trigger-y": px(triggerRect?.y),
                        "--navigation-menu-viewport-width": px(viewportSize?.width),
                        "--navigation-menu-viewport-height": px(viewportSize?.height),
                        "--navigation-menu-viewport-x": px(viewportPosition?.x),
                        "--navigation-menu-viewport-y": px(viewportPosition?.y),
                    } as React.CSSProperties
                }
                data-component="NavigationMenu"
                data-orientation={orientation}
                data-open={open ? "" : undefined}
                {...rest}
            >
                {children}
            </nav>
        </NavigationMenuContext.Provider>
    );
}

NavigationMenu.displayName = "NavigationMenu";

export default React.forwardRef(NavigationMenu);
