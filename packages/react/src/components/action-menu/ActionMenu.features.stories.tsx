import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import {
    ArrowSortRegular,
    CopyRegular,
    EditRegular,
    FilterRegular,
    MoreHorizontalRegular,
    ShareRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionList } from "../action-list";
import { IconButton } from "../icon-button";
import { ActionMenu } from ".";

export default {
    title: "Components/ActionMenu/Features",
    parameters: {
        layout: "centered",
    },
};

// A Custom Anchor, where the menu opens from something other than a menu button
export const CustomAnchor: StoryFn<typeof ActionMenu> = () => (
    <ActionMenu>
        <ActionMenu.Anchor>
            <IconButton
                icon={MoreHorizontalRegular}
                aria-label="More actions"
                variant="invisible"
            />
        </ActionMenu.Anchor>
        <ActionMenu.Overlay>
            <ActionList>
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Rename</ActionList.Item>
            </ActionList>
        </ActionMenu.Overlay>
    </ActionMenu>
);

// Single Selection, where the menu says which of its items is the one in force
export const SingleSelection: StoryFn<typeof ActionMenu> = () => {
    const options = ["Newest", "Oldest", "Most commented"];
    const [selected, setSelected] = React.useState(options[0]);

    return (
        <ActionMenu>
            <ActionMenu.Button leadingVisual={ArrowSortRegular}>Sort: {selected}</ActionMenu.Button>
            <ActionMenu.Overlay>
                <ActionList selectionVariant="single">
                    {options.map((option) => (
                        <ActionList.Item
                            key={option}
                            selected={option === selected}
                            onSelect={() => setSelected(option)}
                        >
                            {option}
                        </ActionList.Item>
                    ))}
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>
    );
};

// Multiple Selection, where each item is picked and put back on its own
export const MultipleSelection: StoryFn<typeof ActionMenu> = () => {
    const options = ["Issues", "Pull requests", "Discussions"];
    const [selected, setSelected] = React.useState<string[]>(["Issues"]);

    const toggle = (option: string) =>
        setSelected((current) =>
            current.includes(option)
                ? current.filter((one) => one !== option)
                : [...current, option],
        );

    return (
        <ActionMenu>
            <ActionMenu.Button leadingVisual={FilterRegular}>Filter</ActionMenu.Button>
            <ActionMenu.Overlay>
                <ActionList selectionVariant="multiple">
                    {options.map((option) => (
                        <ActionList.Item
                            key={option}
                            selected={selected.includes(option)}
                            onSelect={(event) => {
                                // The menu is left standing, since more than one item can be
                                // picked from it
                                event.preventDefault();
                                toggle(option);
                            }}
                        >
                            {option}
                        </ActionList.Item>
                    ))}
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>
    );
};

// Groups, which collect related items under a heading of their own
export const Groups: StoryFn<typeof ActionMenu> = () => (
    <ActionMenu>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Overlay>
            <ActionList>
                <ActionList.Group>
                    <ActionList.GroupHeading>This file</ActionList.GroupHeading>
                    <ActionList.Item>Copy link</ActionList.Item>
                    <ActionList.Item>Rename</ActionList.Item>
                </ActionList.Group>
                <ActionList.Divider />
                <ActionList.Group>
                    <ActionList.GroupHeading>Everything in it</ActionList.GroupHeading>
                    <ActionList.Item>Archive</ActionList.Item>
                </ActionList.Group>
            </ActionList>
        </ActionMenu.Overlay>
    </ActionMenu>
);

// A Menu Within A Menu, which is opened from an item of the one around it
export const Submenus: StoryFn<typeof ActionMenu> = () => (
    <ActionMenu>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Overlay>
            <ActionList>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <EditRegular />
                    </ActionList.LeadingVisual>
                    Rename
                </ActionList.Item>
                <ActionMenu>
                    <ActionMenu.Anchor>
                        <ActionList.Item>
                            <ActionList.LeadingVisual>
                                <ShareRegular />
                            </ActionList.LeadingVisual>
                            Share
                        </ActionList.Item>
                    </ActionMenu.Anchor>
                    <ActionMenu.Overlay>
                        <ActionList>
                            <ActionList.Item>
                                <ActionList.LeadingVisual>
                                    <CopyRegular />
                                </ActionList.LeadingVisual>
                                Copy link
                            </ActionList.Item>
                            <ActionList.Item>Email a link</ActionList.Item>
                        </ActionList>
                    </ActionMenu.Overlay>
                </ActionMenu>
            </ActionList>
        </ActionMenu.Overlay>
    </ActionMenu>
);

// A Menu The Caller Holds The State Of, so that something else can open and close it
export const Controlled: StoryFn<typeof ActionMenu> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <ActionMenu open={open} onOpenChange={setOpen}>
            <ActionMenu.Button>{open ? "Close" : "Open"} the menu</ActionMenu.Button>
            <ActionMenu.Overlay>
                <ActionList>
                    <ActionList.Item>Copy link</ActionList.Item>
                    <ActionList.Item>Rename</ActionList.Item>
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>
    );
};

// Where The Menu Stands, which is below its button unless there is no room for it there
export const MenuSide: StoryFn<typeof ActionMenu> = () => (
    <ActionMenu>
        <ActionMenu.Button>Actions</ActionMenu.Button>
        <ActionMenu.Overlay side="outside-right" align="start">
            <ActionList>
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Rename</ActionList.Item>
            </ActionList>
        </ActionMenu.Overlay>
    </ActionMenu>
);
