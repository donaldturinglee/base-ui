import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { splitSequence } from "./chords";
import KeybindingHintChord from "./KeybindingHintChord";
import type { KeybindingHintProps } from "./KeybindingHint.types";

const classes = {
    // A `kbd` is drawn as a key of its own, in a face of its own. Here the box is the chord's
    // to draw, so what is left is stripped back to the text it stands in
    root: "relative inline-block p-0 overflow-visible align-baseline whitespace-nowrap border-0 bg-transparent [font-family:inherit] [font-size:inherit] [line-height:unset] [color:inherit] [box-shadow:none]",
    hidden: "sr-only",
};

// Says that a keybinding is there, and what it is
function KeybindingHint(
    props: KeybindingHintProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        keys,
        format = "condensed",
        variant = "normal",
        size = "normal",
        ...rest
    } = props;

    return (
        <kbd
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="KeybindingHint"
            data-format={format}
            data-variant={variant}
            data-size={size}
            {...rest}
        >
            {splitSequence(keys).map((chord, index) => (
                <React.Fragment key={index}>
                    {index > 0 ? (
                        // The keys of a chord are held apart by a space when they are read, so
                        // the chords of a sequence need a word of their own to be told apart
                        <>
                            <span className={classes.hidden}>then</span>{" "}
                        </>
                    ) : null}
                    <KeybindingHintChord
                        keys={chord}
                        format={format}
                        variant={variant}
                        size={size}
                    />
                </React.Fragment>
            ))}
        </kbd>
    );
}

KeybindingHint.displayName = "KeybindingHint";

export default fixedForwardRef(KeybindingHint);
