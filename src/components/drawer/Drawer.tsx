import * as React from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { useOverflow } from "../../hooks/useOverflow";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import { ScrollableRegion } from "../scrollable-region";
import DrawerBody from "./DrawerBody";
import DrawerCloseButton from "./DrawerCloseButton";
import { DrawerContext } from "./DrawerContext";
import DrawerFooter from "./DrawerFooter";
import DrawerHeader from "./DrawerHeader";
import DrawerSubtitle from "./DrawerSubtitle";
import DrawerTitle from "./DrawerTitle";
import type { DrawerNamedSize, DrawerPosition, DrawerProps, DrawerSize } from "./Drawer.types";

const classes = {
    // The layer the drawer is laid out in covers the page and pushes the panel to whichever
    // edge it settles against, filling the other way of its own accord
    backdrop:
        "fixed inset-0 flex bg-[var(--overlay-backdrop-background-color)] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short",
    // A modeless drawer leaves the page behind it to be used, so the layer takes no colour and
    // catches nothing; the panel standing in it is the only part that answers a pointer
    backdropModeless: "bg-transparent pointer-events-none",
    backdropPosition: {
        left: "flex-row justify-start",
        right: "flex-row justify-end",
        top: "flex-col justify-start",
        bottom: "flex-col justify-end",
    } satisfies Record<DrawerPosition, string>,
    root: "flex flex-col overflow-hidden bg-[var(--overlay-background-color)] [box-shadow:var(--shadow-floating-small)] motion-safe:animate-in motion-safe:duration-short",
    rootModeless: "pointer-events-auto",
    // A drawer runs the whole way along the edge it settles against, gives up the two corners
    // it meets there, and arrives from that edge
    position: {
        left: "h-full max-w-[100dvw] rounded-r-[var(--border-radius-large)] motion-safe:slide-in-from-left",
        right: "h-full max-w-[100dvw] rounded-l-[var(--border-radius-large)] motion-safe:slide-in-from-right",
        top: "w-full max-h-[100dvh] rounded-b-[var(--border-radius-large)] motion-safe:slide-in-from-top",
        bottom: "w-full max-h-[100dvh] rounded-t-[var(--border-radius-large)] motion-safe:slide-in-from-bottom",
    } satisfies Record<DrawerPosition, string>,
    // How far a drawer comes in is a width where it settles against a side, and a height where
    // it settles against the top or the bottom
    inlineSize: {
        small: "w-[var(--overlay-width-small)]",
        medium: "w-[var(--overlay-width-medium)]",
        large: "w-[var(--overlay-width-large)]",
        xlarge: "w-[var(--overlay-width-xlarge)]",
    } satisfies Record<DrawerNamedSize, string>,
    blockSize: {
        small: "h-[var(--overlay-height-small)]",
        medium: "h-[var(--overlay-height-medium)]",
        large: "h-[var(--overlay-height-large)]",
        xlarge: "h-[var(--overlay-height-xlarge)]",
    } satisfies Record<DrawerNamedSize, string>,
    // A size that is not a step of the scale is carried in a variable of its own
    customInlineSize: "w-[var(--drawer-size)]",
    customBlockSize: "h-[var(--drawer-size)]",
    // The header lays its parts out in a row itself, so the title and the subtitle are all
    // that need grouping. Filling the row leaves the close button at the end of it
    headerContent: "flex flex-col grow px-[var(--base-size-8)] py-[var(--base-size-6)]",
    overflowWrapper: "grow",
    // The line above the footer is only there to say that the body has more to be read past
    // the end of the panel
    overflowWrapperBordered:
        "border-b-[length:var(--border-width-thin)] border-b-[color:var(--border-color-default)]",
};

const isNamedSize = (size: DrawerSize): size is DrawerNamedSize =>
    typeof size === "string" && size in classes.inlineSize;

const normalizeSize = (size: DrawerSize) => (typeof size === "number" ? `${size}px` : size);

