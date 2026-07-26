import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Pagination, buildPaginationModel } from ".";

// The rendered sequence, as a reader would work through it
const sequence = () =>
    Array.from(
        screen.getByRole("navigation", { name: "Pagination" }).querySelectorAll("a, span"),
        (page) => page.textContent,
    );

describe("buildPaginationModel", () => {
    it("shows every page when they all fit", () => {
        const model = buildPaginationModel(5, 1, true, 1, 2);
        expect(model.map((page) => page.type)).toEqual([
            "previous",
            "number",
            "number",
            "number",
            "number",
            "number",
            "next",
        ]);
    });

    it("collapses a long run into an ellipsis", () => {
        const model = buildPaginationModel(10, 1, true, 1, 2);
        expect(model.map((page) => (page.type === "number" ? page.num : page.type))).toEqual([
            "previous",
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            "break",
            10,
            "next",
        ]);
    });

    it("marks the page before an ellipsis so its label can say so", () => {
        const model = buildPaginationModel(10, 1, true, 1, 2);
        expect(model.find((page) => page.num === 7)?.precedesBreak).toBe(true);
        expect(model.find((page) => page.num === 6)?.precedesBreak).toBe(false);
    });

    it("marks the current page as selected", () => {
        const model = buildPaginationModel(5, 3, true, 1, 2);
        expect(model.find((page) => page.selected)?.num).toBe(3);
    });

    it("widens the window with a higher surrounding page count", () => {
        const narrow = buildPaginationModel(30, 15, true, 1, 2);
        const wide = buildPaginationModel(30, 15, true, 1, 4);
        expect(wide.length).toBeGreaterThan(narrow.length);
    });

    it("pins more pages at each end with a higher margin page count", () => {
        const model = buildPaginationModel(30, 15, true, 3, 2);
        const numbers = model.filter((page) => page.type === "number").map((page) => page.num);
        expect(numbers.slice(0, 3)).toEqual([1, 2, 3]);
        expect(numbers.slice(-3)).toEqual([28, 29, 30]);
    });

    it("returns only the steps when the pages are hidden", () => {
        const model = buildPaginationModel(10, 5, false, 1, 2);
        expect(model.map((page) => page.type)).toEqual(["previous", "next"]);
    });

    it("disables the step it cannot reach", () => {
        const first = buildPaginationModel(5, 1, true, 1, 2);
        expect(first.at(0)?.disabled).toBe(true);
        expect(first.at(-1)?.disabled).toBe(false);

        const last = buildPaginationModel(5, 5, true, 1, 2);
        expect(last.at(0)?.disabled).toBe(false);
        expect(last.at(-1)?.disabled).toBe(true);
    });

    it("disables both steps when there are no pages", () => {
        const model = buildPaginationModel(0, 1, true, 1, 2);
        expect(model.map((page) => page.type)).toEqual(["previous", "next"]);
        expect(model.every((page) => page.disabled)).toBe(true);
    });
});

