import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { TextInput } from "../../../../packages/react/src/components/text-input";
import { useId } from "../../../../packages/react/src/hooks/useId";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    field: "max-w-[24rem]",
    muted: "text-foreground-muted",
    // An id is read as a value rather than as prose, so it is set in the monospace stack the
    // rest of the library sets code in
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

const signature = `const uuid = useId(id);`;

const field = `const Field = ({ id, label }: FieldProps) => {
    const uuid = useId(id);

    return (
        <>
            <label htmlFor={uuid}>{label}</label>
            <input id={uuid} />
        </>
    );
};`;

const derived = `const uuid = useId(id);
const labelId = \`\${uuid}-label\`;
const announcementId = \`\${uuid}-loading-announcement\`;`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useId",
    decorators: [withPage],
};

// The specimen this page is written around: a field that ties its label to its input, which is
// the case nearly every use of the hook comes down to
const Field = ({ id, label }: { id?: string; label: string }) => {
    const uuid = useId(id);

    return (
        <Stack gap="condensed" align="start" className={classes.field}>
            <Text as="label" htmlFor={uuid}>
                {label}
            </Text>
            <TextInput block id={uuid} placeholder="base-ui" />
            <Text size="small" className={classes.value}>
                {uuid}
            </Text>
        </Stack>
    );
};

// What the hook is, which is a small thing said clearly: an id a component can always have, and
// one a caller can always take back
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useId
        </Heading>
        <Text as="p">
            A component that ties one element to another needs an id to tie them with — a label to
            its field, a control to the thing it describes, a button to what it opens. It cannot be
            written down, because two of the component on one page would then be two of the same id.{" "}
            <Code>useId</Code> makes one, and takes the caller&apos;s instead where there is one.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            That is the whole of it. React&apos;s own <Code>useId</Code> is what generates the
            value, and this wraps it in the one decision the library needed to make: an id the
            caller passed wins, so a form that has already named its fields is not renamed by the
            components drawing them.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{field}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Field label="Repository" />
    </Stack>
);

// Provided, which is the half of the hook that is not React's: what a caller passes is passed
// through, so a page that already knows the id of a field can still say so
export const Provided: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Provided</Heading>
        <Text as="p">
            An id given to the component is the id it uses. That matters because ids are how one
            part of a page reaches another: a label written elsewhere, an{" "}
            <Code>aria-describedby</Code> pointing at an error message, a link to an anchor. A
            component that overrode what it was given would break every one of those.
        </Text>
        <Field id="repository-name" label="Repository" />
        <Text as="p">
            The generated value is opaque, and deliberately so. It is a name for a relationship
            between two elements rather than a handle on either of them, so nothing should be
            written to select on it — a caller that needs to find the element gives it an id.
        </Text>
    </Stack>
);

// Derived, which is the pattern the components actually use: one id, and the rest built off it,
// so a component with four related elements still asks for one thing
export const Derived: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Derived</Heading>
        <Text as="p">
            A component often needs more than one id — a label, a description, a live region — and
            calling the hook once for each would be several unrelated names for parts of one thing.
            One id is taken and the rest are built from it, which keeps them related on the page as
            they are in the component.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{derived}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            <Code>Button</Code> does exactly this: its loading announcement and the label the
            spinner stands in front of are both derived from the one id, so a caller passing{" "}
            <Code>id</Code> names all three at once.
        </Text>
    </Stack>
);
