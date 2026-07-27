import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type AccordionHeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

// The native `onChange` is dropped so it cannot intersect with the accordion's own, which
// reports what is open rather than a single event
export type AccordionProps<As extends React.ElementType = "div"> = Omit<
    PolymorphicProps<
        As,
        "div",
        {
            // Which items are open, where the caller keeps hold of the state
            value?: string[];
            // Which items start out open, where the accordion keeps hold of the state itself
            defaultValue?: string[];
            // Whether more than one item can stand open at once
            multiple?: boolean;
            // Stops every item being opened or closed
            disabled?: boolean;
            // What each header is as a heading, so that the accordion sits at the right depth
            // in the document outline
            headingLevel?: AccordionHeadingLevel;
            className?: string;
        }
    >,
    "onChange"
> & {
    // Called with every item that is open whenever any of them opens or closes
    onChange?: (value: string[]) => void;
};

export type AccordionItemProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // Names the item to the accordion around it. One is worked out where it is left out,
        // which is enough for an accordion nobody is holding the state of
        value?: string;
        disabled?: boolean;
        className?: string;
    }
>;

// The props land on the button rather than the heading around it, since the button is what
// they describe
export type AccordionHeaderProps = React.ComponentPropsWithoutRef<"button"> & {
    // The heading this one button sits in, which takes the place of the accordion's own level
    headingLevel?: AccordionHeadingLevel;
    className?: string;
};

export type AccordionPanelProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type AccordionContextValue = {
    open?: string[];
    toggle?: (value: string) => void;
    disabled?: boolean;
    headingLevel?: AccordionHeadingLevel;
};

export type AccordionItemContextValue = {
    headerId?: string;
    panelId?: string;
    isOpen?: boolean;
    disabled?: boolean;
    toggle?: () => void;
};
