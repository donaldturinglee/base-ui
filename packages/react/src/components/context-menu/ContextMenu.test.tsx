import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { ContextMenu } from ".";
import type { ContextMenuProps } from "./ContextMenu.types";

const originalResizeObserver = window.ResizeObserver;

const labels = ["Cut", "Copy", "Paste"];

const renderMenu = (props: Partial<ContextMenuProps> = {}) =>
    render(
        <ContextMenu {...props}>
            <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
            <ContextMenu.Positioner>
                <ContextMenu.Content>
                    {labels.map((label) => (
                        <ContextMenu.Item key={label} value={label.toLowerCase()}>
                            {label}
                        </ContextMenu.Item>
                    ))}
                </ContextMenu.Content>
            </ContextMenu.Positioner>
        </ContextMenu>,
    );

const trigger = () => screen.getByText("Right click here");

const menu = () => screen.queryByRole("menu");

const item = (name: string) => screen.getByRole("menuitem", { name });

const positioner = () => screen.getByRole("menu").parentElement as HTMLElement;

const highlighted = () =>
    screen
        .getAllByRole("menuitem")
        .filter((one) => one.hasAttribute("data-highlighted"))
        .map((one) => one.textContent);

// jsdom has no pointer events of its own, so one is made from a plain event and given what a
// pointer would have said
const pointerEvent = (type: string, init: Record<string, unknown>) => {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.assign(event, init);
    return event;
};

const openMenu = () => fireEvent.contextMenu(trigger(), { clientX: 40, clientY: 60 });

const touch = (init: Record<string, unknown>) =>
    pointerEvent("pointerdown", {
        pointerType: "touch",
        isPrimary: true,
        button: 0,
        clientX: 10,
        clientY: 20,
        ...init,
    });

