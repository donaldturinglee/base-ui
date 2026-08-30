import {
    Code,
    DataTable,
    Heading,
    Label,
    Separator,
    Stack,
    Table,
    Text,
} from "@gamecrafters/base-ui/react";
import type { Column } from "@gamecrafters/base-ui/react";
import type { ComponentProp, ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // A type is read as a value rather than as prose, so it is set in the monospace stack the
    // rest of the library sets code in
    type: "font-[family-name:var(--font-stack-monospace)]",
    // The values a prop takes are read across rather than down, and there are rarely more than
    // a handful, so they stay on one line for as long as there is room for them
    options: "flex flex-wrap gap-[var(--base-size-4)]",
    muted: "text-[var(--foreground-color-muted)]",
};

// The table tells its rows apart by a field of their own, and a prop is named once within the
// type it was declared in, so the name is what stands as the id
type PropRow = ComponentProp & { id: string };

// A type is written out rather than resolved, and the values it takes are named beneath it where
// it names them one by one. A shape has nothing to list, so nothing is listed
const Type = ({ type, options }: ComponentProp) => (
    <Stack gap="condensed">
        <Text size="small" className={classes.type}>
            {type}
        </Text>
        {options?.length ? (
            <div className={classes.options}>
                {options.map((option) => (
                    <Code key={option}>{option}</Code>
                ))}
            </div>
        ) : null}
    </Stack>
);

const columns: Column<PropRow>[] = [
    {
        header: "Prop",
        field: "name",
        rowHeader: true,
        renderCell: ({ name }) => <Code>{name}</Code>,
    },
    {
        header: "Type",
        field: "type",
        renderCell: (prop) => <Type {...prop} />,
    },
    {
        header: "Required",
        field: "required",
        width: "auto",
        // A prop that has to be given is said so; one that does not is left blank rather than
        // answered "no", which would be read as a value the prop carries
        renderCell: ({ required }) =>
            required ? (
                <Label variant="danger">Required</Label>
            ) : (
                <Text size="small" className={classes.muted}>
                    —
                </Text>
            ),
    },
    {
        header: "Description",
        field: "description",
        renderCell: ({ description }) => (
            <Text size="small" className={description ? undefined : classes.muted}>
                {description ?? "—"}
            </Text>
        ),
    },
];

// What stands under the name of the type rather than in the table: that a part declares nothing
// of its own, which is worth saying where the table would otherwise be a title with nothing
// underneath it
const note = ({ props }: ComponentPropGroup) => (props.length ? undefined : "Nothing of its own.");

// One table to the type the props were declared in, so a part can be told from the component it
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
