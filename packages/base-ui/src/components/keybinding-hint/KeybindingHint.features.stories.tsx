import type { StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Stack } from "../stack";
import { Text } from "../text";
import { KeybindingHint, PlatformContext } from ".";
import type { Platform } from "./KeybindingHint.types";

const classes = {
    // Stands the hint on something dark enough to need the emphasis colours
    emphasis:
        "inline-flex p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-background-black",
    primary:
        "inline-flex p-[var(--base-size-12)] rounded-[var(--border-radius-medium)] bg-[var(--button-primary-background-color-rest)]",
    table: "border-collapse",
    cell: "py-[var(--base-size-8)] px-[var(--base-size-12)] text-left border-solid border-[length:var(--border-width-thin)] border-border-default",
    header: "text-foreground-muted [font-weight:var(--base-text-weight-semibold)]",
    prose: "max-w-[24rem]",
};

const chord = "Mod+Shift+K";

const sequence = "Mod+x y z";

const platforms: Array<{ platform: Platform; label: string }> = [
    { platform: "apple", label: "Apple (macOS / iOS)" },
    { platform: "windows", label: "Windows" },
    { platform: "other", label: "Other (Linux, Android, …)" },
];

const modifierKeys = ["Mod", "Meta", "Alt", "Control", "Shift"];

export default {
    title: "Components/KeybindingHint/Features",
    parameters: {
        layout: "centered",
    },
};

// Condensed, which is the form for a menu or a tooltip, where there is little room
export const Condensed: StoryFn<typeof KeybindingHint> = () => <KeybindingHint keys={chord} />;

// Full, which is the form for prose, where the keys are spoken of rather than shown
export const Full: StoryFn<typeof KeybindingHint> = () => (
    <KeybindingHint keys={chord} format="full" />
);

// A Sequence, where the chords are pressed one after the other rather than together
export const SequenceCondensed: StoryFn<typeof KeybindingHint> = () => (
    <KeybindingHint keys={sequence} />
);

export const SequenceFull: StoryFn<typeof KeybindingHint> = () => (
    <KeybindingHint keys={sequence} format="full" />
);

// On Emphasis, for a hint standing on one of the emphasis colours
export const OnEmphasis: StoryFn<typeof KeybindingHint> = () => (
    <div className={classes.emphasis}>
        <KeybindingHint keys={chord} variant="onEmphasis" />
    </div>
);

// On Primary, for a hint standing on a primary button
export const OnPrimary: StoryFn<typeof KeybindingHint> = () => (
    <div className={classes.primary}>
        <KeybindingHint keys={chord} variant="onPrimary" />
    </div>
);

// Small, for a hint that has to sit inside something small itself
export const Small: StoryFn<typeof KeybindingHint> = () => (
    <KeybindingHint keys={chord} size="small" />
);

// In A Button, where the hint says how the button can be reached without it
export const InAButton: StoryFn<typeof KeybindingHint> = () => (
    <Stack direction="horizontal" gap="condensed" align="center">
        <Button trailingVisual={<KeybindingHint keys="Mod+k" />}>Search</Button>
        {/* The keys stand on the button itself, so they take the colours that hold up
            against a primary one */}
        <Button
            variant="primary"
            trailingVisual={<KeybindingHint keys="Mod+Enter" variant="onPrimary" />}
        >
            Comment
        </Button>
    </Stack>
);

// In Prose, where the keys are written out as they would be spoken
export const InProse: StoryFn<typeof KeybindingHint> = () => (
    <Text as="p" className={classes.prose}>
        Press <KeybindingHint keys="Mod+Shift+P" format="full" /> to move between writing and
        previewing.
    </Text>
);

// Platforms, where the same key is named differently from one to the next. The platform is
// stood in for here so that all of them can be seen from whichever one is running
export const Platforms: StoryFn<typeof KeybindingHint> = () => (
    <table className={classes.table}>
        <thead>
            <tr>
                <th scope="col" className={`${classes.cell} ${classes.header}`}>
                    Platform
                </th>
                {modifierKeys.map((key) => (
                    <th key={key} scope="col" className={`${classes.cell} ${classes.header}`}>
                        {key}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {platforms.map(({ platform, label }) => (
                <tr key={platform}>
                    <th scope="row" className={`${classes.cell} ${classes.header}`}>
                        {label}
                    </th>
                    {modifierKeys.map((key) => (
                        <td key={key} className={classes.cell}>
                            <PlatformContext.Provider value={platform}>
                                <KeybindingHint keys={`${key}+K`} format="full" />
                            </PlatformContext.Provider>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);
