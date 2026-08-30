import { Code, DataTable, Heading, Stack, Table, Text } from "@gamecrafters/base-ui/react";
import type { Column } from "@gamecrafters/base-ui/react";
import { useResolvedValues } from "./hooks";

const classes = {
    // The prose is read, the ramps below it are looked at, so only the prose is held to a measure
    prose: "max-w-[46rem]",
    // The chip and the value under it stand together as the one step, close enough to be read as
    // a pair rather than as two things that happen to share a cell
    step: "flex flex-col gap-[var(--base-size-2)]",
    // Every chip carries an outline of its own, since a step at either end of a ramp is drawn in
    // whatever the page behind it is drawn in and would otherwise have no edge at all. It is held
    // to a width rather than left to the value under it, so a step whose value has yet to be read
    // is still drawn the size of the ones beside it
    chip: "h-[2.5rem] w-[4.5rem] rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-muted)]",
    // The value is read as a value rather than as prose, so it is set in the monospace stack the
    // rest of the library sets code in
    value: "text-[var(--foreground-color-muted)] font-[family-name:var(--font-stack-monospace)]",
};

// The palette, one scale to a row. Neutral runs further than the rest because it is what the page
// itself is built out of, and needs steps between the two ends that the hues do not. White and
// black stand last, each the one colour rather than a ramp: they are the two ends neutral is
// anchored to, and are worth seeing beside the scales that are drawn from them
const scales = [
    { name: "neutral", steps: 14 },
    { name: "blue", steps: 10 },
    { name: "green", steps: 10 },
    { name: "yellow", steps: 10 },
    { name: "orange", steps: 10 },
    { name: "red", steps: 10 },
    { name: "purple", steps: 10 },
    { name: "pink", steps: 10 },
    { name: "coral", steps: 10 },
    { name: "white", steps: 1 },
    { name: "black", steps: 1 },
];

// A ramp names the step being asked for; a scale of one colour is named on its own, without an
// index, since that is how the two of them are declared
const token = (name: string, step: number, steps: number) =>
    steps === 1 ? `--base-color-${name}` : `--base-color-${name}-${step}`;

// Every token the page reads, named once at the module so the list handed to the hook is the
// same list on every render and the read is not repeated for a reason that is not a change
const names = scales.flatMap(({ name, steps }) =>
    Array.from({ length: steps }, (_, step) => token(name, step, steps)),
);

// The longest scale is what sets the width of the table, so every step of every scale has a
// column of its own to stand in
const stepCount = Math.max(...scales.map(({ steps }) => steps));

const titleId = "palette";

// One scale of the palette. The table tells its rows apart by a field of their own, and a scale
// is named once, so the name is what stands as the id
type ScaleRow = {
    id: string;
    name: string;
    // What each step resolves to under the scheme in force, in the order the steps are counted.
    // The read is of the document itself, so nothing is there for the first render
    values: string[];
};

const scaleColumn: Column<ScaleRow> = {
    header: "Scale",
    field: "name",
    width: "auto",
    minWidth: "max-content",
    rowHeader: true,
    renderCell: ({ name }) => (
        <Text size="small" weight="semibold">
            {name}
        </Text>
    ),
};

// One column to a step, so a step is read down the palette as well as across the scale it belongs
// to, which is what a step is chosen by. The headers are left empty, since a row of numbers across
// the top said nothing the token under each chip does not already say
const stepColumns: Column<ScaleRow>[] = Array.from({ length: stepCount }, (_, step) => ({
    id: `step-${step}`,
    header: "",
    width: "auto",
    minWidth: "max-content",
    renderCell: ({ name, values }) => {
        // A scale that stops short of the longest leaves the rest of its row empty, which is
        // what says it stops short
        if (step >= values.length) {
            return null;
        }

        const property = token(name, step, values.length);

        return (
            <div className={classes.step}>
                <div
                    className={classes.chip}
                    style={{ backgroundColor: `var(${property})` }}
                    title={property}
                />
                <Text size="small" className={classes.value}>
                    {values[step]}
                </Text>
            </div>
        );
    },
}));

const columns: Column<ScaleRow>[] = [scaleColumn, ...stepColumns];

// The palette the two schemes are declared as, which is worth seeing whole: a step is chosen by
// where it stands in its scale rather than by what it looks like on its own
const PrimitivesColor = () => {
    const [ref, values] = useResolvedValues(names);

    const rows: ScaleRow[] = scales.map((scale) => ({
        id: scale.name,
        name: scale.name,
        values: Array.from(
            { length: scale.steps },
            (_, step) => values[token(scale.name, step, scale.steps)],
        ),
    }));

    return (
        <Stack ref={ref} gap="spacious" paddingBlock="spacious">
            <Stack gap="normal" className={classes.prose}>
                <Heading as="h1" size="large">
                    Color
                </Heading>
                <Text as="p" size="large">
                    Colour is held at two levels. Underneath is the palette below — nine scales,
                    declared once for each scheme against <Code>[data-theme]</Code>, with every step
                    in one answered by a step of the same name in the other, and under them white
                    and black, which are the one colour rather than a ramp. Above it are the
                    semantic tokens, which are what a component actually names:{" "}
                    <Code>--foreground-color-danger</Code> rather than a red.
                </Text>
                <Text as="p">
                    Nothing is drawn from the palette directly. A component that named a colour
                    would be correct under the scheme it was written against and wrong under the
                    other one, so it names what the colour is for and is drawn correctly under both.
                    Every step below follows the scheme the page is being read under.
                </Text>
            </Stack>
            <Table.Container>
                <Table.Title as="h2" id={titleId}>
                    Palette
                </Table.Title>
                {/* The steps are narrow and there are a great many of them across, so the cells
                    are given the least room the library offers rather than the usual */}
                <DataTable
                    data={rows}
                    columns={columns}
                    cellPadding="condensed"
                    aria-labelledby={titleId}
                />
            </Table.Container>
        </Stack>
    );
};

export default PrimitivesColor;
