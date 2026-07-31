import * as React from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { ActionListContainerContext } from "../action-list";
import { Portal } from "../portal";
import { getAnchoredPosition } from "../tooltip/anchoredPosition";
import SelectPanelButton from "./SelectPanelButton";
import { SelectPanelContext } from "./SelectPanelContext";
import SelectPanelFooter from "./SelectPanelFooter";
import SelectPanelHeader from "./SelectPanelHeader";
import type { AnchoredPosition } from "../tooltip/anchoredPosition";
import type {
    SelectPanelMaxHeight,
    SelectPanelNarrowVariant,
    SelectPanelProps,
    SelectPanelResponsiveVariant,
    SelectPanelVariant,
    SelectPanelWidth,
} from "./SelectPanel.types";

const classes = {
    // The page behind the panel is covered whichever way the panel is drawn, so that a click
    // that lands anywhere else can dismiss it. Only a modal tints what it covers
    backdrop: "fixed inset-0 flex",
    backdropVariant: {
        anchored: "",
        modal: "items-center justify-center bg-[var(--overlay-backdrop-background-color)] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-[var(--motion-duration-short)]",
    } satisfies Record<SelectPanelVariant, string>,
    backdropNarrowVariant: {
        anchored: "",
        modal: "max-medium:items-center max-medium:justify-center max-medium:bg-[var(--overlay-backdrop-background-color)]",
        "full-screen": "",
        "bottom-sheet":
            "max-medium:items-end max-medium:justify-center max-medium:bg-[var(--overlay-backdrop-background-color)]",
    } satisfies Record<SelectPanelNarrowVariant, string>,
    // The floor keeps the panel from closing up around a spinner or a line of text where the
    // list it would have held has nothing to show
    root: "flex flex-col overflow-hidden max-w-[calc(100dvw_-_var(--base-size-32))] [--select-panel-body-min-height:var(--overlay-height-small)] bg-[var(--overlay-background-color)] rounded-[var(--border-radius-large)] [box-shadow:var(--shadow-floating-small)] [color:var(--foreground-color-default)] focus:outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:duration-[var(--motion-duration-short)]",
    // Where it ends up is carried in variables rather than written straight onto the element,
    // so that a narrow viewport can put it somewhere else
    anchored: "absolute top-[var(--select-panel-top)] left-[var(--select-panel-left)]",
    // Held back until it has been placed, so it is never seen where it does not belong
    unplaced: "invisible",
    narrowVariant: {
        anchored:
            "max-medium:absolute max-medium:top-[var(--select-panel-top)] max-medium:left-[var(--select-panel-left)]",
        modal: "max-medium:static",
        // The whole screen, which is what a narrow viewport has room for and nothing else
        "full-screen":
            "max-medium:static max-medium:w-dvw max-medium:max-w-none max-medium:h-dvh max-medium:max-h-none max-medium:rounded-none",
        // The foot of the screen, within reach of a thumb
        "bottom-sheet":
            "max-medium:static max-medium:w-dvw max-medium:max-w-none max-medium:max-h-[calc(100dvh_-_var(--base-size-64))] max-medium:rounded-b-none",
    } satisfies Record<SelectPanelNarrowVariant, string>,
    width: {
        small: "w-[var(--overlay-width-small)]",
        medium: "w-[var(--overlay-width-medium)]",
        large: "w-[var(--overlay-width-large)]",
        xlarge: "w-[var(--overlay-width-xlarge)]",
        auto: "w-auto",
    } satisfies Record<SelectPanelWidth, string>,
    maxHeight: {
        small: "max-h-[var(--overlay-height-small)]",
        medium: "max-h-[var(--overlay-height-medium)]",
        large: "max-h-[var(--overlay-height-large)]",
        xlarge: "max-h-[var(--overlay-height-xlarge)]",
        "fit-content": "max-h-[calc(100dvh_-_var(--base-size-64))]",
    } satisfies Record<SelectPanelMaxHeight, string>,
    form: "flex w-full grow flex-col overflow-hidden",
    // The list scrolls within the panel rather than the panel growing to hold it
    container:
        "flex grow flex-col justify-between overflow-hidden [&_ul]:grow [&_ul]:overflow-y-auto",
};

const defaultVariant: SelectPanelResponsiveVariant = { regular: "anchored", narrow: "full-screen" };

// What the panel hands its anchor, so that the button says what it opens and the panel can
// measure itself against it
type AnchorElementProps = {
    ref?: React.Ref<HTMLButtonElement>;
    onClick?: React.MouseEventHandler<HTMLElement>;
    "aria-haspopup"?: boolean;
    "aria-expanded"?: boolean;
};

