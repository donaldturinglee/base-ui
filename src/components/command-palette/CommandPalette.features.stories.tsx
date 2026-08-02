import * as React from "react";
import {
    AddRegular,
    DocumentRegular,
    PersonAddRegular,
    SettingsRegular,
} from "@gamecrafters/base-ui-icons";
import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { KeybindingHint } from "../keybinding-hint";
import { Stack } from "../stack";
import { Text } from "../text";
import { CommandPalette } from ".";

const classes = {
    frame: "w-[var(--overlay-width-large)] max-w-full",
    item: "flex w-full items-center gap-[var(--base-size-8)]",
    icon: "size-[var(--base-size-16)] shrink-0 [color:var(--foreground-color-muted)]",
    trailing: "ms-auto",
};

const commands = [
    { name: "Dashboard", icon: DocumentRegular, keywords: ["home", "overview"] },
    { name: "Projects", icon: DocumentRegular, keywords: ["work"] },
    { name: "Settings", icon: SettingsRegular, keywords: ["preferences", "config"] },
];

const actions = [
    { name: "New project", icon: AddRegular, keywords: ["add", "make", "create"] },
    { name: "Invite a teammate", icon: PersonAddRegular, keywords: ["ask", "share"] },
];

// More than the panel can hold at once, which is the state a palette is usually reached in:
// there is too much to go looking through, so it is typed at or run down instead
const files = Array.from({ length: 40 }, (_, index) => `src/components/Component${index + 1}.tsx`);

export default {
    title: "Components/CommandPalette/Features",
    parameters: {
        layout: "centered",
    },
};

// Written Out By Hand, which is how the palette is composed: every part is the caller's to
// place, and the palette only says which of them are still worth showing
export const Composed: StoryFn = () => (
    <div className={classes.frame}>
        <CommandPalette>
            <CommandPalette.Input />
            <CommandPalette.List>
                <CommandPalette.Empty />
                <CommandPalette.Group heading="Pages">
                    {commands.map((command) => (
                        <CommandPalette.Item key={command.name} keywords={command.keywords}>
                            {command.name}
                        </CommandPalette.Item>
                    ))}
                </CommandPalette.Group>
                <CommandPalette.Separator />
                <CommandPalette.Group heading="Actions">
                    {actions.map((action) => (
                        <CommandPalette.Item key={action.name} keywords={action.keywords}>
                            {action.name}
                        </CommandPalette.Item>
                    ))}
                </CommandPalette.Group>
            </CommandPalette.List>
        </CommandPalette>
    </div>
);

// Items With More To Them Than Text, where the value has to be given outright since the text
// the item is written with is no longer only its name
export const WithVisuals: StoryFn = () => (
    <div className={classes.frame}>
        <CommandPalette>
            <CommandPalette.Input />
            <CommandPalette.List>
                <CommandPalette.Empty />
                {[...commands, ...actions].map((command) => (
                    <CommandPalette.Item
                        key={command.name}
                        value={command.name}
                        keywords={command.keywords}
                    >
                        <span className={classes.item}>
                            <command.icon className={classes.icon} />
                            {command.name}
                            <KeybindingHint keys="Enter" className={classes.trailing} />
                        </span>
                    </CommandPalette.Item>
                ))}
            </CommandPalette.List>
        </CommandPalette>
    </div>
);

// Brought Out Over The Page, which is how a palette is usually reached. It takes focus as it
// opens and hands it back to whatever had it once it closes
export const InADialog: StoryFn = () => {
    const [open, setOpen] = React.useState(false);
    const [picked, setPicked] = React.useState("");

    // The palette answers to a key from anywhere on the page, which is the whole point of one
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((current) => !current);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <Stack gap="condensed" align="start">
            <Button onClick={() => setOpen(true)}>
                Open the palette <KeybindingHint keys="Mod+K" />
            </Button>
            <Text>{picked === "" ? "Nothing picked yet" : `Picked ${picked}`}</Text>
            <CommandPalette.Dialog
                open={open}
                onOpenChange={setOpen}
                onSelect={(value) => {
                    setPicked(value);
                    setOpen(false);
                }}
            >
                <CommandPalette.Input />
                <CommandPalette.List>
                    <CommandPalette.Empty />
                    <CommandPalette.Group heading="Pages">
                        {commands.map((command) => (
                            <CommandPalette.Item key={command.name} keywords={command.keywords}>
                                {command.name}
                            </CommandPalette.Item>
                        ))}
                    </CommandPalette.Group>
                </CommandPalette.List>
            </CommandPalette.Dialog>
        </Stack>
    );
};

