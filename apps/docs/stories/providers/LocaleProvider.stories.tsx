import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { NativeSelect } from "../../../../packages/react/src/components/native-select";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { TextInput } from "../../../../packages/react/src/components/text-input";
import { useDirection } from "../../../../packages/react/src/providers/direction";
import {
    LocaleProvider,
    useCollator,
    useDateFormatter,
    useFilter,
    useLocaleContext,
    useNumberFormatter,
} from "../../../../packages/react/src/providers/locale";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    panel: "flex flex-col gap-[var(--base-size-8)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-16)]",
    // Logical properties, so the marker moves to whichever side the reading starts from
    marker: "ps-[var(--base-size-12)] border-s-[length:var(--base-size-4)] border-solid border-border-accent-emphasis",
    field: "max-w-[24rem]",
    // A tag and a direction are read as values rather than as prose, so they are set in the
    // monospace stack the rest of the library sets code in
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

const locales = ["en-US", "en-GB", "de-DE", "fr-FR", "sv-SE", "ja-JP", "ar-EG", "he-IL"];

const signature = `<LocaleProvider locale="de-DE">
    <App />
</LocaleProvider>`;

const auto = `<LocaleProvider locale="auto">
    <App />
</LocaleProvider>`;

const nested = `<LocaleProvider locale="ar-EG">
    <Page />
    {/* A figure quoted in the locale it was published in */}
    <LocaleProvider locale="de-DE">
        <Citation />
    </LocaleProvider>
</LocaleProvider>`;

const reading = `const { locale, direction } = useLocaleContext();`;

const formatters = `const date = useDateFormatter({ day: "numeric", month: "long", year: "numeric" });
const number = useNumberFormatter({ style: "currency", currency: "EUR" });

date.format(new Date("2026-08-16"));
number.format(1234.5);`;

const collator = `const collator = useCollator();

const ordered = [...words].sort(collator.compare);`;

const filter = `const { contains } = useFilter({ sensitivity: "base" });

const matches = places.filter((place) => contains(place, term));`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Providers/LocaleProvider",
    decorators: [withPage],
};

// The readout the specimens are written around. It is drawn inside whichever provider is being
// demonstrated, and reports the tag rather than the language, since the tag is what a formatter
// is built from
const Panel = ({ children }: React.PropsWithChildren) => {
    const { locale, direction } = useLocaleContext();

    return (
        <div className={classes.panel}>
            <div className={classes.marker}>
                <Text size="small" className={classes.value}>
                    {locale} · {direction}
                </Text>
            </div>
            {children}
        </div>
    );
};

// What the provider settles, which is one tag — and everything on this page after it is
// something that tag decides
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            LocaleProvider
        </Heading>
        <Text as="p">
            A date, a figure, a sorted list and a search all come out differently depending on who
            is reading them. <Code>LocaleProvider</Code> settles which locale that is for everything
            below it, as a BCP 47 tag such as <Code>en-GB</Code> or <Code>ar-EG</Code>.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            One tag answers four things at once: it is written to <Code>lang</Code>, which tells a
            screen reader which voice to read the subtree in and gives the browser what it needs to
            hyphenate; it settles the reading direction; and it is what every formatter below is
            built from.
        </Text>
        <LocaleProvider locale="de-DE">
            <Panel />
        </LocaleProvider>
        <Text as="p">
            <Code>useLocaleContext</Code> hands back what the subtree settled on. It answers
            wherever it is called: with no provider above, the tag is <Code>en-US</Code>, which is a
            fixed default rather than the reader&apos;s own so that a tree drawn on the server and
            the same tree drawn in the browser agree about what they drew.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{reading}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Auto, which is the one value of `locale` that names no locale, and the reason the default is
// not simply the browser's in the first place
export const Auto: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Auto</Heading>
        <Text as="p">
            <Code>locale=&quot;auto&quot;</Code> follows the browser. It is asked for rather than
            assumed, because a page rendered on the server has no reader to ask: falling back to{" "}
            <Code>en-US</Code> there and then correcting in the browser is a decision the
            application should be making deliberately.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{auto}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <LocaleProvider locale="auto">
            <Panel />
        </LocaleProvider>
        <Text as="p">
            The language a browser is set to can change under a page that is already open, so it is
            subscribed to rather than read once at startup. A tag the browser reports that{" "}
            <Code>Intl</Code> cannot read is replaced with the default rather than handed on, since
            it would otherwise throw at the first formatter built from it.
        </Text>
    </Stack>
);

