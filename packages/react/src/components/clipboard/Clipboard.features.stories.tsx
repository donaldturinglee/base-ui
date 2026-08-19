import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { CodeBlock } from "../code-block";
import { FormControl } from "../form-control";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { Clipboard, ClipboardContext } from ".";

const classes = {
    // A row fills its container, so the stories give it one to fill
    container: "w-[var(--overlay-width-medium)]",
    stack: "flex flex-col gap-[var(--stack-gap-condensed)]",
};

const url = "https://github.com/donaldturinglee/base-ui.git";

const token = "bui_9f2c41a8e07b4d63";

const install = "npm install @gamecrafters/base-ui";

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Clipboard/Features",
    decorators: [withContainer],
    parameters: {
        layout: "centered",
    },
};

// With A Labelled Trigger, where the words say what pressing it does and the indicator stands
// before them
export const WithALabelledTrigger: StoryFn<typeof Clipboard> = () => (
    <Clipboard value={url}>
        <Clipboard.Input aria-label="Repository URL" />
        <Clipboard.Trigger>Copy</Clipboard.Trigger>
    </Clipboard>
);

// A Trigger On Its Own, for a value that is already on the page somewhere else, or one there is
// no reason to show at all
export const WithoutAField: StoryFn<typeof Clipboard> = () => (
    <Clipboard value={url}>
        <Clipboard.Trigger>Copy the clone URL</Clipboard.Trigger>
    </Clipboard>
);

// Inside The Field, where the trigger is the only part of the field that can be pressed. What
// the parts work from is handed down through the context, so a control this component does not
// draw can still put the value on the clipboard
const FieldAction = () => {
    const { disabled, copy } = React.useContext(ClipboardContext);

    return (
        <TextInput.Action
            icon={<Clipboard.Indicator />}
            aria-label="Copy the access token"
            disabled={disabled}
            onClick={() => copy?.()}
        />
    );
};

export const InsideTheField: StoryFn<typeof Clipboard> = () => (
    <Clipboard value={token}>
        <Clipboard.Input
            aria-label="Access token"
            monospace
            block
            trailingAction={<FieldAction />}
        />
    </Clipboard>
);

// Sized, where the field and the trigger are stepped together so neither stands taller than the
// other
export const Sizes: StoryFn<typeof Clipboard> = () => (
    <div className={classes.stack}>
        <Clipboard value={url}>
            <Clipboard.Input size="small" aria-label="Repository URL, small" />
            <Clipboard.Trigger size="small" />
        </Clipboard>

        <Clipboard value={url}>
            <Clipboard.Input aria-label="Repository URL, medium" />
            <Clipboard.Trigger />
        </Clipboard>

        <Clipboard value={url}>
            <Clipboard.Input size="large" aria-label="Repository URL, large" />
            <Clipboard.Trigger size="large" />
        </Clipboard>
    </div>
);

// Disabled, which leaves the value showing but takes away the way of taking it
export const Disabled: StoryFn<typeof Clipboard> = () => (
    <Clipboard value={url} disabled>
        <Clipboard.Input aria-label="Repository URL" />
        <Clipboard.Trigger />
    </Clipboard>
);

// Holding The Tick, for a trigger that is pressed once and then left alone
export const HoldingTheTick: StoryFn<typeof Clipboard> = () => (
    <Clipboard value={url} timeout={0}>
        <Clipboard.Input aria-label="Repository URL" />
        <Clipboard.Trigger />
    </Clipboard>
);

// Named And Described, where the field around it says what the value is and what it is for
export const WithinAFormControl: StoryFn<typeof Clipboard> = () => (
    <FormControl>
        <FormControl.Label>Repository URL</FormControl.Label>
        <Clipboard value={url}>
            <Clipboard.Input block />
            <Clipboard.Trigger />
        </Clipboard>
        <FormControl.Caption>Clone the repository over HTTPS</FormControl.Caption>
    </FormControl>
);

// Beside A Listing, which is where the header of a code block keeps whatever is done to it
export const BesideAListing: StoryFn<typeof Clipboard> = () => (
    <CodeBlock language="shellscript">
        <CodeBlock.Header>
            <CodeBlock.Title>Terminal</CodeBlock.Title>
            <Clipboard value={install}>
                <Clipboard.Trigger variant="invisible" size="small" />
            </Clipboard>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{install}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

// Reporting What It Did, for a caller that keeps its own count of what has been taken
export const ReportingChanges: StoryFn<typeof Clipboard> = () => {
    const [copies, setCopies] = React.useState(0);

    return (
        <div className={classes.stack}>
            <Clipboard value={url} onCopy={() => setCopies((count) => count + 1)}>
                <Clipboard.Input aria-label="Repository URL" />
                <Clipboard.Trigger />
            </Clipboard>

            <Text size="small">
                Copied {copies} {copies === 1 ? "time" : "times"}
            </Text>
        </div>
    );
};
