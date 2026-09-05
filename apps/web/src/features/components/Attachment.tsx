import {
    ArrowDownloadRegular,
    AttachRegular,
    DismissRegular,
    DocumentPdfRegular,
    ErrorCircleRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Attachment as AttachmentComponent,
    Heading,
    ProgressCircle,
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
    // What names the attachment for a screen reader without being drawn. The words the trigger is
    // laid over are already there to be seen, so saying them again where they can be seen would
    // say them twice
    hidden: "sr-only",
    // The marks and the indent a browser gives a list are taken off, since what stands in this one
    // is a card of its own rather than a line of prose. A list drawn without its marks is no longer
    // read as a list by some browsers, so it is told it is one
    list: "m-0 p-0 list-none",
};

// Where the picture is fetched from. It is the one the library's own stories are drawn with, so
// whatever is shown here and whatever is shown there are the same file
const source = "https://github.com/octocat.png";

// What an example has to have in hand before it can be drawn, written a line to the thing it
// settles so that an example takes only the lines it actually reaches for
const sourceSetup = `const source = "https://github.com/octocat.png";`;

const hiddenSetup = `const hidden = "sr-only";`;

const listSetup = `const list = "m-0 p-0 list-none";`;

// How far the file has got, in the order it passes through them: a place kept for a file that has
// not been chosen yet, the file on its way, the file being made sense of at the other end, the file
// that never arrived, and the file that did
const states = ["idle", "uploading", "processing", "error", "done"] as const;

const statesSetup = `const states = ["idle", "uploading", "processing", "error", "done"];`;

// Which step of the scale the attachment is drawn at
const sizes = ["small", "medium", "large"] as const;

const sizesSetup = `const sizes = ["small", "medium", "large"];`;

// More files than a run has room for, which is what a run is worth showing with: fewer would fit,
// and what the run does about the ones that do not is the whole of what it is for
const files = [
    "quarterly-report.pdf",
    "diagram.png",
    "budget.pdf",
    "minutes.pdf",
    "notes.pdf",
    "roadmap.pdf",
];

const filesSetup = `const files = [
    "quarterly-report.pdf",
    "diagram.png",
    "budget.pdf",
    "minutes.pdf",
    "notes.pdf",
    "roadmap.pdf",
];`;

// The names a run of files is drawn from, where what is being shown is the element each of them is
// drawn as rather than how many of them there are
const names = ["quarterly-report.pdf", "budget.pdf", "notes.pdf"];

const namesSetup = `const names = ["quarterly-report.pdf", "budget.pdf", "notes.pdf"];`;

