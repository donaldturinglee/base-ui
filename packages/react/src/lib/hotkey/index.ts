/**
 * Hotkey library
 *
 * Fires an element when the key, or the sequence of keys, it was installed under is typed. A field
 * is focused and anything else is pressed, and every element dispatches a cancellable
 * `hotkey-fire` event first so a caller can do something else instead.
 *
 *     for (const el of document.querySelectorAll("[data-hotkey]")) {
 *         install(el);
 *     }
 *
 * The hotkey is read from the element's `data-hotkey` attribute, or handed to `install` directly.
 * A hotkey typed inside a field is meant for the field rather than for the page, unless the field
 * was named as the hotkey's `data-hotkey-scope`.
 *
 * Ported from @github/hotkey (MIT).
 */

import { Leaf, RadixTrie } from "./radix-trie";
import { SequenceTracker } from "./sequence";
import { eventToHotkeyString } from "./hotkey";
import { expandHotkeyToEdges, fireDeterminedAction, isFormField } from "./utilities";

export { eventToHotkeyString, normalizeHotkey } from "./hotkey";
export type { NormalizedHotkeyString } from "./hotkey";
export { SequenceTracker, normalizeSequence, SEQUENCE_DELIMITER } from "./sequence";
export type { NormalizedSequenceString } from "./sequence";
export { RadixTrie, Leaf } from "./radix-trie";
export { isFormField, fireDeterminedAction, expandHotkeyToEdges } from "./utilities";

const hotkeyRadixTrie = new RadixTrie<HTMLElement>();
const elementsLeaves = new WeakMap<HTMLElement, Array<Leaf<HTMLElement>>>();
let currentTriePosition: RadixTrie<HTMLElement> | Leaf<HTMLElement> = hotkeyRadixTrie;

const sequenceTracker = new SequenceTracker({
    onReset() {
        currentTriePosition = hotkeyRadixTrie;
    },
});

function keyDownHandler(event: KeyboardEvent) {
    if (event.defaultPrevented) return;
    if (!(event.target instanceof Node)) return;
    if (isFormField(event.target)) {
        const target = event.target as HTMLElement;
        if (!target.id) return;
        if (!target.ownerDocument.querySelector(`[data-hotkey-scope="${target.id}"]`)) return;
    }

    // If the user presses a hotkey that doesn't exist in the Trie,
    // they've pressed a wrong key-combo and we should reset the flow
    const newTriePosition = (currentTriePosition as RadixTrie<HTMLElement>).get(
        eventToHotkeyString(event),
    );
    if (!newTriePosition) {
        sequenceTracker.reset();
        return;
    }
    sequenceTracker.registerKeypress(event);

    currentTriePosition = newTriePosition;
    if (newTriePosition instanceof Leaf) {
        const target = event.target as HTMLElement;
        let shouldFire = false;
        let elementToFire;
        const formField = isFormField(target);

        for (let i = newTriePosition.children.length - 1; i >= 0; i -= 1) {
            elementToFire = newTriePosition.children[i];
            const scope = elementToFire.getAttribute("data-hotkey-scope");
            if ((!formField && !scope) || (formField && target.id === scope)) {
                shouldFire = true;
                break;
            }
        }

        if (elementToFire && shouldFire) {
            fireDeterminedAction(elementToFire, sequenceTracker.path);
            event.preventDefault();
        }

        sequenceTracker.reset();
    }
}

/** Registers an element to be fired when its hotkey is typed */
export function install(element: HTMLElement, hotkey?: string): void {
    // Install the keydown handler if this is the first install
    if (Object.keys(hotkeyRadixTrie.children).length === 0) {
        document.addEventListener("keydown", keyDownHandler);
    }

    const hotkeys = expandHotkeyToEdges(hotkey || element.getAttribute("data-hotkey") || "");
    const leaves = hotkeys.map((h) =>
        (hotkeyRadixTrie.insert(h) as Leaf<HTMLElement>).add(element),
    );
    elementsLeaves.set(element, leaves);
}

/** Takes an element back off its hotkey */
export function uninstall(element: HTMLElement): void {
    const leaves = elementsLeaves.get(element);
    if (leaves && leaves.length) {
        for (const leaf of leaves) {
            if (leaf) leaf.delete(element);
        }
    }

    if (Object.keys(hotkeyRadixTrie.children).length === 0) {
        document.removeEventListener("keydown", keyDownHandler);
    }
}
