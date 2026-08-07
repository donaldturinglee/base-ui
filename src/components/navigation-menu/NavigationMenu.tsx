import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../lib/classnames";
import NavigationMenuHeading from "./NavigationMenuHeading";
import { NavigationMenuContext, NavigationMenuHeadingLevelContext } from "./NavigationMenuContext";
import { levelForHeadingTag } from "./headingLevel";
import type { NavigationMenuContextValue, NavigationMenuProps } from "./NavigationMenu.types";

const classes = {
    root: "navigation-menu",
};

const slotsConfig = {
    heading: NavigationMenuHeading,
};

// Long enough that a pointer crossing the row does not open every panel on its way past, and
// short enough that one that stopped on an item is not kept waiting
const DEFAULT_OPEN_DELAY = 200;

// Long enough to cross the gap between an item and the panel it opened without it closing on
// the way
const DEFAULT_CLOSE_DELAY = 300;

// A row of the places a reader can go from here, where some of those places are a panel of
// links rather than a link of their own. It is a landmark of its own, so the parts of a site
// it stands for can be reached without reading through everything around it.
//
//     <NavigationMenu aria-label="Main">
//         <NavigationMenu.List>
//             <NavigationMenu.Item>
//                 <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
//                 <NavigationMenu.Content>
//                     <NavigationMenu.Link href="/features">Features</NavigationMenu.Link>
//                 </NavigationMenu.Content>
//             </NavigationMenu.Item>
//         </NavigationMenu.List>
//     </NavigationMenu>
//
// Only one panel stands open at a time, which is what makes it a menu rather than a page. What
// opens one is a press; a menu can be asked to answer the pointer as well, and still answers a
// press and the keyboard where it does.
//
// Standing the items in a column turns it into a navigation list: the panels are drawn in the
// flow, stepped in under the item that opened them, and the keys run down the whole column
// rather than stepping past whatever stands open in it. A row has no room under it to give,
// so there the panels stand over the page instead
function NavigationMenu(
    props: NavigationMenuProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        children,
        className,
        value: valueProp,
        defaultValue = null,
        onValueChange,
        orientation = "horizontal",
        openOn = "click",
        openDelay = DEFAULT_OPEN_DELAY,
        closeDelay = DEFAULT_CLOSE_DELAY,
        onBlur,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const navRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, navRef);

    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);

    const generatedHeadingId = useId();
    const heading = slots.heading;
    const headingId = heading ? (heading.props.id ?? generatedHeadingId) : undefined;
    const headingLevel = heading ? levelForHeadingTag(heading.props.as ?? "h2") : null;

    // A menu named by the caller keeps that name; one with a heading of its own is named by
    // it, so the landmark is never left unnamed where there is something to name it
    const labelledBy = ariaLabelledBy ?? (ariaLabel ? undefined : headingId);

    // A menu the caller is holding the state of takes what stands open from the prop; one that
    // is not keeps its own
    const isControlled = valueProp !== undefined;
    const [selfValue, setSelfValue] = React.useState<string | null>(defaultValue);
    const openValue = isControlled ? valueProp : selfValue;

    // Kept to one side so that a caller handing over a fresh callback on every render does not
    // put every item below them through a render of their own
    const latestOnValueChange = React.useRef(onValueChange);

    useIsomorphicLayoutEffect(() => {
        latestOnValueChange.current = onValueChange;
    }, [onValueChange]);

    const openTimeout = React.useRef<number | null>(null);
    const closeTimeout = React.useRef<number | null>(null);

    const clearTimers = React.useCallback(() => {
        if (openTimeout.current !== null) {
            window.clearTimeout(openTimeout.current);
            openTimeout.current = null;
        }

        if (closeTimeout.current !== null) {
            window.clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
    }, []);

    React.useEffect(() => clearTimers, [clearTimers]);

    const setOpenValue = React.useCallback(
        (next: string | null) => {
            // Whatever the pointer had asked for is given up, since something has settled the
            // matter ahead of it
            clearTimers();

            if (!isControlled) {
                setSelfValue(next);
            }

            latestOnValueChange.current?.(next);
        },
        [clearTimers, isControlled],
    );

    const openAfterDelay = React.useCallback(
        (next: string) => {
            clearTimers();

            // Once one panel stands open the menu is already showing, so moving along the row
            // switches to the next one at once rather than making the reader wait again
            if (openValue !== null) {
                setOpenValue(next);
                return;
            }

            openTimeout.current = window.setTimeout(() => {
                openTimeout.current = null;
                setOpenValue(next);
            }, openDelay);
        },
        [clearTimers, openDelay, openValue, setOpenValue],
    );

    const closeAfterDelay = React.useCallback(() => {
        clearTimers();

        closeTimeout.current = window.setTimeout(() => {
            closeTimeout.current = null;
            setOpenValue(null);
        }, closeDelay);
    }, [clearTimers, closeDelay, setOpenValue]);

    useOnEscapePress((event) => {
        if (openValue === null) {
            return;
        }

        // Focus goes back to the trigger the panel was opened from, which is where it was
        // before, and is read before the panel is taken away from under it
        const trigger = navRef.current?.querySelector<HTMLElement>("[aria-expanded='true']");

        setOpenValue(null);
        trigger?.focus();

        // Taking the event keeps a layer this menu was opened over from answering as well
        event.preventDefault();
    });

    // A press anywhere else puts the menu away, which is what a panel standing over the page
    // rather than in it needs. A press inside is left alone: the trigger closes its own panel,
    // and a link closes the menu by being followed
    React.useEffect(() => {
        if (openValue === null) {
            return;
        }

        const handlePress = (event: MouseEvent | TouchEvent) => {
            const { target } = event;

            if (!(target instanceof Node) || navRef.current?.contains(target)) {
                return;
            }

            setOpenValue(null);
        };

        document.addEventListener("mousedown", handlePress);
        document.addEventListener("touchstart", handlePress);

        return () => {
            document.removeEventListener("mousedown", handlePress);
            document.removeEventListener("touchstart", handlePress);
        };
    }, [openValue, setOpenValue]);

    const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
        onBlur?.(event);

        if (openValue === null) {
            return;
        }

        // Focus landing on something else inside the menu is not focus leaving it. Without
        // this, moving from a trigger into the panel it opened would close the panel out from
        // under the reader
        if (event.relatedTarget instanceof Node && navRef.current?.contains(event.relatedTarget)) {
            return;
        }

        setOpenValue(null);
    };

    const context = React.useMemo<NavigationMenuContextValue>(
        () => ({
            openValue,
            setOpenValue,
            orientation,
            openOn,
            openAfterDelay,
            closeAfterDelay,
        }),
        [openValue, setOpenValue, orientation, openOn, openAfterDelay, closeAfterDelay],
    );

    return (
        <NavigationMenuContext.Provider value={context}>
            <nav
                ref={mergedRef}
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                className={classNames(classes.root, className)}
                data-component="NavigationMenu"
                data-orientation={orientation}
                {...rest}
                onBlur={handleBlur}
            >
                <NavigationMenuHeadingLevelContext.Provider value={headingLevel}>
                    {heading ? React.cloneElement(heading, { id: headingId }) : null}
                    {childrenWithoutSlots}
                </NavigationMenuHeadingLevelContext.Provider>
            </nav>
        </NavigationMenuContext.Provider>
    );
}

NavigationMenu.displayName = "NavigationMenu";

export default React.forwardRef(NavigationMenu);
