import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { JSONTreeView, toJSONNodes, toValueTokens } from ".";
import { typeOf } from "./jsonNodes";
import { describeNode, toLeafText } from "./jsonTokens";
import type { JSONTreeViewProps } from "./JSONTreeView.types";

const data = {
    name: "John Doe",
    age: 30,
    active: true,
    missing: null,
    tags: ["one", "two"],
    address: { street: "123 Main St", city: "Anytown" },
};

const tree = (props: Partial<JSONTreeViewProps> = {}) => <JSONTreeView data={data} {...props} />;

const root = () => document.querySelector('[data-component="JSONTreeView"]') as HTMLElement;

const rows = () => screen.getAllByRole("treeitem");

const rowNames = () => rows().map((row) => row.getAttribute("aria-label"));

const row = (name: string) => screen.getByRole("treeitem", { name });

// The row's own writing rather than that of everything standing under it: a row that has been
// opened holds its children inside it, and theirs come after its own in the page
const partOf = (name: string, part: string) =>
    row(name).querySelector(`[data-component="JSONTreeView.${part}"]`)?.textContent;

const valueOf = (name: string) => partOf(name, "Value");

const keyOf = (name: string) => partOf(name, "Key");

describe("JSONTreeView", () => {
    it("draws the data as a tree", () => {
        render(tree({ defaultExpandedDepth: 0 }));

        expect(root()).toBeInTheDocument();
        expect(screen.getByRole("tree")).toBe(root());
        expect(rows()).toHaveLength(Object.keys(data).length);
    });

    it("calls the tree something, so a reader knows what they have arrived at", () => {
        render(tree());
        expect(root()).toHaveAccessibleName("JSON data");
    });

    it("takes a name of the caller's own", () => {
        render(tree({ "aria-label": "Response body" }));
        expect(root()).toHaveAccessibleName("Response body");
    });

    it("keeps the class it was given alongside its own", () => {
        render(tree({ className: "response" }));
        expect(root()).toHaveClass("json-tree-view", "response");
    });

    it("tags its parts with data-component attributes", () => {
        render(tree({ defaultExpandedDepth: 0 }));

        expect(keyOf('name, string, "John Doe"')).toBe("name");
        expect(valueOf('name, string, "John Doe"')).toBe('"John Doe"');
    });

    describe("what a value is drawn as", () => {
        it("writes each kind of value the way that kind is written", () => {
            render(tree({ defaultExpandedDepth: 0 }));

            expect(valueOf('name, string, "John Doe"')).toBe('"John Doe"');
            expect(valueOf("age, number, 30")).toBe("30");
            expect(valueOf("active, boolean, true")).toBe("true");
            expect(valueOf("missing, null, null")).toBe("null");
        });

        it("says what each piece of a value is, so it can be drawn as what it is", () => {
            render(tree({ defaultExpandedDepth: 0 }));

            const token = row('name, string, "John Doe"').querySelector(
                '[data-component="JSONTreeView.Token"]',
            );

            expect(token).toHaveAttribute("data-type", "string");
        });

        it("leaves the names bare, and quotes them where it is asked to", () => {
            const { rerender } = render(tree({ defaultExpandedDepth: 0 }));
            expect(keyOf("age, number, 30")).toBe("age");

            rerender(tree({ defaultExpandedDepth: 0, quotesOnKeys: true }));
            expect(keyOf("age, number, 30")).toBe('"age"');
        });

        it("cuts a long string where it is told to, inside the quotes it is written in", () => {
            render(
                <JSONTreeView
                    data={{ note: "a string that runs on and on" }}
                    collapseStringsAfterLength={6}
                />,
            );

            expect(valueOf('note, string, "a stri…"')).toBe('"a stri…"');
        });

        it("draws a value some other way where the caller asks to", () => {
            const renderValue = vi.fn((token, node) =>
                node.key === "name" ? <a href="/who">{token.text}</a> : undefined,
            );

            render(tree({ defaultExpandedDepth: 0, renderValue }));

            expect(screen.getByRole("link")).toHaveTextContent('"John Doe"');
            expect(valueOf("age, number, 30")).toBe("30");
        });
    });

    describe("what a row gives away of what it holds", () => {
        it("gives a glimpse of what a closed row holds", () => {
            render(tree({ defaultExpandedDepth: 0 }));

            expect(valueOf("address, object, 2 items")).toBe(
                '{street: "123 Main St", city: "Anytown"}',
            );
            expect(valueOf("tags, array, 2 items")).toBe('["one", "two"]');
        });

        // Nothing standing under a row in a tree ever closes a bracket for it, so an open row that
        // gave away nothing would leave the one it opened unanswered
        it("says only that an open row holds something, and still closes its brackets", () => {
            render(tree({ defaultExpandedDepth: 1 }));

            expect(valueOf("address, object, 2 items")).toBe("{…}");
            expect(valueOf("tags, array, 2 items")).toBe("[…]");
        });

        it("closes the brackets of a row long enough to be cut off at the end", () => {
            const long = { note: "a".repeat(400), also: "b".repeat(400) };

            render(<JSONTreeView data={{ long }} defaultExpandedDepth={1} />);

            // Short enough that the closing bracket is never the part that falls off the row
            expect(valueOf("long, object, 2 items")).toBe("{…}");
        });

        it("gives away only as many as it was told to, and says there are more", () => {
            render(tree({ defaultExpandedDepth: 0, maxPreviewItems: 1 }));

            expect(valueOf("address, object, 2 items")).toBe('{street: "123 Main St", …}');
        });

        it("gives away what a list holds rather than what it calls them", () => {
            render(tree({ defaultExpandedDepth: 0 }));
            expect(valueOf("tags, array, 2 items")).toBe('["one", "two"]');
        });

        it("glimpses what a row holds without opening it out again", () => {
            render(
                <JSONTreeView data={{ outer: { inner: { deep: 1 } } }} defaultExpandedDepth={0} />,
            );

            expect(valueOf("outer, object, 1 item")).toBe("{inner: {…}}");
        });
    });

    describe("opening the tree", () => {
        it("opens as many levels down as it was told to", () => {
            render(tree({ defaultExpandedDepth: 1 }));

            expect(rowNames()).toContain('street, string, "123 Main St"');
        });

        it("leaves everything closed where it was told none", () => {
            render(tree({ defaultExpandedDepth: 0 }));

            expect(rowNames()).not.toContain('street, string, "123 Main St"');
        });

        it("opens a row when it is pressed", () => {
            render(tree({ defaultExpandedDepth: 0 }));

            fireEvent.click(row("address, object, 2 items"));

            expect(rowNames()).toContain('street, string, "123 Main St"');
        });

        it("leaves a value that holds nothing with nothing to open", () => {
            render(<JSONTreeView data={{ empty: {}, none: [] }} />);

            expect(row("empty, object, {}")).not.toHaveAttribute("aria-expanded");
            expect(valueOf("empty, object, {}")).toBe("{}");
            expect(valueOf("none, array, []")).toBe("[]");
        });
    });

    describe("the kinds of value a JSON file cannot write down", () => {
        it("draws a map under the name it was made by, and its keys as names", () => {
            render(
                <JSONTreeView data={{ sizes: new Map([["small", 1]]) }} defaultExpandedDepth={0} />,
            );

            expect(valueOf("sizes, map, 1 item")).toBe("Map(1){small: 1}");
        });

        it("counts its way through a set", () => {
            render(<JSONTreeView data={{ tags: new Set(["a", "b"]) }} defaultExpandedDepth={1} />);

            expect(valueOf("tags, set, 2 items")).toBe("Set(2){…}");
            expect(rowNames()).toContain('0, string, "a"');
        });

        it("draws an instance under the name it was made by", () => {
            class Point {
                constructor(
                    public x: number,
                    public y: number,
                ) {}
            }

            render(<JSONTreeView data={{ at: new Point(1, 2) }} defaultExpandedDepth={0} />);

            expect(valueOf("at, class, 2 items")).toBe("Point{x: 1, y: 2}");
        });

        it("opens an error onto what it is worth reading", () => {
            render(<JSONTreeView data={new Error("Boom")} defaultExpandedDepth={0} />);

            expect(rowNames()).toContain('message, string, "Boom"');
            expect(rowNames()).toContain('name, string, "Error"');
        });

        it("writes a function as what it is rather than as what it does", () => {
            render(
                <JSONTreeView
                    data={{
                        sum: function sum(a: number, b: number) {
                            return a + b;
                        },
                    }}
                />,
            );

            expect(valueOf("sum, function, ƒ sum()")).toBe("ƒ sum()");
        });

        it("keeps a regular expression as it was written", () => {
            render(<JSONTreeView data={{ pattern: /^[a-z]+/g }} />);
            expect(valueOf("pattern, regex, /^[a-z]+/g")).toBe("/^[a-z]+/g");
        });

        it("stops where a value holds itself", () => {
            const looping: Record<string, unknown> = { name: "loop" };
            looping.self = looping;

            render(<JSONTreeView data={looping} defaultExpandedDepth={0} />);

            expect(valueOf("self, circular, [Circular]")).toBe("[Circular]");
            expect(row("self, circular, [Circular]")).not.toHaveAttribute("aria-expanded");
        });

        it("reads the same thing standing in two places in both of them", () => {
            const shared = { id: 1 };

            render(
                <JSONTreeView data={{ first: shared, second: shared }} defaultExpandedDepth={0} />,
            );

            expect(valueOf("first, object, 1 item")).toBe("{id: 1}");
            expect(valueOf("second, object, 1 item")).toBe("{id: 1}");
        });
    });

    describe("the names an ordinary walk passes over", () => {
        const hidden = () => {
            const list = [1];
            Object.defineProperty(list, "note", { value: "aside", enumerable: false });
            return { list };
        };

        it("passes over them the way a walk would", () => {
            render(<JSONTreeView data={hidden()} defaultExpandedDepth={1} />);
            expect(rowNames()).not.toContain('note, string, "aside"');
        });

        it("shows them where it is asked to, and says they were hidden", () => {
            render(<JSONTreeView data={hidden()} defaultExpandedDepth={1} showNonEnumerable />);

            expect(rowNames()).toContain('note, string, "aside"');
            expect(
                row('note, string, "aside"').querySelector('[data-component="JSONTreeView.Key"]'),
            ).toHaveAttribute("data-non-enumerable", "true");
        });
    });

    describe("a list too long to open all at once", () => {
        const long = { items: Array.from({ length: 5 }, (_, index) => index) };

        it("breaks it into runs named for the stretch they cover", () => {
            render(
                <JSONTreeView data={long} groupArraysAfterLength={2} defaultExpandedDepth={1} />,
            );

            expect(rowNames()).toContain("0 … 1, array, 2 items");
            expect(rowNames()).toContain("4 … 4, array, 1 item");
        });

        it("keeps the places the rows came from", () => {
            render(
                <JSONTreeView data={long} groupArraysAfterLength={2} defaultExpandedDepth={2} />,
            );

            expect(rowNames()).toContain("4, number, 4");
        });

        it("leaves a list that fits in one run whole", () => {
            render(
                <JSONTreeView data={long} groupArraysAfterLength={10} defaultExpandedDepth={1} />,
            );

            expect(rowNames()).toContain("0, number, 0");
        });
    });
});