// A panel that comes in from an edge of the screen and stays anchored to it, for work that
// runs alongside the page rather than in place of it. A modal drawer holds the page still
// behind it the way a dialog does; a modeless one leaves it to be used
function Drawer(
    props: DrawerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        title = "Drawer",
        subtitle = "",
        onClose,
        position = "right",
        size = "medium",
        modal = true,
        returnFocusRef,
        initialFocusRef,
        className,
        style,
        children,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        ...rest
    } = props;

    const labelId = useId();
    const descriptionId = useId();

    const drawerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, drawerRef);
    const bodyRef = React.useRef<HTMLDivElement>(null);

    const [lastMouseDownIsBackdrop, setLastMouseDownIsBackdrop] = React.useState(false);
    const canScroll = useOverflow(bodyRef);

    useFocusTrap({
        containerRef: drawerRef,
        initialFocusRef,
        returnFocusRef,
        // A modeless drawer leaves focus free to move on to the page behind it
        disabled: !modal,
    });

    useOnEscapePress((event) => {
        onClose("escape");

        // Taking the event keeps a layer this one was opened from standing. A modeless drawer
        // leaves it alone, since whatever is behind it is still being used
        if (modal) {
            event.preventDefault();
        }
    });

    useScrollLock(!modal);

    const [slots, childrenWithoutSlots] = useSlots(children, {
        header: DrawerHeader,
        body: DrawerBody,
        footer: DrawerFooter,
    });

    const closeFromButton = () => {
        onClose("close-button");
    };

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Only a press and a release that both landed on the backdrop count, so a selection
        // dragged out of the drawer does not close it
        if (modal && event.target === event.currentTarget && lastMouseDownIsBackdrop) {
            onClose("escape");
        }
    };

    const header = slots.header ?? (
        <DrawerHeader>
            <div className={classes.headerContent}>
                <DrawerTitle>{title}</DrawerTitle>
                {subtitle ? <DrawerSubtitle>{subtitle}</DrawerSubtitle> : null}
            </div>
            <DrawerCloseButton />
        </DrawerHeader>
    );

    const body = slots.body ?? <DrawerBody>{childrenWithoutSlots}</DrawerBody>;
    const footer = slots.footer;
    const hasFooter = Boolean(footer);

    const isHorizontal = position === "left" || position === "right";
    const named = isNamedSize(size);

    // The title carries the id the drawer points at, so a header of the caller's own names the
    // drawer as long as it is built from Drawer.Title. A caller who has named the drawer
    // themselves keeps that name
    const labelledBy = ariaLabelledBy ?? (ariaLabel ? undefined : labelId);
    // Only the drawer's own subtitle is pointed at; a header of the caller's own describes the
    // drawer itself
    const describedBy = ariaDescribedBy ?? (subtitle ? descriptionId : undefined);

    return (
        <DrawerContext.Provider value={{ labelId, descriptionId, onClose: closeFromButton }}>
            <Portal>
                <div
                    className={classNames(
                        classes.backdrop,
                        classes.backdropPosition[position],
                        !modal && classes.backdropModeless,
                    )}
                    onClick={handleBackdropClick}
                    onMouseDown={(event) => {
                        setLastMouseDownIsBackdrop(event.target === event.currentTarget);
                    }}
                    data-component="Drawer.Backdrop"
                    data-position={position}
                    data-modal={modal}
                >
                    <div
                        ref={mergedRef}
                        role="dialog"
                        aria-labelledby={labelledBy}
                        aria-describedby={describedBy}
                        aria-label={ariaLabel}
                        aria-modal={modal || undefined}
                        className={classNames(
                            classes.root,
                            classes.position[position],
                            named
                                ? isHorizontal
                                    ? classes.inlineSize[size]
                                    : classes.blockSize[size]
                                : isHorizontal
                                  ? classes.customInlineSize
                                  : classes.customBlockSize,
                            !modal && classes.rootModeless,
                            className,
                        )}
                        style={
                            {
                                ...style,
                                ...(named ? {} : { "--drawer-size": normalizeSize(size) }),
                            } as React.CSSProperties
                        }
                        data-component="Drawer"
                        data-position={position}
                        data-size={named ? size : undefined}
                        data-modal={modal}
                        data-has-footer={hasFooter ? "" : undefined}
                        {...rest}
                    >
                        {header}
                        <ScrollableRegion
                            ref={bodyRef}
                            aria-labelledby={labelId}
                            className={classNames(
                                classes.overflowWrapper,
                                hasFooter && canScroll && classes.overflowWrapperBordered,
                            )}
                        >
                            {body}
                        </ScrollableRegion>
                        {footer}
                    </div>
                </div>
            </Portal>
        </DrawerContext.Provider>
    );
}

Drawer.displayName = "Drawer";

export default fixedForwardRef(Drawer);
