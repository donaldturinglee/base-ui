import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Splitter } from ".";
import type { SplitterResizeTriggerProps, SplitterProps } from "./Splitter.types";

const originalResizeObserver = window.ResizeObserver;

const root = () => document.querySelector('[data-component="Splitter"]') as HTMLElement;
const panels = () =>
    Array.from(document.querySelectorAll('[data-component="Splitter.Panel"]')) as HTMLElement[];
const resizeTrigger = () => screen.getByRole("separator");
const separator = () =>
    document.querySelector('[data-component="Splitter.ResizeTriggerSeparator"]');
const indicator = () =>
    document.querySelector('[data-component="Splitter.ResizeTriggerIndicator"]');

const renderSplitter = ({
    splitter,
    resizeTriggerProps,
    children,
}: {
    splitter?: Partial<SplitterProps>;
    resizeTriggerProps?: Partial<SplitterResizeTriggerProps>;
    children?: React.ReactNode;
} = {}) =>
    render(
        <Splitter {...splitter}>
            <Splitter.Panel>One</Splitter.Panel>
            <Splitter.ResizeTrigger {...resizeTriggerProps}>{children}</Splitter.ResizeTrigger>
            <Splitter.Panel>Two</Splitter.Panel>
        </Splitter>,
    );

describe("Splitter", () => {
    // jsdom lays nothing out and has no ResizeObserver of its own, and a splitter watches the
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
            renderSplitter();
            expect(root()).toHaveAttribute("data-component", "Splitter");
            expect(root()).toHaveClass("splitter");
        });

        it("falls back to laying the panels out side by side", () => {
            renderSplitter();
            expect(root()).toHaveAttribute("data-orientation", "horizontal");
        });

        it("respects the orientation prop", () => {
            for (const orientation of ["horizontal", "vertical"] as const) {
                const { unmount } = renderSplitter({ splitter: { orientation } });
                expect(root()).toHaveAttribute("data-orientation", orientation);
                unmount();
            }
        });

        it("forwards a ref to the root element", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <Splitter ref={ref}>
                    <Splitter.Panel>One</Splitter.Panel>
                </Splitter>,
            );
            expect(ref.current).toBe(root());
        });

        it("merges a custom className onto the root element", () => {
            renderSplitter({ splitter: { className: "custom" } });
            expect(root()).toHaveClass("splitter");
            expect(root()).toHaveClass("custom");
        });

        it("passes extra props onto the root element", () => {
            // The splitter names each of its parts with an id and a `data-testid` of its own, so
            // something else stands in for one here
            render(
                <Splitter data-extra="value">
                    <Splitter.Panel>One</Splitter.Panel>
                </Splitter>,
            );
            expect(root()).toHaveAttribute("data-extra", "value");
        });
    });

    describe("the panels", () => {
        it("tags each panel with a data-component attribute", () => {
            renderSplitter();
            expect(panels()).toHaveLength(2);
            for (const panel of panels()) {
                expect(panel).toHaveAttribute("data-component", "Splitter.Panel");
            }
        });

        it("puts the class on the box the content is drawn in rather than on the panel itself", () => {
            // The panel is laid out by the splitter, so anything given a size of its own goes
            // within it rather than on it
            renderSplitter();
            const [panel] = panels();
            expect(panel).not.toHaveClass("splitter-panel");
            expect(panel.firstElementChild).toHaveClass("splitter-panel");
        });

        it("draws what each panel was given", () => {
            renderSplitter();
            expect(screen.getByText("One")).toBeInTheDocument();
            expect(screen.getByText("Two")).toBeInTheDocument();
        });

        it("merges a custom className onto the content box", () => {
            render(
                <Splitter>
                    <Splitter.Panel className="custom">One</Splitter.Panel>
                </Splitter>,
            );
            const [panel] = panels();
            expect(panel.firstElementChild).toHaveClass("splitter-panel");
            expect(panel.firstElementChild).toHaveClass("custom");
        });

        it("forwards a ref to the panel element", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <Splitter>
                    <Splitter.Panel ref={ref}>One</Splitter.Panel>
                </Splitter>,
            );
            expect(ref.current).toBe(panels()[0]);
        });
    });

    describe("the resize trigger", () => {
        it("tags the trigger with a data-component attribute", () => {
            renderSplitter();
            expect(resizeTrigger()).toHaveAttribute("data-component", "Splitter.ResizeTrigger");
            expect(resizeTrigger()).toHaveClass("splitter-resize-trigger");
        });

        it("reads as a separator between one panel and the next", () => {
            renderSplitter();
            expect(resizeTrigger()).toHaveAttribute("role", "separator");
        });

        it("can be reached by the keyboard", () => {
            renderSplitter();
            expect(resizeTrigger()).toHaveAttribute("tabindex", "0");
        });

        it("runs the other way about from the splitter it stands in", () => {
            // Panels side by side are parted by a line standing up, and panels stacked one on
            // another by a line lying down
            const orientations = {
                horizontal: "vertical",
                vertical: "horizontal",
            } as const;

            for (const [orientation, expected] of Object.entries(orientations)) {
                const { unmount } = renderSplitter({
                    splitter: { orientation: orientation as SplitterProps["orientation"] },
                });
                expect(resizeTrigger()).toHaveAttribute("aria-orientation", expected);
                unmount();
            }
        });

        it("draws nothing of its own unless it is given something to draw", () => {
            renderSplitter();
            expect(resizeTrigger()).toBeEmptyDOMElement();
        });

        it("says when it cannot be dragged, and takes itself off the keyboard's way", () => {
            renderSplitter({ resizeTriggerProps: { disabled: true } });
            expect(resizeTrigger()).toHaveAttribute("aria-disabled", "true");
            expect(resizeTrigger()).toHaveAttribute("data-separator", "disabled");
            expect(resizeTrigger()).not.toHaveAttribute("tabindex");
        });

        it("merges a custom className onto the trigger", () => {
            renderSplitter({ resizeTriggerProps: { className: "custom" } });
            expect(resizeTrigger()).toHaveClass("splitter-resize-trigger");
            expect(resizeTrigger()).toHaveClass("custom");
        });

        it("forwards a ref to the trigger element", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <Splitter>
                    <Splitter.Panel>One</Splitter.Panel>
                    <Splitter.ResizeTrigger ref={ref} />
                    <Splitter.Panel>Two</Splitter.Panel>
                </Splitter>,
            );
            expect(ref.current).toBe(resizeTrigger());
        });
    });

    describe("the separator", () => {
        it("draws the line the trigger was given, and keeps it out of the accessibility tree", () => {
            renderSplitter({ children: <Splitter.ResizeTriggerSeparator /> });
            expect(separator()).toBeInTheDocument();
            expect(separator()).toHaveClass("splitter-resize-trigger-separator");
            expect(separator()).toHaveAttribute("aria-hidden", "true");
        });

        it("merges a custom className onto the separator", () => {
            renderSplitter({ children: <Splitter.ResizeTriggerSeparator className="custom" /> });
            expect(separator()).toHaveClass("splitter-resize-trigger-separator");
            expect(separator()).toHaveClass("custom");
        });

        it("forwards a ref to the separator element", () => {
            const ref = React.createRef<HTMLSpanElement>();
            renderSplitter({ children: <Splitter.ResizeTriggerSeparator ref={ref} /> });
            expect(ref.current).toBe(separator());
        });
    });

    describe("the indicator", () => {
        it("draws the grip the trigger was given, and keeps it out of the accessibility tree", () => {
            renderSplitter({ children: <Splitter.ResizeTriggerIndicator /> });
            expect(indicator()).toBeInTheDocument();
            expect(indicator()).toHaveClass("splitter-resize-trigger-indicator");
            expect(indicator()).toHaveAttribute("aria-hidden", "true");
        });

        it("stands on the line where a trigger was given both", () => {
            renderSplitter({
                children: (
                    <React.Fragment>
                        <Splitter.ResizeTriggerSeparator />
                        <Splitter.ResizeTriggerIndicator />
                    </React.Fragment>
                ),
            });
            expect(resizeTrigger().children).toHaveLength(2);
            expect(separator()).toBeInTheDocument();
            expect(indicator()).toBeInTheDocument();
        });

        it("merges a custom className onto the indicator", () => {
            renderSplitter({ children: <Splitter.ResizeTriggerIndicator className="custom" /> });
            expect(indicator()).toHaveClass("splitter-resize-trigger-indicator");
            expect(indicator()).toHaveClass("custom");
        });

        it("forwards a ref to the indicator element", () => {
            const ref = React.createRef<HTMLSpanElement>();
            renderSplitter({ children: <Splitter.ResizeTriggerIndicator ref={ref} /> });
            expect(ref.current).toBe(indicator());
        });
    });
});
