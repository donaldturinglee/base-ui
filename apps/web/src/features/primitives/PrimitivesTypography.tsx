import type { ReactNode } from "react";
import { Code, DataTable, Heading, Stack, Table, Text } from "@gamecrafters/base-ui/react";
import type { Column } from "@gamecrafters/base-ui/react";
import { useResolvedValues } from "./hooks";

const classes = {
    prose: "max-w-[46rem]",
    // A line height only shows itself over more than one line, so its specimen is given a width
    // narrow enough to wrap in
    paragraph: "max-w-[28rem]",
    muted: "text-[var(--foreground-color-muted)]",
    value: "text-[var(--foreground-color-muted)] font-[family-name:var(--font-stack-monospace)]",
};

// The size scale, largest first, so it is read the way it is drawn
const sizes = [
    { name: "2xl", pixels: "40px" },
    { name: "xl", pixels: "32px" },
    { name: "lg", pixels: "20px" },
    { name: "md", pixels: "16px" },
    { name: "sm", pixels: "14px" },
    { name: "xs", pixels: "12px" },
];

const weights = ["light", "normal", "medium", "semibold"];

const lineHeights = [
    { name: "tight", use: "One line in a compact control" },
    { name: "snug", use: "Display text and large headings" },
    { name: "normal", use: "Body text, and anything unsure of itself" },
    { name: "relaxed", use: "Longer content, and the smaller sizes" },
    { name: "loose", use: "Footnotes and legal text, used sparingly" },
];

const stacks = [
    { name: "sans-serif", use: "Body text and the interface generally" },
    { name: "sans-serif-display", use: "Headings and titles" },
    { name: "monospace", use: "Code, and anything read as a value" },
];

const sizeToken = (name: string) => `--base-text-size-${name}`;

const weightToken = (name: string) => `--base-text-weight-${name}`;

const lineHeightToken = (name: string) => `--base-text-line-height-${name}`;

const stackToken = (name: string) => `--font-stack-${name}`;

// Every token the page reads, named once at the module so the list handed to the hook is the
// same list on every render and the read is not repeated for a reason that is not a change
const names = [
    ...sizes.map(({ name }) => sizeToken(name)),
    ...weights.map(weightToken),
    ...lineHeights.map(({ name }) => lineHeightToken(name)),
    ...stacks.map(({ name }) => stackToken(name)),
];

const specimen = "The quick brown fox jumps over the lazy dog";

// One row of a scale. The table tells its rows apart by a field of their own, and a token is
// named once within the scale it belongs to, so the name is what stands as the id
type ScaleRow = {
    id: string;
    token: string;
    // What the token resolves to under the scheme in force, which is read from the document and
    // so is not there for the first render
    value?: string;
    // What a size comes to in pixels, which is the same size said the other way round rather than
    // a second value, and so is set under the first rather than beside it
    pixels?: string;
    // What the token is for, where the name alone does not say it
    note?: string;
};

type ScaleProps = {
    // Names the table, and is what the table points `aria-labelledby` at
    id: string;
    title: string;
    // Whatever has to be said about the scale before it is read
    note?: ReactNode;
    data: ScaleRow[];
    columns: Column<ScaleRow>[];
};

// What the token does to the type, which is the point of the row and so is what leads it. It is
// the column that gives its width up, since the type it draws is wider than any name beside it
// and would otherwise push the table past the width of the page
const specimenColumn = (renderCell: (row: ScaleRow) => ReactNode): Column<ScaleRow> => ({
    id: "specimen",
    header: "Specimen",
    width: "growCollapse",
    // A column that gives its width up has none of its own to keep, and a scale whose values run
    // long would take the lot: the type would be left drawn a word to a line, in a column too
    // narrow to hold the word, and so over the top of the one beside it
    minWidth: "16rem",
    renderCell,
});

// A token is read as a value rather than as prose, so it is set in the monospace stack the rest
// of the library sets code in
const tokenColumn: Column<ScaleRow> = {
    header: "Token",
    field: "token",
    width: "auto",
    // A name is read as one thing, so the column is never taken in past the longest of them and
    // broken across lines mid-token. What is read as prose beside it is left free to wrap
    minWidth: "max-content",
    rowHeader: true,
    renderCell: ({ token }) => (
        <Text size="small" className={classes.value}>
            {token}
        </Text>
    ),
};

