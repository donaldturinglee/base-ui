import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Link } from "../link";
import { Stack } from "../stack";
import { Text } from "../text";
import { Textarea } from "../textarea";
import { Dialog } from ".";
import type { DialogHeaderRenderProps, DialogRenderProps } from "./Dialog.types";

const classes = {
    custom: "bg-background-accent-muted",
};

const body = (
    <Text as="p">
        Deleting this repository takes it away from everyone who can reach it, along with its
        issues, its pull requests and everything that has been said on them. There is no way of
        putting it back once it has gone.
    </Text>
);

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

export default {
    title: "Components/Dialog/Features",
    parameters: {
        layout: "centered",
    },
};

// A dialog opened from a button, which takes focus back when it closes
const Example = ({
    label = "Show dialog",
    render,
}: {
    label?: string;
    render: (close: () => void) => React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>{label}</Button>
            {isOpen ? render(() => setIsOpen(false)) : null}
        </>
    );
};

// With A Subtitle, which describes the dialog below its title
export const WithASubtitle: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog title="Delete repository" subtitle="This cannot be undone" onClose={close}>
                {body}
            </Dialog>
        )}
    />
);

// With Footer Buttons, where the last of them is where the dialog opens
export const WithFooterButtons: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog
                title="Delete repository"
                onClose={close}
                footerButtons={[
                    { content: "Cancel", onClick: close },
                    { buttonType: "danger", content: "Delete", onClick: close, autoFocus: true },
                ]}
            >
                {body}
            </Dialog>
        )}
    />
);

// Loading Footer Buttons, which say that the dialog is waiting on something
export const LoadingFooterButtons: StoryFn = () => {
    const [isSaving, setIsSaving] = React.useState(false);

    return (
        <Example
            render={(close) => (
                <Dialog
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
                </Dialog>
            )}
        />
    );
};

// An Alert Dialog, for a decision that has to be made before anything else can happen
export const AlertDialog: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog
                role="alertdialog"
                title="Delete repository"
                onClose={close}
                width="medium"
                footerButtons={[
                    { content: "Cancel", onClick: close },
                    { buttonType: "danger", content: "Delete", onClick: close },
                ]}
            >
                {body}
            </Dialog>
        )}
    />
);

// A Side Sheet, which arrives from the edge it settles against
export const SideSheet: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog title="Delete repository" onClose={close} position="right" width="large">
                {body}
            </Dialog>
        )}
    />
);

// A Bottom Sheet, where a narrow viewport takes the dialog to the foot of the screen
export const BottomSheetOnNarrow: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog
                title="Delete repository"
                onClose={close}
                position={{ narrow: "bottom", regular: "center" }}
            >
                {body}
            </Dialog>
        )}
    />
);

// Fullscreen, where a narrow viewport gives the dialog the whole of the screen
export const FullscreenOnNarrow: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog
                title="Delete repository"
                onClose={close}
                position={{ narrow: "fullscreen", regular: "center" }}
            >
                {body}
            </Dialog>
        )}
    />
);

// Aligned To The Top, which is where a dialog goes when it is opened from a header
export const AlignedToTheTop: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog title="Delete repository" onClose={close} align="top">
                {body}
            </Dialog>
        )}
    />
);

// With A Custom Width, for a dialog that fits none of the steps of the scale
export const WithACustomWidth: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog title="Delete repository" onClose={close} width="25rem">
                {body}
            </Dialog>
        )}
    />
);

// With A Set Height, which holds the dialog open at one size however little it holds
export const WithASetHeight: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog title="Delete repository" onClose={close} height="small" width="large">
                {body}
            </Dialog>
        )}
    />
);

// A Scrolling Body, which is ruled off from the footer for as long as there is more to read
export const AScrollingBody: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog
                title="Delete repository"
                onClose={close}
                height="small"
                footerButtons={[
                    { content: "Cancel", onClick: close },
                    { buttonType: "danger", content: "Delete", onClick: close },
                ]}
            >
                {longBody}
            </Dialog>
        )}
    />
);

// With An Initial Focus, which opens the dialog on the field rather than on the close button
export const WithAnInitialFocus: StoryFn = () => {
    const initialFocusRef = React.useRef<HTMLTextAreaElement>(null);

    return (
        <Example
            render={(close) => (
                <Dialog
                    title="Leave a comment"
                    onClose={close}
                    initialFocusRef={initialFocusRef}
                    footerButtons={[{ buttonType: "primary", content: "Comment", onClick: close }]}
                >
                    <Textarea ref={initialFocusRef} aria-label="Comment" block />
                </Dialog>
            )}
        />
    );
};

// With A Return Focus, which hands focus somewhere other than where it came from
export const WithAReturnFocus: StoryFn = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const returnFocusRef = React.useRef<HTMLButtonElement>(null);

    return (
        <Stack direction="horizontal" gap="condensed">
            <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
            <Button ref={returnFocusRef}>Take focus afterwards</Button>
            {isOpen ? (
                <Dialog
                    title="Delete repository"
                    onClose={() => setIsOpen(false)}
                    returnFocusRef={returnFocusRef}
                >
                    {body}
                </Dialog>
            ) : null}
        </Stack>
    );
};

// With Its Parts Given Directly, which builds the dialog up rather than describing it
export const WithItsPartsGivenDirectly: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog title="Delete repository" onClose={close}>
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
            </Dialog>
        )}
    />
);

const CustomHeader = ({ title, dialogLabelId, onClose }: DialogHeaderRenderProps) => (
    <Dialog.Header className={classes.custom}>
        <Dialog.Title id={dialogLabelId}>{title}</Dialog.Title>
        <Dialog.CloseButton onClose={() => onClose("close-button")} />
    </Dialog.Header>
);

const CustomBody = ({ children }: DialogRenderProps) => (
    <Dialog.Body>
        {children}
        <Link href="https://example.com">Read what deleting a repository takes with it</Link>
    </Dialog.Body>
);

const CustomFooter = ({ footerButtons }: DialogRenderProps) => (
    <Dialog.Footer className={classes.custom}>
        {footerButtons ? <Dialog.Buttons buttons={footerButtons} /> : null}
    </Dialog.Footer>
);

// With Custom Renderers, which take over a part of the dialog altogether
export const WithCustomRenderers: StoryFn = () => (
    <Example
        render={(close) => (
            <Dialog
                title="Delete repository"
                onClose={close}
                renderHeader={CustomHeader}
                renderBody={CustomBody}
                renderFooter={CustomFooter}
                footerButtons={[{ buttonType: "danger", content: "Delete", onClick: close }]}
            >
                {body}
            </Dialog>
        )}
    />
);

// Opened From A Dialog, where only the innermost one answers the escape key
export const OpenedFromADialog: StoryFn = () => {
    const [isSecondOpen, setIsSecondOpen] = React.useState(false);

    return (
        <Example
            render={(close) => (
                <Dialog
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
                </Dialog>
            )}
        />
    );
};
