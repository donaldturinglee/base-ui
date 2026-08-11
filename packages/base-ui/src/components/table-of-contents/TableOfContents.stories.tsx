import type { StoryFn, Meta } from "@storybook/react-vite";
import { TableOfContents } from ".";
import type { TableOfContentsProps } from "./TableOfContents.types";

const classes = {
    // Gives the list the narrow column it is read in beside a page of content
    container: "w-[16rem]",
};

const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "installation", label: "Installation" },
    { id: "usage", label: "Usage" },
    { id: "accessibility", label: "Accessibility" },
];

export default {
    title: "Components/TableOfContents",
    component: TableOfContents,
} as Meta<typeof TableOfContents>;

export const Default: StoryFn<typeof TableOfContents> = () => (
    <div className={classes.container}>
        <TableOfContents>
            <TableOfContents.Title>On this page</TableOfContents.Title>
            <TableOfContents.List>
                {sections.map((section, index) => (
                    <TableOfContents.Item
                        key={section.id}
                        href={`#${section.id}`}
                        active={index === 0}
                    >
                        {section.label}
                    </TableOfContents.Item>
                ))}
            </TableOfContents.List>
        </TableOfContents>
    </div>
);

export const Playground: StoryFn<TableOfContentsProps> = (args) => (
    <div className={classes.container}>
        <TableOfContents {...args}>
            <TableOfContents.Title>On this page</TableOfContents.Title>
            <TableOfContents.List>
                {sections.map((section, index) => (
                    <TableOfContents.Item
                        key={section.id}
                        href={`#${section.id}`}
                        active={index === 0}
                    >
                        {section.label}
                    </TableOfContents.Item>
                ))}
            </TableOfContents.List>
        </TableOfContents>
    </div>
);

Playground.args = {
    "aria-label": "Table of contents",
};

Playground.argTypes = {
    "aria-label": {
        control: {
            type: "text",
        },
        description: "Names the landmark the list stands as",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
