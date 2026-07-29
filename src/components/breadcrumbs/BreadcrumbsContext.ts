import { createContext } from "react";
import type { BreadcrumbsVariant } from "./Breadcrumbs.types";

export type BreadcrumbsContextValue = {
    variant?: BreadcrumbsVariant;
};

export const BreadcrumbsContext = createContext<BreadcrumbsContextValue>({});
