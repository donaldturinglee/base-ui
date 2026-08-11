import type * as React from "react";

// Condensed is the form for a menu or a tooltip, where there is little room; full is the one
// for prose, where the keys are spoken of rather than shown
export type KeybindingHintFormat = "condensed" | "full";

// What the hint is drawn on: an emphasis colour, a primary button, or anything else
export type KeybindingHintVariant = "normal" | "onEmphasis" | "onPrimary";

export type KeybindingHintSize = "small" | "normal";

// The platforms that name the same key differently. Everything that is neither Apple nor
// Windows is left with the names the key carries on its own
export type Platform = "apple" | "windows" | "other";

// The content is worked out from the keys, so there is nothing for a caller to put inside
export type KeybindingHintProps = Omit<React.ComponentPropsWithoutRef<"kbd">, "children"> & {
    // The keys the binding is made of, named as `KeyboardEvent.key` would name them, such as
    // "Control", "Shift", "ArrowUp" or "a".
    //
    // Keys joined with "+" are pressed together; use "Plus" for the "+" key itself. Chords
    // separated by " " are pressed one after the other, so "a b" is "a then b"; use "Space"
    // for the space bar.
    //
    // The key "Mod" stands for Command on Apple platforms and Control everywhere else
    keys: string;
    format?: KeybindingHintFormat;
    variant?: KeybindingHintVariant;
    size?: KeybindingHintSize;
    className?: string;
};

// The keys pressed together, drawn as the one box they are pressed as
export type KeybindingHintChordProps = {
    keys: string;
    format?: KeybindingHintFormat;
    variant?: KeybindingHintVariant;
    size?: KeybindingHintSize;
};

export type KeybindingHintKeyProps = {
    name: string;
    format?: KeybindingHintFormat;
};
