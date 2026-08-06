import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { PopoverContext } from "./PopoverContext";
import type { PopoverProps } from "./Popover.types";

const popoverVariants = cva("popover", {
    variants: {
        open: {
            true: "popover-open",
            false: "",
        },
        relative: {
            true: "popover-relative",
            false: "",
        },
    },
});

// The room a popover stands in rather than the surface itself.
//
//     <Popover open={open} relative caret="top">
//         <Popover.Content onEscape={close}>Message about popovers</Popover.Content>
//     </Popover>
//
// Where it stands is the caller's to settle: laid out against whichever ancestor is positioned,
// or `relative` to sit in the flow after whatever it was written after. That is what sets it apart
// from the surfaces that place themselves — a tooltip, a hover card, an anchored overlay all
// measure an anchor and work out where there is room, while a popover is put where the caller
// already knows it belongs and does nothing else on its own.
//
// It holds no state either. Whether it is open comes from the prop, because what opens a popover
// is whatever it was opened from, and that is somewhere the popover cannot see
function Popover<As extends React.ElementType = "div">(
    props: PopoverProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        caret = "top",
        open = false,
        relative = false,
        ...rest
    } = props as PopoverProps<"div">;

    // The caret is drawn by the surface, not by the room it stands in, and the surface only
    // answers a dismissal while there is something on screen to dismiss. Both are handed down
    // rather than written on the content again, so a popover is opened and pointed in one place
    const context = { open, caret };

    return (
        <PopoverContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(popoverVariants({ open, relative }), className)}
                data-component="Popover"
                data-caret={caret}
                data-open={open ? "" : undefined}
                data-relative={relative ? "" : undefined}
                {...rest}
            />
        </PopoverContext.Provider>
    );
}

Popover.displayName = "Popover";

export default fixedForwardRef(Popover);
