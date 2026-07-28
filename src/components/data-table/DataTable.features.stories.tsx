import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Label } from "../label";
import { RelativeTime } from "../relative-time";
import { DataTable, Table, createColumnHelper } from ".";
import type { Column } from "./DataTable.types";

type Repository = {
    id: number;
    name: string;
    type: "public" | "internal";
    updatedAt: number;
};

const now = Date.now();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

const repositories: Repository[] = [
    { id: 1, name: "codeql-dca-worker", type: "internal", updatedAt: now },
    { id: 2, name: "aegir", type: "public", updatedAt: now - hour },
    { id: 3, name: "strapi", type: "public", updatedAt: now - 6 * hour },
    { id: 4, name: "codeql-ci-nightlies", type: "public", updatedAt: now - day },
    { id: 5, name: "dependabot-updates", type: "public", updatedAt: now - 7 * day },
    { id: 6, name: "tsx-create-react-app", type: "public", updatedAt: now - 28 * day },
];

const capitalise = (input: string) => input[0].toUpperCase() + input.slice(1);

const columns: Column<Repository>[] = [
    { header: "Repository", field: "name", rowHeader: true },
    {
        header: "Type",
        field: "type",
        renderCell: (row) => <Label>{capitalise(row.type)}</Label>,
    },
    {
        header: "Updated",
        field: "updatedAt",
        renderCell: (row) => <RelativeTime date={new Date(row.updatedAt)} />,
    },
];

const sortableColumns: Column<Repository>[] = [
    { header: "Repository", field: "name", rowHeader: true, sortBy: "alphanumeric" },
    {
        header: "Type",
        field: "type",
        sortBy: true,
        renderCell: (row) => <Label>{capitalise(row.type)}</Label>,
    },
    {
        header: "Updated",
        field: "updatedAt",
        sortBy: "datetime",
        renderCell: (row) => <RelativeTime date={new Date(row.updatedAt)} />,
    },
];

export default {
    title: "Components/DataTable/Features",
};

// Sortable Columns, which the reader can order the table by
export const SortableColumns: StoryFn = () => (
    <Table.Container>
        <Table.Title as="h2" id="sortable-repositories">
            Repositories
        </Table.Title>
        <DataTable
            aria-labelledby="sortable-repositories"
            data={repositories}
            columns={sortableColumns}
        />
    </Table.Container>
);

// Sorted On Arrival, where the data is already in order
export const SortedOnArrival: StoryFn = () => (
    <Table.Container>
        <Table.Title as="h2" id="sorted-repositories">
            Repositories
        </Table.Title>
        <DataTable
            aria-labelledby="sorted-repositories"
            data={[...repositories].sort((a, b) => a.name.localeCompare(b.name))}
            columns={sortableColumns}
            initialSortColumn="name"
            initialSortDirection="ASC"
        />
    </Table.Container>
);

// Cell Padding Scale
export const CellPaddingScale: StoryFn = () => (
    <>
        {(["condensed", "normal", "spacious"] as const).map((cellPadding) => (
            <Table.Container key={cellPadding}>
                <Table.Title as="h2" id={`${cellPadding}-repositories`}>
                    cellPadding=&quot;{cellPadding}&quot;
                </Table.Title>
                <DataTable
                    aria-labelledby={`${cellPadding}-repositories`}
                    data={repositories.slice(0, 3)}
                    columns={columns}
                    cellPadding={cellPadding}
                />
            </Table.Container>
        ))}
    </>
);

// With Actions And A Divider, above the table
export const WithActionsAndADivider: StoryFn = () => (
    <Table.Container>
        <Table.Title as="h2" id="actions-repositories">
            Repositories
        </Table.Title>
        <Table.Actions>
            <Button>New repository</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="actions-repositories-subtitle">
            A subtitle could stand here to say more about the data.
        </Table.Subtitle>
        <DataTable
            aria-labelledby="actions-repositories"
            aria-describedby="actions-repositories-subtitle"
            data={repositories.slice(0, 4)}
            columns={columns}
        />
    </Table.Container>
);

// With Pagination
export const WithPagination: StoryFn = () => {
    const pageSize = 3;
    const [pageIndex, setPageIndex] = React.useState(0);
    const start = pageIndex * pageSize;

    return (
        <Table.Container>
            <Table.Title as="h2" id="paged-repositories">
                Repositories
            </Table.Title>
            <DataTable
                aria-labelledby="paged-repositories"
                data={repositories.slice(start, start + pageSize)}
                columns={columns}
            />
            <Table.Pagination
                aria-label="Pagination for Repositories"
                pageSize={pageSize}
                totalCount={repositories.length}
                onChange={(state) => setPageIndex(state.pageIndex)}
            />
        </Table.Container>
    );
};

// Loading, where the table stands in for the data it is waiting on
export const Loading: StoryFn = () => (
    <Table.Container>
        <Table.Title as="h2" id="loading-repositories">
            Repositories
        </Table.Title>
        <Table.Skeleton aria-labelledby="loading-repositories" columns={columns} rows={5} />
    </Table.Container>
);

// Column Widths, which decide how the room left over is shared out
export const ColumnWidths: StoryFn = () => {
    const helper = createColumnHelper<Repository>();

    return (
        <Table.Container>
            <Table.Title as="h2" id="width-repositories">
                Repositories
            </Table.Title>
            <DataTable
                aria-labelledby="width-repositories"
                data={repositories.slice(0, 4)}
                columns={[
                    helper.column({ header: "Repository", field: "name", rowHeader: true }),
                    helper.column({ header: "Type", field: "type", width: 120 }),
                    helper.column({ header: "Updated", field: "updatedAt", width: "auto" }),
                ]}
            />
        </Table.Container>
    );
};

// An End Aligned Column
export const AnEndAlignedColumn: StoryFn = () => (
    <Table.Container>
        <Table.Title as="h2" id="aligned-repositories">
            Repositories
        </Table.Title>
        <DataTable
            aria-labelledby="aligned-repositories"
            data={repositories.slice(0, 4)}
            columns={[
                { header: "Repository", field: "name", rowHeader: true },
                { header: "Type", field: "type", align: "end", sortBy: true },
            ]}
        />
    </Table.Container>
);

// With A Cell Placeholder, where a row has nothing to show
export const WithACellPlaceholder: StoryFn = () => (
    <Table.Container>
        <Table.Title as="h2" id="placeholder-repositories">
            Repositories
        </Table.Title>
        <DataTable
            aria-labelledby="placeholder-repositories"
            data={repositories.slice(0, 4)}
            columns={[
                { header: "Repository", field: "name", rowHeader: true },
                {
                    header: "Description",
                    field: "type",
                    renderCell: () => <Table.CellPlaceholder>No description</Table.CellPlaceholder>,
                },
            ]}
        />
    </Table.Container>
);

// With An Error Dialog, which asks whether to try the request again
export const WithAnErrorDialog: StoryFn = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>Show the error</Button>
            {isOpen ? (
                <Table.ErrorDialog
                    onRetry={() => setIsOpen(false)}
                    onDismiss={() => setIsOpen(false)}
                >
                    The repositories could not be loaded.
                </Table.ErrorDialog>
            ) : null}
        </>
    );
};
