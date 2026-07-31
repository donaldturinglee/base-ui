import PageFooterBase from "./PageFooter";
import PageFooterActions from "./PageFooterActions";
import PageFooterCopyright from "./PageFooterCopyright";
import PageFooterDescription from "./PageFooterDescription";
import PageFooterLeadingVisual from "./PageFooterLeadingVisual";
import PageFooterNavigation from "./PageFooterNavigation";

export const PageFooter = Object.assign(PageFooterBase, {
    Navigation: PageFooterNavigation,
    LeadingVisual: PageFooterLeadingVisual,
    Copyright: PageFooterCopyright,
    Actions: PageFooterActions,
    Description: PageFooterDescription,
});

export {
    PageFooterNavigation,
    PageFooterLeadingVisual,
    PageFooterCopyright,
    PageFooterActions,
    PageFooterDescription,
};
export * from "./PageFooter.types";
