import { accessibleKeyName, condensedKeyName, fullKeyName } from "./keyNames";
import { usePlatform } from "./platform";
import type { KeybindingHintKeyProps } from "./KeybindingHint.types";

const classes = {
    hidden: "sr-only",
};

// One key, drawn as it is printed on a keyboard and read as it is spoken of
function KeybindingHintKey(props: KeybindingHintKeyProps) {
    const { name, format = "condensed" } = props;

    const platform = usePlatform();

    return (
        <>
            <span className={classes.hidden}>{accessibleKeyName(name, platform)}</span>
            {/* What is drawn is a symbol as often as it is a word, and a symbol is read as
                anything from a pause to nothing at all, so it is left out of the reading */}
            <span aria-hidden="true">
                {format === "condensed"
                    ? condensedKeyName(name, platform)
                    : fullKeyName(name, platform)}
            </span>
        </>
    );
}

KeybindingHintKey.displayName = "KeybindingHint.Key";

export default KeybindingHintKey;
