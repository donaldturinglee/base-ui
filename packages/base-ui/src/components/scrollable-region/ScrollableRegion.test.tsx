import * as React from "react";
import { act } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import ScrollableRegion from "./ScrollableRegion";

type Dimensions = {
    scrollHeight?: number;
    clientHeight?: number;
    scrollWidth?: number;
    clientWidth?: number;
};

// Only the four dimensions the overflow hook reads are needed, so this stands in for a
// real entry
const entryWith = (dimensions: Dimensions) =>
    ({
        target: {
            scrollHeight: 0,
            clientHeight: 0,
            scrollWidth: 0,
            clientWidth: 0,
            ...dimensions,
        },
    }) as unknown as ResizeObserverEntry;

const originalResizeObserver = window.ResizeObserver;

let resize: (entries: ResizeObserverEntry[]) => void;

describe("ScrollableRegion", () => {
    // jsdom has no ResizeObserver, so this one hands the callback back to the test
    beforeEach(() => {
        window.ResizeObserver = class {
            constructor(callback: ResizeObserverCallback) {
                resize = (entries) => callback(entries, this as unknown as ResizeObserver);
            }
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders a div element by default", () => {
        render(
            <ScrollableRegion aria-label="Example region" data-testid="region">
                Content
            </ScrollableRegion>,
        );
        expect(screen.getByTestId("region").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <ScrollableRegion as="section" aria-label="Example region" data-testid="region">
                Content
            </ScrollableRegion>,
        );
        expect(screen.getByTestId("region").tagName).toBe("SECTION");
    });

    it("renders its children", () => {
        render(<ScrollableRegion aria-label="Example region">Content</ScrollableRegion>);
        expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("scrolls its own content", () => {
        render(
            <ScrollableRegion aria-label="Example region" data-testid="region">
                Content
            </ScrollableRegion>,
        );
        expect(screen.getByTestId("region")).toHaveClass("scrollable-region");
    });

    it("stays out of the accessibility tree until the content overflows", () => {
        render(
            <ScrollableRegion aria-label="Example region" data-testid="region">
                Content
            </ScrollableRegion>,
        );
        const region = screen.getByTestId("region");
        expect(region).not.toHaveAttribute("role");
        expect(region).not.toHaveAttribute("tabindex");
        expect(region).not.toHaveAttribute("aria-label");
        expect(region).not.toHaveAttribute("aria-labelledby");
    });

    it("becomes a labelled region when the content overflows vertically", () => {
        render(
            <ScrollableRegion aria-label="Example region" data-testid="region">
                Content
            </ScrollableRegion>,
        );

        act(() => {
            resize([entryWith({ scrollHeight: 500, clientHeight: 100 })]);
        });

        const region = screen.getByTestId("region");
        expect(region).toHaveAttribute("role", "region");
        expect(region).toHaveAttribute("tabindex", "0");
        expect(screen.getByLabelText("Example region")).toBe(region);
    });

    it("becomes a region when the content overflows horizontally", () => {
        render(
            <ScrollableRegion aria-label="Example region" data-testid="region">
                Content
            </ScrollableRegion>,
        );

        act(() => {
            resize([entryWith({ scrollWidth: 500, clientWidth: 100 })]);
        });

        expect(screen.getByTestId("region")).toHaveAttribute("role", "region");
    });

    it("stays out of the accessibility tree when the content fits", () => {
        render(
            <ScrollableRegion aria-label="Example region" data-testid="region">
                Content
            </ScrollableRegion>,
        );

        act(() => {
            resize([entryWith({ scrollHeight: 100, clientHeight: 100 })]);
        });

        expect(screen.getByTestId("region")).not.toHaveAttribute("role");
    });

    it("labels the region from another element", () => {
        render(
            <>
                <h2 id="heading">Example heading</h2>
                <ScrollableRegion aria-labelledby="heading" data-testid="region">
                    Content
                </ScrollableRegion>
            </>,
        );

        act(() => {
            resize([entryWith({ scrollHeight: 500, clientHeight: 100 })]);
        });

        const region = screen.getByTestId("region");
        expect(region).toHaveAttribute("aria-labelledby", "heading");
        expect(region).not.toHaveAttribute("aria-label");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <ScrollableRegion aria-label="Example region" id="log" data-testid="region">
                Content
            </ScrollableRegion>,
        );
        expect(screen.getByTestId("region")).toHaveAttribute("id", "log");
    });

    it("tags the root element with a data-component attribute", () => {
        render(
            <ScrollableRegion aria-label="Example region" data-testid="region">
                Content
            </ScrollableRegion>,
        );
        expect(screen.getByTestId("region")).toHaveAttribute("data-component", "ScrollableRegion");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <ScrollableRegion ref={ref} aria-label="Example region">
                Content
            </ScrollableRegion>,
        );
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <ScrollableRegion aria-label="Example region" className="custom" data-testid="region">
                Content
            </ScrollableRegion>,
        );
        expect(screen.getByTestId("region")).toHaveClass("custom");
    });
});
