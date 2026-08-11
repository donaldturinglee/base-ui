import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { CopyRegular } from "@gamecrafters/base-ui-icons";
import { ActionList } from ".";

const list = () => screen.getByRole("list");

const item = (name: string) => screen.getByText(name).closest("li") as HTMLElement;

describe("ActionList", () => {
    it("renders a list of the items it is given", () => {
        render(
            <ActionList>
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Rename</ActionList.Item>
            </ActionList>,
        );

        expect(list()).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("tags the list and its items with data-component attributes", () => {
        render(
            <ActionList>
                <ActionList.Item>Copy link</ActionList.Item>
            </ActionList>,
        );

        expect(list()).toHaveAttribute("data-component", "ActionList");
        expect(item("Copy link")).toHaveAttribute("data-component", "ActionList.Item");
    });

    it("renders an item with no list role as a button", () => {
        render(
            <ActionList>
                <ActionList.Item>Copy link</ActionList.Item>
            </ActionList>,
        );

        expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
    });

    it("keeps the list semantics on the item where the list has a role of its own", () => {
        render(
            <ActionList role="menu" aria-label="Actions">
                <ActionList.Item>Copy link</ActionList.Item>
            </ActionList>,
        );

        expect(screen.getByRole("menuitem", { name: "Copy link" })).toBe(item("Copy link"));
    });

    it("calls onSelect when an item is clicked", () => {
        const onSelect = vi.fn();
        render(
            <ActionList>
                <ActionList.Item onSelect={onSelect}>Copy link</ActionList.Item>
            </ActionList>,
        );

        fireEvent.click(screen.getByText("Copy link"));

        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it("calls onSelect when an item that carries the list semantics is pressed", () => {
        const onSelect = vi.fn();
        render(
            <ActionList role="menu" aria-label="Actions">
                <ActionList.Item onSelect={onSelect}>Copy link</ActionList.Item>
            </ActionList>,
        );

        fireEvent.keyDown(item("Copy link"), { key: "Enter" });
        fireEvent.keyDown(item("Copy link"), { key: " " });

        expect(onSelect).toHaveBeenCalledTimes(2);
    });

    it("leaves a disabled item alone", () => {
        const onSelect = vi.fn();
        render(
            <ActionList>
                <ActionList.Item disabled onSelect={onSelect}>
                    Copy link
                </ActionList.Item>
            </ActionList>,
        );

        fireEvent.click(screen.getByText("Copy link"));

        expect(onSelect).not.toHaveBeenCalled();
        expect(screen.getByRole("button", { name: "Copy link" })).toHaveAttribute(
            "aria-disabled",
            "true",
        );
    });

    it("leaves a loading item alone, and says that it is waiting", () => {
        const onSelect = vi.fn();
        render(
            <ActionList>
                <ActionList.Item loading onSelect={onSelect}>
                    Copy link
                </ActionList.Item>
            </ActionList>,
        );

        fireEvent.click(screen.getByText("Copy link"));

        expect(onSelect).not.toHaveBeenCalled();
        expect(screen.getByText("Loading")).toBeInTheDocument();
    });

    it("says why an inactive item cannot be used, and leaves it alone", () => {
        const onSelect = vi.fn();
        render(
            <ActionList>
                <ActionList.Item inactiveText="The server is unreachable" onSelect={onSelect}>
                    Copy link
                </ActionList.Item>
            </ActionList>,
        );

        fireEvent.click(screen.getByText("Copy link"));

        expect(onSelect).not.toHaveBeenCalled();
        expect(screen.getByText("The server is unreachable")).toBeInTheDocument();
    });

    it("says which item is picked where the list is read as a listbox", () => {
        render(
            <ActionList role="listbox" aria-label="Sort by" selectionVariant="single">
                <ActionList.Item selected>Newest</ActionList.Item>
                <ActionList.Item>Oldest</ActionList.Item>
            </ActionList>,
        );

        expect(screen.getByRole("option", { name: "Newest" })).toHaveAttribute(
            "aria-selected",
            "true",
        );
        expect(screen.getByRole("option", { name: "Oldest" })).toHaveAttribute(
            "aria-selected",
            "false",
        );
    });

    it("draws a mark beside the items of a list that can be picked from", () => {
        render(
            <ActionList selectionVariant="single">
                <ActionList.Item selected>Newest</ActionList.Item>
            </ActionList>,
        );

        expect(
            item("Newest").querySelector("[data-component='ActionList.Selection']"),
        ).toBeInTheDocument();
    });

    it("draws no mark where the list says nothing about picking items", () => {
        render(
            <ActionList>
                <ActionList.Item>Newest</ActionList.Item>
            </ActionList>,
        );

        expect(
            item("Newest").querySelector("[data-component='ActionList.Selection']"),
        ).not.toBeInTheDocument();
    });

    it("lets a group say how its own items are picked", () => {
        render(
            <ActionList selectionVariant="single">
                <ActionList.Group selectionVariant={false}>
                    <ActionList.GroupHeading as="h3">Actions</ActionList.GroupHeading>
                    <ActionList.Item>Rename</ActionList.Item>
                </ActionList.Group>
            </ActionList>,
        );

        expect(
            item("Rename").querySelector("[data-component='ActionList.Selection']"),
        ).not.toBeInTheDocument();
    });

    it("names a group from the heading it is given", () => {
        render(
            <ActionList>
                <ActionList.Group>
                    <ActionList.GroupHeading as="h3">This file</ActionList.GroupHeading>
                    <ActionList.Item>Rename</ActionList.Item>
                </ActionList.Group>
            </ActionList>,
        );

        expect(screen.getByRole("heading", { name: "This file", level: 3 })).toBeInTheDocument();
        expect(screen.getByRole("list", { name: "This file" })).toBeInTheDocument();
    });

    it("renders a group heading in a menu as presentation, since a menu has nowhere to read one", () => {
        render(
            <ActionList role="menu" aria-label="Actions">
                <ActionList.Group>
                    <ActionList.GroupHeading>This file</ActionList.GroupHeading>
                    <ActionList.Item>Rename</ActionList.Item>
                </ActionList.Group>
            </ActionList>,
        );

        expect(screen.queryByRole("heading")).not.toBeInTheDocument();
        expect(screen.getByRole("group", { name: "This file" })).toBeInTheDocument();
    });

    it("names the list from the heading it is given", () => {
        render(
            <ActionList>
                <ActionList.Heading as="h2">Settings</ActionList.Heading>
                <ActionList.Item>Your profile</ActionList.Item>
            </ActionList>,
        );

        expect(screen.getByRole("heading", { name: "Settings", level: 2 })).toBeInTheDocument();
        expect(screen.getByRole("list", { name: "Settings" })).toBeInTheDocument();
    });

    it("renders a link item as an anchor that fills the item", () => {
        render(
            <ActionList>
                <ActionList.LinkItem href="#profile">Your profile</ActionList.LinkItem>
            </ActionList>,
        );

        expect(screen.getByRole("link", { name: "Your profile" })).toHaveAttribute(
            "href",
            "#profile",
        );
    });

    it("describes an item from the description it is given", () => {
        render(
            <ActionList>
                <ActionList.Item>
                    Public
                    <ActionList.Description>Anyone can read this</ActionList.Description>
                </ActionList.Item>
            </ActionList>,
        );

        const button = screen.getByRole("button", { name: "Public" });
        const description = screen.getByText("Anyone can read this");

        expect(button).toHaveAttribute("aria-describedby", description.id);
    });

    it("reads a trailing visual as part of the item's name", () => {
        render(
            <ActionList>
                <ActionList.Item>
                    Copy link
                    <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
                </ActionList.Item>
            </ActionList>,
        );

        expect(screen.getByRole("button", { name: "Copy link ⌘C" })).toBeInTheDocument();
    });

    it("renders a trailing action beside the item", () => {
        render(
            <ActionList>
                <ActionList.Item>
                    main.ts
                    <ActionList.TrailingAction icon={CopyRegular} label="Copy the path" />
                </ActionList.Item>
            </ActionList>,
        );

        expect(screen.getByRole("button", { name: "Copy the path" })).toBeInTheDocument();
        expect(item("main.ts")).toHaveAttribute("data-has-trailing-action");
    });

    it("leaves a trailing action out of a menu, which has nowhere to put one", () => {
        render(
            <ActionList role="menu" aria-label="Files">
                <ActionList.Item>
                    main.ts
                    <ActionList.TrailingAction icon={CopyRegular} label="Copy the path" />
                </ActionList.Item>
            </ActionList>,
        );

        expect(screen.queryByRole("button", { name: "Copy the path" })).not.toBeInTheDocument();
    });

    it("renders a divider that is drawn but not read", () => {
        render(
            <ActionList>
                <ActionList.Item>Rename</ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item>Delete</ActionList.Item>
            </ActionList>,
        );

        const divider = document.querySelector("[data-component='ActionList.Divider']");
        expect(divider).toHaveAttribute("aria-hidden", "true");
    });

    it("moves focus between the items of a menu with the arrow keys", () => {
        render(
            <ActionList role="menu" aria-label="Actions">
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Rename</ActionList.Item>
                <ActionList.Item>Archive</ActionList.Item>
            </ActionList>,
        );

        act(() => {
            item("Copy link").focus();
        });

        fireEvent.keyDown(item("Copy link"), { key: "ArrowDown" });
        expect(item("Rename")).toHaveFocus();

        fireEvent.keyDown(item("Rename"), { key: "End" });
        expect(item("Archive")).toHaveFocus();

        // A menu is read round and round, so moving on from the last item comes back to the
        // first
        fireEvent.keyDown(item("Archive"), { key: "ArrowDown" });
        expect(item("Copy link")).toHaveFocus();
    });

    it("leaves the arrow keys alone where the focus zone is turned off", () => {
        render(
            <ActionList role="menu" aria-label="Actions" disableFocusZone>
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Rename</ActionList.Item>
            </ActionList>,
        );

        act(() => {
            item("Copy link").focus();
        });

        fireEvent.keyDown(item("Copy link"), { key: "ArrowDown" });

        expect(item("Copy link")).toHaveFocus();
    });

    it("takes a class name of the caller's own", () => {
        render(
            <ActionList className="custom">
                <ActionList.Item>Rename</ActionList.Item>
            </ActionList>,
        );

        expect(list()).toHaveClass("custom");
    });
});
