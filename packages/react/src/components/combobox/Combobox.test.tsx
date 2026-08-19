import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Combobox } from ".";
import type { ComboboxProps } from "./Combobox.types";

const originalResizeObserver = window.ResizeObserver;

type Choice = {
    value: string;
    label: string;
    disabled?: boolean;
};

const fruit: Choice[] = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "mango", label: "Mango" },
];

const items = (choices: Choice[]) =>
    choices.map((choice) => (
        <Combobox.Item key={choice.value} value={choice.value} disabled={choice.disabled}>
            <Combobox.ItemText>{choice.label}</Combobox.ItemText>
            <Combobox.ItemIndicator />
        </Combobox.Item>
    ));

const combobox = (props: Partial<ComboboxProps> = {}, choices: Choice[] = fruit) => (
    <Combobox {...props}>
        <Combobox.Label>Fruit</Combobox.Label>
        <Combobox.Control>
            <Combobox.Input />
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
        </Combobox.Control>
        <Combobox.Positioner>
            <Combobox.Content>
                <Combobox.List>{items(choices)}</Combobox.List>
                <Combobox.Empty />
            </Combobox.Content>
        </Combobox.Positioner>
    </Combobox>
);

const renderCombobox = (props: Partial<ComboboxProps> = {}, choices: Choice[] = fruit) =>
    render(combobox(props, choices));

const field = () => screen.getByRole("combobox") as HTMLInputElement;

const trigger = () => screen.getByRole("button", { name: "Show suggestions" });

const clearTrigger = () => screen.queryByRole("button", { name: "Clear" });

const list = () => screen.queryByRole("listbox");

const options = () => screen.queryAllByRole("option");

// What the reader sees, in the order they see it. An item narrowed away is left on the page
// with nothing drawn, so that it is still there to be counted
const shown = () =>
    options()
        .filter((option) => !option.className.includes("hidden"))
        .map((option) => option.getAttribute("data-value"));

const inHand = () =>
    options()
        .find((option) => option.getAttribute("data-highlighted") === "true")
        ?.getAttribute("data-value");

const part = (name: string) => document.querySelector(`[data-component='Combobox.${name}']`);

const type = (text: string) => fireEvent.change(field(), { target: { value: text } });

const press = (key: string, init: object = {}) => fireEvent.keyDown(field(), { key, ...init });

const open = () => {
    fireEvent.click(trigger());
};

