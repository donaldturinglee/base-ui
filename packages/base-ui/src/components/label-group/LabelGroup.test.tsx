import * as React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { Label } from "../label";
import { LabelGroup } from ".";
import type { LabelGroupProps } from "./LabelGroup.types";

const originalIntersectionObserver = window.IntersectionObserver;
const originalResizeObserver = window.ResizeObserver;

type Watched = {
    element: Element;
    callback: IntersectionObserverCallback;
    observer: IntersectionObserver;
};

let watched: Watched[] = [];

const names = ["One", "Two", "Three", "Four", "Five"];

const renderLabelGroup = (props: Partial<LabelGroupProps> = {}) =>
    render(
        <LabelGroup {...props}>
            {names.map((name) => (
                <Label key={name}>{name}</Label>
            ))}
        </LabelGroup>,
    );

const group = () => document.querySelector("[data-component='LabelGroup']") as HTMLElement;

const toggle = () => document.querySelector("[data-component='LabelGroup.Toggle']");

const items = () => Array.from(group().querySelectorAll("[data-index]"));

const hiddenItems = () => Array.from(group().querySelectorAll("[data-hidden]"));

const button = (name: string) => screen.getByRole("button", { name });

// Reports that a label has been cut off by the row it stands in, which is how the group is told
// it no longer fits
const clip = (element: Element, isClipped = true) => {
    const entry = watched.find((one) => one.element === element);

    if (!entry) {
        throw new Error("The label is not being watched");
    }

    act(() => {
        entry.callback(
            [
                {
                    target: element,
                    intersectionRatio: isClipped ? 0 : 1,
                } as IntersectionObserverEntry,
            ],
            entry.observer,
        );
    });
};

