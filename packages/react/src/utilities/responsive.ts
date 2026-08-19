import type { ResponsiveValue } from "../hooks/useResponsive";

export const getResponsiveAttributes = <T>(
    property: string,
    values?: T | ResponsiveValue<T>,
): Record<string, T extends boolean ? "" : T> | undefined => {
    if (values === undefined || values === null) {
        return;
    }

    if (typeof values === "object") {
        return Object.fromEntries(
            Object.entries(values).map(([key, value]) => {
                return serialize(`data-${property}-${key}`, value);
            }),
        );
    }

    return Object.fromEntries([serialize(`data-${property}`, values)]);
};

const serialize = <T>(property: string, value: T) => {
    return [property, value];
};

const types = ["narrow", "regular", "wide"] as const;

export const getResponsiveControlValues = <T>(value: T, responsiveValue: ResponsiveValue<T>) => {
    const match = types.some((type) => {
        return responsiveValue[type];
    });
    if (match) {
        return responsiveValue;
    }
    return value;
};
