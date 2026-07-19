import type * as React from "react";

export type SkeletonTextSize =
    | "display"
    | "titleLarge"
    | "titleMedium"
    | "titleSmall"
    | "bodyLarge"
    | "bodyMedium"
    | "bodySmall"
    | "subtitle";

export type SkeletonTextProps = React.ComponentPropsWithoutRef<"div"> & {
    size?: SkeletonTextSize;
    lines?: number;
    maxWidth?: React.CSSProperties["maxWidth"];
    className?: string;
};
