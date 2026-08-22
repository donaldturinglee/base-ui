import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { ActionList } from "../action-list";
import { ActionMenu } from "../action-menu";
import { ContextMenu } from ".";

const originalResizeObserver = window.ResizeObserver;

const renderMenu = (props: Partial<React.ComponentProps<typeof ContextMenu>> = {}) =>
    render(
        <ContextMenu {...props}>
            <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
            <ContextMenu.Overlay>
                <ActionList>
                    <ActionList.Item>Copy link</ActionList.Item>
                    <ActionList.Item>Rename</ActionList.Item>
                </ActionList>
            </ContextMenu.Overlay>
        </ContextMenu>,
    );

const trigger = () => screen.getByText("Right click here");

const menu = () => screen.queryByRole("menu");

const point = () => document.querySelector("[data-component='ContextMenu.Point']");

// A finger coming down on the trigger and resting there for as long as it takes to be read as
// a press rather than a tap
const longPress = (at: { x: number; y: number }) => {
    fireEvent.touchStart(trigger(), { touches: [{ clientX: at.x, clientY: at.y }] });

    act(() => {
        vi.advanceTimersByTime(500);
    });
};

describe("ContextMenu", () => {
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

    it("renders the area it is opened from, and nothing else to start with", () => {
        renderMenu();

        expect(trigger()).toBeInTheDocument();
        expect(menu()).not.toBeInTheDocument();
    });

    it("opens where the page was right clicked", () => {
        renderMenu();

        fireEvent.contextMenu(trigger(), { clientX: 40, clientY: 60 });

        expect(menu()).toBeInTheDocument();
        expect(point()).toHaveStyle({
            "--context-menu-point-left": "40px",
            "--context-menu-point-top": "60px",
        });
    });

    it("stands in place of the browser's own menu", () => {
        renderMenu();

        // The event was taken, which is what keeps the browser from answering it as well
        expect(fireEvent.contextMenu(trigger(), { clientX: 0, clientY: 0 })).toBe(false);
    });

    it("reads its items as menu items, and says what it is", () => {
        renderMenu();

        fireEvent.contextMenu(trigger());

        expect(screen.getAllByRole("menuitem")).toHaveLength(2);
        expect(menu()).toHaveAttribute("aria-label", "Context menu");
    });

    it("takes the name the caller gives it", () => {
        render(
            <ContextMenu>
                <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                <ContextMenu.Overlay aria-label="File actions">
                    <ActionList>
                        <ActionList.Item>Copy link</ActionList.Item>
                    </ActionList>
                </ContextMenu.Overlay>
            </ContextMenu>,
        );

        fireEvent.contextMenu(trigger());

        expect(menu()).toHaveAttribute("aria-label", "File actions");
    });

    it("is named after something already on the page where it is pointed at one", () => {
        render(
            <ContextMenu>
                <ContextMenu.Trigger>
                    <span id="file-name">Report.pdf</span>
                </ContextMenu.Trigger>
                <ContextMenu.Overlay aria-labelledby="file-name">
                    <ActionList>
                        <ActionList.Item>Copy link</ActionList.Item>
                    </ActionList>
                </ContextMenu.Overlay>
            </ContextMenu>,
        );

        fireEvent.contextMenu(screen.getByText("Report.pdf"));

        expect(menu()).toHaveAttribute("aria-labelledby", "file-name");
        expect(menu()).not.toHaveAttribute("aria-label");
    });

    it("moves the menu to wherever it was asked for next", () => {
        renderMenu();

        fireEvent.contextMenu(trigger(), { clientX: 10, clientY: 20 });
        fireEvent.contextMenu(trigger(), { clientX: 80, clientY: 90 });

        expect(point()).toHaveStyle({
            "--context-menu-point-left": "80px",
            "--context-menu-point-top": "90px",
        });
    });

    it("closes once an item is picked", () => {
        const onSelect = vi.fn();
        render(
            <ContextMenu>
                <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                <ContextMenu.Overlay>
                    <ActionList>
                        <ActionList.Item onSelect={onSelect}>Copy link</ActionList.Item>
                    </ActionList>
                </ContextMenu.Overlay>
            </ContextMenu>,
        );

        fireEvent.contextMenu(trigger());
        fireEvent.click(screen.getByRole("menuitem", { name: "Copy link" }));

        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(menu()).not.toBeInTheDocument();
    });

    it("stays open for an item that answers the event itself", () => {
        render(
            <ContextMenu>
                <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                <ContextMenu.Overlay>
                    <ActionList selectionVariant="multiple">
                        <ActionList.Item onSelect={(event) => event.preventDefault()}>
                            Issues
                        </ActionList.Item>
                    </ActionList>
                </ContextMenu.Overlay>
            </ContextMenu>,
        );

        fireEvent.contextMenu(trigger());
        fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Issues" }));

        expect(menu()).toBeInTheDocument();
    });

    it("closes on Escape", () => {
        renderMenu();

        fireEvent.contextMenu(trigger());
        fireEvent.keyDown(document, { key: "Escape" });

        expect(menu()).not.toBeInTheDocument();
    });

    it("closes when the reader tabs away from it", () => {
        renderMenu();

        fireEvent.contextMenu(trigger());
        fireEvent.keyDown(screen.getByRole("menuitem", { name: "Copy link" }), { key: "Tab" });

        expect(menu()).not.toBeInTheDocument();
    });

    it("closes when something else on the page is pressed", () => {
        renderMenu();

        fireEvent.contextMenu(trigger());
        fireEvent.mouseDown(document.body);

        expect(menu()).not.toBeInTheDocument();
    });

    it("moves focus into the menu as it opens, and back to the area it came from", () => {
        renderMenu();

        fireEvent.contextMenu(trigger());
        expect(screen.getByRole("menuitem", { name: "Copy link" })).toHaveFocus();

        fireEvent.keyDown(document, { key: "Escape" });
        expect(trigger()).toHaveFocus();
    });

    it("moves focus between its items with the arrow keys", () => {
        renderMenu();

        fireEvent.contextMenu(trigger());
        fireEvent.keyDown(screen.getByRole("menuitem", { name: "Copy link" }), {
            key: "ArrowDown",
        });

        expect(screen.getByRole("menuitem", { name: "Rename" })).toHaveFocus();
    });

    it("leaves the press alone once it has been turned off", () => {
        renderMenu({ disabled: true });

        expect(fireEvent.contextMenu(trigger())).toBe(true);
        expect(menu()).not.toBeInTheDocument();
    });

    it("takes the open state from the caller where it is given one", () => {
        const onOpenChange = vi.fn();
        renderMenu({ open: false, onOpenChange });

        fireEvent.contextMenu(trigger());

        // The caller was told, and nothing opened until they said so
        expect(onOpenChange).toHaveBeenCalledWith(true);
        expect(menu()).not.toBeInTheDocument();
    });

    it("still calls the trigger's own handlers", () => {
        const onContextMenu = vi.fn();
        render(
            <ContextMenu>
                <ContextMenu.Trigger onContextMenu={onContextMenu}>
                    Right click here
                </ContextMenu.Trigger>
                <ContextMenu.Overlay>
                    <ActionList>
                        <ActionList.Item>Copy link</ActionList.Item>
                    </ActionList>
                </ContextMenu.Overlay>
            </ContextMenu>,
        );

        fireEvent.contextMenu(trigger());

        expect(onContextMenu).toHaveBeenCalledTimes(1);
        expect(menu()).toBeInTheDocument();
    });

    it("leaves a press the trigger's own handler answered to whatever answered it", () => {
        render(
            <ContextMenu>
                <ContextMenu.Trigger onContextMenu={(event) => event.preventDefault()}>
                    Right click here
                </ContextMenu.Trigger>
                <ContextMenu.Overlay>
                    <ActionList>
                        <ActionList.Item>Copy link</ActionList.Item>
                    </ActionList>
                </ContextMenu.Overlay>
            </ContextMenu>,
        );

        fireEvent.contextMenu(trigger());

        expect(menu()).not.toBeInTheDocument();
    });

    it("opens a menu within a menu, and closes the whole stack once an item is picked", () => {
        render(
            <ContextMenu>
                <ContextMenu.Trigger>Right click here</ContextMenu.Trigger>
                <ContextMenu.Overlay>
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
                </ContextMenu.Overlay>
            </ContextMenu>,
        );

        fireEvent.contextMenu(trigger());
        fireEvent.click(screen.getByRole("menuitem", { name: "Share" }));
        expect(screen.getAllByRole("menu")).toHaveLength(2);

        fireEvent.click(screen.getByRole("menuitem", { name: "Copy link" }));
        expect(screen.queryAllByRole("menu")).toHaveLength(0);
    });

    describe("a press that is held", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("opens where the finger came down", () => {
            renderMenu();

            longPress({ x: 30, y: 50 });

            expect(menu()).toBeInTheDocument();
            expect(point()).toHaveStyle({
                "--context-menu-point-left": "30px",
                "--context-menu-point-top": "50px",
            });
        });

        it("stands the menu clear of the finger that asked for it", () => {
            renderMenu();

            longPress({ x: 30, y: 50 });

            expect(point()).toHaveStyle({ "--context-menu-point-size": "10px" });
        });

        it("does not open until it has been held long enough", () => {
            renderMenu();

            fireEvent.touchStart(trigger(), { touches: [{ clientX: 30, clientY: 50 }] });

            act(() => {
                vi.advanceTimersByTime(400);
            });

            expect(menu()).not.toBeInTheDocument();
        });

        it("is called off by a finger that was scrolling rather than resting", () => {
            renderMenu();

            fireEvent.touchStart(trigger(), { touches: [{ clientX: 30, clientY: 50 }] });
            fireEvent.touchMove(trigger(), { touches: [{ clientX: 30, clientY: 90 }] });

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(menu()).not.toBeInTheDocument();
        });

        it("is left standing by a finger that barely moved", () => {
            renderMenu();

            fireEvent.touchStart(trigger(), { touches: [{ clientX: 30, clientY: 50 }] });
            fireEvent.touchMove(trigger(), { touches: [{ clientX: 33, clientY: 52 }] });

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(menu()).toBeInTheDocument();
        });

        it("is called off by a finger that was lifted again", () => {
            renderMenu();

            fireEvent.touchStart(trigger(), { touches: [{ clientX: 30, clientY: 50 }] });
            fireEvent.touchEnd(trigger());

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(menu()).not.toBeInTheDocument();
        });

        it("leaves the press alone once it has been turned off", () => {
            renderMenu({ disabled: true });

            longPress({ x: 30, y: 50 });

            expect(menu()).not.toBeInTheDocument();
        });
    });
});
