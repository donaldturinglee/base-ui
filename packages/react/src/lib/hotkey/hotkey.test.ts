import { describe, it, expect, vi, afterEach } from "vitest";
import {
    eventToHotkeyString,
    expandHotkeyToEdges,
    install,
    isFormField,
    Leaf,
    normalizeHotkey,
    normalizeSequence,
    RadixTrie,
    SequenceTracker,
    uninstall,
} from ".";

const MAC = "MacIntel";
const WINDOWS = "Win32";

// The trie and the keydown handler behind it are the module's own, so whatever a test installs is
// taken back off again before the next one runs
const installed: HTMLElement[] = [];

const setHTML = (html: string) => {
    document.body.innerHTML = html;

    for (const element of document.querySelectorAll<HTMLElement>("[data-hotkey]")) {
        install(element);
        installed.push(element);
    }
};

const press = (init: KeyboardEventInit, on: EventTarget = document) => {
    on.dispatchEvent(new KeyboardEvent("keydown", { ...init, bubbles: true }));
};

afterEach(() => {
    for (const element of installed.splice(0)) {
        uninstall(element);
    }

    document.body.innerHTML = "";
});

describe("normalizeHotkey", () => {
    const cases: Array<[string, string, string?]> = [
        ["a", "a"],
        ["Control+a", "Control+a"],
        ["Meta+a", "Meta+a"],
        ["Control+Meta+a", "Control+Meta+a"],
        // `Mod` is whichever of the two the platform reaches for
        ["Mod+a", "Control+a", WINDOWS],
        ["Mod+a", "Meta+a", MAC],
        ["Mod+a", "Meta+a", "iPhone"],
        ["Mod+Alt+a", "Control+Alt+a", WINDOWS],
        ["Mod+Alt+a", "Alt+Meta+a", MAC],
        // Nothing to read the platform from falls back to the one that is not a mac
        ["Mod+a", "Control+a", ""],
        // The modifiers are put in the one order, whichever order they were written in
        ["Shift+Alt+Meta+Control+m", "Control+Alt+Meta+Shift+m"],
        ["Shift+Alt+Mod+m", "Control+Alt+Shift+m", WINDOWS],
        ["Alt", "Alt", WINDOWS],
        ["Alt+Mod", "Control+Alt", WINDOWS],
    ];

    for (const [input, expected, platform = ""] of cases) {
        it(`reads "${input}" as "${expected}"`, () => {
            expect(normalizeHotkey(input, platform)).toBe(expected);
        });
    }

    it("puts every hotkey of a sequence into the same form", () => {
        expect(normalizeSequence("Shift+Alt+m g")).toBe("Alt+Shift+m g");
    });
});

describe("eventToHotkeyString", () => {
    it("writes the modifiers in the one order, whichever were held", () => {
        const event = new KeyboardEvent("keydown", {
            key: "m",
            shiftKey: true,
            ctrlKey: true,
            altKey: true,
            metaKey: true,
        });

        expect(eventToHotkeyString(event, WINDOWS)).toBe("Control+Alt+Meta+Shift+m");
    });

    it("says nothing of a modifier held on its own beyond that it was held", () => {
        const event = new KeyboardEvent("keydown", { key: "Control", ctrlKey: true });
        expect(eventToHotkeyString(event, WINDOWS)).toBe("Control");
    });

    it("names the keys that cannot be written in a hotkey string", () => {
        expect(eventToHotkeyString(new KeyboardEvent("keydown", { key: " " }), WINDOWS)).toBe(
            "Space",
        );
        expect(eventToHotkeyString(new KeyboardEvent("keydown", { key: "+" }), WINDOWS)).toBe(
            "Plus",
        );
    });

    // A mac types a symbol where another platform reports the key that was pressed, so the symbol
    // is read back to the key it came from
    it("reads a mac's Alt symbols back to the key that was pressed", () => {
        const event = new KeyboardEvent("keydown", { key: "ƒ", altKey: true });

        expect(eventToHotkeyString(event, MAC)).toBe("Alt+f");
        expect(eventToHotkeyString(event, WINDOWS)).toBe("Alt+ƒ");
    });

    it("reads a mac's Command+Shift keys back to uppercase", () => {
        const event = new KeyboardEvent("keydown", { key: "a", metaKey: true, shiftKey: true });

        expect(eventToHotkeyString(event, MAC)).toBe("Meta+Shift+A");
        expect(eventToHotkeyString(event, WINDOWS)).toBe("Meta+Shift+a");
    });
});

