import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { CommandPalette } from ".";
import { commandScore } from "./commandScore";
import type { CommandPaletteProps } from "./CommandPalette.types";

const renderPalette = (props: Partial<CommandPaletteProps> = {}) =>
    render(
        <CommandPalette {...props}>
            <CommandPalette.Input />
            <CommandPalette.List>
                <CommandPalette.Empty />
                <CommandPalette.Group heading="Pages">
                    <CommandPalette.Item>Dashboard</CommandPalette.Item>
                    <CommandPalette.Item>Settings</CommandPalette.Item>
                </CommandPalette.Group>
                <CommandPalette.Separator />
                <CommandPalette.Group heading="Actions">
                    <CommandPalette.Item keywords={["make", "add"]}>
                        New project
                    </CommandPalette.Item>
                    <CommandPalette.Item disabled>Delete project</CommandPalette.Item>
                </CommandPalette.Group>
            </CommandPalette.List>
        </CommandPalette>,
    );

const field = () => screen.getByRole("combobox");

const options = () => screen.queryAllByRole("option");

// What the reader sees, in the order they see it. The ranking is carried by the layout rather
// than by the tree, so the items are read back the way they are laid out
const shown = () =>
    options()
        .filter((option) => !option.className.includes("hidden"))
        .sort((one, other) => Number(one.style.order) - Number(other.style.order))
        .map((option) => option.getAttribute("data-value"));

const active = () => options().find((option) => option.getAttribute("data-active") === "true");

const part = (name: string) => document.querySelector(`[data-component='CommandPalette.${name}']`);

const type = (text: string) => fireEvent.change(field(), { target: { value: text } });

