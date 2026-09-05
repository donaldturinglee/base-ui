import * as React from "react";
import { SearchRegular } from "@gamecrafters/base-ui-icons";
import {
    Button,
    DataTable as DataTableComponent,
    EmptyState,
    Heading,
    Label,
    RelativeTime,
    Stack,
    Table,
    Text,
    createColumnHelper,
} from "@gamecrafters/base-ui/react";
import type { Column } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The message stands across the whole row, in place of the cells a row of data would carry,
    // and brings the room around itself
    emptyCell: "col-span-full justify-center p-0",
};

// What every example is a table of. A repository is the sort of row a table like this holds: a
// name to read down, a state to glance at, and a time that is worth showing as how long ago rather
// than as the moment it happened
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

// What each column shows and how. The name names the row, so a screen reader reads it as the row's
// own heading; the other two are built from the row rather than shown as they stand, since a state
// is read better as a label and a time as how long ago it was
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

// What the examples have to have in hand before they can be drawn, written a line to the thing it
// settles so that an example takes only the lines it actually reaches for
const dataSetup = `const repositories = [
    { id: 1, name: "codeql-dca-worker", type: "internal", updatedAt: now },
    { id: 2, name: "aegir", type: "public", updatedAt: now - hour },
    { id: 3, name: "strapi", type: "public", updatedAt: now - 6 * hour },
    { id: 4, name: "codeql-ci-nightlies", type: "public", updatedAt: now - day },
    { id: 5, name: "dependabot-updates", type: "public", updatedAt: now - 7 * day },
    { id: 6, name: "tsx-create-react-app", type: "public", updatedAt: now - 28 * day },
];

const capitalise = (input) => input[0].toUpperCase() + input.slice(1);`;

const columnsSetup = `${dataSetup}

const columns = [
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
];`;

const sortableSetup = `${dataSetup}

const columns = [
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
];`;

