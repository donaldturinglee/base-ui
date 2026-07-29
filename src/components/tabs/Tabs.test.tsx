import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Tabs } from ".";
import type { TabsProps } from "./Tabs.types";

const renderTabs = (props: Partial<TabsProps> = {}) =>
    render(
        <Tabs defaultValue="a" {...props}>
            <Tabs.List aria-label="Sections">
                <Tabs.Tab value="a">Tab A</Tabs.Tab>
                <Tabs.Tab value="b">Tab B</Tabs.Tab>
                <Tabs.Tab value="c">Tab C</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="a">Panel A</Tabs.Panel>
            <Tabs.Panel value="b">Panel B</Tabs.Panel>
            <Tabs.Panel value="c">Panel C</Tabs.Panel>
        </Tabs>,
    );

const tablist = () => screen.getByRole("tablist");

const tab = (name: string) => screen.getByRole("tab", { name });

// A hidden panel is out of the accessibility tree, so the panels are reached by their text
const panel = (text: string) => screen.getByText(text);

describe("Tabs", () => {
    it("renders a tablist, a tab for every value and a panel for every tab", () => {
        renderTabs();
        expect(tablist()).toBeInTheDocument();
        expect(screen.getAllByRole("tab")).toHaveLength(3);
        expect(panel("Panel A")).toHaveAttribute("role", "tabpanel");
    });

    it("tags the elements with data-component attributes", () => {
        renderTabs();
        expect(tablist()).toHaveAttribute("data-component", "Tabs.List");
        expect(tab("Tab A")).toHaveAttribute("data-component", "Tabs.Tab");
        expect(panel("Panel A")).toHaveAttribute("data-component", "Tabs.Panel");
    });

    it("selects the tab it is told to start on", () => {
        renderTabs({ defaultValue: "b" });
        expect(tab("Tab A")).toHaveAttribute("aria-selected", "false");
        expect(tab("Tab B")).toHaveAttribute("aria-selected", "true");
        expect(tab("Tab C")).toHaveAttribute("aria-selected", "false");
    });

    it("keeps only the selected tab in the tab sequence", () => {
        // The rest are reached with the arrow keys once the tablist has been reached
        renderTabs({ defaultValue: "b" });
        expect(tab("Tab A")).toHaveAttribute("tabindex", "-1");
        expect(tab("Tab B")).toHaveAttribute("tabindex", "0");
        expect(tab("Tab C")).toHaveAttribute("tabindex", "-1");
    });

    it("ties every tab to the panel it shows", () => {
        renderTabs();
        expect(tab("Tab A")).toHaveAttribute("aria-controls", panel("Panel A").id);
        expect(panel("Panel A")).toHaveAttribute("aria-labelledby", tab("Tab A").id);
    });

    it("builds the ids from an id it is given", () => {
        renderTabs({ id: "repository" });
        expect(tab("Tab A")).toHaveAttribute("id", "repository-tab-a");
        expect(panel("Panel A")).toHaveAttribute("id", "repository-panel-a");
    });

    it("shows only the panel of the selected tab", () => {
        renderTabs();
        expect(panel("Panel A")).not.toHaveAttribute("hidden");
        expect(panel("Panel A")).toHaveAttribute("data-selected", "");
        expect(panel("Panel B")).toHaveAttribute("hidden");
        expect(panel("Panel B")).not.toHaveAttribute("data-selected");
    });

    it("selects a tab that is pressed", () => {
        renderTabs();

        fireEvent.mouseDown(tab("Tab B"));

        expect(tab("Tab B")).toHaveAttribute("aria-selected", "true");
        expect(tab("Tab B")).toHaveAttribute("tabindex", "0");
        expect(panel("Panel B")).not.toHaveAttribute("hidden");
    });

    it("selects a tab that is landed on", () => {
        // Arrowing along the tablist carries the panels with it
        renderTabs();

        act(() => tab("Tab C").focus());

        expect(tab("Tab C")).toHaveAttribute("aria-selected", "true");
    });

    it("reports every change through onChange", () => {
        const onChange = jest.fn();
        renderTabs({ onChange });

        fireEvent.mouseDown(tab("Tab B"));

        expect(onChange).toHaveBeenCalledWith("b");
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("takes what is selected from the caller, where they are holding the state", () => {
        const onChange = jest.fn();
        renderTabs({ value: "a", defaultValue: undefined, onChange });

        fireEvent.mouseDown(tab("Tab B"));

        // The caller is told which tab was pressed, and until they say otherwise the tab they
        // last asked for is the one that stays selected
        expect(onChange).toHaveBeenCalledWith("b");
        expect(tab("Tab A")).toHaveAttribute("aria-selected", "true");
        expect(tab("Tab B")).toHaveAttribute("aria-selected", "false");
    });

    it("moves along the tablist with the arrow keys", () => {
        renderTabs();

        fireEvent.keyDown(tab("Tab A"), { key: "ArrowRight" });
        expect(tab("Tab B")).toHaveFocus();

        fireEvent.keyDown(tab("Tab B"), { key: "ArrowLeft" });
        expect(tab("Tab A")).toHaveFocus();
    });

    it("wraps round at either end of the tablist", () => {
        renderTabs({ defaultValue: "c" });

        fireEvent.keyDown(tab("Tab C"), { key: "ArrowRight" });
        expect(tab("Tab A")).toHaveFocus();

        fireEvent.keyDown(tab("Tab A"), { key: "ArrowLeft" });
        expect(tab("Tab C")).toHaveFocus();
    });

    it("moves to either end of the tablist with Home and End", () => {
        renderTabs({ defaultValue: "b" });

        fireEvent.keyDown(tab("Tab B"), { key: "End" });
        expect(tab("Tab C")).toHaveFocus();

        fireEvent.keyDown(tab("Tab C"), { key: "Home" });
        expect(tab("Tab A")).toHaveFocus();
    });

    it("leaves the keys it has no use for to the page around it", () => {
        renderTabs();

        // A tablist running across the page has nothing to do with the up and down keys
        expect(fireEvent.keyDown(tab("Tab A"), { key: "ArrowDown" })).toBe(true);
        expect(tab("Tab A")).toHaveAttribute("aria-selected", "true");
    });

    it("moves with the up and down keys where the tablist stands vertically", () => {
        render(
            <Tabs defaultValue="a">
                <Tabs.List aria-label="Sections" aria-orientation="vertical">
                    <Tabs.Tab value="a">Tab A</Tabs.Tab>
                    <Tabs.Tab value="b">Tab B</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="a">Panel A</Tabs.Panel>
                <Tabs.Panel value="b">Panel B</Tabs.Panel>
            </Tabs>,
        );

        expect(tablist()).toHaveAttribute("aria-orientation", "vertical");
        expect(tablist()).toHaveAttribute("data-orientation", "vertical");

        fireEvent.keyDown(tab("Tab A"), { key: "ArrowDown" });
        expect(tab("Tab B")).toHaveFocus();

        fireEvent.keyDown(tab("Tab B"), { key: "ArrowUp" });
        expect(tab("Tab A")).toHaveFocus();
    });

    it("falls back to running the tablist across the page", () => {
        renderTabs();
        expect(tablist()).toHaveAttribute("aria-orientation", "horizontal");
        expect(tablist()).toHaveAttribute("data-orientation", "horizontal");
    });

    it("selects the tab that is focused when Space or Enter is pressed", () => {
        renderTabs();

        fireEvent.keyDown(tab("Tab B"), { key: " " });
        expect(tab("Tab B")).toHaveAttribute("aria-selected", "true");

        fireEvent.keyDown(tab("Tab C"), { key: "Enter" });
        expect(tab("Tab C")).toHaveAttribute("aria-selected", "true");
    });

    it("marks a disabled tab as unavailable rather than taking it out of reach", () => {
        render(
            <Tabs defaultValue="a">
                <Tabs.List aria-label="Sections">
                    <Tabs.Tab value="a">Tab A</Tabs.Tab>
                    <Tabs.Tab value="b" disabled>
                        Tab B
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="a">Panel A</Tabs.Panel>
                <Tabs.Panel value="b">Panel B</Tabs.Panel>
            </Tabs>,
        );

        expect(tab("Tab B")).toHaveAttribute("aria-disabled", "true");
        expect(tab("Tab B")).not.toBeDisabled();
    });

    it("does not select a disabled tab that is pressed", () => {
        render(
            <Tabs defaultValue="a">
                <Tabs.List aria-label="Sections">
                    <Tabs.Tab value="a">Tab A</Tabs.Tab>
                    <Tabs.Tab value="b" disabled>
                        Tab B
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="a">Panel A</Tabs.Panel>
                <Tabs.Panel value="b">Panel B</Tabs.Panel>
            </Tabs>,
        );

        fireEvent.mouseDown(tab("Tab B"));

        expect(tab("Tab A")).toHaveAttribute("aria-selected", "true");
        expect(tab("Tab B")).toHaveAttribute("aria-selected", "false");
    });

    it("passes over a disabled tab on the way along the tablist", () => {
        render(
            <Tabs defaultValue="a">
                <Tabs.List aria-label="Sections">
                    <Tabs.Tab value="a">Tab A</Tabs.Tab>
                    <Tabs.Tab value="b" disabled>
                        Tab B
                    </Tabs.Tab>
                    <Tabs.Tab value="c">Tab C</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="a">Panel A</Tabs.Panel>
                <Tabs.Panel value="b">Panel B</Tabs.Panel>
                <Tabs.Panel value="c">Panel C</Tabs.Panel>
            </Tabs>,
        );

        fireEvent.keyDown(tab("Tab A"), { key: "ArrowRight" });

        expect(tab("Tab C")).toHaveFocus();
    });

    it("names the tablist by whatever it is given to be named by", () => {
        render(
            <div>
                <span id="sections-label">Sections</span>
                <Tabs defaultValue="a">
                    <Tabs.List aria-labelledby="sections-label">
                        <Tabs.Tab value="a">Tab A</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="a">Panel A</Tabs.Panel>
                </Tabs>
            </div>,
        );

        expect(screen.getByRole("tablist", { name: "Sections" })).toBeInTheDocument();
    });

    it("runs a caller's own handlers alongside its own", () => {
        const onKeyDown = jest.fn();
        const onFocus = jest.fn();

        render(
            <Tabs defaultValue="a">
                <Tabs.List aria-label="Sections">
                    <Tabs.Tab value="a" onKeyDown={onKeyDown} onFocus={onFocus}>
                        Tab A
                    </Tabs.Tab>
                    <Tabs.Tab value="b">Tab B</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="a">Panel A</Tabs.Panel>
                <Tabs.Panel value="b">Panel B</Tabs.Panel>
            </Tabs>,
        );

        fireEvent.keyDown(tab("Tab A"), { key: "Enter" });
        act(() => tab("Tab A").focus());

        expect(onKeyDown).toHaveBeenCalledTimes(1);
        expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it("forwards refs to the elements it renders", () => {
        const listRef = React.createRef<HTMLDivElement>();
        const tabRef = React.createRef<HTMLButtonElement>();
        const panelRef = React.createRef<HTMLDivElement>();

        render(
            <Tabs defaultValue="a">
                <Tabs.List aria-label="Sections" ref={listRef}>
                    <Tabs.Tab value="a" ref={tabRef}>
                        Tab A
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="a" ref={panelRef}>
                    Panel A
                </Tabs.Panel>
            </Tabs>,
        );

        expect(listRef.current).toBe(tablist());
        expect(tabRef.current).toBe(tab("Tab A"));
        expect(panelRef.current).toBe(panel("Panel A"));
    });

    it("merges a custom className onto every part", () => {
        render(
            <Tabs defaultValue="a">
                <Tabs.List aria-label="Sections" className="list">
                    <Tabs.Tab value="a" className="tab">
                        Tab A
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="a" className="panel">
                    Panel A
                </Tabs.Panel>
            </Tabs>,
        );

        expect(tablist()).toHaveClass("list");
        expect(tab("Tab A")).toHaveClass("tab");
        expect(panel("Panel A")).toHaveClass("panel");
    });

    it("draws the line under the selected tab and under no other", () => {
        renderTabs();
        expect(tab("Tab A")).toHaveClass(
            "border-b-[color:var(--underline-nav-border-color-active)]",
        );
        // The line the tab carries when it is not the selected one comes off with it
        expect(tab("Tab A")).not.toHaveClass("border-b-transparent");
        expect(tab("Tab B")).toHaveClass("border-b-transparent");
    });

    it("refuses to stand outside of a Tabs", () => {
        const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

        expect(() => render(<Tabs.Tab value="a">Tab A</Tabs.Tab>)).toThrow(
            /within a `Tabs` component/,
        );

        consoleError.mockRestore();
    });
});
