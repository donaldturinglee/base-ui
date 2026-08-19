import * as React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { DataTable, Table, createColumnHelper, sortStrategies } from ".";
import { getGridTemplateFromColumns } from "./tableLayout";
import type { Column } from "./DataTable.types";

const originalResizeObserver = window.ResizeObserver;

// jsdom has no ResizeObserver, and the region around the table watches its own size to work
// out whether it scrolls
beforeEach(() => {
    window.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    } as unknown as typeof ResizeObserver;
});

afterEach(() => {
    window.ResizeObserver = originalResizeObserver;
});

type Repo = {
    id: number;
    name: string;
    stars: number;
    owner: { login: string };
};

const data: Repo[] = [
    { id: 1, name: "banana", stars: 30, owner: { login: "ada" } },
    { id: 2, name: "apple", stars: 10, owner: { login: "grace" } },
    { id: 3, name: "cherry", stars: 20, owner: { login: "alan" } },
];

const columns: Column<Repo>[] = [
    { header: "Name", field: "name", rowHeader: true },
    { header: "Stars", field: "stars" },
];

const renderTable = (props: Partial<React.ComponentProps<typeof DataTable<Repo>>> = {}) =>
    render(<DataTable aria-labelledby="title" data={data} columns={columns} {...props} />);

const rowNames = () =>
    screen
        .getAllByRole("rowheader")
        .map((cell) => cell.textContent)
        .filter(Boolean);

