import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { MoreHorizontalRegular } from "@gamecrafters/base-ui-icons";
import { ActionList } from "../action-list";
import { IconButton } from "../icon-button";
import { ActionMenu } from ".";

const originalResizeObserver = window.ResizeObserver;

const renderMenu = (props: Partial<React.ComponentProps<typeof ActionMenu>> = {}) =>
    render(
        <ActionMenu {...props}>
            <ActionMenu.Button>Actions</ActionMenu.Button>
            <ActionMenu.Overlay>
                <ActionList>
                    <ActionList.Item>Copy link</ActionList.Item>
                    <ActionList.Item>Rename</ActionList.Item>
                </ActionList>
            </ActionMenu.Overlay>
        </ActionMenu>,
    );

const anchor = () => screen.getByRole("button", { name: "Actions" });

const menu = () => screen.queryByRole("menu");

describe("ActionMenu", () => {
    // jsdom has no ResizeObserver, and the overlay under the menu watches its own size so
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

    it("renders the button that opens it, and nothing else to start with", () => {
        renderMenu();

        expect(anchor()).toBeInTheDocument();
        expect(menu()).not.toBeInTheDocument();
    });

    it("says that the button opens something", () => {
        renderMenu();

        expect(anchor()).toHaveAttribute("aria-haspopup", "true");
        expect(anchor()).toHaveAttribute("aria-expanded", "false");
    });

    it("opens when the button is clicked, and closes when it is clicked again", () => {
        renderMenu();

        fireEvent.click(anchor());
        expect(menu()).toBeInTheDocument();
        expect(anchor()).toHaveAttribute("aria-expanded", "true");

        fireEvent.click(anchor());
        expect(menu()).not.toBeInTheDocument();
    });

    it("opens on the keys that would open a menu", () => {
        renderMenu();

        fireEvent.keyDown(anchor(), { key: "ArrowDown" });

        expect(menu()).toBeInTheDocument();
    });

    it("reads its items as menu items, and is named by the button that opens it", () => {
        renderMenu();

        fireEvent.click(anchor());

        expect(screen.getAllByRole("menuitem")).toHaveLength(2);
        expect(menu()).toHaveAttribute("aria-labelledby", anchor().id);
    });

    it("closes once an item is picked", () => {
        const onSelect = jest.fn();
        render(
            <ActionMenu>
                <ActionMenu.Button>Actions</ActionMenu.Button>
                <ActionMenu.Overlay>
                    <ActionList>
                        <ActionList.Item onSelect={onSelect}>Copy link</ActionList.Item>
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>,
        );

        fireEvent.click(anchor());
        fireEvent.click(screen.getByRole("menuitem", { name: "Copy link" }));

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(menu()).not.toBeInTheDocument();
    });

    it("stays open for an item that answers the event itself", () => {
        render(
            <ActionMenu>
                <ActionMenu.Button>Actions</ActionMenu.Button>
                <ActionMenu.Overlay>
                    <ActionList selectionVariant="multiple">
                        <ActionList.Item onSelect={(event) => event.preventDefault()}>
                            Issues
                        </ActionList.Item>
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>,
        );

        fireEvent.click(anchor());
        fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Issues" }));

        expect(menu()).toBeInTheDocument();
    });

    it("closes on Escape", () => {
        renderMenu();

        fireEvent.click(anchor());
        fireEvent.keyDown(document, { key: "Escape" });

        expect(menu()).not.toBeInTheDocument();
    });

    it("closes when the reader tabs away from it", () => {
        renderMenu();

        fireEvent.click(anchor());
        fireEvent.keyDown(screen.getByRole("menuitem", { name: "Copy link" }), { key: "Tab" });

        expect(menu()).not.toBeInTheDocument();
    });

    it("moves focus into the menu as it opens", () => {
        renderMenu();

        fireEvent.click(anchor());

        expect(screen.getByRole("menuitem", { name: "Copy link" })).toHaveFocus();
    });

    it("moves focus between its items with the arrow keys", () => {
        renderMenu();

        fireEvent.click(anchor());
        fireEvent.keyDown(screen.getByRole("menuitem", { name: "Copy link" }), {
            key: "ArrowDown",
        });

        expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    });

    it("says which of its items is picked", () => {
        render(
            <ActionMenu>
                <ActionMenu.Button>Sort</ActionMenu.Button>
                <ActionMenu.Overlay>
                    <ActionList selectionVariant="single">
                        <ActionList.Item selected>Newest</ActionList.Item>
                        <ActionList.Item>Oldest</ActionList.Item>
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>,
        );

        fireEvent.click(screen.getByRole("button", { name: "Sort" }));

        expect(screen.getByRole("menuitemradio", { name: "Newest" })).toHaveAttribute(
            "aria-checked",
            "true",
        );
        expect(screen.getByRole("menuitemradio", { name: "Oldest" })).toHaveAttribute(
            "aria-checked",
            "false",
        );
    });

    it("opens from an anchor of the caller's own", () => {
        render(
            <ActionMenu>
                <ActionMenu.Anchor>
                    <IconButton
                        icon={MoreHorizontalRegular}
                        aria-label="More actions"
                        variant="invisible"
                    />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay>
                    <ActionList>
                        <ActionList.Item>Copy link</ActionList.Item>
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>,
        );

        fireEvent.click(screen.getByRole("button", { name: "More actions" }));

        expect(menu()).toBeInTheDocument();
    });

    it("still calls the anchor's own handlers", () => {
        const onClick = jest.fn();
        render(
            <ActionMenu>
                <ActionMenu.Button onClick={onClick}>Actions</ActionMenu.Button>
                <ActionMenu.Overlay>
                    <ActionList>
                        <ActionList.Item>Copy link</ActionList.Item>
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>,
        );

        fireEvent.click(anchor());

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(menu()).toBeInTheDocument();
    });

    it("takes the open state from the caller where it is given one", () => {
        const onOpenChange = jest.fn();
        renderMenu({ open: false, onOpenChange });

        fireEvent.click(anchor());

        // The caller was told, and nothing opened until they said so
        expect(onOpenChange).toHaveBeenCalledWith(true);
        expect(menu()).not.toBeInTheDocument();
    });

    it("opens a menu within a menu from the item that holds it", () => {
        render(
            <ActionMenu>
                <ActionMenu.Button>Actions</ActionMenu.Button>
                <ActionMenu.Overlay>
                    <ActionList>
                        <ActionMenu>
                            <ActionMenu.Anchor>
                                <ActionList.Item>Share</ActionList.Item>
                            </ActionMenu.Anchor>
                            <ActionMenu.Overlay>
                                <ActionList>
                                    <ActionList.Item>Copy link</ActionList.Item>
                                </ActionList>
                            </ActionMenu.Overlay>
                        </ActionMenu>
                    </ActionList>
                </ActionMenu.Overlay>
            </ActionMenu>,
        );

        fireEvent.click(anchor());
        fireEvent.click(screen.getByRole("menuitem", { name: "Share" }));

        expect(screen.getAllByRole("menu")).toHaveLength(2);
        expect(screen.getByRole("menuitem", { name: "Copy link" })).toBeInTheDocument();
    });
});
