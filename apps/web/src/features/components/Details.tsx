import * as React from "react";
import {
    Button,
    Details as DetailsComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // What the disclosure holds runs to the width of whatever it was put in, and across the whole
    // of the card that would be one long line. It is given a width to be read at instead
    preview: "w-[20rem]",
};

// What every example is a disclosure of. It is written once and read out into each of them, since
// what the examples are about is the disclosure rather than the words inside it, and words that
// changed between them would be read as though they were the point
const content = "The branch was merged an hour ago, and the two commits on it are now on main.";

// The plainest disclosure there is: the summary that is always read, and what it holds, which is
// only there once the summary has been used. It keeps its own state, since nothing was handed one
// to hold.
//
// The summary is drawn as a button. A summary is given no appearance of its own by the library —
// only the browser's own marker is taken off it — so what it is to look like is handed to it, and
// a press is what a disclosure is opened by.
//
// The width it is held to is the page's own furniture, as the card around it is, so the listing
// beneath is of the disclosure alone: standing in an application, it fills whatever it was put in.
//
// The page and the component it is about are both called Details, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Details, as an application
// importing it would
const defaultPreview = (
    <DetailsComponent className={classes.preview}>
        <DetailsComponent.Summary as={Button}>See details</DetailsComponent.Summary>
        <Text as="p">{content}</Text>
    </DetailsComponent>
);

// What the examples have to have in hand before they can be drawn. The words are written once and
// read out into each of them, rather than run out along a line that would then have to be read
// across
const contentSetup = `const content = "The branch was merged an hour ago, and the two commits on it are now on main.";`;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Details>
    <Details.Summary as={Button}>See details</Details.Summary>
    <Text as="p">{content}</Text>
</Details>`;

// A summary written as the element itself rather than as the library's part. The disclosure opens
// and closes from whatever summary it holds, so markup that is already a summary is left as it is
// rather than being put through a component to be recognised
const plainSummaryPreview = (
    <DetailsComponent className={classes.preview}>
        <summary>See details</summary>
        <Text as="p">{content}</Text>
    </DetailsComponent>
);

const plainSummaryCode = `<Details>
    <summary>See details</summary>
    <Text as="p">{content}</Text>
</Details>`;

// A disclosure that starts out open, for where there is nothing to be gained by hiding what is
// there. It is still keeping its own state, so it is closed from the summary rather than from
// outside
const openPreview = (
    <DetailsComponent defaultOpen className={classes.preview}>
        <DetailsComponent.Summary as={Button}>See details</DetailsComponent.Summary>
        <Text as="p">{content}</Text>
    </DetailsComponent>
);

const openCode = `<Details defaultOpen>
    <Details.Summary as={Button}>See details</Details.Summary>
    <Text as="p">{content}</Text>
</Details>`;

// A disclosure that closes again where a click lands anywhere else, which is what one standing over
// the page rather than in it wants. Everything the disclosure holds is left alone, so a click
// inside what it opened does not put it away again.
//
// The line beneath is part of what is being shown rather than the page's own furniture, since a
// disclosure that closes when it is clicked away from says nothing about itself until it is
const outsideClickPreview = (
    <Stack gap="condensed" className={classes.preview}>
        <DetailsComponent closeOnOutsideClick>
            <DetailsComponent.Summary as={Button}>See details</DetailsComponent.Summary>
            <Text as="p">{content}</Text>
        </DetailsComponent>
        <Text size="small">Clicking anywhere else closes it again.</Text>
    </Stack>
);

const outsideClickCode = `<Stack gap="condensed">
    <Details closeOnOutsideClick>
        <Details.Summary as={Button}>See details</Details.Summary>
        <Text as="p">{content}</Text>
    </Details>
    <Text size="small">Clicking anywhere else closes it again.</Text>
</Stack>`;

// The disclosure with whether it is open held by whoever is drawing it rather than by the
// disclosure. It is a component of its own rather than an element the page holds ready, since the
// state has to be kept somewhere for it to be handed back down.
//
// What the caller does with the state is the reason for holding it at all, so it is put to use
// beside the disclosure rather than only stored: the two buttons open and close it from outside,
// which is the whole of what holding it is good for
const ControlledPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="condensed" className={classes.preview}>
            <DetailsComponent open={open} onChange={setOpen}>
                <DetailsComponent.Summary as={Button}>See details</DetailsComponent.Summary>
                <Text as="p">{content}</Text>
            </DetailsComponent>
            <Stack direction="horizontal" gap="condensed">
                <Button size="small" onClick={() => setOpen(true)}>
                    Show
                </Button>
                <Button size="small" onClick={() => setOpen(false)}>
                    Hide
                </Button>
            </Stack>
            <Text size="small">{open ? "Open" : "Closed"}</Text>
        </Stack>
    );
};

// The disclosure is told whether it is open rather than keeping it, so the state is the caller's
// and is got ready here, beside the words every example is a disclosure of
const controlledSetup = `${contentSetup}

