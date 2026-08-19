import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    ArchiveRegular,
    CopyRegular,
    DeleteRegular,
    EditRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionList } from ".";
import type { ActionListProps } from "./ActionList.types";

const classes = {
    // Gives the list a width to sit in rather than the width of the page
    container: "w-[20rem]",
};

export default {
    title: "Components/ActionList",
    component: ActionList,
} as Meta<typeof ActionList>;

export const Default: StoryFn<typeof ActionList> = () => (
    <ActionList className={classes.container}>
        <ActionList.Item>
            <ActionList.LeadingVisual>
                <CopyRegular />
            </ActionList.LeadingVisual>
            Copy link
        </ActionList.Item>
        <ActionList.Item>
            <ActionList.LeadingVisual>
                <EditRegular />
            </ActionList.LeadingVisual>
            Rename
        </ActionList.Item>
        <ActionList.Item>
            <ActionList.LeadingVisual>
                <ArchiveRegular />
            </ActionList.LeadingVisual>
            Archive
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger">
            <ActionList.LeadingVisual>
                <DeleteRegular />
            </ActionList.LeadingVisual>
            Delete
        </ActionList.Item>
    </ActionList>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ActionListProps> = (args) => (
    <ActionList {...args} className={classes.container}>
        <ActionList.Item>
            <ActionList.LeadingVisual>
                <CopyRegular />
            </ActionList.LeadingVisual>
            Copy link
            <ActionList.Description>Anyone with the link can read it</ActionList.Description>
        </ActionList.Item>
        <ActionList.Item selected>
            <ActionList.LeadingVisual>
                <EditRegular />
            </ActionList.LeadingVisual>
            Rename
        </ActionList.Item>
        <ActionList.Item disabled>
            <ActionList.LeadingVisual>
                <ArchiveRegular />
            </ActionList.LeadingVisual>
            Archive
        </ActionList.Item>
    </ActionList>
);

Playground.args = {
    variant: "inset",
    selectionVariant: "single",
    showDividers: false,
};

Playground.argTypes = {
    variant: {
        control: {
            type: "radio",
        },
        options: ["inset", "full"],
        description: "How far the items are held in from the edges of the list",
    },
    selectionVariant: {
        control: {
            type: "radio",
        },
        options: ["single", "multiple"],
        description: "Whether one item or several can be picked",
    },
    showDividers: {
        control: {
            type: "boolean",
        },
        description: "Draws a line between one item and the next",
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
