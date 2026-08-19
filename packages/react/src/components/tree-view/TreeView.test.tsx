import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { DeleteRegular, EditRegular } from "@gamecrafters/base-ui-icons";
import { TreeView } from ".";

const tree = () => screen.getByRole("tree");

const item = (name: string) => screen.getByRole("treeitem", { name });

// A tree of three folders, the middle one holding two files
const renderTree = (props: React.ComponentProps<typeof TreeView.Item> = { id: "unused" }) =>
    render(
        <TreeView aria-label="Files">
            <TreeView.Item id="readme">README.md</TreeView.Item>
            <TreeView.Item {...props} id="src">
                src
                <TreeView.SubTree>
                    <TreeView.Item id="index">index.ts</TreeView.Item>
                    <TreeView.Item id="main">main.ts</TreeView.Item>
                </TreeView.SubTree>
            </TreeView.Item>
            <TreeView.Item id="license">LICENSE</TreeView.Item>
        </TreeView>,
    );

describe("TreeView", () => {
    it("renders a tree named by the caller", () => {
        renderTree();

        expect(tree()).toHaveAccessibleName("Files");
        expect(tree()).toHaveAttribute("data-component", "TreeView");
    });

    it("says how deep each item stands", () => {
        renderTree({ id: "src", defaultExpanded: true });

        expect(item("README.md")).toHaveAttribute("aria-level", "1");
        expect(item("index.ts")).toHaveAttribute("aria-level", "2");
    });

    it("says which items can be opened and which cannot", () => {
        renderTree();

        expect(item("src")).toHaveAttribute("aria-expanded", "false");
        expect(item("README.md")).not.toHaveAttribute("aria-expanded");
    });

    it("leaves a closed sub-tree off the page", () => {
        renderTree();

        expect(screen.queryByRole("treeitem", { name: "index.ts" })).toBeNull();
    });

    it("opens a sub-tree the caller asked to start open", () => {
        renderTree({ id: "src", defaultExpanded: true });

        expect(item("src")).toHaveAttribute("aria-expanded", "true");
        expect(item("index.ts")).toBeInTheDocument();
    });

    it("names a sub-tree from the item it stands under", () => {
        renderTree({ id: "src", defaultExpanded: true });

        expect(screen.getByRole("group", { name: "src" })).toBeInTheDocument();
    });

    it("opens and closes an item when it is clicked", () => {
        renderTree();

        fireEvent.click(item("src"));
        expect(item("src")).toHaveAttribute("aria-expanded", "true");

        fireEvent.click(item("src"));
        expect(item("src")).toHaveAttribute("aria-expanded", "false");
    });

    it("tells the caller when an item is opened", () => {
        const onExpandedChange = vi.fn();
        renderTree({ id: "src", onExpandedChange });

        fireEvent.click(item("src"));

        expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it("takes the open state from the caller where it is being held", () => {
        renderTree({ id: "src", expanded: false });

        fireEvent.click(item("src"));

        expect(item("src")).toHaveAttribute("aria-expanded", "false");
    });

    it("calls back when an item is picked, in place of opening it", () => {
        const onSelect = vi.fn();
        renderTree({ id: "src", onSelect });

        fireEvent.click(item("src"));

        expect(onSelect).toHaveBeenCalled();
        expect(item("src")).toHaveAttribute("aria-expanded", "false");
    });

    it("shows which item the reader is looking at", () => {
        render(
            <TreeView aria-label="Files">
                <TreeView.Item id="readme" current>
                    README.md
                </TreeView.Item>
            </TreeView>,
        );

        expect(item("README.md")).toHaveAttribute("aria-current", "true");
    });

    it("opens an item that is the one being looked at", () => {
        renderTree({ id: "src", current: true });

        expect(item("src")).toHaveAttribute("aria-expanded", "true");
    });

    it("draws the visuals an item is given", () => {
        render(
            <TreeView aria-label="Files">
                <TreeView.Item id="src">
                    <TreeView.LeadingVisual label="Folder">
                        <TreeView.DirectoryIcon />
                    </TreeView.LeadingVisual>
                    src
                    <TreeView.TrailingVisual label="Changed">*</TreeView.TrailingVisual>
                </TreeView.Item>
            </TreeView>,
        );

        expect(item("src")).toHaveAccessibleDescription("Folder Changed");
        expect(item("src").querySelector("[data-component='TreeView.DirectoryIcon']")).toBeTruthy();
    });

    it("hands a visual whether the item it stands in is open", () => {
        render(
            <TreeView aria-label="Files">
                <TreeView.Item id="src">
                    <TreeView.LeadingVisual>
                        {({ isExpanded }) => <span>{isExpanded ? "open" : "closed"}</span>}
                    </TreeView.LeadingVisual>
                    src
                    <TreeView.SubTree>
                        <TreeView.Item id="index">index.ts</TreeView.Item>
                    </TreeView.SubTree>
                </TreeView.Item>
            </TreeView>,
        );

        expect(screen.getByText("closed")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("treeitem"));

        expect(screen.getByText("open")).toBeInTheDocument();
    });

    it("makes room for a leading action only where there is one", () => {
        render(
            <TreeView aria-label="Files">
                <TreeView.Item id="src">
                    <TreeView.LeadingAction label="Pick">
                        <input type="checkbox" aria-label="Pick src" />
                    </TreeView.LeadingAction>
                    src
                </TreeView.Item>
                <TreeView.Item id="readme">README.md</TreeView.Item>
            </TreeView>,
        );

        expect(item("src")).toHaveAttribute("data-has-leading-action");
        expect(item("README.md")).not.toHaveAttribute("data-has-leading-action");
    });

    describe("moving through the tree", () => {
        it("holds a single tab stop, on the first item", () => {
            renderTree();

            expect(item("README.md")).toHaveAttribute("tabindex", "0");
            expect(item("src")).toHaveAttribute("tabindex", "-1");
        });

        it("holds the tab stop on the item being looked at", () => {
            render(
                <TreeView aria-label="Files">
                    <TreeView.Item id="readme">README.md</TreeView.Item>
                    <TreeView.Item id="license" current>
                        LICENSE
                    </TreeView.Item>
                </TreeView>,
            );

            expect(item("LICENSE")).toHaveAttribute("tabindex", "0");
        });

        it("moves down and up the visible items", () => {
            renderTree();

            item("README.md").focus();

            fireEvent.keyDown(item("README.md"), { key: "ArrowDown" });
            expect(item("src")).toHaveFocus();

            fireEvent.keyDown(item("src"), { key: "ArrowDown" });
            expect(item("LICENSE")).toHaveFocus();

            fireEvent.keyDown(item("LICENSE"), { key: "ArrowUp" });
            expect(item("src")).toHaveFocus();
        });

        it("steps over what stands inside a closed sub-tree", () => {
            renderTree();

            item("src").focus();
            fireEvent.keyDown(item("src"), { key: "ArrowDown" });

            expect(item("LICENSE")).toHaveFocus();
        });

        it("opens a closed item with the right arrow, without moving", () => {
            renderTree();

            item("src").focus();
            fireEvent.keyDown(item("src"), { key: "ArrowRight" });

            expect(item("src")).toHaveAttribute("aria-expanded", "true");
            expect(item("src")).toHaveFocus();
        });

        it("moves onto the first child of an open item with the right arrow", () => {
            renderTree({ id: "src", defaultExpanded: true });

            item("src").focus();
            fireEvent.keyDown(item("src"), { key: "ArrowRight" });

            expect(item("index.ts")).toHaveFocus();
        });

        it("closes an open item with the left arrow, without moving", () => {
            renderTree({ id: "src", defaultExpanded: true });

            item("src").focus();
            fireEvent.keyDown(item("src"), { key: "ArrowLeft" });

            expect(item("src")).toHaveAttribute("aria-expanded", "false");
            expect(item("src")).toHaveFocus();
        });

        it("steps back out to the parent with the left arrow", () => {
            renderTree({ id: "src", defaultExpanded: true });

            item("index.ts").focus();
            fireEvent.keyDown(item("index.ts"), { key: "ArrowLeft" });

            expect(item("src")).toHaveFocus();
        });

        it("moves to the first and last items with home and end", () => {
            renderTree();

            item("src").focus();

            fireEvent.keyDown(item("src"), { key: "End" });
            expect(item("LICENSE")).toHaveFocus();

            fireEvent.keyDown(item("LICENSE"), { key: "Home" });
            expect(item("README.md")).toHaveFocus();
        });

        it("opens an item when it is pressed with the keyboard", () => {
            renderTree();

            item("src").focus();
            fireEvent.keyDown(item("src"), { key: "Enter" });

            expect(item("src")).toHaveAttribute("aria-expanded", "true");
        });

        it("moves to the item whose name was typed", () => {
            renderTree();

            item("README.md").focus();
            fireEvent.keyDown(tree(), { key: "l" });

            expect(item("LICENSE")).toHaveFocus();
        });
    });

    describe("fetching a sub-tree", () => {
        const renderAsync = (state: "loading" | "done", children?: React.ReactNode) =>
            render(
                <TreeView aria-label="Files">
                    <TreeView.Item id="src" defaultExpanded>
                        src
                        <TreeView.SubTree state={state}>{children}</TreeView.SubTree>
                    </TreeView.Item>
                </TreeView>,
            );

        it("stands a row in place of what is being fetched", () => {
            renderAsync("loading");

            expect(screen.getByRole("treeitem", { name: /Loading/ })).toBeInTheDocument();
        });

        it("stands the asked-for number of rows in place of what is being fetched", () => {
            render(
                <TreeView aria-label="Files">
                    <TreeView.Item id="src" defaultExpanded>
                        src
                        <TreeView.SubTree state="loading" count={3} />
                    </TreeView.Item>
                </TreeView>,
            );

            expect(screen.getByText("Loading 3 items")).toBeInTheDocument();
        });

        it("says a sub-tree turned out to hold nothing", () => {
            renderAsync("done");

            expect(screen.getByText("No items found")).toBeInTheDocument();
        });

        it("announces what happened once the fetching is done", () => {
            const { rerender } = renderAsync("loading");

            rerender(
                <TreeView aria-label="Files">
                    <TreeView.Item id="src" defaultExpanded>
                        src
                        <TreeView.SubTree state="done">
                            <TreeView.Item id="index">index.ts</TreeView.Item>
                        </TreeView.SubTree>
                    </TreeView.Item>
                </TreeView>,
            );

            expect(
                document.querySelector("[data-component='TreeView.Announcement']"),
            ).toHaveTextContent("src content loaded");
        });
    });

    describe("secondary actions", () => {
        const actions = [
            { label: "Rename", onClick: vi.fn(), icon: EditRegular },
            { label: "Delete", onClick: vi.fn(), icon: DeleteRegular },
        ];

        it("draws a button for each action, outside the tab order", () => {
            render(
                <TreeView aria-label="Files">
                    <TreeView.Item id="src" secondaryActions={actions}>
                        src
                    </TreeView.Item>
                </TreeView>,
            );

            const buttons = screen.getAllByRole("button", { hidden: true });
            expect(buttons.map((button) => button.getAttribute("tabindex"))).toEqual(["-1", "-1"]);
        });

        it("says which keys reach the actions", () => {
            render(
                <TreeView aria-label="Files">
                    <TreeView.Item id="src" secondaryActions={actions}>
                        src
                    </TreeView.Item>
                </TreeView>,
            );

            expect(screen.getByRole("treeitem")).toHaveAccessibleName(/for more actions/);
        });

        it("does the one action there is, rather than opening a dialog", () => {
            const onClick = vi.fn();

            render(
                <TreeView aria-label="Files">
                    <TreeView.Item
                        id="src"
                        secondaryActions={[{ label: "Rename", onClick, icon: EditRegular }]}
                    >
                        src
                    </TreeView.Item>
                </TreeView>,
            );

            act(() => {
                fireEvent.keyDown(screen.getByRole("treeitem"), {
                    key: "u",
                    shiftKey: true,
                    ctrlKey: true,
                });
            });

            expect(onClick).toHaveBeenCalled();
            expect(screen.queryByRole("dialog")).toBeNull();
        });
    });

    it("takes a class name of the caller's own", () => {
        render(
            <TreeView aria-label="Files" className="custom">
                <TreeView.Item id="readme">README.md</TreeView.Item>
            </TreeView>,
        );

        expect(tree()).toHaveClass("custom");
    });

    it("draws every row against the same edge where it is asked to", () => {
        render(
            <TreeView aria-label="Files" flat>
                <TreeView.Item id="readme">README.md</TreeView.Item>
            </TreeView>,
        );

        expect(tree()).toHaveAttribute("data-omit-spacer", "true");
    });
});
