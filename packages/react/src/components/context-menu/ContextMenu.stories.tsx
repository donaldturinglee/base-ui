import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    ArchiveRegular,
    CopyRegular,
    DeleteRegular,
    RenameRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionList } from "../action-list";
import { Text } from "../text";
import { ContextMenu } from ".";

const classes = {
    // Somewhere to press. A trigger draws nothing of its own, so the story gives it an area
    // wide enough to aim at and says what to do with it
    surface:
        "grid h-[var(--base-size-128)] w-[var(--overlay-width-small)] place-items-center rounded-[var(--border-radius-large)] border border-dashed border-[var(--border-color-default)] text-center",
};

export default {
    title: "Components/ContextMenu",
    component: ContextMenu,
} as Meta<typeof ContextMenu>;

export const Default: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu>
        <ContextMenu.Trigger className={classes.surface}>
            <Text>Right click, or press and hold</Text>
        </ContextMenu.Trigger>
        <ContextMenu.Overlay>
            <ActionList>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <CopyRegular />
                    </ActionList.LeadingVisual>
                    Copy link
                </ActionList.Item>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <RenameRegular />
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
        </ContextMenu.Overlay>
    </ContextMenu>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<typeof ContextMenu> = (args) => (
    <ContextMenu {...args}>
        <ContextMenu.Trigger className={classes.surface}>
            <Text>Right click, or press and hold</Text>
        </ContextMenu.Trigger>
        <ContextMenu.Overlay>
            <ActionList>
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Rename</ActionList.Item>
                <ActionList.Item>Archive</ActionList.Item>
            </ActionList>
        </ContextMenu.Overlay>
    </ContextMenu>
);

Playground.args = {
    disabled: false,
};

Playground.argTypes = {
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Leaves the press alone, so the browser answers it with its own menu",
    },
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
};

Playground.parameters = {
    layout: "centered",
};
