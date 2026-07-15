import type * as React from "react";
import type { Merge } from "../../utilities/polymorphic";

export type SpinnerProps = Merge<
    React.HTMLAttributes<HTMLSpanElement>,
    {
        size?: "small" | "medium" | "large";
        srText?: string | null;
        className?: string;
    }
>;
