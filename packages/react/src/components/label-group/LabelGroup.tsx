import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../lib/classnames";
import { getInteractiveNodes } from "../../utilities/interactive";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { AnchoredOverlay } from "../anchored-overlay";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { useClippedChildren } from "./useClippedChildren";
import type { LabelGroupProps } from "./LabelGroup.types";

const classes = {
    item: "label-group-item",
    // Left where it is and taken out of sight, so the row the rest were measured in does not
    // change shape as labels come and go
    hidden: "label-group-item-hidden",
    toggle: "label-group-toggle",
    overlay: "label-group-overlay",
    overlayItems: "label-group-overlay-items",
    overlayCloseButton: "label-group-overlay-close-button",
    srOnly: "sr-only",
};

const labelGroupVariants = cva("label-group", {
    variants: {
        // A row showing everything it holds wraps onto as many lines as that takes. One that is
        // still holding something back keeps to a single line, since a row that wrapped would
        // have room for everything and nothing to hold back
        wrap: {
            true: "label-group-wrap",
            false: "",
        },
        list: {
            true: "label-group-list",
            false: "",
        },
    },
});

const nothingHidden: ReadonlySet<number> = new Set<number>();

// A row of labels or tokens on one thing. Where the row runs out of room — or is told to stop
// after a certain number — whatever is left over is counted rather than lost, and the count is
// a button that shows the rest.
//
//     <LabelGroup visibleChildCount="auto">
//         <Label>One</Label>
//         <Label>Two</Label>
//     </LabelGroup>
//
// Rendered as a list by default, since a row of labels is a set of things rather than a
// sentence, and a reader who cannot see it is better served being told how many there are
function LabelGroup<As extends React.ElementType = "ul">(
    props: LabelGroupProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "ul",
        className,
        children,
        overflowStyle = "overlay",
        visibleChildCount,
        ...rest
    } = props as LabelGroupProps<"ul">;

    const containerRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, containerRef);
    const toggleRef = React.useRef<HTMLElement | null>(null);
    const expandButtonRef = React.useRef<HTMLButtonElement>(null);
    const collapseButtonRef = React.useRef<HTMLButtonElement>(null);
    // The first label that was out of sight, kept from before the rest were shown so that focus
    // has somewhere to land once they are
    const firstHiddenRef = React.useRef<number | undefined>(undefined);

    const [isExpanded, setIsExpanded] = React.useState(false);
    const [toggleWidth, setToggleWidth] = React.useState(0);

    // The wrapper is a list item or a span depending on what the group was rendered as, which is
    // more element types than one ref object can be typed against
    const setToggleRef = React.useCallback((node: HTMLElement | null) => {
        toggleRef.current = node;
    }, []);

    const childArray = React.Children.toArray(children);
    const totalCount = childArray.length;

    // A list holds its labels in list items; anything else holds them in spans, since only a
    // list may hold one
    const isList = Component === "ul" || Component === "ol";
    const ItemWrapper: React.ElementType = isList ? "li" : "span";

    const isTruncating = visibleChildCount !== undefined;
    // Shown inline, the labels that were held back come into the row itself. Shown in an
    // overlay they are drawn somewhere else, and the row stays exactly as it was
    const isShowingAllInline = isExpanded && overflowStyle === "inline";

    // The toggle stands at the end of the row, so the room it takes is not room a label can be
    // shown in. It is measured rather than assumed, since what it says grows as labels are held
    // back and the row has to be worked out again each time it does.
    //
    // Only while the row is being measured, though: expanded inline the toggle offers to put the
    // labels back and is far wider than the count it returns to, and setting that much aside
    // would leave the row holding back a label it has room for once it is collapsed again
    useIsomorphicLayoutEffect(() => {
        const toggle = toggleRef.current;

        if (!toggle || visibleChildCount !== "auto" || isShowingAllInline) {
            return;
        }

        const measure = () => setToggleWidth(toggle.getBoundingClientRect().width);

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(toggle);

        return () => {
            observer.disconnect();
        };
    }, [visibleChildCount, isShowingAllInline]);

    const clipped = useClippedChildren({
        containerRef,
        childCount: totalCount,
        reservedWidth: toggleWidth,
        // An overlay leaves the row as it was, so the row goes on being measured underneath it.
        // Only the labels coming into the row itself puts a stop to it
        disabled: visibleChildCount !== "auto" || isShowingAllInline,
    });

    const hidden = React.useMemo(() => {
        if (visibleChildCount === undefined || isShowingAllInline) {
            return nothingHidden;
        }

        if (visibleChildCount === "auto") {
            return clipped;
        }

        const hiddenCount = Math.max(totalCount - visibleChildCount, 0);

        return new Set(
            Array.from({ length: hiddenCount }, (_unused, offset) => visibleChildCount + offset),
        );
    }, [visibleChildCount, isShowingAllInline, clipped, totalCount]);

    const hiddenCount = hidden.size;

    React.useEffect(() => {
        if (hiddenCount > 0) {
            firstHiddenRef.current = Math.min(...hidden);
        }
    }, [hidden, hiddenCount]);

    // Focus follows the labels that have just come into view or gone out of it. Only where they
    // are shown inline: an overlay holds focus itself and hands it back on its own
    const wasExpandedRef = React.useRef(isExpanded);

    React.useEffect(() => {
        const wasExpanded = wasExpandedRef.current;
        wasExpandedRef.current = isExpanded;

        if (overflowStyle === "overlay" || wasExpanded === isExpanded) {
            return;
        }

        if (!isExpanded) {
            // Back onto the count, since the button that was pressed to put them away is gone
            expandButtonRef.current?.focus();
            return;
        }

        // Onto the first label that has just come into view, or onto the button that puts them
        // back where there is nothing in it to take focus
        const firstHidden = containerRef.current?.querySelector<HTMLElement>(
            `[data-index="${firstHiddenRef.current}"]`,
        );

        (getInteractiveNodes(firstHidden ?? null)[0] ?? collapseButtonRef.current)?.focus();
    }, [isExpanded, overflowStyle]);

    const expand = () => setIsExpanded(true);
    const collapse = () => setIsExpanded(false);

    const renderCount = () => (
        <>
            <span className={classes.srOnly}>Show +{hiddenCount} more</span>
            <span aria-hidden="true">+{hiddenCount}</span>
        </>
    );

    const renderToggle = () => {
        if (overflowStyle === "inline") {
            if (isExpanded) {
                return (
                    <Button
                        ref={collapseButtonRef}
                        size="small"
                        variant="invisible"
                        onClick={collapse}
                    >
                        Show less
                    </Button>
                );
            }

            return hiddenCount > 0 ? (
                <Button ref={expandButtonRef} size="small" variant="invisible" onClick={expand}>
                    {renderCount()}
                </Button>
            ) : null;
        }

        return hiddenCount > 0 ? (
            <AnchoredOverlay
                open={isExpanded}
                onOpen={expand}
                onClose={collapse}
                side="outside-bottom"
                align="end"
                width="auto"
                height="auto"
                overlayProps={{
                    role: "dialog",
                    "aria-modal": true,
                    "aria-label": `All ${totalCount} labels`,
                }}
                renderAnchor={(anchorProps) => (
                    <Button {...anchorProps} size="small" variant="invisible">
                        {renderCount()}
                    </Button>
                )}
            >
                <div className={classes.overlay}>
                    <div className={classes.overlayItems}>{children}</div>
                    <IconButton
                        icon={DismissRegular}
                        aria-label="Close"
                        size="small"
                        variant="invisible"
                        onClick={collapse}
                        className={classes.overlayCloseButton}
                        data-component="LabelGroup.CloseButton"
                    />
                </div>
            </AnchoredOverlay>
        ) : null;
    };

    // A row that is holding nothing back has nothing to wrap around, so it wraps
    const wrap = !isTruncating || isShowingAllInline;

    return (
        <Component
            ref={mergedRef}
            className={classNames(labelGroupVariants({ wrap, list: isList }), className)}
            data-component="LabelGroup"
            data-overflow={wrap ? "inline" : undefined}
            data-list={isList || undefined}
            {...rest}
        >
            {childArray.map((child, index) => (
                <ItemWrapper
                    key={index}
                    // Carried so that one observer over the whole row can say which label it is
                    // reporting on
                    data-index={index}
                    data-hidden={hidden.has(index) ? "" : undefined}
                    className={classNames(classes.item, hidden.has(index) && classes.hidden)}
                >
                    {child}
                </ItemWrapper>
            ))}

            {isTruncating ? (
                <ItemWrapper
                    ref={setToggleRef}
                    className={classes.toggle}
                    data-component="LabelGroup.Toggle"
                >
                    {renderToggle()}
                </ItemWrapper>
            ) : null}
        </Component>
    );
}

LabelGroup.displayName = "LabelGroup";

export default fixedForwardRef(LabelGroup);
