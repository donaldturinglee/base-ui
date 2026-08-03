import * as React from "react";
import { MoreHorizontalRegular } from "@gamecrafters/base-ui-icons";
import { useFocusZone } from "../../hooks/useFocusZone";
import { classNames, cva } from "../../utilities/classnames";
import { ActionList } from "../action-list";
import { ActionMenu } from "../action-menu";
import { IconButton } from "../icon-button";
import ActionBarDivider from "./ActionBarDivider";
import ActionBarGroup from "./ActionBarGroup";
import ActionBarIconButton from "./ActionBarIconButton";
import ActionBarMenu from "./ActionBarMenu";
import { ActionBarContext } from "./ActionBarContext";
import { ActionBarItemContext } from "./ActionBarItemContext";
import { ActionBarMenuItems } from "./ActionBarMenuItems";
import type { ActionBarGap, ActionBarProps, ActionBarSize } from "./ActionBar.types";

const classes = {
    size: {
        small: "action-bar-size-small",
        medium: "action-bar-size-medium",
        large: "action-bar-size-large",
    } satisfies Record<ActionBarSize, string>,
    // Nothing at all, standing before the first item so that it too has somewhere to wrap to
    // once there is no longer room for it
    spacer: "shrink-0",
    // The button keeps its place whether or not there is anything behind it, so the room the
    // items are measured against never changes as they come and go
    moreButtonEmpty: "invisible",
};

const actionBarVariants = cva("action-bar", {
    variants: {
        flush: {
            true: "",
            false: "action-bar-inset",
        },
    },
});

const actionBarToolbarVariants = cva("action-bar-toolbar", {
    variants: {
        size: classes.size,
    },
});

const actionBarItemsVariants = cva("action-bar-items", {
    variants: {
        size: classes.size,
        gap: {
            none: "action-bar-gap-none",
            condensed: "action-bar-gap-condensed",
        } satisfies Record<ActionBarGap, string>,
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionBarChild = React.ReactElement<any>;

const emptyOverflow: ReadonlySet<number> = new Set<number>();

const renderVisual = (visual: unknown) => {
    if (React.isValidElement(visual)) {
        return visual;
    }

    const Visual = visual as React.ElementType;
    return <Visual />;
};

// Draws one item of the bar as something the overflow menu can show instead
const renderOverflowItem = (child: ActionBarChild, key: React.Key): React.ReactNode => {
    const props = child.props;

    if (child.type === ActionBarDivider) {
        return <ActionList.Divider key={key} />;
    }

    // A group is carried into the menu whole, so what it holds is drawn one item at a time
    if (child.type === ActionBarGroup) {
        return React.Children.toArray(props.children)
            .filter((groupChild): groupChild is ActionBarChild => React.isValidElement(groupChild))
            .map((groupChild, index) => renderOverflowItem(groupChild, `${key}-${index}`));
    }

    if (child.type === ActionBarMenu) {
        const icon = props.overflowIcon ?? props.icon;

        return (
            <ActionMenu key={key}>
                <ActionMenu.Anchor>
                    <ActionList.Item>
                        {icon ? (
                            <ActionList.LeadingVisual>
                                {renderVisual(icon)}
                            </ActionList.LeadingVisual>
                        ) : null}
                        {props["aria-label"]}
                    </ActionList.Item>
                </ActionMenu.Anchor>
                <ActionMenu.Overlay returnFocusRef={props.returnFocusRef}>
                    <ActionList>
                        <ActionBarMenuItems items={props.items} />
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>
        );
    }

    // An icon button says nothing on its own, so the name it carries is what the menu shows
    const icon = child.type === ActionBarIconButton ? props.icon : props.leadingVisual;
    const label = child.type === ActionBarIconButton ? props["aria-label"] : props.children;

    return (
        <ActionList.Item key={key} onSelect={props.onClick} disabled={props.disabled}>
            {icon ? (
                <ActionList.LeadingVisual>{renderVisual(icon)}</ActionList.LeadingVisual>
            ) : null}
            {label}
        </ActionList.Item>
    );
};

// A row of actions on one thing. Where the row runs out of room, whatever no longer fits is
// offered from a menu at the end of it instead of being lost
function ActionBar(props: ActionBarProps) {
    const {
        className,
        children,
        size = "medium",
        flush = false,
        gap = "condensed",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
    } = props;

    const toolbarRef = React.useRef<HTMLDivElement>(null);
    const itemsRef = React.useRef<HTMLDivElement>(null);
    const [overflowing, setOverflowingState] = React.useState<ReadonlySet<number>>(emptyOverflow);

    const setOverflowing = React.useCallback((index: number, isOverflowing: boolean) => {
        setOverflowingState((current) => {
            if (current.has(index) === isOverflowing) {
                return current;
            }

            const next = new Set(current);

            if (isOverflowing) {
                next.add(index);
            } else {
                next.delete(index);
            }

            return next;
        });
    }, []);

    // A toolbar is one stop on the way round the page, so the arrow keys move between the
    // items standing within it
    useFocusZone({ containerRef: toolbarRef, direction: "horizontal", wrap: true });

    const barContextValue = React.useMemo(
        () => ({ size, rootRef: itemsRef, setOverflowing }),
        [size, setOverflowing],
    );

    const childArray = React.Children.toArray(children);
    // Only the number of items decides how many of these there are, and holding them still
    // keeps the items from being told they have moved on every render
    const itemCount = childArray.length;
    const itemContextValues = React.useMemo(
        () => Array.from({ length: itemCount }, (_, index) => ({ index })),
        [itemCount],
    );

    const overflowItems = childArray
        .map((child, index) =>
            overflowing.has(index) && React.isValidElement(child)
                ? renderOverflowItem(child as ActionBarChild, index)
                : null,
        )
        .filter(Boolean);

    return (
        <ActionBarContext.Provider value={barContextValue}>
            <div
                className={classNames(actionBarVariants({ flush }), className)}
                data-component="ActionBar"
                data-flush={flush ? "" : undefined}
            >
                <div
                    ref={toolbarRef}
                    role="toolbar"
                    aria-label={ariaLabel}
                    aria-labelledby={ariaLabelledBy}
                    className={classNames(actionBarToolbarVariants({ size }))}
                    data-size={size}
                    data-gap={gap}
                    data-has-overflow={overflowItems.length > 0 ? "" : undefined}
                >
                    <div
                        ref={itemsRef}
                        className={classNames(actionBarItemsVariants({ size, gap }))}
                    >
                        <div className={classes.spacer} />
                        {childArray.map((child, index) => (
                            <ActionBarItemContext.Provider
                                key={index}
                                value={itemContextValues[index]}
                            >
                                {child}
                            </ActionBarItemContext.Provider>
                        ))}
                    </div>
                    <ActionMenu>
                        <ActionMenu.Anchor>
                            <IconButton
                                icon={MoreHorizontalRegular}
                                aria-label="More items"
                                size={size}
                                variant="invisible"
                                className={
                                    overflowItems.length > 0 ? undefined : classes.moreButtonEmpty
                                }
                                data-component="ActionBar.MoreButton"
                            />
                        </ActionMenu.Anchor>
                        <ActionMenu.Overlay>
                            <ActionList>{overflowItems}</ActionList>
                        </ActionMenu.Overlay>
                    </ActionMenu>
                </div>
            </div>
        </ActionBarContext.Provider>
    );
}

ActionBar.displayName = "ActionBar";

export default ActionBar;
