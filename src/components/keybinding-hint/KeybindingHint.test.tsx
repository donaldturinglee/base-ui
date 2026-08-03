import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { KeybindingHint, PlatformContext, getAccessibleKeybindingHintString } from ".";
import type { KeybindingHintVariant, Platform } from "./KeybindingHint.types";

// The platform is stood in for throughout, so that what the keys are named never turns on the
// machine the tests are running on
const renderHint = (ui: React.ReactElement, platform: Platform = "other") =>
    render(<PlatformContext.Provider value={platform}>{ui}</PlatformContext.Provider>);

const hint = () => screen.getByTestId("hint");

const chords = () =>
    Array.from(hint().querySelectorAll<HTMLElement>("[data-component='KeybindingHint.Chord']"));

// What is drawn, which is everything the reading is not
const drawnText = () =>
    Array.from(hint().querySelectorAll<HTMLElement>("[aria-hidden='true']"))
        .map((element) => element.textContent)
        .join("");

describe("KeybindingHint", () => {
    it("renders a kbd element", () => {
        renderHint(<KeybindingHint keys="Control" data-testid="hint" />);
        expect(hint().tagName).toBe("KBD");
    });

    it("tags the elements with data-component attributes", () => {
        renderHint(<KeybindingHint keys="Control" data-testid="hint" />);
        expect(hint()).toHaveAttribute("data-component", "KeybindingHint");
        expect(chords()).toHaveLength(1);
        expect(chords()[0]).toHaveAttribute("data-component", "KeybindingHint.Chord");
    });

    it("strips the kbd element back to the text it stands in", () => {
        // The box is the chord's to draw, and a key of a key would be one too many
        renderHint(<KeybindingHint keys="Control" data-testid="hint" />);
        expect(hint()).toHaveClass("p-0");
        expect(hint()).toHaveClass("border-0");
        expect(hint()).toHaveClass("bg-transparent");
        expect(hint()).toHaveClass("[font-family:inherit]");
    });

    it("draws the keys as they are printed on a keyboard by default", () => {
        renderHint(<KeybindingHint keys="Shift+Control+Function+PageUp" data-testid="hint" />);

        for (const symbol of ["⇧", "⌃", "Fn", "PgUp"]) {
            const key = screen.getByText(symbol);
            expect(key).toBeVisible();
            expect(key).toHaveAttribute("aria-hidden");
        }
    });

    it("reads out a name for every key it draws", () => {
        renderHint(<KeybindingHint keys="Control+Shift+{" data-testid="hint" />);

        for (const name of ["control", "shift", "left curly brace"]) {
            const key = screen.getByText(name);
            expect(key).toBeInTheDocument();
            expect(key).not.toHaveAttribute("aria-hidden");
        }
    });

    it("writes the keys out in full where it is asked to", () => {
        renderHint(
            <KeybindingHint
                keys="Shift+Control+Function+ArrowUp"
                format="full"
                data-testid="hint"
            />,
        );

        for (const name of ["Shift", "Control", "Function", "Up Arrow"]) {
            const key = screen.getByText(name);
            expect(key).toBeVisible();
            expect(key).toHaveAttribute("aria-hidden");
        }
    });

    it("puts the modifiers in the order they are always shown in", () => {
        renderHint(
            <KeybindingHint
                keys="Shift+Control+PageUp+Function"
                format="full"
                data-testid="hint"
            />,
        );

        const namesInOrder = ["Control", "Shift", "Function", "Page Up"];
        const names = screen
            .getAllByText((text) => namesInOrder.includes(text))
            .map((element) => element.textContent);

        expect(names).toEqual(namesInOrder);
    });

    it("capitalises a key that has no name of its own", () => {
        renderHint(<KeybindingHint keys="control+a" data-testid="hint" />);
        expect(drawnText()).toBe("⌃A");
    });

    it("draws Plus and Space as the keys they stand for", () => {
        // Both are named rather than typed, so that "+" and " " can go on separating the keys
        // of a chord and the chords of a sequence
        const symbols = {
            Plus: "+",
            Space: "␣",
        } as const;

        for (const [name, symbol] of Object.entries(symbols)) {
            const { unmount } = renderHint(<KeybindingHint keys={name} data-testid="hint" />);
            expect(drawnText()).toBe(symbol);
            unmount();
        }
    });

    it("writes Plus and Space out by name in full format", () => {
        for (const name of ["Plus", "Space"]) {
            const { unmount } = renderHint(
                <KeybindingHint keys={name} format="full" data-testid="hint" />,
            );
            expect(drawnText()).toBe(name);
            unmount();
        }
    });

    it("leaves the plus signs out of a condensed chord", () => {
        renderHint(<KeybindingHint keys="control+b" data-testid="hint" />);
        expect(screen.queryByText("+")).not.toBeInTheDocument();
    });

    it("draws plus signs between the keys of a full chord", () => {
        renderHint(<KeybindingHint keys="control+b" format="full" data-testid="hint" />);

        const plus = screen.getByText("+");
        expect(plus).toBeVisible();
        // Reading a plus sign out between every key would say less than it costs to hear
        expect(plus).toHaveAttribute("aria-hidden");
    });

    it("holds the chords of a sequence apart with a spoken then", () => {
        renderHint(<KeybindingHint keys="Control+a b" format="full" data-testid="hint" />);

        expect(chords()).toHaveLength(2);

        const then = screen.getByText("then");
        expect(then).toBeInTheDocument();
        expect(then).not.toHaveAttribute("aria-hidden");
    });

    it("names a key as an Apple platform names it", () => {
        renderHint(<KeybindingHint keys="Mod" data-testid="hint" />, "apple");
        expect(drawnText()).toBe("⌘");
    });

    it("names a key as Windows names it", () => {
        renderHint(<KeybindingHint keys="Meta" format="full" data-testid="hint" />, "windows");
        expect(drawnText()).toBe("Windows");
    });

    it("falls back to the name a key carries everywhere else", () => {
        renderHint(<KeybindingHint keys="Meta" format="full" data-testid="hint" />);
        expect(drawnText()).toBe("Meta");
    });

    it("falls back to a condensed hint at its normal size", () => {
        renderHint(<KeybindingHint keys="Control" data-testid="hint" />);
        expect(hint()).toHaveAttribute("data-format", "condensed");
        expect(hint()).toHaveAttribute("data-variant", "normal");
        expect(hint()).toHaveAttribute("data-size", "normal");
        expect(chords()[0]).toHaveClass("text-foreground-muted");
        expect(chords()[0]).toHaveClass("min-w-[var(--base-size-20)]");
    });

    it("respects the variant prop", () => {
        const variants = {
            normal: "text-foreground-muted",
            onEmphasis: "bg-[var(--counter-background-color-emphasis)]",
            onPrimary: "bg-[var(--button-primary-background-color-active)]",
        } as const;

        for (const [variant, expected] of Object.entries(variants)) {
            const { unmount } = renderHint(
                <KeybindingHint
                    keys="Control"
                    variant={variant as KeybindingHintVariant}
                    data-testid="hint"
                />,
            );
            expect(hint()).toHaveAttribute("data-variant", variant);
            expect(chords()[0]).toHaveClass(expected);
            unmount();
        }
    });

    it("draws the keys smaller where it is asked to", () => {
        renderHint(<KeybindingHint keys="Control" size="small" data-testid="hint" />);
        expect(hint()).toHaveAttribute("data-size", "small");
        expect(chords()[0]).toHaveClass("[font-size:11px]");
        expect(chords()[0]).toHaveClass("min-w-[var(--base-size-16)]");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLElement>();
        renderHint(<KeybindingHint ref={ref} keys="Control" data-testid="hint" />);
        expect(ref.current).toBe(hint());
    });

    it("merges a custom className onto the root element", () => {
        renderHint(<KeybindingHint keys="Control" className="custom" data-testid="hint" />);
        expect(hint()).toHaveClass("custom");
    });

    it("passes extra props onto the root element", () => {
        renderHint(<KeybindingHint keys="Control" aria-label="Shortcut" data-testid="hint" />);
        expect(hint()).toHaveAttribute("aria-label", "Shortcut");
    });
});

