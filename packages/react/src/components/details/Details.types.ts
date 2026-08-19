import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// The native `onChange` is dropped so it cannot intersect with the disclosure's own, which
// reports whether it is open rather than a single event
export type DetailsProps = Omit<
    React.ComponentPropsWithoutRef<"details"> & {
        // Whether the disclosure starts out open, where it keeps hold of the state itself.
        // The native `open` prop takes its place where the caller holds the state instead
        defaultOpen?: boolean;
        // Closes the disclosure again where a click lands anywhere outside of it
        closeOnOutsideClick?: boolean;
        className?: string;
    },
    "onChange"
> & {
    // Called with whether the disclosure is open whenever it opens or closes
    onChange?: (open: boolean) => void;
};

export type DetailsSummaryProps<As extends React.ElementType = "summary"> = PolymorphicProps<
    As,
    "summary",
    {
        className?: string;
    }
>;
