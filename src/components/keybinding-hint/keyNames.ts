import type { Platform } from "./KeybindingHint.types";

// Puts the first letter of a key in upper case and the rest in lower, which is how a key with
// no name of its own is shown
const capitalise = ([first, ...rest]: string) =>
    (first?.toUpperCase() ?? "") + rest.join("").toLowerCase();

// The maps below do not try to cover every key there is, only the ones a shortcut would
// realistically be built from. Pause/Break, for one, is not on many keyboards at all

// The short, drawn forms of the keys. They are the ones printed on a keyboard, so they should
// be recognised rather than worked out
const condensedKeyNames = (platform: Platform): Record<string, string | undefined> => ({
    // The alt key is the option key on an Apple keyboard; the browser knows it by the one name
    alt: platform === "apple" ? "⌥" : "Alt",
    control: "⌃",
    shift: "⇧",
    meta: platform === "apple" ? "⌘" : platform === "windows" ? "Win" : "Meta",
    mod: platform === "apple" ? "⌘" : "⌃",
    pageup: "PgUp",
    pagedown: "PgDn",
    arrowup: "↑",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
    // Named rather than typed, so that "+" can go on separating the keys of a chord
    plus: "+",
    backspace: "⌫",
    delete: "Del",
    // Named as well, so that a space can go on separating the chords of a sequence
    space: "␣",
    tab: "⇥",
    enter: "⏎",
    escape: "Esc",
    function: "Fn",
    capslock: "CapsLock",
    insert: "Ins",
    printscreen: "PrtScn",
});

// The written forms of the keys. Punctuation is still drawn, since a symbol is read faster
// than the word for it, but everything else is given the name it is spoken of by
const fullKeyNames = (platform: Platform): Record<string, string | undefined> => ({
    alt: platform === "apple" ? "Option" : "Alt",
    meta: platform === "apple" ? "Command" : platform === "windows" ? "Windows" : "Meta",
    mod: platform === "apple" ? "Command" : "Control",
    "+": "Plus",
    pageup: "Page Up",
    pagedown: "Page Down",
    arrowup: "Up Arrow",
    arrowdown: "Down Arrow",
    arrowleft: "Left Arrow",
    arrowright: "Right Arrow",
    capslock: "Caps Lock",
    printscreen: "Print Screen",
});

// The spoken forms of the keys, which keep a screen reader from making a pause of a full stop
// or saying nothing at all of a bracket
const accessibleKeyNames = (platform: Platform): Record<string, string | undefined> => ({
    alt: platform === "apple" ? "option" : "alt",
    meta: platform === "apple" ? "command" : platform === "windows" ? "Windows" : "meta",
    mod: platform === "apple" ? "command" : "control",
    // Two words are read where one run-together word may not be pronounced at all
    pageup: "page up",
    pagedown: "page down",
    arrowup: "up arrow",
    arrowdown: "down arrow",
    arrowleft: "left arrow",
    arrowright: "right arrow",
    capslock: "caps lock",
    printscreen: "print screen",
    // Only the symbols found on a standard keyboard are worth a name. The rest have no place
    // in a shortcut to begin with. Each is called what the key is called rather than what the
    // symbol is called, so "equals" rather than "equal sign" and "dash" rather than "minus"
    "`": "backtick",
    "~": "tilde",
    "!": "exclamation point",
    "@": "at",
    "#": "hash",
    $: "dollar sign",
    "%": "percent",
    "^": "caret",
    "&": "ampersand",
    "*": "asterisk",
    "(": "left parenthesis",
    ")": "right parenthesis",
    _: "underscore",
    "-": "dash",
    "+": "plus",
    "=": "equals",
    "[": "left bracket",
    "{": "left curly brace",
    "]": "right bracket",
    "}": "right curly brace",
    "\\": "backslash",
    "|": "pipe",
    ";": "semicolon",
    ":": "colon",
    "'": "single quote",
    '"': "double quote",
    ",": "comma",
    "<": "left angle bracket",
    ".": "period",
    ">": "right angle bracket",
    "/": "forward slash",
    "?": "question mark",
    " ": "space",
});

export const condensedKeyName = (key: string, platform: Platform) =>
    condensedKeyNames(platform)[key] ?? capitalise(key);

export const fullKeyName = (key: string, platform: Platform) =>
    fullKeyNames(platform)[key] ?? capitalise(key);

export const accessibleKeyName = (key: string, platform: Platform) =>
    accessibleKeyNames(platform)[key] ?? key.toLowerCase();