describe("Combobox", () => {
    // jsdom has no ResizeObserver, and the list watches its own size so it can be placed
    // again as it grows
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;
    });

    it("tags the root element with a data-component attribute", () => {
        const { container } = renderCombobox();
        expect(container.firstChild).toHaveAttribute("data-component", "Combobox");
    });

    it("tags each of its parts with a data-component attribute", () => {
        renderCombobox();
        open();

        for (const name of [
            "Label",
            "Control",
            "Input",
            "Trigger",
            "Positioner",
            "Content",
            "List",
            "Item",
            "ItemText",
            "ItemIndicator",
        ]) {
            expect(part(name)).toBeInTheDocument();
        }
    });

    it("reads the field as a combo box controlling the list", () => {
        renderCombobox();
        open();

        expect(field().tagName).toBe("INPUT");
        expect(field()).toHaveAttribute("aria-expanded", "true");
        expect(field()).toHaveAttribute("aria-autocomplete", "list");
        expect(field()).toHaveAttribute("aria-controls", list()?.id);
    });

    it("names the field from the label standing over it", () => {
        renderCombobox();
        expect(field()).toHaveAccessibleName("Fruit");
    });

    it("keeps the list down until it is opened", () => {
        renderCombobox();

        expect(list()).toBeNull();
        expect(field()).toHaveAttribute("aria-expanded", "false");
        expect(field()).not.toHaveAttribute("aria-controls");
    });

    it("opens the list as soon as something is typed", () => {
        renderCombobox();
        type("a");

        expect(list()).toBeInTheDocument();
    });

    it("leaves the list down while something is typed where it was told to", () => {
        renderCombobox({ openOnChange: false });
        type("a");

        expect(list()).toBeNull();
    });

    it("narrows the list to what was typed", () => {
        renderCombobox();
        type("an");

        expect(shown()).toEqual(["banana", "mango"]);
    });

    it("matches the way the locale reads both sides rather than by code points", () => {
        renderCombobox({}, [{ value: "cafe", label: "Café" }]);
        type("cafe");

        expect(shown()).toEqual(["cafe"]);
    });

    it("takes a filter of the caller's own in place of its own", () => {
        renderCombobox({ filter: (label, inputValue) => label.startsWith(inputValue) });
        type("C");

        expect(shown()).toEqual(["cherry"]);
    });

    it("leaves the items alone where the caller is narrowing them elsewhere", () => {
        renderCombobox({ shouldFilter: false });
        type("zzz");

        expect(shown()).toEqual(["apple", "banana", "cherry", "mango"]);
    });

    it("says so once what was typed has left nothing to show", () => {
        renderCombobox();
        type("zzz");

        expect(shown()).toEqual([]);
        expect(part("Empty")).toBeInTheDocument();
    });

    it("offers everything again when the list is opened from the button", () => {
        renderCombobox();
        type("an");
        expect(shown()).toEqual(["banana", "mango"]);

        // The first press takes the list down, since typing had already brought it up
        open();
        open();

        expect(field().value).toBe("an");
        expect(shown()).toEqual(["apple", "banana", "cherry", "mango"]);
    });

    it("opens the list when the field is clicked where it was told to", () => {
        renderCombobox({ openOnClick: true });
        fireEvent.click(field());

        expect(list()).toBeInTheDocument();
    });

    describe("picking", () => {
        it("takes an item that is pressed and puts its name in the field", () => {
            const onValueChange = vi.fn();
            renderCombobox({ onValueChange });
            open();

            fireEvent.click(screen.getByText("Banana"));

            expect(onValueChange).toHaveBeenCalledWith(["banana"]);
            expect(field().value).toBe("Banana");
            expect(list()).toBeNull();
        });

        it("says which item is being held", () => {
            renderCombobox({ defaultValue: ["cherry"] });
            open();

            const cherry = options().find((option) => option.dataset.value === "cherry");

            expect(cherry).toHaveAttribute("aria-selected", "true");
            expect(cherry).toHaveAttribute("data-selected", "true");
        });

        it("keeps the list standing and empties the field where it holds several", () => {
            const onValueChange = vi.fn();
            renderCombobox({ multiple: true, onValueChange });
            open();

            fireEvent.click(screen.getByText("Apple"));
            expect(onValueChange).toHaveBeenLastCalledWith(["apple"]);
            expect(list()).toBeInTheDocument();
            expect(field().value).toBe("");

            fireEvent.click(screen.getByText("Cherry"));
            expect(onValueChange).toHaveBeenLastCalledWith(["apple", "cherry"]);
        });

        it("takes an item it is already holding back off again where it holds several", () => {
            const onValueChange = vi.fn();
            renderCombobox({ multiple: true, defaultValue: ["apple"], onValueChange });
            open();

            fireEvent.click(screen.getByText("Apple"));

            expect(onValueChange).toHaveBeenCalledWith([]);
        });

        it("leaves what was typed as it stands where it was told to", () => {
            renderCombobox({ selectionBehavior: "preserve" });
            type("an");
            fireEvent.click(screen.getByText("Banana"));

            expect(field().value).toBe("an");
        });

        it("follows the caller, who holds what is picked", () => {
            const { rerender } = render(combobox({ value: [], open: true }));

            const apple = () => options().find((option) => option.dataset.value === "apple");
            expect(apple()).toHaveAttribute("aria-selected", "false");

            rerender(combobox({ value: ["apple"], open: true }));
            expect(apple()).toHaveAttribute("aria-selected", "true");
        });

        it("says what was picked, whether or not it was already held", () => {
            const onSelect = vi.fn();
            renderCombobox({ multiple: true, defaultValue: ["apple"], onSelect });
            open();

            fireEvent.click(screen.getByText("Apple"));

            expect(onSelect).toHaveBeenCalledWith("apple");
        });

        it("leaves an item alone that cannot be picked", () => {
            const onValueChange = vi.fn();
            renderCombobox({ onValueChange }, [
                { value: "apple", label: "Apple" },
                { value: "banana", label: "Banana", disabled: true },
            ]);
            open();

            const banana = options().find((option) => option.dataset.value === "banana");
            expect(banana).toHaveAttribute("aria-disabled", "true");

            fireEvent.click(screen.getByText("Banana"));
            expect(onValueChange).not.toHaveBeenCalled();
        });
    });

    describe("the keyboard", () => {
        it("opens the list from the arrow keys and lands on the first item", () => {
            renderCombobox();
            press("ArrowDown");

            expect(list()).toBeInTheDocument();
            expect(inHand()).toBe("apple");
        });

        it("opens it at the far end when it is reached for upwards", () => {
            renderCombobox();
            press("ArrowUp");

            expect(inHand()).toBe("mango");
        });

        it("opens it on whatever is already held", () => {
            renderCombobox({ defaultValue: ["cherry"] });
            press("ArrowDown");

            expect(inHand()).toBe("cherry");
        });

        it("steps down the list and points the field at what is in hand", () => {
            renderCombobox();
            press("ArrowDown");
            press("ArrowDown");

            expect(inHand()).toBe("banana");

            const banana = options().find((option) => option.dataset.value === "banana");
            expect(field()).toHaveAttribute("aria-activedescendant", banana?.id);
        });

        it("steps over an item that cannot be picked", () => {
            renderCombobox({}, [
                { value: "apple", label: "Apple" },
                { value: "banana", label: "Banana", disabled: true },
                { value: "cherry", label: "Cherry" },
            ]);
            press("ArrowDown");
            press("ArrowDown");

            expect(inHand()).toBe("cherry");
        });

        it("holds at either end unless it was told to come round", () => {
            renderCombobox();
            press("ArrowUp");
            press("ArrowDown");

            expect(inHand()).toBe("mango");
        });

        it("comes round at either end where it was told to", () => {
            renderCombobox({ loopFocus: true });
            press("ArrowUp");
            press("ArrowDown");

            expect(inHand()).toBe("apple");
        });

        it("takes what is in hand on Enter", () => {
            const onValueChange = vi.fn();
            renderCombobox({ onValueChange });
            press("ArrowDown");
            press("Enter");

            expect(onValueChange).toHaveBeenCalledWith(["apple"]);
            expect(field().value).toBe("Apple");
        });

        it("leaves Enter alone where nothing is in hand", () => {
            const onValueChange = vi.fn();
            renderCombobox({ onValueChange });
            open();
            press("Enter");

            expect(onValueChange).not.toHaveBeenCalled();
        });

        it("takes the list down on Escape, and empties the field on a second press", () => {
            renderCombobox();
            type("an");
            expect(list()).toBeInTheDocument();

            press("Escape");
            expect(list()).toBeNull();
            expect(field().value).toBe("an");

            press("Escape");
            expect(field().value).toBe("");
        });

        it("takes the list down on Tab, leaving what is held as it was", () => {
            const onValueChange = vi.fn();
            renderCombobox({ onValueChange });
            press("ArrowDown");
            press("Tab");

            expect(list()).toBeNull();
            expect(onValueChange).not.toHaveBeenCalled();
        });

        it("takes a standing list down on Alt and the up arrow", () => {
            renderCombobox();
            press("ArrowDown");
            press("ArrowUp", { altKey: true });

            expect(list()).toBeNull();
        });
    });

    describe("the pointer", () => {
        it("takes into hand whatever it is moved over", () => {
            renderCombobox();
            open();

            fireEvent.pointerMove(screen.getByText("Cherry"));

            expect(inHand()).toBe("cherry");
        });
    });

    describe("clearing", () => {
        it("stands down while there is nothing to clear", () => {
            renderCombobox();
            expect(clearTrigger()).toBeNull();
        });

        it("empties the field and gives back what was held", () => {
            const onValueChange = vi.fn();
            renderCombobox({ defaultValue: ["apple"], defaultInputValue: "Apple", onValueChange });

            fireEvent.click(clearTrigger() as HTMLElement);

            expect(onValueChange).toHaveBeenCalledWith([]);
            expect(field().value).toBe("");
        });
    });

    describe("answering what is typed", () => {
        it("leaves nothing in hand unless it was asked to", () => {
            renderCombobox();
            type("an");

            expect(inHand()).toBeUndefined();
        });

        it("takes the first answer in hand as it is typed", () => {
            renderCombobox({ inputBehavior: "autohighlight" });
            type("an");

            expect(inHand()).toBe("banana");
        });

        it("writes that answer into the field behind the caret", () => {
            renderCombobox({ inputBehavior: "autocomplete" });
            type("ba");

            expect(field().value).toBe("Banana");
            expect(field()).toHaveAttribute("aria-autocomplete", "both");
        });

        it("does not put a completion back once it has been rubbed out", () => {
            renderCombobox({ inputBehavior: "autocomplete" });
            type("ba");
            expect(field().value).toBe("Banana");

            press("Backspace");
            type("b");

            expect(field().value).toBe("b");
        });

        it("leaves a name that does not carry on from what was typed alone", () => {
            renderCombobox({ inputBehavior: "autocomplete" });
            type("an");

            expect(field().value).toBe("an");
        });
    });

    describe("going elsewhere", () => {
        it("takes the list down once focus has left the combobox", () => {
            renderCombobox();
            open();

            fireEvent.blur(field());

            expect(list()).toBeNull();
        });

        it("puts what was typed back to what is held", () => {
            renderCombobox();
            open();
            fireEvent.click(screen.getByText("Apple"));

            type("zzz");
            fireEvent.blur(field());

            expect(field().value).toBe("Apple");
        });

        it("keeps a name that is nobody's where the caller allows one", () => {
            renderCombobox({ allowCustomValue: true });
            type("zzz");
            fireEvent.blur(field());

            expect(field().value).toBe("zzz");
        });
    });

    describe("groups", () => {
        const grouped = (
            <Combobox>
                <Combobox.Label>Fruit</Combobox.Label>
                <Combobox.Control>
                    <Combobox.Input />
                </Combobox.Control>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <Combobox.List>
                            <Combobox.ItemGroup>
                                <Combobox.ItemGroupLabel>Soft</Combobox.ItemGroupLabel>
                                {items([{ value: "banana", label: "Banana" }])}
                            </Combobox.ItemGroup>
                            <Combobox.ItemGroup>
                                <Combobox.ItemGroupLabel>Crisp</Combobox.ItemGroupLabel>
                                {items([{ value: "apple", label: "Apple" }])}
                            </Combobox.ItemGroup>
                        </Combobox.List>
                    </Combobox.Content>
                </Combobox.Positioner>
            </Combobox>
        );

        it("names each run of items", () => {
            render(grouped);
            type("a");

            const groups = screen.getAllByRole("group");
            expect(groups).toHaveLength(2);
            expect(groups[0]).toHaveAccessibleName("Soft");
            expect(groups[1]).toHaveAccessibleName("Crisp");
        });

        it("stands a group down once it has nothing left to head", () => {
            render(grouped);
            type("ban");

            const groups = screen.getAllByRole("group", { hidden: true });
            expect(groups[0]).not.toHaveClass("hidden");
            expect(groups[1]).toHaveClass("hidden");
        });
    });

    describe("the state of the field", () => {
        it("stops a switched off combobox being used", () => {
            renderCombobox({ disabled: true });

            expect(field()).toBeDisabled();
            expect(trigger()).toBeDisabled();
        });

        it("shows what is held without letting it be changed", () => {
            const onValueChange = vi.fn();
            renderCombobox({ readOnly: true, onValueChange });

            expect(field()).toHaveAttribute("readonly");

            // There is nothing wrong with looking at what is there, so the list still opens
            open();
            expect(list()).toBeInTheDocument();

            fireEvent.click(screen.getByText("Apple"));
            expect(onValueChange).not.toHaveBeenCalled();
        });

        it("marks the field invalid", () => {
            renderCombobox({ invalid: true });
            expect(field()).toHaveAttribute("aria-invalid", "true");
        });

        it("says a choice has to be made", () => {
            renderCombobox({ required: true });
            expect(field()).toBeRequired();
        });
    });

    describe("reporting", () => {
        it("says what stands in the field", () => {
            const onInputValueChange = vi.fn();
            renderCombobox({ onInputValueChange });
            type("an");

            expect(onInputValueChange).toHaveBeenCalledWith("an");
        });

        it("says whether the list is standing", () => {
            const onOpenChange = vi.fn();
            renderCombobox({ onOpenChange });

            open();
            expect(onOpenChange).toHaveBeenLastCalledWith(true);

            open();
            expect(onOpenChange).toHaveBeenLastCalledWith(false);
        });

        it("says what is in hand as the list narrows around it", () => {
            const onHighlightChange = vi.fn();
            renderCombobox({ onHighlightChange });

            press("ArrowDown");
            expect(onHighlightChange).toHaveBeenLastCalledWith("apple");

            type("man");
            expect(onHighlightChange).toHaveBeenLastCalledWith(null);
        });
    });

    it("submits what is held through fields of its own", () => {
        const { container } = renderCombobox({ name: "fruit", defaultValue: ["apple"] });

        const hidden = container.querySelector('input[type="hidden"]');

        expect(hidden).toHaveAttribute("name", "fruit");
        expect(hidden).toHaveValue("apple");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        const { container } = render(<Combobox ref={ref}>{null}</Combobox>);

        expect(ref.current).toBe(container.firstChild);
    });

    it("merges a custom className onto each part", () => {
        render(
            <Combobox className="root" open>
                <Combobox.Label className="label">Fruit</Combobox.Label>
                <Combobox.Control className="control">
                    <Combobox.Input className="input" />
                    <Combobox.Trigger className="trigger" />
                </Combobox.Control>
                <Combobox.Positioner className="positioner">
                    <Combobox.Content className="content">
                        <Combobox.List className="list">
                            <Combobox.Item className="item" value="apple">
                                <Combobox.ItemText className="text">Apple</Combobox.ItemText>
                                <Combobox.ItemIndicator className="indicator" />
                            </Combobox.Item>
                        </Combobox.List>
                    </Combobox.Content>
                </Combobox.Positioner>
            </Combobox>,
        );

        // The field's own class goes on the control the text input draws around the typing
        // area, since that is the part the combobox lays out
        expect(part("Input")?.closest(".combobox-input")).toHaveClass("input");

        for (const [name, className] of [
            ["Label", "label"],
            ["Control", "control"],
            ["Trigger", "trigger"],
            ["Positioner", "positioner"],
            ["Content", "content"],
            ["List", "list"],
            ["Item", "item"],
            ["ItemText", "text"],
            ["ItemIndicator", "indicator"],
        ]) {
            expect(part(name)).toHaveClass(className);
        }
    });
});
