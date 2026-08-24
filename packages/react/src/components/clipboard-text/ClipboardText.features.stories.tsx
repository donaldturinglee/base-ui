import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { CodeBlock } from "../code-block";
import { FormControl } from "../form-control";
import { Text } from "../text";
import { TextInput } from "../text-input";
import { ClipboardText, ClipboardTextContext } from ".";

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
    title: "Components/ClipboardText/Features",
    decorators: [withContainer],
    parameters: {
        layout: "centered",
    },
};

// With A Labelled Trigger, where the words say what pressing it does and the indicator stands
// before them
export const WithALabelledTrigger: StoryFn<typeof ClipboardText> = () => (
    <ClipboardText value={url}>
        <ClipboardText.Input aria-label="Repository URL" />
        <ClipboardText.Trigger>Copy</ClipboardText.Trigger>
    </ClipboardText>
);

// A Trigger On Its Own, for a value that is already on the page somewhere else, or one there is
// no reason to show at all
export const WithoutAField: StoryFn<typeof ClipboardText> = () => (
    <ClipboardText value={url}>
        <ClipboardText.Trigger>Copy the clone URL</ClipboardText.Trigger>
    </ClipboardText>
);

// Inside The Field, where the trigger is the only part of the field that can be pressed. What
// the parts work from is handed down through the context, so a control this component does not
// draw can still put the value on the clipboard
const FieldAction = () => {
    const { disabled, copy } = React.useContext(ClipboardTextContext);

    return (
        <TextInput.Action
            icon={<ClipboardText.Indicator />}
            aria-label="Copy the access token"
            disabled={disabled}
            onClick={() => copy?.()}
        />
    );
};

export const InsideTheField: StoryFn<typeof ClipboardText> = () => (
    <ClipboardText value={token}>
        <ClipboardText.Input
            aria-label="Access token"
            monospace
            block
            trailingAction={<FieldAction />}
        />
    </ClipboardText>
);

// Sized, where the field and the trigger are stepped together so neither stands taller than the
// other
export const Sizes: StoryFn<typeof ClipboardText> = () => (
    <div className={classes.stack}>
        <ClipboardText value={url}>
            <ClipboardText.Input size="small" aria-label="Repository URL, small" />
            <ClipboardText.Trigger size="small" />
        </ClipboardText>

        <ClipboardText value={url}>
            <ClipboardText.Input aria-label="Repository URL, medium" />
            <ClipboardText.Trigger />
        </ClipboardText>

        <ClipboardText value={url}>
            <ClipboardText.Input size="large" aria-label="Repository URL, large" />
            <ClipboardText.Trigger size="large" />
        </ClipboardText>
    </div>
);

// Disabled, which leaves the value showing but takes away the way of taking it
export const Disabled: StoryFn<typeof ClipboardText> = () => (
    <ClipboardText value={url} disabled>
        <ClipboardText.Input aria-label="Repository URL" />
        <ClipboardText.Trigger />
    </ClipboardText>
);

// Holding The Tick, for a trigger that is pressed once and then left alone
export const HoldingTheTick: StoryFn<typeof ClipboardText> = () => (
    <ClipboardText value={url} timeout={0}>
        <ClipboardText.Input aria-label="Repository URL" />
        <ClipboardText.Trigger />
    </ClipboardText>
);

// Named And Described, where the field around it says what the value is and what it is for
export const WithinAFormControl: StoryFn<typeof ClipboardText> = () => (
    <FormControl>
        <FormControl.Label>Repository URL</FormControl.Label>
        <ClipboardText value={url}>
            <ClipboardText.Input block />
            <ClipboardText.Trigger />
        </ClipboardText>
        <FormControl.Caption>Clone the repository over HTTPS</FormControl.Caption>
    </FormControl>
);

// Beside A Listing, which is where the header of a code block keeps whatever is done to it
export const BesideAListing: StoryFn<typeof ClipboardText> = () => (
    <CodeBlock language="shellscript">
        <CodeBlock.Header>
            <CodeBlock.Title>Terminal</CodeBlock.Title>
            <ClipboardText value={install}>
                <ClipboardText.Trigger variant="invisible" size="small" />
            </ClipboardText>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{install}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

// Reporting What It Did, for a caller that keeps its own count of what has been taken
export const ReportingChanges: StoryFn<typeof ClipboardText> = () => {
    const [copies, setCopies] = React.useState(0);

    return (
        <div className={classes.stack}>
            <ClipboardText value={url} onCopy={() => setCopies((count) => count + 1)}>
                <ClipboardText.Input aria-label="Repository URL" />
                <ClipboardText.Trigger />
            </ClipboardText>

            <Text size="small">
                Copied {copies} {copies === 1 ? "time" : "times"}
            </Text>
        </div>
    );
};
