import * as React from "react";
import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NavigationMenu, useNavigationMenu } from ".";
import type { NavigationMenuProps } from "./NavigationMenu.types";

const originalResizeObserver = window.ResizeObserver;

type RenderOptions = {
    // Whatever stands after the row inside the menu, the viewport say
    inside?: React.ReactNode;
    // Whatever stands on the page after the menu, for focus to leave it for
    after?: React.ReactNode;
};

const renderMenu = (props: Partial<NavigationMenuProps> = {}, options: RenderOptions = {}) =>
    render(
        <>
            <NavigationMenu aria-label="Main" openDelay={100} closeDelay={100} {...props}>
                <NavigationMenu.List>
                    <NavigationMenu.Item value="product">
                        <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                            <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                            <NavigationMenu.Link href="#pricing">Pricing</NavigationMenu.Link>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item value="resources">
                        <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                        <NavigationMenu.Content>
                            <NavigationMenu.Link href="#docs">Documentation</NavigationMenu.Link>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>

                    <NavigationMenu.Item value="changelog">
                        <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
                {options.inside}
            </NavigationMenu>
            {options.after}
        </>,
    );

const menu = () => screen.getByRole("navigation", { name: "Main" });

const trigger = (name: string) => screen.getByRole("button", { name });

const link = (name: string) => screen.getByRole("link", { name });

// The panel the trigger says it opens, rather than one found by looking around the page, so
// the tests read it the way a screen reader is told to
const panel = (name: string) =>
    document.getElementById(trigger(name).getAttribute("aria-controls") ?? "") as HTMLElement;

const isOpen = (name: string) => trigger(name).getAttribute("aria-expanded") === "true";

const part = (name: string) =>
    document.querySelector(`[data-component='NavigationMenu.${name}']`) as HTMLElement | null;

// jsdom has no PointerEvent, so what kind of pointer it was has to be put on the event by hand
// rather than passed to `fireEvent` as part of its init. React reads the pointer crossing an
// element's edge from the over and out events, so those are what is sent
const pointer = (
    element: HTMLElement,
    crossing: "pointerOver" | "pointerOut",
    pointerType = "mouse",
) => {
    const event = createEvent[crossing](element);
    Object.defineProperty(event, "pointerType", { value: pointerType });
    fireEvent(element, event);
};

const pointerEnter = (element: HTMLElement, pointerType?: string) =>
    pointer(element, "pointerOver", pointerType);

const pointerLeave = (element: HTMLElement, pointerType?: string) =>
    pointer(element, "pointerOut", pointerType);

// The wait before the pointer opens a panel is what the delays are for, so the tests move the
// clock rather than the pointer
const wait = (milliseconds: number) =>
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });

const focus = (element: HTMLElement) => act(() => element.focus());

const keyDown = (element: HTMLElement, key: string, init: object = {}) =>
    fireEvent.keyDown(element, { key, ...init });