// One file as it is most often drawn: the square standing for what kind of thing it is, the name
// and what it weighs beside it, and what can be done with it at the far end. Every part is written
// out rather than settled by a prop, since which of them an attachment carries is what tells one
// from the next: a thumbnail with no words is a tile, and a name with no actions is only there to
// be read.
//
// The page and the component it is about are both called Attachment, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Attachment, as an application
// importing it would
const defaultPreview = (
    <AttachmentComponent>
        <AttachmentComponent.Media>
            <DocumentPdfRegular />
        </AttachmentComponent.Media>
        <AttachmentComponent.Content>
            <AttachmentComponent.Title>quarterly-report.pdf</AttachmentComponent.Title>
            <AttachmentComponent.Description>1.2 MB</AttachmentComponent.Description>
        </AttachmentComponent.Content>
        <AttachmentComponent.Actions>
            <AttachmentComponent.Action
                icon={DismissRegular}
                aria-label="Remove quarterly-report.pdf"
            />
        </AttachmentComponent.Actions>
    </AttachmentComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Attachment>
    <Attachment.Media>
        <DocumentPdfRegular />
    </Attachment.Media>
    <Attachment.Content>
        <Attachment.Title>quarterly-report.pdf</Attachment.Title>
        <Attachment.Description>1.2 MB</Attachment.Description>
    </Attachment.Content>
    <Attachment.Actions>
        <Attachment.Action icon={DismissRegular} aria-label="Remove quarterly-report.pdf" />
    </Attachment.Actions>
</Attachment>`;

// How far the file has got. The card itself only changes at either end of the run: the one with no
// file yet is an outline, and the one that failed is drawn in the colour errors are said in. The
// three between them are the same card, and the wait is said by what stands inside it — a ring
// counting the file up in place of the mark standing for it
const statesPreview = (
    <Stack gap="condensed" align="start">
        {states.map((state) => (
            <AttachmentComponent key={state} state={state}>
                <AttachmentComponent.Media>
                    {state === "uploading" || state === "processing" ? (
                        <ProgressCircle progress={45} size="small" aria-label="Upload notes.pdf" />
                    ) : state === "error" ? (
                        <ErrorCircleRegular />
                    ) : (
                        <DocumentPdfRegular />
                    )}
                </AttachmentComponent.Media>
                <AttachmentComponent.Content>
                    <AttachmentComponent.Title>notes.pdf</AttachmentComponent.Title>
                    <AttachmentComponent.Description>{state}</AttachmentComponent.Description>
                </AttachmentComponent.Content>
            </AttachmentComponent>
        ))}
    </Stack>
);

const statesCode = `<Stack gap="condensed" align="start">
    {states.map((state) => (
        <Attachment key={state} state={state}>
            <Attachment.Media>
                {state === "uploading" || state === "processing" ? (
                    <ProgressCircle progress={45} size="small" aria-label="Upload notes.pdf" />
                ) : state === "error" ? (
                    <ErrorCircleRegular />
                ) : (
                    <DocumentPdfRegular />
                )}
            </Attachment.Media>
            <Attachment.Content>
                <Attachment.Title>notes.pdf</Attachment.Title>
                <Attachment.Description>{state}</Attachment.Description>
            </Attachment.Content>
        </Attachment>
    ))}
</Stack>`;

// Which step of the scale the attachment is drawn at. The one prop settles the square, the words
// and the room around them together, so the parts keep their proportions rather than each being
// told a measurement of its own
const sizePreview = (
    <Stack gap="condensed" align="start">
        {sizes.map((size) => (
            <AttachmentComponent key={size} size={size}>
                <AttachmentComponent.Media>
                    <DocumentPdfRegular />
                </AttachmentComponent.Media>
                <AttachmentComponent.Content>
                    <AttachmentComponent.Title>{size}</AttachmentComponent.Title>
                    <AttachmentComponent.Description>1.2 MB</AttachmentComponent.Description>
                </AttachmentComponent.Content>
            </AttachmentComponent>
        ))}
    </Stack>
);

const sizeCode = `<Stack gap="condensed" align="start">
    {sizes.map((size) => (
        <Attachment key={size} size={size}>
            <Attachment.Media>
                <DocumentPdfRegular />
            </Attachment.Media>
            <Attachment.Content>
                <Attachment.Title>{size}</Attachment.Title>
                <Attachment.Description>1.2 MB</Attachment.Description>
            </Attachment.Content>
        </Attachment>
    ))}
</Stack>`;

// The attachment laid out as a column rather than as a row. A row reads as a file in a list, where
// the name is what is looked down; a column reads as a tile in a gallery, where the square is, so
// the square is given the whole width and the name goes underneath it
const orientationPreview = (
    <Stack direction="horizontal" gap="condensed" wrap="wrap" align="start">
        <AttachmentComponent orientation="vertical">
            <AttachmentComponent.Media>
                <DocumentPdfRegular />
            </AttachmentComponent.Media>
            <AttachmentComponent.Content>
                <AttachmentComponent.Title>notes.pdf</AttachmentComponent.Title>
                <AttachmentComponent.Description>820 KB</AttachmentComponent.Description>
            </AttachmentComponent.Content>
        </AttachmentComponent>
        <AttachmentComponent orientation="vertical">
            <AttachmentComponent.Media variant="image">
                <img src={source} alt="" />
            </AttachmentComponent.Media>
            <AttachmentComponent.Content>
                <AttachmentComponent.Title>octocat.png</AttachmentComponent.Title>
                <AttachmentComponent.Description>48 KB</AttachmentComponent.Description>
            </AttachmentComponent.Content>
        </AttachmentComponent>
    </Stack>
);

const orientationCode = `<Stack direction="horizontal" gap="condensed" wrap="wrap" align="start">
    <Attachment orientation="vertical">
        <Attachment.Media>
            <DocumentPdfRegular />
        </Attachment.Media>
        <Attachment.Content>
            <Attachment.Title>notes.pdf</Attachment.Title>
            <Attachment.Description>820 KB</Attachment.Description>
        </Attachment.Content>
    </Attachment>
    <Attachment orientation="vertical">
        <Attachment.Media variant="image">
            <img src={source} alt="" />
        </Attachment.Media>
        <Attachment.Content>
            <Attachment.Title>octocat.png</Attachment.Title>
            <Attachment.Description>48 KB</Attachment.Description>
        </Attachment.Content>
    </Attachment>
</Stack>`;

// The file itself in place of a mark standing for its kind. The picture is cropped to the square
// rather than fitted inside it, so a file of any shape leaves the attachment the height it had.
//
// The picture is left unnamed, since the name of the file is written out beside it and a screen
// reader given both would read the one file twice
const thumbnailPreview = (
    <AttachmentComponent>
        <AttachmentComponent.Media variant="image">
            <img src={source} alt="" />
        </AttachmentComponent.Media>
        <AttachmentComponent.Content>
            <AttachmentComponent.Title>octocat.png</AttachmentComponent.Title>
            <AttachmentComponent.Description>1024 × 1024</AttachmentComponent.Description>
        </AttachmentComponent.Content>
    </AttachmentComponent>
);

const thumbnailCode = `<Attachment>
    <Attachment.Media variant="image">
        <img src={source} alt="" />
    </Attachment.Media>
    <Attachment.Content>
        <Attachment.Title>octocat.png</Attachment.Title>
        <Attachment.Description>1024 × 1024</Attachment.Description>
    </Attachment.Content>
</Attachment>`;

// The attachment with nothing in it but the square. The words are the one part with no length of
// its own, so an attachment without them is drawn to the square alone, which is what a gallery of
// pictures and a place kept for a file are both made of.
//
// The picture is named here, since there is nothing beside it saying which file it is of. The
// second one stands for no file yet, so there is nothing to name
const mediaOnlyPreview = (
    <Stack direction="horizontal" gap="condensed" wrap="wrap" align="start">
        <AttachmentComponent orientation="vertical">
            <AttachmentComponent.Media variant="image">
                <img src={source} alt="octocat.png" />
            </AttachmentComponent.Media>
        </AttachmentComponent>
        <AttachmentComponent orientation="vertical" state="idle">
            <AttachmentComponent.Media>
                <AttachRegular />
            </AttachmentComponent.Media>
        </AttachmentComponent>
    </Stack>
);

const mediaOnlyCode = `<Stack direction="horizontal" gap="condensed" wrap="wrap" align="start">
    <Attachment orientation="vertical">
        <Attachment.Media variant="image">
            <img src={source} alt="octocat.png" />
        </Attachment.Media>
    </Attachment>
    <Attachment orientation="vertical" state="idle">
        <Attachment.Media>
            <AttachRegular />
        </Attachment.Media>
    </Attachment>
</Stack>`;

// What can be done with the file, kept at the trailing edge. Each carries a mark rather than words,
// so each is named for the file it acts on rather than left as another "Remove" among several: a
// reader going through the page by keyboard arrives at them one after another with nothing but the
// name to tell them apart
const actionsPreview = (
    <AttachmentComponent>
        <AttachmentComponent.Media>
            <DocumentPdfRegular />
        </AttachmentComponent.Media>
        <AttachmentComponent.Content>
            <AttachmentComponent.Title>quarterly-report.pdf</AttachmentComponent.Title>
            <AttachmentComponent.Description>1.2 MB</AttachmentComponent.Description>
        </AttachmentComponent.Content>
        <AttachmentComponent.Actions>
            <AttachmentComponent.Action
                icon={ArrowDownloadRegular}
                aria-label="Download quarterly-report.pdf"
            />
            <AttachmentComponent.Action
                icon={DismissRegular}
                aria-label="Remove quarterly-report.pdf"
            />
        </AttachmentComponent.Actions>
    </AttachmentComponent>
);

const actionsCode = `<Attachment>
    <Attachment.Media>
        <DocumentPdfRegular />
    </Attachment.Media>
    <Attachment.Content>
        <Attachment.Title>quarterly-report.pdf</Attachment.Title>
        <Attachment.Description>1.2 MB</Attachment.Description>
    </Attachment.Content>
    <Attachment.Actions>
        <Attachment.Action
            icon={ArrowDownloadRegular}
            aria-label="Download quarterly-report.pdf"
        />
        <Attachment.Action icon={DismissRegular} aria-label="Remove quarterly-report.pdf" />
    </Attachment.Actions>
</Attachment>`;

// The whole card answering to a press. The trigger is laid over the attachment rather than wrapped
// around it, so the actions at the trailing edge stay buttons in their own right and pressing one
// does what it says rather than what the card does.
//
// It is the one thing in the attachment a reader tabs to, which is why the ring is drawn around the
// whole card. The words it is laid over are already there to be seen, so what it says is only said
// to a screen reader
const triggerPreview = (
    <AttachmentComponent>
        <AttachmentComponent.Media variant="image">
            <img src={source} alt="" />
        </AttachmentComponent.Media>
        <AttachmentComponent.Content>
            <AttachmentComponent.Title>octocat.png</AttachmentComponent.Title>
            <AttachmentComponent.Description>48 KB</AttachmentComponent.Description>
        </AttachmentComponent.Content>
        <AttachmentComponent.Actions>
            <AttachmentComponent.Action icon={DismissRegular} aria-label="Remove octocat.png" />
        </AttachmentComponent.Actions>
        <AttachmentComponent.Trigger>
            <span className={classes.hidden}>Open octocat.png</span>
        </AttachmentComponent.Trigger>
    </AttachmentComponent>
);

const triggerCode = `<Attachment>
    <Attachment.Media variant="image">
        <img src={source} alt="" />
    </Attachment.Media>
    <Attachment.Content>
        <Attachment.Title>octocat.png</Attachment.Title>
        <Attachment.Description>48 KB</Attachment.Description>
    </Attachment.Content>
    <Attachment.Actions>
        <Attachment.Action icon={DismissRegular} aria-label="Remove octocat.png" />
    </Attachment.Actions>
    <Attachment.Trigger>
        <span className={hidden}>Open octocat.png</span>
    </Attachment.Trigger>
</Attachment>`;

// A run of attachments along one line. More of them than there is room for are scrolled rather than
// wrapped, so the run keeps to the height of a single attachment however many it holds, and each is
// brought to rest at the leading edge so a run is read one at a time. The card below is narrower
// than this run wants, so it is already scrolling
const groupPreview = (
    <AttachmentComponent.Group>
        {files.map((name) => (
            <AttachmentComponent key={name} size="small">
                <AttachmentComponent.Media>
                    <DocumentPdfRegular />
                </AttachmentComponent.Media>
                <AttachmentComponent.Content>
                    <AttachmentComponent.Title>{name}</AttachmentComponent.Title>
                    <AttachmentComponent.Description>1.2 MB</AttachmentComponent.Description>
                </AttachmentComponent.Content>
                <AttachmentComponent.Actions>
                    <AttachmentComponent.Action
                        icon={DismissRegular}
                        aria-label={`Remove ${name}`}
                    />
                </AttachmentComponent.Actions>
            </AttachmentComponent>
        ))}
    </AttachmentComponent.Group>
);

const groupCode = `<Attachment.Group>
    {files.map((name) => (
        <Attachment key={name} size="small">
            <Attachment.Media>
                <DocumentPdfRegular />
            </Attachment.Media>
            <Attachment.Content>
                <Attachment.Title>{name}</Attachment.Title>
                <Attachment.Description>1.2 MB</Attachment.Description>
            </Attachment.Content>
            <Attachment.Actions>
                <Attachment.Action icon={DismissRegular} aria-label={\`Remove \${name}\`} />
            </Attachment.Actions>
        </Attachment>
    ))}
</Attachment.Group>`;

// What each attachment is drawn as, in place of the div it is by default. A run of files is a list,
// and a list said to be one is counted for a screen reader and gone through as one, which a run of
// divs is not. The marks are taken off, since what stands on each line is a card rather than a line
// of prose, and the list is told it is a list to make up for what taking them off would otherwise
// have said
const elementPreview = (
    <Stack as="ul" role="list" gap="condensed" align="start" className={classes.list}>
        {names.map((name) => (
            <AttachmentComponent key={name} as="li" size="small">
                <AttachmentComponent.Media>
                    <DocumentPdfRegular />
                </AttachmentComponent.Media>
                <AttachmentComponent.Content>
                    <AttachmentComponent.Title>{name}</AttachmentComponent.Title>
                    <AttachmentComponent.Description>1.2 MB</AttachmentComponent.Description>
                </AttachmentComponent.Content>
            </AttachmentComponent>
        ))}
    </Stack>
);

const elementCode = `<Stack as="ul" role="list" gap="condensed" align="start" className={list}>
    {names.map((name) => (
        <Attachment key={name} as="li" size="small">
            <Attachment.Media>
                <DocumentPdfRegular />
            </Attachment.Media>
            <Attachment.Content>
                <Attachment.Title>{name}</Attachment.Title>
                <Attachment.Description>1.2 MB</Attachment.Description>
            </Attachment.Content>
        </Attachment>
    ))}
</Stack>`;

// The attachment as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "How far the file has got",
        description:
            "The card itself only changes at either end of the run: the one with no file yet is drawn as an outline, so it reads as somewhere a file goes rather than as a file that is already there, and the one that failed is drawn in the colour errors are said in. The three between them are the same card, and the wait is said by what stands inside it rather than by the card being drawn differently.",
        setup: statesSetup,
        preview: statesPreview,
        code: statesCode,
    },
    {
        name: "Size",
        description:
            "Which step of the scale the attachment is drawn at. The square, the words and the room around them are settled together by the one prop, so the parts keep their proportions rather than each being told a measurement of its own. Small is what a run of files under a message is drawn at, where the attachment is an aside to something else; large is for one standing on its own.",
        setup: sizesSetup,
        preview: sizePreview,
        code: sizeCode,
    },
    {
        name: "Laid out as a tile",
        description:
            "A row reads as a file in a list, where the name is what is looked down; a column reads as a tile in a gallery, where the square is. So a column gives the square its whole width and puts the name underneath it, and the actions, having no edge left to stand along, are lifted into the corner of the square instead.",
        setup: sourceSetup,
        preview: orientationPreview,
        code: orientationCode,
    },
    {
        name: "The file in place of a mark for it",
        description:
            "A thumbnail is the file itself rather than something standing for its kind, so it is cropped to the square rather than fitted inside it and a file of any shape leaves the attachment the height it had. Until the file has arrived what is shown of it is only a likeness, so it is held back while the file is still on its way and let through once it is the file itself.",
        setup: sourceSetup,
        preview: thumbnailPreview,
        code: thumbnailCode,
    },
    {
        name: "Nothing but the square",
        description:
            "The words are the one part of the attachment with no length of their own, so an attachment without them is drawn to the square alone. It is what a gallery of pictures is made of, and what a place kept for a file that has not been chosen yet is. The picture is named here, since there is nothing written beside it saying which file it is of.",
        setup: sourceSetup,
        preview: mediaOnlyPreview,
        code: mediaOnlyCode,
    },
    {
        name: "What can be done with the file",
        description:
            "The actions are kept at the trailing edge and stand above the trigger laid over the attachment, so pressing one does what it says rather than what the card does. Each carries a mark rather than words, so each is named for the file it acts on: a reader going through the page by keyboard arrives at them one after another with nothing else to tell them apart.",
        preview: actionsPreview,
        code: actionsCode,
    },
    {
        name: "An attachment that answers to a press",
        description:
            "The trigger is laid over the attachment rather than wrapped around it, so it takes the whole card as its target without taking the actions in with it. It is the one thing in the attachment a reader tabs to, which is why the ring is drawn around the whole card rather than around the trigger. The words it is laid over are already there to be seen, so what names it is said to a screen reader alone.",
        setup: `${sourceSetup}\n${hiddenSetup}`,
        preview: triggerPreview,
        code: triggerCode,
    },
    {
        name: "A run of files",
        description:
            "More attachments than there is room for are scrolled rather than wrapped, so the run keeps to the height of a single attachment however many it holds. A second line would move everything under it down at whatever width that happened at, and a page read on a phone would be laid out differently from the one the reader had been reading. Each attachment is brought to rest at the leading edge, so a run is read one at a time.",
        setup: filesSetup,
        preview: groupPreview,
        code: groupCode,
    },
    {
        name: "Drawn as something else",
        description:
            "What each attachment is drawn as, in place of the div it is by default. A run of files is a list, and a list said to be one is counted for a screen reader and gone through as one, which a run of divs is not. The marks are taken off, since what stands on each line is a card rather than a line of prose, and the list is told it is a list to make up for what taking them off would otherwise have said.",
        setup: `${namesSetup}\n${listSetup}`,
        preview: elementPreview,
        code: elementCode,
    },
];

// How far the file has got
const state = '"idle" | "uploading" | "processing" | "error" | "done"';

// Which step of the scale the attachment is drawn at
const size = '"small" | "medium" | "large"';

// Laid out as a row, which reads as a file in a list, or as a column, which reads as a tile in a
// gallery
const orientation = '"horizontal" | "vertical"';

// Whether the square stands for a file of a kind or shows the file itself
const mediaVariant = '"icon" | "image"';

// How much weight an action carries against the card it stands on
const actionVariant = '"default" | "primary" | "danger" | "invisible" | "link"';

// What the icon is handed over as: the component to draw, or an element already built. There is no
// null among them, as there is wherever a visual is one thing a component lays out among several,
// since the icon is the whole of what an action carries
const icon = "React.ElementType | React.ReactElement";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the attachment and its parts take, under the part that takes it. The card comes first,
// then the run they are collected into, and then the parts in the order they are written inside
// one: the square, the words, the name, the line under it, the actions, one of them, and last the
// thing laid over all of it.
//
// What the whole is doing is carried on the root alone, so the parts inside it are drawn from the
// state of the attachment rather than each having to be told what it is. That is why almost every
// part declares nothing but the class it is styled by
const groups: ComponentPropGroup[] = [
    {
        name: "Attachment",
        props: [
            {
                name: "state",
                type: state,
                default: '"done"',
                description:
                    "How far the file has got. Idle is a place kept for a file that has not been chosen yet, so it is drawn as an outline rather than as a card; error is drawn in the colour errors are said in. The three between them are the same card, and the wait is said by what stands inside it. It is carried on the root and read by the parts, so it is given once rather than to each of them",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "Which step of the scale the attachment is drawn at. The square, the words and the room around them are settled together, so the parts keep their proportions rather than each being told a measurement of its own",
            },
            {
                name: "orientation",
                type: orientation,
                default: '"horizontal"',
                description:
                    "Laid out as a row, which reads as a file in a list, or as a column, which reads as a tile in a gallery. A column gives the square its whole width and puts the words underneath it, and lifts the actions into the corner of the square, having no edge left to stand them along",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"div"',
                description:
                    "The element or component the attachment is drawn as, in place of its default. A run of files is a list, so each attachment in one is drawn as an li, which is what makes the run counted for a screen reader and gone through as one",
            },
        ],
    },
    {
        name: "Attachment.Group",
        props: [styling],
    },
    {
        name: "Attachment.Media",
        props: [
            {
                name: "variant",
                type: mediaVariant,
                default: '"icon"',
                description:
                    "Whether the square stands for a file of a kind or shows the file itself. An image is cropped to the square rather than fitted inside it, so a file of any shape leaves the attachment the height it had, and is held back while the file is still on its way, since what is shown of it until then is only a likeness",
            },
            styling,
        ],
    },
    {
        name: "Attachment.Content",
        props: [styling],
    },
    {
        name: "Attachment.Title",
        props: [styling],
    },
    {
        name: "Attachment.Description",
        props: [styling],
    },
    {
        name: "Attachment.Actions",
        props: [styling],
    },
    {
        name: "Attachment.Action",
        props: [
            {
                name: "icon",
                type: icon,
                required: true,
                description:
                    "The mark drawn in place of a label. It is handed over as the icon itself rather than as an element built from it, so the action draws it at the size and in the colour it is being drawn at",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the action in words, where there are none on the page to point at. One of this and aria-labelledby has to be given, and the two are refused together. Every action on an attachment is named for the file it acts on rather than left as another Remove among several, since a reader arriving at one by keyboard has nothing else to tell them apart",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the action by whatever on the page already says what it is, in place of aria-label",
            },
            {
                name: "variant",
                type: actionVariant,
                default: '"invisible"',
                description:
                    "How much weight the action carries against the card it stands on. It is invisible by default rather than drawn with a ground of its own, since the attachment it stands on is already a surface, and a shape is drawn around the mark only once it is pointed at",
            },
            {
                name: "size",
                type: size,
                default: '"small"',
                description:
                    "How large the square is drawn. It is smaller by default than an icon button standing on its own, since it stands at the edge of a card rather than in a row of controls",
            },
            styling,
        ],
    },
    {
        name: "Attachment.Trigger",
        props: [
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"button"',
                description:
                    "The element or component the trigger is drawn as, in place of its default. An attachment that leads somewhere is drawn as an anchor, or as a router's own link, so that following it is a link being followed rather than a press being answered",
            },
            {
                name: "type",
                type: "string",
                default: '"button"',
                description:
                    "What the trigger does inside a form. Only a real button carries one, and one left unsaid would submit whatever form the attachment happens to be standing in, so the library says it rather than leaving it to be said",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the attachment is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Attachment = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Attachment
            </Heading>
            <Text as="p" size="large">
                One file drawn as a card: a square standing for what kind of thing it is, the name
                beside it, and whatever can be done with it at the far end. Which of those parts it
                carries is what tells one attachment from the next — a thumbnail with no words is a
                tile, and a name with no actions is only there to be read — so each is written out
                rather than settled by a prop. How far the file has got is carried on the card
                itself, so the parts inside it are drawn from what the whole is doing rather than
                each having to be told.
            </Text>
        </Stack>
        <ComponentExamples component="Attachment" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Attachment;
