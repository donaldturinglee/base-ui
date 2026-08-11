import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type TableOfContentsProps = React.ComponentPropsWithoutRef<"nav"> & {
    className?: string;
};

export type TableOfContentsTitleProps<As extends React.ElementType = "p"> = PolymorphicProps<
    As,
    "p",
    {
        className?: string;
    }
>;

// `role` is dropped because the list has to keep saying it is one: Safari takes the semantics
// away from a list with no markers
export type TableOfContentsListProps = Omit<React.ComponentPropsWithoutRef<"ul">, "role"> & {
    className?: string;
};

export type TableOfContentsItemProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    {
        // Marks the item standing for the section being read. Only one item in the list is the
        // one the reader is in, so only one of them is drawn against the rail
        active?: boolean;
        className?: string;
    }
>;

// `onClick` is retyped for the label rather than for the row, since the label is the only part
// of a group that is somewhere to go and the only part the handler is put on
export type TableOfContentsGroupProps = Omit<React.ComponentPropsWithoutRef<"li">, "onClick"> & {
    // Names the run of sections held under it
    label: string;
    // Where the label itself leads. A group whose label stands for a section of its own is
    // somewhere to go; one that only names what is under it is words rather than a link
    href?: string;
    // Marks the label as the section being read. It says nothing without an `href`, since a
    // label that leads nowhere is not somewhere the reader can be
    active?: boolean;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
    className?: string;
};

export type UseTableOfContentsActiveIdOptions = {
    // The ids of the sections to follow, in the order they stand on the page. They are looked
    // for in the document as it is, so an id that has not been drawn yet is passed over until
    // it arrives
    ids: string[];
    // How far below the top of the viewport, or of `root`, the line is that a section has to
    // reach to count as the one being read. It is usually the height of a fixed header, so a
    // section hidden behind one is not called the section in view
    offset?: number;
    // What the sections are scrolled within. Left out, it is the viewport
    root?: Element | null;
    // Takes the section named by the address the page was opened at, and again whenever that
    // name changes, so a link into the middle of a page marks the section it lands on
    trackHash?: boolean;
};

export type UseTableOfContentsActiveIdResult = {
    // The section being read, or nothing where none of them has been reached
    activeId: string | null;
    // Marks a section as the one being read because the reader asked for it, which is what an
    // item's own press drives. Following the scroll is held off until the page has settled, so
    // that a section too short to reach the line still stays marked once it is jumped to
    selectSection: (id: string) => void;
};