const [open, setOpen] = React.useState(false);`;

const controlledCode = `<Stack gap="condensed">
    <Details open={open} onChange={setOpen}>
        <Details.Summary as={Button}>See details</Details.Summary>
        <Text as="p">{content}</Text>
    </Details>
    <Stack direction="horizontal" gap="condensed">
        <Button size="small" onClick={() => setOpen(true)}>
            Show
        </Button>
        <Button size="small" onClick={() => setOpen(false)}>
            Hide
        </Button>
    </Stack>
    <Text size="small">{open ? "Open" : "Closed"}</Text>
</Stack>`;

// The disclosure as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: contentSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A summary of your own",
        description:
            "The summary written as the element itself rather than as the library's part. The disclosure opens and closes from whatever summary it holds, so markup that is already a summary is left as it is. What the part adds is the browser's marker taken off and a pointer over it, which a summary written by hand takes on itself.",
        setup: contentSetup,
        preview: plainSummaryPreview,
        code: plainSummaryCode,
    },
    {
        name: "Open to start",
        description:
            "A disclosure that starts out open, for where there is nothing to be gained by hiding what is there. It is read once, so a disclosure started this way is closed by whoever is using it rather than from outside.",
        setup: contentSetup,
        preview: openPreview,
        code: openCode,
    },
    {
        name: "Close on outside click",
        description:
            "A disclosure that closes again where a click lands anywhere else, which is what one standing over the page rather than in it wants. Everything the disclosure holds is left alone, including the summary that closes it on its own, so a click inside what it opened does not put it away.",
        setup: contentSetup,
        preview: outsideClickPreview,
        code: outsideClickCode,
    },
    {
        name: "Controlled",
        description:
            "Whether the disclosure is open held by whoever is drawing it rather than by the disclosure. It is told where it stands and says where it has been put, which is what a disclosure standing beside anything else that has to agree with it is given. The browser is what opens and closes the element, so one opened behind React's back is put back to whatever was last asked for.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the disclosure and its summary take, under the part that takes it.
//
// The disclosure comes first, since whether it is open is the whole of what a disclosure is; the
// summary follows, with the one prop that is its own, since what it is for is said by where it is
// written rather than by anything it is told
const groups: ComponentPropGroup[] = [
    {
        name: "Details",
        props: [
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description:
                    "Whether the disclosure starts out open, for one that keeps hold of the state itself. It is read once, so a disclosure started this way is closed from the summary rather than from outside",
            },
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the disclosure is open, where the state is held by whoever is drawing it rather than by the disclosure. Given this, it is put back to whatever was last asked for on every render, since the browser opening the element is the one case that has to be caught",
            },
            {
                name: "closeOnOutsideClick",
                type: "boolean",
                default: "false",
                description:
                    "Closes the disclosure again where a click lands anywhere outside of it. Everything the disclosure holds is left alone, so a click inside what it opened does not put it away",
            },
            {
                name: "onChange",
                type: "(open: boolean) => void",
                description:
                    "Called with whether the disclosure is open whenever it opens or closes. It takes the place of the element's own onChange, which says only that something happened rather than what it now is",
            },
            styling,
        ],
    },
    {
        name: "Details.Summary",
        props: [
            {
                name: "as",
                type: "React.ElementType",
                default: '"summary"',
                description:
                    "The element or component this is drawn as, in place of its default. A summary is given no appearance of its own, so what it is to look like is handed to it — a button, most often, since a press is what a disclosure is opened by. Whatever it is drawn as is still a summary in the end, since that is the element the disclosure opens and closes from",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the disclosure is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Details = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Details
            </Heading>
            <Text as="p" size="large">
                A summary that is always there, and something behind it that is only there once the
                summary has been used. It is the browser's own disclosure underneath, so it opens
                and closes without being told to and is found by a page search either way. The
                summary is given no appearance of its own — what it is to look like is handed to it,
                a button most often, since a press is what a disclosure is opened by.
            </Text>
        </Stack>
        <ComponentExamples component="Details" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Details;