describe("CommandPalette", () => {
    it("tags the root element with a data-component attribute", () => {
        const { container } = renderPalette();
        expect(container.firstChild).toHaveAttribute("data-component", "CommandPalette");
    });

    it("tags each of its parts with a data-component attribute", () => {
        renderPalette();

        for (const name of ["Input", "List", "Group", "GroupHeading", "Item", "Separator"]) {
            expect(part(name)).toBeInTheDocument();
        }
    });

    it("reads the field as controlling the list", () => {
        renderPalette();

        const list = screen.getByRole("listbox");

        expect(field()).toHaveAttribute("aria-controls", list.id);
        expect(field()).toHaveAttribute("aria-autocomplete", "list");
    });

    it("names itself to a screen reader", () => {
        renderPalette({ label: "Jump to" });
        expect(field()).toHaveAccessibleName("Jump to");
    });

    it("knows an item by the text it was written with", () => {
        renderPalette();
        expect(shown()).toEqual(["Dashboard", "Settings", "New project", "Delete project"]);
    });

    it("takes a value of the caller's own in place of the text", () => {
        render(
            <CommandPalette>
                <CommandPalette.List>
                    <CommandPalette.Item value="go-home">Dashboard</CommandPalette.Item>
                </CommandPalette.List>
            </CommandPalette>,
        );

        expect(options()[0]).toHaveAttribute("data-value", "go-home");
    });

    describe("narrowing the list", () => {
        it("leaves standing only what answers what was typed", () => {
            renderPalette();

            type("sett");

            expect(shown()).toEqual(["Settings"]);
        });

        it("finds an item under a word it was given to be found by", () => {
            renderPalette();

            type("make");

            expect(shown()).toEqual(["New project"]);
        });

        it("puts the best answer first", () => {
            renderPalette();

            type("s");

            // "Settings" starts with the letter, so it answers better than the two that only
            // hold it somewhere in the middle
            expect(shown()[0]).toBe("Settings");
        });

        it("says so where nothing answers at all", () => {
            renderPalette();

            type("zzz");

            expect(shown()).toEqual([]);
            expect(screen.getByText("No results found")).toBeInTheDocument();
        });

        it("stands the divider down once something has been typed", () => {
            renderPalette();
            expect(part("Separator")).toBeInTheDocument();

            type("sett");
            expect(part("Separator")).not.toBeInTheDocument();
        });

        it("stands a group down once it has nothing left to head", () => {
            renderPalette();

            type("dashboard");

            const groups = Array.from(
                document.querySelectorAll("[data-component='CommandPalette.Group']"),
            );

            expect(groups[0].className).not.toContain("hidden");
            expect(groups[1].className).toContain("hidden");
        });

        it("leaves the items alone where the caller is filtering them", () => {
            renderPalette({ shouldFilter: false });

            type("zzz");

            expect(shown()).toHaveLength(4);
        });

        it("ranks by a filter of the caller's own where it is given one", () => {
            const filter = jest.fn((value: string) => (value === "Settings" ? 1 : 0));
            renderPalette({ filter });

            type("anything");

            expect(shown()).toEqual(["Settings"]);
        });

        it("keeps an item that is not the list's to filter", () => {
            render(
                <CommandPalette>
                    <CommandPalette.Input />
                    <CommandPalette.List>
                        <CommandPalette.Item>Dashboard</CommandPalette.Item>
                        <CommandPalette.Item forceMount>Always here</CommandPalette.Item>
                    </CommandPalette.List>
                </CommandPalette>,
            );

            type("zzz");

            expect(shown()).toEqual(["Always here"]);
        });
    });

    describe("moving through the list", () => {
        it("starts on the first item", () => {
            renderPalette();
            expect(active()).toHaveAttribute("data-value", "Dashboard");
        });

        it("points the field at whichever item is in hand", () => {
            renderPalette();
            expect(field()).toHaveAttribute("aria-activedescendant", active()?.id);
        });

        it("moves down and up with the arrow keys", () => {
            renderPalette();

            fireEvent.keyDown(field(), { key: "ArrowDown" });
            expect(active()).toHaveAttribute("data-value", "Settings");

            fireEvent.keyDown(field(), { key: "ArrowUp" });
            expect(active()).toHaveAttribute("data-value", "Dashboard");
        });

        it("steps over an item there is nothing to do with", () => {
            renderPalette();

            for (let press = 0; press < 4; press += 1) {
                fireEvent.keyDown(field(), { key: "ArrowDown" });
            }

            expect(active()).toHaveAttribute("data-value", "New project");
        });

        it("stops at either end", () => {
            renderPalette();

            fireEvent.keyDown(field(), { key: "ArrowUp" });
            expect(active()).toHaveAttribute("data-value", "Dashboard");
        });

        it("comes round to the other end where it is asked to", () => {
            renderPalette({ loop: true });

            fireEvent.keyDown(field(), { key: "ArrowUp" });

            expect(active()).toHaveAttribute("data-value", "New project");
        });

        it("takes the item in hand as the pointer moves over one", () => {
            renderPalette();

            fireEvent.pointerMove(screen.getByText("Settings"));

            expect(active()).toHaveAttribute("data-value", "Settings");
        });

        it("moves the item in hand along as the list narrows under it", () => {
            renderPalette();

            fireEvent.keyDown(field(), { key: "ArrowDown" });
            expect(active()).toHaveAttribute("data-value", "Settings");

            type("dash");
            expect(active()).toHaveAttribute("data-value", "Dashboard");
        });
    });

    describe("picking an item", () => {
        it("hands back what was picked when it is pressed", () => {
            const onSelect = jest.fn();
            renderPalette({ onSelect });

            fireEvent.click(screen.getByText("Settings"));

            expect(onSelect).toHaveBeenCalledWith("Settings");
        });

        it("hands it back to the item's own handler as well", () => {
            const onSelect = jest.fn();

            render(
                <CommandPalette>
                    <CommandPalette.List>
                        <CommandPalette.Item onSelect={onSelect}>Dashboard</CommandPalette.Item>
                    </CommandPalette.List>
                </CommandPalette>,
            );

            fireEvent.click(screen.getByText("Dashboard"));

            expect(onSelect).toHaveBeenCalledWith("Dashboard");
        });

        it("picks whatever is in hand when enter is pressed", () => {
            const onSelect = jest.fn();
            renderPalette({ onSelect });

            fireEvent.keyDown(field(), { key: "ArrowDown" });
            fireEvent.keyDown(field(), { key: "Enter" });

            expect(onSelect).toHaveBeenCalledWith("Settings");
        });

        it("leaves an item there is nothing to do with alone", () => {
            const onSelect = jest.fn();
            renderPalette({ onSelect });

            fireEvent.click(screen.getByText("Delete project"));

            expect(onSelect).not.toHaveBeenCalled();
        });
    });

    describe("what has been typed", () => {
        it("keeps it itself where the caller is not holding it", () => {
            renderPalette();

            type("sett");

            expect(field()).toHaveValue("sett");
        });

        it("tells the caller as it changes", () => {
            const onSearchChange = jest.fn();
            renderPalette({ onSearchChange });

            type("sett");

            expect(onSearchChange).toHaveBeenCalledWith("sett");
        });

        it("stays as the caller is holding it", () => {
            const onSearchChange = jest.fn();
            renderPalette({ search: "dash", onSearchChange });

            type("sett");

            expect(onSearchChange).toHaveBeenCalledWith("sett");
            expect(field()).toHaveValue("dash");
        });
    });

    describe("brought out over the page", () => {
        const renderDialog = (open: boolean, onOpenChange = jest.fn()) =>
            render(
                <CommandPalette.Dialog open={open} onOpenChange={onOpenChange}>
                    <CommandPalette.Input />
                    <CommandPalette.List>
                        <CommandPalette.Item>Dashboard</CommandPalette.Item>
                    </CommandPalette.List>
                </CommandPalette.Dialog>,
            );

        it("shows nothing while it is closed", () => {
            renderDialog(false);
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("stands over the page while it is open", () => {
            renderDialog(true);

            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
        });

        it("renders outside the tree it was written in", () => {
            const { container } = renderDialog(true);

            expect(container).toBeEmptyDOMElement();
            expect(document.body).toContainElement(screen.getByRole("dialog"));
        });

        it("puts focus straight into the field", () => {
            renderDialog(true);
            expect(field()).toHaveFocus();
        });

        it("closes when escape is pressed", () => {
            const onOpenChange = jest.fn();
            renderDialog(true, onOpenChange);

            fireEvent.keyDown(document, { key: "Escape" });

            expect(onOpenChange).toHaveBeenCalledWith(false);
        });

        it("closes when a press lands off the panel", () => {
            const onOpenChange = jest.fn();
            renderDialog(true, onOpenChange);

            const backdrop = document.querySelector(
                "[data-component='CommandPalette.Backdrop']",
            ) as HTMLElement;

            fireEvent.mouseDown(backdrop);

            expect(onOpenChange).toHaveBeenCalledWith(false);
        });
    });
});

describe("commandScore", () => {
    it("counts everything the same where nothing was typed", () => {
        expect(commandScore("Anything", "")).toBe(1);
    });

    it("counts an outright match highest", () => {
        expect(commandScore("Settings", "settings")).toBe(1);
    });

    it("counts the start of the text above the middle of it", () => {
        expect(commandScore("Settings", "sett")).toBeGreaterThan(
            commandScore("Reset things", "tt"),
        );
    });

    it("counts the start of a word above the middle of one", () => {
        expect(commandScore("New project", "pro")).toBeGreaterThan(commandScore("Approve", "pro"));
    });

    it("finds letters that turn up in order but apart", () => {
        expect(commandScore("New project", "npr")).toBeGreaterThan(0);
    });

    it("counts nothing where the letters are not all there", () => {
        expect(commandScore("Settings", "zzz")).toBe(0);
    });

    it("answers for the words an item was given as readily as for its own text", () => {
        expect(commandScore("New project", "add", ["make", "add"])).toBe(1);
    });
});
