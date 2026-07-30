import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Spinner } from "../spinner";
import ActionListDescription from "./ActionListDescription";
import ActionListLeadingVisual from "./ActionListLeadingVisual";
import ActionListSubItem from "./ActionListSubItem";
import ActionListTrailingAction from "./ActionListTrailingAction";
import ActionListTrailingVisual from "./ActionListTrailingVisual";
import { ActionListContainerContext } from "./ActionListContainerContext";
import { ActionListContext } from "./ActionListContext";
import { ActionListGroupContext } from "./ActionListGroupContext";
import { ActionListItemContext } from "./ActionListItemContext";
import { ActionListSelection } from "./ActionListSelection";
import type {
    ActionListItemProps,
    ActionListItemSize,
    ActionListSelectEvent,
} from "./ActionList.types";

const classes = {
    // The item is the box that is drawn; the content inside it is what is pressed. They are
    // told apart so that a trailing action can stand beside the part that is pressed rather
    // than inside it
    root: "relative list-none rounded-[var(--border-radius-medium)] data-[has-trailing-action]:flex data-[has-trailing-action]:flex-nowrap data-[has-trailing-action]:items-center data-[has-trailing-action]:pr-[var(--base-size-4)]",
    content:
        "flex grow items-start w-full gap-[var(--base-size-8)] min-w-0 px-[var(--control-medium-padding-inline-condensed)] py-[var(--control-medium-padding-block)] m-0 text-left no-underline appearance-none bg-transparent border-0 rounded-[var(--border-radius-medium)] cursor-pointer [font-family:inherit] [font-size:var(--text-body-size-medium)] leading-[var(--text-body-line-height-medium)] [color:var(--foreground-color-default)] transition-[background-color] duration-[var(--motion-duration-micro)] ease-[var(--motion-easing-hover)] hover:bg-[var(--control-transparent-background-color-hover)]",
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[calc(-1_*_var(--focus-outline-width))]",
    size: {
        medium: "",
        large: "py-[var(--control-large-padding-block)]",
    } satisfies Record<ActionListItemSize, string>,
    danger: "[color:var(--control-danger-foreground-color-rest)] hover:[color:var(--control-danger-foreground-color-hover)] hover:bg-[var(--control-danger-background-color-hover)]",
    // An item that cannot be used says so by its colour, and stops answering the pointer
    disabled:
        "cursor-not-allowed [color:var(--control-foreground-color-disabled)] hover:bg-transparent",
    inactive: "cursor-not-allowed [color:var(--foreground-color-muted)] hover:bg-transparent",
    loading: "cursor-default",
    // The one item the list is currently showing carries more weight than the rest
    active: "bg-[var(--control-transparent-background-color-active)] [font-weight:var(--base-text-weight-semibold)]",
    // The label and everything read with it, which is the part that gives way when there is
    // not enough room
    main: "flex grow items-start min-w-0 gap-[var(--base-size-8)]",
    labelWrap: "flex grow min-w-0 gap-[var(--base-size-8)]",
    labelWrapBlock: "flex-col gap-0",
    label: "min-w-0",
    inactiveWarning:
        "[color:var(--foreground-color-muted)] [font-size:var(--text-body-size-small)] leading-[var(--text-body-line-height-small)]",
    srOnly: "sr-only",
};

const slotsConfig = {
    leadingVisual: ActionListLeadingVisual,
    trailingVisual: ActionListTrailingVisual,
    trailingAction: ActionListTrailingAction,
    description: ActionListDescription,
    subItem: ActionListSubItem,
};

// The roles that stand for a single thing inside a list of them, which is what lets the
// item keep its list semantics on the `li` rather than take them onto a button
const listItemRoles = ["option", "menuitem", "menuitemradio", "menuitemcheckbox"];

const listRoles = ["listbox", "menu", "list"];

