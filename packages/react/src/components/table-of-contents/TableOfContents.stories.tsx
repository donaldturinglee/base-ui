import type * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { SkeletonText } from "../skeleton-text";
import { Stack } from "../stack";
import { TableOfContents } from ".";
import type { TableOfContentsProps } from "./TableOfContents.types";

// The document is given a window of its own rather than being left to the page, so that the
// contents can be watched following a reader without the story having to be a page long
const documentWindow: React.CSSProperties = {
    height: "22rem",
    overflowY: "auto",
    paddingInlineEnd: "var(--base-size-16)",
    overscrollBehavior: "contain",
};

// A heading of the made-up document a story is read against: what the contents are drawn from,
// what the heading is called, and how much stands under it before the next one
type Section = {
    value: string;
    depth: number;
    label: string;
    lines: number;
};

const sections: Section[] = [
    { value: "default-introduction", depth: 2, label: "Introduction", lines: 8 },
    { value: "default-getting-started", depth: 2, label: "Getting started", lines: 6 },
    { value: "default-installation", depth: 2, label: "Installation", lines: 5 },
    { value: "default-usage", depth: 2, label: "Usage", lines: 9 },
    { value: "default-conclusion", depth: 2, label: "Conclusion", lines: 6 },
];

// The document itself. Nothing here is the component's: the headings carry the ids the lines
// point at, which is all the contents ask of a page they are drawn from
const Document = ({ items }: { items: Section[] }) => (
    // A panel that scrolls has to be reachable by the keyboard, and the made-up document holds
    // nothing to tab to that would reach it on its own
    <TableOfContents.Content style={documentWindow} tabIndex={0} aria-label="Documentation">
        <Stack gap="spacious">
            {items.map((section) => (
                <Stack as="section" key={section.value} gap="condensed">
                    <h2 id={section.value}>{section.label}</h2>
                    <SkeletonText lines={section.lines} />
                </Stack>
            ))}
        </Stack>
    </TableOfContents.Content>
);

const Nav = ({ items }: { items: Section[] }) => (
    <TableOfContents.Nav>
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <TableOfContents.List>
            <TableOfContents.Indicator />
            {items.map((section) => (
                <TableOfContents.Item key={section.value} item={section}>
                    <TableOfContents.Link href={`#${section.value}`}>
                        {section.label}
                    </TableOfContents.Link>
                </TableOfContents.Item>
            ))}
        </TableOfContents.List>
    </TableOfContents.Nav>
);

export default {
    title: "Components/TableOfContents",
    component: TableOfContents,
} as Meta<typeof TableOfContents>;

export const Default: StoryFn<typeof TableOfContents> = () => (
    <TableOfContents items={sections}>
        <Document items={sections} />
        <Nav items={sections} />
    </TableOfContents>
);

// Every story on the page draws a document of its own, and a heading is found by an id that has
// to be the one heading carrying it, so each story keeps its own headings apart from the rest
const playgroundSections = sections.map((section) => ({
    ...section,
    value: section.value.replace("default-", "playground-"),
}));

export const Playground: StoryFn<TableOfContentsProps> = (args) => (
    <TableOfContents {...args} items={playgroundSections}>
        <Document items={playgroundSections} />
        <Nav items={playgroundSections} />
    </TableOfContents>
);

Playground.args = {
    rootMargin: "-20px 0% -40% 0%",
    threshold: 0,
    autoScroll: true,
    scrollBehavior: "smooth",
};

Playground.argTypes = {
    rootMargin: {
        control: {
            type: "text",
        },
        description:
            "How much of the scrolled area counts as being read, written the way a margin " +
            "for an IntersectionObserver is",
    },
    threshold: {
        control: {
            type: "number",
            min: 0,
            max: 1,
            step: 0.1,
        },
        description: "How much of a heading has to be within that band before it counts",
    },
    autoScroll: {
        control: {
            type: "boolean",
        },
        description: "Keeps the line the reader is under in view as the document moves",
    },
    scrollBehavior: {
        control: {
            type: "inline-radio",
        },
        options: ["smooth", "auto", "instant"],
        description: "How the page moves when a line is followed",
    },
    defaultActiveIds: {
        control: {
            type: "object",
        },
        description: "The headings held as being on screen before the document has been watched",
    },
    items: {
        table: {
            disable: true,
        },
    },
    activeIds: {
        table: {
            disable: true,
        },
    },
    scrollElement: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};
