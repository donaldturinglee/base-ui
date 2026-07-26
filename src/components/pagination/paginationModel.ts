import type { PaginationPage, PaginationPageData } from "./Pagination.types";

// Works out which pages to show around the current one, and where the runs of hidden pages
// collapse into an ellipsis:
//
//   [prev, 1, …, 7, 8, 9, 10, 11, …, 15, next]
//
// `marginPageCount` is how many pages stay pinned at each end, `surroundingPageCount` how
// many sit either side of the current page.
export const buildPaginationModel = (
    pageCount: number,
    currentPage: number,
    showPages: boolean,
    marginPageCount: number,
    surroundingPageCount: number,
): PaginationPage[] => {
    const previous: PaginationPage = {
        type: "previous",
        num: currentPage - 1,
        disabled: currentPage === 1,
    };
    const next: PaginationPage = {
        type: "next",
        num: currentPage + 1,
        disabled: currentPage === pageCount,
    };

    if (!showPages) {
        return [previous, next];
    }

    if (pageCount <= 0) {
        return [previous, { ...next, disabled: true }];
    }

    const pages: PaginationPage[] = [];

    const addPages = (start: number, end: number, precedesBreak = false) => {
        for (let page = start; page <= end; page++) {
            pages.push({
                type: "number",
                num: page,
                selected: page === currentPage,
                precedesBreak: page === end && precedesBreak,
            });
        }
    };

    const addEllipsis = (previousPage: number) => {
        pages.push({ type: "break", num: previousPage + 1 });
    };

    // How far the pinned margin and the surrounding window reach from each end
    const standardGap = surroundingPageCount + marginPageCount;

    // The most pages that can ever show at once: both gaps, the current page, and the two
    // ellipses
    const maxVisiblePages = standardGap + standardGap + 3;

    // Everything fits, so there is nothing to collapse
    if (pageCount <= maxVisiblePages) {
        addPages(1, pageCount);
        return [previous, ...pages, next];
    }

    // `gap` is how many pages an ellipsis stands in for; `offset` compensates when the
    // margin and the surrounding window overlap and there is no room for one
    let startGap = 0;
    let startOffset = 0;

    if (currentPage - standardGap - 1 <= 1) {
        startOffset = currentPage - standardGap - 2;
    } else {
        startGap = currentPage - standardGap - 1;
    }

    let endGap = 0;
    let endOffset = 0;

    if (pageCount - currentPage - standardGap <= 1) {
        endOffset = pageCount - currentPage - standardGap - 1;
    } else {
        endGap = pageCount - currentPage - standardGap;
    }

    const hasStartEllipsis = startGap > 0;
    const hasEndEllipsis = endGap > 0;

    addPages(1, marginPageCount, hasStartEllipsis);

    if (hasStartEllipsis) {
        addEllipsis(marginPageCount);
    }

    addPages(
        marginPageCount + startGap + endOffset + 1,
        pageCount - startOffset - endGap - marginPageCount,
        hasEndEllipsis,
    );

    if (hasEndEllipsis) {
        addEllipsis(pageCount - startOffset - endGap - marginPageCount);
    }

    addPages(pageCount - marginPageCount + 1, pageCount);

    return [previous, ...pages, next];
};

// Turns a page from the model into the key, label and attributes its element needs
export const buildPaginationPageData = (
    page: PaginationPage,
    hrefBuilder: (page: number) => string,
    onClick: (event: React.MouseEvent) => void,
): PaginationPageData => {
    if (page.type === "break") {
        return {
            key: `page-${page.num}-break`,
            content: "…",
            presentational: true,
            props: {},
        };
    }

    if (page.type === "number") {
        return {
            key: `page-${page.num}`,
            content: String(page.num),
            props: {
                href: hrefBuilder(page.num),
                // The trailing ellipsis makes a screen reader change tone, which reads
                // better than silently skipping a run of numbers
                "aria-label": `Page ${page.num}${page.precedesBreak ? "..." : ""}`,
                "aria-current": page.selected ? "page" : undefined,
                onClick,
            },
        };
    }

    const rel = page.type === "previous" ? "prev" : "next";
    const content = page.type === "previous" ? "Previous" : "Next";
    const key = `page-${rel}`;

    if (page.disabled) {
        return { key, content, props: { rel, "aria-hidden": true, "aria-disabled": true } };
    }

    return {
        key,
        content,
        props: { rel, href: hrefBuilder(page.num), "aria-label": `${content} Page`, onClick },
    };
};
