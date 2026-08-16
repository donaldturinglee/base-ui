import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

type FormatNumberOwnProps = {
    // The number to write out
    value: number;
    // The shape it is written in: a currency, a unit, however many places. Taken straight from
    // `Intl.NumberFormat`, and kept together rather than spread across the props so that `style`
    // stays the element's own
    format?: Intl.NumberFormatOptions;
    // The locale to write it under, for the odd reading that has to be written in one other than
    // the one it is being read under. Left out, it follows the LocaleProvider above it
    locale?: string;
    className?: string;
};

export type FormatNumberProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    FormatNumberOwnProps
>;
