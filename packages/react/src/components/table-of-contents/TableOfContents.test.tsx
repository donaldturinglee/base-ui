import * as React from "react";
import { act, createEvent, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { TableOfContents, useTableOfContents } from ".";
import type { TableOfContentsItemData, TableOfContentsProps } from "./TableOfContents.types";

const originalIntersectionObserver = window.IntersectionObserver;
const originalResizeObserver = window.ResizeObserver;

type Watched = {
    element: Element;
    callback: IntersectionObserverCallback;
    observer: IntersectionObserver;
};

let watched: Watched[] = [];

let observerOptions: IntersectionObserverInit | undefined;

const items: TableOfContentsItemData[] = [
    { value: "introduction", depth: 2 },
    { value: "usage", depth: 2 },
    { value: "options", depth: 3 },
    { value: "api-reference", depth: 2 },
];

const labels: Record<string, string> = {
    introduction: "Introduction",
    usage: "Usage",
    options: "Options",
    "api-reference": "API reference",
};

// Reports that headings have come onto the screen or gone off it, which is the only way the
// contents are told where the reader has got to
const cross = (crossings: { value: string; isIntersecting: boolean }[]) => {
    const entry = watched[0];

    if (!entry) {
        throw new Error("No heading is being watched");
    }

    act(() => {
        entry.callback(
            crossings.map(
                ({ value, isIntersecting }) =>
                    ({
                        target: { id: value } as Element,
                        isIntersecting,
                    }) as IntersectionObserverEntry,
            ),
            entry.observer,
        );
    });
};

type TestProps = Partial<TableOfContentsProps> & Partial<Record<`data-${string}`, string>>;

const contents = (props: TestProps = {}) => (
    <TableOfContents items={items} {...props}>
        <TableOfContents.Content>
            {items.map((item) => (
                <h2 key={item.value} id={item.value}>
                    {labels[item.value]}
                </h2>
            ))}
        </TableOfContents.Content>

        <TableOfContents.Nav>
            <TableOfContents.Title>On this page</TableOfContents.Title>
            <TableOfContents.List>
                <TableOfContents.Indicator />
                {items.map((item) => (
                    <TableOfContents.Item key={item.value} item={item}>
                        <TableOfContents.Link href={`#${item.value}`}>
                            {labels[item.value]}
                        </TableOfContents.Link>
                    </TableOfContents.Item>
                ))}
            </TableOfContents.List>
        </TableOfContents.Nav>
    </TableOfContents>
);

const part = (name: string) =>
    document.querySelector(`[data-component="TableOfContents.${name}"]`) as HTMLElement;

const root = () => document.querySelector('[data-component="TableOfContents"]') as HTMLElement;

const line = (value: string) =>
    document.querySelector(
        `[data-component="TableOfContents.Item"][data-value="${value}"]`,
    ) as HTMLElement;

const link = (value: string) =>
    document.querySelector(
        `[data-component="TableOfContents.Link"][data-value="${value}"]`,
    ) as HTMLElement;

describe("TableOfContents", () => {
    // jsdom has neither observer, and the contents watch the headings of the document while the
    // bar beside the list watches the lines it is drawn against
    beforeEach(() => {
        watched = [];
        observerOptions = undefined;

        window.IntersectionObserver = class {
            private readonly callback: IntersectionObserverCallback;

            constructor(
                callback: IntersectionObserverCallback,
                options?: IntersectionObserverInit,
            ) {
                this.callback = callback;
                observerOptions = options;
            }

            observe(element: Element) {
                watched.push({
                    element,
                    callback: this.callback,
                    observer: this as unknown as IntersectionObserver,
                });
            }

            unobserve() {}

            // The contents watch the document again once they have been handed the panel it is
            // scrolled in, so what the watch before it was holding has to be let go of here
            disconnect() {
                watched = watched.filter((one) => one.callback !== this.callback);
            }
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

    it("renders a plain box by default", () => {
        render(contents());
        expect(root().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(contents({ as: "section" }));
        expect(root().tagName).toBe("SECTION");
    });

    it("tags the contents and their parts with data-component attributes", () => {
        render(contents());

        expect(root()).toBeInTheDocument();
        expect(part("Content")).toBeInTheDocument();
        expect(part("Nav")).toBeInTheDocument();
        expect(part("Title")).toBeInTheDocument();
        expect(part("List")).toBeInTheDocument();
        expect(part("Indicator")).toBeInTheDocument();
        expect(line("usage")).toBeInTheDocument();
        expect(link("usage")).toBeInTheDocument();
    });

    it("lets the caller name the root element something else", () => {
        render(contents({ "data-component": "PageContents" }));
        expect(document.querySelector('[data-component="PageContents"]')).toBeInTheDocument();
    });

    it("keeps the class it was given alongside its own", () => {
        render(contents({ className: "docs" }));
        expect(root()).toHaveClass("table-of-contents", "docs");
    });

    it("gives every part a class of its own", () => {
        render(contents());

        expect(part("Content")).toHaveClass("table-of-contents-content");
        expect(part("Nav")).toHaveClass("table-of-contents-nav");
        expect(part("Title")).toHaveClass("table-of-contents-title");
        expect(part("List")).toHaveClass("table-of-contents-list");
        expect(part("Indicator")).toHaveClass("table-of-contents-indicator");
        expect(line("usage")).toHaveClass("table-of-contents-item");
        expect(link("usage")).toHaveClass("table-of-contents-link");
    });

    it("draws each part as the element it stands for", () => {
        render(contents());

        expect(part("Content").tagName).toBe("ARTICLE");
        expect(part("Nav").tagName).toBe("NAV");
        expect(part("Title").tagName).toBe("H2");
        expect(part("List").tagName).toBe("UL");
        expect(line("usage").tagName).toBe("LI");
        expect(link("usage").tagName).toBe("A");
    });

    it("lets a part be drawn as whatever it is told to", () => {
        render(
            <TableOfContents items={items}>
                <TableOfContents.Nav as="div">
                    <TableOfContents.Title as="h3">On this page</TableOfContents.Title>
                </TableOfContents.Nav>
            </TableOfContents>,
        );

        expect(part("Nav").tagName).toBe("DIV");
        expect(part("Title").tagName).toBe("H3");
    });

    describe("the nav", () => {
        it("is a landmark a reader can go straight to", () => {
            render(contents());
            expect(screen.getByRole("navigation")).toBe(part("Nav"));
        });

        it("is named by the title standing over it", () => {
            render(contents());
            expect(screen.getByRole("navigation")).toHaveAccessibleName("On this page");
        });

        it("is left to be named by the caller where there is no title to name it", () => {
            render(
                <TableOfContents items={items}>
                    <TableOfContents.Nav aria-label="On this page">
                        <TableOfContents.List />
                    </TableOfContents.Nav>
                </TableOfContents>,
            );

            expect(part("Nav")).not.toHaveAttribute("aria-labelledby");
            expect(screen.getByRole("navigation")).toHaveAccessibleName("On this page");
        });

        it("stands wherever it is written unless it is told which side to take", () => {
            render(contents());
            expect(part("Nav")).not.toHaveAttribute("data-placement");
        });

        it("says which side it stands on where it is told", () => {
            render(
                <TableOfContents items={items}>
                    <TableOfContents.Nav placement="start" />
                </TableOfContents>,
            );

            expect(part("Nav")).toHaveAttribute("data-placement", "start");
        });
    });

    describe("the lines", () => {
        it("says which heading each line stands for and how deep it sits", () => {
            render(contents());

            expect(line("options")).toHaveAttribute("data-value", "options");
            expect(line("options")).toHaveAttribute("data-depth", "3");
        });

        it("points each line at the heading it stands for", () => {
            render(contents());

            expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("href", "#usage");
            expect(screen.getByRole("link", { name: "API reference" })).toHaveAttribute(
                "href",
                "#api-reference",
            );
        });

        it("stands the lines in a list, so a reader is told how many there are", () => {
            render(contents());
            expect(screen.getAllByRole("listitem")).toHaveLength(items.length);
        });
    });

    describe("where the reader is", () => {
        it("starts where it is told to start", () => {
            render(contents({ defaultActiveIds: ["usage"] }));

            expect(link("usage")).toHaveAttribute("data-active", "");
            expect(line("usage")).toHaveAttribute("data-active", "");
            expect(link("introduction")).not.toHaveAttribute("data-active");
        });

        it("is read out as a place on the page rather than as a page of its own", () => {
            render(contents({ defaultActiveIds: ["usage"] }));

            expect(link("usage")).toHaveAttribute("aria-current", "location");
            expect(link("introduction")).not.toHaveAttribute("aria-current");
        });

        it("holds a run of headings that are all on screen at once", () => {
            render(contents({ defaultActiveIds: ["introduction", "usage"] }));

            expect(line("introduction")).toHaveAttribute("data-first", "");
            expect(line("introduction")).not.toHaveAttribute("data-last");
            expect(line("usage")).toHaveAttribute("data-last", "");
            expect(line("options")).not.toHaveAttribute("data-active");
        });

        it("says whatever the caller tells it to say", () => {
            const { rerender } = render(contents({ activeIds: ["options"] }));

            expect(link("options")).toHaveAttribute("data-active", "");

            rerender(contents({ activeIds: ["api-reference"] }));

            expect(link("api-reference")).toHaveAttribute("data-active", "");
            expect(link("options")).not.toHaveAttribute("data-active");
        });

        it("follows the headings as they cross the screen", () => {
            render(contents());

            cross([{ value: "usage", isIntersecting: true }]);

            expect(link("usage")).toHaveAttribute("data-active", "");
        });

        it("reads a run of headings in the order the document puts them in", () => {
            render(contents());

            cross([
                { value: "usage", isIntersecting: true },
                { value: "introduction", isIntersecting: true },
            ]);

            expect(line("introduction")).toHaveAttribute("data-first", "");
            expect(line("usage")).toHaveAttribute("data-last", "");
        });

        // A reader part of the way down a long section has scrolled its heading off the top of
        // the page, and is still under it
        it("stays where it was once every heading has gone by overhead", () => {
            render(contents());

            cross([{ value: "usage", isIntersecting: true }]);
            cross([{ value: "usage", isIntersecting: false }]);

            expect(link("usage")).toHaveAttribute("data-active", "");
        });

        it("reports where the reader has got to as it changes", () => {
            const onActiveChange = vi.fn();
            render(contents({ onActiveChange }));

            cross([{ value: "usage", isIntersecting: true }]);

            expect(onActiveChange).toHaveBeenCalledTimes(1);
            expect(onActiveChange).toHaveBeenLastCalledWith({
                activeIds: ["usage"],
                activeItems: [{ value: "usage", depth: 2 }],
            });
        });

        it("says nothing where the reader has not moved on", () => {
            const onActiveChange = vi.fn();
            render(contents({ onActiveChange }));

            cross([{ value: "usage", isIntersecting: true }]);
            cross([{ value: "usage", isIntersecting: true }]);

            expect(onActiveChange).toHaveBeenCalledTimes(1);
        });

        it("leaves the caller who holds it saying where the reader is", () => {
            const onActiveChange = vi.fn();
            render(contents({ activeIds: ["introduction"], onActiveChange }));

            cross([{ value: "usage", isIntersecting: true }]);

            expect(onActiveChange).toHaveBeenCalledTimes(1);
            expect(link("introduction")).toHaveAttribute("data-active", "");
            expect(link("usage")).not.toHaveAttribute("data-active");
        });
    });

    describe("watching the document", () => {
        it("watches every heading it was given", () => {
            render(contents());
            expect(watched).toHaveLength(items.length);
        });

        it("watches within the document rather than within the window", () => {
            render(contents());
            expect(observerOptions?.root).toBe(part("Content"));
        });

        it("holds the band near the top of the page unless it is told otherwise", () => {
            render(contents());
            expect(observerOptions?.rootMargin).toBe("-20px 0% -40% 0%");
        });

        it("watches as closely as it is told to", () => {
            render(contents({ rootMargin: "0px", threshold: 0.5 }));

            expect(observerOptions?.rootMargin).toBe("0px");
            expect(observerOptions?.threshold).toBe(0.5);
        });

        it("watches the window itself where the caller says there is no panel", () => {
            render(contents({ scrollElement: null }));
            expect(observerOptions?.root).toBe(null);
        });
    });

    describe("following a line", () => {
        it("leaves the jump to the browser where the whole window is what scrolls", () => {
            render(contents({ scrollElement: null }));

            const press = createEvent.click(link("usage"));
            fireEvent(link("usage"), press);

            expect(press.defaultPrevented).toBe(false);
        });

        it("makes the jump by hand where the document is scrolled inside a panel", () => {
            render(contents());

            const scrolled = vi.fn();
            Object.assign(part("Content"), { scrollTo: scrolled });

            const press = createEvent.click(link("usage"));
            fireEvent(link("usage"), press);

            expect(scrolled).toHaveBeenCalled();
            expect(press.defaultPrevented).toBe(true);
            expect(window.location.hash).toBe("#usage");
        });

        it("still tells the caller about the press it was handed", () => {
            const onClick = vi.fn();

            render(
                <TableOfContents items={items}>
                    <TableOfContents.List>
                        <TableOfContents.Item item={items[1]}>
                            <TableOfContents.Link href="#usage" onClick={onClick}>
                                Usage
                            </TableOfContents.Link>
                        </TableOfContents.Item>
                    </TableOfContents.List>
                </TableOfContents>,
            );

            fireEvent.click(link("usage"));

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it("leaves a press the caller has already answered alone", () => {
            render(
                <TableOfContents items={items}>
                    <TableOfContents.Content>
                        <h2 id="usage">Usage</h2>
                    </TableOfContents.Content>
                    <TableOfContents.List>
                        <TableOfContents.Item item={items[1]}>
                            <TableOfContents.Link
                                href="#usage"
                                onClick={(event) => event.preventDefault()}
                            >
                                Usage
                            </TableOfContents.Link>
                        </TableOfContents.Item>
                    </TableOfContents.List>
                </TableOfContents>,
            );

            const scrolled = vi.fn();
            Object.assign(part("Content"), { scrollTo: scrolled });

            fireEvent.click(link("usage"));

            expect(scrolled).not.toHaveBeenCalled();
        });

        it("leaves a press asking for a tab of its own to the browser", () => {
            render(contents());

            const scrolled = vi.fn();
            Object.assign(part("Content"), { scrollTo: scrolled });

            fireEvent.click(link("usage"), { metaKey: true });

            expect(scrolled).not.toHaveBeenCalled();
        });
    });

    describe("the bar beside the list", () => {
        it("says nothing to a reader who cannot see it", () => {
            render(contents());
            expect(part("Indicator")).toHaveAttribute("aria-hidden", "true");
        });

        // Nothing is laid out in a document that is never drawn, so there is never anything for
        // the bar to be measured against here
        it("is left off the page until there is something to draw it against", () => {
            render(contents());
            expect(part("Indicator")).toHaveAttribute("hidden");
        });
    });

    describe("standing on their own", () => {
        it("draws a part outside any contents without complaint", () => {
            render(
                <TableOfContents.Item item={items[0]}>
                    <TableOfContents.Link href="#introduction">Introduction</TableOfContents.Link>
                </TableOfContents.Item>,
            );

            expect(line("introduction")).toBeInTheDocument();
            expect(link("introduction")).not.toHaveAttribute("data-active");
        });
    });
});

describe("useTableOfContents", () => {
    const Contents = ({ activeIds }: { activeIds?: string[] }) => {
        const contents = useTableOfContents({ items, activeIds });

        return (
            <>
                <output>{contents.activeIds.join(", ")}</output>
                <span data-testid="count">{contents.activeItems.length}</span>
                <button type="button" onClick={() => contents.setActiveIds(["usage"])}>
                    Go to usage
                </button>
            </>
        );
    };

    const shown = () => screen.getByRole("status").textContent;

    beforeEach(() => {
        window.IntersectionObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof IntersectionObserver;
    });

    afterEach(() => {
        window.IntersectionObserver = originalIntersectionObserver;
    });

    it("starts nowhere in particular", () => {
        render(<Contents />);

        expect(shown()).toBe("");
        expect(screen.getByTestId("count")).toHaveTextContent("0");
    });

    it("says where the reader is when it is told", () => {
        render(<Contents />);

        fireEvent.click(screen.getByRole("button", { name: "Go to usage" }));

        expect(shown()).toBe("usage");
        expect(screen.getByTestId("count")).toHaveTextContent("1");
    });

    it("leaves a caller who holds it saying where the reader is", () => {
        render(<Contents activeIds={["introduction"]} />);

        fireEvent.click(screen.getByRole("button", { name: "Go to usage" }));

        expect(shown()).toBe("introduction");
    });
});
