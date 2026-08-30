import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { NativeSelect } from "../native-select";
import { SkeletonText } from "../skeleton-text";
import { Stack } from "../stack";
import { TreeView } from "../tree-view";
import { TableOfContents, scrollToHeading, useTableOfContents, useTableOfContentsContext } from ".";

// The document is given a window of its own rather than being left to the page, so that the
// contents can be watched following a reader without the story having to be a page long
const documentWindow: React.CSSProperties = {
    height: "22rem",
    overflowY: "auto",
    paddingInlineEnd: "var(--base-size-16)",
    overscrollBehavior: "contain",
};

// A heading of the made-up document these stories are read against: what the contents are drawn
// from, what the heading is called, and how much stands under it before the next one
type Section = {
    value: string;
    depth: number;
    label: string;
    lines: number;
};

// A panel that scrolls has to be reachable by the keyboard, and the made-up document holds
// nothing to tab to that would reach it on its own
const documentPanel = { style: documentWindow, tabIndex: 0, "aria-label": "Documentation" };

// The document itself. Nothing here is the component's: the headings carry the ids the lines
// point at, which is all the contents ask of a page they are drawn from
const documentOf = (items: Section[]) => (
    <Stack gap="spacious">
        {items.map((section) => {
            const Heading = section.depth >= 3 ? "h3" : "h2";

            return (
                <Stack as="section" key={section.value} gap="condensed">
                    <Heading id={section.value}>{section.label}</Heading>
                    <SkeletonText lines={section.lines} />
                </Stack>
            );
        })}
    </Stack>
);

const linesOf = (items: Section[]) =>
    items.map((section) => (
        <TableOfContents.Item key={section.value} item={section}>
            <TableOfContents.Link href={`#${section.value}`}>{section.label}</TableOfContents.Link>
        </TableOfContents.Item>
    ));

const navOf = (items: Section[], placement?: "start" | "end") => (
    <TableOfContents.Nav placement={placement}>
        <TableOfContents.Title>On this page</TableOfContents.Title>
        <TableOfContents.List>
            <TableOfContents.Indicator />
            {linesOf(items)}
        </TableOfContents.List>
    </TableOfContents.Nav>
);

export default {
    title: "Components/TableOfContents/Features",
};

// Headings At More Than One Level, which is the shape most documents are. A heading standing
// under another is stepped in from it, so a glance down the list says which belong to which
const nestedSections: Section[] = [
    { value: "nested-importance", depth: 2, label: "Importance", lines: 6 },
    { value: "nested-integrations", depth: 2, label: "Integrations", lines: 7 },
    { value: "nested-free-blocks", depth: 3, label: "Free blocks", lines: 5 },
    { value: "nested-configuration", depth: 3, label: "Configuration", lines: 8 },
    { value: "nested-api-reference", depth: 2, label: "API reference", lines: 6 },
    { value: "nested-hooks", depth: 3, label: "Hooks", lines: 5 },
    { value: "nested-components", depth: 3, label: "Components", lines: 7 },
    { value: "nested-examples", depth: 2, label: "Examples", lines: 6 },
];

export const Nested: StoryFn<typeof TableOfContents> = () => (
    <TableOfContents items={nestedSections}>
        <TableOfContents.Content {...documentPanel}>
            {documentOf(nestedSections)}
        </TableOfContents.Content>
        {navOf(nestedSections)}
    </TableOfContents>
);

// The Contents On The Other Hand. Which side the nav stands on is said rather than left to the
// order the parts were written in, so the same markup serves a page laid out either way
const placementSections: Section[] = [
    { value: "placement-overview", depth: 2, label: "Overview", lines: 6 },
    { value: "placement-installation", depth: 2, label: "Installation", lines: 5 },
    { value: "placement-usage", depth: 2, label: "Usage", lines: 9 },
    { value: "placement-api-reference", depth: 2, label: "API reference", lines: 7 },
];

export const Placement: StoryFn<typeof TableOfContents> = () => (
    <TableOfContents items={placementSections}>
        <TableOfContents.Content {...documentPanel}>
            {documentOf(placementSections)}
        </TableOfContents.Content>
        {navOf(placementSections, "start")}
    </TableOfContents>
);

