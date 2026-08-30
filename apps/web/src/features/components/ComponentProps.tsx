import {
    Code,
    DataTable,
    Heading,
    Separator,
    Stack,
    Table,
    Text,
    Token,
} from "@gamecrafters/base-ui/react";
import type { Column } from "@gamecrafters/base-ui/react";
import type { ComponentProp, ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // What a prop is called and whether it has to be given are read as the one thing, so they
    // stand together on a line rather than a column apart from each other. What is said about the
    // prop runs to more than one line, so they are set against the top of the row rather than down
    // the middle of it, where they would stand level with nothing
    prop: "flex flex-wrap items-center gap-[var(--base-size-8)] self-start",
    // A name is read as a value rather than as prose, so it is set in the monospace stack the
    // rest of the library sets code in. It is read in a column rather than inside a line, with no
    // words around it to be told apart from, so it is left without the ground a fragment of code
    // read in prose is given
    name: "font-[family-name:var(--font-stack-monospace)]",
    // A type is a fragment of code and is given a ground of its own like one, so that it is told
    // apart from the prose it stands over. It is held to its own width, since a block standing in
    // a stack is otherwise drawn the whole way across and the ground with it
    type: "self-start",
    // The values a prop takes are read across rather than down, and there are rarely more than
    // a handful, so they stay on one line for as long as there is room for them
    options: "flex flex-wrap gap-[var(--base-size-4)]",
    // A default is set against the top of the row for the same reason a name is, which puts it
    // level with the type it is the value of
    default: "self-start",
    muted: "text-[var(--foreground-color-muted)]",
};

// The table tells its rows apart by a field of their own, and a prop is named once within the
// part that takes it, so the name is what stands as the id
type PropRow = ComponentProp & { id: string };

// A name, and after it whether the prop has to be given. Only a prop that is required says so:
// one that is not is left to say nothing, since a prop is optional unless it says otherwise, and
// answering "no" would be read as a value the prop carries
const Name = ({ name, required }: ComponentProp) => (
    <div className={classes.prop}>
        <Text size="small" className={classes.name}>
            {name}
        </Text>
        {required ? <Token size="small" text="Required" /> : null}
    </div>
);

// What the prop comes to where it is left out. A prop with no default of its own leaves the cell
// empty, since anything standing in it would be read as a value the prop falls back to
const Default = ({ default: fallback }: ComponentProp) =>
    fallback ? <Code className={classes.default}>{fallback}</Code> : null;

// A type is written out rather than resolved, and the values it takes are named beneath it where
// it names them one by one. A shape has nothing to list, so nothing is listed
const Type = ({ type, options }: ComponentProp) => (
    <Stack gap="condensed">
        <Code className={classes.type}>{type}</Code>
        {options?.length ? (
            <div className={classes.options}>
                {options.map((option) => (
                    <Code key={option}>{option}</Code>
                ))}
            </div>
        ) : null}
    </Stack>
);

// What the prop takes, and under it what it is for. The type is what a caller is actually held
// to, so it is read first and the prose that follows says why the prop is there
const Description = ({ description, ...prop }: ComponentProp) => (
    <Stack gap="condensed">
        <Type {...prop} />
        <Text size="small" className={description ? undefined : classes.muted}>
            {description ?? "—"}
        </Text>
    </Stack>
);

const columns: Column<PropRow>[] = [
    {
        header: "Name",
        field: "name",
        // A name is short and the column beside it is prose, so the names are given no more room
        // than the longest of them takes and the rest of the table is left to what is said about
        // them
        width: "auto",
        rowHeader: true,
        renderCell: (prop) => <Name {...prop} />,
    },
    {
        header: "Default",
        field: "default",
        // A default is as short as a name is, and the prose beside it is what the table has room
        // to spare for
        width: "auto",
        renderCell: (prop) => <Default {...prop} />,
    },
    {
        header: "Description",
        field: "description",
        renderCell: (prop) => <Description {...prop} />,
    },
];

// What stands under the name of the type rather than in the table: that a part declares nothing
// of its own, which is worth saying where the table would otherwise be a title with nothing
// underneath it
const note = ({ props }: ComponentPropGroup) => (props.length ? undefined : "Nothing of its own.");

// One table to the part the props are taken by, so a part can be told from the component it
// hangs off
const Group = (group: ComponentPropGroup) => {
    const { name, props } = group;
    const titleId = `props-${name}`;
    const noteId = `${titleId}-note`;
    const summary = note(group);
    const data: PropRow[] = props.map((prop) => ({ ...prop, id: prop.name }));

    return (
        <Table.Container>
            <Table.Title as="h3" id={titleId}>
                {name}
            </Table.Title>
            {/* The container lays its parts out by name rather than in the order they are
                written, so what heads the table is given the slot meant for it rather than
                left to fall into whichever one is still free */}
            {summary ? (
                <Table.Subtitle as="p" id={noteId}>
                    {summary}
                </Table.Subtitle>
            ) : null}
            {data.length ? (
                <DataTable
                    data={data}
                    columns={columns}
                    aria-labelledby={titleId}
                    aria-describedby={summary ? noteId : undefined}
                />
            ) : null}
        </Table.Container>
    );
};

// Every prop the component and its parts take, as the page declares them. The tables are the one
// thing every component page is built the same way out of, so they are written once here and each
// page hands over what it has to say rather than laying the tables out again
const ComponentProps = ({ groups }: { groups: ComponentPropGroup[] }) => {
    if (!groups.length) {
        return null;
    }

    return (
        <Stack gap="spacious">
            <Heading as="h2" size="small">
                Props
            </Heading>
            {/* Every table under the heading is titled in its own right, so where the section
                begins is said by a line rather than left to the spacing alone */}
            <Separator />
            {groups.map((group) => (
                <Group key={group.name} {...group} />
            ))}
        </Stack>
    );
};

export default ComponentProps;