describe("reading a value into rows", () => {
    it("opens the value out, so the tree begins inside it", () => {
        expect(toJSONNodes({ a: 1, b: 2 }).map((node) => node.key)).toEqual(["a", "b"]);
    });

    it("stands a value that holds nothing as the one row it is", () => {
        const nodes = toJSONNodes(5);

        expect(nodes).toHaveLength(1);
        expect(nodes[0].key).toBeUndefined();
        expect(nodes[0].type).toBe("number");
    });

    it("tells one row from another by where it stands rather than by what it is called", () => {
        const nodes = toJSONNodes({ "a.b": { c: 1 }, a: { "b.c": 1 } });

        expect(nodes[0].children?.[0].id).not.toBe(nodes[1].children?.[0].id);
    });

    it("gives only what holds more of itself anything to hold", () => {
        const nodes = toJSONNodes({ a: 1, b: { c: 1 } });

        expect(nodes[0].children).toBeUndefined();
        expect(nodes[1].children).toHaveLength(1);
    });

    it("names each kind of value the way a reader would", () => {
        expect(typeOf(null)).toBe("null");
        expect(typeOf(undefined)).toBe("undefined");
        expect(typeOf([])).toBe("array");
        expect(typeOf({})).toBe("object");
        expect(typeOf(new Map())).toBe("map");
        expect(typeOf(new Set())).toBe("set");
        expect(typeOf(new Date())).toBe("date");
        expect(typeOf(/a/)).toBe("regex");
        expect(typeOf(new Error("x"))).toBe("error");
        expect(typeOf(1n)).toBe("bigint");
        expect(typeOf(Symbol("x"))).toBe("symbol");
        expect(typeOf(() => undefined)).toBe("function");
        expect(typeOf(new (class Thing {})())).toBe("class");
    });
});

