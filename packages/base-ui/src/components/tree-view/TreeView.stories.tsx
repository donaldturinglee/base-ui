import type { StoryFn, Meta } from "@storybook/react-vite";
import { DocumentRegular } from "@gamecrafters/base-ui-icons";
import { TreeView } from ".";
import type { TreeViewProps } from "./TreeView.types";

const classes = {
    // Gives the tree a column to stand in rather than the width of the page
    container: "w-[20rem]",
};

export default {
    title: "Components/TreeView",
    component: TreeView,
} as Meta<typeof TreeView>;

export const Default: StoryFn<typeof TreeView> = () => (
    <TreeView aria-label="Files" className={classes.container}>
        <TreeView.Item id="src" defaultExpanded>
            <TreeView.LeadingVisual label="Folder">
                <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            src
            <TreeView.SubTree>
                <TreeView.Item id="src/components" defaultExpanded>
                    <TreeView.LeadingVisual label="Folder">
                        <TreeView.DirectoryIcon />
                    </TreeView.LeadingVisual>
                    components
                    <TreeView.SubTree>
                        <TreeView.Item id="src/components/button.tsx" current>
                            <TreeView.LeadingVisual label="File">
                                <DocumentRegular />
                            </TreeView.LeadingVisual>
                            Button.tsx
                        </TreeView.Item>
                        <TreeView.Item id="src/components/card.tsx">
                            <TreeView.LeadingVisual label="File">
                                <DocumentRegular />
                            </TreeView.LeadingVisual>
                            Card.tsx
                        </TreeView.Item>
                    </TreeView.SubTree>
                </TreeView.Item>
                <TreeView.Item id="src/main.ts">
                    <TreeView.LeadingVisual label="File">
                        <DocumentRegular />
                    </TreeView.LeadingVisual>
                    main.ts
                </TreeView.Item>
            </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="readme">
            <TreeView.LeadingVisual label="File">
                <DocumentRegular />
            </TreeView.LeadingVisual>
            README.md
        </TreeView.Item>
    </TreeView>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TreeViewProps> = (args) => (
    <TreeView {...args} aria-label="Files" className={classes.container}>
        <TreeView.Item id="src" defaultExpanded>
            <TreeView.LeadingVisual label="Folder">
                <TreeView.DirectoryIcon />
            </TreeView.LeadingVisual>
            src
            <TreeView.SubTree>
                <TreeView.Item id="src/main.ts" current>
                    <TreeView.LeadingVisual label="File">
                        <DocumentRegular />
                    </TreeView.LeadingVisual>
                    main.ts
                </TreeView.Item>
                <TreeView.Item id="src/a-very-long-file-name-that-will-not-fit.ts">
                    <TreeView.LeadingVisual label="File">
                        <DocumentRegular />
                    </TreeView.LeadingVisual>
                    a-very-long-file-name-that-will-not-fit.ts
                </TreeView.Item>
            </TreeView.SubTree>
        </TreeView.Item>
        <TreeView.Item id="readme">
            <TreeView.LeadingVisual label="File">
                <DocumentRegular />
            </TreeView.LeadingVisual>
            README.md
        </TreeView.Item>
    </TreeView>
);

Playground.args = {
    flat: false,
    truncate: true,
};

Playground.argTypes = {
    flat: {
        control: {
            type: "boolean",
        },
        description: "Draws every row against the same edge, whatever depth it stands at",
    },
    truncate: {
        control: {
            type: "boolean",
        },
        description: "Cuts a long name short rather than running it onto another line",
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
