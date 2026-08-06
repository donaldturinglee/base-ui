import TableOfContentsBase from "./TableOfContents";
import TableOfContentsGroup from "./TableOfContentsGroup";
import TableOfContentsItem from "./TableOfContentsItem";
import TableOfContentsList from "./TableOfContentsList";
import TableOfContentsTitle from "./TableOfContentsTitle";

export const TableOfContents = Object.assign(TableOfContentsBase, {
    Title: TableOfContentsTitle,
    List: TableOfContentsList,
    Item: TableOfContentsItem,
    Group: TableOfContentsGroup,
});

export { TableOfContentsTitle, TableOfContentsList, TableOfContentsItem, TableOfContentsGroup };
export { useTableOfContentsActiveId } from "./useTableOfContentsActiveId";
export * from "./TableOfContents.types";
