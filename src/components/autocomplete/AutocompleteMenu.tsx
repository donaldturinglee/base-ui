import * as React from "react";
import { AddRegular } from "@gamecrafters/base-ui-icons";
import { isValidElementType } from "react-is";
import { classNames } from "../../utilities/classnames";
import { ActionList, ActionListContainerContext } from "../action-list";
import { Spinner } from "../spinner";
import { AutocompleteContext, AutocompleteDeferredInputContext } from "./AutocompleteContext";
import type {
    AutocompleteItem,
    AutocompleteMenuProps,
    AutocompleteVisual,
} from "./Autocomplete.types";

const classes = {
    loading: "flex justify-center p-[var(--base-size-16)]",
    emptyState:
        "p-[var(--base-size-16)] [font-size:var(--text-body-size-medium)] [color:var(--foreground-color-muted)]",
    hidden: "sr-only",
};

// The announcement is held back so that it queues behind whatever the reader is already
// being told about the field rather than cutting it off
const ANNOUNCEMENT_DELAY = 500;

// What the options are narrowed by where the caller has not said. An option is kept where its
// text begins with what has been typed, which is what the field completes with
const startsWith =
    (value: string) =>
    <T extends AutocompleteItem>(item: T) =>
        Boolean(item.text?.toLowerCase().startsWith(value.toLowerCase()));

// How the options are ordered once the menu closes where the caller has not said. The picked
// ones are brought to the top, so that they are where they were left next time it opens
const pickedFirst =
    (isPicked: (itemId: string) => boolean) => (itemIdA: string, itemIdB: string) =>
        isPicked(itemIdA) === isPicked(itemIdB) ? 0 : isPicked(itemIdA) ? -1 : 1;

const isSameOrder = (one: string[], other: string[]) =>
    one.length === other.length && one.every((itemId, index) => itemId === other[index]);

// A visual is given either as the component to draw, or as something already built: an
// element, or plain text such as a count
const renderVisual = (visual: AutocompleteVisual): React.ReactNode => {
    if (typeof visual === "string" || !isValidElementType(visual)) {
        return visual as React.ReactNode;
    }

    const Visual = visual;

    return <Visual />;
};

