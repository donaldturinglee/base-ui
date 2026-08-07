import * as React from "react";
import { ChevronDownRegular, ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getAccessibleKeybindingHintString, usePlatform } from "../keybinding-hint";
import TreeViewActionDialog from "./TreeViewActionDialog";
import TreeViewLeadingAction from "./TreeViewLeadingAction";
import TreeViewLeadingVisual from "./TreeViewLeadingVisual";
import TreeViewSubTree from "./TreeViewSubTree";
import TreeViewTrailingAction from "./TreeViewTrailingAction";
import TreeViewTrailingVisual from "./TreeViewTrailingVisual";
import {
    TreeViewItemContext,
    TreeViewLoadingPlaceholderContext,
    TreeViewRootContext,
} from "./TreeViewContext";
import type { TreeViewItemContextValue } from "./TreeViewContext";
import type { TreeViewItemProps } from "./TreeView.types";

const classes = {
    root: "tree-view-item",
    container: "tree-view-item-container",
    flat: "tree-view-item-container-flat",
    hasLeadingAction: "tree-view-item-container-has-leading-action",
    current: "tree-view-item-container-current",
    loading: "tree-view-item-container-loading",
    spacer: "tree-view-item-spacer",
    levelLines: "tree-view-item-level-lines",
    levelLine: "tree-view-item-level-line",
    toggle: "tree-view-item-toggle",
    toggleHover: "tree-view-item-toggle-hover",
    toggleEnd: "tree-view-item-toggle-end",
    content: "tree-view-item-content",
    label: "tree-view-item-label",
};

// The chevron is drawn smaller than a leading visual, since it says something about the row
// rather than about what the row stands for
const TOGGLE_ICON_SIZE = 12;

// The sub-tree holds items of its own, for the rows it stands in place of what is still
// being fetched, so the two modules reach for one another. Naming the slots from inside the
// component rather than beside it keeps that from depending on which of the two is read
// first
const useItemSlots = (children: React.ReactNode) =>
    useSlots(children, {
        leadingAction: TreeViewLeadingAction,
        leadingVisual: TreeViewLeadingVisual,
        trailingVisual: TreeViewTrailingVisual,
        subTree: TreeViewSubTree,
    });

// The lines running down the page that say how deep the row stands
const LevelIndicatorLines = ({ level }: { level: number }) => (
    <span className={classes.levelLines}>
        {Array.from({ length: level - 1 }, (_, index) => (
            <span key={index} className={classes.levelLine} />
        ))}
    </span>
);

