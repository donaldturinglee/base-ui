import { createContext, useContext } from "react";
import type { MarqueeContextValue } from "./Marquee.types";

export const MarqueeContext = createContext<MarqueeContextValue>({});

// What the marquee around a part is doing, for a control of the caller's own standing among the
// parts: whether the run is going, and the ways of holding it. A control standing on its own has
// no marquee to read, and reaches for useMarquee
export const useMarqueeContext = () => useContext(MarqueeContext);