// The list of options a field is completed from. It is read as a listbox the field controls,
// so nothing in it ever takes focus: the arrow keys move a highlight the field points at, and
// the field is left holding the caret throughout
function AutocompleteMenu<T extends AutocompleteItem>(props: AutocompleteMenuProps<T>) {
    const {
        items,
        selectedItemIds = [],
        selectionVariant = "single",
        filter,
        sortOnClose,
        emptyStateText = "No selectable options",
        addNewItem,
        loading = false,
        onOpenChange,
        onSelectedChange,
        customScrollContainerRef,
        "aria-labelledby": ariaLabelledBy,
        className,
    } = props;

    const {
        id,
        inputRef,
        scrollContainerRef,
        activeDescendantId,
        setActiveDescendantId,
        showMenu,
        setShowMenu,
        setInputValue,
        setAutocompleteSuggestion,
    } = React.useContext(AutocompleteContext);
    const { deferredInputValue = "" } = React.useContext(AutocompleteDeferredInputContext);

    const listId = `${id}-listbox`;

    // An option is pointed at by an id of the list's own rather than by its own, so that two
    // fields offering the same options do not both lay claim to the same element
    const optionId = React.useCallback((itemId: string) => `${listId}-${itemId}`, [listId]);

    // Where each option stood when the menu last closed. Reordering while it is showing would
    // move an option out from under the reader, so it is only ever done once it has closed
    const [sortedItemIds, setSortedItemIds] = React.useState<string[]>(() =>
        items.map((item) => item.id),
    );

    React.useEffect(() => {
        if (showMenu) {
            return;
        }

        const sorted = items
            .map((item) => item.id)
            .sort(sortOnClose ?? pickedFirst((itemId) => selectedItemIds.includes(itemId)));

        setSortedItemIds((current) => (isSameOrder(sorted, current) ? current : sorted));
    }, [showMenu, items, selectedItemIds, sortOnClose]);

    const itemOrder = React.useMemo(
        () => new Map(sortedItemIds.map((itemId, index) => [itemId, index] as const)),
        [sortedItemIds],
    );

    const visibleItems = React.useMemo(
        () =>
            items
                .filter(filter ?? startsWith(deferredInputValue))
                // An option the list has only just been given has no place of its own yet,
                // and keeps the one it arrived in
                .sort(
                    (one, other) =>
                        (itemOrder.get(one.id) ?? Number.MAX_SAFE_INTEGER) -
                        (itemOrder.get(other.id) ?? Number.MAX_SAFE_INTEGER),
                ),
        [items, filter, deferredInputValue, itemOrder],
    );

    const allItems = React.useMemo(
        () => (addNewItem ? [...visibleItems, addNewItem.item] : visibleItems),
        [visibleItems, addNewItem],
    );

    // An option that cannot be picked is passed over rather than highlighted, since the
    // highlight says what pressing Enter will take
    const pickableItems = React.useMemo(
        () => allItems.filter((item) => !item.disabled),
        [allItems],
    );

    const activeIndex = pickableItems.findIndex((item) => optionId(item.id) === activeDescendantId);
    const activeItem = pickableItems[activeIndex];

    // Whether the highlight was last moved by a key rather than by the pointer. Only a key
    // writes the completion into the field and scrolls the list: a pointer swept down the
    // options would otherwise rewrite what the reader had typed, and drag the list out from
    // under them
    const [highlightedByKey, setHighlightedByKey] = React.useState(false);

    const pickItem = (item: T) => {
        if (addNewItem && item.id === addNewItem.item.id) {
            addNewItem.onAdd(item);
        } else {
            const nextItemIds =
                selectionVariant === "single"
                    ? [item.id]
                    : selectedItemIds.includes(item.id)
                      ? selectedItemIds.filter((selectedId) => selectedId !== item.id)
                      : [...selectedItemIds, item.id];

            if (onSelectedChange) {
                onSelectedChange(
                    nextItemIds
                        .map((nextItemId) => items.find((candidate) => candidate.id === nextItemId))
                        .filter((candidate): candidate is T => candidate !== undefined),
                );
            } else if (selectionVariant === "single") {
                // With nobody holding the selection, picking an option puts its text in the
                // field, which is what a field that completes what is typed is for
                setInputValue?.(item.text ?? "");
            }
        }

        if (selectionVariant === "multiple") {
            // The field is emptied so that the next option can be typed for, and the list
            // stays showing for it to be picked from
            setInputValue?.("");
            setAutocompleteSuggestion?.("");
            return;
        }

        setShowMenu?.(false);
    };

    const moveTo = (index: number) => {
        if (pickableItems.length === 0) {
            return;
        }

        // Moving off either end comes round to the other, which is the shortest way back to
        // an option just gone past
        const wrapped = (index + pickableItems.length) % pickableItems.length;

        setHighlightedByKey(true);
        setActiveDescendantId?.(optionId(pickableItems[wrapped].id));
    };

    // The pointer makes whatever it is over the highlighted option, so that the list draws a
    // single highlight and what is pointed at is what Enter takes. Left to itself, the hover
    // tint would stand as a second, weaker highlight beside the real one — and in the dark
    // theme it is drawn in the very same colour
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');

        if (!option || option.id === activeDescendantId) {
            return;
        }

        // An option that cannot be picked is left alone, since highlighting it would say that
        // it could be
        if (!pickableItems.some((item) => optionId(item.id) === option.id)) {
            return;
        }

        setHighlightedByKey(false);
        setActiveDescendantId?.(option.id);
    };

    const handleInputKeyDown = (event: KeyboardEvent) => {
        // A key pressed with a modifier belongs to the browser or the page. Home and End are
        // left alone throughout, since the field still holds the caret and moving it is what
        // they are for
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        if (event.key === "Enter") {
            if (!activeItem) {
                return;
            }

            // Taking the key keeps the form the field stands in from being submitted by the
            // same press that picked an option
            event.preventDefault();
            pickItem(activeItem);
            return;
        }

        const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;

        if (step === 0) {
            return;
        }

        // Taking the key keeps the caret from running to either end of what has been typed
        event.preventDefault();

        // Arriving from the field itself, the first option down and the last option up are
        // where the list is entered
        moveTo(activeIndex === -1 ? (step === 1 ? 0 : -1) : activeIndex + step);
    };

    // The handler is held behind a ref so that the listener is only put on the field and
    // taken off again as the menu opens and closes, rather than every time the options change
    // underneath it
    const handleInputKeyDownRef = React.useRef(handleInputKeyDown);

    React.useEffect(() => {
        handleInputKeyDownRef.current = handleInputKeyDown;
    });

    // The keys land on the field, since focus never leaves it for the list to catch them
    React.useEffect(() => {
        const input = inputRef?.current;

        if (!input || !showMenu) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => handleInputKeyDownRef.current(event);

        input.addEventListener("keydown", handleKeyDown);

        return () => {
            input.removeEventListener("keydown", handleKeyDown);
        };
    }, [inputRef, showMenu]);

    // What has been typed is completed with the highlighted option, where it does begin with
    // it. An option that is already picked is not offered again
    const activeText = activeItem?.text ?? "";
    const suggests =
        highlightedByKey &&
        Boolean(activeItem) &&
        activeText.toLowerCase().startsWith(deferredInputValue.toLowerCase()) &&
        !selectedItemIds.includes(activeItem.id);

    React.useEffect(() => {
        setAutocompleteSuggestion?.(suggests ? activeText : "");
    }, [suggests, activeText, setAutocompleteSuggestion]);

    // The highlighted option is brought into view, since focus is not on it to bring it
    // there. A pointer needs none of this: whatever it is over is already in view
    React.useEffect(() => {
        if (!activeDescendantId || !highlightedByKey) {
            return;
        }

        const container = customScrollContainerRef?.current ?? scrollContainerRef?.current;
        const option = document.getElementById(activeDescendantId);

        if (!container || !option || !container.contains(option)) {
            return;
        }

        const containerBox = container.getBoundingClientRect();
        const optionBox = option.getBoundingClientRect();

        if (optionBox.top < containerBox.top) {
            container.scrollTop -= containerBox.top - optionBox.top;
        } else if (optionBox.bottom > containerBox.bottom) {
            container.scrollTop += optionBox.bottom - containerBox.bottom;
        }
    }, [activeDescendantId, highlightedByKey, customScrollContainerRef, scrollContainerRef]);

    // Whether the menu is open is reported as it changes rather than as it renders, so that a
    // caller loading its options on open is not asked for them again and again
    const reportedOpen = React.useRef(false);

    React.useEffect(() => {
        const open = Boolean(showMenu);

        if (reportedOpen.current === open) {
            return;
        }

        reportedOpen.current = open;
        onOpenChange?.(open);
    }, [showMenu, onOpenChange]);

    const emptyAnnouncement =
        typeof emptyStateText === "string" ? emptyStateText : "No options available";
    const announcementText = loading
        ? ""
        : allItems.length === 0
          ? emptyAnnouncement
          : `${allItems.length} option${allItems.length === 1 ? "" : "s"} available.`;

    const [announcement, setAnnouncement] = React.useState("");
    const announced = React.useRef("");

    React.useEffect(() => {
        // A list that is not showing has nothing to say, and starts afresh so that opening it
        // again is announced
        if (!showMenu) {
            announced.current = "";
            setAnnouncement("");
            return;
        }

        if (announcementText === announced.current) {
            return;
        }

        announced.current = announcementText;

        const timeout = window.setTimeout(
            () => setAnnouncement(announcementText),
            ANNOUNCEMENT_DELAY,
        );

        return () => {
            window.clearTimeout(timeout);
        };
    }, [showMenu, announcementText]);

    // The list is read as a listbox named by the field's own label, so its options take their
    // semantics from here rather than from what is around them on the page
    const containerContext = React.useMemo(
        () => ({
            container: "Autocomplete",
            listRole: "listbox" as const,
            listLabelledBy: ariaLabelledBy,
            selectionAttribute: "aria-selected" as const,
            selectionVariant,
            // The arrow keys are the field's, since focus never leaves it for the list to
            // move around within
            enableFocusZone: false,
        }),
        [ariaLabelledBy, selectionVariant],
    );

    const renderItem = (item: T) => {
        const {
            id: itemId,
            text,
            description,
            descriptionVariant,
            leadingVisual,
            trailingVisual,
            children,
            ...rest
        } = item;

        // A new option is not one of the list's own, so it is marked as the one that adds
        // rather than picks
        const visual = addNewItem && itemId === addNewItem.item.id ? AddRegular : leadingVisual;

        return (
            <ActionList.Item
                key={itemId}
                id={optionId(itemId)}
                // Options are reached with the arrow keys rather than tabbed between, so they
                // are kept out of the page's own order
                tabIndex={-1}
                active={optionId(itemId) === activeDescendantId}
                selected={selectedItemIds.includes(itemId)}
                onSelect={() => pickItem(item)}
                data-id={itemId}
                {...rest}
            >
                {visual ? (
                    <ActionList.LeadingVisual>{renderVisual(visual)}</ActionList.LeadingVisual>
                ) : null}
                {children}
                {text}
                {description ? (
                    <ActionList.Description variant={descriptionVariant}>
                        {description}
                    </ActionList.Description>
                ) : null}
                {trailingVisual ? (
                    <ActionList.TrailingVisual>
                        {renderVisual(trailingVisual)}
                    </ActionList.TrailingVisual>
                ) : null}
            </ActionList.Item>
        );
    };

    const renderBody = () => {
        if (loading) {
            return (
                <div className={classes.loading} data-component="Autocomplete.Loading">
                    <Spinner />
                </div>
            );
        }

        if (allItems.length === 0) {
            return emptyStateText ? (
                <div className={classes.emptyState} data-component="Autocomplete.EmptyState">
                    {emptyStateText}
                </div>
            ) : null;
        }

        return (
            <ActionListContainerContext.Provider value={containerContext}>
                <ActionList id={listId}>{allItems.map(renderItem)}</ActionList>
            </ActionListContainerContext.Provider>
        );
    };

    return (
        <div
            className={classNames(className)}
            // Pressing an option must not take focus off the field, or the list would be
            // dismissed by the very press that was picking from it
            onMouseDown={(event) => event.preventDefault()}
            onMouseMove={handleMouseMove}
            data-component="Autocomplete.Menu"
            data-loading={loading ? "" : undefined}
        >
            {renderBody()}
            {/* The options change under a reader whose focus never leaves the field, so what
                the list is left holding is announced from here */}
            <span
                role="status"
                aria-live="polite"
                className={classes.hidden}
                data-component="Autocomplete.Announcement"
            >
                {announcement}
            </span>
        </div>
    );
}

AutocompleteMenu.displayName = "Autocomplete.Menu";

export default AutocompleteMenu;
