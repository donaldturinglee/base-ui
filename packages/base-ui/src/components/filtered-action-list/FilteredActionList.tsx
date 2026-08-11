import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { ActionList, ActionListContainerContext } from "../action-list";
import { Checkbox } from "../checkbox";
import FilteredActionListInput from "./FilteredActionListInput";
import FilteredActionListItem from "./FilteredActionListItem";
import { FilteredActionListBodyLoader } from "./FilteredActionListLoaders";
import { useAnnouncements } from "./useAnnouncements";
import type {
    FilteredActionListItemInput,
    FilteredActionListProps,
} from "./FilteredActionList.types";

const classes = {
    root: "filtered-action-list",
    container: "filtered-action-list-container",
    list: "filtered-action-list-list",
    // A message stands in place of the list, so it is given the room the list would have
    // had. Without a width of its own it would be laid out against its own text, and
    // anything measuring itself against the room it has been given — a container query, say
    // — would find there is none
    message: "filtered-action-list-message",
    virtualList: "filtered-action-list-virtual-list",
    virtualItem: "filtered-action-list-virtual-item",
    selectAll: "filtered-action-list-select-all",
    selectAllLabel: "filtered-action-list-select-all-label",
    hidden: "sr-only",
};

// Matches the most common item height, a single line of text. Items are measured as they
// are drawn, so this only stands until they have been
const ESTIMATED_ITEM_HEIGHT = 32;

// How many items either side of the ones in view are drawn, so that scrolling does not
// arrive at an empty list
const OVERSCAN = 10;

// What tells one item from another as the list is drawn again. An item that says nothing
// about itself falls back to where it stands
const itemKey = (item: FilteredActionListItemInput, index: number) =>
    item.key ?? item.id?.toString() ?? index.toString();

