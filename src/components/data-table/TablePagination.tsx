import * as React from "react";
import { ChevronLeftRegular, ChevronRightRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { buildPaginationModel } from "../pagination/paginationModel";
import type { TablePaginationProps, TablePaginationState } from "./DataTable.types";

const ranges = ["narrow", "regular", "wide"] as const;

type Range = (typeof ranges)[number];

export const DEFAULT_TABLE_PAGE_SIZE = 25;

// A narrow viewport has room for the two steps and little else, so the page numbers go
export const DEFAULT_TABLE_SHOW_PAGES = { narrow: false };

// Which viewports the page numbers are hidden at, given the `showPages` prop
const getHiddenRanges = (showPages: boolean | Partial<Record<Range, boolean>>): Range[] => {
    if (typeof showPages === "object") {
        return ranges.filter((range) => showPages[range] === false);
    }

    return showPages ? [] : [...ranges];
};

const classes = {
    root: "flex items-center justify-between gap-x-[var(--base-size-16)] w-full p-[var(--base-size-8)_var(--base-size-16)] border-solid border-[length:var(--border-width-thin)] border-t-0 border-border-default rounded-es-[var(--border-radius-medium)] rounded-ee-[var(--border-radius-medium)] [grid-area:footer]",
    range: "m-0 [font-size:var(--text-body-size-small)] text-foreground-muted",
    steps: "flex flex-wrap items-center list-none m-0 p-0 [font-size:var(--text-body-size-medium)] text-foreground-default",
    // The two ends stand away from the page numbers between them
    step: "first-of-type:me-[var(--base-size-16)] last-of-type:ms-[var(--base-size-16)]",
    button: "bg-transparent border-0 appearance-none select-none [font-family:inherit] [font-size:var(--text-body-size-medium)] [line-height:calc(20/14)] rounded-[var(--border-radius-medium)]",
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]",
    truncation:
        "flex items-center justify-center min-w-[var(--base-size-32)] min-h-[var(--base-size-32)] select-none",
    icon: "size-[var(--base-size-16)]",
    // Only the two steps survive once the page numbers are hidden, so the margin between
    // them comes off too
    hiddenRange: {
        narrow: "max-medium:[&>*:not(:first-child):not(:last-child)]:hidden max-medium:[&>*:first-child]:me-0 max-medium:[&>*:last-child]:ms-0",
        regular:
            "medium:max-xxlarge:[&>*:not(:first-child):not(:last-child)]:hidden medium:max-xxlarge:[&>*:first-child]:me-0 medium:max-xxlarge:[&>*:last-child]:ms-0",
        wide: "xxlarge:[&>*:not(:first-child):not(:last-child)]:hidden xxlarge:[&>*:first-child]:me-0 xxlarge:[&>*:last-child]:ms-0",
    } satisfies Record<Range, string>,
    hidden: "sr-only",
};

const tablePaginationActionVariants = cva(
    [
        classes.button,
        classes.focus,
        "flex items-center gap-x-[var(--base-size-4)] p-[var(--base-size-8)] text-foreground-muted",
    ],
    {
        variants: {
            // A step with nowhere to go reads as text rather than as something to press
            enabled: {
                true: "cursor-pointer text-foreground-accent hover:bg-[var(--control-transparent-background-color-hover)] focus:bg-[var(--control-transparent-background-color-hover)]",
                false: "",
            },
        },
    },
);

const tablePaginationPageVariants = cva(
    [
        classes.button,
        classes.focus,
        "flex items-center justify-center min-w-[var(--base-size-32)] min-h-[var(--base-size-32)] py-[var(--base-size-8)] px-[calc((var(--base-size-32)_-_var(--base-size-20))/2)] cursor-pointer [color:inherit] hover:bg-[var(--control-transparent-background-color-hover)] focus:bg-[var(--control-transparent-background-color-hover)]",
    ],
    {
        variants: {
            // The ring is drawn inside the fill, so it still reads against it
            active: {
                true: "bg-background-accent-emphasis text-foreground-on-emphasis hover:bg-background-accent-emphasis focus:bg-background-accent-emphasis focus-visible:[box-shadow:inset_0_0_0_var(--border-width-thicker)_var(--foreground-color-on-emphasis)]",
                false: "",
            },
        },
    },
);

