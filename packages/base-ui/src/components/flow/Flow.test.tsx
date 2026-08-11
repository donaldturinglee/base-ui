import * as React from "react";
import { act } from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Flow, computeEdges, computePositions, connectorPath, entryIds, exitIds } from ".";
import type { FlowTreeNode } from "./Flow.types";

// jsdom lays nothing out, so every step would say it measures nothing and the layout would put
// them all in the same place. Every element is given a size instead: enough to tell the steps
// apart, and enough for the arithmetic to have something to work on
const NODE_WIDTH = 100;
const NODE_HEIGHT = 40;

const originalWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
const originalHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
const originalResizeObserver = window.ResizeObserver;

let nodeWidth = NODE_WIDTH;
let observers: ResizeObserverCallback[] = [];

const sizeElementsTo = (width: number) => {
    nodeWidth = width;
};

// Only the four dimensions the overflow hook reads are needed, so this stands in for a real entry
const entryWith = (dimensions: { scrollWidth?: number; clientWidth?: number }) =>
    ({
        target: {
            scrollHeight: 0,
            clientHeight: 0,
            scrollWidth: 0,
            clientWidth: 0,
            ...dimensions,
        },
    }) as unknown as ResizeObserverEntry;

// Every observer the render made is told at once, which is what a browser laying the page out
// again would do
const resizeAll = (entries: ResizeObserverEntry[] = []) => {
    act(() => {
        observers.forEach((callback) => callback(entries, {} as ResizeObserver));
    });
};

beforeEach(() => {
    nodeWidth = NODE_WIDTH;
    observers = [];

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get: () => nodeWidth,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        configurable: true,
        get: () => NODE_HEIGHT,
    });

    // jsdom has no ResizeObserver, so this one hands its callback back to the test
    window.ResizeObserver = class {
        constructor(callback: ResizeObserverCallback) {
            observers.push(callback);
        }
        observe() {}
        unobserve() {}
        disconnect() {}
    } as unknown as typeof ResizeObserver;
});

afterEach(() => {
    if (originalWidth) {
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalWidth);
    }

    if (originalHeight) {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalHeight);
    }

    window.ResizeObserver = originalResizeObserver;
});

const flow = () => document.querySelector('[data-component="Flow"]') as HTMLElement;

const canvas = () => document.querySelector('[data-component="Flow.Canvas"]') as HTMLElement;

const nodes = () => Array.from(document.querySelectorAll('[data-component="Flow.Node"]'));

const node = (id: string) => document.querySelector(`[data-node-id="${id}"]`) as HTMLElement;

const connectors = () => Array.from(document.querySelectorAll('[data-component="Flow.Connector"]'));

const joins = () =>
    connectors().map((path) => `${path.getAttribute("data-from")}>${path.getAttribute("data-to")}`);

const simple = () => (
    <Flow aria-label="How a request is served">
        <Flow.Node id="request">Request</Flow.Node>
        <Flow.Parallel>
            <Flow.Node id="cache">Cache</Flow.Node>
            <Flow.Node id="worker">Worker</Flow.Node>
        </Flow.Parallel>
        <Flow.Node id="response">Response</Flow.Node>
    </Flow>
);

