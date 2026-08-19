import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Breadcrumbs } from ".";
import type { BreadcrumbsProps } from "./Breadcrumbs.types";

const originalResizeObserver = window.ResizeObserver;
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");

const steps = ["Home", "Products", "Category", "Subcategory", "Item", "Details", "Current page"];

// jsdom lays nothing out, so the trail is given the widths it would have been measured at
const measureAs = ({ container, item }: { container: number; item: number }) => {
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get(this: HTMLElement) {
            if (this.tagName === "NAV") {
                return container;
            }

            return this.tagName === "LI" ? item : 0;
        },
    });
};

const renderBreadcrumbs = (props: Partial<BreadcrumbsProps> = {}) =>
    render(
        <Breadcrumbs {...props}>
            {steps.map((step, index) => (
                <Breadcrumbs.Item key={step} href="#" selected={index === steps.length - 1}>
                    {step}
                </Breadcrumbs.Item>
            ))}
        </Breadcrumbs>,
    );

const trail = () => screen.getByRole("navigation", { name: "Breadcrumbs" });

const crumbs = () => screen.getAllByRole("listitem");

const menuButton = () => screen.getByRole("button", { name: /more breadcrumb items/ });

describe("Breadcrumbs", () => {
    // jsdom has no ResizeObserver, and a trail that collapses watches its own width to work
    // out how much of it still fits
    beforeEach(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;

        if (originalOffsetWidth) {
            Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
        }
    });

    it("renders a landmark named for what it is", () => {
        renderBreadcrumbs();
        expect(trail()).toBeInTheDocument();
    });

    it("tags the trail and its steps with data-component attributes", () => {
        renderBreadcrumbs();

        expect(trail()).toHaveAttribute("data-component", "Breadcrumbs");
        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
            "data-component",
            "Breadcrumbs.Item",
        );
    });

    it("renders every step it is given, in the order they were written", () => {
        renderBreadcrumbs();

        expect(crumbs()).toHaveLength(steps.length);
        expect(screen.getAllByRole("link").map((link) => link.textContent)).toEqual(steps);
    });

    it("says which step is the page the reader is already on", () => {
        renderBreadcrumbs();

        expect(screen.getByRole("link", { name: "Current page" })).toHaveAttribute(
            "aria-current",
            "page",
        );
        expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    });

    it("keeps the separators out of the accessibility tree", () => {
        renderBreadcrumbs();

        const separators = document.querySelectorAll("[data-component='Breadcrumbs.Separator']");

        expect(separators).toHaveLength(steps.length);
        for (const separator of separators) {
            expect(separator).toHaveAttribute("aria-hidden", "true");
        }
    });

    it("tags how it overflows and how much room its steps are given", () => {
        renderBreadcrumbs({ overflow: "menu", variant: "spacious" });

        expect(trail()).toHaveAttribute("data-overflow", "menu");
        expect(trail()).toHaveAttribute("data-variant", "spacious");
    });

    it("renders a step as whatever element it is asked to", () => {
        render(
            <Breadcrumbs>
                <Breadcrumbs.Item as="button" type="button">
                    Home
                </Breadcrumbs.Item>
            </Breadcrumbs>,
        );

        expect(screen.getByRole("button", { name: "Home" })).toBeInTheDocument();
    });

    it("wraps rather than collapsing, and so needs no menu", () => {
        measureAs({ container: 200, item: 60 });
        renderBreadcrumbs({ overflow: "wrap" });

        expect(crumbs()).toHaveLength(steps.length);
        expect(
            screen.queryByRole("button", { name: /more breadcrumb items/ }),
        ).not.toBeInTheDocument();
    });

    it("gives up its middle to a menu once it no longer fits", () => {
        measureAs({ container: 800, item: 60 });
        renderBreadcrumbs({ overflow: "menu" });

        expect(menuButton()).toHaveAccessibleName("3 more breadcrumb items");
        // The three steps that were given up are no longer drawn in the trail itself
        expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Current page" })).toBeInTheDocument();
    });

    it("offers the steps it gave up from the menu", () => {
        measureAs({ container: 800, item: 60 });
        renderBreadcrumbs({ overflow: "menu" });

        fireEvent.click(menuButton());

        expect(screen.getByRole("menuitem", { name: "Home" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Products" })).toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Category" })).toBeInTheDocument();
    });

    it("keeps the root where it is asked to, and gives up only what follows it", () => {
        measureAs({ container: 800, item: 60 });
        renderBreadcrumbs({ overflow: "menu-with-root" });

        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
        expect(menuButton()).toHaveAccessibleName("3 more breadcrumb items");

        fireEvent.click(menuButton());

        // The root is drawn in its own right, so it is not offered from the menu as well
        expect(screen.queryByRole("menuitem", { name: "Home" })).not.toBeInTheDocument();
        expect(screen.getByRole("menuitem", { name: "Products" })).toBeInTheDocument();
    });

    it("gives up the root as well where there is no room to keep it", () => {
        // Too narrow to hold anything but the page the reader is on
        measureAs({ container: 100, item: 60 });
        renderBreadcrumbs({ overflow: "menu-with-root" });

        expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
        expect(menuButton()).toHaveAccessibleName("6 more breadcrumb items");
        expect(screen.getByRole("link", { name: "Current page" })).toBeInTheDocument();
    });

    it("leaves a trail of two alone, since it has no middle to give up", () => {
        measureAs({ container: 800, item: 60 });
        render(
            <Breadcrumbs overflow="menu">
                <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
                <Breadcrumbs.Item href="#" selected>
                    Current page
                </Breadcrumbs.Item>
            </Breadcrumbs>,
        );

        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /more breadcrumb items/ }),
        ).not.toBeInTheDocument();
    });

    it("takes a class name of the caller's own", () => {
        renderBreadcrumbs({ className: "custom" });
        expect(trail()).toHaveClass("custom");
    });
});
