import type { ForwardedRef, Ref as StandardRef, MutableRefObject } from "react";
import { useCallback } from "react";
import { isExperimentalReactVersion, reactMajorVersion } from "../utilities/environment";

const supportsRefCleanup = reactMajorVersion >= 19 || isExperimentalReactVersion;

export const useMergedRefs = <T>(refA: Ref<T | null>, refB: Ref<T | null>) => {
    return useCallback(
        (value: T | null) => {
            const cleanupA = setRef(refA, value);
            const cleanupB = setRef(refB, value);

            // TODO: remove when we are on React 19
            if (!supportsRefCleanup) {
                return;
            }

            return () => {
                if (cleanupA) cleanupA();
                else setRef(refA, null);

                if (cleanupB) cleanupB();
                else setRef(refB, null);
            };
        },
        [refA, refB],
    );
};

type CleanupFunction = () => void;

type React19RefCallback<T> = {
    bivarianceHack(instance: T): void | CleanupFunction;
}["bivarianceHack"];

type Ref<T> = ForwardedRef<T> | React19RefCallback<T> | StandardRef<T> | undefined;

const setRef = <T>(ref: Ref<T>, value: T) => {
    if (typeof ref === "function") {
        return ref(value);
    } else if (ref) {
        (ref as MutableRefObject<T>).current = value;
    }
};
