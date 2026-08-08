import PageContainerBase from "./PageContainer";
import PageContainerRegion from "./PageContainerRegion";

export const PageContainer = Object.assign(PageContainerBase, {
    Region: PageContainerRegion,
});

export { PageContainerRegion };
export * from "./PageContainer.types";
