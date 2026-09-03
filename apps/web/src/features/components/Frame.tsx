import * as React from "react";
import { Button, Frame as FrameComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A frame is drawn without a border of its own and has no say in how large it is, so an
    // example given neither would be a piece of writing with no edges anywhere and the height the
    // browser falls back to. Both are given here, and a ground with them: the ground is white
    // outright rather than the colour the page is drawn in, because what stands on it is a
    // document the page's properties were never declared in and is written in fixed colours
    frame: "w-full max-w-[26rem] rounded-[var(--border-radius-medium)] border border-solid border-[var(--border-color-default)] bg-white",
    // A rule of the page's, put on something inside the frame as well as on something outside it.
    // It is what the isolation example is about rather than furniture around it, so it is written
    // out with the example
    tinted: "font-semibold text-[var(--foreground-color-danger)]",
};

// A frame carries none of the page's styles, so what is put inside one is written with styles of
// its own rather than with the classes the rest of the page reaches for. The colours are said
// outright rather than pointed at the properties everything else here is drawn by, since those are
// declared on this document and the frame's is not reached by them
const body: React.CSSProperties = {
    font: "14px system-ui, sans-serif",
    color: "#1f2328",
    display: "grid",
    gap: "8px",
    padding: "16px",
};

// The styles the frame is handed, which is how what it holds comes to be read under anything at
// all. The rule on the paragraph is there to be seen arriving: nothing else on the page would draw
// it that colour
const styles =
    "body { font: 14px system-ui, sans-serif; color: #1f2328; padding: 16px } " +
    "p { color: rebeccapurple }";

// The document the caller writes rather than the one the frame would have written. It lays down
// the node the frame draws into, so the children land where the caller meant them to; a document
// that leaves none has the body stand in for it. The margins are taken away here rather than
// inherited, since a caller writing the document is writing the whole of it
const ownDocument =
    "<!doctype html><html><head><style>" +
    "body{margin:0;font:14px system-ui,sans-serif;background:#101828;color:#e6edf3}" +
    ".frame-root{padding:16px}" +
    "</style></head><body><div class='frame-root'></div></body></html>";

// What the examples have to have in hand before they can be drawn: the class the frame is drawn
// with, since it has neither edges nor a size of its own, and the styles whatever it holds is
// written in, since none of the page's reach inside it. They are written once and reached for by
// each example rather than run out along lines that would then have to be read across
const frameSetup = `const frame =
    "w-full max-w-[26rem] rounded-[var(--border-radius-medium)] " +
    "border border-solid border-[var(--border-color-default)] bg-white";`;

const bodySetup = `${frameSetup}

const body = {
    font: "14px system-ui, sans-serif",
    color: "#1f2328",
    display: "grid",
    gap: "8px",
    padding: "16px",
};`;

