import * as React from "react";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { useOverflow } from "../../hooks/useOverflow";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { Portal } from "../portal";
import { ScrollableRegion } from "../scrollable-region";
import DialogBody from "./DialogBody";
import DialogButtons from "./DialogButtons";
import DialogCloseButton from "./DialogCloseButton";
import { DialogContext } from "./DialogContext";
import DialogFooter from "./DialogFooter";
import DialogHeader from "./DialogHeader";
import DialogSubtitle from "./DialogSubtitle";
import DialogTitle from "./DialogTitle";
import type {
    DialogAlign,
    DialogFooterButtonLayout,
    DialogHeaderRenderProps,
    DialogHeight,
    DialogNamedWidth,
    DialogNarrowPosition,
    DialogPosition,
    DialogProps,
    DialogRenderProps,
    DialogResponsivePosition,
    DialogWidth,
} from "./Dialog.types";

const classes = {
    backdrop:
        "dialog-backdrop motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short",
    backdropPosition: {
        center: "dialog-backdrop-center",
        left: "dialog-backdrop-left",
        right: "dialog-backdrop-right",
    } satisfies Record<DialogPosition, string>,
    backdropNarrowPosition: {
        center: "dialog-backdrop-narrow-center",
        bottom: "dialog-backdrop-narrow-bottom",
        fullscreen: "dialog-backdrop-narrow-fullscreen",
    } satisfies Record<DialogNarrowPosition, string>,
    backdropAlign: {
        top: "dialog-backdrop-align-top",
        center: "dialog-backdrop-align-center",
        bottom: "dialog-backdrop-align-bottom",
    } satisfies Record<DialogAlign, string>,
    backdropNarrowAlign: {
        top: "dialog-backdrop-narrow-align-top",
        center: "dialog-backdrop-narrow-align-center",
        bottom: "dialog-backdrop-narrow-align-bottom",
    } satisfies Record<DialogAlign, string>,
    root: "dialog motion-safe:animate-in motion-safe:duration-short",
    width: {
        small: "dialog-width-small",
        medium: "dialog-width-medium",
        large: "dialog-width-large",
        xlarge: "dialog-width-xlarge",
    } satisfies Record<DialogNamedWidth, string>,
    customWidth: "dialog-width-custom",
    height: {
        small: "dialog-height-small",
        large: "dialog-height-large",
        auto: "dialog-height-auto",
    } satisfies Record<DialogHeight, string>,
    // A dialog arrives from the edge it settles against, so where it comes from is what the
    // position says here beside the shape it takes
    position: {
        center: "motion-safe:fade-in motion-safe:zoom-in-50",
        left: "dialog-left motion-safe:slide-in-from-left",
        right: "dialog-right motion-safe:slide-in-from-right",
    } satisfies Record<DialogPosition, string>,
    narrowPosition: {
        center: "",
        bottom: "dialog-narrow-bottom max-medium:motion-safe:zoom-in-100 max-medium:motion-safe:slide-in-from-bottom",
        fullscreen: "dialog-narrow-fullscreen",
    } satisfies Record<DialogNarrowPosition, string>,
    align: {
        top: "dialog-align-top",
        center: "",
        bottom: "dialog-align-bottom",
    } satisfies Record<DialogAlign, string>,
    headerInner: "dialog-header-inner",
    headerContent: "dialog-header-content",
    overflowWrapper: "dialog-overflow-wrapper",
    overflowWrapperBordered: "dialog-overflow-wrapper-bordered",
};

// Where the body is left with less room than this, the footer buttons are scrolled
// through in one row rather than wrapping the body out of sight
const MIN_BODY_HEIGHT = 48;

const defaultPosition: DialogResponsivePosition = { narrow: "center", regular: "center" };

const footerButtonSelector = "[data-component='Dialog.FooterButton']:not([disabled])";

// How many dialogs are holding the page still, so the last one to close is the one that
// hands it back
let scrollDisabledCount = 0;
let restoreOverflow = "";
let restorePaddingRight = "";

const isNamedWidth = (width: DialogWidth): width is DialogNamedWidth =>
    typeof width === "string" && width in classes.width;

const normalizeWidth = (width: DialogWidth) => (typeof width === "number" ? `${width}px` : width);

