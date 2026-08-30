import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { useIsomorphicLayoutEffect } from "../../../../packages/react/src/hooks/useIsomorphicLayoutEffect";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    panel: "flex flex-col items-start gap-[var(--base-size-8)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-16)]",
    // The ref is put on the box around the passage rather than on the passage, so what is
    // measured is an ordinary element and the demo says nothing about how Text forwards a ref
    measured: "max-w-[28rem]",
    // The measurement is read as a value rather than as prose, so it is set in the monospace
    // stack the rest of the library sets code in
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

const passages = [
    "A short line.",
    "A longer one, long enough that it has to wrap and the box it is drawn in grows taller to hold it.",
    "Longer still. Every time the passage changes the box is measured again, and the number below is the one the box already has rather than the one it had a moment ago.",
];

const source = `export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;`;

const measuring = `useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) {
        return;
    }

    setHeight(element.getBoundingClientRect().height);
}, [passage]);`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useIsomorphicLayoutEffect",
    decorators: [withPage],
};

// What the hook is, which is one line of code and a paragraph of reason: the choice between two
// of React's own effects, made once, where the wrong one would warn on every server render
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useIsomorphicLayoutEffect
        </Heading>
        <Text as="p">
            <Code>useLayoutEffect</Code> runs after the DOM has been written and before the browser
            paints, which is the only moment at which something can be measured and moved without
            the move being seen. On the server there is no DOM to measure and no paint to be ahead
            of, so React warns whenever it finds one there.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{source}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The whole hook is that line. It is <Code>useLayoutEffect</Code> where there is a
            document and <Code>useEffect</Code> where there is not, so a component that measures
            itself can be rendered on the server without warning and still be measured correctly in
            the browser.
        </Text>
    </Stack>
);

const Measured = () => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [index, setIndex] = React.useState(0);
    const [height, setHeight] = React.useState(0);

    useIsomorphicLayoutEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        setHeight(Math.round(element.getBoundingClientRect().height));
    }, [index]);

    return (
        <div className={classes.panel}>
            <div ref={ref} className={classes.measured}>
                <Text as="p">{passages[index]}</Text>
            </div>
            <Text size="small" className={classes.value}>
                {height}px
            </Text>
            <Button onClick={() => setIndex((index + 1) % passages.length)}>
                Change the passage
            </Button>
        </div>
    );
};

// Measuring, which is the case the hook exists for. The demo is the ordinary shape of it: render,
// measure what was rendered, and put the measurement back before anything is seen
export const Measuring: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Measuring</Heading>
        <Text as="p">
            Anything that has to read the page it has just drawn belongs in a layout effect: a
            popover working out whether it has room to open downwards, a row deciding how many of
            its items still fit, a panel animating from the height it happens to have.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{measuring}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Setting state from a layout effect renders a second time before the paint, so what the
            person sees is the corrected result and never the uncorrected one. The same code in{" "}
            <Code>useEffect</Code> is not wrong, only late: the first version is painted, and the
            correction arrives as a flicker.
        </Text>
        <Measured />
    </Stack>
);

// On The Server, which is worth saying plainly because the fallback is easy to misread as making
// the effect work there. It does not: it makes it quiet
export const OnTheServer: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">On the server</Heading>
        <Text as="p">
            Neither effect runs during a server render — React runs no effects there at all. The
            fallback is not making the measurement happen on the server; it is agreeing that it
            cannot, and choosing the effect that does not complain about it.
        </Text>
        <Text as="p">
            What follows from that is the thing to design around: the first markup is drawn without
            the measurement, and the measurement arrives in the browser. A component that measures
            itself needs a sensible answer for the render before it has measured anything, since
            that is the render the server sends and the one the client hydrates against.
        </Text>
        <Text as="p">
            The choice is made once, when the module is loaded, from whether there is a{" "}
            <Code>document</Code> to be had. It is not re-read per render, so nothing about it
            changes underneath a component while it is mounted.
        </Text>
    </Stack>
);
