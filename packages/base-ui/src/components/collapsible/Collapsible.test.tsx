import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Collapsible } from ".";
import type { CollapsibleProps } from "./Collapsible.types";

const collapsible = (props: Partial<CollapsibleProps> = {}) => (
    <Collapsible {...props}>
        <Collapsible.Trigger>Show more</Collapsible.Trigger>
        <Collapsible.Content>Content</Collapsible.Content>
    </Collapsible>
);

const trigger = () => screen.getByRole("button", { name: "Show more" });

const content = () => document.querySelector('[data-component="Collapsible.Content"]');

const root = () => document.querySelector('[data-component="Collapsible"]') as HTMLElement;

describe("Collapsible", () => {
    it("renders a plain box by default", () => {
        render(collapsible());
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(
            <Collapsible as="section">
                <Collapsible.Trigger>Show more</Collapsible.Trigger>
                <Collapsible.Content>Content</Collapsible.Content>
            </Collapsible>,
        );
        expect(root().tagName).toBe("SECTION");
    });

    it("tags the disclosure and its parts with data-component attributes", () => {
        render(collapsible());

        for (const name of ["Collapsible", "Collapsible.Trigger", "Collapsible.Content"]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("says what the trigger controls, and points it at the content", () => {
        render(collapsible());
        expect(trigger()).toHaveAttribute("aria-controls", content()?.getAttribute("id"));
    });

    it("starts closed, with the content off the page", () => {
        render(collapsible());

        expect(trigger()).toHaveAttribute("aria-expanded", "false");
        expect(content()).not.toBeVisible();
        expect(root()).toHaveAttribute("data-open", "false");
    });

    it("starts open when it is told to", () => {
        render(collapsible({ defaultOpen: true }));

        expect(trigger()).toHaveAttribute("aria-expanded", "true");
        expect(content()).toBeVisible();
        expect(root()).toHaveAttribute("data-open", "true");
    });

    it("opens from its trigger, and closes again", () => {
        render(collapsible());

        fireEvent.click(trigger());
        expect(trigger()).toHaveAttribute("aria-expanded", "true");
        expect(content()).toBeVisible();

        fireEvent.click(trigger());
        expect(trigger()).toHaveAttribute("aria-expanded", "false");
        expect(content()).not.toBeVisible();
    });

    it("reports whether it is open as it changes", () => {
        const onChange = vi.fn();
        render(collapsible({ onChange }));

        fireEvent.click(trigger());
        expect(onChange).toHaveBeenCalledWith(true);

        fireEvent.click(trigger());
        expect(onChange).toHaveBeenLastCalledWith(false);
    });

    it("leaves a disclosure the caller is holding the state of as it was", () => {
        const onChange = vi.fn();
        render(collapsible({ open: false, onChange }));

        fireEvent.click(trigger());

        expect(onChange).toHaveBeenCalledWith(true);
        expect(trigger()).toHaveAttribute("aria-expanded", "false");
        expect(content()).not.toBeVisible();
    });

    it("follows the caller where they are holding the state", () => {
        const { rerender } = render(collapsible({ open: false }));
        expect(content()).not.toBeVisible();

        rerender(collapsible({ open: true }));
        expect(content()).toBeVisible();
    });

    describe("disabled", () => {
        it("stops the trigger being used", () => {
            const onChange = vi.fn();
            render(collapsible({ disabled: true, onChange }));

            expect(trigger()).toBeDisabled();
            expect(root()).toHaveAttribute("data-disabled", "true");

            fireEvent.click(trigger());
            expect(onChange).not.toHaveBeenCalled();
            expect(content()).not.toBeVisible();
        });

        it("dims the trigger", () => {
            render(collapsible({ disabled: true }));
            expect(trigger()).toHaveClass("collapsible-trigger-disabled");
        });

        it("leaves a disclosure that was already open showing", () => {
            render(collapsible({ disabled: true, defaultOpen: true }));
            expect(content()).toBeVisible();
        });
    });

    describe("the trigger", () => {
        it("still calls a press handler of the caller's own", () => {
            const onClick = vi.fn();
            render(
                <Collapsible>
                    <Collapsible.Trigger onClick={onClick}>Show more</Collapsible.Trigger>
                    <Collapsible.Content>Content</Collapsible.Content>
                </Collapsible>,
            );

            fireEvent.click(trigger());

            expect(onClick).toHaveBeenCalledTimes(1);
            expect(content()).toBeVisible();
        });

        it("leaves the disclosure alone where the caller has answered the press", () => {
            render(
                <Collapsible>
                    <Collapsible.Trigger onClick={(event) => event.preventDefault()}>
                        Show more
                    </Collapsible.Trigger>
                    <Collapsible.Content>Content</Collapsible.Content>
                </Collapsible>,
            );

            fireEvent.click(trigger());
            expect(content()).not.toBeVisible();
        });

        it("draws a chevron after the label by default", () => {
            const { container } = render(collapsible());

            expect(trigger()).toHaveAttribute("data-indicator", "end");
            expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
        });

        it("turns the chevron over once it is open", () => {
            const { container } = render(collapsible({ defaultOpen: true }));
            expect(container.querySelector("svg")).toHaveClass("rotate-180");
        });

        it("points a chevron before the label at what it opens", () => {
            const { container } = render(
                <Collapsible>
                    <Collapsible.Trigger indicator="start">Show more</Collapsible.Trigger>
                    <Collapsible.Content>Content</Collapsible.Content>
                </Collapsible>,
            );

            expect(trigger()).toHaveAttribute("data-indicator", "start");
            expect(container.querySelector("svg")).toHaveClass("-rotate-90");

            fireEvent.click(trigger());
            expect(container.querySelector("svg")).toHaveClass("rotate-0");
        });

        it("draws no chevron at all where it is asked not to", () => {
            const { container } = render(
                <Collapsible>
                    <Collapsible.Trigger indicator="none">Show more</Collapsible.Trigger>
                    <Collapsible.Content>Content</Collapsible.Content>
                </Collapsible>,
            );

            expect(trigger()).toHaveAttribute("data-indicator", "none");
            expect(container.querySelector("svg")).toBeNull();
        });
    });

    describe("the content", () => {
        it("stays on the page while it is closed, so the trigger has something to point at", () => {
            render(collapsible());
            expect(content()).toBeInTheDocument();
        });

        it("renders as whatever it is told to", () => {
            render(
                <Collapsible defaultOpen>
                    <Collapsible.Trigger>Show more</Collapsible.Trigger>
                    <Collapsible.Content as="ul">
                        <li>One</li>
                    </Collapsible.Content>
                </Collapsible>,
            );
            expect(content()?.tagName).toBe("UL");
        });
    });

    it("nests one disclosure within another", () => {
        render(
            <Collapsible defaultOpen>
                <Collapsible.Trigger>Outer</Collapsible.Trigger>
                <Collapsible.Content>
                    <Collapsible>
                        <Collapsible.Trigger>Inner</Collapsible.Trigger>
                        <Collapsible.Content>Inner content</Collapsible.Content>
                    </Collapsible>
                </Collapsible.Content>
            </Collapsible>,
        );

        const inner = screen.getByRole("button", { name: "Inner" });
        expect(screen.getByRole("button", { name: "Outer" })).toHaveAttribute(
            "aria-expanded",
            "true",
        );
        expect(inner).toHaveAttribute("aria-expanded", "false");

        fireEvent.click(inner);
        expect(inner).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("button", { name: "Outer" })).toHaveAttribute(
            "aria-expanded",
            "true",
        );
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Collapsible ref={ref}>
                <Collapsible.Trigger>Show more</Collapsible.Trigger>
                <Collapsible.Content>Content</Collapsible.Content>
            </Collapsible>,
        );
        expect(ref.current).toBe(root());
    });

    it("forwards a ref to the trigger", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(
            <Collapsible>
                <Collapsible.Trigger ref={ref}>Show more</Collapsible.Trigger>
                <Collapsible.Content>Content</Collapsible.Content>
            </Collapsible>,
        );
        expect(ref.current).toBe(trigger());
    });

    it("merges a custom className onto each part", () => {
        render(
            <Collapsible className="root">
                <Collapsible.Trigger className="trigger">Show more</Collapsible.Trigger>
                <Collapsible.Content className="content">Content</Collapsible.Content>
            </Collapsible>,
        );

        expect(root()).toHaveClass("root");
        expect(trigger()).toHaveClass("trigger");
        expect(content()).toHaveClass("content");
    });
});
