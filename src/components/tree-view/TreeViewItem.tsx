import * as React from "react";
import { ChevronDownRegular, ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
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
    // The row itself carries no focus ring; the box drawn inside it does, so that the ring
    // follows what can be seen rather than the whole width of the tree
    root: "list-none outline-none [overflow-clip-margin:var(--base-size-8)]",
    focus: "focus-visible:[&>span]:[box-shadow:0_0_0_var(--border-width-thick)_var(--foreground-color-accent)]",
    // The columns are, in order: the step in from the edge, a leading action, the chevron,
    // the label, and anything standing at the end of the row
    container:
        "relative grid w-full cursor-pointer rounded-[var(--border-radius-medium)] [overflow-clip-margin:var(--base-size-8)] [font-size:var(--text-body-size-medium)] [color:var(--foreground-color-default)] [--tree-view-toggle-width:1rem] [--tree-view-item-height:2rem] [--tree-view-item-line-height:1.3rem] [--tree-view-spacer-width:calc((var(--tree-view-level)_-_1)_*_(var(--tree-view-toggle-width)_/_2))] [grid-template-columns:var(--tree-view-spacer-width)_var(--tree-view-leading-action-width,0px)_var(--tree-view-toggle-width)_1fr_auto] hover:bg-[var(--control-transparent-background-color-hover)] [@media(pointer:coarse)]:[--tree-view-toggle-width:1.5rem] [@media(pointer:coarse)]:[--tree-view-item-height:2.75rem]",
    // A flat tree draws every row against the same edge, since there is no depth to say
    flat: "[[data-omit-spacer='true']_&]:[grid-template-columns:0_var(--tree-view-leading-action-width,0px)_0_1fr_auto]",
    hasLeadingAction: "[--tree-view-leading-action-width:1.5rem]",
    // The row the reader is on is filled, and marked in the margin so it can be picked out
    // at a glance down a long tree
    current:
        "bg-[var(--control-transparent-background-color-selected)] after:content-[''] after:absolute after:top-[calc(50%_-_var(--base-size-12))] after:left-[calc(-1_*_var(--base-size-8))] after:w-[var(--base-size-4)] after:h-[var(--base-size-24)] after:rounded-[var(--border-radius-medium)] after:bg-[var(--foreground-color-accent)]",
    // A row standing in for what is being fetched is not something to reach for
    loading: "[&:hover]:bg-transparent [&:hover]:cursor-default",
    spacer: "flex [grid-column:1]",
    levelLines: "flex w-full",
    // Only ever drawn while the tree is being used, so that a tree at rest reads as a list
    // rather than as a diagram
    levelLine:
        "w-full h-full border-solid border-0 border-r-[length:var(--border-width-thin)] border-r-[color:var(--tree-view-line-color,transparent)]",
    // The chevron sits against the top of a row that runs to more than one line, so that it
    // stays beside the first line of the label
    toggle: "flex [grid-column:3] h-full justify-center items-start pt-[calc(var(--tree-view-item-height)/2_-_var(--base-size-12)/2)] [color:var(--foreground-color-muted)]",
    toggleHover: "hover:bg-[var(--control-transparent-background-color-hover)]",
    // A chevron at the first level is flush with the start of the row, so it takes the
    // row's own corners
    toggleEnd: "rounded-s-[var(--border-radius-medium)]",
    content:
        "flex [grid-column:4] h-full px-[var(--base-size-8)] gap-[var(--stack-gap-condensed)] py-[calc((var(--tree-view-item-height)_-_var(--tree-view-item-line-height))/2)] leading-[var(--tree-view-item-line-height)]",
    // A long label either runs off the end of the row or onto another line, which the tree
    // as a whole decides
    label: "grow basis-auto w-0 [[data-truncate-text='true']_&]:overflow-hidden [[data-truncate-text='true']_&]:text-ellipsis [[data-truncate-text='true']_&]:whitespace-nowrap [[data-truncate-text='false']_&]:[word-break:break-word]",
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
            className={classNames(classes.root, classes.focus, className)}
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
