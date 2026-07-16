import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

export type MediaQueryFeatures = {
    [key: string]: boolean | undefined;
};

export type ResponsiveValue<TRegular, TNarrow = TRegular, TWide = TRegular> = {
    narrow?: TNarrow;
    regular?: TRegular;
    wide?: TWide;
};

export type FlattenResponsiveValue<T> =
    | (T extends ResponsiveValue<infer TRegular, infer TNarrow, infer TWide>
          ? TRegular | TNarrow | TWide
          : never)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Exclude<T, ResponsiveValue<any>>;

export const MatchMediaContext = createContext<MediaQueryFeatures>({});

export const viewportRanges = {
    narrow: "(max-width: calc(768px - 0.02px))", // < 768px
    regular: "(min-width: 768px)", // >= 768px
    wide: "(min-width: 1400px)", // >= 1400px
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isResponsiveValue = (value: any): value is ResponsiveValue<any> => {
    return (
        typeof value === "object" &&
        Object.keys(value).some((key) => ["narrow", "regular", "wide"].includes(key))
    );
};

export const useMedia = (mediaQueryString: string, defaultState?: boolean) => {
    const features = useContext(MatchMediaContext);
    // When the query is provided through `MatchMedia` context, that value always
    // wins and there is nothing external to subscribe to.
    const contextValue = features[mediaQueryString] as boolean | undefined;

    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            if (contextValue !== undefined) {
                return () => {};
            }

            const mediaQueryList = window.matchMedia(mediaQueryString);

            // Support fallback to `addListener` for broader browser support
            if (mediaQueryList.addEventListener) {
                mediaQueryList.addEventListener("change", onStoreChange);
                return () => {
                    mediaQueryList.removeEventListener("change", onStoreChange);
                };
            }

            mediaQueryList.addListener(onStoreChange);
            return () => {
                mediaQueryList.removeListener(onStoreChange);
            };
        },
        [contextValue, mediaQueryString],
    );

    const getSnapshot = useCallback(() => {
        if (contextValue !== undefined) {
            return contextValue;
        }
        return window.matchMedia(mediaQueryString).matches;
    }, [contextValue, mediaQueryString]);

    const getServerSnapshot = useCallback(() => {
        if (contextValue !== undefined) {
            return contextValue;
        }

        // Prevent a React hydration mismatch when a default value is provided by not
        // defaulting to `window.matchMedia(query).matches`.
        if (defaultState !== undefined) {
            return defaultState;
        }

        return false;
    }, [contextValue, defaultState]);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

// TODO: Improve SSR support
export const useResponsiveValue = <T, F>(value: T, fallback: F): FlattenResponsiveValue<T> | F => {
    // Check viewport size
    // TODO: What is the performance cost of creating media query listeners in this hook?
    const isNarrowViewport = useMedia(viewportRanges.narrow, false);
    const isRegularViewport = useMedia(viewportRanges.regular, false);
    const isWideViewport = useMedia(viewportRanges.wide, false);

    if (isResponsiveValue(value)) {
        // If we've reached this line, we know that value is a responsive value
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responsiveValue = value as Extract<T, ResponsiveValue<any>>;

        if (isNarrowViewport && "narrow" in responsiveValue) {
            return responsiveValue.narrow;
        } else if (isWideViewport && "wide" in responsiveValue) {
            return responsiveValue.wide;
        } else if (isRegularViewport && "regular" in responsiveValue) {
            return responsiveValue.regular;
        } else {
            return fallback;
        }
    } else {
        // If we've reached this line, we know that value is not a responsive value
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return value as Exclude<T, ResponsiveValue<any>>;
    }
};
