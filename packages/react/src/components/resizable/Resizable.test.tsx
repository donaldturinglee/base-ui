import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Resizable } from ".";
import type { ResizableResizeTriggerProps, ResizableProps } from "./Resizable.types";

const originalResizeObserver = window.ResizeObserver;

const root = () => document.querySelector('[data-component="Resizable"]') as HTMLElement;
const panels = () =>
    Array.from(document.querySelectorAll('[data-component="Resizable.Panel"]')) as HTMLElement[];
const resizeTrigger = () => screen.getByRole("separator");
const separator = () =>
    document.querySelector('[data-component="Resizable.ResizeTriggerSeparator"]');
const indicator = () =>
    document.querySelector('[data-component="Resizable.ResizeTriggerIndicator"]');

const renderResizable = ({
    resizable,
    resizeTriggerProps,
    children,
}: {
    resizable?: Partial<ResizableProps>;
    resizeTriggerProps?: Partial<ResizableResizeTriggerProps>;
    children?: React.ReactNode;
} = {}) =>
    render(
        <Resizable {...resizable}>
            <Resizable.Panel>One</Resizable.Panel>
            <Resizable.ResizeTrigger {...resizeTriggerProps}>{children}</Resizable.ResizeTrigger>
            <Resizable.Panel>Two</Resizable.Panel>
        </Resizable>,
    );