// The plainest table there is: the rows, and what each column shows of them. The table is handed
// its data and its columns rather than built row by row, so that sorting, laying the columns out
// and keying the rows are all settled in one place.
//
// It is titled and described by elements standing above it rather than by words handed to it, so
// what names the table is on the page to be read as well as announced. The container is what holds
// the two to the table, and is part of what the example is showing rather than the page's own
// furniture.
//
// The page and the component it is about are both called DataTable, so the component is brought in
// under a name saying which of the two it is. The listing beneath says DataTable, as an
// application importing it would
const defaultPreview = (
    <Table.Container>
        <Table.Title as="h3" id="repositories">
            Repositories
        </Table.Title>
        <Table.Subtitle as="p" id="repositories-subtitle">
            A subtitle could stand here to say more about the data.
        </Table.Subtitle>
        <DataTableComponent
            aria-labelledby="repositories"
            aria-describedby="repositories-subtitle"
            data={repositories}
            columns={columns}
        />
    </Table.Container>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Table.Container>
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
</Table.Container>`;

// Columns the reader can order the table by. A column says whether it can be sorted and how its
// values compare: a strategy by name, or true to take the one that suits the field. Only one
// column is ever sorted, so pressing a second header takes the first out of it
const sortablePreview = (
    <Table.Container>
        <Table.Title as="h3" id="sortable-repositories">
            Repositories
        </Table.Title>
        <DataTableComponent
            aria-labelledby="sortable-repositories"
            data={repositories}
            columns={sortableColumns}
        />
    </Table.Container>
);

const sortableCode = `<Table.Container>
    <Table.Title as="h2" id="sortable-repositories">
        Repositories
    </Table.Title>
    <DataTable
        aria-labelledby="sortable-repositories"
        data={repositories}
        columns={columns}
    />
</Table.Container>`;

// A table whose data arrived already in order. It is told which column that was and which way, so
// the header says so from the start rather than claiming the table is unsorted while it plainly is
const sortedOnArrivalPreview = (
    <Table.Container>
        <Table.Title as="h3" id="sorted-repositories">
            Repositories
        </Table.Title>
        <DataTableComponent
            aria-labelledby="sorted-repositories"
            data={[...repositories].sort((a, b) => a.name.localeCompare(b.name))}
            columns={sortableColumns}
            initialSortColumn="name"
            initialSortDirection="ASC"
        />
    </Table.Container>
);

const sortedOnArrivalCode = `<Table.Container>
    <Table.Title as="h2" id="sorted-repositories">
        Repositories
    </Table.Title>
    <DataTable
        aria-labelledby="sorted-repositories"
        data={[...repositories].sort((a, b) => a.name.localeCompare(b.name))}
        columns={columns}
        initialSortColumn="name"
        initialSortDirection="ASC"
    />
</Table.Container>`;

// How much room there is around the contents of a cell. The three are drawn together rather than
// one to an example, since a density is read against the others rather than on its own
const paddingPreview = (
    <Stack gap="spacious">
        {(["condensed", "normal", "spacious"] as const).map((cellPadding) => (
            <Table.Container key={cellPadding}>
                <Table.Title as="h3" id={`${cellPadding}-repositories`}>
                    cellPadding=&quot;{cellPadding}&quot;
                </Table.Title>
                <DataTableComponent
                    aria-labelledby={`${cellPadding}-repositories`}
                    data={repositories.slice(0, 3)}
                    columns={columns}
                    cellPadding={cellPadding}
                />
            </Table.Container>
        ))}
    </Stack>
);

const paddingCode = `<Stack gap="spacious">
    {["condensed", "normal", "spacious"].map((cellPadding) => (
        <Table.Container key={cellPadding}>
            <Table.Title as="h2" id={\`\${cellPadding}-repositories\`}>
                cellPadding="{cellPadding}"
            </Table.Title>
            <DataTable
                aria-labelledby={\`\${cellPadding}-repositories\`}
                data={repositories.slice(0, 3)}
                columns={columns}
                cellPadding={cellPadding}
            />
        </Table.Container>
    ))}
</Stack>`;

// What stands above the table besides its name: what can be done to the whole of it, and a line
// setting that apart from what is said about the data. The container lays its parts out by what
// they are rather than in the order they are written, so each falls where it belongs
const actionsPreview = (
    <Table.Container>
        <Table.Title as="h3" id="actions-repositories">
            Repositories
        </Table.Title>
        <Table.Actions>
            <Button>New repository</Button>
        </Table.Actions>
        <Table.Divider />
        <Table.Subtitle as="p" id="actions-repositories-subtitle">
            A subtitle could stand here to say more about the data.
        </Table.Subtitle>
        <DataTableComponent
            aria-labelledby="actions-repositories"
            aria-describedby="actions-repositories-subtitle"
            data={repositories.slice(0, 4)}
            columns={columns}
        />
    </Table.Container>
);

const actionsCode = `<Table.Container>
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
</Table.Container>`;

// A table shown a page at a time. The table itself knows nothing of pages: it is handed the rows
// that belong to the one being read, and the pagination says which page that is
const PaginationPreview = () => {
    const pageSize = 3;
    const [pageIndex, setPageIndex] = React.useState(0);
    const start = pageIndex * pageSize;

    return (
        <Table.Container>
            <Table.Title as="h3" id="paged-repositories">
                Repositories
            </Table.Title>
            <DataTableComponent
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

const paginationSetup = `${columnsSetup}

const pageSize = 3;
const [pageIndex, setPageIndex] = React.useState(0);
const start = pageIndex * pageSize;`;

const paginationCode = `<Table.Container>
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
</Table.Container>`;

// The table standing in for the data it is waiting on. It is drawn from the same columns, so the
// shape a reader is looking at is the shape the data will arrive in rather than a box that will be
// replaced by something else
const loadingPreview = (
    <Table.Container>
        <Table.Title as="h3" id="loading-repositories">
            Repositories
        </Table.Title>
        <Table.Skeleton aria-labelledby="loading-repositories" columns={columns} rows={5} />
    </Table.Container>
);

const loadingCode = `<Table.Container>
    <Table.Title as="h2" id="loading-repositories">
        Repositories
    </Table.Title>
    <Table.Skeleton aria-labelledby="loading-repositories" columns={columns} rows={5} />
</Table.Container>`;

// How the room left over is shared out between the columns, and which way a column's contents are
// read. A width given outright holds the column to it; auto holds it to its widest cell; anything
// left over goes to the columns that grow.
//
// The helper ties the columns to the shape of the row they describe, so a field that is not a path
// into the data is a type error rather than an empty cell
const WidthsPreview = () => {
    const helper = createColumnHelper<Repository>();

    return (
        <Table.Container>
            <Table.Title as="h3" id="width-repositories">
                Repositories
            </Table.Title>
            <DataTableComponent
                aria-labelledby="width-repositories"
                data={repositories.slice(0, 4)}
                columns={[
                    helper.column({ header: "Repository", field: "name", rowHeader: true }),
                    helper.column({ header: "Type", field: "type", width: 120 }),
                    helper.column({
                        header: "Updated",
                        field: "updatedAt",
                        width: "auto",
                        align: "end",
                    }),
                ]}
            />
        </Table.Container>
    );
};

const widthsSetup = `${dataSetup}

const helper = createColumnHelper();`;

const widthsCode = `<Table.Container>
    <Table.Title as="h2" id="width-repositories">
        Repositories
    </Table.Title>
    <DataTable
        aria-labelledby="width-repositories"
        data={repositories.slice(0, 4)}
        columns={[
            helper.column({ header: "Repository", field: "name", rowHeader: true }),
            helper.column({ header: "Type", field: "type", width: 120 }),
            helper.column({ header: "Updated", field: "updatedAt", width: "auto", align: "end" }),
        ]}
    />
</Table.Container>`;

// A cell with nothing to show. It is drawn as a placeholder rather than left empty, so a reader
// can tell a cell that has nothing in it from one that failed to draw
const placeholderPreview = (
    <Table.Container>
        <Table.Title as="h3" id="placeholder-repositories">
            Repositories
        </Table.Title>
        <DataTableComponent
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

const placeholderCode = `<Table.Container>
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
</Table.Container>`;

// The grid the columns are laid out on. A table drawn by DataTable is handed one worked out from
// its columns; one drawn by hand has to say what it is, since the table lays itself out on a grid
// and has no template to fall back on. Three columns that share the room left over and never
// narrow below their widest cell come to this
const emptyGridTemplate = "repeat(3, minmax(max-content, 1fr))";

// A table that came back with no rows at all. The message takes the room the data would have had,
// so the headers are laid out by hand: what is being shown is not a table of nothing but a reason
// there is nothing, and something to do about it
const emptyPreview = (
    <Table.Container>
        <Table.Title as="h3" id="empty-repositories">
            Repositories
        </Table.Title>
        <Table aria-labelledby="empty-repositories" gridTemplateColumns={emptyGridTemplate}>
            <Table.Head>
                <Table.Row>
                    {columns.map((column) => (
                        <Table.Header key={column.field}>
                            {typeof column.header === "string" ? column.header : column.header()}
                        </Table.Header>
                    ))}
                </Table.Row>
            </Table.Head>
            <Table.Body>
                <Table.Row>
                    <Table.Cell className={classes.emptyCell} colSpan={columns.length}>
                        <EmptyState
                            icon={SearchRegular}
                            title="No repositories found"
                            description="Try a different search term, or clear your filters"
                            actions={<Button>Clear filters</Button>}
                        />
                    </Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    </Table.Container>
);

const emptySetup = `${columnsSetup}

const emptyCell = "col-span-full justify-center p-0";

// The table lays itself out on a grid and has no template to fall back on, so one drawn by hand
// says what its columns are. Three that share the room left over come to this
const gridTemplate = "repeat(3, minmax(max-content, 1fr))";`;

const emptyCode = `<Table.Container>
    <Table.Title as="h2" id="empty-repositories">
        Repositories
    </Table.Title>
    <Table aria-labelledby="empty-repositories" gridTemplateColumns={gridTemplate}>
        <Table.Head>
            <Table.Row>
                {columns.map((column) => (
                    <Table.Header key={column.field}>{column.header}</Table.Header>
                ))}
            </Table.Row>
        </Table.Head>
        <Table.Body>
            <Table.Row>
                <Table.Cell className={emptyCell} colSpan={columns.length}>
                    <EmptyState
                        icon={SearchRegular}
                        title="No repositories found"
                        description="Try a different search term, or clear your filters"
                        actions={<Button>Clear filters</Button>}
                    />
                </Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>
</Table.Container>`;

// The table as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: columnsSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sortable columns",
        description:
            "A column says whether the table can be sorted by it and how its values compare: a strategy by name, or true to take the one that suits the field. Only one column is ever sorted, so pressing a second header takes the first out of it, and the header says which way it is sorted to a screen reader as well as drawing it.",
        setup: sortableSetup,
        preview: sortablePreview,
        code: sortableCode,
    },
    {
        name: "Sorted on arrival",
        description:
            "Data that came back already in order. The table is told which column that was and which way, so the header says so from the start rather than claiming the table is unsorted while it plainly is. The data has to be in ascending order for this, whichever direction is named.",
        setup: sortableSetup,
        preview: sortedOnArrivalPreview,
        code: sortedOnArrivalCode,
    },
    {
        name: "Cell padding",
        description:
            "How much room there is around the contents of a cell. Condensed fits more rows on a screen, which is what a table read for its shape wants; spacious gives each row more air, which is what a table read row by row wants.",
        setup: columnsSetup,
        preview: paddingPreview,
        code: paddingCode,
    },
    {
        name: "Actions and a divider",
        description:
            "What stands above the table besides its name: what can be done to the whole of it, and a line setting that apart from what is said about the data. The container lays its parts out by what they are rather than in the order they are written, so each falls where it belongs.",
        setup: columnsSetup,
        preview: actionsPreview,
        code: actionsCode,
    },
    {
        name: "Pagination",
        description:
            "The table itself knows nothing of pages. It is handed the rows belonging to the page being read, and the pagination says which page that is and how many there are. On a narrow viewport the page numbers stand down and the two steps are left, since there is room for little else.",
        setup: paginationSetup,
        preview: <PaginationPreview />,
        code: paginationCode,
    },
    {
        name: "Waiting on the data",
        description:
            "The table standing in for what it is waiting on, drawn from the same columns, so the shape a reader is looking at is the shape the data will arrive in rather than a box that will be replaced by something else.",
        setup: columnsSetup,
        preview: loadingPreview,
        code: loadingCode,
    },
    {
        name: "Column widths and alignment",
        description:
            "How the room left over is shared out. A width given outright holds the column to it, auto holds it to its widest cell, and what is left goes to the columns that grow. A column whose values are read against one another, a number or a time, is set to the end so their ends line up. The column helper ties the columns to the shape of the row, so a field that is not a path into the data is a type error rather than an empty cell.",
        setup: widthsSetup,
        preview: <WidthsPreview />,
        code: widthsCode,
    },
    {
        name: "A cell with nothing in it",
        description:
            "Drawn as a placeholder rather than left empty, so a reader can tell a cell that has nothing to show from one that failed to draw.",
        setup: columnsSetup,
        preview: placeholderPreview,
        code: placeholderCode,
    },
    {
        name: "No rows at all",
        description:
            "A table that came back with nothing. The message takes the room the data would have had, so the parts are laid out by hand rather than handed to the table: what is being shown is not a table of nothing but a reason there is nothing, and something to do about it. A table drawn this way has to say what grid its columns stand on, since it lays itself out on one and has no template to fall back on.",
        setup: emptySetup,
        preview: emptyPreview,
        code: emptyCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// How much room there is around the contents of a cell
const cellPadding = {
    name: "cellPadding",
    type: '"condensed" | "normal" | "spacious"',
    default: '"normal"',
    options: ["condensed", "normal", "spacious"],
    description: "How much room there is around the contents of a cell",
};

// Every prop the table and its parts take, under the part that takes it.
//
// The table comes first, then the shape a column is described by, since that is where most of what
// a table does is settled. The parts follow in the order they are written: what holds the table
// and what stands above it, then the table drawn by hand, then what is shown in place of the data
const groups: ComponentPropGroup[] = [
    {
        name: "DataTable",
        props: [
            {
                name: "data",
                type: "Data[]",
                required: true,
                description:
                    "The rows. Each has to be told apart from the others, by an id field or by getRowId, so the table can key them and keep their order as it sorts",
            },
            {
                name: "columns",
                type: "Column<Data>[]",
                required: true,
                description:
                    "What each column shows and how. Described below, under Column, since it is where most of what a table does is settled",
            },
            cellPadding,
            {
                name: "initialSortColumn",
                type: "string | number",
                description:
                    "The id or field of the column the data arrived sorted by. The data has to already be in ascending order, whichever direction is named",
            },
            {
                name: "initialSortDirection",
                type: '"ASC" | "DESC"',
                default: '"ASC"',
                options: ["ASC", "DESC"],
                description: "Which way the data arrived sorted",
            },
            {
                name: "externalSorting",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the sorting to the caller, who is expected to hand back sorted data. The headers still draw and report every toggle, which is what a table sorted by a server wants",
            },
            {
                name: "getRowId",
                type: "(rowData: Data) => string | number",
                description: "Tells the rows apart, in place of the id field",
            },
            {
                name: "onToggleSort",
                type: "(columnId, direction) => void",
                description:
                    "Called every time a sortable header is toggled, with the column now sorted and the direction it is sorted in",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the table after the title standing above it, so what names it is on the page to be read as well as announced",
            },
            {
                name: "aria-describedby",
                type: "string",
                description: "Describes the table after the subtitle standing above it",
            },
        ],
    },
    {
        name: "Column",
        props: [
            {
                name: "header",
                type: "string | (() => React.ReactNode)",
                required: true,
                description: "What heads the column. A function where the header is more than text",
            },
            {
                name: "field",
                type: "ObjectPaths<Data>",
                description:
                    "Which value in a row the column shows. A path such as a.b.c reaches into nested objects. It is left out only where renderCell builds the cell from the whole row",
            },
            {
                name: "id",
                type: "string",
                description: "Identifies the column, where the field does not or there is none",
            },
            {
                name: "renderCell",
                type: "(data: Data) => React.ReactNode",
                description:
                    "Builds the cell from the whole row, in place of showing the field as it stands. It is what a state drawn as a label or a time drawn as how long ago wants",
            },
            {
                name: "rowHeader",
                type: "boolean",
                default: "false",
                description:
                    "Names the row to a screen reader, the way a header names a column. One column in a table should carry it, and it should be the one a reader would say the row was",
            },
            {
                name: "sortBy",
                type: "boolean | SortStrategyName | ((a: Data, b: Data) => number)",
                description:
                    "Whether the table can be sorted by this column, and how its values compare. True takes the strategy that suits the field; alphanumeric, basic and datetime name one outright; a function of the caller's own compares whole rows",
            },
            {
                name: "align",
                type: '"start" | "end"',
                default: '"start"',
                options: ["start", "end"],
                description:
                    "Which way the cells are read. A column of numbers or times is set to the end, so their ends line up and can be read against one another",
            },
            {
                name: "width",
                type: '"grow" | "growCollapse" | "auto" | React.CSSProperties["width"]',
                description:
                    "How the room left over is shared out. Grow fills what is left and never narrows below its widest cell; growCollapse may narrow below it, which is what a column of prose wants; auto holds the column to its widest cell; anything else holds it to exactly that width",
            },
            {
                name: "minWidth",
                type: 'React.CSSProperties["minWidth"]',
                description: "The narrowest the column is allowed to become",
            },
            {
                name: "maxWidth",
                type: 'React.CSSProperties["maxWidth"]',
                description: "The widest the column is allowed to become",
            },
        ],
    },
    {
        name: "Table.Container",
        props: [styling],
    },
    {
        name: "Table.Title",
        props: [
            {
                name: "id",
                type: "string",
                required: true,
                description: "Named so the table can point aria-labelledby at it",
            },
            styling,
        ],
    },
    {
        name: "Table.Subtitle",
        props: [
            {
                name: "id",
                type: "string",
                required: true,
                description: "Named so the table can point aria-describedby at it",
            },
            styling,
        ],
    },
    {
        name: "Table.Actions",
        props: [styling],
    },
    {
        name: "Table.Divider",
        props: [styling],
    },
    {
        name: "Table.Pagination",
        props: [
            {
                name: "aria-label",
                type: "string",
                required: true,
                description:
                    "Names the navigation landmark, so a page with more than one says which table each belongs to",
            },
            {
                name: "totalCount",
                type: "number",
                required: true,
                description: "How many rows there are in all, across every page",
            },
            {
                name: "pageSize",
                type: "number",
                default: "25",
                description: "How many rows stand on a page",
            },
            {
                name: "defaultPageIndex",
                type: "number",
                default: "0",
                description: "Which page is being read to start with, counted from nought",
            },
            {
                name: "onChange",
                type: "(state: { pageIndex: number }) => void",
                description:
                    "Called with the page now being read, which is what the caller slices the data by",
            },
            {
                name: "showPages",
                type: "boolean | ResponsiveValue<boolean>",
                default: "{ narrow: false }",
                description:
                    "Whether the page numbers stand between the two steps, and at which viewports. A narrow viewport has room for the two steps and little else, so the numbers stand down there by default",
            },
            styling,
        ],
    },
    {
        name: "Table.Skeleton",
        props: [
            {
                name: "columns",
                type: "Column<Data>[]",
                required: true,
                description:
                    "The same columns the table will be drawn with, so the shape a reader is looking at is the shape the data will arrive in",
            },
            {
                name: "rows",
                type: "number",
                default: "10",
                description: "How many rows of placeholder text stand in for the data",
            },
            cellPadding,
            styling,
        ],
    },
    {
        name: "Table.ErrorDialog",
        props: [
            {
                name: "title",
                type: "string",
                default: '"Error"',
                description: "What the dialog is titled",
            },
            {
                name: "onRetry",
                type: "() => void",
                description: "Called when the reader asks to try the request again",
            },
            {
                name: "onDismiss",
                type: "() => void",
                description: "Called when the reader dismisses the dialog",
            },
        ],
    },
    {
        name: "Table",
        props: [
            {
                name: "gridTemplateColumns",
                type: 'React.CSSProperties["gridTemplateColumns"]',
                description:
                    "The grid the columns are laid out on. A table drawn by hand works it out from its columns with getGridTemplate; one drawn by DataTable is given it already",
            },
            cellPadding,
            styling,
        ],
    },
    {
        name: "Table.CellPlaceholder",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the table is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const DataTable = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                DataTable
            </Heading>
            <Text as="p" size="large">
                Rows of data under headers that name them. It is handed the rows and a description
                of what each column shows, rather than built row by row, so that sorting, laying the
                columns out and keying the rows are all settled in one place. Where a table has to
                be built by hand, because what stands in it is not rows of data, the parts it is
                drawn from are there to be written out directly.
            </Text>
        </Stack>
        <ComponentExamples component="DataTable" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default DataTable;