describe("LabelGroup", () => {
    // jsdom has neither observer, and the group watches its labels to work out which of them
    // still fit while the overlay holding the rest watches its own size
    beforeEach(() => {
        watched = [];

        window.IntersectionObserver = class {
            private readonly callback: IntersectionObserverCallback;

            constructor(callback: IntersectionObserverCallback) {
                this.callback = callback;
            }

            observe(element: Element) {
                watched.push({
                    element,
                    callback: this.callback,
                    observer: this as unknown as IntersectionObserver,
                });
            }

            unobserve() {}
            disconnect() {}
        } as unknown as typeof IntersectionObserver;

        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
        window.ResizeObserver = originalResizeObserver;
    });

    describe("what it is rendered as", () => {
        it("is a list holding a list item per label unless it is told otherwise", () => {
            renderLabelGroup();

            expect(group().tagName).toBe("UL");
            expect(group()).toHaveAttribute("data-list", "true");
            expect(group().querySelectorAll("li")).toHaveLength(names.length);
        });

        it("is whatever else it is asked for, holding spans instead", () => {
            renderLabelGroup({ as: "div" });

            expect(group().tagName).toBe("DIV");
            expect(group()).not.toHaveAttribute("data-list");
            expect(group().querySelectorAll("li")).toHaveLength(0);
            expect(group().querySelectorAll("span[data-index]")).toHaveLength(names.length);
        });

        it("counts an ordered list as a list as well", () => {
            renderLabelGroup({ as: "ol" });

            expect(group().tagName).toBe("OL");
            expect(group()).toHaveAttribute("data-list", "true");
        });

        it("draws every label it is given", () => {
            renderLabelGroup();

            for (const name of names) {
                expect(screen.getByText(name)).toBeInTheDocument();
            }
        });
    });

    describe("holding nothing back", () => {
        it("wraps, since a row showing everything has nothing to gain from clipping", () => {
            renderLabelGroup();

            expect(group()).toHaveClass("label-group", "label-group-wrap");
            expect(group()).toHaveAttribute("data-overflow", "inline");
        });

        it("stands up no toggle, there being nothing for it to say", () => {
            renderLabelGroup();

            expect(toggle()).not.toBeInTheDocument();
            expect(hiddenItems()).toHaveLength(0);
        });

        it("watches nothing, since there is nothing to work out", () => {
            renderLabelGroup();

            expect(watched).toHaveLength(0);
        });
    });

    describe("stopping after a given number", () => {
        it("holds back everything past the count", () => {
            renderLabelGroup({ visibleChildCount: 3 });

            expect(hiddenItems()).toHaveLength(2);
            expect(items()[2]).not.toHaveAttribute("data-hidden");
            expect(items()[3]).toHaveAttribute("data-hidden", "");
            expect(items()[3]).toHaveClass("label-group-item-hidden");
        });

        it("keeps to one line while it is holding something back", () => {
            renderLabelGroup({ visibleChildCount: 3 });

            expect(group()).not.toHaveClass("label-group-wrap");
            expect(group()).not.toHaveAttribute("data-overflow");
        });

        it("counts what it is holding back, and says so where only the number is read", () => {
            renderLabelGroup({ visibleChildCount: 3 });

            expect(button("Show +2 more")).toHaveTextContent("+2");
        });

        it("stands the toggle in the same kind of wrapper as the labels", () => {
            const { rerender } = renderLabelGroup({ visibleChildCount: 3 });

            expect(toggle()?.tagName).toBe("LI");

            rerender(
                <LabelGroup as="div" visibleChildCount={3}>
                    {names.map((name) => (
                        <Label key={name}>{name}</Label>
                    ))}
                </LabelGroup>,
            );

            expect(toggle()?.tagName).toBe("SPAN");
        });

        it("holds nothing back where it was told to show more than it was given", () => {
            renderLabelGroup({ visibleChildCount: 10 });

            expect(hiddenItems()).toHaveLength(0);
            expect(screen.queryByRole("button")).not.toBeInTheDocument();
        });
    });

    describe("showing as many as there is room for", () => {
        it("watches every label", () => {
            renderLabelGroup({ visibleChildCount: "auto" });

            expect(watched).toHaveLength(names.length);
        });

        it("holds back a label the row has cut off", () => {
            renderLabelGroup({ visibleChildCount: "auto" });

            expect(hiddenItems()).toHaveLength(0);

            clip(items()[4]);

            expect(items()[4]).toHaveAttribute("data-hidden", "");
            expect(button("Show +1 more")).toBeInTheDocument();
        });

        it("shows it again once the row has room for it", () => {
            renderLabelGroup({ visibleChildCount: "auto" });

            clip(items()[3]);
            clip(items()[4]);
            expect(hiddenItems()).toHaveLength(2);

            clip(items()[3], false);

            expect(hiddenItems()).toHaveLength(1);
            expect(button("Show +1 more")).toBeInTheDocument();
        });
    });

    describe("showing the rest inline", () => {
        const renderInline = () =>
            renderLabelGroup({ visibleChildCount: 3, overflowStyle: "inline" });

        it("brings them into the row, and lets it wrap to hold them", () => {
            renderInline();

            fireEvent.click(button("Show +2 more"));

            expect(hiddenItems()).toHaveLength(0);
            expect(group()).toHaveClass("label-group-wrap");
        });

        it("offers to put them back again", () => {
            renderInline();

            fireEvent.click(button("Show +2 more"));

            expect(button("Show less")).toBeInTheDocument();
        });

        it("puts them back where it is asked to", () => {
            renderInline();

            fireEvent.click(button("Show +2 more"));
            fireEvent.click(button("Show less"));

            expect(hiddenItems()).toHaveLength(2);
            expect(button("Show +2 more")).toBeInTheDocument();
        });

        it("moves focus onto the button that puts them back, there being nothing in the labels to take it", () => {
            renderInline();

            fireEvent.click(button("Show +2 more"));

            expect(document.activeElement).toBe(button("Show less"));
        });

        it("moves focus onto the first label that has come into view where it can take it", () => {
            render(
                <LabelGroup visibleChildCount={1} overflowStyle="inline">
                    <Label>One</Label>
                    <button type="button">Two</button>
                </LabelGroup>,
            );

            fireEvent.click(button("Show +1 more"));

            expect(document.activeElement).toBe(button("Two"));
        });

        it("hands focus back to the count once they have been put away", () => {
            renderInline();

            fireEvent.click(button("Show +2 more"));
            fireEvent.click(button("Show less"));

            expect(document.activeElement).toBe(button("Show +2 more"));
        });

        it("leaves focus where it is on the first render", () => {
            renderInline();

            expect(document.activeElement).toBe(document.body);
        });
    });

    describe("showing the rest in an overlay", () => {
        const renderOverlay = () => renderLabelGroup({ visibleChildCount: 3 });

        it("opens a dialog naming how many labels there are in all", async () => {
            renderOverlay();

            fireEvent.click(button("Show +2 more"));

            const dialog = await screen.findByRole("dialog");
            expect(dialog).toHaveAccessibleName(`All ${names.length} labels`);
        });

        it("shows every label in it, not only the ones that were held back", async () => {
            renderOverlay();

            fireEvent.click(button("Show +2 more"));

            const dialog = await screen.findByRole("dialog");

            for (const name of names) {
                expect(within(dialog).getByText(name)).toBeInTheDocument();
            }
        });

        it("leaves the row exactly as it was", async () => {
            renderOverlay();

            fireEvent.click(button("Show +2 more"));
            await screen.findByRole("dialog");

            expect(hiddenItems()).toHaveLength(2);
            expect(group()).not.toHaveClass("label-group-wrap");
        });

        it("holds focus, landing on the button that closes it", async () => {
            renderOverlay();

            fireEvent.click(button("Show +2 more"));
            await screen.findByRole("dialog");

            await waitFor(() => {
                expect(document.activeElement).toBe(button("Close"));
            });
        });

        it("closes on the button, and hands focus back to the count", async () => {
            renderOverlay();

            fireEvent.click(button("Show +2 more"));
            await screen.findByRole("dialog");

            fireEvent.click(button("Close"));

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
            expect(document.activeElement).toBe(button("Show +2 more"));
        });

        it("closes on Escape", async () => {
            renderOverlay();

            fireEvent.click(button("Show +2 more"));
            await screen.findByRole("dialog");

            act(() => {
                fireEvent.keyDown(document, { key: "Escape" });
            });

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    it("merges a custom className onto the row", () => {
        renderLabelGroup({ className: "custom" });

        expect(group()).toHaveClass("label-group", "custom");
    });

    it("hands the ref it is given the row itself", () => {
        const ref = React.createRef<HTMLUListElement>();

        render(
            <LabelGroup ref={ref}>
                <Label>One</Label>
            </LabelGroup>,
        );

        expect(ref.current).toBe(group());
    });
});
