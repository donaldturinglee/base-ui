import { Card, CodeBlock, Heading, Separator, Stack, Text } from "@gamecrafters/base-ui/react";
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
};

// One example, as a card: what it draws above, and what was written to draw it below. The card
// gives its padding up, since the listing is already set in from its own edges, and the half
// above is padded on its own instead
const Example = ({ name, description, preview, code }: ComponentExample) => (
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
            <CodeBlock language="tsx" className={classes.code}>
                <CodeBlock.Content>
                    <CodeBlock.Code>{code}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
        </Card>
    </Stack>
);

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
