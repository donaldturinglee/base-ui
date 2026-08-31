import {
    CheckmarkCircleRegular,
    ErrorCircleRegular,
    InfoRegular,
    WarningRegular,
} from "@gamecrafters/base-ui-icons";
import { Alert as AlertComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // An icon put at the front of an alert stands on the text baseline, which sets it low beside
    // the words it is read with. The row sets the two on their centres instead. What is left
    // between them is the alert's own, and the icon is already drawn at the size of the text, so
    // neither is said again here
    row: "flex items-center",
};

// The plainest alert there is: the words it carries, and nothing said with a prop. What it is drawn
// as is left out, so it comes to the one that stands for news of no particular kind.
//
// The page and the component it is about are both called Alert, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Alert, as an application
// importing it would
const defaultPreview = <AlertComponent>A new version of the editor is available.</AlertComponent>;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Alert>A new version of the editor is available.</Alert>`;

// What kind of news the alert carries, which is the one thing it is told. The four are drawn
// together rather than one to an example, since what is worth seeing is how each reads against the
// others: on their own they are four alerts, and beside each other they are a scale.
//
// Each is given the icon that stands for what it is. The alert colours whatever icon is put in it
// to match the variant, so the icon is handed over as it comes and takes its colour from the alert
// around it. It says again what the colour already said, for a reader who does not take the colour,
// and the words say what happened either way, so it is left decorative rather than named
const variantsPreview = (
    <Stack gap="condensed">
        <AlertComponent className={classes.row}>
            <InfoRegular />A new version of the editor is available.
        </AlertComponent>
        <AlertComponent variant="success" className={classes.row}>
            <CheckmarkCircleRegular />
            Your changes have been saved.
        </AlertComponent>
        <AlertComponent variant="warning" className={classes.row}>
            <WarningRegular />
            This project has not been backed up in a month.
        </AlertComponent>
        <AlertComponent variant="danger" className={classes.row}>
            <ErrorCircleRegular />
            The last deploy failed and was rolled back.
        </AlertComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the four read one under the other, so it is written out with them. The row
// is written out as the class it stands for rather than as the name the page holds it under, since
// what is copied out of here has only itself to reach for
const variantsCode = `<Stack gap="condensed">
    <Alert className="flex items-center">
        <InfoRegular />
        A new version of the editor is available.
    </Alert>
    <Alert variant="success" className="flex items-center">
        <CheckmarkCircleRegular />
        Your changes have been saved.
    </Alert>
    <Alert variant="warning" className="flex items-center">
        <WarningRegular />
        This project has not been backed up in a month.
    </Alert>
    <Alert variant="danger" className="flex items-center">
        <ErrorCircleRegular />
        The last deploy failed and was rolled back.
    </Alert>
</Stack>`;

// The alert as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "What the alert is drawn as. The colour says how the message should be taken and the icon says it again, so the words are left to say what happened rather than to repeat it. An icon put inside an alert is coloured to match, so it is handed over as it comes.",
        preview: variantsPreview,
        code: variantsCode,
    },
];

// What kind of news the alert carries, which sets the ground it stands on, the line around it and
// the colour of any icon put inside it
const variant = '"default" | "success" | "warning" | "danger"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the alert takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table
const groups: ComponentPropGroup[] = [
    {
        name: "Alert",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "What kind of news the alert carries, which is what its colours are read as",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the alert is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Alert = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Alert
            </Heading>
            <Text as="p" size="large">
                A short message set apart from the page around it, coloured for the kind of news it
                carries. What it holds is whatever has to be said, so an icon or a link is put in it
                rather than declared by it.
            </Text>
        </Stack>
        <ComponentExamples component="Alert" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Alert;