// A row of the tree: something to pick, or something holding more of the tree underneath it
function TreeViewItem<As extends React.ElementType = "li">(
    props: TreeViewItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as,
        id: itemId,
        children,
        className,
        current: isCurrentItem = false,
        defaultExpanded,
        expanded,
        onExpandedChange,
        onSelect,
        containIntrinsicSize,
        secondaryActions,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props as TreeViewItemProps<React.ElementType>;

    const { expandedStateCache, scrollElementIntoView } = React.useContext(TreeViewRootContext);
    const { level } = React.useContext(TreeViewItemContext);
    const isLoadingPlaceholder = React.useContext(TreeViewLoadingPlaceholderContext);
    const platform = usePlatform();

    const [slots, childrenWithoutSlots] = useItemSlots(children);
    const hasSubTree = Boolean(slots.subTree);

    const labelId = useId();
    const leadingVisualId = useId();
    const trailingVisualId = useId();
    const trailingActionId = useId();

    // An item the caller is holding the open state of takes it from the prop; one that is
    // not keeps its own, picking up where it left off the last time it was drawn
    const isControlled = expanded !== undefined;
    const [selfExpanded, setSelfExpanded] = React.useState(
        () => expandedStateCache.current?.get(itemId) ?? defaultExpanded ?? isCurrentItem,
    );
    const isExpanded = isControlled ? expanded === true : selfExpanded;

    const [isSubTreeEmpty, setIsSubTreeEmpty] = React.useState(!hasSubTree);
    const [isFocused, setIsFocused] = React.useState(false);
    const [showActionDialog, setShowActionDialog] = React.useState(false);

    const setIsExpanded = React.useCallback(
        (next: boolean) => {
            setSelfExpanded(next);
            expandedStateCache.current?.set(itemId, next);
            onExpandedChange?.(next);
        },
        [itemId, expandedStateCache, onExpandedChange],
    );

    const toggle = React.useCallback(
        (event?: React.MouseEvent | React.KeyboardEvent) => {
            setIsExpanded(!isExpanded);
            event?.stopPropagation();
        },
        [isExpanded, setIsExpanded],
    );

    const openActions = React.useCallback(() => {
        if (!secondaryActions?.length) {
            return;
        }

        // With only one action there is nothing to choose between, so it is simply done
        if (secondaryActions.length === 1) {
            secondaryActions[0].onClick();
            return;
        }

        setShowActionDialog(true);
    }, [secondaryActions]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        switch (event.key) {
            case "Enter":
            case " ":
                if (onSelect) {
                    onSelect(event);
                } else {
                    toggle(event);
                }
                event.stopPropagation();
                break;
            case "ArrowRight":
                if (event.altKey || event.metaKey) return;
                event.preventDefault();
                event.stopPropagation();
                setIsExpanded(true);
                break;
            case "ArrowLeft":
                if (event.altKey || event.metaKey) return;
                event.preventDefault();
                event.stopPropagation();
                setIsExpanded(false);
                break;
            case "U":
            case "u":
                if (!(event.shiftKey && (event.metaKey || event.ctrlKey))) return;
                openActions();
                break;
        }
    };

    const handleSelect = (event: React.MouseEvent<HTMLElement>) => {
        if (onSelect) {
            onSelect(event);
        } else {
            toggle(event);
        }

        event.stopPropagation();
    };

    const shortcut = `Shift+${platform === "apple" ? "Meta" : "Control"}+U`;
    const shortcutText = `Press (${getAccessibleKeybindingHintString(shortcut, platform)}) for more actions.`;

    const describedBy = [
        slots.leadingVisual ? leadingVisualId : undefined,
        slots.trailingVisual ? trailingVisualId : undefined,
    ].filter(Boolean);

    const itemContextValue = React.useMemo<TreeViewItemContextValue>(
        () => ({
            itemId,
            level: level + 1,
            isSubTreeEmpty,
            setIsSubTreeEmpty,
            isExpanded,
            setIsExpanded,
            leadingVisualId,
            trailingVisualId,
            trailingActionId,
        }),
        [
            itemId,
            level,
            isSubTreeEmpty,
            isExpanded,
            setIsExpanded,
            leadingVisualId,
            trailingVisualId,
            trailingActionId,
        ],
    );

    // An item standing for a sub-tree that turned out to hold nothing says nothing about
    // being open, since there is nothing there to open
    const ariaExpanded =
        (isSubTreeEmpty && (!isExpanded || !hasSubTree)) || expanded === null
            ? undefined
            : isExpanded;

    // Where the caller renders the row as something other than a list item, it is wrapped
    // in one, since a tree may only hold list items directly
    const Component = (as ?? "li") as React.ElementType;
    const isWrapped = as !== undefined && as !== "li";

    const item = (
        <Component
            ref={ref}
            id={itemId}
            role="treeitem"
            // The tree hands the one tab stop to whichever row the reader is on
            tabIndex={-1}
            aria-label={secondaryActions && ariaLabel ? `${ariaLabel}. ${shortcutText}` : ariaLabel}
            aria-labelledby={
                ariaLabel
                    ? undefined
                    : `${ariaLabelledBy || labelId} ${secondaryActions ? trailingActionId : ""}`.trim()
            }
            aria-describedby={describedBy.length > 0 ? describedBy.join(" ") : undefined}
            aria-level={level}
            aria-expanded={ariaExpanded}
            aria-current={isCurrentItem ? "true" : undefined}
            aria-selected={isFocused ? "true" : "false"}
            className={classNames(classes.root, className)}
            data-component="TreeView.Item"
            data-has-leading-action={slots.leadingAction ? "" : undefined}
            data-loading={isLoadingPlaceholder ? "" : undefined}
            onKeyDown={handleKeyDown}
            onClick={handleSelect}
            onAuxClick={(event: React.MouseEvent<HTMLElement>) => {
                // The middle button opens a link somewhere else, which is worth answering
                // for a tree standing in for a set of pages
                if (onSelect && event.button === 1) {
                    onSelect(event);
                }

                event.stopPropagation();
            }}
            onFocus={(event: React.FocusEvent<HTMLElement>) => {
                scrollElementIntoView(event.currentTarget.firstElementChild);
                setIsFocused(true);
                // Held here so that focusing a row is not read as focusing everything it
                // stands inside
                event.stopPropagation();
            }}
            onBlur={() => setIsFocused(false)}
            {...rest}
        >
            <span
                className={classNames(
                    classes.container,
                    classes.flat,
                    slots.leadingAction && classes.hasLeadingAction,
                    isCurrentItem && classes.current,
                    isLoadingPlaceholder && classes.loading,
                )}
                style={
                    {
                        "--tree-view-level": level,
                        contentVisibility: containIntrinsicSize ? "auto" : undefined,
                        containIntrinsicSize,
                    } as React.CSSProperties
                }
            >
                <span className={classes.spacer}>
                    <LevelIndicatorLines level={level} />
                </span>
                {slots.leadingAction}
                {hasSubTree ? (
                    // The chevron answers the pointer alone. The row already opens from the
                    // keyboard, and a stop an item would leave a long tree unusable
                    <span
                        className={classNames(
                            classes.toggle,
                            onSelect && classes.toggleHover,
                            level === 1 && classes.toggleEnd,
                        )}
                        onClick={(event) => {
                            // Only worth answering where the row itself does something
                            // else; otherwise the row has already opened it
                            if (onSelect) {
                                toggle(event);
                            }
                        }}
                        data-component="TreeView.Item.Toggle"
                    >
                        {isExpanded ? (
                            <ChevronDownRegular
                                width={TOGGLE_ICON_SIZE}
                                height={TOGGLE_ICON_SIZE}
                            />
                        ) : (
                            <ChevronRightRegular
                                width={TOGGLE_ICON_SIZE}
                                height={TOGGLE_ICON_SIZE}
                            />
                        )}
                    </span>
                ) : null}
                <span id={labelId} className={classes.content}>
                    {slots.leadingVisual}
                    <span className={classes.label} data-component="TreeView.Item.Label">
                        {childrenWithoutSlots}
                    </span>
                    {slots.trailingVisual}
                </span>
                {secondaryActions?.length ? (
                    <TreeViewTrailingAction items={secondaryActions} shortcutText={shortcutText} />
                ) : null}
            </span>
            {slots.subTree}
            {showActionDialog && secondaryActions ? (
                <TreeViewActionDialog
                    items={secondaryActions}
                    onClose={() => setShowActionDialog(false)}
                />
            ) : null}
        </Component>
    );

    return (
        <TreeViewItemContext.Provider value={itemContextValue}>
            {isWrapped ? <li role="none">{item}</li> : item}
        </TreeViewItemContext.Provider>
    );
}

TreeViewItem.displayName = "TreeView.Item";

export default fixedForwardRef(TreeViewItem);
