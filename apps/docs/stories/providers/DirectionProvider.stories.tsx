import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import {
    DirectionProvider,
    useDirection,
    useIsRtl,
} from "../../../../packages/react/src/providers/direction";
import type { TextDirection } from "../../../../packages/react/src/providers/direction/Direction.types";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    panel: "flex flex-col gap-[var(--base-size-8)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-16)]",
    // Logical properties, so the marker moves to whichever side the reading starts from
    marker: "ps-[var(--base-size-12)] border-s-[length:var(--base-size-4)] border-solid border-border-accent-emphasis",
    // A direction is read as a value rather than as prose, so it is set in the monospace stack
    // the rest of the library sets code in
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

const signature = `<DirectionProvider direction="rtl">
    <App />
</DirectionProvider>`;

const logical = `.thing {
    padding-inline-start: var(--base-size-12);
    border-inline-start: var(--border-width-thick) solid;
    margin-inline-end: auto;
}`;

const nested = `<DirectionProvider direction="rtl">
    <Page />
    {/* A quotation in the language it was written in, whichever way the page is read */}
    <DirectionProvider direction="ltr">
        <Quotation />
    </DirectionProvider>
</DirectionProvider>`;

const contextOnly = `<DirectionProvider contextOnly direction="rtl">
    <Row />
</DirectionProvider>`;

const reading = `const direction = useDirection();
const isRtl = useIsRtl();`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Providers/DirectionProvider",
    decorators: [withPage],
};

// The specimen every section on this page is written around. The marker is drawn with logical
// properties, so which side of the text it sits on is settled by the provider rather than by
// anything the component itself decides
const Panel = ({ children }: React.PropsWithChildren) => {
    const direction = useDirection();

    return (
        <div className={classes.panel}>
            <div className={classes.marker}>
                <Text size="small" className={classes.value}>
                    dir=&quot;{direction}&quot;
                </Text>
                <Text as="p" size="small">
                    The marker sits on the side the reading starts from
                </Text>
            </div>
            {children}
        </div>
    );
};

// What the provider does, which is one attribute and one context value — and the attribute is
// the important half, because it is what the stylesheets are written against
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            DirectionProvider
        </Heading>
        <Text as="p">
            Arabic, Hebrew and Persian are read right to left, and an interface read that way is not
            a mirror image of one read the other way — it is the same interface with its start and
            its end the other way round. <Code>DirectionProvider</Code> settles which way that is
            for everything below it.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            It renders a <Code>div</Code> carrying <Code>dir</Code>, and puts the same value on a
            context for the components that have to know it. Only two directions are named:{" "}
            <Code>auto</Code> is left out because the browser resolves it to one of these anyway,
            and does so from the content rather than from anything the application decided.
        </Text>
        <DirectionProvider direction="rtl">
            <Panel />
        </DirectionProvider>
    </Stack>
);

// Logical Properties, which is the reason the provider is as small as it is: nearly all of the
// turning around belongs to CSS, and the attribute is what sets CSS going
export const LogicalProperties: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Logical properties</Heading>
        <Text as="p">
            Almost none of the work of turning an interface around is done in JavaScript. A rule
            written in logical properties already knows about direction: <Code>start</Code> and{" "}
            <Code>end</Code> follow the reading, and the browser resolves them from <Code>dir</Code>
            . The styles in this library are written that way throughout, so setting the attribute
            is the whole of what an application has to do.
        </Text>
        <CodeBlock language="css">
            <CodeBlock.Content>
                <CodeBlock.Code>{logical}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <List>
            <List.Item>
                <Code>padding-inline-start</Code> and <Code>margin-inline-end</Code> in place of{" "}
                <Code>left</Code> and <Code>right</Code>
            </List.Item>
            <List.Item>
                <Code>border-inline-start</Code>, <Code>inset-inline</Code> and the rest of the
                logical family for anything positioned against an edge
            </List.Item>
            <List.Item>
                A <Code>:dir(rtl)</Code> selector for the few things logical properties cannot
                express, such as an icon that has to be flipped rather than moved
            </List.Item>
        </List>
        <Text as="p">
            This is why the attribute matters more than the context. A subtree given the direction
            through context alone would report <Code>rtl</Code> and still be laid out left to right,
            because nothing in the stylesheet reads context.
        </Text>
    </Stack>
);

