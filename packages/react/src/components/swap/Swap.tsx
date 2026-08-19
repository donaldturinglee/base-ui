import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SwapContext } from "./SwapContext";
import type { SwapProps, SwapTransition } from "./Swap.types";

const swapVariants = cva("swap", {
    variants: {
        transition: {
            fade: "swap-fade",
            flip: "swap-flip",
            rotate: "swap-rotate",
            scale: "swap-scale",
            none: "swap-none",
        } satisfies Record<SwapTransition, string>,
    },
});

// Two indicators laid on the same square, one of which is shown at a time:
//
//     <Swap swap={playing}>
//         <Swap.Indicator type="on"><PauseRegular /></Swap.Indicator>
//         <Swap.Indicator type="off"><PlayRegular /></Swap.Indicator>
//     </Swap>
//
// Both are drawn on top of one another rather than one being taken off the page, so the swap keeps
// the size of the larger of the two and nothing beside it moves when the one being shown changes,
// and so the one standing back has somewhere to come forward from.
//
// Which of them is on is the caller's to hold. A swap carries nothing to press and reports nothing:
// it is put inside whatever is pressed, and says only what it was told
function Swap<As extends React.ElementType = "span">(
    props: SwapProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        swap = false,
        transition = "fade",
        children,
        ...rest
    } = props as SwapProps<"span">;

    const context = React.useMemo(() => ({ swap }), [swap]);

    return (
        <SwapContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(swapVariants({ transition }), className)}
                data-component="Swap"
                data-swap={swap ? "on" : "off"}
                data-transition={transition}
                {...rest}
            >
                {children}
            </Component>
        </SwapContext.Provider>
    );
}

Swap.displayName = "Swap";

export default fixedForwardRef(Swap);
