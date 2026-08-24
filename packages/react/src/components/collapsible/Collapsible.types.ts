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

export type CollapsiblePanelProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // Whether the panel stays on the page while it is closed. It does by default, so that
        // the trigger always has something to point at; a panel that is expensive to draw can
        // be taken off instead, and the trigger stops pointing at it while it is gone
        keepMounted?: boolean;
        // Lets the browser's own find-in-page reach the closed panel: what it finds opens the
        // disclosure rather than being passed over. The panel has to be on the page to be
        // found in, so this keeps it there whatever `keepMounted` says
        hiddenUntilFound?: boolean;
        className?: string;
    }
>;

// What the panel's props were called before the part was named for what the rest of the library
// calls the same thing
export type CollapsibleContentProps<As extends React.ElementType = "div"> =
    CollapsiblePanelProps<As>;

export type CollapsibleContextValue = {
    triggerId?: string;
    panelId?: string;
    isOpen?: boolean;
    disabled?: boolean;
    // Whether the panel is on the page at all. The panel is the one that decides, since it is
    // the one holding `keepMounted`, and the trigger reads it so that it never points at
    // something that is not there
    isPanelPresent?: boolean;
    setPanelPresent?: (isPresent: boolean) => void;
    // Asks for the disclosure to be opened or closed. A disabled one answers neither
    setOpen?: (open: boolean) => void;
    toggle?: () => void;
};
