import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { PopoverContext } from "./PopoverContext";
import type {
    PopoverCaret,
    PopoverContentHeight,
    PopoverContentOverflow,
    PopoverContentProps,
    PopoverContentWidth,
} from "./Popover.types";

const popoverContentVariants = cva("popover-content", {
    variants: {
        caret: {
            top: "popover-content-caret-top",
            bottom: "popover-content-caret-bottom",
            left: "popover-content-caret-left",
            right: "popover-content-caret-right",
            "top-left": "popover-content-caret-top-left",
            "top-right": "popover-content-caret-top-right",
            "bottom-left": "popover-content-caret-bottom-left",
            "bottom-right": "popover-content-caret-bottom-right",
            "left-top": "popover-content-caret-left-top",
            "left-bottom": "popover-content-caret-left-bottom",
            "right-top": "popover-content-caret-right-top",
            "right-bottom": "popover-content-caret-right-bottom",
        } satisfies Record<PopoverCaret, string>,
        width: {
            xsmall: "popover-content-width-xsmall",
            small: "popover-content-width-small",
            medium: "popover-content-width-medium",
            large: "popover-content-width-large",
            xlarge: "popover-content-width-xlarge",
            auto: "popover-content-width-auto",
        } satisfies Record<PopoverContentWidth, string>,
        height: {
            small: "popover-content-height-small",
            medium: "popover-content-height-medium",
            large: "popover-content-height-large",
            xlarge: "popover-content-height-xlarge",
            auto: "popover-content-height-auto",
            "fit-content": "popover-content-height-fit-content",
        } satisfies Record<PopoverContentHeight, string>,
        overflow: {
            auto: "popover-content-overflow-auto",
            hidden: "popover-content-overflow-hidden",
            scroll: "popover-content-overflow-scroll",
            visible: "popover-content-overflow-visible",
        } satisfies Record<PopoverContentOverflow, string>,
    },
});

// Stable, so that a surface given nothing to ignore does not take its listeners down and put them
// back up again on every render
const NO_IGNORED_REFS: React.RefObject<HTMLElement | null>[] = [];

// The surface itself, and the caret it points from. It is laid out inside the room the popover was
// given rather than being that room, so that the padding the words sit in is the caller's to
// change without disturbing where the popover stands.
//
// Dismissing it is reported rather than done: Escape and a press outside both call back and leave
// the caller to close the popover, since the caller is the one holding whether it is open
function PopoverContent<As extends React.ElementType = "div">(
    props: PopoverContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        width = "small",
        height = "fit-content",
        overflow = "visible",
        onClickOutside,
        onEscape,
        ignoreClickRefs = NO_IGNORED_REFS,
        ...rest
    } = props as PopoverContentProps<"div">;

    const { open = false, caret = "top" } = React.useContext(PopoverContext);

    const contentRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, contentRef);

    // A press anywhere else asks for the popover to be dismissed, which is what a surface standing
    // over the page rather than in it needs. Only while it is open: a popover that is shut is not
    // on screen for a press to have landed outside of
    React.useEffect(() => {
        if (!open || !onClickOutside) {
            return;
        }

        const handlePress = (event: MouseEvent | TouchEvent) => {
            // An auxiliary button — the right one, or the wheel — is not reaching for anything,
            // so it is left alone
            if (event instanceof MouseEvent && event.button > 0) {
                return;
            }

            const { target } = event;

            if (!(target instanceof Node)) {
                return;
            }

            if (contentRef.current?.contains(target)) {
                return;
            }

            if (ignoreClickRefs.some(({ current }) => current?.contains(target))) {
                return;
            }

            onClickOutside(event);
        };

        document.addEventListener("mousedown", handlePress);
        document.addEventListener("touchstart", handlePress);

        return () => {
            document.removeEventListener("mousedown", handlePress);
            document.removeEventListener("touchstart", handlePress);
        };
    }, [open, onClickOutside, ignoreClickRefs]);

    useOnEscapePress((event) => {
        if (!open || !onEscape) {
            return;
        }

        onEscape(event);
        // Taking the event keeps a layer this popover was opened over from answering as well
        event.preventDefault();
    });

    return (
        <Component
            ref={mergedRef}
            className={classNames(
                popoverContentVariants({ caret, width, height, overflow }),
                className,
            )}
            data-component="Popover.Content"
            data-caret={caret}
            data-width={width}
            data-height={height}
            data-overflow={overflow}
            {...rest}
        />
    );
}

PopoverContent.displayName = "Popover.Content";

export default fixedForwardRef(PopoverContent);
