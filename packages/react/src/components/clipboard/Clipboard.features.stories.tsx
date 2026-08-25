import * as React from "react";
import { CheckmarkCircleRegular, LinkRegular } from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { FormControl } from "../form-control";
import { Text } from "../text";
import { Clipboard, useClipboard } from ".";

const classes = {
    container: "w-[var(--overlay-width-medium)]",
    stack: "flex w-[var(--overlay-width-medium)] flex-col gap-[var(--base-size-16)]",
};

const value = "https://github.com/donaldturinglee/base-ui.git";

export default {
    title: "Components/Clipboard/Features",
    parameters: {
        layout: "centered",
    },
};

// With A Name Over The Row, which is what the field is called and what pressing it reaches
export const WithLabel: StoryFn<typeof Clipboard> = () => (
    <div className={classes.container}>
        <Clipboard value={value}>
            <Clipboard.Label>Repository URL</Clipboard.Label>
            <Clipboard.Control>
                <Clipboard.Input />
                <Clipboard.Trigger />
            </Clipboard.Control>
        </Clipboard>
    </div>
);

// As Text Rather Than A Field, for a value that is there to be recognised rather than taken by
// hand. The whole of it still reaches the clipboard however much of it is drawn
export const ValueText: StoryFn<typeof Clipboard> = () => (
    <div className={classes.container}>
        <Clipboard value={value}>
            <Clipboard.Control>
                <Clipboard.ValueText />
                <Clipboard.Trigger />
            </Clipboard.Control>
        </Clipboard>
    </div>
);

// With Words On The Trigger, which names it without an icon having to stand in for the name
export const LabelledTrigger: StoryFn<typeof Clipboard> = () => (
    <div className={classes.container}>
        <Clipboard value={value}>
            <Clipboard.Control>
                <Clipboard.Input aria-label="Repository URL" />
                <Clipboard.Trigger variant="primary">Copy</Clipboard.Trigger>
            </Clipboard.Control>
        </Clipboard>
    </div>
);

// With Words That Report The Copy, where the trigger says what it did rather than leaving the
// tick to say it. The clipboard's own announcement is turned off, since the name already carries
// it and a row is only to report a copy once
export const CopyText: StoryFn<typeof Clipboard> = () => (
    <Clipboard value={value} copiedAnnouncement={null}>
        <Clipboard.Trigger>
            <Clipboard.Indicator />
            <Clipboard.CopyText />
        </Clipboard.Trigger>
    </Clipboard>
);

// With Icons Of Its Own, where the sheets and the tick are not what the row is asking for
export const CustomIndicator: StoryFn<typeof Clipboard> = () => (
    <div className={classes.container}>
        <Clipboard value={value}>
            <Clipboard.Control>
                <Clipboard.Input aria-label="Repository URL" />
                <Clipboard.Trigger label="Copy the clone URL">
                    <Clipboard.Indicator copied={<CheckmarkCircleRegular />}>
                        <LinkRegular />
                    </Clipboard.Indicator>
                </Clipboard.Trigger>
            </Clipboard.Control>
        </Clipboard>
    </div>
);

// With A Longer Wait, for a tick that has to be seen from further across the page
export const Timeout: StoryFn<typeof Clipboard> = () => (
    <div className={classes.container}>
        <Clipboard value={value} timeout={5000}>
            <Clipboard.Label>Copy this link, and the tick stands for five seconds</Clipboard.Label>
            <Clipboard.Control>
                <Clipboard.Input />
                <Clipboard.Trigger />
            </Clipboard.Control>
        </Clipboard>
    </div>
);

// Counting The Copies, where the page wants to know what the reader has taken
export const CopyStatus: StoryFn<typeof Clipboard> = () => {
    const [copies, setCopies] = React.useState(0);

    return (
        <div className={classes.stack}>
            <Clipboard
                value={value}
                onStatusChange={(copied) => {
                    if (copied) {
                        setCopies((count) => count + 1);
                    }
                }}
            >
                <Clipboard.Control>
                    <Clipboard.Input aria-label="Repository URL" />
                    <Clipboard.Trigger />
                </Clipboard.Control>
            </Clipboard>

            <Text size="small">Copied {copies} times</Text>
        </div>
    );
};

// Where The Caller Keeps Hold Of The Value, so that what is copied follows the page rather than
// the clipboard
export const Controlled: StoryFn<typeof Clipboard> = () => {
    const [url, setUrl] = React.useState(value);

    return (
        <div className={classes.stack}>
            <Clipboard value={url} onValueChange={setUrl}>
                <Clipboard.Label>Repository URL</Clipboard.Label>
                <Clipboard.Control>
                    <Clipboard.Input />
                    <Clipboard.Trigger />
                </Clipboard.Control>
            </Clipboard>

            <Button onClick={() => setUrl("git@github.com:donaldturinglee/base-ui.git")}>
                Switch to SSH
            </Button>
        </div>
    );
};

// From The Hook Rather Than The Parts, for a copy control that is not laid out as a row at all
export const Store: StoryFn<typeof Clipboard> = () => {
    const clipboard = useClipboard({ value });

    return <Button onClick={clipboard.copy}>{clipboard.copied ? "Copied" : "Copy"}</Button>;
};

// Inside A Form Control, which names the field and says what it is for
export const InFormControl: StoryFn<typeof Clipboard> = () => (
    <div className={classes.container}>
        <FormControl>
            <FormControl.Label>Repository URL</FormControl.Label>
            <Clipboard value={value}>
                <Clipboard.Control>
                    <Clipboard.Input />
                    <Clipboard.Trigger />
                </Clipboard.Control>
            </Clipboard>
            <FormControl.Caption>Clone over HTTPS</FormControl.Caption>
        </FormControl>
    </div>
);

// Disabled, which leaves the value showing but not to be taken
export const Disabled: StoryFn<typeof Clipboard> = () => (
    <div className={classes.container}>
        <Clipboard value={value} disabled>
            <Clipboard.Label>Repository URL</Clipboard.Label>
            <Clipboard.Control>
                <Clipboard.Input />
                <Clipboard.Trigger />
            </Clipboard.Control>
        </Clipboard>
    </div>
);