describe("Flow", () => {
    it("renders a plain box by default", () => {
        render(simple());
        expect(flow().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(
            <Flow as="section" aria-label="Steps">
                <Flow.Node id="one">One</Flow.Node>
            </Flow>,
        );
        expect(flow().tagName).toBe("SECTION");
    });

    it("tags the flow and its parts with data-component attributes", () => {
        render(simple());

        for (const name of [
            "Flow",
            "Flow.Canvas",
            "Flow.Steps",
            "Flow.Node",
            "Flow.Parallel",
            "Flow.Connectors",
            "Flow.Connector",
        ]) {
            expect(document.querySelector(`[data-component="${name}"]`)).not.toBeNull();
        }
    });

    it("says how it is drawn, so a caller can style from it", () => {
        render(
            <Flow orientation="vertical" align="center" aria-label="Steps">
                <Flow.Node id="one">One</Flow.Node>
            </Flow>,
        );

        expect(flow()).toHaveAttribute("data-orientation", "vertical");
        expect(flow()).toHaveAttribute("data-align", "center");
    });

    describe("the steps", () => {
        it("draws one box to each step", () => {
            render(simple());
            expect(nodes()).toHaveLength(4);
        });

        it("keeps the order they were written in, so the flow can be read as a list", () => {
            render(simple());

            expect(nodes().map((step) => step.textContent)).toEqual([
                "Request",
                "Cache",
                "Worker",
                "Response",
            ]);
        });

        it("names a step that was given no name after where it stands", () => {
            render(
                <Flow aria-label="Steps">
                    <Flow.Node>One</Flow.Node>
                    <Flow.Node>Two</Flow.Node>
                </Flow>,
            );

            expect(nodes().map((step) => step.getAttribute("data-node-id"))).toEqual([
                "node-0",
                "node-1",
            ]);
        });

        it("leaves a step that was named alone", () => {
            render(simple());
            expect(node("cache")).toHaveTextContent("Cache");
        });

        it("says a step is out of use, and dims it", () => {
            render(
                <Flow aria-label="Steps">
                    <Flow.Node id="one">One</Flow.Node>
                    <Flow.Node id="two" disabled>
                        Two
                    </Flow.Node>
                </Flow>,
            );

            expect(node("two")).toHaveAttribute("data-disabled", "true");
            expect(node("two")).toHaveClass("flow-node-disabled");
        });

        it("leaves anything that is not a step standing where it was written", () => {
            render(
                <Flow aria-label="Steps">
                    <Flow.Node id="one">One</Flow.Node>
                    <li data-testid="aside">A note</li>
                </Flow>,
            );

            expect(screen.getByTestId("aside")).toBeInTheDocument();
            expect(nodes()).toHaveLength(1);
        });
    });

    describe("where the steps stand", () => {
        it("puts one step after another along the flow", () => {
            render(
                <Flow columnGap={20} aria-label="Steps">
                    <Flow.Node id="one">One</Flow.Node>
                    <Flow.Node id="two">Two</Flow.Node>
                </Flow>,
            );

            expect(node("one")).toHaveStyle({ insetInlineStart: "0px", insetBlockStart: "0px" });
            expect(node("two")).toHaveStyle({ insetInlineStart: `${NODE_WIDTH + 20}px` });
        });

        it("stands the branches of a group beside one another across the flow", () => {
            render(
                <Flow rowGap={10} aria-label="Steps">
                    <Flow.Parallel>
                        <Flow.Node id="a">A</Flow.Node>
                        <Flow.Node id="b">B</Flow.Node>
                    </Flow.Parallel>
                </Flow>,
            );

            expect(node("a")).toHaveStyle({ insetBlockStart: "0px" });
            expect(node("b")).toHaveStyle({ insetBlockStart: `${NODE_HEIGHT + 10}px` });
        });

        it("runs down the page where it is told to", () => {
            render(
                <Flow orientation="vertical" columnGap={20} rowGap={10} aria-label="Steps">
                    <Flow.Node id="one">One</Flow.Node>
                    <Flow.Parallel>
                        <Flow.Node id="a">A</Flow.Node>
                        <Flow.Node id="b">B</Flow.Node>
                    </Flow.Parallel>
                </Flow>,
            );

            expect(node("one")).toHaveStyle({ insetBlockStart: "0px" });
            expect(node("a")).toHaveStyle({
                insetBlockStart: `${NODE_HEIGHT + 20}px`,
                insetInlineStart: "0px",
            });
            expect(node("b")).toHaveStyle({ insetInlineStart: `${NODE_WIDTH + 10}px` });
        });

        it("sizes the canvas to the whole of the flow", () => {
            render(
                <Flow columnGap={20} aria-label="Steps">
                    <Flow.Node id="one">One</Flow.Node>
                    <Flow.Node id="two">Two</Flow.Node>
                </Flow>,
            );

            expect(canvas()).toHaveStyle({
                width: `${NODE_WIDTH * 2 + 20}px`,
                height: `${NODE_HEIGHT}px`,
            });
        });

        it("says once every step has been measured and put somewhere", () => {
            render(simple());
            expect(flow()).toHaveAttribute("data-measured", "true");
        });

        it("lays the flow out again when a step changes size", () => {
            render(
                <Flow columnGap={20} aria-label="Steps">
                    <Flow.Node id="one">One</Flow.Node>
                    <Flow.Node id="two">Two</Flow.Node>
                </Flow>,
            );

            expect(node("two")).toHaveStyle({ insetInlineStart: `${NODE_WIDTH + 20}px` });

            sizeElementsTo(NODE_WIDTH * 2);
            resizeAll();

            expect(node("two")).toHaveStyle({ insetInlineStart: `${NODE_WIDTH * 2 + 20}px` });
        });
    });

    describe("a flow larger than the room it is given", () => {
        it("is put in the tab order, so a keyboard reaches the rest of it", () => {
            render(simple());
            expect(flow()).not.toHaveAttribute("tabindex");

            resizeAll([entryWith({ scrollWidth: 500, clientWidth: 100 })]);

            expect(flow()).toHaveAttribute("tabindex", "0");
            expect(flow()).toHaveAttribute("role", "region");
        });

        it("is left out of the tab order where it has nothing to be scrolled to", () => {
            render(simple());

            resizeAll([entryWith({ scrollWidth: 100, clientWidth: 100 })]);

            expect(flow()).not.toHaveAttribute("tabindex");
        });
    });

    describe("the joins", () => {
        it("joins each step to the one after it", () => {
            render(
                <Flow aria-label="Steps">
                    <Flow.Node id="one">One</Flow.Node>
                    <Flow.Node id="two">Two</Flow.Node>
                    <Flow.Node id="three">Three</Flow.Node>
                </Flow>,
            );

            expect(joins()).toEqual(["one>two", "two>three"]);
        });

        it("fans out into a group and back in again", () => {
            render(simple());

            expect(joins()).toEqual([
                "request>cache",
                "request>worker",
                "cache>response",
                "worker>response",
            ]);
        });

        it("joins a group through the branch it is entered at and left by", () => {
            render(
                <Flow aria-label="Steps">
                    <Flow.Node id="start">Start</Flow.Node>
                    <Flow.Parallel>
                        <Flow.List>
                            <Flow.Node id="a1">A1</Flow.Node>
                            <Flow.Node id="a2">A2</Flow.Node>
                        </Flow.List>
                    </Flow.Parallel>
                    <Flow.Node id="end">End</Flow.Node>
                </Flow>,
            );

            expect(joins()).toEqual(["a1>a2", "start>a1", "a2>end"]);
        });

        it("dims a join touching a step that is out of use", () => {
            render(
                <Flow aria-label="Steps">
                    <Flow.Node id="one">One</Flow.Node>
                    <Flow.Node id="two" disabled>
                        Two
                    </Flow.Node>
                </Flow>,
            );

            const join = connectors()[0];

            expect(join).toHaveAttribute("data-disabled", "true");
            expect(join).toHaveClass("flow-connector-disabled");
        });

        it("points every join at an arrowhead of the flow's own", () => {
            render(simple());

            const marker = document.querySelector("marker");
            const join = connectors()[0];

            expect(marker?.id).toBeTruthy();
            expect(join).toHaveAttribute("marker-end", `url(#${marker?.id})`);
        });

        it("keeps the joins from a screen reader, since the list already says the order", () => {
            render(simple());
            expect(document.querySelector('[data-component="Flow.Connectors"]')).toHaveAttribute(
                "aria-hidden",
                "true",
            );
        });
    });

    describe("what a screen reader is told", () => {
        it("reads the steps as a list", () => {
            render(simple());

            const lists = screen.getAllByRole("list");

            expect(lists.length).toBeGreaterThanOrEqual(2);
            expect(screen.getAllByRole("listitem").length).toBe(5);
        });

        it("takes the name the caller gave it", () => {
            render(simple());
            expect(flow()).toHaveAttribute("aria-label", "How a request is served");
        });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Flow ref={ref} aria-label="Steps">
                <Flow.Node id="one">One</Flow.Node>
            </Flow>,
        );
        expect(ref.current).toBe(flow());
    });

    it("merges a custom className onto each part", () => {
        render(
            <Flow className="root" aria-label="Steps">
                <Flow.Node id="one" className="step">
                    One
                </Flow.Node>
                <Flow.Parallel className="group">
                    <Flow.List className="run">
                        <Flow.Node id="two">Two</Flow.Node>
                    </Flow.List>
                </Flow.Parallel>
            </Flow>,
        );

        expect(flow()).toHaveClass("root");
        expect(node("one")).toHaveClass("step");
        expect(document.querySelector('[data-component="Flow.Parallel"]')).toHaveClass("group");
        expect(document.querySelector('[data-component="Flow.List"]')).toHaveClass("run");
    });
});

