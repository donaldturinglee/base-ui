import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import * as icons from "@gamecrafters/base-ui-icons";
import {
    AlertRegular,
    DeleteRegular,
    SaveRegular,
    SearchRegular,
    StarRegular,
} from "@gamecrafters/base-ui-icons";
import type { Icon } from "@gamecrafters/base-ui-icons";
import { Code } from "../../components/code";
import { CodeBlock } from "../../components/code-block";
import { Heading } from "../../components/heading";
import { Stack } from "../../components/stack";
import { Text } from "../../components/text";
import { TextInput } from "../../components/text-input";

const classes = {
    page: "p-[var(--base-size-24)]",
    // The prose on this page is read rather than looked at, so the paragraphs are held to a
    // measure while the specimens below them are not
    prose: "max-w-[42rem]",
    row: "flex flex-wrap items-end gap-[var(--base-size-24)]",
    cell: "flex flex-col items-center gap-[var(--base-size-4)]",
    // Every icon is drawn in the same square whatever it is drawn at, so a row of sizes is read
    // as a row of sizes rather than as a row of boxes of different heights
    frame: "flex h-[4rem] w-[4rem] items-center justify-center",
    gallery: "grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-[var(--base-size-16)]",
    // A name is what the icon is imported under, so it is written out in full rather than cut
    // off, and is allowed to break wherever it has to
    tile: "flex flex-col items-center gap-[var(--base-size-8)] break-words p-[var(--base-size-8)] text-center",
    muted: "text-foreground-muted",
    filter: "max-w-[24rem]",
};

// Every icon in the package, in the order the module gives them. The package exports nothing
// but the icons, so the module is the catalogue
const catalogue = Object.entries(icons) as [string, Icon][];

const sizes = [16, 20, 24, 32, 48];

// The foreground roles an icon is most often drawn under, which are the same ones the text it
// stands beside is drawn under
const roles = ["default", "muted", "accent", "success", "attention", "danger"];

const install = "npm install @gamecrafters/base-ui-icons";

const imported = `import { SearchRegular } from "@gamecrafters/base-ui-icons";

const Example = () => <SearchRegular size={20} />;`;

const decorative = `<SaveRegular />

<SaveRegular aria-label="Save" />`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Primitives/Icons",
    decorators: [withPage],
};

// What the icons are and where they come from, which is not this package: they are installed
// beside it, so an application that draws its own icons is not made to carry these as well
export const Default: StoryFn = () => (
    <Stack gap="normal" className={classes.prose}>
        <Heading as="h1" size="large">
            Icons
        </Heading>
        <Text as="p">
            The icons are their own package, <Code>@gamecrafters/base-ui-icons</Code>. Base UI
            reaches for them itself — a chevron on a collapsible, a tick on a clipboard — but an
            application installs them in its own right, so one that has icons of its own is not made
            to carry a second set.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{install}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            There are {catalogue.length} of them and they are drawn at one weight, so a name is the
            icon and the suffix <Code>Regular</Code> is the whole of the rest of it. Each is a React
            component drawing an <Code>svg</Code>, and each takes a ref, a <Code>className</Code>{" "}
            and whatever else an <Code>svg</Code> takes.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{imported}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Size, which is one number rather than a width and a height: the icons are square, and the
// artwork is drawn from whichever of the natural sizes is closest below what was asked for
export const Size: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Size</Heading>
        <Text as="p" className={classes.prose}>
            <Code>size</Code> is given in pixels and falls back to 16, which is the size an icon
            sits at beside a line of body text. Anything larger is a deliberate act rather than the
            default.
        </Text>
        <div className={classes.row}>
            {sizes.map((size) => (
                <div key={size} className={classes.cell}>
                    <div className={classes.frame}>
                        <StarRegular size={size} />
                    </div>
                    <Text size="small" className={classes.muted}>
                        {size}
                    </Text>
                </div>
            ))}
        </div>
    </Stack>
);

// Colour, which an icon is not given: it is painted in whatever the text around it is painted
// in, so it belongs to the sentence it stands in rather than standing apart from it
export const Colour: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Colour</Heading>
        <Text as="p" className={classes.prose}>
            An icon is filled with <Code>currentColor</Code>, so it takes the colour of whatever it
            is drawn inside and follows the scheme without being told about it. Naming a colour for
            an icon means naming one for the text it stands with.
        </Text>
        <div className={classes.row}>
            {roles.map((role) => (
                <div key={role} className={classes.cell}>
                    <div
                        className={classes.frame}
                        style={{ color: `var(--foreground-color-${role})` }}
                    >
                        <AlertRegular size={24} />
                    </div>
                    <Text size="small" className={classes.muted}>
                        {role}
                    </Text>
                </div>
            ))}
        </div>
    </Stack>
);

// Accessibility, which is settled by whether the icon is saying anything the text around it is
// not. Most are not, and the default is the quiet one for that reason
export const Accessibility: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Accessibility</Heading>
        <Text as="p" className={classes.prose}>
            An icon given no label is hidden from a screen reader, because most icons repeat what
            the text beside them already says and a reader hearing both is told the same thing
            twice. An icon standing on its own, with no text to repeat, is given an{" "}
            <Code>aria-label</Code> — and is then announced as an image rather than passed over.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{decorative}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <div className={classes.row}>
            <div className={classes.cell}>
                <div className={classes.frame}>
                    <SaveRegular size={24} />
                </div>
                <Text size="small" className={classes.muted}>
                    hidden
                </Text>
            </div>
            <div className={classes.cell}>
                <div className={classes.frame}>
                    <DeleteRegular size={24} aria-label="Delete" />
                </div>
                <Text size="small" className={classes.muted}>
                    labelled
                </Text>
            </div>
        </div>
    </Stack>
);

// The Gallery, which is what this page is actually for: an icon is chosen by being seen, and
// the name it is imported under is the thing a reader has come here to leave with
export const Gallery: StoryFn = () => {
    const [query, setQuery] = React.useState("");
    // The field answers a keystroke straight away and the grid catches up behind it, since
    // matching two thousand names and redrawing what is left is more than a keystroke should
    // be made to wait on
    const deferred = React.useDeferredValue(query);

    const matches = React.useMemo(() => {
        const term = deferred.trim().toLowerCase();

        if (!term) {
            return catalogue;
        }

        return catalogue.filter(([name]) => name.toLowerCase().includes(term));
    }, [deferred]);

    return (
        <Stack gap="normal">
            <Heading size="medium">Gallery</Heading>
            <Stack gap="condensed" align="start" className={classes.filter}>
                <Text as="label" htmlFor="icon-filter">
                    Filter
                </Text>
                <TextInput
                    block
                    id="icon-filter"
                    value={query}
                    placeholder="chevron"
                    leadingVisual={SearchRegular}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </Stack>
            <Text size="small" className={classes.muted}>
                {matches.length} of {catalogue.length}
            </Text>
            <div className={classes.gallery}>
                {matches.map(([name, IconComponent]) => (
                    <div key={name} className={classes.tile}>
                        <IconComponent size={24} />
                        <Text size="small" className={classes.muted}>
                            {name}
                        </Text>
                    </div>
                ))}
            </div>
        </Stack>
    );
};