describe("writing a value out", () => {
    it("writes a value that holds nothing as the text it reads as", () => {
        expect(toLeafText({ id: "0", type: "string", value: "hi" })).toBe('"hi"');
        expect(toLeafText({ id: "0", type: "bigint", value: 7n })).toBe("7n");
        expect(toLeafText({ id: "0", type: "undefined", value: undefined })).toBe("undefined");
    });

    it("marks an async function and a generator as what they are", () => {
        const asyncSum = async () => 1;
        function* counter() {
            yield 1;
        }

        expect(toLeafText({ id: "0", type: "function", value: asyncSum })).toContain("async ƒ");
        expect(toLeafText({ id: "0", type: "function", value: counter })).toContain("ƒ*");
    });

    it("says in words what the punctuation says by sight", () => {
        expect(describeNode({ id: "0", key: "age", type: "number", value: 30 })).toBe(
            "age, number, 30",
        );
        expect(describeNode({ id: "0", key: "age", type: "string", value: "30" })).toBe(
            'age, string, "30"',
        );
    });

    it("counts what a row holds one at a time", () => {
        const one = toJSONNodes({ a: { b: 1 } })[0];
        expect(describeNode(one)).toBe("a, object, 1 item");
    });

    it("hands back the pieces a value is drawn from", () => {
        const node = toJSONNodes({ a: { b: 1 } })[0];

        expect(toValueTokens(node).map((token) => token.text)).toEqual(["{", "b: ", "1", "}"]);
    });

    it("closes every bracket it opens, open or closed", () => {
        const brackets = (value: unknown, isExpanded: boolean) =>
            toValueTokens(toJSONNodes(value)[0], {}, isExpanded)
                .filter((token) => token.kind === "bracket")
                .map((token) => token.text);

        for (const expanded of [false, true]) {
            expect(brackets({ a: { b: 1 } }, expanded)).toEqual(["{", "}"]);
            expect(brackets({ a: [1, 2] }, expanded)).toEqual(["[", "]"]);
            expect(brackets({ a: new Map([["b", 1]]) }, expanded)).toEqual(["{", "}"]);
        }

        expect(toValueTokens(toJSONNodes({ a: { b: 1 } })[0], {}, true).map((t) => t.text)).toEqual(
            ["{", "…", "}"],
        );
    });
});
