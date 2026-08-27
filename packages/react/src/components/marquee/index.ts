import MarqueeBase, { DEFAULT_MARQUEE_SPEED } from "./Marquee";
import MarqueeContent from "./MarqueeContent";
import MarqueeEdge from "./MarqueeEdge";
import MarqueeItem from "./MarqueeItem";
import MarqueeViewport from "./MarqueeViewport";

export const Marquee = Object.assign(MarqueeBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and a marquee written out in full is written the way it is read
    Root: MarqueeBase,
    Viewport: MarqueeViewport,
    Content: MarqueeContent,
    Item: MarqueeItem,
    Edge: MarqueeEdge,
});

export { MarqueeViewport, MarqueeContent, MarqueeItem, MarqueeEdge, DEFAULT_MARQUEE_SPEED };
export { MarqueeContext, useMarqueeContext } from "./MarqueeContext";
export { useMarquee } from "./useMarquee";
export * from "./Marquee.types";
