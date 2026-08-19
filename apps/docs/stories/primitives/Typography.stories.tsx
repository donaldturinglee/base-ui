import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";

const classes = {
    page: "p-[var(--base-size-24)]",
    // The prose on this page is read rather than looked at, so the paragraphs are held to a
    // measure while the specimens below them are not
    prose: "max-w-[42rem]",
    // A specimen is set beside what it is set in, so the whole row is one line of the page and
    // the label under it never runs into the line of type above
    specimen: "flex flex-col gap-[var(--base-size-4)]",
    // A line height is only visible over more than one line, so its specimen is given a width
    // narrow enough to wrap in
    paragraph: "max-w-[28rem]",
    label: "flex flex-wrap gap-[var(--base-size-8)]",
    muted: "text-foreground-muted",
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

// The semantic roles, each one a class name of its own. The class names are written out rather
// than built up, since what is never written down is never drawn: the stylesheet is generated
// from what the source is seen to use
const roles = [
    {
        className: "text-display",
        token: "--text-display-shorthand",
        use: "Hero text, where a page is introducing the product rather than getting on with it",
    },
    {
        className: "text-title-large",
        token: "--text-title-shorthand-large",
        use: "The heading of a page about something a person made, such as an issue",
    },
    {
        className: "text-title-medium",
        token: "--text-title-shorthand-medium",
        use: "The default page title, on a line height that agrees with a medium control",
    },
    {
        className: "text-title-small",
        token: "--text-title-shorthand-small",
        use: "Body (large) at a heavier weight, for a heading inside a page",
    },
    {
        className: "text-subtitle",
        token: "--text-subtitle-shorthand",
        use: "A section heading, or a name that matters less than the title above it",
    },
    {
        className: "text-body-large",
        token: "--text-body-shorthand-large",
        use: "Content a person wrote, and anything rendered from markdown",
    },
    {
        className: "text-body-medium",
        token: "--text-body-shorthand-medium",
        use: "The default. Most text on most pages is this",
    },
    {
        className: "text-body-small",
        token: "--text-body-shorthand-small",
        use: "Helper and footnote text, used sparingly",
    },
    {
        className: "text-caption",
        token: "--text-caption-shorthand",
        use: "One line, tightly set. Too small to be read at length",
    },
    {
        className: "text-code-block",
        token: "--text-code-block-shorthand",
        use: "A listing set apart from the prose around it",
    },
    {
        className: "text-code-inline",
        token: "--text-code-inline-shorthand",
        use: "A name or a command inside a line of prose, sized in em so it follows what it sits in",
    },
];

// The size scale, largest first, so it is read the way it is drawn
const sizes = [
    { token: "--base-text-size-2xl", pixels: "40px" },
    { token: "--base-text-size-xl", pixels: "32px" },
    { token: "--base-text-size-lg", pixels: "20px" },
    { token: "--base-text-size-md", pixels: "16px" },
    { token: "--base-text-size-sm", pixels: "14px" },
    { token: "--base-text-size-xs", pixels: "12px" },
];

const weights = [
    { token: "--base-text-weight-light", name: "light" },
    { token: "--base-text-weight-normal", name: "normal" },
    { token: "--base-text-weight-medium", name: "medium" },
    { token: "--base-text-weight-semibold", name: "semibold" },
];

const lineHeights = [
    { token: "--base-text-line-height-tight", use: "One line in a compact control" },
    { token: "--base-text-line-height-snug", use: "Display text and large headings" },
    { token: "--base-text-line-height-normal", use: "Body text, and anything unsure of itself" },
    { token: "--base-text-line-height-relaxed", use: "Longer content, and the smaller sizes" },
    { token: "--base-text-line-height-loose", use: "Footnotes and legal text, used sparingly" },
];

const stacks = [
    { token: "--font-stack-sans-serif", use: "Body text and the interface generally" },
    { token: "--font-stack-sans-serif-display", use: "Headings and titles" },
    { token: "--font-stack-monospace", use: "Code, and anything read as a value" },
];

const sizeTokens = sizes.map(({ token }) => token);

const weightTokens = weights.map(({ token }) => token);

const lineHeightTokens = lineHeights.map(({ token }) => token);

const stackTokens = stacks.map(({ token }) => token);

const component = `<Heading size="medium">Pull requests</Heading>
<Text size="medium">Everything waiting on a review.</Text>`;

const specimen = "The quick brown fox jumps over the lazy dog";

// What a token actually resolves to. The type tokens do not change with the scheme, but they
// are read off the document the same way the colours are rather than being written down twice
// and left to drift from the stylesheet they came out of
const useResolvedValues = (names: string[]) => {
    const [values, setValues] = React.useState<Record<string, string>>({});

    React.useEffect(() => {
        const style = getComputedStyle(document.documentElement);

        setValues(
            Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name).trim()])),
        );
    }, [names]);

    return values;
};

