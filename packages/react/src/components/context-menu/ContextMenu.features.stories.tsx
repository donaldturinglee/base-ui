import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import {
    ClipboardPasteRegular,
    CopyRegular,
    CutRegular,
    RenameRegular,
    ShareRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionList } from "../action-list";
import { ActionMenu } from "../action-menu";
import { Button } from "../button";
import { KeybindingHint } from "../keybinding-hint";
import { Text } from "../text";
import { ContextMenu } from ".";
import type { AnchorSide } from "../tooltip/anchoredPosition";

const classes = {
    // Somewhere to press. A trigger draws nothing of its own, so the stories give it an area
    // wide enough to aim at and say what to do with it
    surface:
        "grid h-[var(--base-size-128)] w-[var(--overlay-width-small)] place-items-center rounded-[var(--border-radius-large)] border border-dashed border-[var(--border-color-default)] text-center",
    // A smaller area than the rest, so that four of them stand side by side
    smallSurface:
        "grid h-[var(--base-size-96)] w-[var(--base-size-128)] place-items-center rounded-[var(--border-radius-large)] border border-dashed border-[var(--border-color-default)] text-center",
    // Stands the areas far enough apart that the menus do not open on top of one another
    row: "flex flex-wrap items-center gap-[var(--base-size-32)]",
    stack: "flex flex-col items-start gap-[var(--base-size-8)]",
};

const sides: AnchorSide[] = ["outside-top", "outside-right", "outside-bottom", "outside-left"];

export default {
    title: "Components/ContextMenu/Features",
    parameters: {
        layout: "centered",
    },
};

// Shortcuts, which say how the same action is reached without the menu
export const Shortcuts: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu>
        <ContextMenu.Trigger className={classes.surface}>
            <Text>Right click, or press and hold</Text>
        </ContextMenu.Trigger>
        <ContextMenu.Overlay>
            <ActionList>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <CutRegular />
                    </ActionList.LeadingVisual>
                    Cut
                    <ActionList.TrailingVisual>
                        <KeybindingHint keys="Mod+x" />
                    </ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <CopyRegular />
                    </ActionList.LeadingVisual>
                    Copy
                    <ActionList.TrailingVisual>
                        <KeybindingHint keys="Mod+c" />
                    </ActionList.TrailingVisual>
                </ActionList.Item>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <ClipboardPasteRegular />
                    </ActionList.LeadingVisual>
                    Paste
                    <ActionList.TrailingVisual>
                        <KeybindingHint keys="Mod+v" />
                    </ActionList.TrailingVisual>
                </ActionList.Item>
            </ActionList>
        </ContextMenu.Overlay>
    </ContextMenu>
);

// Single Selection, where the menu says which of its items is the one in force
export const SingleSelection: StoryFn<typeof ContextMenu> = () => {
    const options = ["Newest", "Oldest", "Most commented"];
    const [selected, setSelected] = React.useState(options[0]);

    return (
        <ContextMenu>
            <ContextMenu.Trigger className={classes.surface}>
                <Text>Sorted by {selected.toLowerCase()}</Text>
            </ContextMenu.Trigger>
            <ContextMenu.Overlay aria-label="Sort">
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
            </ContextMenu.Overlay>
        </ContextMenu>
    );
};

// Multiple Selection, where each item is picked and put back on its own
export const MultipleSelection: StoryFn<typeof ContextMenu> = () => {
    const options = ["Issues", "Pull requests", "Discussions"];
    const [selected, setSelected] = React.useState<string[]>(["Issues"]);

    const toggle = (option: string) =>
        setSelected((current) =>
            current.includes(option)
                ? current.filter((one) => one !== option)
                : [...current, option],
        );

    return (
        <ContextMenu>
            <ContextMenu.Trigger className={classes.surface}>
                <Text>Showing {selected.length || "nothing"}</Text>
            </ContextMenu.Trigger>
            <ContextMenu.Overlay aria-label="Filter">
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
            </ContextMenu.Overlay>
        </ContextMenu>
    );
};

// Groups, which collect related items under a heading of their own
export const Groups: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu>
        <ContextMenu.Trigger className={classes.surface}>
            <Text>Right click, or press and hold</Text>
        </ContextMenu.Trigger>
        <ContextMenu.Overlay>
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
        </ContextMenu.Overlay>
    </ContextMenu>
);

// A Menu Within A Menu, which is opened from an item of the one around it and closes the
// whole stack once something has been picked from it
export const Submenus: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu>
        <ContextMenu.Trigger className={classes.surface}>
            <Text>Right click, or press and hold</Text>
        </ContextMenu.Trigger>
        <ContextMenu.Overlay>
            <ActionList>
                <ActionList.Item>
                    <ActionList.LeadingVisual>
                        <RenameRegular />
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
        </ContextMenu.Overlay>
    </ContextMenu>
);

// A Menu The Caller Holds The State Of, which stands wherever it was last pressed open
export const Controlled: StoryFn<typeof ContextMenu> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.stack}>
            <Button onClick={() => setOpen(true)}>Open the menu</Button>
            <ContextMenu open={open} onOpenChange={setOpen}>
                <ContextMenu.Trigger className={classes.surface}>
                    <Text>Right click, or press and hold</Text>
                </ContextMenu.Trigger>
                <ContextMenu.Overlay>
                    <ActionList>
                        <ActionList.Item>Copy link</ActionList.Item>
                        <ActionList.Item>Rename</ActionList.Item>
                    </ActionList>
                </ContextMenu.Overlay>
            </ContextMenu>
        </div>
    );
};

// A Menu That Has Been Turned Off, which leaves the press to the browser's own menu
export const Disabled: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu disabled>
        <ContextMenu.Trigger className={classes.surface}>
            <Text>Right click for the browser&apos;s menu</Text>
        </ContextMenu.Trigger>
        <ContextMenu.Overlay>
            <ActionList>
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Rename</ActionList.Item>
            </ActionList>
        </ContextMenu.Overlay>
    </ContextMenu>
);

// Which Side It Stands On, counted from the press rather than from the area it was made in. A
// press has no width for the menu to stand off, so the side is only the direction the menu
// runs in, and the corner it runs away from is the one left under the pointer: running down
// leaves the top corner there, running up leaves the bottom one. Down and right therefore come
// out in the same place. Where there is no room on the side it was asked for, the menu is
// turned over to the other one rather than being run off the edge of the page
export const Sides: StoryFn<typeof ContextMenu> = () => (
    <div className={classes.row}>
        {sides.map((side) => (
            <ContextMenu key={side}>
                <ContextMenu.Trigger className={classes.smallSurface}>
                    <Text>{side.replace("outside-", "")}</Text>
                </ContextMenu.Trigger>
                <ContextMenu.Overlay side={side}>
                    <ActionList>
                        <ActionList.Item>Copy link</ActionList.Item>
                        <ActionList.Item>Rename</ActionList.Item>
                    </ActionList>
                </ContextMenu.Overlay>
            </ContextMenu>
        ))}
    </div>
);
