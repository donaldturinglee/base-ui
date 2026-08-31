import * as React from "react";
import {
    AnchoredOverlay as AnchoredOverlayComponent,
    Button,
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
};

// What the overlay is announced as. It takes focus and holds it while it stands, so it is named
// and given the role of the thing it behaves as, rather than left as a box focus has moved into
// for no reason a screen reader can give
const overlayProps = {
    role: "dialog",
    "aria-modal": true,
    "aria-label": "Monalisa Octocat",
} as const;

// The plainest overlay there is: a button, and the surface it stands out from.
//
// Whether it is open is the caller's to keep, so the example keeps it and is a component of its
// own rather than an element the page holds ready. The anchor is rendered by the overlay rather
// than written beside it, which is how everything the overlay needs of an anchor is spread onto
// whatever the caller wrote.
//
// The card draws what it is handed in a column, and a column runs what stands in it out to its
// width, so the button is held to the start of it rather than run across the card. The Stack is
// the page's own furniture, as the card around it is, so the listing beneath is of the overlay
// alone.
//
// The page and the component it is about are both called AnchoredOverlay, so the component is
// brought in under a name saying which of the two it is. The listing beneath says AnchoredOverlay,
// as an application importing it would
const DefaultPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack align="start">
            <AnchoredOverlayComponent
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
                overlayProps={overlayProps}
            >
                <Stack gap="condensed" padding="normal">
                    <Text weight="medium">Monalisa Octocat</Text>
                    <Text size="medium">Former beach cat and champion swimmer.</Text>
                </Stack>
            </AnchoredOverlayComponent>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. The overlay is told whether it is
// open rather than keeping it, so the state is the caller's and is got ready here
const defaultSetup = `const [open, setOpen] = React.useState(false);`;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<AnchoredOverlay
    open={open}
    onOpen={() => setOpen(true)}
    onClose={() => setOpen(false)}
    renderAnchor={(props) => <Button {...props}>Open overlay</Button>}
    overlayProps={{ role: "dialog", "aria-modal": true, "aria-label": "Monalisa Octocat" }}
>
    <Stack gap="condensed" padding="normal">
        <Text weight="medium">Monalisa Octocat</Text>
        <Text size="medium">Former beach cat and champion swimmer.</Text>
    </Stack>