const Label = ({ token, value, use }: { token: string; value?: string; use?: string }) => (
    <div className={classes.label}>
        <Text size="small" className={classes.value}>
            {token}
        </Text>
        {value ? (
            <Text size="small" className={classes.muted}>
                {value}
            </Text>
        ) : null}
        {use ? (
            <Text size="small" className={classes.muted}>
                {use}
            </Text>
        ) : null}
    </div>
);

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Primitives/Typography",
    decorators: [withPage],
};

// How the type is held, which is the same two levels the colours are held at: scales underneath,
// and a set of names above them for what a piece of text is doing
export const Default: StoryFn = () => (
    <Stack gap="normal" className={classes.prose}>
        <Heading as="h1" size="large">
            Typography
        </Heading>
        <Text as="p">
            Underneath are three scales — size, weight and line height — and three font stacks.
            Above them are the roles: <Code>display</Code>, <Code>title</Code>,{" "}
            <Code>subtitle</Code>, <Code>body</Code>, <Code>caption</Code> and <Code>code</Code>. A
            role is a whole setting rather than a size, so it names the size, the weight, the line
            height and the stack together and is applied as one class.
        </Text>
        <Text as="p">
            Almost nothing reaches for a role directly. <Code>Heading</Code> and <Code>Text</Code>{" "}
            are what an application writes, and each one is a role underneath: a heading is a title,
            and text is body. Reaching past them is for the cases they do not cover.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{component}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// The Roles, drawn in the setting each one names. This is the page a reader comes to when they
// know what the text is for and want to know what to set it in
export const Roles: StoryFn = () => (
    <Stack gap="spacious">
        {roles.map(({ className, token, use }) => (
            <div key={token} className={classes.specimen}>
                <span className={className}>{specimen}</span>
                <Label token={`.${className}`} value={token} use={use} />
            </div>
        ))}
    </Stack>
);

// Size, which is the scale the roles are built out of. A size on its own says nothing about what
// the text is for, which is why a role names one rather than a caller naming it
export const Size: StoryFn = () => {
    const values = useResolvedValues(sizeTokens);

    return (
        <Stack gap="spacious">
            {sizes.map(({ token, pixels }) => (
                <div key={token} className={classes.specimen}>
                    <span style={{ fontSize: `var(${token})` }}>{specimen}</span>
                    <Label
                        token={token}
                        value={values[token] ? `${values[token]} · ${pixels}` : pixels}
                    />
                </div>
            ))}
        </Stack>
    );
};

// Weight, of which there are four. Emphasis inside a sentence is the Text component's own
// weight prop; these are what that prop and the roles are both drawn from
export const Weight: StoryFn = () => {
    const values = useResolvedValues(weightTokens);

    return (
        <Stack gap="spacious">
            {weights.map(({ token, name }) => (
                <div key={token} className={classes.specimen}>
                    <span style={{ fontWeight: `var(${token})` }}>{specimen}</span>
                    <Label token={token} value={values[token]} use={name} />
                </div>
            ))}
        </Stack>
    );
};

// Line Height, which only shows itself over more than one line, so the specimens are given a
// width narrow enough to wrap in rather than a sentence that never reaches the edge
export const LineHeight: StoryFn = () => {
    const values = useResolvedValues(lineHeightTokens);

    return (
        <Stack gap="spacious">
            {lineHeights.map(({ token, use }) => (
                <div key={token} className={classes.specimen}>
                    <p className={classes.paragraph} style={{ lineHeight: `var(${token})` }}>
                        {specimen}, and then it does it again, and again, until there is more of it
                        than will fit on one line and the spacing between the lines is what there is
                        to look at.
                    </p>
                    <Label token={token} value={values[token]} use={use} />
                </div>
            ))}
        </Stack>
    );
};

// The Font Stacks, which are three names for what is very nearly one list: the display stack is
// the sans-serif one said separately, so a decision about headings can be made later without
// every heading having to be found first
export const FontStacks: StoryFn = () => {
    const values = useResolvedValues(stackTokens);

    return (
        <Stack gap="spacious">
            {stacks.map(({ token, use }) => (
                <div key={token} className={classes.specimen}>
                    <span style={{ fontFamily: `var(${token})` }}>{specimen}</span>
                    <Label token={token} use={use} />
                    <Text size="small" className={classes.value}>
                        {values[token]}
                    </Text>
                </div>
            ))}
        </Stack>
    );
};
