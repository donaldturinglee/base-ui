import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { Heading } from "../heading";
import { Text } from "../text";
import { TableOfContents, useTableOfContentsActiveId } from ".";

const classes = {
    // Gives the list the narrow column it is read in beside a page of content
    container: "w-[16rem]",
    // A page and the list leading through it, standing side by side as they would on a site
    page: "flex gap-8",
    // What the page is read within, so the sections can be scrolled past without the story
    // taking the whole window with them
    scroller: "h-[20rem] w-[28rem] overflow-y-auto",
    section: "flex flex-col gap-2 py-8",
};

const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "installation", label: "Installation" },
    { id: "usage", label: "Usage" },
    { id: "accessibility", label: "Accessibility" },
];

const body =
    "The section runs on for a while, so that there is something to scroll past on the way to " +
    "the next one and the list beside it has something to follow.";

export default {
    title: "Components/TableOfContents/Features",
};

// With Groups, where a run of sections stands under one that names them
export const WithGroups: StoryFn<typeof TableOfContents> = () => (
    <div className={classes.container}>
        <TableOfContents>
            <TableOfContents.Title>On this page</TableOfContents.Title>
            <TableOfContents.List>
                <TableOfContents.Item href="#introduction" active>
                    Introduction
                </TableOfContents.Item>
                <TableOfContents.Group label="Getting started">
                    <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
                    <TableOfContents.Item href="#setup">Setup</TableOfContents.Item>
                </TableOfContents.Group>
                <TableOfContents.Group label="Reference">
                    <TableOfContents.Item href="#props">Props</TableOfContents.Item>
                    <TableOfContents.Item href="#hooks">Hooks</TableOfContents.Item>
                </TableOfContents.Group>
            </TableOfContents.List>
        </TableOfContents>
    </div>
);

// With A Linked Group, where the label stands for a section of its own
export const WithALinkedGroup: StoryFn<typeof TableOfContents> = () => (
    <div className={classes.container}>
        <TableOfContents>
            <TableOfContents.Title>On this page</TableOfContents.Title>
            <TableOfContents.List>
                <TableOfContents.Item href="#introduction">Introduction</TableOfContents.Item>
                <TableOfContents.Group label="Getting started" href="#getting-started" active>
                    <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
                    <TableOfContents.Item href="#setup">Setup</TableOfContents.Item>
                </TableOfContents.Group>
            </TableOfContents.List>
        </TableOfContents>
    </div>
);

// With A Long Heading, which is cut off rather than wrapped
export const WithALongHeading: StoryFn<typeof TableOfContents> = () => (
    <div className={classes.container}>
        <TableOfContents>
            <TableOfContents.Title>On this page</TableOfContents.Title>
            <TableOfContents.List>
                <TableOfContents.Item href="#introduction">Introduction</TableOfContents.Item>
                <TableOfContents.Item href="#configuration">
                    Configuring the build for a package published to more than one registry
                </TableOfContents.Item>
                <TableOfContents.Item href="#usage">Usage</TableOfContents.Item>
            </TableOfContents.List>
        </TableOfContents>
    </div>
);

// Named By Its Title, where the title is put into the outline of the page as a heading and the
// landmark is named after it
export const NamedByItsTitle: StoryFn<typeof TableOfContents> = () => (
    <div className={classes.container}>
        <TableOfContents aria-labelledby="table-of-contents-title">
            <TableOfContents.Title as="h2" id="table-of-contents-title">
                On this page
            </TableOfContents.Title>
            <TableOfContents.List>
                {sections.map((section) => (
                    <TableOfContents.Item key={section.id} href={`#${section.id}`}>
                        {section.label}
                    </TableOfContents.Item>
                ))}
            </TableOfContents.List>
        </TableOfContents>
    </div>
);

// Following The Scroll, where the section being read is worked out from where the page stands
export const FollowingTheScroll: StoryFn<typeof TableOfContents> = () => {
    const [scroller, setScroller] = React.useState<HTMLDivElement | null>(null);

    const { activeId, selectSection } = useTableOfContentsActiveId({
        ids: sections.map((section) => section.id),
        root: scroller,
        // The address of a story is the story's own, so there is no section named in it to take
        trackHash: false,
    });

    return (
        <div className={classes.page}>
            <div ref={setScroller} className={classes.scroller}>
                {sections.map((section) => (
                    <section key={section.id} id={section.id} className={classes.section}>
                        <Heading as="h2" size="small">
                            {section.label}
                        </Heading>
                        <Text as="p" size="small">
                            {body}
                        </Text>
                    </section>
                ))}
            </div>

            <div className={classes.container}>
                <TableOfContents>
                    <TableOfContents.Title>On this page</TableOfContents.Title>
                    <TableOfContents.List>
                        {sections.map((section) => (
                            <TableOfContents.Item
                                key={section.id}
                                href={`#${section.id}`}
                                active={activeId === section.id}
                                onClick={(event: React.MouseEvent) => {
                                    // The story is read within a scroller of its own, so the
                                    // section is brought into it rather than into the window
                                    event.preventDefault();
                                    selectSection(section.id);
                                    document
                                        .getElementById(section.id)
                                        ?.scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                {section.label}
                            </TableOfContents.Item>
                        ))}
                    </TableOfContents.List>
                </TableOfContents>
            </div>
        </div>
    );
};
