import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Link } from "../../../../packages/react/src/components/link";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { TextInput } from "../../../../packages/react/src/components/text-input";
import { useId } from "../../../../packages/react/src/hooks/useId";
import { useSyncedState } from "../../../../packages/react/src/hooks/useSyncedState";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    panel: "flex flex-col gap-[var(--base-size-12)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-16)]",
    row: "flex flex-wrap gap-[var(--base-size-8)]",
    field: "max-w-[24rem]",
    muted: "text-foreground-muted",
};

const presets = ["main", "develop", "release/2.0"];

const signature = `const [value, setValue] = useSyncedState(defaultValue);`;

const effect = `// What this hook exists so that nothing has to write
const [value, setValue] = useState(defaultValue);

useEffect(() => {
    setValue(defaultValue);
}, [defaultValue]);`;

const isEqualOption = `const [range, setRange] = useSyncedState(defaultRange, {
    isEqual: (a, b) => a.from === b.from && a.to === b.to,
});`;

const pinned = `const [value, setValue] = useSyncedState(defaultValue, {
    isPropUpdateDisabled: true,
});`;

const lazy = `// Called on every render, not only the first
useSyncedState(() => expensiveDefault());`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useSyncedState",
    decorators: [withPage],
};

// A field that is given a value and may then be typed in. That is the shape the hook is for: the
// prop is where the value starts rather than what it is
const Branch = ({ name }: { name: string }) => {
    const [value, setValue] = useSyncedState(name);
    const id = useId();

    return (
        <Stack gap="condensed" align="start" className={classes.field}>
            <Text as="label" htmlFor={id}>
                Branch
            </Text>
            <TextInput
                block
                id={id}
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
        </Stack>
    );
};

const Demo = () => {
    const [name, setName] = React.useState(presets[0]);

    return (
        <div className={classes.panel}>
            <div className={classes.row}>
                {presets.map((preset) => (
                    <Button
                        key={preset}
                        variant={preset === name ? "primary" : "default"}
                        onClick={() => setName(preset)}
                    >
                        {preset}
                    </Button>
                ))}
            </div>
            <Branch name={name} />
            <Text size="small" className={classes.muted}>
                Type in the field, then choose a different branch. Choosing the one already selected
                changes nothing, since the value it starts from has not changed.
            </Text>
        </div>
    );
};

// The problem the hook is named for: a value that is a prop to begin with and the component's own
// afterwards, which is neither state nor a prop and is usually written as both
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useSyncedState
        </Heading>
        <Text as="p">
            Some values start as a prop and then belong to the component: a field given a default
            that is then typed in, a panel opened to a tab that is then switched. State on its own
            never hears about the prop changing. A prop on its own cannot be changed from inside.
        </Text>
        <Text as="p">
            The usual answer is state and an effect that writes the prop back into it, and it is not
            quite right. The effect runs after the render is painted, so there is a frame in which
            the component is drawn with the old value and then redrawn with the new one.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{effect}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            <Code>useSyncedState</Code> does it during the render instead. When the value it was
            initialised with changes, the state moves with it in the same render — React starts the
            render again with the new value before anything is committed, so nothing is drawn with
            the old one.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            What comes back is a <Code>useState</Code> pair and is used as one. The pattern is{" "}
            <Link href="https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes">
                adjusting state when a prop changes
            </Link>{" "}
            from the React documentation, wrapped up so that the two pieces of state it needs are
            not written out at every call site.
        </Text>
        <Text as="p">
            <Code>ThemeProvider</Code> is written on it three times over. Its colour mode and its
            two schemes are each a prop that the subtree can also set for itself, which is exactly
            the shape: given from outside to begin with, and the provider&apos;s own thereafter.
        </Text>
        <Demo />
    </Stack>
);

// When It Resets, which is the thing to be clear about: it follows changes, not renders, and the
// difference shows up the first time a parent re-renders with the same value
export const WhenItResets: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">When it resets</Heading>
        <Text as="p">
            The state moves when the value it was given changes, and not merely when the component
            renders. The previous value is kept alongside the state and the two are compared, so a
            parent that re-renders for its own reasons does not throw away what the person has
            typed.
        </Text>
        <Text as="p">
            The comparison is against the last value the component was given rather than against the
            state, which is what lets the state be changed from inside and still be reset from
            outside afterwards. It also means the same value passed twice is not a change: in the
            demo above, choosing the branch that is already selected leaves the field as it is.
        </Text>
        <Text as="p">
            A lazy initialiser is accepted, but it is called on every render rather than only the
            first — it has to be, since its result is what the comparison is made against. Anything
            genuinely expensive belongs in a <Code>useMemo</Code> outside the call.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{lazy}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// isEqual, which is the option that has to be reached for rather than the one that can be
// ignored: the default comparison is right for primitives and wrong for everything else
export const IsEqual: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">isEqual</Heading>
        <Text as="p">
            Values are compared with <Code>Object.is</Code>, which is what is wanted for a string, a
            number or a boolean. It is not what is wanted for an object or an array: one written
            inline in the parent is a new object on every render, so the comparison fails every time
            and the state is reset on every render.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{isEqualOption}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            <Code>isEqual</Code> is given the previous value and the next one, and says whether they
            are the same as far as this component is concerned. A prop that is an object needs one,
            or needs to be held still by the parent — and of the two, saying what sameness means
            here is the one that does not depend on every caller remembering.
        </Text>
    </Stack>
);

// isPropUpdateDisabled, which is a longer name than the option deserves and is the right one:
// what it turns off is the following, not the state
export const PinningTheState: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Pinning the state</Heading>
        <Text as="p">
            <Code>isPropUpdateDisabled</Code> stops the state following the value at all. The first
            value initialises it and everything after that is ignored, which makes the call an
            ordinary <Code>useState</Code> that can be turned back into a following one.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{pinned}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Nothing in the library passes it. It is there so that a component which is only
            sometimes controlled can decide at the call site — the same hook, the same pair coming
            back, and one flag saying whether the value it was given is still speaking for it.
        </Text>
    </Stack>
);
