import BreadcrumbsBase from "./Breadcrumbs";
import BreadcrumbsItem from "./BreadcrumbsItem";

export const Breadcrumbs = Object.assign(BreadcrumbsBase, {
    Item: BreadcrumbsItem,
});

export { BreadcrumbsItem };
export { BreadcrumbsContext } from "./BreadcrumbsContext";
export * from "./Breadcrumbs.types";
