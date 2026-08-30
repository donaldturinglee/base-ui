import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// A heading in the document, named by the id it carries and by how deep it sits: 2 for an h2,
// 3 for an h3, and so on. The list is stepped in by the depth, so the contents read as the same
// shape as the document they are drawn from
export type TableOfContentsItemData = {
    // The id of the heading in the document, which is also what the link points at
    value: string;
    // The heading level, counted the way the tags are
    depth: number;
};

// Where the reader has got to. More than one heading can be on screen at once, so this is a list
// rather than a single one, in the order the document puts them in
export type TableOfContentsActiveChangeDetails = {
    activeIds: string[];
    activeItems: TableOfContentsItemData[];
};

export type TableOfContentsScrollToDetails = {
    // Overrides the behaviour the contents were given, for a jump that should be made
    // differently from the rest
    behavior?: ScrollBehavior;
};

// What a line in the list is, as far as it is drawn: whether the heading it stands for is on
// screen, whether it is the first or the last of the ones that are, and how deep it sits
export type TableOfContentsItemState = {
    active: boolean;
    first: boolean;
    last: boolean;
    depth: number;
};

// Which headings the document is watched for and how closely, and how the page moves when a
// line is followed. The contents and the hook behind them are set up the same way, so a nav
// built out of the parts and one drawn by hand watch the same document
type TableOfContentsStoreProps = {
    // The headings the contents are drawn from, in the order the document puts them in
    items?: TableOfContentsItemData[];
    // The headings held as being on screen. A caller holding these is the one that says where
    // the reader is; one that is not leaves the contents to work it out
    activeIds?: string[];
    // The headings on screen before the document has been watched, for contents that should
    // not start blank
    defaultActiveIds?: string[];
    // How much of the scrolled area counts as being read, given the way a margin is written for
    // an IntersectionObserver. The default holds the band near the top of the page, since a
    // heading a reader has just scrolled past is still the one they are under
    rootMargin?: string;
    // How much of a heading has to be within that band before it counts. Nought means a single
    // pixel of it is enough
    threshold?: number | number[];
    // The element the document is scrolled in. Where the contents carry a Content part this is
    // taken from it, and where the whole window scrolls there is none to take
    scrollElement?: HTMLElement | null;
    // How the page moves when a line is followed, and how the list moves to keep up
    scrollBehavior?: ScrollBehavior;
};

type TableOfContentsCallbacks = {
    // Called whenever the headings on screen change, with the ones that now are
    onActiveChange?: (details: TableOfContentsActiveChangeDetails) => void;
};

export type UseTableOfContentsProps = TableOfContentsStoreProps & TableOfContentsCallbacks;

export type UseTableOfContentsReturn = {
    // The headings the contents were given, handed back so a caller reading the state has the
    // list beside it
    items: TableOfContentsItemData[];
    // The ids of the headings on screen, in the order the document puts them in
    activeIds: string[];
    // The same headings, as the items they were given as
    activeItems: TableOfContentsItemData[];
    // Says where the reader is, for a caller moving the page some other way than by the links
    setActiveIds: (activeIds: string[]) => void;
    // Brings a heading to the top of whatever is scrolled. Answers whether there was a heading
    // to go to, so a link that could not be followed is left to the browser
    scrollTo: (value: string, details?: TableOfContentsScrollToDetails) => boolean;
    // What a line stands as, for a list a caller is drawing themselves
    getItemState: (item: TableOfContentsItemData) => TableOfContentsItemState;
};

// The names the parts find one another by. They are worked out once at the root and read from
// there, so a part never has to be told which contents it belongs to
export type TableOfContentsIds = {
    root: string;
    title: string;
    list: string;
    indicator: string;
    item: (value: string) => string;
    link: (value: string) => string;
};

export type TableOfContentsContextValue = Partial<UseTableOfContentsReturn> & {
    ids?: TableOfContentsIds;
    // The element the document is scrolled in, so a link knows whether there is anything to
    // scroll other than the window
    scrollElement?: HTMLElement | null;
    // Handed to the content, which is the part that knows what it came out as
    setScrollElement?: (element: HTMLElement | null) => void;
    // Whether a title has been drawn. The nav is named by the title, so it has to be told there
    // is one to name it by before it points at it
    hasTitle?: boolean;
    setHasTitle?: (hasTitle: boolean) => void;
};

type TableOfContentsOwnProps = TableOfContentsStoreProps & {
    // Keeps the line the reader is under in view as the document moves under them, for a list
    // long enough to be scrolled in its own right
    autoScroll?: boolean;
    className?: string;
};

export type TableOfContentsProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    TableOfContentsOwnProps
> &
    TableOfContentsCallbacks;

// The same props at the element the contents render by default, for reading inside the component
export type TableOfContentsElementProps = TableOfContentsProps<"div">;

// The document the contents are drawn from. It is a part rather than something the caller keeps
// aside, since what the document is scrolled in is what the headings are watched against
export type TableOfContentsContentProps<As extends React.ElementType = "article"> =
    PolymorphicProps<
        As,
        "article",
        {
            className?: string;
        }
    >;

export type TableOfContentsNavProps<As extends React.ElementType = "nav"> = PolymorphicProps<
    As,
    "nav",
    {
        // Which side of the document the nav stands on. The parts are laid out in the order they
        // are written unless this says otherwise
        placement?: "start" | "end";
        className?: string;
    }
>;

// What names the nav. A heading rather than a label, since it stands over the list the way any
// other heading stands over what follows it
export type TableOfContentsTitleProps<As extends React.ElementType = "h2"> = PolymorphicProps<
    As,
    "h2",
    {
        className?: string;
    }
>;

export type TableOfContentsListProps<As extends React.ElementType = "ul"> = PolymorphicProps<
    As,
    "ul",
    {
        className?: string;
    }
>;

export type TableOfContentsItemProps<As extends React.ElementType = "li"> = PolymorphicProps<
    As,
    "li",
    {
        // The heading this line stands for
        item: TableOfContentsItemData;
        className?: string;
    }
>;

// The line itself. It takes the heading it points at from the item around it rather than being
// handed it again, so the two cannot come apart
export type TableOfContentsLinkProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    {
        className?: string;
    }
>;

// What is drawn against the part of the list the reader is in. It is measured rather than told
// where to stand, so it covers a run of headings as readily as it covers one
export type TableOfContentsIndicatorProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

// Where the indicator stands, worked out against the list rather than against the window, so
// that scrolling the list does not drag it off the lines it is drawn against
export type TableOfContentsRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
