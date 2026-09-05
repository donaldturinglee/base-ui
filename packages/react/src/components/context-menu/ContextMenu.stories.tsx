import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    ClipboardPasteRegular,
    CopyRegular,
    CutRegular,
    DeleteRegular,
} from "@gamecrafters/base-ui-icons";
import { ContextMenu } from ".";
import type { ContextMenuProps } from "./ContextMenu.types";

const classes = {
    // Gives the menu an area to be opened from, drawn so that it reads as one
    area: "flex h-48 w-80 select-none items-center justify-center rounded-md border border-dashed border-border-default text-foreground-muted",
};

export default {
    title: "Components/ContextMenu",
    component: ContextMenu,
} as Meta<typeof ContextMenu>;

export const Default: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu>
        <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Positioner>
            <ContextMenu.Content>
                <ContextMenu.Item value="cut">
                    <CutRegular />
                    Cut
                </ContextMenu.Item>
                <ContextMenu.Item value="copy">
                    <CopyRegular />
                    Copy
                </ContextMenu.Item>
                <ContextMenu.Item value="paste">
                    <ClipboardPasteRegular />
                    Paste
                </ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item value="delete" variant="danger">
                    <DeleteRegular />
                    Delete
                </ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Positioner>
    </ContextMenu>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ContextMenuProps> = (args) => (
    <ContextMenu {...args}>
        <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Positioner>
            <ContextMenu.Content>
                <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
                <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item value="delete" variant="danger">
                    Delete
                </ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Positioner>
    </ContextMenu>
);

Playground.args = {
    closeOnSelect: true,
    loopFocus: false,
    typeahead: true,
    disabled: false,
};

Playground.argTypes = {
    closeOnSelect: {
        control: {
            type: "boolean",
        },
        description: "Whether picking an item closes the menu",
    },
    loopFocus: {
        control: {
            type: "boolean",
        },
        description: "Whether the arrow keys come round from the last item to the first",
    },
    typeahead: {
        control: {
            type: "boolean",
        },
        description: "Whether typing moves to the item that starts with what was typed",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Leaves the press to the browser, which shows a menu of its own",
    },
    open: {
        table: {
            disable: true,
        },
    },
    defaultOpen: {
        table: {
            disable: true,
        },
    },
    portalContainerName: {
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