describe("expandHotkeyToEdges", () => {
    it("reads a plain key as the one sequence of one key", () => {
        expect(expandHotkeyToEdges("a")).toEqual([["a"]]);
    });

    it("reads keys typed one after another as a sequence", () => {
        expect(expandHotkeyToEdges("g c")).toEqual([["g", "c"]]);
    });

    it("reads the aliases either side of a comma as sequences of their own", () => {
        expect(expandHotkeyToEdges("s,/")).toEqual([["s"], ["/"]]);
    });

    // The comma is both what separates the aliases and a key a reader can press, so which one it
    // is depends on what came before it
    it("takes a comma of its own as a key rather than as a separator", () => {
        expect(expandHotkeyToEdges("a,,")).toEqual([["a"], [","]]);
    });

    it("takes the comma after a modifier as a key", () => {
        expect(expandHotkeyToEdges("Control+,,x")).toEqual([["Control+,"], ["x"]]);
    });

    it("takes the comma after a space as part of the sequence", () => {
        expect(expandHotkeyToEdges(", a b,c")).toEqual([[",", "a", "b"], ["c"]]);
    });

    it("drops what was written but says nothing", () => {
        expect(expandHotkeyToEdges("")).toEqual([]);
    });
});

describe("RadixTrie", () => {
    it("holds a sequence a key to a level, and hands back the leaf at the end of it", () => {
        const trie = new RadixTrie<string>();
        const leaf = trie.insert(["Control+p", "a", "b"]);

        expect(leaf).toBeInstanceOf(Leaf);
        expect((trie.get("Control+p") as RadixTrie<string>).get("a")).toBeInstanceOf(RadixTrie);
        expect(
            ((trie.get("Control+p") as RadixTrie<string>).get("a") as RadixTrie<string>).get("b"),
        ).toBe(leaf);
    });

    it("holds two sequences that begin the same way under the levels they share", () => {
        const trie = new RadixTrie<string>();
        const first = trie.insert(["g", "c"]);
        const second = trie.insert(["g", "i"]);

        expect(first).not.toBe(second);
        expect((trie.get("g") as RadixTrie<string>).get("c")).toBe(first);
        expect((trie.get("g") as RadixTrie<string>).get("i")).toBe(second);
    });

    it("takes a level that has emptied out off the one above it", () => {
        const trie = new RadixTrie<string>();
        const leaf = trie.insert(["Control+p", "a"]) as Leaf<string>;

        expect(leaf.parent.delete(leaf)).toBe(true);
        expect(trie.get("Control+p")).toBeUndefined();
    });

    it("leaves a level holding something else where it is", () => {
        const trie = new RadixTrie<string>();
        trie.insert(["g", "c"]);
        const second = trie.insert(["g", "i"]) as Leaf<string>;

        second.parent.delete(second);

        expect(trie.get("g")).toBeInstanceOf(RadixTrie);
        expect((trie.get("g") as RadixTrie<string>).get("i")).toBeUndefined();
    });
});

describe("SequenceTracker", () => {
    it("counts up what has been typed so far", () => {
        const tracker = new SequenceTracker();

        tracker.registerKeypress(new KeyboardEvent("keydown", { key: "g" }));
        tracker.registerKeypress(new KeyboardEvent("keydown", { key: "c" }));

        expect(tracker.path).toEqual(["g", "c"]);
        expect(tracker.sequence).toBe("g c");
    });

    it("gives up on a part-typed sequence once it has been left long enough", () => {
        vi.useFakeTimers();

        const onReset = vi.fn();
        const tracker = new SequenceTracker({ onReset });

        tracker.registerKeypress(new KeyboardEvent("keydown", { key: "g" }));
        vi.advanceTimersByTime(SequenceTracker.CHORD_TIMEOUT);

        expect(onReset).toHaveBeenCalledTimes(1);
        expect(tracker.sequence).toBe("");

        vi.useRealTimers();
    });
});

describe("isFormField", () => {
    it("knows what a reader types into", () => {
        document.body.innerHTML = `
            <input id="text" />
            <textarea id="area"></textarea>
            <select id="select"></select>
            <input id="check" type="checkbox" />
            <button id="button"></button>
        `;

        const at = (id: string) => document.getElementById(id) as HTMLElement;

        expect(isFormField(at("text"))).toBe(true);
        expect(isFormField(at("area"))).toBe(true);
        expect(isFormField(at("select"))).toBe(true);

        // Anything else falls through to `isContentEditable`, which jsdom leaves unset where a
        // browser would answer `false`, so what is asked here is only that it is not a field
        expect(isFormField(at("check"))).toBeFalsy();
        expect(isFormField(at("button"))).toBeFalsy();
    });
});

