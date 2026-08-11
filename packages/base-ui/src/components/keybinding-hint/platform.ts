import { useContext, useSyncExternalStore } from "react";
import { PlatformContext } from "./PlatformContext";
import type { Platform } from "./KeybindingHint.types";

// The platform never changes while the page is open, so there is nothing to subscribe to.
// Hoisted so that a fresh function is not made on every render
const subscribe = () => () => {};

// `navigator.platform` says the most where it is still there, and the user agent answers for
// the browsers that have taken it away
const describePlatform = () =>
    typeof navigator === "undefined" ? "" : `${navigator.platform} ${navigator.userAgent}`;

// An iPad reports itself as a Mac, which is the right answer here either way: both carry the
// Command key
export const getPlatform = (): Platform => {
    const description = describePlatform();

    if (/mac|iphone|ipad|ipod/i.test(description)) {
        return "apple";
    }

    if (/win/i.test(description)) {
        return "windows";
    }

    return "other";
};

// Nothing can be told about the platform while rendering on a server, so the names that hold
// everywhere are the ones rendered there
const getServerSnapshot = (): Platform => "other";

// What the keys should be named for, which is the platform that was detected unless something
// around the hint has said otherwise
export const usePlatform = (): Platform => {
    const override = useContext(PlatformContext);
    const detected = useSyncExternalStore(subscribe, getPlatform, getServerSnapshot);

    return override ?? detected;
};