// The plainest frame there is: a name, a height, and something inside it. What it is read under is
// left out, so what is drawn is a document standing on nothing but the box model the browser
// applies of its own, which is what a frame comes to when it is not handed anything.
//
// The Stack that sets it in the middle of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the frame alone. The name and the height are not: a frame
// carries no words for a screen reader to read it by and no say in how tall it is, so both are the
// caller's to give and both are written out.
//
// The page and the component it is about are both called Frame, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Frame, as an application
// importing it would
const defaultPreview = (
    <Stack align="center">
        <FrameComponent title="A frame" height={120} className={classes.frame}>
            <div style={body}>
                Drawn inside a document of its own, which carries none of the page&apos;s styles.
            </div>
        </FrameComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Frame title="A frame" height={120} className={frame}>
    <div style={body}>
        Drawn inside a document of its own, which carries none of the page's styles.
    </div>
</Frame>`;

// The stylesheet the frame is read under, handed to it rather than reaching it from the page. It
// is written into the frame's own head, so it is the document inside that is restyled rather than
// the element holding it
const headPreview = (
    <Stack align="center">
        <FrameComponent
            title="A frame with styles of its own"
            height={120}
            className={classes.frame}
            head={<style>{styles}</style>}
        >
            <p>Read under the styles the frame was handed rather than the page&apos;s.</p>
        </FrameComponent>
    </Stack>
);

const headSetup = `${frameSetup}

const styles =
    "body { font: 14px system-ui, sans-serif; color: #1f2328; padding: 16px } " +
    "p { color: rebeccapurple }";`;

const headCode = `<Frame
    title="A frame with styles of its own"
    height={120}
    className={frame}
    head={<style>{styles}</style>}
>
    <p>Read under the styles the frame was handed rather than the page's.</p>
</Frame>`;

// The same class on either side of the boundary, which is the whole of what this example is about:
// the rule the page declares reaches the one outside and says nothing at all to the one inside.
// Both are written out, since a rule that reached only one of them would show nothing
const isolationPreview = (
    <Stack gap="normal" align="center">
        <Text className={classes.tinted}>Outside the frame, the page&apos;s rule reaches me</Text>
        <FrameComponent title="Out of the page's reach" height={96} className={classes.frame}>
            <div className={classes.tinted} style={body}>
                Inside the frame, the same class says nothing
            </div>
        </FrameComponent>
    </Stack>
);

const isolationSetup = `${bodySetup}

const tinted = "font-semibold text-[var(--foreground-color-danger)]";`;

const isolationCode = `<Stack gap="normal" align="center">
    <Text className={tinted}>Outside the frame, the page's rule reaches me</Text>
    <Frame title="Out of the page's reach" height={96} className={frame}>
        <div className={tinted} style={body}>
            Inside the frame, the same class says nothing
        </div>
    </Frame>
</Stack>`;

// A frame sized by what it holds rather than by what it was told. The reading it takes of its own
// document is put on the element as a custom property, so the height is written as that property
// rather than as a number, and the lines are added to under it so the frame can be watched growing
const FitPreview = () => {
    const [lines, setLines] = React.useState(2);

    return (
        <Stack gap="normal" align="center">
            <FrameComponent
                title="Sized by what it holds"
                className={classes.frame}
                style={{ height: "var(--frame-content-height)" }}
            >
                <div style={body}>
                    {Array.from({ length: lines }, (_, index) => (
                        <span key={index}>Line {index + 1} inside the frame</span>
                    ))}
                </div>
            </FrameComponent>
            <Button size="small" onClick={() => setLines((count) => (count % 5) + 1)}>
                Add a line
            </Button>
        </Stack>
    );
};

const fitSetup = `${bodySetup}

const [lines, setLines] = React.useState(2);`;

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the frame changing height as what is pressed beneath it adds to its contents
const fitCode = `<Stack gap="normal" align="center">
    <Frame
        title="Sized by what it holds"
        className={frame}
        style={{ height: "var(--frame-content-height)" }}
    >
        <div style={body}>
            {Array.from({ length: lines }, (_, index) => (
                <span key={index}>Line {index + 1} inside the frame</span>
            ))}
        </div>
    </Frame>
    <Button size="small" onClick={() => setLines((count) => (count % 5) + 1)}>
        Add a line
    </Button>
</Stack>`;

// A document the caller wrote, root and all. It is drawn on a ground of its own, which the frame
// the page put a white ground under is covered by: what a document of its own says goes, since
// nothing outside it is reaching in
const ownDocumentPreview = (
    <Stack align="center">
        <FrameComponent
            title="A document of the caller's"
            height={120}
            className={classes.frame}
            srcDoc={ownDocument}
        >
            <p>Drawn into a document the caller wrote, root and all.</p>
        </FrameComponent>
    </Stack>
);

const ownDocumentSetup = `${frameSetup}

const ownDocument =
    "<!doctype html><html><head><style>" +
    "body{margin:0;font:14px system-ui,sans-serif;background:#101828;color:#e6edf3}" +
    ".frame-root{padding:16px}" +
    "</style></head><body><div class='frame-root'></div></body></html>";`;

const ownDocumentCode = `<Frame
    title="A document of the caller's"
    height={120}
    className={frame}
    srcDoc={ownDocument}
>
    <p>Drawn into a document the caller wrote, root and all.</p>
</Frame>`;

// When the children reached the frame's document and when they left it. The frame is taken away
// and put back rather than only drawn, since the pair is only worth showing where both have
// something to say, and what they said is kept in a line under it to be read after the fact
const MountingPreview = () => {
    const [showing, setShowing] = React.useState(true);
    const [events, setEvents] = React.useState<string[]>([]);

    return (
        <Stack gap="normal" align="center">
            <Button size="small" onClick={() => setShowing((open) => !open)}>
                {showing ? "Take the frame away" : "Put the frame back"}
            </Button>
            {showing ? (
                <FrameComponent
                    title="A frame that says when it was drawn"
                    height={96}
                    className={classes.frame}
                    onMount={() => setEvents((seen) => [...seen, "mounted"])}
                    onUnmount={() => setEvents((seen) => [...seen, "unmounted"])}
                >
                    <div style={body}>Watch the line below</div>
                </FrameComponent>
            ) : null}
            <Text size="small">{events.length ? events.join(", ") : "Nothing yet"}</Text>
        </Stack>
    );
};

const mountingSetup = `${bodySetup}

const [showing, setShowing] = React.useState(true);
const [events, setEvents] = React.useState<string[]>([]);`;

const mountingCode = `<Stack gap="normal" align="center">
    <Button size="small" onClick={() => setShowing((open) => !open)}>
        {showing ? "Take the frame away" : "Put the frame back"}
    </Button>
    {showing ? (
        <Frame
            title="A frame that says when it was drawn"
            height={96}
            className={frame}
            onMount={() => setEvents((seen) => [...seen, "mounted"])}
            onUnmount={() => setEvents((seen) => [...seen, "unmounted"])}
        >
            <div style={body}>Watch the line below</div>
        </Frame>
    ) : null}
    <Text size="small">{events.length ? events.join(", ") : "Nothing yet"}</Text>
</Stack>`;

// The frame as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then what it is read under, then what that boundary is worth having for, and after
// those the two that hand the frame more than it would have settled for itself
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: bodySetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Styles of its own",
        description:
            "What is inside a frame is read under whatever the frame was handed rather than under the page, so a stylesheet or a font it needs goes in the head. It is written into the frame's own head, so it restyles the document inside rather than the element holding it.",
        setup: headSetup,
        preview: headPreview,
        code: headCode,
    },
    {
        name: "Out of the page's reach",
        description:
            "The same class on either side of the boundary: the page's rule reaches the one outside it and says nothing at all to the one inside. A Portal is the exception going the other way, since portal roots are registered against the page, so one written inside a frame still lands outside it unless the frame registers a root of its own and names it.",
        setup: isolationSetup,
        preview: isolationPreview,
        code: isolationCode,
    },
    {
        name: "Sized by what it holds",
        description:
            "A frame is sized by the element holding it rather than by what it holds, so it measures its own contents and puts the readings on the element as --frame-content-width and --frame-content-height. The height is the one worth taking: a block fills the width it is given, so a frame sized by the width it measured would be asking itself how wide it is.",
        setup: fitSetup,
        preview: <FitPreview />,
        code: fitCode,
    },
    {
        name: "A document of its own",
        description:
            "The whole document, written by the caller rather than by the frame. A node with the class frame-root is where the children are drawn, which the library exports as FRAME_ROOT_CLASS; a document that leaves none has its body stand in for it.",
        setup: ownDocumentSetup,
        preview: ownDocumentPreview,
        code: ownDocumentCode,
    },
    {
        name: "When it was drawn",
        description:
            "There is nothing to draw into until the frame's document is there, so the frame says when the children reached it and when they were taken back out again. The callbacks are read as they stand at the time rather than watched, so a fresh function on a later render does not read as the frame having been drawn again.",
        setup: mountingSetup,
        preview: <MountingPreview />,
        code: mountingCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the frame takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// What is handed to the document it writes comes first, then what says when that document was
// there to be drawn into, and last the one the element carries already and the library answers for
// where the caller does not. The rest are the iframe's own and are left to say for themselves.
//
// The document the frame writes where it is given none is named rather than quoted: it runs to a
// doctype, a reset and a root, and set down in full it would be read as something a caller is
// meant to type back
const groups: ComponentPropGroup[] = [
    {
        name: "Frame",
        props: [
            {
                name: "head",
                type: "React.ReactNode",
                description:
                    "Written into the frame's own head, for the stylesheets and the fonts whatever is drawn inside it is to be read under. A frame carries none of the page's styles, so anything it needs has to be handed to it here",
            },
            {
                name: "srcDoc",
                type: "string",
                default: "A reset and a root",
                description:
                    "The document the frame is drawn into. It is written into the frame rather than set as the attribute of the same name, which settles it before the frame returns and leaves no moment at which the children have nowhere to go. Where it is left out, the frame writes one that takes away the margins and the box model the browser applies of its own and lays down a root for the children",
            },
            {
                name: "onMount",
                type: "() => void",
                description:
                    "Called once the frame's document is there and the children have been drawn into it",
            },
            {
                name: "onUnmount",
                type: "() => void",
                description: "Called as the children are taken back out of that document again",
            },
            {
                name: "title",
                type: "string",
                description:
                    "What a screen reader reads the frame by. A frame carries no words of its own to be read by, so one naming it is made up where the caller gives none, which is enough to be moved through by and no substitute for saying what it holds",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the frame is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Frame = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Frame
            </Heading>
            <Text as="p" size="large">
                A document of its own, drawn into from this one. What is put inside is written with
                React as usual, but lands somewhere the page&apos;s styles do not reach and which
                gives none of its own back, which is what a frame is reached for: previewing
                something the page must not restyle, or holding something that must not restyle the
                page. It has no say in how large it is, since that is settled by the element holding
                it, but it measures its own contents, so a frame that should fit them can be sized
                from the readings.
            </Text>
        </Stack>
        <ComponentExamples component="Frame" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Frame;
