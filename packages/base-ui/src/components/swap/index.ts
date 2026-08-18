import SwapBase from "./Swap";
import SwapIndicator from "./SwapIndicator";

export const Swap = Object.assign(SwapBase, {
    Indicator: SwapIndicator,
});

export { SwapIndicator };
export { SwapContext } from "./SwapContext";
export * from "./Swap.types";
