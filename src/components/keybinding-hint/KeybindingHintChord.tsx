import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { splitChord } from "./chords";
import KeybindingHintKey from "./KeybindingHintKey";
import type {
    KeybindingHintChordProps,
    KeybindingHintSize,
    KeybindingHintVariant,
} from "./KeybindingHint.types";

const classes = {
    root: "inline-flex justify-center overflow-hidden gap-[0.5ch] p-[var(--base-size-4)] align-baseline border-solid border-[length:var(--border-width-thin)] rounded-[var(--border-radius-default)] [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-normal)] leading-[10px] [box-shadow:none]",
    variant: {
        normal: "bg-background-transparent text-foreground-muted border-border-default",
        onEmphasis:
            "bg-[var(--counter-background-color-emphasis)] text-foreground-on-emphasis border-transparent",
        onPrimary:
            "bg-[var(--button-primary-background-color-active)] text-foreground-on-emphasis border-transparent",
    } satisfies Record<KeybindingHintVariant, string>,
    // A width the box will not fall below keeps a run of single keys from being drawn as a run
    // of boxes of different sizes
    size: {
        normal: "min-w-[var(--base-size-20)]",
        small: "p-[var(--base-size-2)] rounded-[var(--border-radius-small)] [font-size:11px] leading-[var(--base-size-8)] min-w-[var(--base-size-16)]",
    } satisfies Record<KeybindingHintSize, string>,
};

// The keys that are held down together, drawn as the one box they are pressed as
function KeybindingHintChord(props: KeybindingHintChordProps) {
    const { keys, format = "condensed", variant = "normal", size = "normal" } = props;

    return (
        <span
            className={classNames(classes.root, classes.variant[variant], classes.size[size])}
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
