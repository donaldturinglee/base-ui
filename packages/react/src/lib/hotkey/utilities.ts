/**
 * What a hotkey does when it fires, and how a written hotkey is read into the edges of the tree
 * the installed ones are held in.
 */

import { normalizeHotkey } from "./hotkey";
import { SEQUENCE_DELIMITER } from "./sequence";
import type { NormalizedHotkeyString } from "./hotkey";

/**
 * Whether the element is one a reader types into. A hotkey pressed inside one of these is meant
 * for the field rather than for the page, unless the field was named as a scope.
 */
export function isFormField(element: Node): boolean {
    if (!(element instanceof HTMLElement)) {
        return false;
    }

    const name = element.nodeName.toLowerCase();
    const type = (element.getAttribute("type") || "").toLowerCase();
    return (
        name === "select" ||
        name === "textarea" ||
        (name === "input" &&
            type !== "submit" &&
            type !== "reset" &&
            type !== "checkbox" &&
            type !== "radio" &&
            type !== "file") ||
        element.isContentEditable
    );
}

/**
 * Fires the element a hotkey was installed on: a field is focused and anything else is pressed.
 * The `hotkey-fire` event is dispatched first and can be cancelled, so a caller who wants
 * something else to happen says so there.
 */
export function fireDeterminedAction(
    el: HTMLElement,
    path: readonly NormalizedHotkeyString[],
): void {
    const delegateEvent = new CustomEvent("hotkey-fire", { cancelable: true, detail: { path } });
    const cancelled = !el.dispatchEvent(delegateEvent);
    if (cancelled) return;
    if (isFormField(el)) {
        el.focus();
    } else {
        el.click();
    }
}

/**
 * Reads a hotkey string into the sequences it stands for, each of those being the edges walked
 * down the tree to reach it. `a b,Control+/` is two: `["a", "b"]` and `["Control+/"]`.
 */
export function expandHotkeyToEdges(hotkey: string): NormalizedHotkeyString[][] {
    // NOTE: we can't just split by comma, since comma is a valid hotkey character!
    const output = [];
    let acc = [""];
    let commaIsSeparator = false;
    for (let i = 0; i < hotkey.length; i++) {
        if (commaIsSeparator && hotkey[i] === ",") {
            output.push(acc);
            acc = [""];
            commaIsSeparator = false;
            continue;
        }

        if (hotkey[i] === SEQUENCE_DELIMITER) {
            // Spaces are used to separate key sequences, so a following comma is
            // part of the sequence, not a separator.
            acc.push("");
            commaIsSeparator = false;
            continue;
        } else if (hotkey[i] === "+") {
            // If the current character is a +, a following comma is part of the
            // shortcut and not a separator.
            commaIsSeparator = false;
        } else {
            commaIsSeparator = true;
        }

        acc[acc.length - 1] += hotkey[i];
    }

    output.push(acc);

    // Remove any empty hotkeys/sequences
    return output
        .map((h) => h.map((k) => normalizeHotkey(k)).filter((k) => k !== ""))
        .filter((h) => h.length > 0);
}
