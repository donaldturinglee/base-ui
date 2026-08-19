import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { splitChord } from "./chords";
import KeybindingHintKey from "./KeybindingHintKey";
import type {
    KeybindingHintChordProps,
    KeybindingHintSize,
    KeybindingHintVariant,
} from "./KeybindingHint.types";

const keybindingHintChordVariants = cva("keybinding-hint-chord", {
    variants: {
        variant: {
            normal: "keybinding-hint-chord-normal",
            onEmphasis: "keybinding-hint-chord-on-emphasis",
            onPrimary: "keybinding-hint-chord-on-primary",
        } satisfies Record<KeybindingHintVariant, string>,
        size: {
            normal: "keybinding-hint-chord-size-normal",
            small: "keybinding-hint-chord-size-small",
        } satisfies Record<KeybindingHintSize, string>,
    },
});

// The keys that are held down together, drawn as the one box they are pressed as
function KeybindingHintChord(props: KeybindingHintChordProps) {
    const { keys, format = "condensed", variant = "normal", size = "normal" } = props;

    return (
        <span
            className={classNames(keybindingHintChordVariants({ variant, size }))}
            data-component="KeybindingHint.Chord"
        >
            {splitChord(keys).map((key, index) => (
                <React.Fragment key={index}>
                    {index > 0 && format === "full" ? (
                        // Drawn only, since a plus sign read out between every key would say
                        // less than it costs to hear
                        <span aria-hidden="true"> + </span>
                    ) : (
                        // Nothing to look at once the box lays its keys out, but it is what
                        // holds one key name apart from the next when they are read
                        " "
                    )}
                    <KeybindingHintKey name={key} format={format} />
                </React.Fragment>
            ))}
        </span>
    );
}

KeybindingHintChord.displayName = "KeybindingHint.Chord";

export default KeybindingHintChord;
