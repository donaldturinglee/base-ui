import * as React from "react";
import {
    Button,
    Dialog as DialogComponent,
    Heading,
    Link,
    Stack,
    Text,
    Textarea,
} from "@gamecrafters/base-ui/react";
import type { DialogHeaderRenderProps, DialogRenderProps } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A part taken over by a renderer of the caller's own, coloured so that what the renderer drew
    // can be told from what the dialog would have drawn itself
    custom: "bg-background-accent-muted",
};

// What every example is a dialog about. It is written once and read out into each of them, since
// what the examples are about is the dialog rather than the words inside it
const body = (
    <Text as="p">
        Deleting this repository takes it away from everyone who can reach it, along with its
        issues, its pull requests and everything that has been said on them. There is no way of
        putting it back once it has gone.
    </Text>
);

// More than a dialog has room for, so that what a body does when it runs past its own height can
// be read rather than described
const longBody = (
    <Stack gap="normal">
        {Array.from({ length: 8 }, (_, index) => (
            <Text as="p" key={index}>
                Deleting this repository takes it away from everyone who can reach it, along with
                its issues, its pull requests and everything that has been said on them. There is no
                way of putting it back once it has gone.
            </Text>
        ))}
    </Stack>
);

// What the examples have to have in hand before they can be drawn
const bodySetup = `const body = (
    <Text as="p">
        Deleting this repository takes it away from everyone who can reach it, along with its
        issues, its pull requests and everything that has been said on them. There is no way of
        putting it back once it has gone.
    </Text>
);`;

const openSetup = `const [isOpen, setIsOpen] = React.useState(false);
const close = () => setIsOpen(false);`;

// A dialog is only ever on the page while it is open, so every example is a button that puts one
// up and a dialog that takes itself down again. The state has to be kept somewhere for that, so
// each example is a component of its own rather than an element the page holds ready
const Example = ({
    label = "Show dialog",
    render,
}: {
    label?: string;
    render: (close: () => void) => React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack align="start">
            <Button onClick={() => setIsOpen(true)}>{label}</Button>
            {isOpen ? render(() => setIsOpen(false)) : null}
        </Stack>
    );
};

