import type * as React from "react";
import type { FormatBytesOptions } from "../../utilities/i18n";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type { FormatBytesOptions };

type FormatByteOwnProps = {
    // The size to write out, in bytes
    value: number;
    // The shape it is written in: which unit it is counted in, whether a kilobyte is a thousand
    // bytes or 1024 of them, and how far the unit is spelled out
    format?: FormatBytesOptions;
    // The locale to write it under, for the odd reading that has to be written in one other than
    // the one it is being read under. Left out, it follows the LocaleProvider above it
    locale?: string;
    className?: string;
};

export type FormatByteProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    FormatByteOwnProps
>;