// Where The Reader Is, Held By The Caller. The contents stop working it out for themselves and
// say whatever they are told, which is what lets a control of the caller's own — a select on a
// narrow window, a step through a tour — stand in for following the page
const controlledSections: Section[] = [
    { value: "controlled-introduction", depth: 2, label: "Introduction", lines: 8 },
    { value: "controlled-getting-started", depth: 2, label: "Getting started", lines: 6 },
    { value: "controlled-installation", depth: 2, label: "Installation", lines: 5 },
    { value: "controlled-usage", depth: 2, label: "Usage", lines: 9 },
];

export const Controlled: StoryFn<typeof TableOfContents> = () => {
    const [activeIds, setActiveIds] = React.useState([controlledSections[0].value]);

    // The select stands outside the contents rather than among their parts, so it is handed the
    // panel the document is scrolled in instead of reading it from them
    const [panel, setPanel] = React.useState<HTMLElement | null>(null);

    // Picking a heading moves the page as well as saying where the reader is. Saying it alone
    // would leave the list pointing at a section the reader had not been taken to, and the first
    // turn of the wheel would put it back
    const goTo = (value: string) => {
        setActiveIds([value]);
        scrollToHeading(value, { scrollElement: panel, behavior: "smooth" });
    };

    return (
        <Stack gap="condensed">
            <NativeSelect
                aria-label="Section"
                value={activeIds[0]}
                onChange={(event) => goTo(event.target.value)}
            >
                {controlledSections.map((section) => (
                    <NativeSelect.Option key={section.value} value={section.value}>
                        {section.label}
                    </NativeSelect.Option>
                ))}
            </NativeSelect>

            <TableOfContents
                items={controlledSections}
                activeIds={activeIds}
                // A short section leaves room for the next heading to stand within the band
                // alongside its own, and the contents report both. A caller holding where the
                // reader is decides what to make of that, and a select names one section: the
                // first of a run is the one it keeps, since that is the heading the reader is
                // under and the rest are only the ones coming up behind it
                onActiveChange={(details) => setActiveIds(details.activeIds.slice(0, 1))}
            >
                <TableOfContents.Content
                    ref={(element: HTMLElement | null) => setPanel(element)}
                    {...documentPanel}
                >
                    {documentOf(controlledSections)}
                </TableOfContents.Content>
                {navOf(controlledSections)}
            </TableOfContents>
        </Stack>
    );
};

// A Nav Of The Caller's Own, drawn from the hook rather than from the parts. The document is
// followed the same way either way, so a shape laid out by hand is no less a table of contents
// than one built out of the parts
const hookSections: Section[] = [
    { value: "hook-introduction", depth: 2, label: "Introduction", lines: 8 },
    { value: "hook-getting-started", depth: 2, label: "Getting started", lines: 6 },
    { value: "hook-installation", depth: 2, label: "Installation", lines: 5 },
    { value: "hook-usage", depth: 2, label: "Usage", lines: 9 },
];

export const WithHook: StoryFn<typeof TableOfContents> = () => {
    // The article hands back what it came out as, so that the headings are watched within it
    // rather than within the window it happens to be standing in
    const [article, setArticle] = React.useState<HTMLElement | null>(null);

    const contents = useTableOfContents({ items: hookSections, scrollElement: article });

    return (
        <Stack direction="horizontal" gap="spacious" align="start">
            <article
                ref={(element) => setArticle(element)}
                tabIndex={0}
                aria-label="Documentation"
                style={{ ...documentWindow, flex: 1, minWidth: 0 }}
            >
                {documentOf(hookSections)}
            </article>

            <Stack
                as="nav"
                aria-label="On this page"
                gap="tight"
                style={{ width: "12rem", flex: "none" }}
            >
                {hookSections.map((section) => {
                    const isActive = contents.getItemState(section).active;

                    return (
                        <a
                            key={section.value}
                            href={`#${section.value}`}
                            aria-current={isActive ? "location" : undefined}
                            style={{
                                color: isActive
                                    ? "var(--foreground-color-accent)"
                                    : "var(--foreground-color-muted)",
                                fontSize: "var(--text-body-size-small)",
                                textDecoration: "none",
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                contents.scrollTo(section.value);
                            }}
                        >
                            {section.label}
                        </a>
                    );
                })}
            </Stack>
        </Stack>
    );
};

