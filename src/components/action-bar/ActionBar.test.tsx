import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import {
    ArrowSortRegular,
    CopyRegular,
    DeleteRegular,
    EditRegular,
} from "@gamecrafters/base-ui-icons";
import { ActionBar } from ".";

const originalIntersectionObserver = window.IntersectionObserver;
const originalResizeObserver = window.ResizeObserver;

type Watched = {
    element: Element;
    callback: IntersectionObserverCallback;
    observer: IntersectionObserver;
};

let watched: Watched[] = [];

// Reports that an element has been cut off by the row it stands in, which is how the bar is
// told that it no longer fits
const clip = (element: Element) => {
    const entry = watched.find((one) => one.element === element);

    if (!entry) {
        throw new Error("The element is not being watched");
    }

    act(() => {
        entry.callback(
            [{ target: element, intersectionRatio: 0 } as IntersectionObserverEntry],
            entry.observer,
        );
    });
};

const toolbar = () => screen.getByRole("toolbar");

const button = (name: string) => screen.getByRole("button", { name });

const moreButton = () => button("More items");

describe("ActionBar", () => {
    // jsdom has neither observer, and the bar watches its items to work out which of them
    // still fit while the overlay under its menu watches its own size
    beforeEach(() => {
        watched = [];

        window.IntersectionObserver = class {
            private readonly callback: IntersectionObserverCallback;

            constructor(callback: IntersectionObserverCallback) {
                this.callback = callback;
            }

            observe(element: Element) {
                watched.push({
                    element,
                    callback: this.callback,
                    observer: this as unknown as IntersectionObserver,
                });
            }

            unobserve() {}
            disconnect() {}
        } as unknown as typeof IntersectionObserver;

        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders a toolbar with the name it is given", () => {
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
            </ActionBar>,
        );

        expect(toolbar()).toHaveAccessibleName("File actions");
    });

    it("tags the bar with a data-component attribute", () => {
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
            </ActionBar>,
        );

        expect(document.querySelector("[data-component='ActionBar']")).toBeInTheDocument();
    });

    it("renders the items it is given, and a button for whatever no longer fits", () => {
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
                <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
            </ActionBar>,
        );

        expect(button("Rename")).toBeInTheDocument();
        expect(button("Copy link")).toBeInTheDocument();
        expect(moreButton()).toBeInTheDocument();
    });

    it("offers an item that no longer fits from the menu instead", () => {
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
                <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
            </ActionBar>,
        );

        clip(button("Copy link"));

        expect(button("Copy link")).toHaveAttribute("data-overflowing");
        expect(toolbar()).toHaveAttribute("data-has-overflow");

        fireEvent.click(moreButton());

        expect(screen.getByRole("menuitem", { name: "Copy link" })).toBeInTheDocument();
        expect(screen.queryByRole("menuitem", { name: "Rename" })).not.toBeInTheDocument();
    });

    it("does the same thing from the menu as the item itself would have done", () => {
        const onClick = jest.fn();
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.IconButton icon={EditRegular} aria-label="Rename" onClick={onClick} />
            </ActionBar>,
        );

        clip(button("Rename"));
        fireEvent.click(moreButton());
        fireEvent.click(screen.getByRole("menuitem", { name: "Rename" }));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("shows a button's own label in the menu", () => {
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.Button leadingVisual={EditRegular}>Rename</ActionBar.Button>
            </ActionBar>,
        );

        clip(button("Rename"));
        fireEvent.click(moreButton());

        expect(screen.getByRole("menuitem", { name: "Rename" })).toBeInTheDocument();
    });

    it("carries a divider that no longer fits into the menu as a divider", () => {
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
                <ActionBar.Divider />
                <ActionBar.IconButton icon={DeleteRegular} aria-label="Delete" />
            </ActionBar>,
        );

        const divider = document.querySelector(
            "[data-component='ActionBar.Divider']",
        ) as HTMLElement;

        clip(divider);
        clip(button("Delete"));
        fireEvent.click(moreButton());

        expect(document.querySelector("[data-component='ActionList.Divider']")).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
    });

    it("carries a group into the menu all at once", () => {
        render(
            <ActionBar aria-label="Text actions">
                <ActionBar.Group>
                    <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
                    <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
                </ActionBar.Group>
            </ActionBar>,
        );

        const group = document.querySelector("[data-component='ActionBar.Group']") as HTMLElement;

        clip(group);
        fireEvent.click(moreButton());

        expect(screen.getByRole("menuitem", { name: "Rename" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Copy link" })).toBeInTheDocument();
    });

    it("renders a menu of its own, and offers it as a menu within the overflow menu", () => {
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.Menu
                    icon={ArrowSortRegular}
                    aria-label="Sort by"
                    items={[{ label: "Newest" }, { label: "Oldest" }]}
                />
            </ActionBar>,
        );

        fireEvent.click(button("Sort by"));
        expect(screen.getByRole("menuitem", { name: "Newest" })).toBeInTheDocument();
        fireEvent.keyDown(document, { key: "Escape" });

        clip(button("Sort by"));
        fireEvent.click(moreButton());

        fireEvent.click(screen.getByRole("menuitem", { name: "Sort by" }));
        expect(screen.getByRole("menuitem", { name: "Oldest" })).toBeInTheDocument();
    });

    it("moves focus along the bar with the arrow keys", () => {
        render(
            <ActionBar aria-label="File actions">
                <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
                <ActionBar.IconButton icon={CopyRegular} aria-label="Copy link" />
            </ActionBar>,
        );

        act(() => {
            button("Rename").focus();
        });

        fireEvent.keyDown(button("Rename"), { key: "ArrowRight" });

        expect(button("Copy link")).toHaveFocus();
    });

    it("takes a size for the items it holds", () => {
        render(
            <ActionBar aria-label="File actions" size="large">
                <ActionBar.IconButton icon={EditRegular} aria-label="Rename" />
            </ActionBar>,
        );

        expect(toolbar()).toHaveAttribute("data-size", "large");
        expect(button("Rename")).toHaveAttribute("data-size", "large");
    });
});