const valueColumn: Column<ScaleRow> = {
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

const useColumn: Column<ScaleRow> = {
    header: "Use",
    field: "note",
    width: "auto",
    // Prose wraps where a name does not, but not to a word a line: below this the table is
    // scrolled across instead
    minWidth: "10rem",
    renderCell: ({ note }) => (
        <Text size="small" className={classes.muted}>
            {note}
        </Text>
    ),
};

// A size is read in rem and checked in pixels, so the two are said one under the other: the pair
// is the one value, and setting them on a line together left the column wider than the rest of the
// table has any use for
const sizeValueColumn: Column<ScaleRow> = {
    ...valueColumn,
    renderCell: ({ value, pixels }) => (
        <Text size="small" className={classes.value}>
            {value}
            {/* Nothing is read from the document on the first render, so until there is a value
                the pixels stand on their own rather than under a blank line */}
            {value && pixels ? <br /> : null}
            {pixels}
        </Text>
    ),
};

const sizeColumns: Column<ScaleRow>[] = [
    specimenColumn(({ token }) => <span style={{ fontSize: `var(${token})` }}>{specimen}</span>),
    tokenColumn,
    sizeValueColumn,
];

const weightColumns: Column<ScaleRow>[] = [
    specimenColumn(({ token }) => <span style={{ fontWeight: `var(${token})` }}>{specimen}</span>),
    tokenColumn,
    valueColumn,
    useColumn,
];

const lineHeightColumns: Column<ScaleRow>[] = [
    specimenColumn(({ token }) => (
        <p className={classes.paragraph} style={{ lineHeight: `var(${token})` }}>
            {specimen}, and then it does it again, and again, until there is more of it than will
            fit on one line and the spacing between the lines is what there is to look at.
        </p>
    )),
    tokenColumn,
    valueColumn,
    useColumn,
];

// A stack is a list of names rather than a single value, and a long one, so it stands at the end
// and is the column that gives its width up, wrapping within what is left rather than asking for
// the room the whole list would take on one line
const stackValueColumn: Column<ScaleRow> = {
    ...valueColumn,
    width: "growCollapse",
    // Once there is not room for every column at once the table is scrolled across rather than
    // squeezed, so the list keeps a width worth reading in instead of being wrung out to a word
    // a line and standing the rows as tall as it is long
    minWidth: "20rem",
};

const stackColumns: Column<ScaleRow>[] = [
    specimenColumn(({ token }) => <span style={{ fontFamily: `var(${token})` }}>{specimen}</span>),
    tokenColumn,
    useColumn,
    stackValueColumn,
];

// One scale, read as a table: a row to the token, the type it draws set beside what it is called
// and what it resolves to
const Scale = ({ id, title, note, data, columns }: ScaleProps) => {
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

// How the type is held, which is the same two levels the colours are held at: scales underneath,
// and a set of names above them for what a piece of text is doing
const PrimitivesTypography = () => {
    const [ref, values] = useResolvedValues(names);

    // A size is named in pixels whether or not the document has been read yet, so the pixels are
    // carried on the row in their own right and the resolved value is set above them once it has
    // been read
    const sizeRows: ScaleRow[] = sizes.map(({ name, pixels }) => ({
        id: name,
        token: sizeToken(name),
        value: values[sizeToken(name)],
        pixels,
    }));

    const weightRows: ScaleRow[] = weights.map((name) => ({
        id: name,
        token: weightToken(name),
        value: values[weightToken(name)],
        note: name,
    }));

    const lineHeightRows: ScaleRow[] = lineHeights.map(({ name, use }) => ({
        id: name,
        token: lineHeightToken(name),
        value: values[lineHeightToken(name)],
        note: use,
    }));

    const stackRows: ScaleRow[] = stacks.map(({ name, use }) => ({
        id: name,
        token: stackToken(name),
        value: values[stackToken(name)],
        note: use,
    }));

    return (
        <Stack ref={ref} gap="spacious" paddingBlock="spacious">
            <Stack gap="normal" className={classes.prose}>
                <Heading as="h1" size="large">
                    Typography
                </Heading>
                <Text as="p" size="large">
                    Underneath are three scales — size, weight and line height — and three font
                    stacks. Above them are the roles: <Code>display</Code>, <Code>title</Code>,{" "}
                    <Code>subtitle</Code>, <Code>body</Code>, <Code>caption</Code> and{" "}
                    <Code>code</Code>. A role is a whole setting rather than a size, so it names the
                    size, the weight, the line height and the stack together.
                </Text>
                <Text as="p">
                    Almost nothing reaches for a role directly. <Code>Heading</Code> and{" "}
                    <Code>Text</Code> are what an application writes, and each one is a role
                    underneath: a heading is a title, and text is body. Reaching past them is for
                    the cases they do not cover.
                </Text>
            </Stack>
            <Scale id="size" title="Size" data={sizeRows} columns={sizeColumns} />
            <Scale id="weight" title="Weight" data={weightRows} columns={weightColumns} />
            <Scale
                id="line-height"
                title="Line height"
                data={lineHeightRows}
                columns={lineHeightColumns}
            />
            <Scale
                id="font-stacks"
                title="Font stacks"
                note={
                    <>
                        Three names for what is very nearly one list: the display stack is the
                        sans-serif one said separately, so a decision about headings can be made
                        later without every heading having to be found first.
                    </>
                }
                data={stackRows}
                columns={stackColumns}
            />
        </Stack>
    );
};

export default PrimitivesTypography;