const isAnchor = (child: React.ReactNode): child is React.ReactElement<AnchorElementProps> =>
    React.isValidElement(child) && child.type === SelectPanelButton;

// Whether the panel ended up where it already was, which is the only thing worth not
// rendering it again for
const isSamePosition = (one: AnchoredPosition, other: AnchoredPosition) =>
    one.top === other.top &&
    one.left === other.left &&
    one.anchorSide === other.anchorSide &&
    one.anchorAlign === other.anchorAlign;

// A panel for picking from a list of things. The button that opens it is taken out of the
// children and rendered where the panel itself stands, and everything else is drawn inside
// the panel: a header that names it, the list, and a footer that saves the selection
function SelectPanel(
    props: SelectPanelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        title,
        description,
        variant = defaultVariant,
        selectionVariant = "multiple",
        id: idProp,
        defaultOpen = false,
        open: openProp,
        anchorRef: externalAnchorRef,
        side = "outside-bottom",
        align = "start",
        onCancel,
        onClearSelection,
        onSubmit,
        width = "medium",
        maxHeight = "large",
        ...rest
    } = props;

    const panelId = useId(idProp);

    const internalAnchorRef = React.useRef<HTMLButtonElement>(null);
    const anchorRef = externalAnchorRef ?? internalAnchorRef;
    const panelRef = React.useRef<HTMLDivElement>(null);
    const mergedPanelRef = useMergedRefs(ref, panelRef);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    // A panel the caller is holding the state of takes whether it is open from the prop; one
    // that is not keeps its own
    const isControlled = openProp !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp : selfOpen;

    const close = React.useCallback(() => {
        if (!isControlled) {
            setSelfOpen(false);
        }
    }, [isControlled]);

    const handleCancel = React.useCallback(() => {
        close();
        onCancel?.();
    }, [close, onCancel]);

    const handleClearSelection = React.useCallback(() => onClearSelection?.(), [onClearSelection]);

    const submit = React.useCallback(
        (event?: React.FormEvent<HTMLFormElement>) => {
            // A panel that takes the first pick as its answer submits without a form event
            event?.preventDefault();
            close();
            onSubmit?.(event);
        },
        [close, onSubmit],
    );

    /* The list */

    const moveFocusToList = React.useCallback(() => {
        // Only the options are reached for: the header holds a list of its own in the field
        // above, and a group is a row that cannot be picked
        panelRef.current?.querySelector<HTMLElement>('[role="option"]')?.focus();
    }, []);

    const handleAfterSelect = React.useCallback(() => {
        if (selectionVariant === "instant") {
            submit();
        }
    }, [selectionVariant, submit]);

    /* Search */

    const [searchQuery, setSearchQuery] = React.useState("");

    /* Panel plumbing */

    const childArray = React.Children.toArray(children);
    const anchorChild = childArray.find(isAnchor);
    const [slots, childrenInBody] = useSlots(
        childArray.filter((child) => child !== anchorChild),
        { header: SelectPanelHeader, footer: SelectPanelFooter },
    );

    const anchorOnClick = anchorChild?.props.onClick;

    const handleAnchorClick = (event: React.MouseEvent<HTMLElement>) => {
        anchorOnClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (open) {
            handleCancel();
        } else if (!isControlled) {
            setSelfOpen(true);
        }
    };

    const anchor = anchorChild
        ? React.cloneElement(anchorChild, {
              ref: anchorRef,
              onClick: handleAnchorClick,
              "aria-haspopup": true,
              "aria-expanded": open,
          })
        : null;

    /* Placement */

    const responsiveVariant = {
        ...defaultVariant,
        ...(typeof variant === "string" ? { regular: variant } : variant),
    };
    const regularVariant = responsiveVariant.regular ?? "anchored";
    const narrowVariant = responsiveVariant.narrow;
    const isAnchored = regularVariant === "anchored" || narrowVariant === "anchored";

    const placedRef = React.useRef<AnchoredPosition | null>(null);
    const [position, setPosition] = React.useState<AnchoredPosition | null>(null);

    const updatePosition = React.useCallback(() => {
        const anchorElement = anchorRef.current;
        const panel = panelRef.current;

        if (!anchorElement || !panel) {
            return;
        }

        const placed = getAnchoredPosition(panel, anchorElement, { side, align });

        if (placedRef.current && isSamePosition(placedRef.current, placed)) {
            return;
        }

        placedRef.current = placed;
        setPosition(placed);
    }, [anchorRef, side, align]);

    // Placed before the browser paints, so the panel is never seen standing anywhere but
    // against its anchor
    useIsomorphicLayoutEffect(() => {
        if (!open || !isAnchored) {
            // Forgotten, so that a panel opened again is placed from scratch rather than from
            // wherever it was last time
            placedRef.current = null;
            setPosition(null);
            return;
        }

        updatePosition();

        // The anchor moves whenever the page is laid out again, and the panel moves with
        // whatever it grows to hold
        const observer = new ResizeObserver(updatePosition);

        if (panelRef.current) {
            observer.observe(panelRef.current);
        }

        window.addEventListener("resize", updatePosition);
        // Caught on the way down, so that a panel standing over a scrolling region follows
        // its anchor as the region is scrolled rather than only the page
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open, isAnchored, updatePosition]);

    /* Focus */

    useFocusTrap({
        containerRef: panelRef,
        // The panel opens with the field that filters it, where it has one
        initialFocusRef: searchInputRef,
        // Focus goes back to the anchor, which is where it was before the panel opened
        returnFocusRef: anchorRef,
        disabled: !open,
    });

    // With no field to type in, the panel opens on the list itself rather than on the button
    // that closes it
    React.useEffect(() => {
        if (open && !searchInputRef.current) {
            moveFocusToList();
        }
    }, [open, moveFocusToList]);

    useOnEscapePress((event) => {
        if (!open) {
            return;
        }

        // Taking the event keeps a layer this panel was opened from standing
        event.preventDefault();
        handleCancel();
    });

    const panelContextValue = React.useMemo(
        () => ({
            panelId,
            title,
            description,
            selectionVariant,
            searchQuery,
            setSearchQuery,
            searchInputRef,
            onCancel: handleCancel,
            onClearSelection: onClearSelection ? handleClearSelection : undefined,
            moveFocusToList,
        }),
        [
            panelId,
            title,
            description,
            selectionVariant,
            searchQuery,
            handleCancel,
            onClearSelection,
            handleClearSelection,
            moveFocusToList,
        ],
    );

    // The list is read as a listbox named by the panel's own title, so its items take their
    // semantics from here rather than from what is around them on the page
    const containerContextValue = React.useMemo(
        () => ({
            container: "SelectPanel",
            listRole: "listbox" as const,
            listLabelledBy: `${panelId}-title`,
            selectionAttribute: "aria-selected" as const,
            // Picking is instant to the caller alone: to the list it is still one of many
            selectionVariant:
                selectionVariant === "instant" ? ("single" as const) : selectionVariant,
            afterSelect: handleAfterSelect,
            // Arrow keys move between the items
            enableFocusZone: true,
        }),
        [panelId, selectionVariant, handleAfterSelect],
    );

    return (
        <>
            {anchor}

            {open ? (
                <Portal>
                    <div
                        className={classNames(
                            classes.backdrop,
                            classes.backdropVariant[regularVariant],
                            narrowVariant && classes.backdropNarrowVariant[narrowVariant],
                        )}
                        onClick={(event) => {
                            if (event.target === event.currentTarget) {
                                handleCancel();
                            }
                        }}
                        data-component="SelectPanel.Backdrop"
                        {...getResponsiveAttributes("variant", responsiveVariant)}
                    >
                        <div
                            ref={mergedPanelRef}
                            role="dialog"
                            aria-modal
                            aria-labelledby={`${panelId}-title`}
                            aria-describedby={description ? `${panelId}-description` : undefined}
                            className={classNames(
                                classes.root,
                                classes.width[width],
                                classes.maxHeight[maxHeight],
                                regularVariant === "anchored" && classes.anchored,
                                narrowVariant && classes.narrowVariant[narrowVariant],
                                isAnchored && !position && classes.unplaced,
                                className,
                            )}
                            style={
                                {
                                    "--select-panel-top": `${position?.top ?? 0}px`,
                                    "--select-panel-left": `${position?.left ?? 0}px`,
                                } as React.CSSProperties
                            }
                            data-component="SelectPanel"
                            data-width={width}
                            data-max-height={maxHeight}
                            data-side={position?.anchorSide ?? side}
                            data-align={position?.anchorAlign ?? align}
                            {...getResponsiveAttributes("variant", responsiveVariant)}
                            {...rest}
                        >
                            <form className={classes.form} onSubmit={submit}>
                                <SelectPanelContext.Provider value={panelContextValue}>
                                    {/* A panel with no header of its own is given the
                                        default one, so there is always something to close
                                        it by */}
                                    {slots.header ?? <SelectPanelHeader />}

                                    <div className={classes.container}>
                                        <ActionListContainerContext.Provider
                                            value={containerContextValue}
                                        >
                                            {childrenInBody}
                                        </ActionListContainerContext.Provider>
                                    </div>

                                    {slots.footer}
                                </SelectPanelContext.Provider>
                            </form>
                        </div>
                    </div>
                </Portal>
            ) : null}
        </>
    );
}

SelectPanel.displayName = "SelectPanel";

export default fixedForwardRef(SelectPanel);