describe("ContextMenu", () => {
    // jsdom has no ResizeObserver, and the frame the menu is placed in watches its own size so
    // it can be placed again as it grows
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

    it("renders the area that opens it, and nothing else to start with", () => {
        renderMenu();

        expect(trigger()).toHaveAttribute("data-component", "ContextMenu.Trigger");
        expect(trigger()).toHaveAttribute("data-state", "closed");
        expect(menu()).not.toBeInTheDocument();
    });

    it("opens where it was pressed, in place of the menu the browser would have shown", () => {
        renderMenu();

        // A press the menu answers is one the browser is kept from answering
        expect(openMenu()).toBe(false);

        expect(menu()).toBeInTheDocument();
        expect(trigger()).toHaveAttribute("data-state", "open");
        expect(positioner()).toHaveAttribute("data-component", "ContextMenu.Positioner");
        expect(positioner().style.getPropertyValue("--context-menu-top")).toBe("60px");
        expect(positioner().style.getPropertyValue("--context-menu-left")).toBe("40px");
        expect(positioner()).toHaveAttribute("data-side", "outside-bottom");
    });

    it("stands over the page rather than inside the area it was opened from", () => {
        renderMenu();
        openMenu();

        expect(trigger()).not.toContainElement(menu());
        expect(positioner().closest("[data-component='Portal']")).not.toBeNull();
    });

    it("leaves the press to the browser where it has been turned off", () => {
        renderMenu({ disabled: true });

        expect(openMenu()).toBe(true);
        expect(menu()).not.toBeInTheDocument();
    });

    it("is named after the area it was opened from", () => {
        renderMenu();
        openMenu();

        expect(menu()).toHaveAttribute("aria-labelledby", trigger().id);
    });

    it("is named by the caller where they name it", () => {
        render(
            <ContextMenu>
                <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                <ContextMenu.Positioner>
                    <ContextMenu.Content aria-label="Row actions">
                        <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Positioner>
            </ContextMenu>,
        );
        openMenu();

        expect(screen.getByRole("menu", { name: "Row actions" })).not.toHaveAttribute(
            "aria-labelledby",
        );
    });

    it("reads its items as menu items", () => {
        renderMenu();
        openMenu();

        expect(screen.getAllByRole("menuitem").map((one) => one.textContent)).toEqual(labels);
        expect(item("Cut")).toHaveAttribute("data-value", "cut");
    });

    it("moves focus into the menu as it opens, on none of the items", () => {
        renderMenu();
        openMenu();

        expect(menu()).toHaveFocus();
        expect(highlighted()).toEqual([]);
    });

    describe("picking an item", () => {
        it("closes the menu, and says which item it was", () => {
            const onSelect = vi.fn();
            const onItemSelect = vi.fn();
            render(
                <ContextMenu onSelect={onSelect}>
                    <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                    <ContextMenu.Positioner>
                        <ContextMenu.Content>
                            <ContextMenu.Item value="cut" onSelect={onItemSelect}>
                                Cut
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Positioner>
                </ContextMenu>,
            );
            openMenu();

            fireEvent.click(item("Cut"));

            expect(onItemSelect).toHaveBeenCalledTimes(1);
            expect(onSelect).toHaveBeenCalledWith("cut");
            expect(menu()).not.toBeInTheDocument();
        });

        it("leaves the menu standing where the menu says so", () => {
            renderMenu({ closeOnSelect: false });
            openMenu();

            fireEvent.click(item("Cut"));

            expect(menu()).toBeInTheDocument();
        });

        it("leaves the menu standing where the item says so", () => {
            render(
                <ContextMenu>
                    <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                    <ContextMenu.Positioner>
                        <ContextMenu.Content>
                            <ContextMenu.Item value="cut" closeOnSelect={false}>
                                Cut
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Positioner>
                </ContextMenu>,
            );
            openMenu();

            fireEvent.click(item("Cut"));

            expect(menu()).toBeInTheDocument();
        });

        it("never picks an item that cannot be used", () => {
            const onSelect = vi.fn();
            render(
                <ContextMenu onSelect={onSelect}>
                    <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                    <ContextMenu.Positioner>
                        <ContextMenu.Content>
                            <ContextMenu.Item value="cut" disabled>
                                Cut
                            </ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Positioner>
                </ContextMenu>,
            );
            openMenu();

            expect(item("Cut")).toHaveAttribute("aria-disabled", "true");
            expect(item("Cut")).toHaveAttribute("data-disabled");

            fireEvent.click(item("Cut"));

            expect(onSelect).not.toHaveBeenCalled();
            expect(menu()).toBeInTheDocument();
        });
    });

    describe("dismissing the menu", () => {
        it("closes on Escape, and hands focus back to the area it was opened from", () => {
            renderMenu();
            openMenu();

            fireEvent.keyDown(document, { key: "Escape" });

            expect(menu()).not.toBeInTheDocument();
            expect(trigger()).toHaveFocus();
        });

        it("closes on a press that lands anywhere else", () => {
            renderMenu();
            openMenu();

            fireEvent(document.body, pointerEvent("pointerdown", { button: 0 }));

            expect(menu()).not.toBeInTheDocument();
        });

        it("stays open for a press that lands on it", () => {
            renderMenu();
            openMenu();

            fireEvent(item("Copy"), pointerEvent("pointerdown", { button: 0 }));

            expect(menu()).toBeInTheDocument();
        });

        it("moves rather than closes for a right click on the area it was opened from", () => {
            renderMenu();
            openMenu();

            fireEvent(trigger(), pointerEvent("pointerdown", { button: 2 }));
            expect(menu()).toBeInTheDocument();

            fireEvent.contextMenu(trigger(), { clientX: 100, clientY: 120 });

            expect(screen.getAllByRole("menu")).toHaveLength(1);
            expect(positioner().style.getPropertyValue("--context-menu-top")).toBe("120px");
            expect(positioner().style.getPropertyValue("--context-menu-left")).toBe("100px");
        });

        it("closes when the reader tabs away, and hands focus back", () => {
            renderMenu();
            openMenu();

            fireEvent.keyDown(screen.getByRole("menu"), { key: "Tab" });

            expect(menu()).not.toBeInTheDocument();
            expect(trigger()).toHaveFocus();
        });
    });

    describe("reading the menu by key", () => {
        const press = (key: string) => fireEvent.keyDown(screen.getByRole("menu"), { key });

        it("walks the items with the arrow keys, and focus follows", () => {
            renderMenu();
            openMenu();

            press("ArrowDown");
            expect(highlighted()).toEqual(["Cut"]);
            expect(item("Cut")).toHaveFocus();

            press("ArrowDown");
            expect(highlighted()).toEqual(["Copy"]);
            expect(item("Copy")).toHaveFocus();

            press("ArrowUp");
            expect(highlighted()).toEqual(["Cut"]);
        });

        it("goes to the first and the last item on Home and End", () => {
            renderMenu();
            openMenu();

            press("End");
            expect(highlighted()).toEqual(["Paste"]);

            press("Home");
            expect(highlighted()).toEqual(["Cut"]);
        });

        it("stops at either end", () => {
            renderMenu();
            openMenu();

            press("End");
            press("ArrowDown");
            expect(highlighted()).toEqual(["Paste"]);

            press("Home");
            press("ArrowUp");
            expect(highlighted()).toEqual(["Cut"]);
        });

        it("comes round at either end where it is told to", () => {
            renderMenu({ loopFocus: true });
            openMenu();

            press("End");
            press("ArrowDown");
            expect(highlighted()).toEqual(["Cut"]);

            press("ArrowUp");
            expect(highlighted()).toEqual(["Paste"]);
        });

        it("passes over an item that cannot be used", () => {
            render(
                <ContextMenu>
                    <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                    <ContextMenu.Positioner>
                        <ContextMenu.Content>
                            <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                            <ContextMenu.Item value="copy" disabled>
                                Copy
                            </ContextMenu.Item>
                            <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
                        </ContextMenu.Content>
                    </ContextMenu.Positioner>
                </ContextMenu>,
            );
            openMenu();

            press("ArrowDown");
            press("ArrowDown");

            expect(highlighted()).toEqual(["Paste"]);
        });

        it("picks the item the reader is on with Enter", () => {
            const onSelect = vi.fn();
            renderMenu({ onSelect });
            openMenu();

            press("ArrowDown");
            press("ArrowDown");
            press("Enter");

            expect(onSelect).toHaveBeenCalledWith("copy");
            expect(menu()).not.toBeInTheDocument();
        });

        describe("typing", () => {
            beforeEach(() => {
                vi.useFakeTimers();
            });

            afterEach(() => {
                vi.useRealTimers();
            });

            // Left long enough, what was typed is forgotten and the next key starts afresh
            const pause = () =>
                act(() => {
                    vi.advanceTimersByTime(500);
                });

            it("moves to the item that starts with what is typed", () => {
                renderMenu();
                openMenu();

                press("p");
                expect(highlighted()).toEqual(["Paste"]);

                pause();

                // The same key again walks on to the next item starting with it
                press("c");
                expect(highlighted()).toEqual(["Cut"]);
                press("c");
                expect(highlighted()).toEqual(["Copy"]);
            });

            it("reads keys pressed one after another as one word", () => {
                renderMenu();
                openMenu();

                press("c");
                expect(highlighted()).toEqual(["Cut"]);

                press("o");
                expect(highlighted()).toEqual(["Copy"]);

                // A word no item starts with leaves the reader where they were
                press("x");
                expect(highlighted()).toEqual(["Copy"]);
            });

            it("finds an item by the words it was given, where its own do not say", () => {
                render(
                    <ContextMenu>
                        <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                        <ContextMenu.Positioner>
                            <ContextMenu.Content>
                                <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                                <ContextMenu.Item value="delete" valueText="Remove">
                                    Delete
                                </ContextMenu.Item>
                            </ContextMenu.Content>
                        </ContextMenu.Positioner>
                    </ContextMenu>,
                );
                openMenu();

                press("r");

                expect(highlighted()).toEqual(["Delete"]);
            });

            it("leaves typing alone where it is told to", () => {
                renderMenu({ typeahead: false });
                openMenu();

                press("p");

                expect(highlighted()).toEqual([]);
            });
        });
    });

    describe("reading the menu by pointer", () => {
        it("puts the reader on an item as the pointer crosses it, and takes them off as it leaves", () => {
            renderMenu();
            openMenu();

            fireEvent(item("Copy"), pointerEvent("pointermove", { pointerType: "mouse" }));

            expect(highlighted()).toEqual(["Copy"]);
            expect(item("Copy")).toHaveFocus();

            fireEvent(
                item("Copy"),
                pointerEvent("pointerout", { pointerType: "mouse", relatedTarget: menu() }),
            );

            expect(highlighted()).toEqual([]);
            expect(menu()).toHaveFocus();
        });

        it("leaves a finger sliding across the menu to scroll it", () => {
            renderMenu();
            openMenu();

            fireEvent(item("Copy"), pointerEvent("pointermove", { pointerType: "touch" }));

            expect(highlighted()).toEqual([]);
        });
    });

    describe("a checkbox item", () => {
        const renderCheckbox = (checked: boolean, onCheckedChange = vi.fn()) =>
            render(
                <ContextMenu>
                    <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                    <ContextMenu.Positioner>
                        <ContextMenu.Content>
                            <ContextMenu.CheckboxItem
                                value="toolbar"
                                checked={checked}
                                onCheckedChange={onCheckedChange}
                            >
                                <ContextMenu.ItemIndicator data-testid="indicator" />
                                <ContextMenu.ItemText>Show toolbar</ContextMenu.ItemText>
                            </ContextMenu.CheckboxItem>
                        </ContextMenu.Content>
                    </ContextMenu.Positioner>
                </ContextMenu>,
            );

        it("reads as one, and says whether it is picked", () => {
            renderCheckbox(true);
            openMenu();

            const checkbox = screen.getByRole("menuitemcheckbox", { name: "Show toolbar" });
            expect(checkbox).toHaveAttribute("aria-checked", "true");
            expect(checkbox).toHaveAttribute("data-state", "checked");
            expect(screen.getByTestId("indicator")).toHaveAttribute("data-state", "checked");
        });

        it("keeps its mark from a screen reader, and out of sight while it is not picked", () => {
            renderCheckbox(false);
            openMenu();

            expect(screen.getByTestId("indicator")).toHaveAttribute("aria-hidden", "true");
            expect(screen.getByTestId("indicator")).toHaveAttribute("data-state", "unchecked");
        });

        it("turns over once it is picked", () => {
            const onCheckedChange = vi.fn();
            renderCheckbox(false, onCheckedChange);
            openMenu();

            fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Show toolbar" }));

            expect(onCheckedChange).toHaveBeenCalledWith(true);
        });
    });

    describe("radio items", () => {
        const renderRadios = (onValueChange = vi.fn()) =>
            render(
                <ContextMenu>
                    <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                    <ContextMenu.Positioner>
                        <ContextMenu.Content>
                            <ContextMenu.RadioItemGroup value="date" onValueChange={onValueChange}>
                                <ContextMenu.ItemGroupLabel>Sort by</ContextMenu.ItemGroupLabel>
                                <ContextMenu.RadioItem value="name">Name</ContextMenu.RadioItem>
                                <ContextMenu.RadioItem value="date">Date</ContextMenu.RadioItem>
                            </ContextMenu.RadioItemGroup>
                        </ContextMenu.Content>
                    </ContextMenu.Positioner>
                </ContextMenu>,
            );

        it("stand in a group named by its label, and say which of them is picked", () => {
            renderRadios();
            openMenu();

            const group = screen.getByRole("group", { name: "Sort by" });
            expect(group).toHaveAttribute("data-component", "ContextMenu.RadioItemGroup");

            expect(screen.getByRole("menuitemradio", { name: "Name" })).toHaveAttribute(
                "aria-checked",
                "false",
            );
            expect(screen.getByRole("menuitemradio", { name: "Date" })).toHaveAttribute(
                "aria-checked",
                "true",
            );
        });

        it("tell the group which of them was picked", () => {
            const onValueChange = vi.fn();
            renderRadios(onValueChange);
            openMenu();

            fireEvent.click(screen.getByRole("menuitemradio", { name: "Name" }));

            expect(onValueChange).toHaveBeenCalledWith("name");
        });
    });

    it("collects related items under a label of their own", () => {
        render(
            <ContextMenu>
                <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                <ContextMenu.Positioner>
                    <ContextMenu.Content>
                        <ContextMenu.ItemGroup>
                            <ContextMenu.ItemGroupLabel>Clipboard</ContextMenu.ItemGroupLabel>
                            <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                        </ContextMenu.ItemGroup>
                        <ContextMenu.Separator />
                        <ContextMenu.Item value="delete">Delete</ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Positioner>
            </ContextMenu>,
        );
        openMenu();

        expect(screen.getByRole("group", { name: "Clipboard" })).toContainElement(item("Cut"));
        expect(screen.getByRole("separator")).toHaveAttribute(
            "data-component",
            "ContextMenu.Separator",
        );
    });

    describe("a menu the caller holds the state of", () => {
        it("tells the caller, and opens nothing until they say so", () => {
            const onOpenChange = vi.fn();
            renderMenu({ open: false, onOpenChange });

            openMenu();

            expect(onOpenChange).toHaveBeenCalledWith(true);
            expect(menu()).not.toBeInTheDocument();
        });

        it("stands open where it is told to", () => {
            renderMenu({ open: true });

            expect(menu()).toBeInTheDocument();
            expect(positioner().style.getPropertyValue("--context-menu-top")).toBe("0px");
        });

        it("opens as it is first drawn where it is told to", () => {
            renderMenu({ defaultOpen: true });

            expect(menu()).toBeInTheDocument();
        });
    });

    describe("a finger resting on the area", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("opens the menu once it has rested long enough, clear of the finger", () => {
            renderMenu();

            fireEvent(trigger(), touch({}));
            expect(menu()).not.toBeInTheDocument();

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(menu()).toBeInTheDocument();
            expect(positioner().style.getPropertyValue("--context-menu-top")).toBe("30px");
            expect(positioner().style.getPropertyValue("--context-menu-left")).toBe("10px");
        });

        it("is left alone where it lifts off first", () => {
            renderMenu();

            fireEvent(trigger(), touch({}));
            fireEvent(trigger(), pointerEvent("pointerup", { pointerType: "touch" }));

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(menu()).not.toBeInTheDocument();
        });

        it("is left alone where it wanders off, and not where it only shakes", () => {
            renderMenu();

            fireEvent(trigger(), touch({}));
            fireEvent(
                trigger(),
                pointerEvent("pointermove", { pointerType: "touch", clientX: 14, clientY: 24 }),
            );
            fireEvent(
                trigger(),
                pointerEvent("pointermove", { pointerType: "touch", clientX: 40, clientY: 20 }),
            );

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(menu()).not.toBeInTheDocument();
        });

        it("is not waited on where the area has been turned off", () => {
            renderMenu({ disabled: true });

            fireEvent(trigger(), touch({}));

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(menu()).not.toBeInTheDocument();
        });
    });

    it("stops a part standing outside of a ContextMenu rather than drawing it wrongly", () => {
        expect(() => render(<ContextMenu.Trigger>Right click here</ContextMenu.Trigger>)).toThrow(
            /within a `ContextMenu`/,
        );
    });

    it("forwards refs to the parts it is drawn from", () => {
        const triggerRef = React.createRef<HTMLDivElement>();
        const contentRef = React.createRef<HTMLDivElement>();
        const itemRef = React.createRef<HTMLDivElement>();

        render(
            <ContextMenu defaultOpen>
                <ContextMenu.Trigger ref={triggerRef}>Right click here</ContextMenu.Trigger>
                <ContextMenu.Positioner>
                    <ContextMenu.Content ref={contentRef}>
                        <ContextMenu.Item ref={itemRef} value="cut">
                            Cut
                        </ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Positioner>
            </ContextMenu>,
        );

        expect(triggerRef.current).toBe(trigger());
        expect(contentRef.current).toBe(menu());
        expect(itemRef.current).toBe(item("Cut"));
    });

    it("merges a custom className onto the parts it is drawn from", () => {
        render(
            <ContextMenu defaultOpen>
                <ContextMenu.Trigger className="custom-trigger">
                    Right click here
                </ContextMenu.Trigger>
                <ContextMenu.Positioner className="custom-positioner">
                    <ContextMenu.Content className="custom-content">
                        <ContextMenu.Item value="cut" className="custom-item">
                            Cut
                        </ContextMenu.Item>
                        <ContextMenu.Separator className="custom-separator" />
                    </ContextMenu.Content>
                </ContextMenu.Positioner>
            </ContextMenu>,
        );

        expect(trigger()).toHaveClass("context-menu-trigger", "custom-trigger");
        expect(positioner()).toHaveClass("context-menu-positioner", "custom-positioner");
        expect(menu()).toHaveClass("context-menu-content", "custom-content");
        expect(item("Cut")).toHaveClass("context-menu-item", "custom-item");
        expect(screen.getByRole("separator")).toHaveClass(
            "context-menu-separator",
            "custom-separator",
        );
    });

    it("still calls the area's own handlers", () => {
        const onContextMenu = vi.fn();
        render(
            <ContextMenu>
                <ContextMenu.Trigger onContextMenu={onContextMenu}>
                    Right click here
                </ContextMenu.Trigger>
                <ContextMenu.Positioner>
                    <ContextMenu.Content>
                        <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Positioner>
            </ContextMenu>,
        );

        openMenu();

        expect(onContextMenu).toHaveBeenCalledTimes(1);
        expect(menu()).toBeInTheDocument();
    });

    it("leaves the press to a caller that has answered it themselves", () => {
        render(
            <ContextMenu>
                <ContextMenu.Trigger onContextMenu={(event) => event.preventDefault()}>
                    Right click here
                </ContextMenu.Trigger>
                <ContextMenu.Positioner>
                    <ContextMenu.Content>
                        <ContextMenu.Item value="cut">Cut</ContextMenu.Item>
                    </ContextMenu.Content>
                </ContextMenu.Positioner>
            </ContextMenu>,
        );

        openMenu();

        expect(menu()).not.toBeInTheDocument();
    });
});
