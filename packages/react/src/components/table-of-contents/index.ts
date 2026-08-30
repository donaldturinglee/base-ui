import TableOfContentsBase from "./TableOfContents";
import TableOfContentsContent from "./TableOfContentsContent";
import TableOfContentsIndicator from "./TableOfContentsIndicator";
import TableOfContentsItem from "./TableOfContentsItem";
import TableOfContentsLink from "./TableOfContentsLink";
import TableOfContentsList from "./TableOfContentsList";
import TableOfContentsNav from "./TableOfContentsNav";
import TableOfContentsTitle from "./TableOfContentsTitle";

export const TableOfContents = Object.assign(TableOfContentsBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and a table of contents written out in full is written the way it is read
    Root: TableOfContentsBase,
    Content: TableOfContentsContent,
    Nav: TableOfContentsNav,
    Title: TableOfContentsTitle,
    List: TableOfContentsList,
    Item: TableOfContentsItem,
    Link: TableOfContentsLink,
    Indicator: TableOfContentsIndicator,
});

export {
    TableOfContentsContent,
    TableOfContentsNav,
    TableOfContentsTitle,
    TableOfContentsList,
    TableOfContentsItem,
    TableOfContentsLink,
    TableOfContentsIndicator,
};
export {
    TableOfContentsContext,
    useTableOfContentsContext,
    TableOfContentsItemContext,
    useTableOfContentsItemContext,
} from "./TableOfContentsContext";
export { useTableOfContents, DEFAULT_TABLE_OF_CONTENTS_ROOT_MARGIN } from "./useTableOfContents";
export { scrollToHeading } from "./headingScroll";
export * from "./TableOfContents.types";
