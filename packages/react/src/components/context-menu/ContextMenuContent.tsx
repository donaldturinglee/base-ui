import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useContextMenu } from "./useContextMenu";
import type { ContextMenuContentProps } from "./ContextMenu.types";

const classes = {
    root: [
        "context-menu-content",
        // It grows out of the press that opened it, which says where it came from
        "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-short",
    ],
};

// How long the reader has between one key and the next for the two to be read as one word
const TYPEAHEAD_RESET_DELAY = 500;

type Typeahead = {
    keys: string;
    timeout: number;
};

// Everything in the menu that can be picked, in the order it is read. An item that is
// disabled is passed over by the keys, as it is by the pointer
const getItems = (content: HTMLElement) =>
    Array.from(content.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([data-disabled])'));

const getItemValue = (item: HTMLElement | undefined) => item?.dataset.value ?? null;

// The words an item is found by when the reader types: what it was told to answer to, or
// else what it says
const getItemText = (item: HTMLElement) =>
    (item.dataset.valuetext ?? item.textContent ?? "").trim().toLowerCase();

// A key that puts a character down, rather than one that does something on its own or with a
// modifier held
const isPrintableKey = (event: React.KeyboardEvent) =>
    event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey;

// The menu itself, which is where the items go. Focus lands on it as it opens and follows the
// reader from item to item after that, and it is dismissed by Escape, by tabbing away, or by
// a press that lands anywhere else. Nothing is highlighted to start with: the menu was asked
// for at a point rather than from a button, so there is no item it was opened towards
function ContextMenuContent(
    props: ContextMenuContentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        onKeyDown,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const {
        contentId,
        triggerId,
        triggerRef,
        open,
        loopFocus,
        typeahead,
        highlightedValue,
        setHighlightedValue,
        onClose,
    } = useContextMenu();

    const contentRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, contentRef);

    // What the reader has typed so far, and the wait after which it is forgotten
    const typeaheadRef = React.useRef<Typeahead | null>(null);

    // Whether focus goes back to the area the menu was opened from once it closes. A press
    // that landed on something else that takes focus is left with it
    const restoreFocusRef = React.useRef(true);

    // Focus follows the reader: onto the item they are on, and back onto the menu itself
    // while they are on none of them
    React.useEffect(() => {
        const content = contentRef.current;

        if (!content) {
            return;
        }

        const highlighted =
            highlightedValue === null
                ? undefined
                : getItems(content).find((item) => item.dataset.value === highlightedValue);
        const target = highlighted ?? content;

        if (document.activeElement !== target) {
            target.focus();
        }
    }, [highlightedValue]);

    // The press left nothing behind to hand focus back to, so it goes to the area the menu
    // was opened from. The reader is taken off whatever item they were on, so the menu opens
    // afresh next time
    React.useEffect(() => {
        return () => {
            setHighlightedValue(null);

            if (typeaheadRef.current) {
                window.clearTimeout(typeaheadRef.current.timeout);
            }

            if (restoreFocusRef.current) {
                triggerRef.current?.focus({ preventScroll: true });
            }
        };
    }, [setHighlightedValue, triggerRef]);

    useOnEscapePress((event) => {
        // Taking the event keeps a layer this menu was opened over standing
        event.preventDefault();
        onClose();
    });

    // A press anywhere else dismisses the menu, which is what a surface standing over the
    // page rather than in it needs
    React.useEffect(() => {
        const handlePress = (event: PointerEvent) => {
            const { target } = event;

            if (!(target instanceof Node) || contentRef.current?.contains(target)) {
                return;
            }

            // A right click on the area the menu was opened from moves the menu rather than
            // closing it, and is left to the area to answer
            if (event.button === 2 && triggerRef.current?.contains(target)) {
                return;
            }

            restoreFocusRef.current = !(target instanceof HTMLElement && target.tabIndex >= 0);
            onClose();
        };

        document.addEventListener("pointerdown", handlePress);

        return () => {
            document.removeEventListener("pointerdown", handlePress);
        };
    }, [onClose, triggerRef]);

    const moveHighlight = (items: HTMLElement[], step: 1 | -1) => {
        const current = items.findIndex((item) => item.dataset.value === highlightedValue);

        // Arriving from off the items, the first of them is where the reader lands going
        // down, and the last going up
        let next = current === -1 ? (step === 1 ? 0 : items.length - 1) : current + step;

        if (next < 0 || next >= items.length) {
            if (!loopFocus) {
                return;
            }

            next = (next + items.length) % items.length;
        }

        setHighlightedValue(getItemValue(items[next]));
    };

    const handleTypeahead = (items: HTMLElement[], key: string) => {
        const previous = typeaheadRef.current;

        if (previous) {
            window.clearTimeout(previous.timeout);
        }

        const keys = (previous?.keys ?? "") + key.toLowerCase();

        typeaheadRef.current = {
            keys,
            timeout: window.setTimeout(() => {
                typeaheadRef.current = null;
            }, TYPEAHEAD_RESET_DELAY),
        };

        // The same key pressed again and again walks from one item starting with it to the
        // next, rather than looking for an item that says it twice over
        const search = keys.split("").every((char) => char === keys[0]) ? keys[0] : keys;

        // The search starts after the item the reader is on and comes round to the ones
        // before it, ending on the item itself so a word it still matches leaves them there
        const current = items.findIndex((item) => item.dataset.value === highlightedValue);
        const ordered = [...items.slice(current + 1), ...items.slice(0, current + 1)];
        const match = ordered.find((item) => getItemText(item).startsWith(search));

        if (match) {
            setHighlightedValue(getItemValue(match));
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);

        const content = contentRef.current;

        if (event.defaultPrevented || !content) {
            return;
        }

        const items = getItems(content);

        switch (event.key) {
            case "ArrowDown":
                moveHighlight(items, 1);
                break;
            case "ArrowUp":
                moveHighlight(items, -1);
                break;
            case "Home":
                setHighlightedValue(getItemValue(items[0]));
                break;
            case "End":
                setHighlightedValue(getItemValue(items[items.length - 1]));
                break;
            case "Enter":
            case " ": {
                // The space bar carries on a word that is being typed, and picks the item the
                // reader is on otherwise. The item is pressed rather than told, so that it
                // answers the key the way it answers the pointer
                if (event.key === " " && typeaheadRef.current) {
                    handleTypeahead(items, event.key);
                    break;
                }

                items.find((item) => item.dataset.value === highlightedValue)?.click();
                break;
            }
            case "Tab":
                // Tabbing away from a menu closes it, and focus goes back to the area it was
                // opened from
                onClose();
                break;
            default:
                if (!typeahead || !isPrintableKey(event)) {
                    return;
                }

                handleTypeahead(items, event.key);
        }

        // Taking the event keeps the page from scrolling away underneath the menu
        event.preventDefault();
    };

    return (
        <div
            ref={mergedRef}
            id={contentId}
            role="menu"
            // Focus has somewhere to land while the reader is on none of the items, without
            // the menu adding a stop of its own to the page
            tabIndex={-1}
            aria-label={ariaLabel}
            // There is no button standing on the page for the menu to be named by, so it is
            // named after the area it was opened from unless the caller names it themselves
            aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : triggerId)}
            className={classNames(classes.root, className)}
            onKeyDown={handleKeyDown}
            data-component="ContextMenu.Content"
            data-state={open ? "open" : "closed"}
            {...rest}
        >
            {children}
        </div>
    );
}

ContextMenuContent.displayName = "ContextMenu.Content";

export default fixedForwardRef(ContextMenuContent);