// The renderers are called rather than rendered, so that a footer which renders nothing
// can be told apart from one that is simply empty. That leaves no place for hooks in any
// of them
const DefaultHeader = ({
    title,
    subtitle,
    dialogLabelId,
    dialogDescriptionId,
    onClose,
}: DialogHeaderRenderProps) => (
    <DialogHeader>
        <div className={classes.headerInner}>
            <div className={classes.headerContent}>
                <DialogTitle id={dialogLabelId}>{title}</DialogTitle>
                {subtitle ? (
                    <DialogSubtitle id={dialogDescriptionId}>{subtitle}</DialogSubtitle>
                ) : null}
            </div>
            <DialogCloseButton onClose={() => onClose("close-button")} />
        </div>
    </DialogHeader>
);

const DefaultBody = ({ children }: DialogRenderProps) => <DialogBody>{children}</DialogBody>;

// The footer is one stop on the way round the dialog, so the arrow keys move between the
// buttons standing within it
const onFooterKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

    if (event.defaultPrevented || step === 0) {
        return;
    }

    const buttons = Array.from(
        event.currentTarget.querySelectorAll<HTMLElement>(footerButtonSelector),
    );
    const current = buttons.indexOf(document.activeElement as HTMLElement);

    if (current === -1) {
        return;
    }

    event.preventDefault();
    // Moving on from the last button comes round to the first
    buttons[(current + step + buttons.length) % buttons.length].focus();
};

const DefaultFooter = ({ footerButtons }: DialogRenderProps) =>
    footerButtons ? (
        <DialogFooter onKeyDown={onFooterKeyDown}>
            <DialogButtons buttons={footerButtons} />
        </DialogFooter>
    ) : null;

