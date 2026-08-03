import * as React from "react";
import { ChevronLeftRegular, ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { buildPaginationModel, buildPaginationPageData } from "./paginationModel";
import type { PaginationPage, PaginationPageProps, PaginationProps } from "./Pagination.types";

const ranges = ["narrow", "regular", "wide"] as const;

type Range = (typeof ranges)[number];

const classes = {
    root: "pagination",
    steps: "pagination-steps",
    hidden: {
        narrow: "pagination-hidden-narrow",
        regular: "pagination-hidden-regular",
        wide: "pagination-hidden-wide",
    } satisfies Record<Range, string>,
};

const paginationPageVariants = cva("pagination-step", {
    variants: {
        step: {
            previous: "pagination-step-previous",
            next: "pagination-step-next",
        },
        current: {
            true: "pagination-step-current",
            false: "",
        },
        inert: {
            true: "pagination-step-inert",
            false: "",
        },
    },
});

// Which viewports the page numbers are hidden at, given the `showPages` prop
const getHiddenRanges = (showPages: boolean | Partial<Record<Range, boolean>>): Range[] => {
    if (typeof showPages === "object") {
        return ranges.filter((range) => showPages[range] === false);
    }

    return showPages ? [] : [...ranges];
};

const PageLabel = ({ page, children }: { page: PaginationPage; children: React.ReactNode }) => (
    <>
        {page.type === "previous" ? (
            <ChevronLeftRegular data-component="Pagination.PreviousPageIcon" />
        ) : null}
        {children}
        {page.type === "next" ? (
            <ChevronRightRegular data-component="Pagination.NextPageIcon" />
        ) : null}
    </>
);

const defaultHrefBuilder = (page: number) => `#${page}`;

function Pagination<As extends React.ElementType = "nav">(
    props: PaginationProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "nav",
        className,
        pageCount,
        currentPage,
        onPageChange,
        hrefBuilder = defaultHrefBuilder,
        marginPageCount = 1,
        surroundingPageCount = 2,
        showPages = true,
        renderPage,
        ...rest
        // `pageCount` and `currentPage` are required, so the resolved props do not overlap
        // with the generic ones
    } = props as unknown as PaginationProps<"nav">;

    const model = React.useMemo(
        () =>
            buildPaginationModel(
                pageCount,
                currentPage,
                Boolean(showPages),
                marginPageCount,
                surroundingPageCount,
            ),
        [pageCount, currentPage, showPages, marginPageCount, surroundingPageCount],
    );

    const hiddenRanges = getHiddenRanges(showPages);

    const pages = model.map((page) => {
        const {
            key,
            content,
            presentational,
            props: pageProps,
        } = buildPaginationPageData(page, hrefBuilder, (event) => onPageChange?.(event, page.num));

        const isStep = page.type === "previous" || page.type === "next";
        const isInert = Boolean(presentational) || Boolean(pageProps["aria-hidden"]);

        const pageClassName = classNames(
            paginationPageVariants({
                step: isStep ? (page.type as "previous" | "next") : undefined,
                current: page.selected,
                inert: isInert,
            }),
        );

        // A break leads nowhere, so it never becomes a consumer's link
        if (renderPage && !presentational) {
            return renderPage({
                key,
                children: <PageLabel page={page}>{content}</PageLabel>,
                number: page.num,
                className: pageClassName,
                "data-component": "Pagination.Page",
                ...pageProps,
            } satisfies PaginationPageProps);
        }

        const PageComponent = presentational ? "span" : "a";
        const dataComponent = isStep
            ? page.type === "previous"
                ? "Pagination.PreviousPage"
                : "Pagination.NextPage"
            : "Pagination.Page";

        return (
            <PageComponent
                key={key}
                role={presentational ? "presentation" : undefined}
                className={pageClassName}
                data-component={dataComponent}
                {...pageProps}
            >
                <PageLabel page={page}>{content}</PageLabel>
            </PageComponent>
        );
    });

    return (
        <Component
            ref={ref}
            aria-label="Pagination"
            className={classNames(classes.root, className)}
            data-component="Pagination"
            {...rest}
        >
            <div
                className={classNames(
                    classes.steps,
                    hiddenRanges.map((range) => classes.hidden[range]),
                )}
                data-hidden-viewport-ranges={hiddenRanges.join(" ") || undefined}
            >
                {pages}
            </div>
        </Component>
    );
}

Pagination.displayName = "Pagination";

export default fixedForwardRef(Pagination);
