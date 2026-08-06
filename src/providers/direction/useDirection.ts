import { useContext } from "react";
import { DirectionContext } from "./DirectionContext";

// For the handful of cases CSS cannot answer on its own, where a component has to know which
// way the page is read before it can decide what to do. Anything logical properties or a
// `:dir()` selector already handle should stay in the stylesheet
export const useDirection = () => useContext(DirectionContext).direction;

export const useIsRtl = () => useDirection() === "rtl";
