import PageSidebarBase from "./PageSidebar";
import PageSidebarActions from "./PageSidebarActions";
import PageSidebarContent from "./PageSidebarContent";
import PageSidebarFooter from "./PageSidebarFooter";
import PageSidebarHeader from "./PageSidebarHeader";
import PageSidebarNavigation from "./PageSidebarNavigation";
import PageSidebarSection from "./PageSidebarSection";
import PageSidebarTitle from "./PageSidebarTitle";

export const PageSidebar = Object.assign(PageSidebarBase, {
    Header: PageSidebarHeader,
    Title: PageSidebarTitle,
    Actions: PageSidebarActions,
    Content: PageSidebarContent,
    Navigation: PageSidebarNavigation,
    Section: PageSidebarSection,
    Footer: PageSidebarFooter,
});

export {
    PageSidebarHeader,
    PageSidebarTitle,
    PageSidebarActions,
    PageSidebarContent,
    PageSidebarNavigation,
    PageSidebarSection,
    PageSidebarFooter,
};
export * from "./PageSidebar.types";
