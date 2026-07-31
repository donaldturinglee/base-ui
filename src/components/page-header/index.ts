import PageHeaderBase from "./PageHeader";
import PageHeaderActions from "./PageHeaderActions";
import PageHeaderBreadcrumbs from "./PageHeaderBreadcrumbs";
import PageHeaderContextArea from "./PageHeaderContextArea";
import PageHeaderContextAreaActions from "./PageHeaderContextAreaActions";
import PageHeaderContextBar from "./PageHeaderContextBar";
import PageHeaderDescription from "./PageHeaderDescription";
import PageHeaderLeadingAction from "./PageHeaderLeadingAction";
import PageHeaderLeadingVisual from "./PageHeaderLeadingVisual";
import PageHeaderNavigation from "./PageHeaderNavigation";
import PageHeaderParentLink from "./PageHeaderParentLink";
import PageHeaderTitle from "./PageHeaderTitle";
import PageHeaderTitleArea from "./PageHeaderTitleArea";
import PageHeaderTrailingAction from "./PageHeaderTrailingAction";
import PageHeaderTrailingVisual from "./PageHeaderTrailingVisual";

export const PageHeader = Object.assign(PageHeaderBase, {
    ContextArea: PageHeaderContextArea,
    ParentLink: PageHeaderParentLink,
    ContextBar: PageHeaderContextBar,
    ContextAreaActions: PageHeaderContextAreaActions,
    TitleArea: PageHeaderTitleArea,
    LeadingAction: PageHeaderLeadingAction,
    Breadcrumbs: PageHeaderBreadcrumbs,
    LeadingVisual: PageHeaderLeadingVisual,
    Title: PageHeaderTitle,
    TrailingVisual: PageHeaderTrailingVisual,
    TrailingAction: PageHeaderTrailingAction,
    Actions: PageHeaderActions,
    Description: PageHeaderDescription,
    Navigation: PageHeaderNavigation,
});

export {
    PageHeaderContextArea,
    PageHeaderParentLink,
    PageHeaderContextBar,
    PageHeaderContextAreaActions,
    PageHeaderTitleArea,
    PageHeaderLeadingAction,
    PageHeaderBreadcrumbs,
    PageHeaderLeadingVisual,
    PageHeaderTitle,
    PageHeaderTrailingVisual,
    PageHeaderTrailingAction,
    PageHeaderActions,
    PageHeaderDescription,
    PageHeaderNavigation,
};
export * from "./PageHeader.types";
