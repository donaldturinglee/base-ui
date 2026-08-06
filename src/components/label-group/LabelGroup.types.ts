import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Where the labels that did not fit are shown once the reader asks for them. `inline` lets the
// row wrap and shows them where they belong; `overlay` leaves the row as it was and shows the
// whole set in a panel standing over the page
export type LabelGroupOverflowStyle = "inline" | "overlay";

// How many labels the row shows before it stops. `auto` shows as many as the row has room for
// and works the rest out again whenever that changes; a number shows that many and no more.
// Left unsaid, the row shows everything it holds and wraps onto as many lines as that takes
export type LabelGroupVisibleChildCount = "auto" | number;

export type LabelGroupProps<As extends React.ElementType = "ul"> = PolymorphicProps<
    As,
    "ul",
    {
        overflowStyle?: LabelGroupOverflowStyle;
        visibleChildCount?: LabelGroupVisibleChildCount;
        className?: string;
    }
>;
