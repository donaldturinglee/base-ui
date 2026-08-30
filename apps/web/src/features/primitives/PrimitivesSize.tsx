import type { ReactNode } from "react";
import { Code, DataTable, Heading, Stack, Table, Text } from "@gamecrafters/base-ui/react";
import type { Column } from "@gamecrafters/base-ui/react";
import { useResolvedValues } from "./hooks";

const classes = {
    prose: "max-w-[46rem]",
    // A token is read as a value rather than as prose, so it is set in the monospace stack the
    // rest of the library sets code in
    name: "font-[family-name:var(--font-stack-monospace)]",
    value: "text-[var(--foreground-color-muted)] font-[family-name:var(--font-stack-monospace)]",
    bar: "h-[var(--base-size-8)] rounded-[var(--border-radius-small)] bg-[var(--background-color-accent-emphasis)]",
    muted: "text-[var(--foreground-color-muted)]",
};

// The scale, in the order it is counted rather than the order the stylesheet declares it in, which
// is alphabetical and reads as though the steps were shuffled
const steps = [2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 64, 80, 96, 112, 128];

// The offsets are the same scale negated, and stop at the point past which nothing is pulled back
// that far
const offsetSteps = steps.filter((step) => step <= 48);

// The spacing scale, which is the semantic level: a name for how much room something is being
// given rather than for how many pixels it is worth
const spaces = [
    { name: "xxs", use: "Form field separators, and divisions too tight for anything else" },
    { name: "xs", use: "Small badges, and the room inside a compact control" },
    { name: "sm", use: "The default. Most spacing between elements is this" },
    { name: "md", use: "Breathing room inside a container" },
    { name: "lg", use: "Major divisions of a layout, and the space between blocks of content" },
    { name: "xl", use: "Large sections, and the separation of top-level structure" },
];

const sizeToken = (step: number) => `--base-size-${step}`;

const offsetToken = (step: number) => `--base-size-negative-${step}`;

const spaceToken = (name: string) => `--space-${name}`;

// Every token the page reads, named once at the module so the list handed to the hook is the
// same list on every render and the read is not repeated for a reason that is not a change
const names = [
    ...steps.map(sizeToken),
    ...offsetSteps.map(offsetToken),
    ...spaces.map(({ name }) => spaceToken(name)),
];

// One row of a scale. The table tells its rows apart by a field of their own, and a token is
// named once within the scale it belongs to, so the step it is named by is what stands as the id
type SizeRow = {
    id: string | number;
    token: string;
    // What the token resolves to under the scheme in force, which is read from the document and
    // so is not there for the first render
    value?: string;
    // What the token is for, where the name alone does not say it
    use?: string;
};

type SectionProps = {
    // Names the table, and is what the table points `aria-labelledby` at
    id: string;
    title: string;
    // Whatever has to be said about the scale before it is read
    note?: ReactNode;
    data: SizeRow[];
    columns: Column<SizeRow>[];
};

const tokenColumn: Column<SizeRow> = {
    header: "Token",
    field: "token",
    width: "auto",
    // A name is read as one thing, so the column is never taken in past the longest of them and
    // broken across lines mid-token
    minWidth: "max-content",
    rowHeader: true,
    renderCell: ({ token }) => (
        <Text size="small" className={classes.name}>
            {token}
        </Text>
    ),
};

const valueColumn: Column<SizeRow> = {
    header: "Value",
    field: "value",
    width: "auto",
    minWidth: "max-content",
    renderCell: ({ value }) => (
        <Text size="small" className={classes.value}>
            {value}
        </Text>
    ),
};

// What the step is worth, drawn at that width. The column is as wide as the longest bar standing
// in it, so a bar is read against the ones above and below it rather than against the column
const gaugeColumn: Column<SizeRow> = {
    id: "gauge",
    header: "Gauge",
    width: "auto",
    minWidth: "max-content",
    renderCell: ({ token }) => <div className={classes.bar} style={{ width: `var(${token})` }} />,
};