describe("getAccessibleKeybindingHintString", () => {
    it("gives a key the name it is read out by", () => {
        expect(getAccessibleKeybindingHintString("{", "other")).toBe("left curly brace");
    });

    it("holds the keys of a chord apart with a space", () => {
        expect(getAccessibleKeybindingHintString("Command+U", "other")).toBe("command u");
    });

    it("puts the modifiers in the order they are always read in", () => {
        expect(getAccessibleKeybindingHintString("Alt+Shift+Command+%", "other")).toBe(
            "alt shift command percent",
        );
    });

    it("holds the chords of a sequence apart with then", () => {
        expect(getAccessibleKeybindingHintString("Alt+9 x y", "other")).toBe("alt 9 then x then y");
    });

    it("reads Mod as Command on an Apple platform and Control everywhere else", () => {
        expect(getAccessibleKeybindingHintString("Mod+x", "apple")).toBe("command x");
        expect(getAccessibleKeybindingHintString("Mod+x", "windows")).toBe("control x");
        expect(getAccessibleKeybindingHintString("Mod+x", "other")).toBe("control x");
    });

    it("reads Meta as the platform names it", () => {
        expect(getAccessibleKeybindingHintString("Meta+x", "apple")).toBe("command x");
        expect(getAccessibleKeybindingHintString("Meta+x", "windows")).toBe("Windows x");
        expect(getAccessibleKeybindingHintString("Meta+x", "other")).toBe("meta x");
    });

    it("reads Alt as Option on an Apple platform and Alt everywhere else", () => {
        expect(getAccessibleKeybindingHintString("Alt+x", "apple")).toBe("option x");
        expect(getAccessibleKeybindingHintString("Alt+x", "windows")).toBe("alt x");
        expect(getAccessibleKeybindingHintString("Alt+x", "other")).toBe("alt x");
    });
});
