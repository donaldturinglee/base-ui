import PageLayoutBase from "./PageLayout";
import PageLayoutContent from "./PageLayoutContent";
import PageLayoutFooter from "./PageLayoutFooter";
import PageLayoutHeader from "./PageLayoutHeader";
import PageLayoutPane from "./PageLayoutPane";
import PageLayoutSidebar from "./PageLayoutSidebar";

export const PageLayout = Object.assign(PageLayoutBase, {
    Header: PageLayoutHeader,
    Content: PageLayoutContent,
    Pane: PageLayoutPane,
    Sidebar: PageLayoutSidebar,
    Footer: PageLayoutFooter,
});

export { PageLayoutHeader, PageLayoutContent, PageLayoutPane, PageLayoutSidebar, PageLayoutFooter };
export { default as DragHandle } from "./DragHandle";
export { PageLayoutContext } from "./PageLayoutContext";
export { usePaneWidth } from "./usePaneWidth";
export { ARROW_KEY_STEP, defaultPaneWidth, updateAriaValues } from "./paneUtils";
export * from "./PageLayout.types";
