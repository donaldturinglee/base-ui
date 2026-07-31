import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type EmptyStateSize = "small" | "medium";

// A visual is given either as the component to render, or as something already built
export type EmptyStateVisual = React.ElementType | React.ReactNode;

// `title` means something else on a plain element, so the element's own version is dropped in
// favour of the empty state's
export type EmptyStateProps<As extends React.ElementType = "div"> = Omit<
    PolymorphicProps<As, "div">,
    "title"
> & {
    // Says what is not there. A box holding nothing and saying nothing is only an empty box
    title: React.ReactNode;
    // Says why it is not there, or what to do about it
    description?: React.ReactNode;
    // Stands above the title, and says nothing the title has not, so it is left out of the
    // accessibility tree
    icon?: EmptyStateVisual;
    size?: EmptyStateSize;
    // What can be done about it, standing at the foot of the message
    actions?: React.ReactNode;
    className?: string;
};
