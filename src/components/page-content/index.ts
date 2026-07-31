import PageContentBase from "./PageContent";
import PageContentSection from "./PageContentSection";

export const PageContent = Object.assign(PageContentBase, {
    Section: PageContentSection,
});

export { PageContentSection };
export * from "./PageContent.types";
