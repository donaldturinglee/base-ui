import * as React from "react";
import {
    Button,
    ConfirmationDialog as ConfirmationDialogComponent,
    Heading,
    Stack,
    Text,
    useConfirm,
} from "@gamecrafters/base-ui/react";
import type { ConfirmationDialogCloseGesture } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// What every example is asking about. It is written once and read out into each of them, since
// what the examples are about is the question rather than the words in it, and words that changed
// between them would be read as though they were the point
const body =
    "Deleting this repository takes it away from everyone who can reach it, along with its issues, its pull requests and everything that has been said on them.";

// What the examples have to have in hand before they can be drawn
const bodySetup = `const body =
    "Deleting this repository takes it away from everyone who can reach it, along with its issues, its pull requests and everything that has been said on them.";`;

const openSetup = `const [isOpen, setIsOpen] = React.useState(false);`;

// A dialog is only ever on the page while it is being asked, so every example is a button that
// puts one up and a dialog that takes itself down again. The state has to be kept somewhere for
// that, so each example is a component of its own rather than an element the page holds ready
const Example = ({
    label = "Delete repository",
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

// The plainest confirmation there is: a question, what turning it down and carrying it out are
// called, and the words that say what carrying it out would mean. It is read as an alert dialog
// rather than an ordinary one, since it is a decision that has to be made before anything else can
// happen, and the question titles it and names it to a screen reader at once.
//
// The page and the component it is about are both called ConfirmationDialog, so the component is
// brought in under a name saying which of the two it is. The listing beneath says
// ConfirmationDialog, as an application importing it would
const DefaultPreview = () => (
    <Example
        render={(close) => (
            <ConfirmationDialogComponent
                title="Delete repository?"
                confirmButtonContent="Delete"
                confirmButtonType="danger"
                onClose={close}
            >
                {body}
            </ConfirmationDialogComponent>
        )}
    />
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<>
    <Button onClick={() => setIsOpen(true)}>Delete repository</Button>
    {isOpen ? (
        <ConfirmationDialog
            title="Delete repository?"
            confirmButtonContent="Delete"
            confirmButtonType="danger"
            onClose={() => setIsOpen(false)}
        >
            {body}
        </ConfirmationDialog>
    ) : null}
</>`;

// How grave the action is, which is what the confirm button is styled by and what decides which of
// the two buttons opens with focus. The three are drawn together rather than one to an example,
// since what is being shown is the choice between them: apart they are three dialogs, and only
// beside each other does the difference read
const GravityPreview = () => (
    <Stack direction="horizontal" gap="condensed" wrap="wrap">
        <Example
            label="Default"
            render={(close) => (
                <ConfirmationDialogComponent title="Archive repository?" onClose={close}>
                    Archiving makes the repository read only. It can be brought back at any time.
                </ConfirmationDialogComponent>
            )}
        />
        <Example
            label="Primary"
            render={(close) => (
                <ConfirmationDialogComponent
                    title="Publish this release?"
                    confirmButtonContent="Publish"
                    confirmButtonType="primary"
                    onClose={close}
                >
                    Everyone watching this repository will hear about the release.
                </ConfirmationDialogComponent>
            )}
        />
        <Example
            label="Danger"
            render={(close) => (
                <ConfirmationDialogComponent
                    title="Delete repository?"
                    confirmButtonContent="Delete"
                    confirmButtonType="danger"
                    onClose={close}
                >
                    {body}
                </ConfirmationDialogComponent>
            )}
        />
    </Stack>
);

const gravityCode = `<ConfirmationDialog title="Archive repository?" onClose={close}>
    Archiving makes the repository read only. It can be brought back at any time.
</ConfirmationDialog>

<ConfirmationDialog
    title="Publish this release?"
    confirmButtonContent="Publish"
    confirmButtonType="primary"
    onClose={close}
>
    Everyone watching this repository will hear about the release.
</ConfirmationDialog>

<ConfirmationDialog
    title="Delete repository?"
    confirmButtonContent="Delete"
    confirmButtonType="danger"
    onClose={close}
>
    {body}
</ConfirmationDialog>`;

// A dangerous action opened on the confirm button anyway. It is worth asking for only rarely,
// since what the default is there to stop is a keypress that was already on its way carrying the
// action out
const OverriddenFocusPreview = () => (
    <Example
        render={(close) => (
            <ConfirmationDialogComponent
                title="Delete repository?"
                confirmButtonContent="Delete"
                confirmButtonType="danger"
                overrideButtonFocus="confirm"
                onClose={close}
            >
                {body}
            </ConfirmationDialogComponent>
        )}
    />
);

const overriddenFocusCode = `<ConfirmationDialog
    title="Delete repository?"
    confirmButtonContent="Delete"
    confirmButtonType="danger"
    overrideButtonFocus="confirm"
    onClose={() => setIsOpen(false)}
>
    {body}
</ConfirmationDialog>`;

// A button waiting on the work it started. The dialog is left standing while it waits, since
// taking it down would say the work was done before it was, and the gesture that was decided on
// is what says which of the two buttons is the one waiting
const LoadingPreview = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [pending, setPending] = React.useState<ConfirmationDialogCloseGesture | undefined>();

    const close = (gesture: ConfirmationDialogCloseGesture) => {
        // Escape and the close button take the dialog down at once: there is nothing being
        // waited on, since nothing was decided
        if (gesture !== "confirm" && gesture !== "cancel") {
            setIsOpen(false);
            return;
        }

        setPending(gesture);

        window.setTimeout(() => {
            setPending(undefined);
            setIsOpen(false);
        }, 2000);
    };

    return (
        <Stack align="start">
            <Button onClick={() => setIsOpen(true)}>Delete repository</Button>
            {isOpen ? (
                <ConfirmationDialogComponent
                    title="Delete repository?"
                    confirmButtonContent="Delete"
                    confirmButtonType="danger"
                    confirmButtonLoading={pending === "confirm"}
                    cancelButtonLoading={pending === "cancel"}
                    onClose={close}
                >
                    {body}
                </ConfirmationDialogComponent>
            ) : null}
        </Stack>
    );
};

const loadingSetup = `${bodySetup}

${openSetup}
const [pending, setPending] = React.useState();

const close = (gesture) => {
    // Escape and the close button take the dialog down at once: nothing was decided, so there
    // is nothing being waited on
    if (gesture !== "confirm" && gesture !== "cancel") {
        setIsOpen(false);
        return;
    }

    setPending(gesture);

    window.setTimeout(() => {
        setPending(undefined);
        setIsOpen(false);
    }, 2000);
};`;

const loadingCode = `<ConfirmationDialog
    title="Delete repository?"
    confirmButtonContent="Delete"
    confirmButtonType="danger"
    confirmButtonLoading={pending === "confirm"}
    cancelButtonLoading={pending === "cancel"}
    onClose={close}
>
    {body}
</ConfirmationDialog>`;

// The question asked without a dialog being written out at all. The hook hands back a function
// that puts one up and answers with whether it was confirmed, which is what a decision made in the
// middle of doing something else wants: the answer arrives where the question was asked rather
// than in a handler somewhere else.
//
// The dialog is put up in a root of its own hung off the end of the document, so nothing of the
// tree around the caller reaches it
const ShorthandPreview = () => {
    const confirm = useConfirm();
    const [answer, setAnswer] = React.useState("Nothing has been asked yet");

    const ask = async () => {
        const confirmed = await confirm({
            title: "Delete repository?",
            confirmButtonContent: "Delete",
            confirmButtonType: "danger",
            content: body,
        });

        setAnswer(confirmed ? "It was deleted" : "It was left alone");
    };

    return (
        <Stack gap="condensed" align="start">
            <Button onClick={ask}>Delete repository</Button>
            <Text as="p">{answer}</Text>
        </Stack>
    );
};

const shorthandSetup = `${bodySetup}

const confirm = useConfirm();
const [answer, setAnswer] = React.useState("Nothing has been asked yet");

const ask = async () => {
    const confirmed = await confirm({
        title: "Delete repository?",
        confirmButtonContent: "Delete",
        confirmButtonType: "danger",
        content: body,
    });

    setAnswer(confirmed ? "It was deleted" : "It was left alone");
};`;

const shorthandCode = `<Stack gap="condensed" align="start">
    <Button onClick={ask}>Delete repository</Button>
    <Text as="p">{answer}</Text>
</Stack>`;

// A dialog held to a step of the overlay scale rather than the one it is given, for a question
// whose body runs longer than the middle step has room to read well at
const WidthPreview = () => (
    <Example
        render={(close) => (
            <ConfirmationDialogComponent title="Delete repository?" width="large" onClose={close}>
                {body}
            </ConfirmationDialogComponent>
        )}
    />
);

const widthCode = `<ConfirmationDialog title="Delete repository?" width="large" onClose={() => setIsOpen(false)}>
    {body}
</ConfirmationDialog>`;

// The confirmation as it is reached for, drawn and written out one above the other. The plainest
// one comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "How grave the action is",
        description:
            "What the confirm button is styled by, and what decides which of the two buttons opens with focus. A dangerous action opens on the cancel button, so that a keypress already on its way cannot carry it out; the other two open on the confirm button, since agreeing is the likelier answer and nothing is lost by it.",
        setup: bodySetup,
        preview: <GravityPreview />,
        code: gravityCode,
    },
    {
        name: "Opening on the other button",
        description:
            "A dangerous action opened on the confirm button anyway. It is worth asking for only rarely: what the default is there to stop is a keypress that was already on its way carrying out something that cannot be undone.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <OverriddenFocusPreview />,
        code: overriddenFocusCode,
    },
    {
        name: "Waiting on the work",
        description:
            "A button that waits on what pressing it started. The dialog is left standing while it waits, since taking it down would say the work was done before it was. Escape and the close button are answered at once, because nothing was decided and so nothing is being waited on.",
        setup: loadingSetup,
        preview: <LoadingPreview />,
        code: loadingCode,
    },
    {
        name: "Asked without writing a dialog",
        description:
            "The hook hands back a function that puts the question up and answers with whether it was confirmed. It is what a decision made in the middle of doing something else wants: the answer arrives where the question was asked rather than in a handler somewhere else. The dialog is put up in a root of its own hung off the end of the document, so nothing of the tree around the caller reaches it and anything read from context is left at its default.",
        setup: shorthandSetup,
        preview: <ShorthandPreview />,
        code: shorthandCode,
    },
    {
        name: "A width of its own",
        description:
            "A dialog held to a step of the overlay scale rather than the middle one it is given, for a question whose body runs longer than that has room to read well at. Anything that is not a step of the scale is passed straight through as a CSS width.",
        setup: `${bodySetup}\n\n${openSetup}`,
        preview: <WidthPreview />,
        code: widthCode,
    },
];

// Every prop the confirmation takes. It is drawn as the one dialog rather than as a component with
// parts hanging off it, so there is the one table.
//
// The question comes first, since it is the only thing that has to be given; what the two buttons
// read and how grave the action is follow, then what they do while they wait, then where focus
// opens and how big the dialog stands
const groups: ComponentPropGroup[] = [
    {
        name: "ConfirmationDialog",
        props: [
            {
                name: "title",
                type: "React.ReactNode",
                required: true,
                description:
                    "The question being asked. It titles the dialog and names it to a screen reader at once, so there is nothing else to name it with",
            },
            {
                name: "onClose",
                type: "(gesture: ConfirmationDialogCloseGesture) => void",
                required: true,
                description:
                    "Called when the dialog is dismissed, with what dismissed it: confirm, cancel, escape or close-button. A caller that only wants the decision reads the first two and takes the dialog down on the rest",
            },
            {
                name: "children",
                type: "React.ReactNode",
                description:
                    "What carrying the action out would mean, said under the question. A confirmation whose title says the whole of it needs none",
            },
            {
                name: "confirmButtonContent",
                type: "React.ReactNode",
                default: '"OK"',
                description:
                    "What the button that carries the action reads. Naming the action itself reads better than agreeing to it, since the button is what a reader looks at last",
            },
            {
                name: "cancelButtonContent",
                type: "React.ReactNode",
                default: '"Cancel"',
                description: "What the button that turns the action down reads",
            },
            {
                name: "confirmButtonType",
                type: '"normal" | "primary" | "danger"',
                default: '"normal"',
                options: ["normal", "primary", "danger"],
                description:
                    "How grave the action is, which styles the confirm button and decides which of the two buttons opens with focus. A dangerous action opens on the cancel button",
            },
            {
                name: "confirmButtonLoading",
                type: "boolean",
                default: "false",
                description:
                    "Swaps the confirm button for a spinner while it waits on the work pressing it started",
            },
            {
                name: "cancelButtonLoading",
                type: "boolean",
                default: "false",
                description: "Swaps the cancel button for a spinner while it waits in the same way",
            },
            {
                name: "overrideButtonFocus",
                type: '"cancel" | "confirm"',
                options: ["cancel", "confirm"],
                description:
                    "Opens with this button focused, in place of the one the confirm button's type calls for. Worth overriding only rarely, since the default keeps a dangerous action from being confirmed by a keypress that was already on its way",
            },
            {
                name: "width",
                type: "DialogWidth",
                default: '"medium"',
                description:
                    "A step of the overlay scale, small through xlarge. Anything else is passed straight through as a CSS width",
            },
            {
                name: "height",
                type: '"small" | "large" | "auto"',
                options: ["small", "large", "auto"],
                description:
                    "How tall the dialog stands. Left out, it is only as tall as what it holds needs it to be",
            },
            {
                name: "className",
                type: "string",
                description: "Class name for custom styling",
            },
        ],
    },
];

// What the hook answers with, which is not a component and so has no table of its own. It is
// written out here because the shorthand is how a confirmation is most often asked for
const hookGroups: ComponentPropGroup[] = [
    {
        name: "useConfirm",
        props: [
            {
                name: "content",
                type: "React.ReactNode",
                description:
                    "What carrying the action out would mean. The shorthand has no children to take the body from, so it is given as an option of its own",
            },
            {
                name: "…",
                type: "ConfirmationDialogProps",
                description:
                    "Everything the dialog itself takes, but for onClose and children: the question, what the buttons read, how grave the action is, and how big the dialog stands. The function answers with whether it was confirmed, so there is nothing to hand it a handler for",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the confirmation is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const ConfirmationDialog = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                ConfirmationDialog
            </Heading>
            <Text as="p" size="large">
                A question that has to be answered before anything else can happen, and the two
                buttons that answer it. It is read as an alert dialog rather than an ordinary one,
                so a screen reader takes the reader to it rather than mentioning it, and the
                question both titles it and names it. How grave the action is decides which of the
                two buttons opens with focus: a dangerous one opens on cancel, so that a keypress
                already on its way cannot carry out something that cannot be undone.
            </Text>
        </Stack>
        <ComponentExamples component="ConfirmationDialog" examples={examples} />
        <ComponentProps groups={[...groups, ...hookGroups]} />
    </Stack>
);

export default ConfirmationDialog;
