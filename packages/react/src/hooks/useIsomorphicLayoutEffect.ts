import { useEffect, useLayoutEffect } from "react";
import { canUseDOM } from "../utilities/environment";

// `useLayoutEffect` warns when React renders on the server, where there is no layout to
// measure, so fall back to `useEffect` there
export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
