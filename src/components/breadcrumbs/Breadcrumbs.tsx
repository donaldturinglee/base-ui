import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../utilities/classnames";
import BreadcrumbsOverflowMenu from "./BreadcrumbsOverflowMenu";
import { BreadcrumbsContext } from "./BreadcrumbsContext";
import type { BreadcrumbsOverflow, BreadcrumbsProps } from "./Breadcrumbs.types";

const classes = {
    root: "breadcrumbs",
    list: "breadcrumbs-list",
    listWrap: "breadcrumbs-list-wrap",
    listMenu: "breadcrumbs-list-menu",
    item: "breadcrumbs-item",
    itemMenu: "breadcrumbs-item-menu",
    separator: "breadcrumbs-separator",
};

// The width a small icon button takes, used until the menu button has been measured
const MENU_BUTTON_FALLBACK_WIDTH = 28;

// Used before the trail has been measured, so the first paint collapses nothing
const CONTAINER_FALLBACK_WIDTH = 800;

// Below this there is no room to keep more than the page the reader is on
const NARROW_WIDTH = 544;

// What each step takes up beyond its own width, being the separator drawn beside it
const ITEM_SPACING = 16;

type OverflowResult = {
    // How many of the leading steps have been moved into the menu
    menuItemCount: number;
    // Whether the first step goes into the menu with the rest of them
    hideRoot: boolean;
};

