import * as React from "react";
import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NavigationMenu } from ".";
import type { NavigationMenuProps } from "./NavigationMenu.types";

const renderMenu = (props: Partial<NavigationMenuProps> = {}) =>
    render(
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
        </NavigationMenu>,
    );

const trigger = (name: string) => screen.getByRole("button", { name });

const link = (name: string) => screen.getByRole("link", { name });

const item = (name: string) => trigger(name).closest("li") as HTMLElement;

// The panel the trigger says it opens, rather than one found by looking around the page, so
// the tests read it the way a screen reader is told to
const panel = (name: string) =>
    document.getElementById(trigger(name).getAttribute("aria-controls") ?? "") as HTMLElement;

const isOpen = (name: string) => trigger(name).getAttribute("aria-expanded") === "true";

// The wait before the pointer opens a panel is what the delays are for, so the tests move the
// clock rather than the pointer
const wait = (milliseconds: number) =>
    act(() => {
        vi.advanceTimersByTime(milliseconds);
    });

const focus = (element: HTMLElement) => act(() => element.focus());

describe("NavigationMenu", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("renders a landmark named by the label it was given", () => {
        renderMenu();

        const menu = screen.getByRole("navigation", { name: "Main" });
        expect(menu).toHaveAttribute("data-component", "NavigationMenu");
        expect(menu).toContainElement(trigger("Product"));
    });

    it("keeps every panel shut to begin with", () => {
        renderMenu();

        expect(isOpen("Product")).toBe(false);
        expect(panel("Product")).not.toBeVisible();
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
    });

    describe("what the trigger points at", () => {
        it("says whether it is expanded, and points at the panel it opens", () => {
            renderMenu();

            expect(trigger("Product")).toHaveAttribute("aria-expanded", "false");
            expect(trigger("Product").getAttribute("aria-controls")).toBe(panel("Product").id);
        });

        it("names the panel by the trigger that opens it", () => {
            renderMenu();

            expect(panel("Product")).toHaveAttribute("aria-labelledby", trigger("Product").id);
        });
    });

    describe("moving along the row", () => {
        it("moves on with the arrow keys, and wraps round from the last item to the first", () => {
            renderMenu();

            focus(trigger("Product"));
            fireEvent.keyDown(trigger("Product"), { key: "ArrowRight" });
            expect(trigger("Resources")).toHaveFocus();

            fireEvent.keyDown(trigger("Resources"), { key: "ArrowRight" });
            expect(link("Changelog")).toHaveFocus();

            fireEvent.keyDown(link("Changelog"), { key: "ArrowRight" });
            expect(trigger("Product")).toHaveFocus();
        });

        it("goes back the other way", () => {
            renderMenu();

            focus(trigger("Resources"));
            fireEvent.keyDown(trigger("Resources"), { key: "ArrowLeft" });

            expect(trigger("Product")).toHaveFocus();
        });

        it("jumps to either end", () => {
            renderMenu();

            focus(trigger("Resources"));
            fireEvent.keyDown(trigger("Resources"), { key: "End" });
            expect(link("Changelog")).toHaveFocus();

            fireEvent.keyDown(link("Changelog"), { key: "Home" });
            expect(trigger("Product")).toHaveFocus();
        });

        it("takes the open panel away, since it belonged to the item that was left", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            focus(trigger("Product"));
            fireEvent.keyDown(trigger("Product"), { key: "ArrowRight" });

            expect(isOpen("Product")).toBe(false);
            expect(trigger("Resources")).toHaveFocus();
        });

        it("leaves the keys alone once focus has moved into a panel", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            focus(link("Features"));
            fireEvent.keyDown(link("Features"), { key: "ArrowRight" });

            expect(link("Features")).toHaveFocus();
            expect(isOpen("Product")).toBe(true);
        });

        it("lines the panel up against the item it was opened from", () => {
            renderMenu();

            expect(panel("Product")).toHaveAttribute("data-align", "start");
            expect(panel("Product")).toHaveClass("navigation-menu-content-align-start");
        });
    });

    // A column is a navigation list: the panels are drawn in the flow under the item that
    // opened them rather than standing over the page beside it, so the keys run down the whole
    // of what is showing rather than stepping past it
    describe("moving down a column", () => {
        const renderColumn = () => renderMenu({ orientation: "vertical" });

        it("turns onto the other axis", () => {
            renderColumn();

            focus(trigger("Product"));
            fireEvent.keyDown(trigger("Product"), { key: "ArrowDown" });

            expect(trigger("Resources")).toHaveFocus();
        });

        it("runs on through a panel standing open, since it is drawn in the column", () => {
            renderColumn();

            fireEvent.click(trigger("Product"));
            focus(trigger("Product"));

            fireEvent.keyDown(trigger("Product"), { key: "ArrowDown" });
            expect(link("Features")).toHaveFocus();

            fireEvent.keyDown(link("Features"), { key: "ArrowDown" });
            expect(link("Pricing")).toHaveFocus();

            fireEvent.keyDown(link("Pricing"), { key: "ArrowDown" });
            expect(trigger("Resources")).toHaveFocus();
        });

        it("comes back up through it the same way", () => {
            renderColumn();

            fireEvent.click(trigger("Product"));
            focus(trigger("Resources"));
            fireEvent.keyDown(trigger("Resources"), { key: "ArrowUp" });

            expect(link("Pricing")).toHaveFocus();
        });

        it("leaves the open panel standing, since it is part of what is being moved down", () => {
            renderColumn();

            fireEvent.click(trigger("Product"));
            focus(trigger("Product"));
            fireEvent.keyDown(trigger("Product"), { key: "ArrowDown" });

            expect(isOpen("Product")).toBe(true);
        });

        it("jumps to either end of everything standing open in the column", () => {
            renderColumn();

            fireEvent.click(trigger("Product"));
            focus(link("Pricing"));

            fireEvent.keyDown(link("Pricing"), { key: "Home" });
            expect(trigger("Product")).toHaveFocus();

            fireEvent.keyDown(trigger("Product"), { key: "End" });
            expect(link("Changelog")).toHaveFocus();
        });

        it("folds the panel away on the key pointing back the way it opened", () => {
            renderColumn();

            fireEvent.click(trigger("Product"));
            focus(trigger("Product"));
            fireEvent.keyDown(trigger("Product"), { key: "ArrowLeft" });

            expect(isOpen("Product")).toBe(false);
        });

        it("comes back out to the trigger from inside the panel", () => {
            renderColumn();

            fireEvent.click(trigger("Product"));
            focus(link("Features"));
            fireEvent.keyDown(link("Features"), { key: "ArrowLeft" });

            expect(isOpen("Product")).toBe(false);
            expect(trigger("Product")).toHaveFocus();
        });

        it("draws the panel in the flow, with no edge left for it to line up against", () => {
            renderColumn();

            expect(panel("Product")).not.toHaveAttribute("data-align");
            expect(panel("Product").className).not.toMatch(/navigation-menu-content-align/);
        });
    });

    describe("stepping into a panel", () => {
        it("opens the panel and moves focus into it in the one gesture", () => {
            renderMenu();

            focus(trigger("Product"));
            fireEvent.keyDown(trigger("Product"), { key: "ArrowDown" });

            expect(isOpen("Product")).toBe(true);
            expect(link("Features")).toHaveFocus();
        });

        it("steps into a panel that already stands open", () => {
            renderMenu();

            fireEvent.click(trigger("Product"));
            focus(trigger("Product"));
            fireEvent.keyDown(trigger("Product"), { key: "ArrowDown" });

            expect(link("Features")).toHaveFocus();
        });

        it("steps in from the side where the items stand in a column", () => {
            renderMenu({ orientation: "vertical" });

            focus(trigger("Product"));
            fireEvent.keyDown(trigger("Product"), { key: "ArrowRight" });

            expect(isOpen("Product")).toBe(true);
            expect(link("Features")).toHaveFocus();
        });
    });

    it("closes on Escape and hands focus back to the trigger the panel was opened from", () => {
        renderMenu();

        fireEvent.click(trigger("Product"));

        act(() => {
            fireEvent.keyDown(document, { key: "Escape" });
        });

        expect(isOpen("Product")).toBe(false);
        expect(trigger("Product")).toHaveFocus();
    });

    it("closes on a press anywhere else", () => {
        renderMenu();

        fireEvent.click(trigger("Product"));
        fireEvent.mouseDown(document.body);

        expect(isOpen("Product")).toBe(false);
    });

    it("closes once focus has left the menu altogether", () => {
        renderMenu();

        fireEvent.click(trigger("Product"));
        focus(trigger("Product"));

        act(() => {
            trigger("Product").blur();
        });

        expect(isOpen("Product")).toBe(false);
    });

    it("stays open while focus is moving from the trigger into the panel", () => {
        renderMenu();

        fireEvent.click(trigger("Product"));

        act(() => {
            fireEvent.blur(trigger("Product"), { relatedTarget: link("Features") });
        });

        expect(isOpen("Product")).toBe(true);
    });

    it("puts the menu away once a link has been followed", () => {
        renderMenu();

        fireEvent.click(trigger("Product"));
        fireEvent.click(link("Features"));

        expect(isOpen("Product")).toBe(false);
    });

    describe("opening on the pointer", () => {
        it("is left to the press alone unless the menu was asked to answer the pointer", () => {
            renderMenu();

            fireEvent.pointerEnter(item("Product"));
            wait(500);

            expect(isOpen("Product")).toBe(false);
        });

        it("waits out the delay before opening", () => {
            renderMenu({ openOn: "hover" });

            fireEvent.pointerEnter(item("Product"));
            expect(isOpen("Product")).toBe(false);

            wait(99);
            expect(isOpen("Product")).toBe(false);

            wait(1);
            expect(isOpen("Product")).toBe(true);
        });

        it("does not open where the pointer moved on before the wait was out", () => {
            renderMenu({ openOn: "hover" });

            fireEvent.pointerEnter(item("Product"));
            fireEvent.pointerLeave(item("Product"));
            wait(500);

            expect(isOpen("Product")).toBe(false);
        });

        it("closes once the pointer has been gone for the closing delay", () => {
            renderMenu({ openOn: "hover" });

            fireEvent.pointerEnter(item("Product"));
            wait(100);
            expect(isOpen("Product")).toBe(true);

            fireEvent.pointerLeave(item("Product"));
            expect(isOpen("Product")).toBe(true);

            wait(100);
            expect(isOpen("Product")).toBe(false);
        });

        it("switches at once where one panel already stands open", () => {
            renderMenu({ openOn: "hover" });

            fireEvent.pointerEnter(item("Product"));
            wait(100);

            fireEvent.pointerLeave(item("Product"));
            fireEvent.pointerEnter(item("Resources"));

            expect(isOpen("Product")).toBe(false);
            expect(isOpen("Resources")).toBe(true);
        });

        it("leaves a touch alone, since a tap has no pointer to move off the panel again", () => {
            renderMenu({ openOn: "hover" });

            // jsdom has no PointerEvent, so `pointerType` has to be put on the event by hand
            // rather than passed to `fireEvent` as part of its init
            const event = createEvent.pointerOver(item("Product"));
            Object.defineProperty(event, "pointerType", { value: "touch" });
            fireEvent(item("Product"), event);

            wait(500);

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
            renderMenu({ value: null, onValueChange });

            fireEvent.click(trigger("Product"));

            expect(isOpen("Product")).toBe(false);
            expect(onValueChange).toHaveBeenCalledWith("product");
        });

        it("reports a panel opening and closing either way", () => {
            const onValueChange = vi.fn();
            renderMenu({ onValueChange });

            fireEvent.click(trigger("Product"));
            expect(onValueChange).toHaveBeenLastCalledWith("product");

            fireEvent.click(trigger("Product"));
            expect(onValueChange).toHaveBeenLastCalledWith(null);
        });

        it("opens whichever panel it was told to start with", () => {
            renderMenu({ defaultValue: "product" });

            expect(isOpen("Product")).toBe(true);
        });
    });

    it("marks the link standing for the page being read", () => {
        render(
            <NavigationMenu aria-label="Main">
                <NavigationMenu.List>
                    <NavigationMenu.Item>
                        <NavigationMenu.Link href="#changelog" active>
                            Changelog
                        </NavigationMenu.Link>
                    </NavigationMenu.Item>
                </NavigationMenu.List>
            </NavigationMenu>,
        );

        expect(link("Changelog")).toHaveAttribute("aria-current", "page");
        expect(link("Changelog")).toHaveClass("navigation-menu-link-active");
    });

    it("draws nothing for a trigger or a panel written outside an item", () => {
        const { container } = render(
            <NavigationMenu aria-label="Main">
                <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                <NavigationMenu.Content>Nowhere to be opened from</NavigationMenu.Content>
            </NavigationMenu>,
        );

        expect(container.querySelector("button")).toBeNull();
        expect(screen.queryByText("Nowhere to be opened from")).not.toBeInTheDocument();
    });

    describe("a heading of its own", () => {
        it("names the landmark, where the caller gave it no name", () => {
            render(
                <NavigationMenu>
                    <NavigationMenu.Heading>Documentation</NavigationMenu.Heading>
                    <NavigationMenu.List>
                        <NavigationMenu.Item>
                            <NavigationMenu.Link href="#start">Getting started</NavigationMenu.Link>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

            const menu = screen.getByRole("navigation", { name: "Documentation" });
            expect(menu).toContainElement(screen.getByRole("heading", { name: "Documentation" }));
        });

        it("leaves the name the caller gave it standing", () => {
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.Heading>Documentation</NavigationMenu.Heading>
                    <NavigationMenu.List />
                </NavigationMenu>,
            );

            expect(screen.getByRole("navigation", { name: "Main" })).not.toHaveAttribute(
                "aria-labelledby",
            );
        });

        it("keeps a heading from the page while still naming the landmark by it", () => {
            render(
                <NavigationMenu>
                    <NavigationMenu.Heading visuallyHidden>Documentation</NavigationMenu.Heading>
                    <NavigationMenu.List />
                </NavigationMenu>,
            );

            expect(screen.getByRole("navigation", { name: "Documentation" })).toBeInTheDocument();
            expect(screen.getByRole("heading", { name: "Documentation" })).toHaveClass("sr-only");
        });
    });

    describe("groups", () => {
        const renderGroups = (heading?: React.ReactNode) =>
            render(
                <NavigationMenu aria-label="Main">
                    {heading}
                    <NavigationMenu.List>
                        <NavigationMenu.Item>
                            <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <NavigationMenu.Group title="Build" hideDivider>
                                    <NavigationMenu.Link href="#editor">Editor</NavigationMenu.Link>
                                </NavigationMenu.Group>
                                <NavigationMenu.Group title="Ship">
                                    <NavigationMenu.Link href="#releases">
                                        Releases
                                    </NavigationMenu.Link>
                                </NavigationMenu.Group>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

        it("names the group by the heading its title builds", () => {
            renderGroups();
            fireEvent.click(trigger("Product"));

            const group = screen.getByRole("group", { name: "Build" });
            expect(group).toContainElement(link("Editor"));
        });

        it("stands a group heading one level below the menu's own", () => {
            renderGroups(<NavigationMenu.Heading as="h3">Product</NavigationMenu.Heading>);
            fireEvent.click(trigger("Product"));

            expect(screen.getByRole("heading", { name: "Build", level: 4 })).toBeInTheDocument();
        });

        it("falls back to an h3 where the menu has no heading of its own", () => {
            renderGroups();
            fireEvent.click(trigger("Product"));

            expect(screen.getByRole("heading", { name: "Build", level: 3 })).toBeInTheDocument();
        });

        it("sets a group apart from what comes before it, unless told not to", () => {
            renderGroups();
            fireEvent.click(trigger("Product"));

            // The first group has nothing before it to be set apart from, so it was told to
            // leave the line out
            expect(
                panel("Product").querySelectorAll('[data-component="NavigationMenu.Divider"]'),
            ).toHaveLength(1);
        });

        it("takes a heading written out in place of the one a title would build", () => {
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.List>
                        <NavigationMenu.Item>
                            <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <NavigationMenu.Group hideDivider>
                                    <NavigationMenu.GroupHeading>
                                        <a href="#build">Build</a>
                                    </NavigationMenu.GroupHeading>
                                    <NavigationMenu.Link href="#editor">Editor</NavigationMenu.Link>
                                </NavigationMenu.Group>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

            fireEvent.click(trigger("Product"));

            expect(screen.getByRole("group", { name: "Build" })).toBeInTheDocument();
            expect(link("Build")).toBeInTheDocument();
        });
    });

    describe("a sub-list standing under a link", () => {
        const renderSubNavigation = (props: Partial<NavigationMenuProps> = {}) =>
            render(
                <NavigationMenu aria-label="Main" {...props}>
                    <NavigationMenu.List>
                        <NavigationMenu.Item>
                            <NavigationMenu.Trigger>Resources</NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <NavigationMenu.Link href="#docs">
                                    Documentation
                                    <NavigationMenu.SubNavigation>
                                        <NavigationMenu.Link href="#start">
                                            Getting started
                                        </NavigationMenu.Link>
                                        <NavigationMenu.Link href="#components">
                                            Components
                                        </NavigationMenu.Link>
                                    </NavigationMenu.SubNavigation>
                                </NavigationMenu.Link>
                                <NavigationMenu.Link href="#support">Support</NavigationMenu.Link>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

        it("is named by the link it stands under, and stands after it rather than inside it", () => {
            renderSubNavigation();
            fireEvent.click(trigger("Resources"));

            const subNavigation = screen.getByRole("list", { name: "Documentation" });
            expect(subNavigation).toHaveAttribute("aria-labelledby", link("Documentation").id);
            expect(link("Documentation")).not.toContainElement(subNavigation);
            expect(subNavigation).toContainElement(link("Getting started"));
        });

        it("stands its links in the list rather than loose in the panel", () => {
            renderSubNavigation();
            fireEvent.click(trigger("Resources"));

            expect(link("Getting started").closest("li")).toBeInTheDocument();
        });

        it("draws nothing for a sub-list written outside a link", () => {
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.SubNavigation>
                        <NavigationMenu.Link href="#start">Nowhere to stand</NavigationMenu.Link>
                    </NavigationMenu.SubNavigation>
                </NavigationMenu>,
            );

            expect(screen.queryByText("Nowhere to stand")).not.toBeInTheDocument();
        });

        it("runs the keys on through it down a column, since it is drawn in the flow", () => {
            renderSubNavigation({ orientation: "vertical" });
            fireEvent.click(trigger("Resources"));
            focus(link("Documentation"));

            fireEvent.keyDown(link("Documentation"), { key: "ArrowDown" });
            expect(link("Getting started")).toHaveFocus();

            fireEvent.keyDown(link("Getting started"), { key: "ArrowDown" });
            expect(link("Components")).toHaveFocus();

            fireEvent.keyDown(link("Components"), { key: "ArrowDown" });
            expect(link("Support")).toHaveFocus();
        });
    });

    describe("what a link says about itself", () => {
        const renderLink = () =>
            render(
                <NavigationMenu aria-label="Main">
                    <NavigationMenu.List>
                        <NavigationMenu.Item>
                            <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
                            <NavigationMenu.Content>
                                <NavigationMenu.Link href="#editor">
                                    <NavigationMenu.LeadingVisual>
                                        <svg aria-hidden="true" />
                                    </NavigationMenu.LeadingVisual>
                                    Editor
                                    <NavigationMenu.Description>
                                        Write, review and ship
                                    </NavigationMenu.Description>
                                    <NavigationMenu.TrailingVisual>
                                        12
                                    </NavigationMenu.TrailingVisual>
                                </NavigationMenu.Link>
                            </NavigationMenu.Content>
                        </NavigationMenu.Item>
                    </NavigationMenu.List>
                </NavigationMenu>,
            );

        it("points the link at the description written inside it", () => {
            renderLink();
            fireEvent.click(trigger("Product"));

            const editor = screen.getByRole("link", { name: /Editor/ });
            const description = screen.getByText("Write, review and ship");

            expect(editor).toHaveAttribute("aria-describedby", description.id);
            expect(editor).toHaveAttribute("data-has-description", "");
        });

        it("stands a visual either side of the label", () => {
            renderLink();
            fireEvent.click(trigger("Product"));

            const editor = screen.getByRole("link", { name: /Editor/ });

            expect(
                editor.querySelector('[data-component="NavigationMenu.LeadingVisual"]'),
            ).toBeInTheDocument();
            expect(
                editor.querySelector('[data-component="NavigationMenu.TrailingVisual"]'),
            ).toBeInTheDocument();
        });
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

        expect(screen.getByRole("navigation")).toHaveClass("navigation-menu", "custom-menu");
        expect(screen.getByRole("list")).toHaveClass("navigation-menu-list", "custom-list");
        expect(item("Product")).toHaveClass("navigation-menu-item", "custom-item");
        expect(trigger("Product")).toHaveClass("navigation-menu-trigger", "custom-trigger");
        expect(panel("Product")).toHaveClass("navigation-menu-content", "custom-content");

        fireEvent.click(trigger("Product"));
        expect(link("Features")).toHaveClass("navigation-menu-link", "custom-link");
    });
});
