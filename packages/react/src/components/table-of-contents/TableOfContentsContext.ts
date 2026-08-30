import { createContext, useContext } from "react";
import type { TableOfContentsContextValue, TableOfContentsItemData } from "./TableOfContents.types";

export const TableOfContentsContext = createContext<TableOfContentsContextValue>({});

// What the contents around a part are following, for a nav of the caller's own standing among
// the parts: which headings are on screen, and the ways of going to one. A part standing on its
// own has no contents to read, and reaches for useTableOfContents
export const useTableOfContentsContext = () => useContext(TableOfContentsContext);

// Which heading the line a part stands in is for. It is handed down rather than asked for again,
// so a link and the item around it cannot come to point at different headings
export const TableOfContentsItemContext = createContext<TableOfContentsItemData | null>(null);

export const useTableOfContentsItemContext = () => useContext(TableOfContentsItemContext);