describe("the flow layout", () => {
    const tree: FlowTreeNode = {
        kind: "list",
        children: [
            { kind: "node", id: "a" },
            {
                kind: "parallel",
                children: [
                    { kind: "node", id: "b" },
                    {
                        kind: "list",
                        children: [
                            { kind: "node", id: "c" },
                            { kind: "node", id: "d" },
                        ],
                    },
                ],
            },
            { kind: "node", id: "e" },
        ],
    };

    const sizes = {
        a: { width: 10, height: 10 },
        b: { width: 10, height: 10 },
        c: { width: 10, height: 10 },
        d: { width: 10, height: 10 },
        e: { width: 10, height: 10 },
    };

    it("is entered at the first step, and at every branch of a group at once", () => {
        expect(entryIds(tree)).toEqual(["a"]);
        expect(entryIds(tree.kind === "list" ? tree.children[1] : tree)).toEqual(["b", "c"]);
    });

    it("is left by the last step, and by every branch of a group at once", () => {
        expect(exitIds(tree)).toEqual(["e"]);
        expect(exitIds(tree.kind === "list" ? tree.children[1] : tree)).toEqual(["b", "d"]);
    });

    it("leaves two groups standing next to one another unjoined", () => {
        const adjacent: FlowTreeNode = {
            kind: "list",
            children: [
                { kind: "parallel", children: [{ kind: "node", id: "a" }] },
                { kind: "parallel", children: [{ kind: "node", id: "b" }] },
            ],
        };

        expect(computeEdges(adjacent)).toEqual([]);
    });

    it("passes over a branch holding no steps at all", () => {
        const sparse: FlowTreeNode = {
            kind: "list",
            children: [
                { kind: "list", children: [] },
                { kind: "node", id: "a" },
            ],
        };

        expect(computeEdges(sparse)).toEqual([]);
        expect(entryIds(sparse)).toEqual(["a"]);
    });

    it("lines a short branch up with the end of its group where it is told to", () => {
        const ending: FlowTreeNode = {
            kind: "list",
            children: [
                {
                    kind: "parallel",
                    align: "end",
                    children: [
                        { kind: "node", id: "b" },
                        {
                            kind: "list",
                            children: [
                                { kind: "node", id: "c" },
                                { kind: "node", id: "d" },
                            ],
                        },
                    ],
                },
            ],
        };

        const positions = computePositions(ending, {
            sizes,
            orientation: "horizontal",
            align: "start",
            columnGap: 10,
            rowGap: 10,
        });

        // The long branch runs 10 + 10 + 10; the short one is pushed along to finish beside it
        expect(positions.c.x).toBe(0);
        expect(positions.d.x).toBe(20);
        expect(positions.b.x).toBe(20);
    });

    it("stands a short step in the middle of its run where it is told to", () => {
        const positions = computePositions(tree, {
            sizes,
            orientation: "horizontal",
            align: "center",
            columnGap: 10,
            rowGap: 10,
        });

        // The group is two branches and a gap tall, so a single step beside it starts halfway
        // down the difference between the two
        expect(positions.a.y).toBe(10);
        expect(positions.b.y).toBe(0);
    });
});

describe("the joins between two steps", () => {
    const from = { x: 0, y: 0, width: 10, height: 10 };

    it("draws a straight line between two steps standing in the same row", () => {
        const path = connectorPath(from, { x: 30, y: 0, width: 10, height: 10 }, "horizontal", 8);
        expect(path).toBe("M 10 5 L 30 5");
    });

    it("turns twice to reach a step standing in another row", () => {
        const path = connectorPath(from, { x: 30, y: 40, width: 10, height: 10 }, "horizontal", 8);

        expect(path.startsWith("M 10 5")).toBe(true);
        expect(path).toContain("Q");
        expect(path.endsWith("H 30")).toBe(true);
    });

    it("leaves and enters through the ends of the boxes where the flow runs down", () => {
        const path = connectorPath(from, { x: 0, y: 30, width: 10, height: 10 }, "vertical", 8);
        expect(path).toBe("M 5 10 L 5 30");
    });

    it("holds the turn to what there is room for", () => {
        const path = connectorPath(from, { x: 14, y: 20, width: 10, height: 10 }, "horizontal", 8);

        // Two pixels of run either side of the halfway point, so the turn cannot be the eight
        // it was asked for
        expect(path).toContain("Q 12 5 12 7");
    });
});
