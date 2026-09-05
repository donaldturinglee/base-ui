import * as React from "react";
import {
    Button,
    Card,
    Clipboard,
    CodeBlock,
    Collapsible,
    Heading,
    Separator,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import { storybookUrl } from "../storybook";
import type { ComponentExample, ComponentExternalPackage } from "./ComponentExamples.types";

const classes = {
    // The line under the name is read, the listing under it is copied, so only the prose is held
    // to a measure
    description: "max-w-[46rem] text-[var(--foreground-color-muted)]",
    // The two halves meet along a line rather than standing apart, so the card is read as the one
    // thing with the listing under what it draws
    card: "gap-0",
    // The block carries a frame of its own, which inside the card would be a second one drawn
    // just within the first. All of it is taken away but the edge between the halves, which is
    // what sets the two apart, and the corners go with it since the card is already rounded
    code: "rounded-none border-x-0 border-b-0",
    // The strip sets a title at the start and everything done to the listing at the end, which is
    // where the two controls fall without being told to: the way out to the Storybook stands where
    // a title would, and what copies the listing is held to the far end. The line the strip is
    // drawn under sets it apart from a listing it says something about; here it says nothing, and
    // a rule under the controls alone would divide the listing from what acts on it
    header: "border-b-0",
    // The strip along the foot of the card, on the same ground the listing above it stands on, so
    // that the two read as the one half of the card rather than as a row that has wandered in
    // under it
    footer: "bg-[var(--background-color-muted)]",
    // A disclosure is drawn as a row the width of what it stands in, which is what this one is:
    // the whole strip answers the press rather than the words alone. Its words are set in the
    // middle of that row, and the chevron after them is stopped from being pushed to the far end
    // by a label that would otherwise take the room between them. It is read as an aside to the
    // example rather than as a heading over it, so it is set in the size and colour of one
    // The chevron turns over as the listing is swapped. Nothing is being revealed for it to follow
    // — one listing stands in for the other — so it turns at once rather than being run through
    trigger:
        "justify-center [&>span]:grow-0 [&_svg]:transition-none text-[length:var(--text-body-size-small)] font-normal text-[var(--foreground-color-muted)]",
    // The panel is padded and coloured for prose. The listing brings its own room and its own
    // colours, so what the panel would put around it is taken back off. It is run out to its
    // height as it opens, which reads as the listing arriving; here it is the longer of two that
    // were both already written, so it is put up at once rather than drawn out
    panel: "p-0 text-inherit animate-none",
};

// What the link to the Storybook is opened with. The Storybook is a document of its own rather
// than a page the router draws, so it is opened away from the example instead of in place of it,
// and the reader keeps what they were reading to come back to
const storybookLinkProps = {
    target: "_blank",
    rel: "noreferrer",
} as const;

// Where in the Storybook the component being read about is written up. A section is named by the
// title it is collected under, run together and lowered, and the library collects every component
// under the name it is exported as, so that name is all that has to be given.
//
// The section is named rather than a story within it, which leaves the Storybook to open it at the
// first story it holds. Nothing here has to know what the stories are called, and a component that
// gains or loses one is still arrived at
const storybookSection = (component: string) =>
    `${storybookUrl}?path=/story/components-${component.toLowerCase()}`;

// Which of the library's components a listing reaches for, read off the listing itself. A tag
// names the component it draws, and a part is named for the component it hangs off, so what
// stands in front of the dot is what has to be imported
const componentsIn = (code: string) => [
    ...new Set([...code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map(([, component]) => component)),
];

// Whether a name is an icon's rather than a component's. The icons are a package of their own
// rather than part of the library, so a listing that reaches for one imports it from somewhere
// else. Every icon is named for the weight it is drawn at and the package ships the one weight, so
// the name says which of the two packages it came from and the listing does not have to be told
const isIcon = (component: string) => component.endsWith("Regular");

// A component handed to a prop rather than drawn as a tag, which is how one component is given
// another to be: an icon passed to the place a component keeps for one, so that whatever draws it
// settles the size and the colour, or the element a part is to be drawn as in place of its own.
//
// What a listing already has in hand is written in lower case, as the setup above it is, so a name
// in upper case here is one that had to be imported to be handed over at all
const handedOver = (code: string) => [
    ...new Set([...code.matchAll(/=\{([A-Z][A-Za-z0-9]*)\}/g)].map(([, name]) => name)),
];

// A hook the library exports, which is called in what an example gets ready rather than drawn as a
// tag, so it is looked for by the call rather than by the mark that opens an element. One reached
// for through something else — React's own, on the namespace it was imported under — is already in
// hand and is passed over
const hooksIn = (code: string) => [
    ...new Set([...code.matchAll(/(?<![.\w])(use[A-Z][A-Za-z0-9]*)\(/g)].map(([, hook]) => hook)),
];

// What a listing imports, a line to the package it is imported from. A package nothing was drawn
// from is left out rather than written as an empty pair of braces.
//
// The tags and the props are read off the element alone, since what an example gets ready is
// ordinary code, and the mark a tag is opened with is a type annotation's as readily as an
// element's. A hook is read off both, being called in the one and now and then in the other
const importsIn = (
    { setup = "", code }: Pick<ComponentExample, "setup" | "code">,
    external?: ComponentExternalPackage,
) => {
    const names = [
        ...new Set([...componentsIn(code), ...handedOver(code), ...hooksIn(`${setup}\n${code}`)]),
    ];
    const icons = names.filter(isIcon);
    const outside = names.filter((name) => external?.exports.includes(name) ?? false);
    const rest = names.filter((name) => !isIcon(name) && !outside.includes(name));

    return [
        rest.length ? `import { ${rest.join(", ")} } from "@gamecrafters/base-ui/react";` : "",
        icons.length ? `import { ${icons.join(", ")} } from "@gamecrafters/base-ui-icons";` : "",
        outside.length && external
            ? `import { ${outside.join(", ")} } from "${external.name}";`
            : "",
    ].filter(Boolean);
};

// An example is named in words on the page and a component is named in one, so the words are run
// together to make a name the listing can be written under
const componentName = (name: string) =>
    name
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
        .join("");

// Every line of a listing moved in by the same amount, so a snippet keeps the shape it was written
// in wherever it is set down. An empty line is left empty rather than padded out with the rest
const indent = (code: string, spaces: number) =>
    code
        .split("\n")
        .map((line) => (line.trim() ? `${" ".repeat(spaces)}${line}` : line))
        .join("\n");

// The snippet as it stands on the page: what the example has to have in hand, and the element it
// draws under it. The two are read as the one thing, so they are set down together rather than the
// second alone, and an example with nothing to get ready is the element by itself
const snippetOf = ({ setup, code }: ComponentExample) => (setup ? `${setup}\n\n${code}` : code);

// The whole file an example would be written in: what it imports, and the component it is drawn
// from. It is worked out from the snippet rather than written beside it, so the two cannot fall
// out of step, and a listing that runs to more than a line is returned in brackets the way it
// would have been typed
const fullListing = (example: ComponentExample, external?: ComponentExternalPackage) => {
    const { name, setup, code } = example;
    const body = code.includes("\n") ? `  return (\n${indent(code, 4)}\n  )` : `  return ${code}`;

    return [
        'import React from "react";',
        ...importsIn(example, external),
        "",
        `const ${componentName(name)} = () => {`,
        // What the example got ready stands inside the component, above what it returns, which is
        // where it would have been typed
        ...(setup ? [indent(setup, 2), ""] : []),
        body,
        "}",
    ].join("\n");
};

// One example, as a card: what it draws above, and what was written to draw it below. The card
// gives its padding up, since the listing is already set in from its own edges, and the half
// above is padded on its own instead
const Example = ({
    storybookHref,
    external,
    ...example
}: ComponentExample & { storybookHref: string; external?: ComponentExternalPackage }) => {
    const { name, description, preview } = example;
    // The snippet is what stands, since it is the part a reader came for; the file it would be
    // written in is there to be asked for. Which of the two is showing is held here rather than
    // left to the disclosure, because both the trigger's words and the listing depend on it
    const [isOpen, setOpen] = React.useState(false);
    const snippet = snippetOf(example);
    const full = fullListing(example, external);

    return (
        <Stack gap="condensed">
            <Heading as="h3" size="small">
                {name}
            </Heading>
            {description ? (
                <Text as="p" size="small" className={classes.description}>
                    {description}
                </Text>
            ) : null}
            <Card padding="none" className={classes.card}>
                <Stack gap="normal" padding="spacious">
                    {preview}
                </Stack>
                <Collapsible open={isOpen} onChange={setOpen}>
                    <CodeBlock language="tsx" className={classes.code}>
                        <CodeBlock.Header className={classes.header}>
                            {/* Where the component is gone through rather than read about: every
                                way it can be drawn, each of them working, which is more than a
                                page of examples sets out to show. It leads to the section the
                                component is written up in rather than to the Storybook's front
                                door, so the reader arrives at what they were already reading
                                about. It is named in words rather than by a mark, since there is
                                nothing a reader would already know to look for */}
                            <Button
                                as="a"
                                href={storybookHref}
                                variant="default"
                                size="small"
                                {...storybookLinkProps}
                            >
                                Storybook
                            </Button>
                            {/* The clipboard is handed whichever of the two is being read rather
                                than reading it back off the page, so what is copied is what is
                                shown: a reader who asked for the whole file is handed the whole
                                file. Every example on the page carries one, so each is named for
                                the example it stands under rather than left as another "Copy"
                                among several */}
                            <Clipboard value={isOpen ? full : snippet}>
                                <Clipboard.Trigger
                                    variant="invisible"
                                    size="small"
                                    label={`Copy the ${name} example`}
                                />
                            </Clipboard>
                        </CodeBlock.Header>
                        {/* The snippet stands until the whole file is asked for, and gives way to
                            it rather than standing above it: the file already holds the snippet,
                            and the two together would say it twice */}
                        {isOpen ? null : (
                            <CodeBlock.Content>
                                <CodeBlock.Code>{snippet}</CodeBlock.Code>
                            </CodeBlock.Content>
                        )}
                        <Collapsible.Panel className={classes.panel}>
                            <CodeBlock.Content>
                                <CodeBlock.Code>{full}</CodeBlock.Code>
                            </CodeBlock.Content>
                        </Collapsible.Panel>
                    </CodeBlock>
                    {/* What asks for the whole file stands under the listing rather than over it,
                        where a reader who has read to the end of the snippet is already looking.
                        The strip is what it is drawn on, so the ground stays where it is while the
                        row over it lifts under the pointer */}
                    <Stack className={classes.footer}>
                        <Collapsible.Trigger className={classes.trigger}>
                            {isOpen ? "Collapse code" : "Show full code"}
                        </Collapsible.Trigger>
                    </Stack>
                </Collapsible>
            </Card>
        </Stack>
    );
};

// Every example the page shows, in the order they are meant to be read: the plainest first, and
// whatever it takes to say the rest after it. The cards are the other thing every component page
// is built the same way out of, so they are written once here and each page hands over what it
// has to show rather than laying the cards out again.
//
// The component is named as the library exports it rather than as the page titles it, since that
// is the name the Storybook collects its stories under. It is said by the page rather than read
// off a listing, because a listing names whatever it was written with and the outermost of those
// is as often the thing an example is laid out in as the thing it is about
const ComponentExamples = ({
    component,
    examples,
    external,
}: {
    component: string;
    examples: ComponentExample[];
    // Named only by a page whose examples are drawn out of another package's parts as well as the
    // library's, so that the whole file each of them would be written in says where every name in
    // it came from
    external?: ComponentExternalPackage;
}) => {
    if (!examples.length) {
        return null;
    }

    // Every card leads to the one section, since it is the component they are all examples of, so
    // where that is is worked out once here rather than again under each of them
    const storybookHref = storybookSection(component);

    return (
        <Stack gap="spacious">
            <Heading as="h2" size="small">
                Examples
            </Heading>
            {/* Every card under the heading is named in its own right, so where the section
                begins is said by a line rather than left to the spacing alone */}
            <Separator />
            {examples.map((example) => (
                <Example
                    key={example.name}
                    storybookHref={storybookHref}
                    external={external}
                    {...example}
                />
            ))}
        </Stack>
    );
};

export default ComponentExamples;