// An item in a list: something to pick, or somewhere to go. What it is read as follows from
// the list it stands in, so the same item reads as a menu item inside a menu and as a
// button inside a plain list
function ActionListItem<As extends React.ElementType = never>(
    props: ActionListItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as,
        className,
        children,
        id,
        role,
        variant = "default",
        size = "medium",
        selected,
        active = false,
        disabled = false,
        loading = false,
        inactiveText,
        onSelect,
        ...rest
    } = props as ActionListItemProps<React.ElementType>;

    const [slots, childrenWithoutSlots] = useSlots(children, slotsConfig);

    const { container, afterSelect, selectionAttribute, defaultTrailingVisual } = React.useContext(
        ActionListContainerContext,
    );
    const { role: listRole, selectionVariant: listSelectionVariant } =
        React.useContext(ActionListContext);
    const { selectionVariant: groupSelectionVariant } = React.useContext(ActionListGroupContext);

    const inactive = Boolean(inactiveText);

    // A group says how its own items are picked, in place of what the list says
    const selectionVariant =
        groupSelectionVariant === undefined
            ? listSelectionVariant
            : groupSelectionVariant || undefined;

    // What the item is read as follows from what is holding it
    let inferredRole: React.AriaRole | undefined;

    if (container === "ActionMenu" || listRole === "menu") {
        if (selectionVariant === "single") inferredRole = "menuitemradio";
        else if (selectionVariant === "multiple") inferredRole = "menuitemcheckbox";
        else inferredRole = "menuitem";
    } else if (listRole === "listbox" && selectionVariant) {
        inferredRole = "option";
    }

    const itemRole = role ?? inferredRole;

    // How being picked is said, which follows from what the item is read as
    const inferredSelectionAttribute =
        itemRole === "menuitemradio" || itemRole === "menuitemcheckbox"
            ? "aria-checked"
            : itemRole === "option"
              ? "aria-selected"
              : undefined;
    const itemSelectionAttribute = selectionAttribute ?? inferredSelectionAttribute;

    // Where the list carries list semantics, the `li` is the item and the content inside it
    // is only there to be laid out. Everywhere else the content is a button standing on its
    // own, which is what a list of actions with no list role is
    const listSemantics =
        (listRole !== undefined && listRoles.includes(listRole)) ||
        inactive ||
        (itemRole !== undefined && listItemRoles.includes(itemRole));
    const Content = (as ?? (listSemantics ? "div" : "button")) as React.ElementType;
    // A content element the caller asked for is the thing that is pressed, whatever the list
    // around it is read as
    const contentTakesProps = as !== undefined || !listSemantics;
    // A button or an anchor is already activated by the keyboard; anything else has to be
    const needsKeyHandler = contentTakesProps ? Content !== "button" && Content !== "a" : true;

    // A menu has nowhere to put a second action, and no way to read one
    const inMenu = container === "ActionMenu" || listRole === "menu" || listRole === "listbox";
    const usable = !disabled && !inactive && !loading;

    const handleSelect = (event: ActionListSelectEvent) => {
        if (!usable) {
            return;
        }

        onSelect?.(event);

        // A caller that has answered the event itself is left to it, and whatever is holding
        // the list is not told
        if (event.defaultPrevented) {
            return;
        }

        afterSelect?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== " " && event.key !== "Enter") {
            return;
        }

        // Taking the space key keeps the page from scrolling away underneath the list
        if (event.key === " ") {
            event.preventDefault();
        }

        handleSelect(event);
    };

    const itemId = useId(id);
    const labelId = `${itemId}--label`;
    const inlineDescriptionId = `${itemId}--inline-description`;
    const blockDescriptionId = `${itemId}--block-description`;
    const trailingVisualId = `${itemId}--trailing-visual`;
    const inactiveWarningId = inactive ? `${itemId}--inactive-warning` : undefined;

    const descriptionVariant = slots.description?.props.variant ?? "inline";
    const trailingVisual =
        slots.trailingVisual ??
        (defaultTrailingVisual ? (
            <ActionListTrailingVisual>{defaultTrailingVisual}</ActionListTrailingVisual>
        ) : null);

    // The spinner stands in for a visual the item already has, so the label does not move
    // sideways while the item waits
    const showSpinner = loading && !inactive;
    const spinner = <Spinner size="small" srText={null} />;
    const leadingVisual =
        showSpinner && slots.leadingVisual ? (
            <ActionListLeadingVisual>{spinner}</ActionListLeadingVisual>
        ) : (
            slots.leadingVisual
        );
    const trailingContent =
        showSpinner && !slots.leadingVisual ? (
            <ActionListTrailingVisual>{spinner}</ActionListTrailingVisual>
        ) : (
            trailingVisual
        );

    const describedBy = [
        slots.description
            ? descriptionVariant === "block"
                ? blockDescriptionId
                : inlineDescriptionId
            : undefined,
        inactiveWarningId,
    ].filter(Boolean);

    const interactiveProps = {
        id: itemId,
        role: itemRole,
        tabIndex: 0,
        onClick: handleSelect,
        onKeyDown: needsKeyHandler ? handleKeyDown : undefined,
        "aria-disabled": disabled || inactive || loading ? true : undefined,
        "aria-labelledby": [labelId, slots.trailingVisual ? trailingVisualId : undefined]
            .filter(Boolean)
            .join(" "),
        "aria-describedby": describedBy.length > 0 ? describedBy.join(" ") : undefined,
        ...(itemSelectionAttribute && selectionVariant
            ? { [itemSelectionAttribute]: Boolean(selected) }
            : {}),
    };

    const trailingAction = !inMenu && !inactive && !loading ? slots.trailingAction : null;

    const itemContextValue = React.useMemo(
        () => ({
            variant,
            size,
            disabled,
            inactive,
            inlineDescriptionId,
            blockDescriptionId,
            trailingVisualId,
        }),
        [
            variant,
            size,
            disabled,
            inactive,
            inlineDescriptionId,
            blockDescriptionId,
            trailingVisualId,
        ],
    );

    const contentClassName = classNames(
        classes.content,
        classes.focus,
        classes.size[size],
        variant === "danger" && !disabled && !inactive && classes.danger,
        active && classes.active,
        loading && classes.loading,
        inactive && classes.inactive,
        disabled && classes.disabled,
    );

    return (
        <ActionListItemContext.Provider value={itemContextValue}>
            <li
                ref={contentTakesProps ? null : ref}
                className={classNames(classes.root, className)}
                data-component="ActionList.Item"
                data-variant={variant === "danger" ? variant : undefined}
                data-active={active ? "" : undefined}
                data-inactive={inactive ? "" : undefined}
                data-disabled={disabled ? "" : undefined}
                data-loading={loading ? "" : undefined}
                data-has-description={slots.description ? "" : undefined}
                data-has-trailing-action={trailingAction ? "" : undefined}
                data-has-sub-item={slots.subItem ? "" : undefined}
                {...(contentTakesProps
                    ? { role: itemRole ? "none" : undefined }
                    : { ...interactiveProps, ...rest })}
            >
                <Content
                    ref={contentTakesProps ? ref : undefined}
                    className={contentClassName}
                    data-component="ActionList.Item.Content"
                    data-size={size}
                    {...(contentTakesProps
                        ? {
                              ...interactiveProps,
                              ...rest,
                              ...(Content === "button" ? { type: "button" } : {}),
                          }
                        : {})}
                >
                    <ActionListSelection selected={selected} />
                    {leadingVisual}
                    <span className={classes.main}>
                        <span
                            className={classNames(
                                classes.labelWrap,
                                descriptionVariant === "block" && classes.labelWrapBlock,
                            )}
                        >
                            <span
                                id={labelId}
                                className={classes.label}
                                data-component="ActionList.Item.Label"
                            >
                                {childrenWithoutSlots}
                                {/* Read as part of the label, so the wait is announced with
                                    the thing that is waiting */}
                                {showSpinner ? (
                                    <span className={classes.srOnly}>Loading</span>
                                ) : null}
                            </span>
                            {slots.description}
                        </span>
                        {trailingContent}
                    </span>
                </Content>
                {inactive ? (
                    <span id={inactiveWarningId} className={classes.inactiveWarning}>
                        {inactiveText}
                    </span>
                ) : null}
                {trailingAction}
                {/* Stands after the row rather than within it, so that a list nested in
                    the item is not put inside the button the row is drawn as */}
                {slots.subItem}
            </li>
        </ActionListItemContext.Provider>
    );
}

ActionListItem.displayName = "ActionList.Item";

export default fixedForwardRef(ActionListItem);