// Direction, which is not a prop here and deliberately so: a language is not read in a
// direction of the caller's choosing
export const Direction: StoryFn = () => {
    // The rest of the package reads the direction off the context it already reads, and the
    // locale is what settled it
    const Onwards = () => {
        const direction = useDirection();

        return (
            <Text as="p" size="small">
                Onwards is {direction === "rtl" ? "←" : "→"}
            </Text>
        );
    };

    return (
        <Stack gap="normal">
            <Heading size="medium">Direction</Heading>
            <Text as="p">
                There is no <Code>direction</Code> prop. Which way a language is read is a fact
                about the language rather than a choice, so it is worked out from the tag: the
                script the tag maximises to is looked up, and a tag written in Arabic, Hebrew,
                Thaana or one of the other right-to-left scripts turns the subtree around.
            </Text>
            <Text as="p">
                That direction is written to <Code>dir</Code> alongside <Code>lang</Code>, and put
                on the same context <Code>DirectionProvider</Code> uses. So{" "}
                <Code>useDirection</Code> and the attribute the stylesheets are written against
                cannot disagree about the subtree they are both describing.
            </Text>
            <LocaleProvider locale="he-IL">
                <Panel>
                    <Onwards />
                </Panel>
            </LocaleProvider>
            <Text as="p">
                Where the two genuinely have to come apart — a right-to-left interface showing a
                left-to-right code sample, say — a <Code>DirectionProvider</Code> nested inside this
                one still says the last word on the subtree it wraps.
            </Text>
        </Stack>
    );
};

// Nesting, and the case for it: a locale is not only what the reader reads in, it is also what
// a particular piece of content was written in
export const Nesting: StoryFn = () => {
    const Picker = () => {
        const [locale, setLocale] = React.useState(locales[0]);

        return (
            <LocaleProvider locale={locale}>
                <Panel>
                    <NativeSelect
                        size="small"
                        className={classes.field}
                        value={locale}
                        onChange={(event) => setLocale(event.target.value)}
                    >
                        {locales.map((option) => (
                            <NativeSelect.Option key={option} value={option}>
                                {option}
                            </NativeSelect.Option>
                        ))}
                    </NativeSelect>
                </Panel>
            </LocaleProvider>
        );
    };

    return (
        <Stack gap="normal">
            <Heading size="medium">Nesting</Heading>
            <Text as="p">
                A provider given no locale takes the one above it, so a second provider inside the
                first is written only where something is genuinely in another locale — a quotation
                kept in the language it was said in, a language picker naming its own options, a
                figure quoted the way its source printed it.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{nested}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <LocaleProvider locale="ar-EG">
                <Stack gap="condensed">
                    <Panel />
                    {/* Says nothing of its own, so it is read the way the provider above it is */}
                    <LocaleProvider>
                        <Panel />
                    </LocaleProvider>
                    <LocaleProvider locale="de-DE">
                        <Panel />
                    </LocaleProvider>
                </Stack>
            </LocaleProvider>
            <Text as="p">
                The provider holds no state of its own, so a locale that changes is state the
                application holds and passes down.
            </Text>
            <Picker />
        </Stack>
    );
};