const useColumn: Column<SizeRow> = {
    header: "Use",
    field: "use",
    width: "auto",
    // Prose wraps where a name does not, but not to a word a line: below this the table is
    // scrolled across instead
    minWidth: "10rem",
    renderCell: ({ use }) => (
        <Text size="small" className={classes.muted}>
            {use}
        </Text>
    ),
};

// Nothing stands after the last column, so it is the one that takes whatever room the table has
// over. Left to share it every column would stretch alike, and the rows would be read across gaps
const fill = (column: Column<SizeRow>): Column<SizeRow> => ({ ...column, width: "grow" });

const scaleColumns: Column<SizeRow>[] = [tokenColumn, valueColumn, fill(gaugeColumn)];

const offsetColumns: Column<SizeRow>[] = [tokenColumn, fill(valueColumn)];

const spacingColumns: Column<SizeRow>[] = [tokenColumn, valueColumn, gaugeColumn, fill(useColumn)];

// One scale, read as a table: a row to the token, what it resolves to set beside what it is
// called and, where there is a length to draw, what it is worth
const Section = ({ id, title, note, data, columns }: SectionProps) => {
    const noteId = `${id}-note`;

    return (
        <Table.Container>
            <Table.Title as="h2" id={id}>
                {title}
            </Table.Title>
            {/* The container lays its parts out by name rather than in the order they are
                written, so what heads the table is given the slot meant for it rather than
                left to fall into whichever one is still free */}
            {note ? (
                <Table.Subtitle as="p" id={noteId} className={classes.prose}>
                    {note}
                </Table.Subtitle>
            ) : null}
            <DataTable
                data={data}
                columns={columns}
                aria-labelledby={id}
                aria-describedby={note ? noteId : undefined}
            />
        </Table.Container>
    );
};

// What everything in the library is measured by. Held at the same two levels the colours are: a
// scale underneath, and a set of names above it for how much room something is being given
const PrimitivesSize = () => {
    const [ref, values] = useResolvedValues(names);

    const scaleRows: SizeRow[] = steps.map((step) => ({
        id: step,
        token: sizeToken(step),
        value: values[sizeToken(step)],
    }));

    const offsetRows: SizeRow[] = offsetSteps.map((step) => ({
        id: step,
        token: offsetToken(step),
        value: values[offsetToken(step)],
    }));

    const spacingRows: SizeRow[] = spaces.map(({ name, use }) => ({
        id: name,
        token: spaceToken(name),
        value: values[spaceToken(name)],
        use,
    }));

    return (
        <Stack ref={ref} gap="spacious" paddingBlock="spacious">
            <Stack gap="normal" className={classes.prose}>
                <Heading as="h1" size="large">
                    Size
                </Heading>
                <Text as="p" size="large">
                    One scale, named by what each step is worth in pixels at the root font size, so{" "}
                    <Code>--base-size-16</Code> is <Code>1rem</Code>. Everything the library
                    measures is a step of it or a token built out of one: control heights, overlay
                    widths, the padding inside a component and the gap between two of them.
                </Text>
                <Text as="p">
                    The steps are declared in rem rather than pixels, so the whole interface follows
                    a reader who has changed the size their browser sets text at, rather than
                    holding still around text that has grown.
                </Text>
            </Stack>
            <Section id="scale" title="Scale" data={scaleRows} columns={scaleColumns} />
            <Section
                id="offsets"
                title="Offsets"
                note={
                    <>
                        The same scale negated, for pulling something back over what it stands in.
                        There is nothing to draw, since a negative width is a direction rather than
                        a length.
                    </>
                }
                data={offsetRows}
                columns={offsetColumns}
            />
            <Section
                id="spacing"
                title="Spacing"
                note={
                    <>
                        The semantic level. A component reaches for one of these rather than for a
                        step, so what it says is how much room it means to leave rather than how
                        many pixels it settled on.
                    </>
                }
                data={spacingRows}
                columns={spacingColumns}
            />
        </Stack>
    );
};

export default PrimitivesSize;