describe("NavigationMenu", () => {
    // jsdom has no ResizeObserver, and the menu watches the open item's trigger and the panel
    // it opened so it can be measured again as either moves
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders a landmark named by the label it was given", () => {
        renderMenu();

        expect(menu()).toHaveAttribute("data-component", "NavigationMenu");
        expect(menu()).toHaveAttribute("data-orientation", "horizontal");
        expect(menu()).toContainElement(trigger("Product"));
    });

    it("keeps every panel shut to begin with", () => {
        renderMenu();

        expect(isOpen("Product")).toBe(false);
        expect(panel("Product")).not.toBeVisible();
        expect(menu()).not.toHaveAttribute("data-open");
    });

    it("takes a shut panel out of the page rather than only hiding it", () => {
        renderMenu();

        // Nothing inside a shut panel can be tabbed to or read out
        expect(screen.queryByRole("link", { name: "Features" })).not.toBeInTheDocument();
    });

    describe("opening on a press", () => {
        it("opens the panel of the item that was pressed", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));

            expect(isOpen("Product")).toBe(true);
            expect(panel("Product")).toBeVisible();
            expect(link("Features")).toBeInTheDocument();
            expect(menu()).toHaveAttribute("data-open", "");
        });

        it("puts it away again on a second press", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            fireEvent.click(trigger("Product"));

            expect(isOpen("Product")).toBe(false);
        });

        it("takes away whichever panel stood open, since only one stands at a time", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            fireEvent.click(trigger("Resources"));

            expect(isOpen("Product")).toBe(false);
            expect(isOpen("Resources")).toBe(true);
        });

        it("leaves a press unanswered where it was told to", () => {
            renderMenu({ disableClickTrigger: true });

            fireEvent.click(trigger("Product"));

            expect(isOpen("Product")).toBe(false);
        });
    });

    describe("what the parts say about themselves", () => {
        it("says whether the trigger is expanded, and points at the panel it opens", () => {
            renderMenu();

            expect(trigger("Product")).toHaveAttribute("aria-expanded", "false");
            expect(trigger("Product")).toHaveAttribute("type", "button");
            expect(trigger("Product").getAttribute("aria-controls")).toBe(panel("Product").id);
        });

        it("names the panel by the trigger that opens it", () => {
            renderMenu();

            expect(panel("Product")).toHaveAttribute("aria-labelledby", trigger("Product").id);
        });

        it("carries the item's value on the parts standing in it", () => {
            renderMenu();
            fireEvent.click(trigger("Product"));

            expect(trigger("Product").closest("li")).toHaveAttribute("data-value", "product");
            expect(trigger("Product")).toHaveAttribute("data-value", "product");
            expect(panel("Product")).toHaveAttribute("data-value", "product");
            expect(link("Features")).toHaveAttribute("data-value", "product");
        });

        it("marks the parts of an open item", () => {
            renderMenu();
            fireEvent.click(trigger("Product"));

            expect(trigger("Product").closest("li")).toHaveAttribute("data-open", "");
            expect(trigger("Product")).toHaveAttribute("data-open", "");
            expect(panel("Product")).toHaveAttribute("data-open", "");
            expect(trigger("Resources")).not.toHaveAttribute("data-open");
        });

        it("hands where the open item's trigger stands to the stylesheet", () => {
            renderMenu();

            expect(menu().style.getPropertyValue("--navigation-menu-trigger-width")).toBe("");

            fireEvent.click(trigger("Product"));

            // jsdom lays nothing out, so everything measures nought
            expect(menu().style.getPropertyValue("--navigation-menu-trigger-width")).toBe("0px");
            expect(menu().style.getPropertyValue("--navigation-menu-trigger-x")).toBe("0px");
        });
    });

    describe("moving along the row", () => {
        it("moves on with the arrow keys, and stops at the last item", () => {
            renderMenu();

            focus(trigger("Product"));
            keyDown(trigger("Product"), "ArrowRight");
            expect(trigger("Resources")).toHaveFocus();

            keyDown(trigger("Resources"), "ArrowRight");
            expect(link("Changelog")).toHaveFocus();

            keyDown(link("Changelog"), "ArrowRight");
            expect(link("Changelog")).toHaveFocus();
        });

        it("goes back the other way", () => {
            renderMenu();

            focus(link("Changelog"));
            keyDown(link("Changelog"), "ArrowLeft");
            expect(trigger("Resources")).toHaveFocus();

            keyDown(trigger("Resources"), "ArrowLeft");
            expect(trigger("Product")).toHaveFocus();
        });

        it("jumps to either end", () => {
            renderMenu();

            focus(trigger("Resources"));
            keyDown(trigger("Resources"), "End");
            expect(link("Changelog")).toHaveFocus();

            keyDown(link("Changelog"), "Home");
            expect(trigger("Product")).toHaveFocus();
        });

        it("leaves the keys that run the other way alone", () => {
            renderMenu();

            focus(trigger("Resources"));
            keyDown(trigger("Resources"), "ArrowUp");

            expect(trigger("Resources")).toHaveFocus();
        });

        it("passes over an item that cannot be opened", () => {
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.List>
                        <NavigationMenu.Item value="product">
                            <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                        <NavigationMenu.Item value="resources" disabled>
                            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <NavigationMenu.Link href="#docs">
                                    Documentation
                                </NavigationMenu.Link>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                        <NavigationMenu.Item value="changelog">
                            <NavigationMenu.Link href="#changelog">Changelog</NavigationMenu.Link>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

            expect(trigger("Resources")).toBeDisabled();
            expect(trigger("Resources").closest("li")).toHaveAttribute("data-disabled", "");

            focus(trigger("Product"));
            keyDown(trigger("Product"), "ArrowRight");

            expect(link("Changelog")).toHaveFocus();
        });

        it("leaves the open panel standing while focus moves to another trigger", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            focus(trigger("Product"));
            keyDown(trigger("Product"), "ArrowRight");

            expect(trigger("Resources")).toHaveFocus();
            expect(isOpen("Product")).toBe(true);
        });
    });

    describe("moving down a column", () => {
        it("turns the keys onto the other axis", () => {
            renderMenu({ orientation: "vertical" });

            focus(trigger("Product"));
            keyDown(trigger("Product"), "ArrowDown");
            expect(trigger("Resources")).toHaveFocus();

            keyDown(trigger("Resources"), "ArrowUp");
            expect(trigger("Product")).toHaveFocus();

            keyDown(trigger("Product"), "ArrowRight");
            expect(trigger("Product")).not.toHaveFocus();
        });

        it("says which way the parts run", () => {
            renderMenu({ orientation: "vertical" });

            expect(menu()).toHaveAttribute("data-orientation", "vertical");
            expect(screen.getByRole("list")).toHaveAttribute("data-orientation", "vertical");
            expect(panel("Product")).toHaveAttribute("data-orientation", "vertical");
        });
    });

    describe("stepping into a panel", () => {
        it("opens the panel and moves focus into it in the one gesture", () => {
            renderMenu();

            focus(trigger("Product"));
            keyDown(trigger("Product"), "ArrowDown");

            expect(isOpen("Product")).toBe(true);
            expect(link("Features")).toHaveFocus();
        });

        it("steps into a panel that already stands open", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            focus(trigger("Product"));
            keyDown(trigger("Product"), "ArrowDown");

            expect(link("Features")).toHaveFocus();
        });

        it("steps in from the side where the items stand in a column", () => {
            renderMenu({ orientation: "vertical" });

            focus(trigger("Product"));
            keyDown(trigger("Product"), "ArrowRight");

            expect(isOpen("Product")).toBe(true);
            expect(link("Features")).toHaveFocus();
        });

        it("moves between the links in the panel, and stops at either end", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            focus(link("Features"));

            keyDown(link("Features"), "ArrowDown");
            expect(link("Pricing")).toHaveFocus();

            keyDown(link("Pricing"), "ArrowDown");
            expect(link("Pricing")).toHaveFocus();

            keyDown(link("Pricing"), "ArrowUp");
            expect(link("Features")).toHaveFocus();

            keyDown(link("Features"), "End");
            expect(link("Pricing")).toHaveFocus();

            keyDown(link("Pricing"), "Home");
            expect(link("Features")).toHaveFocus();
        });

        it("keeps the keys in the panel from moving along the row", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            focus(link("Pricing"));
            keyDown(link("Pricing"), "ArrowRight");

            expect(link("Pricing")).toHaveFocus();
            expect(isOpen("Product")).toBe(true);
        });

        it("steps through the panel on the tab key", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            focus(link("Features"));

            keyDown(link("Features"), "Tab");
            expect(link("Pricing")).toHaveFocus();

            keyDown(link("Pricing"), "Tab", { shiftKey: true });
            expect(link("Features")).toHaveFocus();
        });
    });

    it("closes on Escape and hands focus back to the trigger the panel was opened from", () => {
        renderMenu();

        focus(trigger("Product"));
        keyDown(trigger("Product"), "ArrowDown");
        expect(link("Features")).toHaveFocus();

        keyDown(document.body, "Escape");

        expect(isOpen("Product")).toBe(false);
        expect(trigger("Product")).toHaveFocus();
    });

    it("closes on a press anywhere else", () => {
        renderMenu();

        fireEvent.click(trigger("Product"));
        fireEvent.mouseDown(document.body);

        expect(isOpen("Product")).toBe(false);
    });

    it("leaves a press on a trigger to the trigger", () => {
        renderMenu();

        fireEvent.click(trigger("Product"));
        fireEvent.mouseDown(trigger("Resources"));

        expect(isOpen("Product")).toBe(true);

        fireEvent.click(trigger("Resources"));

        expect(isOpen("Resources")).toBe(true);
    });

    it("leaves a press inside the panel alone", () => {
        renderMenu();

        fireEvent.click(trigger("Product"));
        fireEvent.mouseDown(link("Features"));

        expect(isOpen("Product")).toBe(true);
    });

    it("closes once focus has left the menu altogether", () => {
        renderMenu({}, { after: <button type="button">Outside</button> });

        fireEvent.click(trigger("Product"));
        focus(link("Features"));
        focus(screen.getByRole("button", { name: "Outside" }));

        expect(isOpen("Product")).toBe(false);
    });

    describe("following a link", () => {
        it("puts the menu away", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            fireEvent.click(link("Features"));

            expect(isOpen("Product")).toBe(false);
        });

        it("leaves the menu standing where the link was told not to put it away", () => {
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.List>
                        <NavigationMenu.Item value="product">
                            <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <NavigationMenu.Link href="#features" closeOnClick={false}>
                                    Features
                                </NavigationMenu.Link>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

            fireEvent.click(trigger("Product"));
            fireEvent.click(link("Features"));

            expect(isOpen("Product")).toBe(true);
        });

        it("leaves the menu standing where the link was opened somewhere else", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            fireEvent.click(link("Features"), { ctrlKey: true });

            expect(isOpen("Product")).toBe(true);
        });

        it("marks the link standing for the page being read", () => {
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.List>
                        <NavigationMenu.Item value="changelog">
                            <NavigationMenu.Link href="#changelog" current>
                                Changelog
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

            expect(link("Changelog")).toHaveAttribute("aria-current", "page");
            expect(link("Changelog")).toHaveAttribute("data-current", "");
        });

        it("is drawn as whatever the caller asked for", () => {
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.List>
                        <NavigationMenu.Item value="changelog">
                            <NavigationMenu.Link as="button" type="button">
                                Changelog
                            </NavigationMenu.Link>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

            expect(screen.getByRole("button", { name: "Changelog" })).toHaveClass(
                "navigation-menu-link",
            );
        });
    });

    describe("opening on the pointer", () => {
        it("waits out the delay before opening", () => {
            renderMenu();

            pointerEnter(trigger("Product"));
            expect(isOpen("Product")).toBe(false);

            wait(99);
            expect(isOpen("Product")).toBe(false);

            wait(1);
            expect(isOpen("Product")).toBe(true);
        });

        it("does not open where the pointer moved on before the wait was out", () => {
            renderMenu();

            pointerEnter(trigger("Product"));
            pointerLeave(trigger("Product"));
            wait(500);

            expect(isOpen("Product")).toBe(false);
        });

        it("closes once the pointer has been gone for the closing delay", () => {
            renderMenu();

            pointerEnter(trigger("Product"));
            wait(100);
            expect(isOpen("Product")).toBe(true);

            pointerLeave(trigger("Product"));
            expect(isOpen("Product")).toBe(true);

            wait(100);
            expect(isOpen("Product")).toBe(false);
        });

        it("stays open while the pointer is on the panel", () => {
            renderMenu();

            pointerEnter(trigger("Product"));
            wait(100);
            pointerLeave(trigger("Product"));
            pointerEnter(panel("Product"));
            wait(500);

            expect(isOpen("Product")).toBe(true);

            pointerLeave(panel("Product"));
            wait(100);

            expect(isOpen("Product")).toBe(false);
        });

        it("switches at once where one panel already stands open", () => {
            renderMenu();

            pointerEnter(trigger("Product"));
            wait(100);

            pointerLeave(trigger("Product"));
            pointerEnter(trigger("Resources"));

            expect(isOpen("Product")).toBe(false);
            expect(isOpen("Resources")).toBe(true);
        });

        it("leaves a touch alone, since a tap has no pointer to move off the panel again", () => {
            renderMenu();

            pointerEnter(trigger("Product"), "touch");
            wait(500);

            expect(isOpen("Product")).toBe(false);
        });

        it("leaves the pointer alone where it was told to", () => {
            renderMenu({ disableHoverTrigger: true });

            pointerEnter(trigger("Product"));
            wait(500);
            expect(isOpen("Product")).toBe(false);

            // A menu that does not open on the pointer does not close on it either
            fireEvent.click(trigger("Product"));
            pointerEnter(panel("Product"));
            pointerLeave(panel("Product"));
            wait(500);

            expect(isOpen("Product")).toBe(true);
        });

        it("leaves a panel standing once the pointer has left it, where it was told to", () => {
            renderMenu({ disablePointerLeaveClose: true });

            pointerEnter(trigger("Product"));
            wait(100);
            pointerLeave(trigger("Product"));
            pointerEnter(panel("Product"));
            pointerLeave(panel("Product"));
            wait(500);

            expect(isOpen("Product")).toBe(true);
        });

        it("gives up a panel the pointer was about to open once something else has settled it", () => {
            renderMenu();

            pointerEnter(trigger("Product"));
            fireEvent.click(trigger("Resources"));
            wait(500);

            expect(isOpen("Resources")).toBe(true);
            expect(isOpen("Product")).toBe(false);
        });
    });

    describe("where the caller keeps hold of the menu", () => {
        it("stands open because it was told to rather than because of a press", () => {
            renderMenu({ value: "resources" });

            expect(isOpen("Resources")).toBe(true);
            expect(isOpen("Product")).toBe(false);
        });

        it("stays as it is until the caller says otherwise", () => {
            const onValueChange = vi.fn();
            renderMenu({ value: "", onValueChange });

            fireEvent.click(trigger("Product"));

            expect(isOpen("Product")).toBe(false);
            expect(onValueChange).toHaveBeenCalledWith({ value: "product" });
        });

        it("reports a panel opening and closing either way", () => {
            const onValueChange = vi.fn();
            renderMenu({ onValueChange });

            fireEvent.click(trigger("Product"));
            expect(onValueChange).toHaveBeenLastCalledWith({ value: "product" });

            fireEvent.click(trigger("Product"));
            expect(onValueChange).toHaveBeenLastCalledWith({ value: "" });
            expect(onValueChange).toHaveBeenCalledTimes(2);
        });

        it("opens whichever panel it was told to start with", () => {
            renderMenu({ defaultValue: "product" });

            expect(isOpen("Product")).toBe(true);
        });
    });

    describe("the mark sliding along the row", () => {
        const indicator = () => part("Indicator") as HTMLElement;

        const renderIndicator = () =>
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.List>
                        <NavigationMenu.Item value="product">
                            <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <NavigationMenu.Link href="#features">Features</NavigationMenu.Link>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                        <NavigationMenu.Item value="resources">
                            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                            <NavigationMenu.ItemIndicator />
                            <NavigationMenu.Content>
                                <NavigationMenu.Link href="#docs">
                                    Documentation
                                </NavigationMenu.Link>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                        <NavigationMenu.Indicator>
                            <NavigationMenu.Arrow />
                        </NavigationMenu.Indicator>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

        it("is kept out of the way while the menu is shut", () => {
            renderIndicator();

            expect(indicator()).not.toBeVisible();
            expect(indicator()).toHaveAttribute("aria-hidden", "true");
        });

        it("is held still where the menu has only just opened, and slid after that", () => {
            renderIndicator();

            fireEvent.click(trigger("Product"));

            expect(indicator()).toBeVisible();
            expect(indicator()).toHaveAttribute("data-open", "");
            expect(indicator()).toHaveAttribute("data-still", "");

            fireEvent.click(trigger("Resources"));

            expect(indicator()).not.toHaveAttribute("data-still");
        });

        it("carries the arrow, pointing back at the row", () => {
            renderIndicator();

            const arrow = part("Arrow") as HTMLElement;

            expect(indicator()).toContainElement(arrow);
            expect(arrow).toHaveAttribute("data-location", "top");
            expect(arrow).toHaveClass("navigation-menu-arrow");
        });

        it("marks one item in place while its panel stands open", () => {
            renderIndicator();

            const itemIndicator = part("ItemIndicator") as HTMLElement;

            expect(itemIndicator).not.toBeVisible();

            fireEvent.click(trigger("Resources"));

            expect(itemIndicator).toBeVisible();
            expect(itemIndicator).toHaveAttribute("data-value", "resources");
        });
    });

    describe("drawing every panel in the one viewport", () => {
        const viewport = () => part("Viewport") as HTMLElement;

        const renderViewport = () =>
            renderMenu(
                {},
                {
                    inside: (
                        <NavigationMenu.Positioner align="start">
                            <NavigationMenu.Viewport />
                        </NavigationMenu.Positioner>
                    ),
                },
            );

        it("carries the panels off into the viewport", () => {
            renderViewport();

            expect(viewport()).toContainElement(panel("Product"));
            expect(viewport()).toContainElement(panel("Resources"));
            expect(trigger("Product").closest("li")).not.toContainElement(panel("Product"));
        });

        it("keeps the viewport out of the way while the menu is shut", () => {
            renderViewport();

            expect(viewport()).not.toBeVisible();
            expect(part("Positioner")).toHaveAttribute("data-align", "start");

            fireEvent.click(trigger("Product"));

            expect(viewport()).toBeVisible();
            expect(viewport()).toHaveAttribute("data-open", "");
            expect(viewport()).toHaveAttribute("data-still", "");
            expect(viewport().style.getPropertyValue("--navigation-menu-viewport-width")).toBe(
                "0px",
            );
        });

        it("shows only the open panel in it", () => {
            renderViewport();

            fireEvent.click(trigger("Product"));

            expect(panel("Product")).toBeVisible();
            expect(panel("Resources")).not.toBeVisible();
        });

        it("says which way a panel arrived from as it takes another's place", () => {
            renderViewport();

            fireEvent.click(trigger("Product"));
            expect(panel("Product")).not.toHaveAttribute("data-motion");

            fireEvent.click(trigger("Resources"));
            expect(panel("Resources")).toHaveAttribute("data-motion", "from-end");

            fireEvent.click(trigger("Product"));
            expect(panel("Product")).toHaveAttribute("data-motion", "from-start");
        });

        it("leaves a stand-in after the trigger for a screen reader", () => {
            renderViewport();

            fireEvent.click(trigger("Product"));

            const proxy = trigger("Product")
                .closest("li")
                ?.querySelector("[data-component='NavigationMenu.ViewportProxy']");

            expect(proxy).toHaveAttribute("aria-owns", panel("Product").id);
        });

        it("steps into the panel from the stop after the trigger", () => {
            renderViewport();

            fireEvent.click(trigger("Product"));

            const stop = document.getElementById(
                trigger("Product")
                    .closest("li")
                    ?.querySelector<HTMLElement>("[data-component='NavigationMenu.TriggerProxy']")
                    ?.id ?? "",
            ) as HTMLElement;

            expect(stop).toHaveAttribute("aria-hidden", "true");
            expect(stop).toHaveAttribute("tabindex", "0");

            focus(trigger("Product"));
            fireEvent.focus(stop, { relatedTarget: trigger("Product") });

            expect(link("Features")).toHaveFocus();
        });

        it("hands the tab key back to the stop at the end of the panel", () => {
            renderViewport();

            fireEvent.click(trigger("Product"));
            focus(link("Pricing"));
            keyDown(link("Pricing"), "Tab");

            expect(part("TriggerProxy")).toHaveFocus();
        });
    });

    describe("read from inside", () => {
        const Reader = () => {
            const { value, open, setValue } = useNavigationMenu();

            return (
                <>
                    <output>{open ? value : "nothing"}</output>
                    <button type="button" onClick={() => setValue("resources")}>
                        Open resources
                    </button>
                </>
            );
        };

        it("says which item stands open, and opens another", () => {
            renderMenu({}, { inside: <Reader /> });

            expect(screen.getByRole("status")).toHaveTextContent("nothing");

            fireEvent.click(trigger("Product"));
            expect(screen.getByRole("status")).toHaveTextContent("product");

            fireEvent.click(screen.getByRole("button", { name: "Open resources" }));
            expect(isOpen("Resources")).toBe(true);
        });

        it("is a mistake outside a menu", () => {
            const error = vi.spyOn(console, "error").mockImplementation(() => {});

            expect(() => render(<Reader />)).toThrow(/within a `NavigationMenu`/);

            error.mockRestore();
        });
    });

    it("draws nothing for a part written outside a menu, or a trigger outside an item", () => {
        const { container } = render(
            <>
                <NavigationMenu.List>
                    <NavigationMenu.Item value="loose">Nowhere to stand</NavigationMenu.Item>
                </NavigationMenu.List>
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                    <NavigationMenu.Content>Nowhere to be opened from</NavigationMenu.Content>
                </NavigationMenu>
            </>,
        );

        expect(screen.queryByText("Nowhere to stand")).not.toBeInTheDocument();
        expect(container.querySelector("button")).toBeNull();
        expect(screen.queryByText("Nowhere to be opened from")).not.toBeInTheDocument();
    });

    it("merges a custom className onto each of the parts", () => {
        render(
            <NavigationMenu aria-label="Main" className="custom-menu">
                <NavigationMenu.List className="custom-list">
                    <NavigationMenu.Item className="custom-item" value="product">
                        <NavigationMenu.Trigger className="custom-trigger">
                            Product
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content className="custom-content">
                            <NavigationMenu.Link href="#features" className="custom-link">
                                Features
                            </NavigationMenu.Link>
                        </NavigationMenu.Content>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
            </NavigationMenu>,
        );

        expect(menu()).toHaveClass("navigation-menu", "custom-menu");
        expect(screen.getByRole("list")).toHaveClass("navigation-menu-list", "custom-list");
        expect(trigger("Product").closest("li")).toHaveClass("navigation-menu-item", "custom-item");
        expect(trigger("Product")).toHaveClass("navigation-menu-trigger", "custom-trigger");
        expect(panel("Product")).toHaveClass("navigation-menu-content", "custom-content");

        fireEvent.click(trigger("Product"));
        expect(link("Features")).toHaveClass("navigation-menu-link", "custom-link");
    });
});