describe("Resizable", () => {
    // jsdom lays nothing out and has no ResizeObserver of its own, and a group watches the
    // room it was given so it can keep the panels in step with it
    beforeAll(() => {
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterAll(() => {
        window.ResizeObserver = originalResizeObserver;
    });

    describe("the root", () => {
        it("tags the root element with a data-component attribute", () => {
            renderResizable();
            expect(root()).toHaveAttribute("data-component", "Resizable");
            expect(root()).toHaveClass("resizable");
        });

        it("falls back to laying the panels out side by side", () => {
            renderResizable();
            expect(root()).toHaveAttribute("data-orientation", "horizontal");
        });

        it("respects the orientation prop", () => {
            for (const orientation of ["horizontal", "vertical"] as const) {
                const { unmount } = renderResizable({ resizable: { orientation } });
                expect(root()).toHaveAttribute("data-orientation", orientation);
                unmount();
            }
        });

        it("forwards a ref to the root element", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <Resizable ref={ref}>
                    <Resizable.Panel>One</Resizable.Panel>
                </Resizable>,
            );
            expect(ref.current).toBe(root());
        });

        it("merges a custom className onto the root element", () => {
            renderResizable({ resizable: { className: "custom" } });
            expect(root()).toHaveClass("resizable");
            expect(root()).toHaveClass("custom");
        });

        it("passes extra props onto the root element", () => {
            // The group names each of its parts with an id and a `data-testid` of its own, so
            // something else stands in for one here
            render(
                <Resizable data-extra="value">
                    <Resizable.Panel>One</Resizable.Panel>
                </Resizable>,
            );
            expect(root()).toHaveAttribute("data-extra", "value");
        });
    });

    describe("the panels", () => {
        it("tags each panel with a data-component attribute", () => {
            renderResizable();
            expect(panels()).toHaveLength(2);
            for (const panel of panels()) {
                expect(panel).toHaveAttribute("data-component", "Resizable.Panel");
            }
        });

        it("puts the class on the box the content is drawn in rather than on the panel itself", () => {
            // The panel is laid out by the group, so anything given a size of its own goes
            // within it rather than on it
            renderResizable();
            const [panel] = panels();
            expect(panel).not.toHaveClass("resizable-panel");
            expect(panel.firstElementChild).toHaveClass("resizable-panel");
        });

        it("draws what each panel was given", () => {
            renderResizable();
            expect(screen.getByText("One")).toBeInTheDocument();
            expect(screen.getByText("Two")).toBeInTheDocument();
        });

        it("merges a custom className onto the content box", () => {
            render(
                <Resizable>
                    <Resizable.Panel className="custom">One</Resizable.Panel>
                </Resizable>,
            );
            const [panel] = panels();
            expect(panel.firstElementChild).toHaveClass("resizable-panel");
            expect(panel.firstElementChild).toHaveClass("custom");
        });

        it("forwards a ref to the panel element", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <Resizable>
                    <Resizable.Panel ref={ref}>One</Resizable.Panel>
                </Resizable>,
            );
            expect(ref.current).toBe(panels()[0]);
        });
    });

    describe("the resize trigger", () => {
        it("tags the trigger with a data-component attribute", () => {
            renderResizable();
            expect(resizeTrigger()).toHaveAttribute("data-component", "Resizable.ResizeTrigger");
            expect(resizeTrigger()).toHaveClass("resizable-resize-trigger");
        });

        it("reads as a separator between one panel and the next", () => {
            renderResizable();
            expect(resizeTrigger()).toHaveAttribute("role", "separator");
        });

        it("can be reached by the keyboard", () => {
            renderResizable();
            expect(resizeTrigger()).toHaveAttribute("tabindex", "0");
        });

        it("runs the other way about from the group it stands in", () => {
            // Panels side by side are parted by a line standing up, and panels stacked one on
            // another by a line lying down
            const orientations = {
                horizontal: "vertical",
                vertical: "horizontal",
            } as const;

            for (const [orientation, expected] of Object.entries(orientations)) {
                const { unmount } = renderResizable({
                    resizable: { orientation: orientation as ResizableProps["orientation"] },
                });
                expect(resizeTrigger()).toHaveAttribute("aria-orientation", expected);
                unmount();
            }
        });

        it("draws nothing of its own unless it is given something to draw", () => {
            renderResizable();
            expect(resizeTrigger()).toBeEmptyDOMElement();
        });

        it("says when it cannot be dragged, and takes itself off the keyboard's way", () => {
            renderResizable({ resizeTriggerProps: { disabled: true } });
            expect(resizeTrigger()).toHaveAttribute("aria-disabled", "true");
            expect(resizeTrigger()).toHaveAttribute("data-separator", "disabled");
            expect(resizeTrigger()).not.toHaveAttribute("tabindex");
        });

        it("merges a custom className onto the trigger", () => {
            renderResizable({ resizeTriggerProps: { className: "custom" } });
            expect(resizeTrigger()).toHaveClass("resizable-resize-trigger");
            expect(resizeTrigger()).toHaveClass("custom");
        });

        it("forwards a ref to the trigger element", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <Resizable>
                    <Resizable.Panel>One</Resizable.Panel>
                    <Resizable.ResizeTrigger ref={ref} />
                    <Resizable.Panel>Two</Resizable.Panel>
                </Resizable>,
            );
            expect(ref.current).toBe(resizeTrigger());
        });
    });

    describe("the separator", () => {
        it("draws the line the trigger was given, and keeps it out of the accessibility tree", () => {
            renderResizable({ children: <Resizable.ResizeTriggerSeparator /> });
            expect(separator()).toBeInTheDocument();
            expect(separator()).toHaveClass("resizable-resize-trigger-separator");
            expect(separator()).toHaveAttribute("aria-hidden", "true");
        });

        it("merges a custom className onto the separator", () => {
            renderResizable({ children: <Resizable.ResizeTriggerSeparator className="custom" /> });
            expect(separator()).toHaveClass("resizable-resize-trigger-separator");
            expect(separator()).toHaveClass("custom");
        });

        it("forwards a ref to the separator element", () => {
            const ref = React.createRef<HTMLSpanElement>();
            renderResizable({ children: <Resizable.ResizeTriggerSeparator ref={ref} /> });
            expect(ref.current).toBe(separator());
        });
    });

    describe("the indicator", () => {
        it("draws the grip the trigger was given, and keeps it out of the accessibility tree", () => {
            renderResizable({ children: <Resizable.ResizeTriggerIndicator /> });
            expect(indicator()).toBeInTheDocument();
            expect(indicator()).toHaveClass("resizable-resize-trigger-indicator");
            expect(indicator()).toHaveAttribute("aria-hidden", "true");
        });

        it("stands on the line where a trigger was given both", () => {
            renderResizable({
                children: (
                    <React.Fragment>
                        <Resizable.ResizeTriggerSeparator />
                        <Resizable.ResizeTriggerIndicator />
                    </React.Fragment>
                ),
            });
            expect(resizeTrigger().children).toHaveLength(2);
            expect(separator()).toBeInTheDocument();
            expect(indicator()).toBeInTheDocument();
        });

        it("merges a custom className onto the indicator", () => {
            renderResizable({ children: <Resizable.ResizeTriggerIndicator className="custom" /> });
            expect(indicator()).toHaveClass("resizable-resize-trigger-indicator");
            expect(indicator()).toHaveClass("custom");
        });

        it("forwards a ref to the indicator element", () => {
            const ref = React.createRef<HTMLSpanElement>();
            renderResizable({ children: <Resizable.ResizeTriggerIndicator ref={ref} /> });
            expect(ref.current).toBe(indicator());
        });
    });
});
