import * as React from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { useOverflow } from "../../hooks/useOverflow";
import { useScrollLock } from "../../hooks/useScrollLock";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../lib/classnames";
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
    backdrop:
        "drawer-backdrop motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short",
    backdropModeless: "drawer-backdrop-modeless",
    backdropPosition: {
        left: "drawer-backdrop-left",
        right: "drawer-backdrop-right",
        top: "drawer-backdrop-top",
        bottom: "drawer-backdrop-bottom",
    } satisfies Record<DrawerPosition, string>,
    root: "drawer motion-safe:animate-in motion-safe:duration-short",
    rootModeless: "drawer-modeless",
    // A drawer arrives from the edge it settles against, so where it comes from is what the
    // position says here beside the shape it takes
    position: {
        left: "drawer-left motion-safe:slide-in-from-left",
        right: "drawer-right motion-safe:slide-in-from-right",
        top: "drawer-top motion-safe:slide-in-from-top",
        bottom: "drawer-bottom motion-safe:slide-in-from-bottom",
    } satisfies Record<DrawerPosition, string>,
    inlineSize: {
        small: "drawer-inline-size-small",
        medium: "drawer-inline-size-medium",
        large: "drawer-inline-size-large",
        xlarge: "drawer-inline-size-xlarge",
    } satisfies Record<DrawerNamedSize, string>,
    blockSize: {
        small: "drawer-block-size-small",
        medium: "drawer-block-size-medium",
        large: "drawer-block-size-large",
        xlarge: "drawer-block-size-xlarge",
    } satisfies Record<DrawerNamedSize, string>,
    customInlineSize: "drawer-inline-size-custom",
    customBlockSize: "drawer-block-size-custom",
    headerContent: "drawer-header-content",
    overflowWrapper: "drawer-overflow-wrapper",
    overflowWrapperBordered: "drawer-overflow-wrapper-bordered",
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