// The Contents Read As A Tree, for a document whose sections hold sections of their own. The
// rows nest the way the headings do rather than being stepped in by hand, and the branch the
// reader is in opens as they arrive at it
type Branch = Section & { children: Section[] };

const treeSections: Branch[] = [
    {
        value: "tree-guides",
        depth: 2,
        label: "Guides",
        lines: 6,
        children: [
            { value: "tree-quick-start", depth: 3, label: "Quick start", lines: 4 },
            { value: "tree-manual-setup", depth: 3, label: "Manual setup", lines: 5 },
        ],
    },
    {
        value: "tree-concepts",
        depth: 2,
        label: "Concepts",
        lines: 5,
        children: [
            { value: "tree-props", depth: 3, label: "Props", lines: 5 },
            { value: "tree-events", depth: 3, label: "Events", lines: 4 },
            { value: "tree-context", depth: 3, label: "Context", lines: 6 },
        ],
    },
    {
        value: "tree-advanced",
        depth: 2,
        label: "Advanced",
        lines: 7,
        children: [
            { value: "tree-providers", depth: 3, label: "Providers", lines: 5 },
            { value: "tree-rendering", depth: 3, label: "Rendering", lines: 4 },
        ],
    },
];

// Read down the page rather than down the tree: a branch is followed by what stands under it,
// which is the order the document is written in and the order the headings are met in
const treeReadingOrder: Section[] = treeSections.flatMap((section) => [
    section,
    ...section.children,
]);

// Which branch a heading belongs to, so that arriving at one opens it
const branchHolding = (value: string | undefined) =>
    treeSections.find(
        (section) =>
            section.value === value || section.children.some((child) => child.value === value),
    )?.value;

type SectionTreeProps = {
    expanded: string[];
    onExpandedChange: (expanded: string[]) => void;
};

// The tree stands among the parts, so it reads where the reader is and the way to a heading from
// the contents around it rather than being handed either again.
//
// A row goes to its heading when it is picked rather than carrying a link of its own: a tree
// answers the pointer and the keyboard itself, and a link standing inside a row would be a
// second thing to reach in a place that holds one
const SectionTree = ({ expanded, onExpandedChange }: SectionTreeProps) => {
    const { ids, activeIds, scrollTo } = useTableOfContentsContext();

    // More than one heading can stand within the band at once, and a tree marks one row as the
    // one the reader is on, so the first of a run is the one it takes
    const reached = activeIds?.[0];

    const toggle = (value: string, isOpen: boolean) =>
        onExpandedChange(isOpen ? [...expanded, value] : expanded.filter((one) => one !== value));

    return (
        // Named by the title the nav is named by, rather than by a second copy of the same words
        <TreeView aria-labelledby={ids?.title}>
            {treeSections.map((section) => (
                <TreeView.Item
                    key={section.value}
                    id={section.value}
                    current={section.value === reached}
                    expanded={expanded.includes(section.value)}
                    onExpandedChange={(isOpen) => toggle(section.value, isOpen)}
                    onSelect={() => scrollTo?.(section.value)}
                >
                    {section.label}
                    <TreeView.SubTree>
                        {section.children.map((child) => (
                            <TreeView.Item
                                key={child.value}
                                id={child.value}
                                current={child.value === reached}
                                onSelect={() => scrollTo?.(child.value)}
                            >
                                {child.label}
                            </TreeView.Item>
                        ))}
                    </TreeView.SubTree>
                </TreeView.Item>
            ))}
        </TreeView>
    );
};

export const WithTreeView: StoryFn<typeof TableOfContents> = () => {
    const [expanded, setExpanded] = React.useState([treeSections[0].value]);

    return (
        <TableOfContents
            items={treeReadingOrder}
            // The tree follows the reader down the page: the branch they arrive in opens, and
            // the one they have left closes behind them, so the shape of the tree says where
            // they are as much as the row drawn as current does
            onActiveChange={(details) => {
                const branch = branchHolding(details.activeIds[0]);

                setExpanded(branch ? [branch] : []);
            }}
        >
            <TableOfContents.Content {...documentPanel}>
                {documentOf(treeReadingOrder)}
            </TableOfContents.Content>

            <TableOfContents.Nav>
                <TableOfContents.Title>On this page</TableOfContents.Title>
                <SectionTree expanded={expanded} onExpandedChange={setExpanded} />
            </TableOfContents.Nav>
        </TableOfContents>
    );
};
