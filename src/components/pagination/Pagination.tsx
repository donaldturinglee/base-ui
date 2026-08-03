import * as React from "react";
import { ChevronLeftRegular, ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { buildPaginationModel, buildPaginationPageData } from "./paginationModel";
import type { PaginationPage, PaginationPageProps, PaginationProps } from "./Pagination.types";

const ranges = ["narrow", "regular", "wide"] as const;

type Range = (typeof ranges)[number];

const classes = {
    root: "mt-[var(--base-size-20)] mb-[var(--base-size-16)] text-center",
    steps: "inline-block",
    page: "inline-flex items-center justify-center min-w-[var(--control-medium-size)] h-[var(--control-medium-size)] py-[var(--base-size-8)] px-[var(--base-size-6)] me-[var(--base-size-4)] last:me-0 rounded-[var(--border-radius-medium)] bg-transparent not-italic leading-none text-center no-underline whitespace-nowrap align-middle cursor-pointer select-none [color:var(--foreground-color-default)] transition-[background-color] duration-short ease-hover",
    pageHover:
        "hover:no-underline hover:outline-0 hover:bg-[var(--control-transparent-background-color-hover)] hover:duration-micro focus:no-underline focus:outline-0 focus:bg-[var(--control-transparent-background-color-hover)] focus:duration-micro",
    pageFocus:
        "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]",
    // The icons scale with the inherited font size rather than a fixed step
    step: {
        previous:
            "[color:var(--foreground-color-accent)] [&>svg]:size-[1em] [&>svg]:me-[var(--base-size-4)]",
        next: "[color:var(--foreground-color-accent)] [&>svg]:size-[1em] [&>svg]:ms-[var(--base-size-4)]",
    },
    // The hover and focus backgrounds are restated so the page a reader has just clicked
    // keeps its fill: a bare `bg-*` would lose to the `:hover` and `:focus` rules above it.
    // The ring is drawn inside the fill, so the focus outline still reads against it
    current:
        "[color:var(--foreground-color-on-emphasis)] bg-[var(--background-color-accent-emphasis)] hover:bg-[var(--background-color-accent-emphasis)] focus:bg-[var(--background-color-accent-emphasis)] focus-visible:[box-shadow:var(--box-shadow-thicker)_var(--foreground-color-on-emphasis)]",
    inert: "cursor-default [color:var(--foreground-color-disabled)] bg-transparent hover:bg-transparent focus:bg-transparent",
    // Only the previous and next steps survive once the page numbers are hidden, so the
    // margin between them comes off too
    hidden: {
        narrow: "max-medium:[&>*:not(:first-child):not(:last-child)]:hidden max-medium:[&>*:first-child]:me-0 max-medium:[&>*:last-child]:ms-0",
        regular:
            "medium:max-xxlarge:[&>*:not(:first-child):not(:last-child)]:hidden medium:max-xxlarge:[&>*:first-child]:me-0 medium:max-xxlarge:[&>*:last-child]:ms-0",
        wide: "xxlarge:[&>*:not(:first-child):not(:last-child)]:hidden xxlarge:[&>*:first-child]:me-0 xxlarge:[&>*:last-child]:ms-0",
    } satisfies Record<Range, string>,
};

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
            classes.page,
            classes.pageHover,
            classes.pageFocus,
            isStep && classes.step[page.type as "previous" | "next"],
            page.selected && classes.current,
            isInert && classes.inert,
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