// A list of things to pick, with a field above it that narrows them down. The filtering
// itself is the caller's: the list is handed the items that are left, so that it can be
// filtered against anything from an array to a server
function FilteredActionList(props: FilteredActionListProps) {
    const {
        items,
        groupMetadata,
        filterValue: externalFilterValue,
        onFilterChange,
        placeholderText,
        loading = false,
        loadingType = "body-spinner",
        message,
        messageText,
        selectionVariant,
        showItemDividers,
        onSelectAllChange,
        renderItem,
        announcementsEnabled = true,
        virtualized = false,
        textInputProps,
        actionListProps,
        inputRef: externalInputRef,
        scrollContainerRef: externalScrollContainerRef,
        onListContainerRefChanged,
        onInputRefChanged,
        className,
    } = props;

    // A list the caller is holding the filter of takes the text from the prop; one that is
    // not keeps its own
    const isControlled = externalFilterValue !== undefined;
    const [selfFilterValue, setSelfFilterValue] = React.useState("");
    const filterValue = isControlled ? externalFilterValue : selfFilterValue;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedInputRef = useMergedRefs(externalInputRef, inputRef);

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const mergedScrollContainerRef = useMergedRefs(externalScrollContainerRef, scrollContainerRef);

    const listRef = React.useRef<HTMLUListElement | null>(null);
    const listRefCallback = React.useCallback(
        (node: HTMLUListElement | null) => {
            listRef.current = node;
            onListContainerRefChanged?.(node);
        },
        [onListContainerRefChanged],
    );

    React.useEffect(() => {
        onInputRefChanged?.(inputRef);
    }, [onInputRefChanged]);

    // A wait shown in the field leaves the list where it is; the other kinds stand in place
    // of it
    const showsBodyLoader = loading && loadingType !== "input";

    // The skeleton fills the room the list would have had, so how many rows it draws follows
    // from how tall the box it stands in is, which is only known once it has been laid out.
    // The box is watched rather than measured the once, so a panel that is given its size
    // after the wait has begun is filled as well
    const [bodyHeight, setBodyHeight] = React.useState(0);

    useIsomorphicLayoutEffect(() => {
        const container = scrollContainerRef.current;

        if (!container || !showsBodyLoader) {
            return;
        }

        const measure = () => setBodyHeight(container.clientHeight);

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, [showsBodyLoader]);

    const listId = useId(actionListProps?.id);
    const inputDescriptionId = useId();
    const selectAllId = useId();

    // A grouped list is drawn whole: the headings break the run of items a virtualiser
    // measures against, and a list small enough to be grouped is small enough to draw
    const isVirtualized = virtualized && !groupMetadata?.length;

    const virtualizer = useVirtualizer<HTMLDivElement, HTMLLIElement>({
        count: items.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => ESTIMATED_ITEM_HEIGHT,
        overscan: OVERSCAN,
        enabled: isVirtualized,
        getItemKey: (index) => {
            // Measuring can reach for an item that has just been filtered away, so the index
            // stands in wherever there is nothing left to take a key from
            const item = items[index] as FilteredActionListItemInput | undefined;
            return item ? itemKey(item, index) : index.toString();
        },
        measureElement: (element) => element.scrollHeight,
    });

    const virtualItems = isVirtualized ? virtualizer.getVirtualItems() : undefined;

    // The item focus is moving to may not have been drawn yet, so it is taken up once the
    // virtualiser has caught up rather than as the key is pressed
    const [pendingFocusIndex, setPendingFocusIndex] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (pendingFocusIndex === null) {
            return;
        }

        const item = listRef.current?.querySelector<HTMLElement>(
            `[data-index="${pendingFocusIndex}"]`,
        );

        if (item) {
            item.focus();
            setPendingFocusIndex(null);
        }
    }, [pendingFocusIndex, virtualItems]);

    const focusItemAtIndex = React.useCallback(
        (index: number) => {
            if (index < 0 || index >= items.length) {
                return;
            }

            if (isVirtualized) {
                virtualizer.scrollToIndex(index, { align: "auto" });
                setPendingFocusIndex(index);
                return;
            }

            const options = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
            options?.[index]?.focus();
        },
        [isVirtualized, items.length, virtualizer],
    );

    const itemsInGroup = React.useCallback(
        (groupId: string) => items.filter((item) => item.groupId === groupId),
        [items],
    );

    // The first item of a grouped list is the first item of the first group that has any,
    // since the groups are drawn in the order they were given rather than the items
    const firstItem = groupMetadata?.length
        ? groupMetadata.map((group) => itemsInGroup(group.groupId)[0]).find(Boolean)
        : items[0];

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        if (!isControlled) {
            setSelfFilterValue(value);
        }

        onFilterChange(value, event);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "ArrowDown") {
            // Taking the event keeps the box from scrolling away underneath the list
            event.preventDefault();
            focusItemAtIndex(0);
            return;
        }

        // Enter takes the first item, which is what a reader who has typed enough to narrow
        // the list down to it is reaching for
        if (event.key === "Enter" && firstItem?.onAction) {
            event.preventDefault();
            firstItem.onAction(firstItem, event);
        }
    };

    // With only part of the list drawn, the arrow keys move by index across the whole of it
    // rather than between the items that happen to be in the DOM
    const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isVirtualized || event.defaultPrevented) {
            return;
        }

        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        const focused = (event.target as HTMLElement).closest<HTMLElement>("[data-index]");
        const current = focused ? Number(focused.dataset.index) : -1;

        const next =
            event.key === "ArrowDown"
                ? current + 1
                : event.key === "ArrowUp"
                  ? current - 1
                  : event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? items.length - 1
                      : null;

        if (next === null) {
            return;
        }

        // Taking the event keeps the box from scrolling away underneath the list
        event.preventDefault();
        focusItemAtIndex(next);
    };

    const selectAllChecked = items.length > 0 && items.every((item) => item.selected);
    const selectAllIndeterminate = !selectAllChecked && items.some((item) => item.selected);

    const announcement = useAnnouncements({
        items,
        enabled: announcementsEnabled,
        loading,
        messageText,
    });

    // The list is read as a listbox standing inside the field that filters it, so its items
    // take their semantics from here rather than from what is around them on the page
    const containerContextValue = React.useMemo(
        () => ({
            container: "FilteredActionList",
            listRole: "listbox" as const,
            selectionAttribute: "aria-selected" as const,
            // A virtualised list moves focus by index across the whole of itself, so the
            // list's own focus zone, which only knows the items in the DOM, is left off
            enableFocusZone: !isVirtualized,
        }),
        [isVirtualized],
    );

    const renderItems = () => {
        if (groupMetadata?.length) {
            return groupMetadata.map((group) => (
                <ActionList.Group key={group.groupId}>
                    <ActionList.GroupHeading variant={group.header?.variant}>
                        {group.header?.title ?? `Group ${group.groupId}`}
                    </ActionList.GroupHeading>
                    {itemsInGroup(group.groupId).map((item, index) => (
                        <FilteredActionListItem
                            {...item}
                            key={itemKey(item, index)}
                            renderItem={item.renderItem ?? renderItem}
                        />
                    ))}
                </ActionList.Group>
            ));
        }

        if (virtualItems) {
            return virtualItems.map((virtualItem) => {
                const item = items[virtualItem.index];

                return (
                    <FilteredActionListItem
                        {...item}
                        key={virtualItem.key}
                        ref={virtualizer.measureElement}
                        renderItem={item.renderItem ?? renderItem}
                        data-index={virtualItem.index}
                        className={classNames(classes.virtualItem, item.className)}
                        style={{
                            ...item.style,
                            transform: `translateY(${virtualItem.start}px)`,
                        }}
                    />
                );
            });
        }

        return items.map((item, index) => (
            <FilteredActionListItem
                {...item}
                key={itemKey(item, index)}
                renderItem={item.renderItem ?? renderItem}
            />
        ));
    };

    const renderBody = () => {
        if (showsBodyLoader) {
            return <FilteredActionListBodyLoader loadingType={loadingType} height={bodyHeight} />;
        }

        if (message) {
            return (
                <div className={classes.message} data-component="FilteredActionList.Message">
                    {message}
                </div>
            );
        }

        return (
            <ActionListContainerContext.Provider value={containerContextValue}>
                <ActionList
                    ref={listRefCallback}
                    id={listId}
                    selectionVariant={selectionVariant}
                    showDividers={showItemDividers}
                    {...actionListProps}
                    className={classNames(
                        classes.list,
                        isVirtualized && classes.virtualList,
                        actionListProps?.className,
                    )}
                    // A virtualised list stands as tall as the whole of it would, so that
                    // the box it scrolls within has the right amount to scroll through
                    style={
                        isVirtualized
                            ? { ...actionListProps?.style, height: virtualizer.getTotalSize() }
                            : actionListProps?.style
                    }
                >
                    {renderItems()}
                </ActionList>
            </ActionListContainerContext.Provider>
        );
    };

    return (
        <div
            className={classNames(classes.root, className)}
            data-component="FilteredActionList"
            data-virtualized={isVirtualized ? "" : undefined}
        >
            <FilteredActionListInput
                inputRef={mergedInputRef}
                value={filterValue}
                onInputChange={handleInputChange}
                onInputKeyDown={handleInputKeyDown}
                placeholderText={placeholderText}
                listId={listId}
                inputDescriptionId={inputDescriptionId}
                loading={loading && loadingType === "input"}
                {...textInputProps}
            />
            <span id={inputDescriptionId} className={classes.hidden}>
                Items will be filtered as you type
            </span>
            {onSelectAllChange ? (
                <div className={classes.selectAll} data-component="FilteredActionList.SelectAll">
                    <Checkbox
                        id={selectAllId}
                        checked={selectAllChecked}
                        indeterminate={selectAllIndeterminate}
                        onChange={(event) => onSelectAllChange(event.target.checked)}
                        data-component="FilteredActionList.SelectAllCheckbox"
                    />
                    <label htmlFor={selectAllId} className={classes.selectAllLabel}>
                        {selectAllChecked ? "Deselect all" : "Select all"}
                    </label>
                </div>
            ) : null}
            <div
                ref={mergedScrollContainerRef}
                className={classes.container}
                onKeyDown={handleListKeyDown}
                data-component="FilteredActionList.Container"
            >
                {renderBody()}
            </div>
            {/* The items change under a reader whose focus never leaves the field, so what
                the list is left holding is announced from here */}
            <span
                role="status"
                aria-live="polite"
                className={classes.hidden}
                data-component="FilteredActionList.Announcement"
            >
                {announcement}
            </span>
        </div>
    );
}

FilteredActionList.displayName = "FilteredActionList";

export default FilteredActionList;
