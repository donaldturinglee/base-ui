import { createContext } from "react";
import type { PageLayoutContextValue } from "./PageLayout.types";

const nothing = { current: null };

export const PageLayoutContext = createContext<PageLayoutContextValue>({
    padding: "normal",
    rowGap: "normal",
    columnGap: "normal",
    paneRef: nothing,
    contentWrapperRef: nothing,
    sidebarRef: nothing,
    sidebarContentWrapperRef: nothing,
});
