import { accessibleKeyName } from "./keyNames";
import type { Platform } from "./KeybindingHint.types";

// The order the modifiers are always shown in, whatever order they were given in. A chord
// never holds more than one key that is not a modifier, so that one simply falls to the end
const keySortPriorities: Record<string, number | undefined> = {
    control: 1,
    meta: 2,
    alt: 3,
    option: 4,
    shift: 5,
    function: 6,
};

const keySortPriority = (key: string) => keySortPriorities[key] ?? Infinity;

// The keys of a chord, lowercased and put in the order they are read in
export const splitChord = (chord: string) =>
    chord
        .split("+")
        .map((key) => key.toLowerCase())
        .sort((a, b) => keySortPriority(a) - keySortPriority(b));

// The chords of a sequence, in the order they are pressed
export const splitSequence = (sequence: string) => sequence.split(" ");

// What a chord reads as, as plain text
export const accessibleChordString = (chord: string, platform: Platform) =>
    splitChord(chord)
        .map((key) => accessibleKeyName(key, platform))
        .join(" ");

// What a sequence reads as, as plain text
export const accessibleSequenceString = (sequence: string, platform: Platform) =>
    splitSequence(sequence)
        .map((chord) => accessibleChordString(chord, platform))
        .join(" then ");

// AVOID: a `KeybindingHint` says the same thing to everyone at once, and is what should be
// reached for. This is here for the places that can only hold text, such as an `aria-label` or
// an `aria-description`, and what it returns should never be shown: it is the spoken form of
// the keys, and a hint that can be seen should nearly always be given alongside it.
//
// The platform decides what the keys that are named differently from one to the next, such as
// "Meta", "Alt" and "Mod", are called. `usePlatform` is where to get it from
export const getAccessibleKeybindingHintString = (sequence: string, platform: Platform) =>
    accessibleSequenceString(sequence, platform);