// Nesting, and the case that makes it worth having: a run of text that is read one way inside a
// page that is read the other
export const Nesting: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Nesting</Heading>
        <Text as="p">
            A provider given no direction takes the one above it, so a second provider inside the
            first is only written where something actually turns around. That happens more often
            than it sounds: a quotation, a code sample, a name or an address is read in the
            direction of the language it is written in and not in the direction of the page holding
            it.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{nested}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <DirectionProvider direction="rtl">
            <Stack gap="condensed">
                <Panel />
                {/* Says nothing of its own, so it is read the way the provider above it is */}
                <DirectionProvider>
                    <Panel />
                </DirectionProvider>
                <DirectionProvider direction="ltr">
                    <Panel />
                </DirectionProvider>
            </Stack>
        </DirectionProvider>
    </Stack>
);

// Context Only, which carries the same caveat the theme provider's does and for the same
// reason: the element is what the stylesheet reads, so leaving it out leaves the layout behind
export const ContextOnly: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Context only</Heading>
        <Text as="p">
            <Code>contextOnly</Code> hands the direction down without the wrapping <Code>div</Code>,
            for the places an extra element would be in the way of the layout around it.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{contextOnly}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            What it gives up is everything in the section above. With no element there is no{" "}
            <Code>dir</Code>, so the logical properties go on resolving against whichever ancestor
            carries one: only the value <Code>useDirection</Code> reports changes. Below, the inner
            provider says <Code>ltr</Code> and the marker stays where the outer one put it.
        </Text>
        <DirectionProvider direction="rtl">
            <Stack gap="condensed">
                <Panel />
                <DirectionProvider contextOnly direction="ltr">
                    <Panel />
                </DirectionProvider>
            </Stack>
        </DirectionProvider>
    </Stack>
);

// Reading The Direction, which is the narrow half: what to use when the stylesheet genuinely
// cannot answer, and the reminder that it usually can
export const ReadingTheDirection: StoryFn = () => {
    // Which way "onwards" points is the reading direction's to say, and no stylesheet can
    // choose between two characters
    const Onwards = () => {
        const isRtl = useIsRtl();

        return (
            <div className={classes.marker}>
                <Text as="p" size="small">
                    Onwards is {isRtl ? "←" : "→"}
                </Text>
            </div>
        );
    };

    const Controlled = () => {
        const [direction, setDirection] = React.useState<TextDirection>("ltr");

        return (
            <DirectionProvider direction={direction}>
                <Panel>
                    <Button
                        variant="primary"
                        size="small"
                        onClick={() => setDirection(direction === "ltr" ? "rtl" : "ltr")}
                    >
                        Turn the page around
                    </Button>
                </Panel>
            </DirectionProvider>
        );
    };

    return (
        <Stack gap="normal">
            <Heading size="medium">Reading the direction</Heading>
            <Text as="p">
                <Code>useDirection</Code> hands back the direction the subtree settled on, and{" "}
                <Code>useIsRtl</Code> is the same question asked as a boolean. Both answer wherever
                they are called: the context defaults to <Code>ltr</Code>, which is where{" "}
                <Code>dir</Code> itself lands when nothing has set it.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{reading}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p">
                They are for the handful of cases CSS cannot reach — which arrow a keyboard handler
                treats as forwards, which character an affordance is drawn with, which edge an
                overlay is measured from. Anything a logical property or a <Code>:dir()</Code>{" "}
                selector already handles should stay in the stylesheet, where it costs nothing and
                cannot fall out of step with the attribute.
            </Text>
            <Onwards />
            <Text as="p">
                The provider holds no state of its own, so a direction that changes is state the
                application holds and passes down. The whole of a direction switcher is a piece of
                state and a provider reading it.
            </Text>
            <Controlled />
            <Text as="p">
                Where the direction follows the language rather than a setting of its own, reach for{" "}
                <Code>LocaleProvider</Code> instead. It works the direction out from the locale tag
                and hands it down on this same context, so a subtree read in Arabic turns around
                without being asked to twice.
            </Text>
        </Stack>
    );
};
