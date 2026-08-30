import * as React from "react";
import {
    Card,
    Clipboard,
    CodeBlock,
    Collapsible,
    Heading,
    Separator,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import type { ComponentExample } from "./ComponentExamples.types";

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
    // The strip sets a title at the start and everything done to the listing at the end. There is
    // no title, since the name over the card already says which example this is, so the button is
    // held to the end rather than left to fall to the start. The line the strip is drawn under
    // sets it apart from a listing it says something about; here it says nothing, and a rule under
    // a button alone would divide the listing from what copies it
    header: "justify-end border-b-0",
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

// Which of the library's components a listing reaches for, read off the listing itself. A tag
// names the component it draws, and a part is named for the component it hangs off, so what
// stands in front of the dot is what has to be imported
const componentsIn = (code: string) => [
    ...new Set([...code.matchAll(/<([A-Z][A-Za-z0-9]*)/g)].map(([, component]) => component)),
];

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

// The whole file an example would be written in: what it imports, and the component it is drawn
// from. It is worked out from the snippet rather than written beside it, so the two cannot fall
// out of step, and a listing that runs to more than a line is returned in brackets the way it
// would have been typed
const fullListing = (name: string, code: string) => {
    const body = code.includes("\n") ? `  return (\n${indent(code, 4)}\n  )` : `  return ${code}`;

    return [
        'import React from "react";',
        `import { ${componentsIn(code).join(", ")} } from "@gamecrafters/base-ui/react";`,
        "",
        `const ${componentName(name)} = () => {`,
        body,
        "}",
    ].join("\n");
};

// One example, as a card: what it draws above, and what was written to draw it below. The card
// gives its padding up, since the listing is already set in from its own edges, and the half
// above is padded on its own instead
const Example = ({ name, description, preview, code }: ComponentExample) => {
    // The snippet is what stands, since it is the part a reader came for; the file it would be
    // written in is there to be asked for. Which of the two is showing is held here rather than
    // left to the disclosure, because both the trigger's words and the listing depend on it
    const [isOpen, setOpen] = React.useState(false);
    const full = fullListing(name, code);

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
                        {/* The clipboard is handed whichever of the two is being read rather than
                            reading it back off the page, so what is copied is what is shown: a
                            reader who asked for the whole file is handed the whole file. Every
                            example on the page carries one, so each is named for the example it
                            stands under rather than left as another "Copy" among several */}
                        <CodeBlock.Header className={classes.header}>
                            <Clipboard value={isOpen ? full : code}>
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
                                <CodeBlock.Code>{code}</CodeBlock.Code>
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
// has to show rather than laying the cards out again
const ComponentExamples = ({ examples }: { examples: ComponentExample[] }) => {
    if (!examples.length) {
        return null;
    }

    return (
        <Stack gap="spacious">
            <Heading as="h2" size="small">
                Examples
            </Heading>
            {/* Every card under the heading is named in its own right, so where the section
                begins is said by a line rather than left to the spacing alone */}
            <Separator />
            {examples.map((example) => (
                <Example key={example.name} {...example} />
            ))}
        </Stack>
    );
};

export default ComponentExamples;