function Dialog(
    props: DialogProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        title = "Dialog",
        subtitle = "",
        renderHeader,
        renderBody,
        renderFooter,
        footerButtons,
        onClose,
        role = "dialog",
        width = "xlarge",
        height = "auto",
        position = defaultPosition,
        align,
        returnFocusRef,
        initialFocusRef,
        className,
        style,
        children,
        ...rest
    } = props;

    const dialogLabelId = useId();
    const dialogDescriptionId = useId();

    const dialogRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, dialogRef);
    const backdropRef = React.useRef<HTMLDivElement>(null);
    const bodyRef = React.useRef<HTMLDivElement>(null);
    const autoFocusRef = React.useRef<HTMLButtonElement>(null);

    const [lastMouseDownIsBackdrop, setLastMouseDownIsBackdrop] = React.useState(false);
    const [footerButtonLayout, setFooterButtonLayout] =
        React.useState<DialogFooterButtonLayout>("wrap");
    const canScroll = useOverflow(bodyRef);

    useFocusTrap({
        containerRef: dialogRef,
        // A footer button asking for focus is where the dialog opens, unless the caller
        // has named somewhere else
        initialFocusRef: initialFocusRef ?? autoFocusRef,
        returnFocusRef,
    });

    useOnEscapePress((event) => {
        onClose("escape");
        // Taking the event keeps a dialog this one was opened from standing
        event.preventDefault();
    });

    React.useEffect(() => {
        scrollDisabledCount++;

        if (scrollDisabledCount === 1) {
            // The bar the page loses is given back as padding, so nothing behind the
            // dialog shifts sideways as it opens
            const scrollbarWidth = window.innerWidth - document.body.clientWidth;

            restoreOverflow = document.body.style.overflow;
            restorePaddingRight = document.body.style.paddingRight;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            document.body.setAttribute("data-dialog-scroll-disabled", "");
        }

        return () => {
            scrollDisabledCount--;

            if (scrollDisabledCount === 0) {
                document.body.style.overflow = restoreOverflow;
                document.body.style.paddingRight = restorePaddingRight;
                document.body.removeAttribute("data-dialog-scroll-disabled");
            }
        };
    }, []);

    const [slots, childrenWithoutSlots] = useSlots(children, {
        header: DialogHeader,
        body: DialogBody,
        footer: DialogFooter,
    });

    const renderProps: DialogHeaderRenderProps = {
        ...props,
        title,
        subtitle,
        role,
        footerButtons,
        dialogLabelId,
        dialogDescriptionId,
    };

    const header = slots.header ?? (renderHeader ?? DefaultHeader)(renderProps);
    const body =
        slots.body ??
        (renderBody ?? DefaultBody)({ ...renderProps, children: childrenWithoutSlots });
    const footer = slots.footer ?? (renderFooter ?? DefaultFooter)(renderProps);
    const hasFooter = Boolean(footer);

    const updateFooterButtonLayout = React.useCallback(() => {
        const dialog = dialogRef.current;
        const wrapper = bodyRef.current;

        if (!hasFooter || !dialog || !wrapper) {
            return;
        }

        // Wrapping the buttons first is what gives the browser a body height to measure,
        // since that is the height the body would be left with either way
        dialog.setAttribute("data-footer-button-layout", "wrap");

        const layout = wrapper.clientHeight >= MIN_BODY_HEIGHT ? "wrap" : "scroll";

        dialog.setAttribute("data-footer-button-layout", layout);
        setFooterButtonLayout(layout);
    }, [hasFooter]);

    React.useEffect(() => {
        const backdrop = backdropRef.current;

        if (!backdrop) {
            return;
        }

        const observer = new ResizeObserver(updateFooterButtonLayout);

        observer.observe(backdrop);

        return () => {
            observer.disconnect();
        };
    }, [updateFooterButtonLayout]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Only a press and a release that both landed on the backdrop count, so a
        // selection dragged out of the dialog does not close it
        if (event.target === event.currentTarget && lastMouseDownIsBackdrop) {
            onClose("escape");
        }
    };

    const responsivePosition = typeof position === "string" ? { regular: position } : position;
    const regularPosition = responsivePosition.regular ?? "center";
    const narrowPosition = responsivePosition.narrow;
    // The alignment is only read where the dialog is centred, since a side sheet is as
    // tall as the screen anyway
    const alignment = regularPosition === "center" ? align : undefined;
    const positionAttributes = getResponsiveAttributes("position", responsivePosition);
    const alignAttributes = align ? { "data-align": align } : undefined;

    return (
        <DialogContext.Provider value={{ autoFocusRef }}>
            <Portal>
                <div
                    ref={backdropRef}
                    className={classNames(
                        classes.backdrop,
                        classes.backdropPosition[regularPosition],
                        alignment && classes.backdropAlign[alignment],
                        narrowPosition && classes.backdropNarrowPosition[narrowPosition],
                        narrowPosition === "center" &&
                            alignment &&
                            classes.backdropNarrowAlign[alignment],
                    )}
                    onClick={handleBackdropClick}
                    onMouseDown={(event) => {
                        setLastMouseDownIsBackdrop(event.target === event.currentTarget);
                    }}
                    data-component="Dialog.Backdrop"
                    {...positionAttributes}
                    {...alignAttributes}
                >
                    <div
                        ref={mergedRef}
                        role={role}
                        aria-labelledby={dialogLabelId}
                        aria-describedby={dialogDescriptionId}
                        aria-modal
                        className={classNames(
                            classes.root,
                            isNamedWidth(width) ? classes.width[width] : classes.customWidth,
                            classes.height[height],
                            classes.position[regularPosition],
                            alignment && classes.align[alignment],
                            narrowPosition && classes.narrowPosition[narrowPosition],
                            className,
                        )}
                        style={
                            {
                                ...style,
                                ...(isNamedWidth(width)
                                    ? {}
                                    : { "--dialog-width": normalizeWidth(width) }),
                            } as React.CSSProperties
                        }
                        data-component="Dialog"
                        data-width={isNamedWidth(width) ? width : undefined}
                        data-height={height}
                        data-has-footer={hasFooter ? "" : undefined}
                        data-footer-button-layout={hasFooter ? footerButtonLayout : undefined}
                        {...positionAttributes}
                        {...alignAttributes}
                        {...rest}
                    >
                        {header}
                        <ScrollableRegion
                            ref={bodyRef}
                            aria-labelledby={dialogLabelId}
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
        </DialogContext.Provider>
    );
}

Dialog.displayName = "Dialog";

export default fixedForwardRef(Dialog);
