import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Where the chevron stands against the label. A trigger that says it is open some other way
// takes "none" and draws no chevron at all
export type CollapsibleIndicatorPosition = "start" | "end" | "none";

// The native `onChange` is dropped so it cannot intersect with the disclosure's own, which
// reports whether it is open rather than a single event
export type CollapsibleProps<As extends React.ElementType = "div"> = Omit<
    PolymorphicProps<
        As,
        "div",
        {
            // Whether the disclosure is open, where the caller keeps hold of the state
            open?: boolean;
            // Whether it starts out open, where the disclosure keeps hold of the state itself
            defaultOpen?: boolean;
            // Stops it being opened or closed
            disabled?: boolean;
            className?: string;
        }
    >,
    "onChange"
> & {
    // Called with whether the disclosure is open whenever it opens or closes
    onChange?: (open: boolean) => void;
};

export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
    indicator?: CollapsibleIndicatorPosition;
    className?: string;
};

export type CollapsibleContentProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type CollapsibleContextValue = {
    triggerId?: string;
    contentId?: string;
    isOpen?: boolean;
    disabled?: boolean;
    toggle?: () => void;
};
