import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { ConfirmationDialog, useConfirm } from ".";
import type { ConfirmationDialogCloseGesture } from "./ConfirmationDialog.types";

const body =
    "Deleting this repository takes it away from everyone who can reach it, along with its issues, its pull requests and everything that has been said on them.";

export default {
    title: "Components/ConfirmationDialog/Features",
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

// A Dangerous Action, which opens with the cancel button focused
export const DangerousAction: StoryFn = () => (
    <Example
        render={(close) => (
            <ConfirmationDialog
                title="Delete repository?"
                confirmButtonContent="Delete"
                confirmButtonType="danger"
                onClose={close}
            >
                {body}
            </ConfirmationDialog>
        )}
    />
);

// A Primary Action, which opens with the confirm button focused
export const PrimaryAction: StoryFn = () => (
    <Example
        render={(close) => (
            <ConfirmationDialog
                title="Publish this release?"
                confirmButtonContent="Publish"
                confirmButtonType="primary"
                onClose={close}
            >
                Everyone watching this repository will hear about the release.
            </ConfirmationDialog>
        )}
    />
);

// Overridden Button Focus, which opens a dangerous action on the confirm button anyway
export const OverriddenButtonFocus: StoryFn = () => (
    <Example
        render={(close) => (
            <ConfirmationDialog
                title="Delete repository?"
                confirmButtonContent="Delete"
                confirmButtonType="danger"
                overrideButtonFocus="confirm"
                onClose={close}
            >
                {body}
            </ConfirmationDialog>
        )}
    />
);

// Loading States, where a button waits on the work it started
export const LoadingStates: StoryFn = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [pending, setPending] = React.useState<ConfirmationDialogCloseGesture | undefined>();

    const close = (gesture: ConfirmationDialogCloseGesture) => {
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
        <>
            <Button onClick={() => setIsOpen(true)}>Show dialog</Button>
            {isOpen ? (
                <ConfirmationDialog
                    title="Delete repository?"
                    confirmButtonContent="Delete"
                    confirmButtonType="danger"
                    confirmButtonLoading={pending === "confirm"}
                    cancelButtonLoading={pending === "cancel"}
                    onClose={close}
                >
                    {body}
                </ConfirmationDialog>
            ) : null}
        </>
    );
};

// The Shorthand Hook, which puts the question up and answers with what was decided
export const ShorthandHook: StoryFn = () => {
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

// A Custom Width, taken from a step of the overlay scale
export const CustomWidth: StoryFn = () => (
    <Example
        render={(close) => (
            <ConfirmationDialog title="Delete repository?" width="large" onClose={close}>
                {body}
            </ConfirmationDialog>
        )}
    />
);
