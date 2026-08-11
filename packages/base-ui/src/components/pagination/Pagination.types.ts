import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type PaginationPageType = "previous" | "next" | "number" | "break";

export type PaginationPage = {
    type: PaginationPageType;
    num: number;
    disabled?: boolean;
    selected?: boolean;
    // Marks the last page before an ellipsis, so its label can say the run continues
    precedesBreak?: boolean;
};

export type PaginationPageData = {
    key: string;
    content: string;
    // A break stands in for a run of pages rather than leading anywhere, so it is not a link
    presentational?: boolean;
    props: {
        href?: string;
        rel?: string;
        "aria-label"?: string;
        "aria-current"?: "page";
        "aria-hidden"?: boolean;
        "aria-disabled"?: boolean;
        onClick?: (event: React.MouseEvent) => void;
    };
};

// What `renderPage` is handed for each page, so a router link can stand in for the anchor
export type PaginationPageProps = {
    key: string;
    children: React.ReactNode;
    number: number;
    className: string;
    "data-component": "Pagination.Page";
} & PaginationPageData["props"];

export type PaginationProps<As extends React.ElementType = "nav"> = PolymorphicProps<
    As,
    "nav",
    {
        pageCount: number;
        currentPage: number;
        onPageChange?: (event: React.MouseEvent, page: number) => void;
        hrefBuilder?: (page: number) => string;
        marginPageCount?: number;
        surroundingPageCount?: number;
        showPages?: boolean | ResponsiveValue<boolean>;
        renderPage?: (props: PaginationPageProps) => React.ReactNode;
        className?: string;
    }
>;