// Coming Round At Either End, so that running past the last item lands back on the first
export const Looping: StoryFn = () => (
    <div className={classes.frame}>
        <CommandPalette loop>
            <CommandPalette.Input placeholder="Press the up arrow to start at the end" />
            <CommandPalette.List>
                <CommandPalette.Empty />
                {commands.map((command) => (
                    <CommandPalette.Item key={command.name}>{command.name}</CommandPalette.Item>
                ))}
            </CommandPalette.List>
        </CommandPalette>
    </div>
);

// More Than Can Be Seen At Once, where the list gives way at the height it was allowed rather
// than running the panel off the screen. Whatever is in hand is brought back into view as the
// arrows carry it past either edge of what is showing, so the reader never loses it
export const Scrolling: StoryFn = () => (
    <div className={classes.frame}>
        <CommandPalette>
            <CommandPalette.Input placeholder="Hold the down arrow to run past what is showing" />
            <CommandPalette.List>
                <CommandPalette.Empty />
                <CommandPalette.Group heading="Files">
                    {files.map((file) => (
                        <CommandPalette.Item key={file}>{file}</CommandPalette.Item>
                    ))}
                </CommandPalette.Group>
            </CommandPalette.List>
        </CommandPalette>
    </div>
);

// Narrowed By The Caller Instead, for a list that comes from somewhere the palette cannot see.
// Nothing is filtered away here; what arrives is what is shown
export const FilteredElsewhere: StoryFn = () => {
    const [search, setSearch] = React.useState("");

    const matches = commands.filter((command) =>
        command.name.toLowerCase().includes(search.trim().toLowerCase()),
    );

    return (
        <div className={classes.frame}>
            <CommandPalette shouldFilter={false} search={search} onSearchChange={setSearch}>
                <CommandPalette.Input placeholder="Filtered against the list itself" />
                <CommandPalette.List>
                    <CommandPalette.Empty>Nothing came back</CommandPalette.Empty>
                    {matches.map((command) => (
                        <CommandPalette.Item key={command.name}>{command.name}</CommandPalette.Item>
                    ))}
                </CommandPalette.List>
            </CommandPalette>
        </div>
    );
};

// Waiting On What Is Still Coming, which stands in place of the list rather than beside it
export const Loading: StoryFn = () => {
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timeout = window.setTimeout(() => setLoading(false), 2000);

        return () => {
            window.clearTimeout(timeout);
        };
    }, []);

    return (
        <div className={classes.frame}>
            <CommandPalette>
                <CommandPalette.Input />
                <CommandPalette.List>
                    {loading ? <CommandPalette.Loading /> : null}
                    {loading
                        ? null
                        : commands.map((command) => (
                              <CommandPalette.Item key={command.name}>
                                  {command.name}
                              </CommandPalette.Item>
                          ))}
                </CommandPalette.List>
            </CommandPalette>
        </div>
    );
};

// Items That Cannot Be Picked, which are still shown and still read out, but which the arrows
// step over rather than stopping on
export const Unavailable: StoryFn = () => (
    <div className={classes.frame}>
        <CommandPalette>
            <CommandPalette.Input />
            <CommandPalette.List>
                <CommandPalette.Empty />
                <CommandPalette.Item>New project</CommandPalette.Item>
                <CommandPalette.Item disabled>Delete this project</CommandPalette.Item>
                <CommandPalette.Item>Invite a teammate</CommandPalette.Item>
            </CommandPalette.List>
        </CommandPalette>
    </div>
);