describe("Pagination", () => {
    it("renders a labelled navigation landmark", () => {
        render(<Pagination pageCount={5} currentPage={1} />);
        const nav = screen.getByRole("navigation", { name: "Pagination" });
        expect(nav.tagName).toBe("NAV");
        expect(nav).toHaveAttribute("data-component", "Pagination");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Pagination as="div" pageCount={5} currentPage={1} data-testid="pagination" />);
        expect(screen.getByTestId("pagination").tagName).toBe("DIV");
    });

    it("renders the steps around the pages", () => {
        render(<Pagination pageCount={5} currentPage={3} />);
        expect(sequence()).toEqual(["Previous", "1", "2", "3", "4", "5", "Next"]);
    });

    it("renders an ellipsis where a run of pages is left out", () => {
        render(<Pagination pageCount={10} currentPage={1} />);
        expect(sequence()).toEqual([
            "Previous",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "…",
            "10",
            "Next",
        ]);
    });

    it("tags the pages and the steps with data-component attributes", () => {
        const { container } = render(<Pagination pageCount={5} currentPage={3} />);

        for (const name of [
            "Pagination",
            "Pagination.Page",
            "Pagination.PreviousPage",
            "Pagination.NextPage",
            "Pagination.PreviousPageIcon",
            "Pagination.NextPageIcon",
        ]) {
            expect(container.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("marks the current page for assistive technology", () => {
        render(<Pagination pageCount={5} currentPage={3} />);
        const current = screen.getByRole("link", { name: "Page 3" });
        expect(current).toHaveAttribute("aria-current", "page");
        expect(screen.getByRole("link", { name: "Page 2" })).not.toHaveAttribute("aria-current");
    });

    it("keeps the current page filled while it holds hover and focus", () => {
        render(<Pagination pageCount={5} currentPage={3} />);
        const current = screen.getByRole("link", { name: "Page 3" });

        // Clicking a page leaves it focused, so the fill has to survive both states or the
        // page a reader just picked reads as unselected
        expect(current).toHaveClass(
            "bg-[var(--background-color-accent-emphasis)]",
            "hover:bg-[var(--background-color-accent-emphasis)]",
            "focus:bg-[var(--background-color-accent-emphasis)]",
        );
        expect(current).not.toHaveClass(
            "hover:bg-[var(--control-transparent-background-color-hover)]",
        );
        expect(current).not.toHaveClass(
            "focus:bg-[var(--control-transparent-background-color-hover)]",
        );
    });

    it("keeps the other pages tinted on hover and focus", () => {
        render(<Pagination pageCount={5} currentPage={3} />);
        const other = screen.getByRole("link", { name: "Page 2" });
        expect(other).toHaveClass(
            "hover:bg-[var(--control-transparent-background-color-hover)]",
            "focus:bg-[var(--control-transparent-background-color-hover)]",
        );
    });

    it("says a run continues in the label of the page before an ellipsis", () => {
        render(<Pagination pageCount={10} currentPage={1} />);
        expect(screen.getByRole("link", { name: "Page 7..." })).toBeInTheDocument();
    });

    it("renders an ellipsis as presentational, not as a link", () => {
        const { container } = render(<Pagination pageCount={10} currentPage={1} />);
        const ellipsis = container.querySelector('[role="presentation"]');
        expect(ellipsis?.tagName).toBe("SPAN");
        expect(ellipsis).toHaveTextContent("…");
    });

    it("takes the step it cannot reach out of the accessibility tree", () => {
        const { container } = render(<Pagination pageCount={5} currentPage={1} />);
        const previous = container.querySelector('[data-component="Pagination.PreviousPage"]');
        expect(previous).toHaveAttribute("aria-hidden", "true");
        expect(previous).toHaveAttribute("aria-disabled", "true");
        expect(previous).not.toHaveAttribute("href");
    });

    it("reports the page that was picked", () => {
        const onPageChange = jest.fn();
        render(<Pagination pageCount={5} currentPage={1} onPageChange={onPageChange} />);

        fireEvent.click(screen.getByRole("link", { name: "Page 3" }));
        expect(onPageChange).toHaveBeenCalledTimes(1);
        expect(onPageChange.mock.calls[0][1]).toBe(3);
    });

    it("builds page links from the hash by default", () => {
        render(<Pagination pageCount={5} currentPage={1} />);
        expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("href", "#3");
    });

    it("builds page links with the hrefBuilder", () => {
        render(
            <Pagination pageCount={5} currentPage={1} hrefBuilder={(page) => `/items?p=${page}`} />,
        );
        expect(screen.getByRole("link", { name: "Page 3" })).toHaveAttribute("href", "/items?p=3");
    });

    it("renders only the steps when the pages are hidden", () => {
        render(<Pagination pageCount={10} currentPage={5} showPages={false} />);
        expect(sequence()).toEqual(["Previous", "Next"]);
    });

    it("hides the pages at the viewports asked for", () => {
        const { container } = render(
            <Pagination pageCount={10} currentPage={5} showPages={{ narrow: false }} />,
        );
        const steps = container.querySelector("[data-hidden-viewport-ranges]");
        expect(steps).toHaveAttribute("data-hidden-viewport-ranges", "narrow");
        expect(steps).toHaveClass("max-medium:[&>*:not(:first-child):not(:last-child)]:hidden");
        expect(steps).not.toHaveClass("xxlarge:[&>*:not(:first-child):not(:last-child)]:hidden");
    });

    it("keeps the pages at every viewport by default", () => {
        const { container } = render(<Pagination pageCount={10} currentPage={5} />);
        expect(container.querySelector("[data-hidden-viewport-ranges]")).toBeNull();
    });

    it("hands each page over to renderPage", () => {
        const { container } = render(
            <Pagination
                pageCount={10}
                currentPage={1}
                renderPage={({ key, number, children, ...pageProps }) => (
                    <button key={key} type="button" data-page={number} {...pageProps}>
                        {children}
                    </button>
                )}
            />,
        );

        // Every page but the ellipsis, which stays presentational
        expect(container.querySelectorAll("button")).toHaveLength(10);
        expect(container.querySelectorAll("a")).toHaveLength(0);
        expect(container.querySelector('[data-component="Pagination.Page"]')).not.toBeNull();
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLElement>();
        render(<Pagination ref={ref} pageCount={5} currentPage={1} />);
        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Pagination
                pageCount={5}
                currentPage={1}
                className="custom"
                data-testid="pagination"
            />,
        );
        expect(screen.getByTestId("pagination")).toHaveClass("custom");
    });
});