</AnchoredOverlay>`;

// The overlay as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: <DefaultPreview />,
        setup: defaultSetup,
        code: defaultCode,
    },
];

// What renders the anchor. An overlay standing against something already on the page renders no
// anchor of its own, which is what the null is for, and is handed a ref to it instead. It is
// written as the library names it rather than as the function it resolves to, since the name is
// what a caller is held to and the signature spelled out here runs past the width of the table
const renderAnchor = "AnchoredOverlayAnchorRenderer | null";

// Which side of the anchor the overlay stands on
const side = '"outside-top" | "outside-right" | "outside-bottom" | "outside-left"';

// Which end of the anchor the overlay is lined up with
const align = '"start" | "center" | "end"';

// A step of the overlay width scale, or the width of whatever the overlay holds
const width = '"xsmall" | "small" | "medium" | "large" | "xlarge" | "auto"';

// A step of the overlay height scale, or the height of whatever the overlay holds
const height = '"small" | "medium" | "large" | "xlarge" | "auto"';

// A narrow viewport has no room to stand an overlay beside its anchor, so it can be given the
// whole screen instead. It is written as the library writes it, since what a caller is held to is
// one value or one value to a breakpoint rather than either on its own
const variant = 'ResponsiveValue<"anchored", "anchored" | "fullscreen">';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the overlay takes. It is the one component rather than a component with parts hanging
// off it, so there is the one table.
//
// What it stands against is written up first, since an overlay cannot be drawn without something
// to stand against, and where it is put follows: which side, how far off, and how big
const groups: ComponentPropGroup[] = [
    {
        name: "AnchoredOverlay",
        props: [
            {
                name: "open",
                type: "boolean",
                required: true,
                description:
                    "Whether the overlay is shown. It is always the caller's to keep, since the overlay holds no state of its own",
            },
            {
                name: "renderAnchor",
                type: renderAnchor,
                required: true,
                description:
                    "Renders the element the overlay stands against. Everything the overlay needs of an anchor is handed to it and has to be spread onto whatever it returns",
            },
            {
                name: "anchorRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Stands in for the ref the overlay would otherwise hold its anchor with. It is what an overlay rendering no anchor of its own is given, since it has nothing else to measure against",
            },
            {
                name: "anchorId",
                type: "string",
                description: "Stands in for the id the overlay would otherwise give the anchor",
            },
            {
                name: "side",
                type: side,
                default: '"outside-bottom"',
                description:
                    "Which side of the anchor the overlay stands on. It is moved to the opposite side where the side it was asked for has no room left for it",
            },
            {
                name: "align",
                type: align,
                default: '"start"',
                description: "Which end of the anchor the overlay is lined up with",
            },
            {
                name: "anchorOffset",
                type: "number",
                default: "4",
                description: "How far the overlay stands clear of the anchor",
            },
            {
                name: "alignmentOffset",
                type: "number",
                default: "0",
                description: "How far it is moved along the edge it is lined up against",
            },
            {
                name: "width",
                type: width,
                default: '"auto"',
                description: "How wide the overlay is drawn, or the width of whatever it holds",
            },
            {
                name: "height",
                type: height,
                default: '"auto"',
                description: "How tall the overlay is drawn, or the height of whatever it holds",
            },
            {
                name: "variant",
                type: variant,
                default: '{ regular: "anchored", narrow: "anchored" }',
                description:
                    "Whether the overlay stands against its anchor or takes the whole screen, which is what a viewport with no room beside the anchor can be given",
            },
            {
                name: "preventOverflow",
                type: "boolean",
                default: "true",
                description:
                    "Holds the overlay to its own width, rather than narrowing it to what the viewport has room for",
            },
            {
                name: "displayCloseButton",
                type: "boolean",
                default: "true",
                description:
                    "Shows the button that closes the overlay. It is only drawn on the screens the overlay fills, since anywhere else it is closed by clicking off it",
            },
            {
                name: "closeButtonProps",
                type: "AnchoredOverlayCloseButtonProps",
                description:
                    "Props for that button. Closing the overlay is all it does, so what it is for is not among them",
            },
            {
                name: "overlayProps",
                type: "AnchoredOverlayOverlayProps",
                description:
                    "Props for the overlay itself, which is an element of its own beside the anchor. It is where the overlay is named and given the role of whatever it behaves as",
            },
            {
                name: "focusTrapSettings",
                type: "AnchoredOverlayFocusTrapSettings",
                description:
                    "Settings for the focus trap the overlay holds focus with. What holds focus is the overlay, so it is not among them",
            },
            styling,
            {
                name: "onOpen",
                type: "(gesture: AnchoredOverlayOpenGesture, event?: React.KeyboardEvent<HTMLElement>) => void",
                description:
                    "Called when the overlay is closed and a gesture that would open it is made, which is a press on the anchor or a key pressed on it that would open a menu",
            },
            {
                name: "onClose",
                type: "(gesture: AnchoredOverlayCloseGesture) => void",
                description:
                    "Called when the overlay is open and a gesture that would dismiss it is made: a press on the anchor, a press anywhere else, Escape, or the close button",
            },
            {
                name: "onPositionChange",
                type: "(event: { position: AnchoredPosition }) => void",
                description: "Called whenever the overlay is placed, with where it ended up",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the overlay is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const AnchoredOverlay = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                AnchoredOverlay
            </Heading>
            <Text as="p" size="large">
                A surface that stands against something on the page rather than over the whole of
                it. It is measured as it opens, so it is put on the side of its anchor that has room
                for it, and it is dismissed by the anchor again, by Escape, or by a press that lands
                anywhere else.
            </Text>
        </Stack>
        <ComponentExamples component="AnchoredOverlay" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default AnchoredOverlay;
