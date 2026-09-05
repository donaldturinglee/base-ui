import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { CheckmarkRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { ContextMenu } from ".";

const classes = {
    // Gives the menu an area to be opened from, drawn so that it reads as one
    area: "flex h-48 w-80 select-none items-center justify-center rounded-md border border-dashed border-border-default text-foreground-muted",
    // Stands whatever goes with the area below it
    stack: "flex flex-col items-start gap-4",
    // What the menu last said, read back beside the area it belongs to
    readout: "text-foreground-muted",
};

export default {
    title: "Components/ContextMenu/Features",
    parameters: {
        layout: "centered",
    },
};

// Groups, which collect related items under a label of their own
export const Groups: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu>
        <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Positioner>
            <ContextMenu.Content>
                <ContextMenu.ItemGroup>
                    <ContextMenu.ItemGroupLabel>Clipboard</ContextMenu.ItemGroupLabel>
                    <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                    <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
                    <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
                </ContextMenu.ItemGroup>
                <ContextMenu.ItemGroup>
                    <ContextMenu.ItemGroupLabel>Selection</ContextMenu.ItemGroupLabel>
                    <ContextMenu.Item value="select-all">Select all</ContextMenu.Item>
                    <ContextMenu.Item value="deselect">Deselect</ContextMenu.Item>
                </ContextMenu.ItemGroup>
            </ContextMenu.Content>
        </ContextMenu.Positioner>
    </ContextMenu>
);

// Checkbox Items, each of which is picked and put back on its own. The menu is left standing
// as they are, since more than one of them can be picked from it
export const CheckboxItems: StoryFn<typeof ContextMenu> = () => {
    const [showToolbar, setShowToolbar] = React.useState(true);
    const [showStatusBar, setShowStatusBar] = React.useState(false);

    return (
        <ContextMenu closeOnSelect={false}>
            <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
            <ContextMenu.Positioner>
                <ContextMenu.Content>
                    <ContextMenu.CheckboxItem
                        value="toolbar"
                        checked={showToolbar}
                        onCheckedChange={setShowToolbar}
                    >
                        <ContextMenu.ItemIndicator>
                            <CheckmarkRegular />
                        </ContextMenu.ItemIndicator>
                        <ContextMenu.ItemText>Show toolbar</ContextMenu.ItemText>
                    </ContextMenu.CheckboxItem>
                    <ContextMenu.CheckboxItem
                        value="status-bar"
                        checked={showStatusBar}
                        onCheckedChange={setShowStatusBar}
                    >
                        <ContextMenu.ItemIndicator>
                            <CheckmarkRegular />
                        </ContextMenu.ItemIndicator>
                        <ContextMenu.ItemText>Show status bar</ContextMenu.ItemText>
                    </ContextMenu.CheckboxItem>
                </ContextMenu.Content>
            </ContextMenu.Positioner>
        </ContextMenu>
    );
};

// Radio Items, of which one at a time is picked
export const RadioItems: StoryFn<typeof ContextMenu> = () => {
    const options = [
        { value: "name", label: "Name" },
        { value: "date", label: "Date modified" },
        { value: "size", label: "Size" },
        { value: "type", label: "Type" },
    ];
    const [sortBy, setSortBy] = React.useState("date");

    return (
        <ContextMenu>
            <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
            <ContextMenu.Positioner>
                <ContextMenu.Content>
                    <ContextMenu.RadioItemGroup value={sortBy} onValueChange={setSortBy}>
                        <ContextMenu.ItemGroupLabel>Sort by</ContextMenu.ItemGroupLabel>
                        {options.map((option) => (
                            <ContextMenu.RadioItem key={option.value} value={option.value}>
                                <ContextMenu.ItemIndicator>
                                    <CheckmarkRegular />
                                </ContextMenu.ItemIndicator>
                                <ContextMenu.ItemText>{option.label}</ContextMenu.ItemText>
                            </ContextMenu.RadioItem>
                        ))}
                    </ContextMenu.RadioItemGroup>
                </ContextMenu.Content>
            </ContextMenu.Positioner>
        </ContextMenu>
    );
};

// Disabled Items, which are passed over by the pointer and the keys alike
export const DisabledItems: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu>
        <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Positioner>
            <ContextMenu.Content>
                <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
                <ContextMenu.Item value="paste" disabled>
                    Paste
                </ContextMenu.Item>
                <ContextMenu.Separator />
                <ContextMenu.Item value="delete" variant="danger" disabled>
                    Delete
                </ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Positioner>
    </ContextMenu>
);

// What Was Picked, which the menu says through `onSelect` whichever item it was
export const WhatWasPicked: StoryFn<typeof ContextMenu> = () => {
    const [picked, setPicked] = React.useState<string | null>(null);

    return (
        <div className={classes.stack}>
            <ContextMenu onSelect={setPicked}>
                <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
                <ContextMenu.Positioner>
                    <ContextMenu.Content>
                        <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                        <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
                        <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Positioner>
            </ContextMenu>
            <p className={classes.readout}>
                {picked ? `You picked "${picked}"` : "Nothing picked yet"}
            </p>
        </div>
    );
};

// A Menu The Caller Holds The State Of, so that something else can open and close it. Opened
// from outside, it stands where it was last pressed open
export const Controlled: StoryFn<typeof ContextMenu> = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <div className={classes.stack}>
            <ContextMenu open={open} onOpenChange={setOpen}>
                <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
                <ContextMenu.Positioner>
                    <ContextMenu.Content>
                        <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                        <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
                        <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Positioner>
            </ContextMenu>
            <Button onClick={() => setOpen((current) => !current)}>
                {open ? "Close" : "Open"} the menu
            </Button>
        </div>
    );
};

// Turned Off, where the press is left to the browser and the menu it would have shown
export const Disabled: StoryFn<typeof ContextMenu> = () => (
    <ContextMenu disabled>
        <ContextMenu.Trigger className={classes.area}>Right click here</ContextMenu.Trigger>
        <ContextMenu.Positioner>
            <ContextMenu.Content>
                <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
            </ContextMenu.Content>
        </ContextMenu.Positioner>
    </ContextMenu>
);