// Works out how much of the trail is moved into the menu, from the widths it was measured
// at. It is kept out of the component, and given everything it reads, so that the answer
// depends on nothing but its arguments
const calculateOverflow = ({
    availableWidth,
    itemCount,
    itemWidths,
    menuButtonWidth,
    overflow,
    hideRoot,
}: {
    availableWidth: number;
    itemCount: number;
    itemWidths: number[];
    menuButtonWidth: number;
    overflow: BreadcrumbsOverflow;
    hideRoot: boolean;
}): OverflowResult => {
    let effectiveHideRoot = hideRoot;
    const rootItemWidth = itemWidths[0] ?? 0;
    const isNarrow = availableWidth < NARROW_WIDTH;

    // A trail that keeps its root has one step less to give up before it reads as nothing
    let minimumVisibleItems = 4;

    if (!effectiveHideRoot) {
        minimumVisibleItems = 3;
    } else if (isNarrow && itemCount > 2) {
        minimumVisibleItems = 1;
    }

    const visibleWidth = (widths: number[]) => {
        const total = widths.reduce((sum, width) => sum + width + ITEM_SPACING, 0);
        return effectiveHideRoot ? total : rootItemWidth + total;
    };

    let visibleItemWidths = [...itemWidths];
    let menuItemCount = 0;

    if (availableWidth > 0 && visibleItemWidths.length > 0) {
        let total = visibleWidth(visibleItemWidths);

        while (
            overflow !== "wrap" &&
            (total > availableWidth || visibleItemWidths.length > minimumVisibleItems)
        ) {
            menuItemCount += 1;
            visibleItemWidths = visibleItemWidths.slice(1);
            // There is a menu button standing in the trail now, so its width is part of the
            // total from here on
            total = visibleWidth(visibleItemWidths) + menuButtonWidth;

            // With only the page the reader is on left to show, the root goes into the menu
            // as well rather than being kept at the cost of that
            if (visibleItemWidths.length === 1 && total > availableWidth) {
                effectiveHideRoot = true;
                break;
            }

            effectiveHideRoot = hideRoot;
        }
    }

    return { menuItemCount, hideRoot: effectiveHideRoot };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BreadcrumbsChild = React.ReactElement<any>;

const getValidChildren = (children: React.ReactNode): BreadcrumbsChild[] =>
    React.Children.toArray(children).filter((child): child is BreadcrumbsChild =>
        React.isValidElement(child),
    );

const BreadcrumbsSeparator = () => (
    <span className={classes.separator} aria-hidden="true" data-component="Breadcrumbs.Separator">
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M10.956 1.27994L6.06418 14.7201L5 14.7201L9.89181 1.27994L10.956 1.27994Z"
                fill="currentcolor"
            />
        </svg>
    </span>
);

// The trail of steps between the top of a site and the page the reader is on. Where the
// trail no longer fits it either wraps onto another line or gives up its middle to a menu
function Breadcrumbs(props: BreadcrumbsProps) {
    const { className, children, style, overflow = "wrap", variant = "normal" } = props;

    const containerRef = React.useRef<HTMLElement>(null);
    const childArray = React.useMemo(() => getValidChildren(children), [children]);
    const rootItem = childArray[0];
    const hideRoot = overflow !== "menu-with-root";

    // What has been measured. Everything else — which steps are shown, which are in the
    // menu, and whether the root is one of them — is worked out from these as the trail
    // renders rather than kept alongside them
    const [itemWidths, setItemWidths] = React.useState<number[]>([]);
    const [containerWidth, setContainerWidth] = React.useState<number | null>(null);
    const [menuButtonWidth, setMenuButtonWidth] = React.useState(MENU_BUTTON_FALLBACK_WIDTH);

    const measureMenuButton = React.useCallback((element: HTMLLIElement | null) => {
        const button = element?.querySelector("button");

        if (!button) {
            return;
        }

        setMenuButtonWidth((current) =>
            current === button.offsetWidth ? current : button.offsetWidth,
        );
    }, []);

    // Only the collapsing trails are measured, since a wrapping one is laid out by the
    // browser alone. The steps can only be measured while all of them are drawn, so nothing
    // is moved into the menu until there are widths to move it by
    useIsomorphicLayoutEffect(() => {
        if (overflow === "wrap") {
            return;
        }

        const container = containerRef.current;

        if (!container) {
            return;
        }

        setContainerWidth((current) =>
            current === container.offsetWidth ? current : container.offsetWidth,
        );

        const items = container.querySelectorAll<HTMLElement>("li[data-crumb]");

        if (items.length === childArray.length) {
            setItemWidths(Array.from(items, (item) => item.offsetWidth));
        }
    }, [childArray, overflow]);

    React.useEffect(() => {
        const container = containerRef.current;

        if (overflow === "wrap" || !container) {
            return;
        }

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                // The width the observer reports is fractional, while the measurement above
                // is whole. Both are rounded the same way so an unchanged width is never
                // read as a change
                const width = Math.round(entry.contentRect.width);
                setContainerWidth((current) => (current === width ? current : width));
            }
        });

        observer.observe(container);

        return () => {
            observer.disconnect();
        };
    }, [overflow]);

    const { menuItemCount, hideRoot: effectiveHideRoot } = React.useMemo(() => {
        if (overflow === "wrap" || itemWidths.length !== childArray.length) {
            return { menuItemCount: 0, hideRoot };
        }

        return calculateOverflow({
            availableWidth: containerWidth ?? CONTAINER_FALLBACK_WIDTH,
            itemCount: childArray.length,
            itemWidths,
            menuButtonWidth,
            overflow,
            hideRoot,
        });
    }, [overflow, hideRoot, childArray, itemWidths, containerWidth, menuButtonWidth]);

    const contextValue = React.useMemo(() => ({ variant }), [variant]);

    const items = React.useMemo(() => {
        const renderItem = (child: React.ReactNode, key: React.Key) => (
            <li key={key} className={classes.item} data-crumb="">
                {child}
                <BreadcrumbsSeparator />
            </li>
        );

        if (menuItemCount === 0) {
            return childArray.map((child, index) => renderItem(child, index));
        }

        const collapsed = childArray.slice(0, menuItemCount);
        const visible = childArray.slice(menuItemCount);
        // Where the root is kept, it is drawn in its own right rather than from the menu
        const menuItems = effectiveHideRoot ? collapsed : collapsed.slice(1);

        const menu = (
            <li
                key="overflow-menu"
                ref={measureMenuButton}
                className={classNames(classes.item, classes.itemMenu)}
                data-overflow-menu=""
            >
                <BreadcrumbsOverflowMenu items={menuItems} />
                <BreadcrumbsSeparator />
            </li>
        );

        const visibleItems = visible.map((child, index) => renderItem(child, `visible-${index}`));

        return effectiveHideRoot
            ? [menu, ...visibleItems]
            : [renderItem(rootItem, "root"), menu, ...visibleItems];
    }, [childArray, menuItemCount, effectiveHideRoot, measureMenuButton, rootItem]);

    return (
        <BreadcrumbsContext.Provider value={contextValue}>
            <nav
                ref={containerRef}
                aria-label="Breadcrumbs"
                className={classNames(classes.root, className)}
                style={style}
                data-component="Breadcrumbs"
                data-overflow={overflow}
                data-variant={variant}
            >
                <ol
                    className={classNames(
                        classes.list,
                        overflow === "wrap" ? classes.listWrap : classes.listMenu,
                    )}
                >
                    {items}
                </ol>
            </nav>
        </BreadcrumbsContext.Provider>
    );
}

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
