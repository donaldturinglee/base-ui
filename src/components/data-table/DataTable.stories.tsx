import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { Label } from "../label";
import { RelativeTime } from "../relative-time";
import { DataTable, Table } from ".";
import type { Column, DataTableProps } from "./DataTable.types";

type Repository = {
    id: number;
    name: string;
    type: "public" | "internal";
    updatedAt: number;
};

const now = Date.now();
const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;
const week = 7 * day;

const repositories: Repository[] = [
    { id: 1, name: "codeql-dca-worker", type: "internal", updatedAt: now },
    { id: 2, name: "aegir", type: "public", updatedAt: now - 5 * minute },
    { id: 3, name: "strapi", type: "public", updatedAt: now - hour },
    { id: 4, name: "codeql-ci-nightlies", type: "public", updatedAt: now - 6 * hour },
    { id: 5, name: "dependabot-updates", type: "public", updatedAt: now - day },
    { id: 6, name: "tsx-create-react-app", type: "public", updatedAt: now - week },
    { id: 7, name: "bootstrap", type: "public", updatedAt: now - 4 * week },
    { id: 8, name: "docker-templates", type: "public", updatedAt: now - 12 * week },
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

// The meta is left unparameterised, since resolving the table's generic through Storybook's
// own types walks every field path of the row over again and never settles
export default {
    title: "Components/DataTable",
    component: DataTable,
} as Meta;

export const Default: StoryFn<DataTableProps<Repository>> = () => (
    <Table.Container>
        <Table.Title as="h2" id="repositories">
            Repositories
        </Table.Title>
        <Table.Subtitle as="p" id="repositories-subtitle">
            A subtitle could stand here to say more about the data.
        </Table.Subtitle>
        <DataTable
            aria-labelledby="repositories"
            aria-describedby="repositories-subtitle"
            data={repositories}
            columns={columns}
        />
    </Table.Container>
);

export const Playground: StoryFn<DataTableProps<Repository> & { pageSize: number }> = (args) => {
    const { pageSize, ...rest } = args;
    const [pageIndex, setPageIndex] = React.useState(0);
    const start = pageIndex * pageSize;
    const rows = repositories.slice(start, start + pageSize);

    return (
        <Table.Container>
            <Table.Title as="h2" id="playground-repositories">
                Repositories
            </Table.Title>
            <Table.Subtitle as="p" id="playground-repositories-subtitle">
                A subtitle could stand here to say more about the data.
            </Table.Subtitle>
            <DataTable
                {...rest}
                aria-labelledby="playground-repositories"
                aria-describedby="playground-repositories-subtitle"
                data={rows}
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

Playground.args = {
    cellPadding: "normal",
    pageSize: 5,
};

Playground.argTypes = {
    cellPadding: {
        control: {
            type: "radio",
        },
        options: ["condensed", "normal", "spacious"],
        description: "How much room there is around the contents of a cell",
    },
    pageSize: {
        control: {
            type: "number",
            min: 1,
        },
        description: "How many rows stand on a page",
    },
    data: {
        table: {
            disable: true,
        },
    },
    columns: {
        table: {
            disable: true,
        },
    },
    getRowId: {
        table: {
            disable: true,
        },
    },
    onToggleSort: {
        table: {
            disable: true,
        },
    },
};
