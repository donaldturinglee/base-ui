import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    ArchiveRegular,
    CopyRegular,
    DeleteRegular,
    EditRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionList } from "../action-list";
import { ActionMenu } from ".";

export default {
    title: "Components/ActionMenu",
    component: ActionMenu,
} as Meta<typeof ActionMenu>;

export const Default: StoryFn<typeof ActionMenu> = () => (
    <ActionMenu>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Overlay>
            <ActionList>
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
        </ActionMenu.Overlay>
    </ActionMenu>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<typeof ActionMenu> = (args) => (
    <ActionMenu {...args}>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Overlay>
            <ActionList>
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Rename</ActionList.Item>
                <ActionList.Item>Archive</ActionList.Item>
            </ActionList>
        </ActionMenu.Overlay>
    </ActionMenu>
);

Playground.argTypes = {
    open: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
    anchorRef: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