// Holds which page is showing, and works out what is on it
const usePagination = ({
    defaultPageIndex,
    onChange,
    pageSize,
    totalCount,
}: {
    defaultPageIndex?: number;
    onChange?: (state: TablePaginationState) => void;
    pageSize: number;
    totalCount: number;
}) => {
    const pageCount = Math.ceil(totalCount / pageSize);
    const isWithinRange = (index?: number): index is number =>
        index !== undefined && index >= 0 && index < pageCount;

    const [defaultIndex, setDefaultIndex] = React.useState(() =>
        isWithinRange(defaultPageIndex) ? defaultPageIndex : 0,
    );
    const [pageIndex, setPageIndex] = React.useState(defaultIndex);

    // A caller can move the table by handing it a different starting page
    if (isWithinRange(defaultPageIndex) && defaultIndex !== defaultPageIndex) {
        setDefaultIndex(defaultPageIndex);
        setPageIndex(defaultPageIndex);
        onChange?.({ pageIndex: defaultPageIndex });
    }

    const selectPage = (nextPageIndex: number) => {
        if (pageIndex !== nextPageIndex) {
            setPageIndex(nextPageIndex);
            onChange?.({ pageIndex: nextPageIndex });
        }
    };

    return {
        pageIndex,
        pageCount,
        pageStart: pageIndex * pageSize,
        pageEnd: Math.min((pageIndex + 1) * pageSize, totalCount),
        hasPreviousPage: pageIndex > 0,
        hasNextPage: pageIndex + 1 < pageCount,
        selectPage,
    };
};

const Step = ({ children }: React.PropsWithChildren) => (
    <li className={classes.step} data-component="Table.Pagination.Step">
        {children}
    </li>
);

function TablePagination(
    props: TablePaginationProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        totalCount,
        pageSize = DEFAULT_TABLE_PAGE_SIZE,
        defaultPageIndex,
        onChange,
        showPages = DEFAULT_TABLE_SHOW_PAGES,
        ...rest
    } = props;

    const { pageIndex, pageCount, pageStart, pageEnd, hasPreviousPage, hasNextPage, selectPage } =
        usePagination({ defaultPageIndex, onChange, pageSize, totalCount });

    const model = React.useMemo(
        () => buildPaginationModel(pageCount, pageIndex + 1, Boolean(showPages), 1, 2),
        [pageCount, pageIndex, showPages],
    );

    const hiddenRanges = getHiddenRanges(showPages);
    const start = pageStart + 1;

    return (
        <nav
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Table.Pagination"
            {...rest}
        >
            <span role="status" aria-live="polite" className={classes.hidden}>
                Showing {start} through {pageEnd} of {totalCount}
            </span>
            <p className={classes.range} data-component="Table.Pagination.Range">
                {start}
                <span className={classes.hidden}> through </span>
                <span aria-hidden="true">‒</span>
                {pageEnd} of {totalCount}
            </p>
            <ol
                className={classNames(
                    classes.steps,
                    hiddenRanges.map((range) => classes.hiddenRange[range]),
                )}
                data-hidden-viewport-ranges={hiddenRanges.join(" ") || undefined}
            >
                <Step>
                    <button
                        type="button"
                        className={classNames(
                            tablePaginationActionVariants({ enabled: hasPreviousPage }),
                        )}
                        data-has-page={hasPreviousPage || undefined}
                        aria-disabled={!hasPreviousPage || undefined}
                        onClick={() => {
                            if (hasPreviousPage) {
                                selectPage(pageIndex - 1);
                            }
                        }}
                        data-component="Table.Pagination.PreviousPageButton"
                    >
                        {hasPreviousPage ? <ChevronLeftRegular className={classes.icon} /> : null}
                        <span>Previous</span>
                        <span className={classes.hidden}>&nbsp;page</span>
                    </button>
                </Step>

                {model.map((page, index) =>
                    page.type === "break" ? (
                        <li
                            key={`break-${index}`}
                            aria-hidden="true"
                            className={classes.truncation}
                            data-component="Table.Pagination.TruncationStep"
                        >
                            …
                        </li>
                    ) : page.type === "number" ? (
                        <Step key={`page-${page.num}`}>
                            <button
                                type="button"
                                className={classNames(
                                    tablePaginationPageVariants({ active: page.selected }),
                                )}
                                data-active={page.selected || undefined}
                                aria-current={page.selected || undefined}
                                onClick={() => selectPage(page.num - 1)}
                                data-component="Table.Pagination.Page"
                            >
                                <span className={classes.hidden}>Page&nbsp;</span>
                                {page.num}
                                {page.precedesBreak ? (
                                    <span className={classes.hidden}>…</span>
                                ) : null}
                            </button>
                        </Step>
                    ) : null,
                )}

                <Step>
                    <button
                        type="button"
                        className={classNames(
                            tablePaginationActionVariants({ enabled: hasNextPage }),
                        )}
                        data-has-page={hasNextPage || undefined}
                        aria-disabled={!hasNextPage || undefined}
                        onClick={() => {
                            if (hasNextPage) {
                                selectPage(pageIndex + 1);
                            }
                        }}
                        data-component="Table.Pagination.NextPageButton"
                    >
                        <span>Next</span>
                        <span className={classes.hidden}>&nbsp;page</span>
                        {hasNextPage ? <ChevronRightRegular className={classes.icon} /> : null}
                    </button>
                </Step>
            </ol>
        </nav>
    );
}

TablePagination.displayName = "Table.Pagination";

export default fixedForwardRef(TablePagination);