describe("DataTable", () => {
    it("renders a table", () => {
        renderTable();
        expect(screen.getByRole("table")).toBeInTheDocument();
    });

    it("tags the table and its parts with data-component attributes", () => {
        const { container } = renderTable();

        for (const name of ["Table", "Table.Head", "Table.Body", "Table.Row", "Table.Header"]) {
            expect(container.querySelector(`[data-component='${name}']`)).not.toBeNull();
        }
    });

    it("renders a header for every column", () => {
        renderTable();

        const headers = screen.getAllByRole("columnheader");
        expect(headers).toHaveLength(2);
        expect(headers[0]).toHaveTextContent("Name");
        expect(headers[1]).toHaveTextContent("Stars");
    });

    it("renders a header built from a function", () => {
        renderTable({
            columns: [{ header: () => <span>Built</span>, field: "name" }],
        });
        expect(screen.getByRole("columnheader")).toHaveTextContent("Built");
    });

    it("renders a row for every item of data", () => {
        renderTable();
        // One row for the head, and one for each item
        expect(screen.getAllByRole("row")).toHaveLength(data.length + 1);
    });

    it("shows the value the field points at", () => {
        renderTable();
        expect(screen.getByText("banana")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();
    });

    it("reaches into nested objects through a path", () => {
        renderTable({
            columns: [{ header: "Owner", field: "owner.login" }],
        });
        expect(screen.getByText("ada")).toBeInTheDocument();
    });

    it("builds a cell from the whole row where it is asked to", () => {
        renderTable({
            columns: [
                { header: "Name", field: "name", renderCell: (row) => <b>{row.owner.login}</b> },
            ],
        });
        expect(screen.getByText("grace")).toBeInTheDocument();
    });

    it("names a row from the column marked as its header", () => {
        renderTable();

        const rowHeaders = screen.getAllByRole("rowheader");
        expect(rowHeaders).toHaveLength(data.length);
        expect(rowHeaders[0].tagName).toBe("TH");
        expect(rowHeaders[0]).toHaveAttribute("scope", "row");
    });

    it("falls back to the id field to tell rows apart", () => {
        const { container } = renderTable();
        expect(container.querySelectorAll("tbody tr")).toHaveLength(data.length);
    });

    it("tells rows apart by a key of the caller's own", () => {
        const getRowId = vi.fn((row: Repo) => `repo-${row.name}`);
        renderTable({ getRowId });
        expect(getRowId).toHaveBeenCalled();
    });

    it("keeps the order the data arrived in", () => {
        renderTable();
        expect(rowNames()).toEqual(["banana", "apple", "cherry"]);
    });

    it("falls back to the normal cell padding", () => {
        renderTable();
        expect(screen.getByRole("table")).toHaveAttribute("data-cell-padding", "normal");
    });

    it("takes the cell padding it is given", () => {
        renderTable({ cellPadding: "spacious" });
        expect(screen.getByRole("table")).toHaveAttribute("data-cell-padding", "spacious");
    });

    it("names and describes the table from the elements it is pointed at", () => {
        renderTable({ "aria-describedby": "subtitle" });
        const table = screen.getByRole("table");
        expect(table).toHaveAttribute("aria-labelledby", "title");
        expect(table).toHaveAttribute("aria-describedby", "subtitle");
    });

    it("lays the columns out on a grid worked out from their widths", () => {
        renderTable();
        expect(
            screen.getByRole("table").style.getPropertyValue("--table-grid-template-columns"),
        ).toBe("minmax(max-content, 1fr) minmax(max-content, 1fr)");
    });

    it("aligns a column to the end where it is asked to", () => {
        renderTable({
            columns: [{ header: "Stars", field: "stars", align: "end" }],
        });
        expect(screen.getByRole("columnheader")).toHaveAttribute("data-cell-align", "end");
        expect(screen.getAllByRole("cell")[0]).toHaveAttribute("data-cell-align", "end");
    });

    it("draws the side borders from where a cell stands rather than from what it calls itself", () => {
        renderTable({
            columns: [{ header: "Name", field: "name", rowHeader: true, sortBy: true }],
        });

        // A sortable header reports itself as Table.SortHeader, so a border keyed on the
        // plain header would leave the head of the table open at both ends
        expect(screen.getByRole("columnheader")).toHaveAttribute(
            "data-component",
            "Table.SortHeader",
        );

        expect(screen.getByRole("table")).toHaveClass("data-table");
    });

    it("leaves the bottom corners to whatever follows the table", () => {
        renderTable();

        // The footer below a table rounds off the box, so the table only does it where it
        // stands on its own
        expect(screen.getByRole("table").parentElement).toHaveClass("data-table-wrapper");
    });

    it("refuses a column with nothing to identify it by", () => {
        // The column is what a header, a cell and a sort state are all keyed on
        expect(() => renderTable({ columns: [{ header: "Nameless" }] })).toThrow(
            /`id` or a `field`/,
        );
    });

    it("forwards a ref to the table", () => {
        const ref = React.createRef<HTMLTableElement>();
        render(<DataTable ref={ref} aria-labelledby="title" data={data} columns={columns} />);
        expect(ref.current).toBe(screen.getByRole("table"));
    });
});

describe("DataTable sorting", () => {
    const sortable: Column<Repo>[] = [
        { header: "Name", field: "name", rowHeader: true, sortBy: "alphanumeric" },
        { header: "Stars", field: "stars", sortBy: true },
    ];

    const sortButton = (name: string) =>
        within(screen.getByRole("columnheader", { name: new RegExp(name) })).getByRole("button");

    it("shows no sort control on a column that cannot be sorted", () => {
        renderTable();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("shows a sort control on a column that can be sorted", () => {
        renderTable({ columns: sortable });
        expect(screen.getAllByRole("button")).toHaveLength(2);
    });

    it("leaves the columns unsorted to begin with", () => {
        renderTable({ columns: sortable });
        for (const header of screen.getAllByRole("columnheader")) {
            expect(header).not.toHaveAttribute("aria-sort");
        }
    });

    it("sorts ascending on the first press", () => {
        renderTable({ columns: sortable });

        fireEvent.click(sortButton("Name"));

        expect(rowNames()).toEqual(["apple", "banana", "cherry"]);
        expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
            "aria-sort",
            "ascending",
        );
    });

    it("turns the column around on the next press", () => {
        renderTable({ columns: sortable });

        fireEvent.click(sortButton("Name"));
        fireEvent.click(sortButton("Name"));

        expect(rowNames()).toEqual(["cherry", "banana", "apple"]);
        expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
            "aria-sort",
            "descending",
        );
    });

    it("starts again from ascending on another column", () => {
        renderTable({ columns: sortable });

        fireEvent.click(sortButton("Name"));
        fireEvent.click(sortButton("Stars"));

        expect(rowNames()).toEqual(["apple", "cherry", "banana"]);
        expect(screen.getByRole("columnheader", { name: /Stars/ })).toHaveAttribute(
            "aria-sort",
            "ascending",
        );
        expect(screen.getByRole("columnheader", { name: /Name/ })).not.toHaveAttribute("aria-sort");
    });

    it("reports the column and the direction it is now sorted in", () => {
        const onToggleSort = vi.fn();
        renderTable({ columns: sortable, onToggleSort });

        fireEvent.click(sortButton("Name"));
        expect(onToggleSort).toHaveBeenCalledWith("name", "ASC");

        fireEvent.click(sortButton("Name"));
        expect(onToggleSort).toHaveBeenCalledWith("name", "DESC");
    });

    it("sorts by a strategy of the caller's own", () => {
        renderTable({
            columns: [
                {
                    header: "Name",
                    field: "name",
                    rowHeader: true,
                    sortBy: (a, b) => a.stars - b.stars,
                },
            ],
        });

        fireEvent.click(screen.getByRole("button"));
        expect(rowNames()).toEqual(["apple", "cherry", "banana"]);
    });

    it("starts from the column and direction it is given", () => {
        renderTable({
            columns: sortable,
            initialSortColumn: "name",
            initialSortDirection: "DESC",
        });
        expect(screen.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
            "aria-sort",
            "descending",
        );
    });

    it("ignores a starting column that cannot be sorted", () => {
        renderTable({ columns, initialSortColumn: "name" });
        expect(screen.getByRole("columnheader", { name: /Name/ })).not.toHaveAttribute("aria-sort");
    });

    it("leaves the rows alone where the caller sorts them itself", () => {
        const onToggleSort = vi.fn();
        renderTable({ columns: sortable, externalSorting: true, onToggleSort });

        fireEvent.click(sortButton("Name"));

        // The order is the caller's to change, but the toggle is still reported
        expect(rowNames()).toEqual(["banana", "apple", "cherry"]);
        expect(onToggleSort).toHaveBeenCalledWith("name", "ASC");
    });

    it("orders empty values last whichever way the column points", () => {
        const sparse: Repo[] = [
            { id: 1, name: "banana", stars: 30, owner: { login: "ada" } },
            { id: 2, name: "", stars: 10, owner: { login: "grace" } },
            { id: 3, name: "apple", stars: 20, owner: { login: "alan" } },
        ];

        renderTable({ data: sparse, columns: sortable });

        fireEvent.click(sortButton("Name"));
        expect(rowNames()).toEqual(["apple", "banana"]);

        fireEvent.click(sortButton("Name"));
        expect(rowNames()).toEqual(["banana", "apple"]);
    });
});

describe("sortStrategies", () => {
    it("compares any two values", () => {
        expect(sortStrategies.basic(1, 2)).toBe(-1);
        expect(sortStrategies.basic(2, 1)).toBe(1);
        expect(sortStrategies.basic(1, 1)).toBe(0);
    });

    it("compares dates and the numbers they are made of", () => {
        expect(sortStrategies.datetime(new Date(1), new Date(2))).toBe(-1);
        expect(sortStrategies.datetime(2, 1)).toBe(1);
        expect(sortStrategies.datetime(new Date(1), 1)).toBe(0);
    });

    it("orders text with numbers in it the way a reader would", () => {
        const input = ["item 10", "item 2", "item 1"];
        expect(input.slice().sort(sortStrategies.alphanumeric)).toEqual([
            "item 1",
            "item 2",
            "item 10",
        ]);
    });

    it("orders numbers before text", () => {
        expect(sortStrategies.alphanumeric("1", "a")).toBe(-1);
        expect(sortStrategies.alphanumeric("a", "1")).toBe(1);
    });
});

describe("getGridTemplateFromColumns", () => {
    it("lets a column grow no narrower than its widest cell", () => {
        expect(getGridTemplateFromColumns<Repo>([{ header: "Name", field: "name" }])).toEqual([
            "minmax(max-content, 1fr)",
        ]);
    });

    it("lets a collapsing column shrink past its content", () => {
        expect(
            getGridTemplateFromColumns<Repo>([
                { header: "Name", field: "name", width: "growCollapse" },
            ]),
        ).toEqual(["minmax(0, 1fr)"]);
    });

    it("holds an auto column at the width of its widest cell", () => {
        expect(
            getGridTemplateFromColumns<Repo>([{ header: "Name", field: "name", width: "auto" }]),
        ).toEqual(["auto"]);
    });

    it("takes a width of the caller's own", () => {
        expect(
            getGridTemplateFromColumns<Repo>([
                { header: "Name", field: "name", width: 200 },
                { header: "Stars", field: "stars", width: "20%" },
            ]),
        ).toEqual(["200px", "20%"]);
    });

    it("lets a maximum width win over the content", () => {
        expect(
            getGridTemplateFromColumns<Repo>([
                { header: "Name", field: "name", maxWidth: 300, minWidth: 100 },
            ]),
        ).toEqual(["minmax(100px, 300px)"]);
    });
});

describe("createColumnHelper", () => {
    it("gives a column its field as an id where it has none", () => {
        const helper = createColumnHelper<Repo>();
        expect(helper.column({ header: "Name", field: "name" }).id).toBe("name");
    });

    it("leaves an id of the caller's own alone", () => {
        const helper = createColumnHelper<Repo>();
        expect(helper.column({ id: "custom", header: "Name", field: "name" }).id).toBe("custom");
    });
});

describe("Table parts", () => {
    it("renders a container with a title, a subtitle, actions and a divider", () => {
        const { container } = render(
            <Table.Container>
                <Table.Title as="h2" id="title">
                    Repositories
                </Table.Title>
                <Table.Actions>
                    <button type="button">New</button>
                </Table.Actions>
                <Table.Divider />
                <Table.Subtitle as="p" id="subtitle">
                    Everything you own
                </Table.Subtitle>
            </Table.Container>,
        );

        for (const name of [
            "Table.Container",
            "Table.Title",
            "Table.Actions",
            "Table.Divider",
            "Table.Subtitle",
        ]) {
            expect(container.querySelector(`[data-component='${name}']`)).not.toBeNull();
        }
        expect(screen.getByRole("heading", { level: 2, name: "Repositories" })).toBeInTheDocument();
    });

    it("renders a placeholder for a cell with nothing to show", () => {
        render(<Table.CellPlaceholder>No description</Table.CellPlaceholder>);
        expect(screen.getByText("No description")).toHaveAttribute(
            "data-component",
            "Table.CellPlaceholder",
        );
    });

    it("stands in for the data while it is loading", () => {
        const { container } = render(
            <Table.Skeleton aria-labelledby="title" columns={columns} rows={3} />,
        );

        expect(screen.getAllByRole("columnheader")).toHaveLength(columns.length);
        // Every column says it is loading, so a reader is told wherever they land
        expect(screen.getAllByText("Loading")).toHaveLength(columns.length);
        expect(container.querySelectorAll("[data-cell-skeleton-item]")).toHaveLength(
            columns.length * 3,
        );
    });

    it("falls back to ten rows of placeholder text", () => {
        const { container } = render(<Table.Skeleton aria-labelledby="title" columns={columns} />);
        expect(container.querySelectorAll("[data-cell-skeleton-item]")).toHaveLength(
            columns.length * 10,
        );
    });
});

describe("Table.Pagination", () => {
    const renderPagination = (props: Partial<React.ComponentProps<typeof Table.Pagination>> = {}) =>
        render(
            <Table.Pagination aria-label="Pagination" totalCount={100} pageSize={25} {...props} />,
        );

    const page = (number: number) => screen.getByRole("button", { name: `Page ${number}` });

    const range = () =>
        screen
            .getByRole("navigation")
            .querySelector("[data-component='Table.Pagination.Range']") as HTMLElement;

    it("renders a navigation landmark", () => {
        renderPagination();
        expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    });

    it("says which of the items are showing", () => {
        renderPagination();
        expect(range()).toHaveTextContent("1 through ‒25 of 100");
    });

    it("renders a step for every page", () => {
        renderPagination();
        for (const number of [1, 2, 3, 4]) {
            expect(page(number)).toBeInTheDocument();
        }
    });

    it("marks the page that is showing", () => {
        renderPagination();
        expect(page(1)).toHaveAttribute("aria-current", "true");
        expect(page(2)).not.toHaveAttribute("aria-current");
    });

    it("has nowhere to go back to on the first page", () => {
        renderPagination();
        expect(screen.getByRole("button", { name: /Previous/ })).toHaveAttribute(
            "aria-disabled",
            "true",
        );
    });

    it("moves on to the next page", () => {
        const onChange = vi.fn();
        renderPagination({ onChange });

        fireEvent.click(screen.getByRole("button", { name: /Next/ }));

        expect(onChange).toHaveBeenCalledWith({ pageIndex: 1 });
        expect(range()).toHaveTextContent("26 through ‒50 of 100");
    });

    it("moves back to the page before", () => {
        const onChange = vi.fn();
        renderPagination({ onChange, defaultPageIndex: 2 });

        fireEvent.click(screen.getByRole("button", { name: /Previous/ }));

        expect(onChange).toHaveBeenCalledWith({ pageIndex: 1 });
    });

    it("goes to a page it is pointed at", () => {
        const onChange = vi.fn();
        renderPagination({ onChange });

        fireEvent.click(page(3));

        expect(onChange).toHaveBeenCalledWith({ pageIndex: 2 });
        expect(page(3)).toHaveAttribute("aria-current", "true");
    });

    it("stays put when the page it is on is chosen again", () => {
        const onChange = vi.fn();
        renderPagination({ onChange });

        fireEvent.click(page(1));
        expect(onChange).not.toHaveBeenCalled();
    });

    it("starts on the page it is given", () => {
        renderPagination({ defaultPageIndex: 1 });
        expect(page(2)).toHaveAttribute("aria-current", "true");
    });

    it("ignores a starting page that is not there", () => {
        renderPagination({ defaultPageIndex: 99 });
        expect(page(1)).toHaveAttribute("aria-current", "true");
    });

    it("has nowhere to go on from the last page", () => {
        renderPagination({ defaultPageIndex: 3 });
        expect(screen.getByRole("button", { name: /Next/ })).toHaveAttribute(
            "aria-disabled",
            "true",
        );
    });

    it("announces the range to a screen reader", () => {
        renderPagination();
        expect(screen.getByRole("status")).toHaveTextContent("Showing 1 through 25 of 100");
    });
});

describe("Table.ErrorDialog", () => {
    it("asks whether to try again", () => {
        render(<Table.ErrorDialog>Something went wrong</Table.ErrorDialog>);

        expect(screen.getByRole("alertdialog", { name: "Error" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
    });

    it("takes a title of its own", () => {
        render(<Table.ErrorDialog title="Could not load">Something went wrong</Table.ErrorDialog>);
        expect(screen.getByRole("alertdialog", { name: "Could not load" })).toBeInTheDocument();
    });

    it("calls onRetry when the reader asks to try again", () => {
        const onRetry = vi.fn();
        const onDismiss = vi.fn();
        render(
            <Table.ErrorDialog onRetry={onRetry} onDismiss={onDismiss}>
                Something went wrong
            </Table.ErrorDialog>,
        );

        fireEvent.click(screen.getByRole("button", { name: "Retry" }));
        expect(onRetry).toHaveBeenCalledTimes(1);
        expect(onDismiss).not.toHaveBeenCalled();
    });

    it("calls onDismiss for anything else that closes it", () => {
        const onRetry = vi.fn();
        const onDismiss = vi.fn();
        render(
            <Table.ErrorDialog onRetry={onRetry} onDismiss={onDismiss}>
                Something went wrong
            </Table.ErrorDialog>,
        );

        fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
        expect(onRetry).not.toHaveBeenCalled();
    });
});