// The plainest dialog there is: a title, what it is about, and the buttons that answer it. It is
// described rather than built, so the header, the body and the footer are laid out from what it
// was told rather than written out one by one.
//
// The title names the dialog to a screen reader as well as heading it, so there is nothing else to
// name it with. Focus is held inside it while it stands and handed back to the button that opened
// it once it goes.
//
// The page and the component it is about are both called Dialog, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Dialog, as an application
// importing it would
const DefaultPreview = () => (
    <Example
        render={(close) => (
            <DialogComponent
                title="Delete repository"
                subtitle="This cannot be undone"
                onClose={close}
                footerButtons={[
                    { content: "Cancel", onClick: close },
                    { buttonType: "danger", content: "Delete", onClick: close },
                ]}
            >
                {body}
            </DialogComponent>
        )}
    />
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<>
    <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
    {isOpen ? (
        <Dialog
            title="Delete repository"
            subtitle="This cannot be undone"
            onClose={close}
            footerButtons={[
                { content: "Cancel", onClick: close },
                { buttonType: "danger", content: "Delete", onClick: close },
            ]}
        >
            {body}
        </Dialog>
    ) : null}
</>`;

// The buttons the footer holds, given as plain objects rather than written out. One of them can
// ask to be where the dialog opens, which is what a dialog whose likely answer is one button wants
const FooterButtonsPreview = () => (
    <Example
        render={(close) => (
            <DialogComponent
                title="Delete repository"
                onClose={close}
                footerButtons={[
                    { content: "Cancel", onClick: close },
                    {
                        buttonType: "danger",
                        content: "Delete",
                        onClick: close,
                        autoFocus: true,
                    },
                ]}
            >
                {body}
            </DialogComponent>
        )}
    />
);

const footerButtonsCode = `<Dialog
    title="Delete repository"
    onClose={close}
    footerButtons={[
        { content: "Cancel", onClick: close },
        { buttonType: "danger", content: "Delete", onClick: close, autoFocus: true },
    ]}
>
    {body}
</Dialog>`;

// A button waiting on the work pressing it started. The dialog is left standing while it waits,
// since taking it down would say the work was done before it was
const LoadingPreview = () => {
    const [isSaving, setIsSaving] = React.useState(false);

    return (
        <Example
            render={(close) => (
                <DialogComponent
                    title="Delete repository"
                    onClose={close}
                    footerButtons={[
                        { content: "Cancel", onClick: close },
                        {
                            buttonType: "danger",
                            content: "Delete",
                            loading: isSaving,
                            onClick: () => setIsSaving(true),
                        },
                    ]}
                >
                    {body}
                </DialogComponent>
            )}
        />
    );
};

const loadingSetup = `${bodySetup}

${openSetup}
const [isSaving, setIsSaving] = React.useState(false);`;

const loadingCode = `<Dialog
    title="Delete repository"
    onClose={close}
    footerButtons={[
        { content: "Cancel", onClick: close },
        {
            buttonType: "danger",
            content: "Delete",
            loading: isSaving,
            onClick: () => setIsSaving(true),
        },
    ]}
>
    {body}
</Dialog>`;

// Where the dialog sits against the screen. A side sheet arrives from the edge it settles against
// and fills the height, which is what a panel standing beside the work rather than over it wants
const PositionPreview = () => (
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        <Example
            label="Centred"
            render={(close) => (
                <DialogComponent title="Delete repository" onClose={close} width="medium">
                    {body}
                </DialogComponent>
            )}
        />
        <Example
            label="A side sheet"
            render={(close) => (
                <DialogComponent
                    title="Delete repository"
                    onClose={close}
                    position="right"
                    width="large"
                >
                    {body}
                </DialogComponent>
            )}
        />
        <Example
            label="Aligned to the top"
            render={(close) => (
                <DialogComponent
                    title="Delete repository"
                    onClose={close}
                    align="top"
                    width="medium"
                >
                    {body}
                </DialogComponent>
            )}
        />
    </Stack>
);

const positionCode = `<Dialog title="Delete repository" onClose={close} width="medium">
    {body}
</Dialog>

<Dialog title="Delete repository" onClose={close} position="right" width="large">
    {body}
</Dialog>

<Dialog title="Delete repository" onClose={close} align="top" width="medium">
    {body}
</Dialog>`;

// Where a narrow viewport puts the dialog, which is not where a wide one does. There is no room
// either side of a dialog on a phone, so it takes the foot of the screen or the whole of it
const NarrowPreview = () => (
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        <Example
            label="Bottom sheet when narrow"
            render={(close) => (
                <DialogComponent
                    title="Delete repository"
                    onClose={close}
                    position={{ narrow: "bottom", regular: "center" }}
                >
                    {body}
                </DialogComponent>
            )}
        />
        <Example
            label="Fullscreen when narrow"
            render={(close) => (
                <DialogComponent
                    title="Delete repository"
                    onClose={close}
                    position={{ narrow: "fullscreen", regular: "center" }}
                >
                    {body}
                </DialogComponent>
            )}
        />
    </Stack>
);

const narrowCode = `<Dialog
    title="Delete repository"
    onClose={close}
    position={{ narrow: "bottom", regular: "center" }}
>
    {body}
</Dialog>

<Dialog
    title="Delete repository"
    onClose={close}
    position={{ narrow: "fullscreen", regular: "center" }}
>
    {body}
</Dialog>`;

// How much room the dialog takes. A width off the scale is a step of the overlay sizes; anything
// else is passed straight through, for a dialog that fits none of them. A height holds it open at
// one size however little it holds
const SizePreview = () => (
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        <Example
            label="A step of the scale"
            render={(close) => (
                <DialogComponent title="Delete repository" onClose={close} width="small">
                    {body}
                </DialogComponent>
            )}
        />
        <Example
            label="A width of its own"
            render={(close) => (
                <DialogComponent title="Delete repository" onClose={close} width="25rem">
                    {body}
                </DialogComponent>
            )}
        />
        <Example
            label="Held to a height"
            render={(close) => (
                <DialogComponent
                    title="Delete repository"
                    onClose={close}
                    height="small"
                    width="large"
                >
                    {body}
                </DialogComponent>
            )}
        />
    </Stack>
);

const sizeCode = `<Dialog title="Delete repository" onClose={close} width="small">
    {body}
</Dialog>

<Dialog title="Delete repository" onClose={close} width="25rem">
    {body}
</Dialog>

<Dialog title="Delete repository" onClose={close} height="small" width="large">
    {body}
</Dialog>`;

// A body with more in it than the dialog has room for. It scrolls rather than growing past the
// screen, and is ruled off from the footer for as long as there is more to read, so the line says
// there is something below rather than merely dividing the two
const ScrollingPreview = () => (
    <Example
        render={(close) => (
            <DialogComponent
                title="Delete repository"
                onClose={close}
                height="small"
                footerButtons={[
                    { content: "Cancel", onClick: close },
                    { buttonType: "danger", content: "Delete", onClick: close },
                ]}
            >
                {longBody}
            </DialogComponent>
        )}
    />
);

const scrollingSetup = `const longBody = (
    <Stack gap="normal">
        {Array.from({ length: 8 }, (_, index) => (
            <Text as="p" key={index}>
                Deleting this repository takes it away from everyone who can reach it, along with
                its issues, its pull requests and everything that has been said on them.
            </Text>
        ))}
    </Stack>
);

${openSetup}`;

const scrollingCode = `<Dialog
    title="Delete repository"
    onClose={close}
    height="small"
    footerButtons={[
        { content: "Cancel", onClick: close },
        { buttonType: "danger", content: "Delete", onClick: close },
    ]}
>
    {longBody}
</Dialog>`;

// Where focus goes as the dialog opens, and where it goes once it closes. A dialog holding a field
// opens on the field rather than on the close button, since typing is what it was opened for; one
// that leaves the reader somewhere new hands focus there rather than back where it came from
const FocusPreview = () => {
    const commentRef = React.useRef<HTMLTextAreaElement>(null);
    const afterwardsRef = React.useRef<HTMLButtonElement>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack direction="horizontal" gap="condensed" wrap="wrap">
            <Example
                label="Opens on the field"
                render={(close) => (
                    <DialogComponent
                        title="Leave a comment"
                        onClose={close}
                        initialFocusRef={commentRef}
                        footerButtons={[
                            { buttonType: "primary", content: "Comment", onClick: close },
                        ]}
                    >
                        <Textarea ref={commentRef} aria-label="Comment" block />
                    </DialogComponent>
                )}
            />
            <Button onClick={() => setIsOpen(true)}>Hands focus onwards</Button>
            <Button ref={afterwardsRef}>Takes focus afterwards</Button>
            {isOpen ? (
                <DialogComponent
                    title="Delete repository"
                    onClose={() => setIsOpen(false)}
                    returnFocusRef={afterwardsRef}
                    width="medium"
                >
                    {body}
                </DialogComponent>
            ) : null}
        </Stack>
    );
};

const focusSetup = `${bodySetup}

const commentRef = React.useRef(null);
const afterwardsRef = React.useRef(null);
${openSetup}`;

const focusCode = `<Dialog
    title="Leave a comment"
    onClose={close}
    initialFocusRef={commentRef}
    footerButtons={[{ buttonType: "primary", content: "Comment", onClick: close }]}
>
    <Textarea ref={commentRef} aria-label="Comment" block />
</Dialog>

<Button ref={afterwardsRef}>Takes focus afterwards</Button>

<Dialog title="Delete repository" onClose={close} returnFocusRef={afterwardsRef}>
    {body}
</Dialog>`;

// The dialog built up out of its parts rather than described. It is worth reaching for where what
// stands in the header or the footer is more than a title and a row of buttons
const PartsPreview = () => (
    <Example
        render={(close) => (
            <DialogComponent title="Delete repository" onClose={close}>
                <DialogComponent.Header>
                    <DialogComponent.Title>Delete repository</DialogComponent.Title>
                    <DialogComponent.Subtitle>This cannot be undone</DialogComponent.Subtitle>
                </DialogComponent.Header>
                <DialogComponent.Body>{body}</DialogComponent.Body>
                <DialogComponent.Footer>
                    <DialogComponent.Buttons
                        buttons={[
                            { content: "Cancel", onClick: close },
                            { buttonType: "danger", content: "Delete", onClick: close },
                        ]}
                    />
                </DialogComponent.Footer>
            </DialogComponent>
        )}
    />
);

const partsCode = `<Dialog title="Delete repository" onClose={close}>
    <Dialog.Header>
        <Dialog.Title>Delete repository</Dialog.Title>
        <Dialog.Subtitle>This cannot be undone</Dialog.Subtitle>
    </Dialog.Header>
    <Dialog.Body>{body}</Dialog.Body>
    <Dialog.Footer>
        <Dialog.Buttons
            buttons={[
                { content: "Cancel", onClick: close },
                { buttonType: "danger", content: "Delete", onClick: close },
            ]}
        />
    </Dialog.Footer>
</Dialog>`;

// A part taken over altogether. A renderer is handed everything the dialog was given, so it can
// draw what the dialog would have drawn and then some, and it has to carry the ids naming and
// describing the dialog itself where it draws the title
const CustomHeader = ({ title, dialogLabelId, onClose }: DialogHeaderRenderProps) => (
    <DialogComponent.Header className={classes.custom}>
        <DialogComponent.Title id={dialogLabelId}>{title}</DialogComponent.Title>
        <DialogComponent.CloseButton onClose={() => onClose("close-button")} />
    </DialogComponent.Header>
);

const CustomBody = ({ children }: DialogRenderProps) => (
    <DialogComponent.Body>
        {children}
        <Link href="https://example.com">Read what deleting a repository takes with it</Link>
    </DialogComponent.Body>
);

const CustomFooter = ({ footerButtons }: DialogRenderProps) => (
    <DialogComponent.Footer className={classes.custom}>
        {footerButtons ? <DialogComponent.Buttons buttons={footerButtons} /> : null}
    </DialogComponent.Footer>
);

const RenderersPreview = () => (
    <Example
        render={(close) => (
            <DialogComponent
                title="Delete repository"
                onClose={close}
                renderHeader={CustomHeader}
                renderBody={CustomBody}
                renderFooter={CustomFooter}
                footerButtons={[{ buttonType: "danger", content: "Delete", onClick: close }]}
            >
                {body}
            </DialogComponent>
        )}
    />
);

const renderersSetup = `${bodySetup}

const custom = "bg-background-accent-muted";

const CustomHeader = ({ title, dialogLabelId, onClose }) => (
    <Dialog.Header className={custom}>
        <Dialog.Title id={dialogLabelId}>{title}</Dialog.Title>
        <Dialog.CloseButton onClose={() => onClose("close-button")} />
    </Dialog.Header>
);

const CustomBody = ({ children }) => (
    <Dialog.Body>
        {children}
        <Link href="https://example.com">Read what deleting a repository takes with it</Link>
    </Dialog.Body>
);

const CustomFooter = ({ footerButtons }) => (
    <Dialog.Footer className={custom}>
        {footerButtons ? <Dialog.Buttons buttons={footerButtons} /> : null}
    </Dialog.Footer>
);

${openSetup}`;

const renderersCode = `<Dialog
    title="Delete repository"
    onClose={close}
    renderHeader={CustomHeader}
    renderBody={CustomBody}
    renderFooter={CustomFooter}
    footerButtons={[{ buttonType: "danger", content: "Delete", onClick: close }]}
>
    {body}
</Dialog>`;

// A dialog opened from a dialog. Only the innermost answers Escape, so a reader backing out of the
// second is not left with the first gone as well
const NestedPreview = () => {
    const [isSecondOpen, setIsSecondOpen] = React.useState(false);

    return (
        <Example
            render={(close) => (
                <DialogComponent
                    title="Delete repository"
                    onClose={close}
                    footerButtons={[
                        { content: "Cancel", onClick: close },
                        {
                            buttonType: "danger",
                            content: "Delete",
                            onClick: () => setIsSecondOpen(true),
                        },
                    ]}
                >
                    {body}
                    {isSecondOpen ? (
                        <DialogComponent
                            role="alertdialog"
                            title="Are you sure?"
                            onClose={() => setIsSecondOpen(false)}
                            width="small"
                            footerButtons={[
                                { content: "Cancel", onClick: () => setIsSecondOpen(false) },
                                { buttonType: "danger", content: "Delete", onClick: close },
                            ]}
                        >
                            <Text as="p">This repository will be gone for good.</Text>
                        </DialogComponent>
                    ) : null}
                </DialogComponent>
            )}
        />
    );
};

const nestedSetup = `${bodySetup}

${openSetup}
const [isSecondOpen, setIsSecondOpen] = React.useState(false);`;

const nestedCode = `<Dialog
    title="Delete repository"
    onClose={close}
    footerButtons={[
        { content: "Cancel", onClick: close },
        { buttonType: "danger", content: "Delete", onClick: () => setIsSecondOpen(true) },
    ]}
>
    {body}
    {isSecondOpen ? (
        <Dialog
            role="alertdialog"
            title="Are you sure?"
            onClose={() => setIsSecondOpen(false)}
            width="small"
            footerButtons={[
                { content: "Cancel", onClick: () => setIsSecondOpen(false) },
                { buttonType: "danger", content: "Delete", onClick: close },
            ]}
        >
            <Text as="p">This repository will be gone for good.</Text>
        </Dialog>
    ) : null}
</Dialog>`;

// The dialog as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "Footer buttons",
        description:
            "Given as plain objects rather than written out, so the footer lays them out and takes care of what happens when there is no room for them all. One of them can ask to be where the dialog opens, which is what a dialog whose likely answer is a single button wants.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <FooterButtonsPreview />,
        code: footerButtonsCode,
    },
    {
        name: "Waiting on the work",
        description:
            "A button that waits on what pressing it started. The dialog is left standing while it waits, since taking it down would say the work was done before it was.",
        setup: loadingSetup,
        preview: <LoadingPreview />,
        code: loadingCode,
    },
    {
        name: "Where the dialog sits",
        description:
            "Centred by default. A side sheet arrives from the edge it settles against and fills the height, which is what a panel standing beside the work rather than over it wants; aligning to the top is where a dialog opened from a header goes, so it does not travel down the screen to meet the reader.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <PositionPreview />,
        code: positionCode,
    },
    {
        name: "Where a narrow viewport puts it",
        description:
            "There is no room either side of a dialog on a phone, so it takes the foot of the screen or the whole of it instead. The position is given as one value for narrow and one for the rest, since only those two ranges are laid out differently.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <NarrowPreview />,
        code: narrowCode,
    },
    {
        name: "How much room it takes",
        description:
            "A width off the overlay scale, or one of the caller's own where none of the steps fits. A height holds the dialog open at one size however little it holds, which keeps a dialog whose content arrives late from growing under the reader.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <SizePreview />,
        code: sizeCode,
    },
    {
        name: "A body with more in it than there is room for",
        description:
            "It scrolls rather than growing past the screen, and is ruled off from the footer for as long as there is more to read. The line says there is something below rather than merely dividing the two, so it goes once the end has been reached.",
        setup: scrollingSetup,
        preview: <ScrollingPreview />,
        code: scrollingCode,
    },
    {
        name: "Where focus goes",
        description:
            "Focus is held inside the dialog while it stands, and handed back to whatever had it once it goes. A dialog holding a field opens on the field rather than on the close button, since typing is what it was opened for; one that leaves the reader somewhere new hands focus there instead of back where it came from.",
        setup: focusSetup,
        preview: <FocusPreview />,
        code: focusCode,
    },
    {
        name: "Built out of its parts",
        description:
            "The dialog built up rather than described. It is worth reaching for where what stands in the header or the footer is more than a title and a row of buttons.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <PartsPreview />,
        code: partsCode,
    },
    {
        name: "A part taken over altogether",
        description:
            "A renderer is handed everything the dialog was given, so it can draw what the dialog would have drawn and then some. One drawing the title has to carry the id naming the dialog, since that is what a screen reader reads it by. A renderer may well step outside what the design system asks for, so it is the last thing to reach for rather than the first.",
        setup: renderersSetup,
        preview: <RenderersPreview />,
        code: renderersCode,
    },
    {
        name: "Opened from a dialog",
        description:
            "Only the innermost dialog answers Escape, so a reader backing out of the second is not left with the first gone as well. A question that has to be answered before anything else can happen is read as an alert dialog rather than an ordinary one.",
        setup: nestedSetup,
        preview: <NestedPreview />,
        code: nestedCode,
    },
];

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
const polymorphic = (element: string) => ({
    name: "as",
    type: "React.ElementType",
    default: `"${element}"`,
    description: "The element or component this is drawn as, in place of its default",
});

// Every prop the dialog and its parts take, under the part that takes it.
//
// The dialog comes first, since it is what a caller reaches for; the shape a footer button is given
// as follows, then the parts, which are only there for a dialog built up rather than described
const groups: ComponentPropGroup[] = [
    {
        name: "Dialog",
        props: [
            {
                name: "onClose",
                type: "(gesture: DialogCloseGesture) => void",
                required: true,
                description:
                    "Called when the dialog is dismissed, with what dismissed it: the close button or Escape. A footer button that closes the dialog does so through its own onClick rather than through this",
            },
            {
                name: "title",
                type: "React.ReactNode",
                description:
                    "Names the dialog to a screen reader as well as heading it, so there is nothing else to name it with",
            },
            {
                name: "subtitle",
                type: "React.ReactNode",
                description:
                    "Stands below the title in smaller type, and describes the dialog to a screen reader",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description: "What the dialog is about, which the body holds",
            },
            {
                name: "footerButtons",
                type: "DialogButtonProps[]",
                description:
                    "The buttons the footer holds, given as plain objects rather than written out. Described below, under DialogButtonProps",
            },
            {
                name: "role",
                type: '"dialog" | "alertdialog"',
                default: '"dialog"',
                options: ["dialog", "alertdialog"],
                description:
                    "What the dialog is announced as. An alert dialog is for a decision that has to be made before anything else can happen, and a screen reader takes the reader to it rather than mentioning it",
            },
            {
                name: "width",
                type: "DialogWidth",
                default: '"xlarge"',
                description:
                    "A step of the overlay scale, small through xlarge. Anything else is passed straight through as a CSS width",
            },
            {
                name: "height",
                type: '"small" | "large" | "auto"',
                default: '"auto"',
                options: ["small", "large", "auto"],
                description:
                    "How tall the dialog stands. Left to itself it is only as tall as what it holds needs it to be",
            },
            {
                name: "position",
                type: "DialogPosition | DialogResponsivePosition",
                default: '{ narrow: "center", regular: "center" }',
                description:
                    "Where the dialog sits against the screen: centred, or against either edge as a side sheet. A narrow viewport has no room either side, so it takes the foot of the screen or the whole of it, and the two ranges can be given separately",
            },
            {
                name: "align",
                type: '"top" | "center" | "bottom"',
                options: ["top", "center", "bottom"],
                description:
                    "Where a centred dialog sits down the screen. It is only read where the dialog is centred, since a side sheet fills the height anyway",
            },
            {
                name: "initialFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus as the dialog opens, in place of the first thing inside it that can. A footer button asking for focus is where the dialog opens unless this names somewhere else",
            },
            {
                name: "returnFocusRef",
                type: "React.RefObject<HTMLElement | null>",
                description:
                    "Takes focus once the dialog closes, in place of whatever held it beforehand",
            },
            {
                name: "renderHeader",
                type: "(props: DialogHeaderRenderProps) => React.ReactElement | null",
                description:
                    "Draws the header in place of the default one, edge to edge and down to the body. It is handed everything the dialog was given, along with the ids naming and describing it, which whatever draws the title has to carry",
            },
            {
                name: "renderBody",
                type: "(props: DialogRenderProps) => React.ReactElement | null",
                description:
                    "Draws the body in place of the default one, between header and footer",
            },
            {
                name: "renderFooter",
                type: "(props: DialogRenderProps) => React.ReactElement | null",
                description: "Draws the footer in place of the default one, from the body down",
            },
            styling,
        ],
    },
    {
        name: "DialogButtonProps",
        props: [
            {
                name: "content",
                type: "React.ReactNode",
                required: true,
                description:
                    "What the button reads. It is given here rather than as children, so the buttons can be plain objects",
            },
            {
                name: "buttonType",
                type: '"default" | "primary" | "danger"',
                default: '"default"',
                options: ["default", "primary", "danger"],
                description:
                    "How much the button is made of, and how grave what it does is. Normal is another name for default, kept for callers already using it",
            },
            {
                name: "autoFocus",
                type: "boolean",
                default: "false",
                description:
                    "Takes focus as the dialog opens, where it is the first button asking for it and nothing else was named",
            },
            {
                name: "onClick",
                type: "React.MouseEventHandler<HTMLButtonElement>",
                description:
                    "What pressing the button does. A button that closes the dialog does so here rather than through the dialog's onClose",
            },
            {
                name: "loading",
                type: "boolean",
                default: "false",
                description:
                    "Swaps the button for a spinner while it waits on the work pressing it started",
            },
        ],
    },
    {
        name: "Dialog.Header",
        props: [styling, polymorphic("div")],
    },
    {
        name: "Dialog.Title",
        props: [styling, polymorphic("h1")],
    },
    {
        name: "Dialog.Subtitle",
        props: [styling, polymorphic("h2")],
    },
    {
        name: "Dialog.Body",
        props: [styling, polymorphic("div")],
    },
    {
        name: "Dialog.Footer",
        props: [styling, polymorphic("div")],
    },
    {
        name: "Dialog.Buttons",
        props: [
            {
                name: "buttons",
                type: "DialogButtonProps[]",
                required: true,
                description:
                    "The buttons to lay out, the same shape the dialog takes them in. It is what a footer of the caller's own draws them with",
            },
        ],
    },
    {
        name: "Dialog.CloseButton",
        props: [
            {
                name: "onClose",
                type: "() => void",
                required: true,
                description:
                    "Called when the button is pressed, so the dialog can close itself. The button is named by the dialog, so there is nothing left to name it with",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the dialog is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Dialog = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Dialog
            </Heading>
            <Text as="p" size="large">
                A surface brought out over the page, holding something the reader has to deal with
                before going back to what they were doing. It is described rather than built: given
                a title, what it is about and the buttons that answer it, and the header, the body
                and the footer are laid out from that. Focus is held inside it while it stands and
                handed back when it goes. A question with only two answers to it is a
                ConfirmationDialog instead.
            </Text>
        </Stack>
        <ComponentExamples component="Dialog" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Dialog;