// Formatters, which are the part of the provider an application actually calls, and where the
// difference between locales stops being abstract
export const Formatters: StoryFn = () => {
    const Reading = () => {
        const date = useDateFormatter({ day: "numeric", month: "long", year: "numeric" });
        const number = useNumberFormatter({ style: "currency", currency: "EUR" });

        return (
            <Stack gap="condensed">
                <Text as="p" size="small">
                    {date.format(new Date("2026-08-16T00:00:00Z"))}
                </Text>
                <Text as="p" size="small">
                    {number.format(1234.5)}
                </Text>
            </Stack>
        );
    };

    return (
        <Stack gap="normal">
            <Heading size="medium">Formatters</Heading>
            <Text as="p">
                <Code>useDateFormatter</Code> and <Code>useNumberFormatter</Code> build an{" "}
                <Code>Intl</Code> formatter for the locale the subtree is read in. The options are
                the ones <Code>Intl</Code> takes; what the hooks add is that the locale does not
                have to be passed to each call site.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{formatters}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p">
                The same date and the same figure, twice. Nothing about the component below changes
                between them — only the provider it is standing in.
            </Text>
            <Stack gap="condensed">
                <LocaleProvider locale="en-US">
                    <Panel>
                        <Reading />
                    </Panel>
                </LocaleProvider>
                <LocaleProvider locale="de-DE">
                    <Panel>
                        <Reading />
                    </Panel>
                </LocaleProvider>
            </Stack>
            <Text as="p">
                An <Code>Intl</Code> formatter costs far more to build than to use, so they are
                cached against the locale and options they were built from. The same call hands back
                the same formatter rather than a new one on every render, which is what lets one be
                held in a dependency list without a <Code>useMemo</Code> around it.
            </Text>
            <Text as="p">
                Each hook also takes a <Code>locale</Code> of its own, for the odd case that has to
                be spelled out in a locale other than the one it is being read under. Left out, it
                follows the provider.
            </Text>
        </Stack>
    );
};

// Sorting And Searching, which is the half people forget is locale-dependent at all, and where
// getting it wrong is quiet rather than obviously broken
export const SortingAndSearching: StoryFn = () => {
    const Ordered = () => {
        const collator = useCollator();
        const words = ["Zebra", "Äpfel", "Orange"];

        return (
            <List>
                {[...words].sort(collator.compare).map((word) => (
                    <List.Item key={word}>{word}</List.Item>
                ))}
            </List>
        );
    };

    const Search = () => {
        const { contains } = useFilter({ sensitivity: "base" });
        const [term, setTerm] = React.useState("cafe");
        const places = ["Café Central", "Brasserie Lipp", "Konditorei Wien", "Crêperie Josselin"];

        return (
            <Stack gap="condensed">
                <TextInput
                    block
                    size="small"
                    className={classes.field}
                    value={term}
                    onChange={(event) => setTerm(event.target.value)}
                    placeholder="Narrow the list down"
                />
                <List>
                    {places
                        .filter((place) => contains(place, term))
                        .map((place) => (
                            <List.Item key={place}>{place}</List.Item>
                        ))}
                </List>
            </Stack>
        );
    };

    return (
        <Stack gap="normal">
            <Heading size="medium">Sorting and searching</Heading>
            <Text as="p">
                Sorting strings by their code points is not sorting them alphabetically, and the two
                only look alike in English. <Code>useCollator</Code> hands back a collator for the
                locale, which orders the way the reader does.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{collator}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p">
                German reads <Code>ä</Code> as an <Code>a</Code>, so it comes first. Swedish reads
                it as a letter of its own that comes after <Code>z</Code>. Both are correct, and
                which one is right is the locale&apos;s to say.
            </Text>
            <Stack gap="condensed">
                <LocaleProvider locale="de-DE">
                    <Panel>
                        <Ordered />
                    </Panel>
                </LocaleProvider>
                <LocaleProvider locale="sv-SE">
                    <Panel>
                        <Ordered />
                    </Panel>
                </LocaleProvider>
            </Stack>
            <Text as="p">
                <Code>useFilter</Code> is the same idea applied to matching typed text against
                listed text. A plain <Code>includes</Code> compares code points, so{" "}
                <Code>cafe</Code> would not find <Code>Café</Code> and an accent the reader cannot
                easily type would keep an option out of reach.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{filter}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <List>
                <List.Item>
                    <Code>startsWith</Code>, <Code>endsWith</Code> and <Code>contains</Code>, each
                    taking the listed text and then the term
                </List.Item>
                <List.Item>
                    <Code>sensitivity</Code> is what decides how loose the match is:{" "}
                    <Code>base</Code> ignores both case and accents
                </List.Item>
                <List.Item>
                    <Code>ignorePunctuation</Code> strips punctuation from both sides before
                    anything is compared
                </List.Item>
            </List>
            <LocaleProvider locale="fr-FR">
                <Panel>
                    <Search />
                </Panel>
            </LocaleProvider>
        </Stack>
    );
};