describe("install", () => {
    it("presses the element the key was installed on", () => {
        setHTML('<button id="one" data-hotkey="b">One</button>');
        const clicked = vi.fn();
        document.getElementById("one")?.addEventListener("click", clicked);

        press({ key: "b" });

        expect(clicked).toHaveBeenCalledTimes(1);
    });

    it("takes the hotkey it was handed over the one written on the element", () => {
        document.body.innerHTML = '<button id="one" data-hotkey="b">One</button>';
        const element = document.getElementById("one") as HTMLElement;
        install(element, "z");
        installed.push(element);

        const clicked = vi.fn();
        element.addEventListener("click", clicked);

        press({ key: "b" });
        expect(clicked).not.toHaveBeenCalled();

        press({ key: "z" });
        expect(clicked).toHaveBeenCalledTimes(1);
    });

    it("focuses a field rather than pressing it", () => {
        setHTML('<input id="one" data-hotkey="b" />');

        press({ key: "b" });

        expect(document.activeElement).toBe(document.getElementById("one"));
    });

    it("fires only once the whole sequence has been typed", () => {
        setHTML('<button id="one" data-hotkey="g c">One</button>');
        const clicked = vi.fn();
        document.getElementById("one")?.addEventListener("click", clicked);

        press({ key: "g" });
        expect(clicked).not.toHaveBeenCalled();

        press({ key: "c" });
        expect(clicked).toHaveBeenCalledTimes(1);
    });

    it("answers either of the aliases it was given", () => {
        setHTML('<button id="one" data-hotkey="s,/">One</button>');
        const clicked = vi.fn();
        document.getElementById("one")?.addEventListener("click", clicked);

        press({ key: "s" });
        press({ key: "/" });

        expect(clicked).toHaveBeenCalledTimes(2);
    });

    it("answers a comma pressed on its own", () => {
        setHTML('<button id="one" data-hotkey=",">One</button>');
        const clicked = vi.fn();
        document.getElementById("one")?.addEventListener("click", clicked);

        press({ key: "," });

        expect(clicked).toHaveBeenCalledTimes(1);
    });

    it("says what it is about to do, and can be told not to", () => {
        setHTML('<button id="one" data-hotkey="Shift+B">One</button>');
        const element = document.getElementById("one") as HTMLElement;

        const fired = vi.fn((event: Event) => {
            expect(event.cancelable).toBe(true);
            expect((event as CustomEvent).detail.path).toEqual(["Shift+B"]);
            event.preventDefault();
        });

        const clicked = vi.fn();
        element.addEventListener("hotkey-fire", fired);
        element.addEventListener("click", clicked);

        press({ key: "B", shiftKey: true });

        expect(fired).toHaveBeenCalledTimes(1);
        expect(clicked).not.toHaveBeenCalled();
    });

    it("leaves a key typed into a field to the field", () => {
        setHTML(`
            <button id="one" data-hotkey="b">One</button>
            <textarea id="area"></textarea>
        `);

        const clicked = vi.fn();
        document.getElementById("one")?.addEventListener("click", clicked);

        press({ key: "b" }, document.getElementById("area") as HTMLElement);

        expect(clicked).not.toHaveBeenCalled();
    });

    it("answers a key typed into the field the hotkey was scoped to", () => {
        setHTML(`
            <button id="one" data-hotkey="Meta+d" data-hotkey-scope="area">One</button>
            <textarea id="area"></textarea>
        `);

        const clicked = vi.fn();
        document.getElementById("one")?.addEventListener("click", clicked);

        press({ key: "d", metaKey: true }, document.getElementById("area") as HTMLElement);

        expect(clicked).toHaveBeenCalledTimes(1);
    });

    it("says nothing more once the element has been taken back off its hotkey", () => {
        setHTML('<button id="one" data-hotkey="b">One</button>');
        const element = document.getElementById("one") as HTMLElement;
        const clicked = vi.fn();
        element.addEventListener("click", clicked);

        uninstall(element);
        installed.splice(0);

        press({ key: "b" });

        expect(clicked).not.toHaveBeenCalled();
    });
});
