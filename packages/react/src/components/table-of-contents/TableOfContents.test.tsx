import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { TableOfContents, useTableOfContentsActiveId } from ".";
import type { UseTableOfContentsActiveIdOptions } from "./TableOfContents.types";

const originalIntersectionObserver = window.IntersectionObserver;

type Watched = {
    elements: Element[];
    callback: IntersectionObserverCallback;
    observer: IntersectionObserver;
    options?: IntersectionObserverInit;
};

let watched: Watched[] = [];

// Reports that a section has come into view, or gone out of it, which is how the list is told
// where the reader has got to
const intersect = (entries: { id: string; isIntersecting: boolean }[]) => {
    const watcher = watched[watched.length - 1];

    if (!watcher) {
        throw new Error("Nothing is being watched");
    }

    act(() => {
        watcher.callback(
            entries.map(
                ({ id, isIntersecting }) =>
                    ({
                        target: document.getElementById(id) as Element,
                        isIntersecting,
                    }) as IntersectionObserverEntry,
            ),
            watcher.observer,
        );
    });
};

const list = () => screen.getByRole("list");

const link = (name: string) => screen.getByRole("link", { name });

describe("TableOfContents", () => {
    it("renders a navigation landmark", () => {
        render(<TableOfContents />);
        expect(screen.getByRole("navigation").tagName).toBe("NAV");
    });

    it("names itself where the caller has not", () => {
        render(<TableOfContents />);
        expect(screen.getByRole("navigation")).toHaveAccessibleName("Table of contents");
    });

    it("keeps the name the caller gives it", () => {
        render(<TableOfContents aria-label="On this page" />);
        expect(screen.getByRole("navigation")).toHaveAccessibleName("On this page");
    });

    it("keeps the name the caller points it at, and adds none of its own", () => {
        render(
            <>
                <h2 id="title">Contents</h2>
                <TableOfContents aria-labelledby="title" />
            </>,
        );

        const navigation = screen.getByRole("navigation");

        expect(navigation).not.toHaveAttribute("aria-label");
        expect(navigation).toHaveAccessibleName("Contents");
    });

    it("tags the list and its parts with data-component attributes", () => {
        const { container } = render(
            <TableOfContents>
                <TableOfContents.Title>On this page</TableOfContents.Title>
                <TableOfContents.List>
                    <TableOfContents.Item href="#introduction">Introduction</TableOfContents.Item>
                    <TableOfContents.Group label="Reference">
                        <TableOfContents.Item href="#props">Props</TableOfContents.Item>
                    </TableOfContents.Group>
                </TableOfContents.List>
            </TableOfContents>,
        );

        for (const name of [
            "TableOfContents",
            "TableOfContents.Title",
            "TableOfContents.List",
            "TableOfContents.Item",
            "TableOfContents.Group",
            "TableOfContents.Group.Label",
        ]) {
            expect(container.querySelector(`[data-component='${name}']`)).not.toBeNull();
        }
    });

    it("forwards a ref to the landmark", () => {
        const ref = React.createRef<HTMLElement>();
        render(<TableOfContents ref={ref} />);
        expect(ref.current).toBe(screen.getByRole("navigation"));
    });

    it("merges a custom className onto the landmark", () => {
        render(<TableOfContents className="custom" />);
        expect(screen.getByRole("navigation")).toHaveClass("table-of-contents", "custom");
    });
});

describe("TableOfContents.Title", () => {
    it("renders a line of words rather than a heading", () => {
        const { container } = render(<TableOfContents.Title>On this page</TableOfContents.Title>);
        expect(container.firstElementChild?.tagName).toBe("P");
        expect(screen.queryByRole("heading")).toBeNull();
    });

    it("is put into the outline of the page where it is asked to be", () => {
        render(<TableOfContents.Title as="h2">On this page</TableOfContents.Title>);
        expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("On this page");
    });

    it("merges a custom className onto the title", () => {
        const { container } = render(<TableOfContents.Title className="custom" />);
        expect(container.firstElementChild).toHaveClass("table-of-contents-title", "custom");
    });
});

describe("TableOfContents.List", () => {
    it("renders an unordered list", () => {
        render(<TableOfContents.List />);
        expect(list().tagName).toBe("UL");
    });

    it("says it is a list, which Safari would otherwise take away", () => {
        // The semantics go with the markers, and this list has none
        render(<TableOfContents.List />);
        expect(list()).toHaveAttribute("role", "list");
    });

    it("forwards a ref to the list", () => {
        const ref = React.createRef<HTMLUListElement>();
        render(<TableOfContents.List ref={ref} />);
        expect(ref.current).toBe(list());
    });

    it("merges a custom className onto the list", () => {
        render(<TableOfContents.List className="custom" />);
        expect(list()).toHaveClass("table-of-contents-list", "custom");
    });
});

describe("TableOfContents.Item", () => {
    it("renders a link standing in a row of its own", () => {
        render(
            <TableOfContents.List>
                <TableOfContents.Item href="#introduction">Introduction</TableOfContents.Item>
            </TableOfContents.List>,
        );

        const item = link("Introduction");

        expect(item).toHaveAttribute("href", "#introduction");
        expect(item.parentElement?.tagName).toBe("LI");
        expect(item.parentElement).toHaveClass("table-of-contents-item");
    });

    it("stands for somewhere else to go by default", () => {
        render(<TableOfContents.Item href="#introduction">Introduction</TableOfContents.Item>);

        const item = link("Introduction");

        expect(item).not.toHaveAttribute("aria-current");
        expect(item).not.toHaveClass("table-of-contents-link-active");
    });

    it("says where the reader is when it is the section being read", () => {
        render(
            <TableOfContents.Item href="#introduction" active>
                Introduction
            </TableOfContents.Item>,
        );

        const item = link("Introduction");

        expect(item).toHaveAttribute("aria-current", "true");
        expect(item).toHaveClass("table-of-contents-link-active");
    });

    it("is drawn as whatever element it is asked to be, for a router of the caller's own", () => {
        render(
            <TableOfContents.Item as="button" type="button">
                Introduction
            </TableOfContents.Item>,
        );

        expect(screen.getByRole("button", { name: "Introduction" })).toHaveClass(
            "table-of-contents-link",
        );
    });

    it("answers a press", () => {
        const onClick = vi.fn();

        render(
            <TableOfContents.Item href="#introduction" onClick={onClick}>
                Introduction
            </TableOfContents.Item>,
        );

        fireEvent.click(link("Introduction"));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("forwards a ref to the link rather than to the row it stands in", () => {
        const ref = React.createRef<HTMLAnchorElement>();

        render(
            <TableOfContents.Item ref={ref} href="#introduction">
                Introduction
            </TableOfContents.Item>,
        );

        expect(ref.current).toBe(link("Introduction"));
    });

    it("merges a custom className onto the link", () => {
        render(
            <TableOfContents.Item href="#introduction" className="custom">
                Introduction
            </TableOfContents.Item>,
        );

        expect(link("Introduction")).toHaveClass("table-of-contents-link", "custom");
    });
});

describe("TableOfContents.Group", () => {
    const group = (container: HTMLElement) =>
        container.querySelector("[data-component='TableOfContents.Group']") as HTMLElement;

    it("names the run of sections held under it", () => {
        render(
            <TableOfContents.Group label="Getting started">
                <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
            </TableOfContents.Group>,
        );

        expect(screen.getByText("Getting started")).toBeInTheDocument();
        expect(link("Installation")).toBeInTheDocument();
    });

    it("holds its sections in a list of their own", () => {
        const { container } = render(
            <TableOfContents.Group label="Getting started">
                <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
            </TableOfContents.Group>,
        );

        const nested = list();

        expect(nested).toHaveClass("table-of-contents-list", "table-of-contents-group-list");
        expect(group(container)).toContainElement(nested);
    });

    it("draws a label leading nowhere as words rather than as a link", () => {
        render(
            <TableOfContents.Group label="Getting started">
                <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
            </TableOfContents.Group>,
        );

        const label = screen.getByText("Getting started");

        expect(label.tagName).toBe("P");
        expect(label).toHaveClass("table-of-contents-group-label");
    });

    it("draws a label leading somewhere as a section like any other", () => {
        render(
            <TableOfContents.Group label="Getting started" href="#getting-started">
                <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
            </TableOfContents.Group>,
        );

        const label = link("Getting started");

        expect(label).toHaveAttribute("href", "#getting-started");
        expect(label).toHaveClass("table-of-contents-link");
    });

    it("says where the reader is when its label is the section being read", () => {
        render(
            <TableOfContents.Group label="Getting started" href="#getting-started" active>
                <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
            </TableOfContents.Group>,
        );

        const label = link("Getting started");

        expect(label).toHaveAttribute("aria-current", "true");
        expect(label).toHaveClass("table-of-contents-link-active");
    });

    it("answers a press on the label rather than on everything under it", () => {
        const onClick = vi.fn();

        render(
            <TableOfContents.Group
                label="Getting started"
                href="#getting-started"
                onClick={onClick}
            >
                <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
            </TableOfContents.Group>,
        );

        fireEvent.click(link("Installation"));
        expect(onClick).not.toHaveBeenCalled();

        fireEvent.click(link("Getting started"));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("leaves a press off a label that leads nowhere", () => {
        const onClick = vi.fn();

        render(
            <TableOfContents.Group label="Getting started" onClick={onClick}>
                <TableOfContents.Item href="#installation">Installation</TableOfContents.Item>
            </TableOfContents.Group>,
        );

        fireEvent.click(screen.getByText("Getting started"));
        fireEvent.click(link("Installation"));

        expect(onClick).not.toHaveBeenCalled();
    });

    it("forwards a ref to the row the group stands in", () => {
        const ref = React.createRef<HTMLLIElement>();
        const { container } = render(<TableOfContents.Group ref={ref} label="Getting started" />);
        expect(ref.current).toBe(group(container));
    });

    it("merges a custom className onto the row", () => {
        const { container } = render(
            <TableOfContents.Group label="Getting started" className="custom" />,
        );
        expect(group(container)).toHaveClass("table-of-contents-group", "custom");
    });
});

describe("useTableOfContentsActiveId", () => {
    const sections = ["introduction", "installation", "usage"];

    // The hook is what is being tested, so a list of the plainest kind is put around it and read
    // back through what it draws
    const Sections = (options: Omit<UseTableOfContentsActiveIdOptions, "ids">) => {
        const { activeId, selectSection } = useTableOfContentsActiveId({
            ids: sections,
            ...options,
        });

        return (
            <>
                {sections.map((id) => (
                    <section key={id} id={id}>
                        {id}
                    </section>
                ))}
                <TableOfContents>
                    <TableOfContents.List>
                        {sections.map((id) => (
                            <TableOfContents.Item
                                key={id}
                                href={`#${id}`}
                                active={activeId === id}
                                onClick={() => selectSection(id)}
                            >
                                {id}
                            </TableOfContents.Item>
                        ))}
                    </TableOfContents.List>
                </TableOfContents>
            </>
        );
    };

    const current = () => screen.queryByRole("link", { current: true });

    // jsdom has no observer, and the hook watches the sections of the page to work out which of
    // them the reader has come to
    beforeEach(() => {
        watched = [];

        window.IntersectionObserver = class {
            private readonly callback: IntersectionObserverCallback;
            private readonly watcher: Watched;

            constructor(
                callback: IntersectionObserverCallback,
                options?: IntersectionObserverInit,
            ) {
                this.callback = callback;
                this.watcher = {
                    elements: [],
                    callback,
                    observer: this as unknown as IntersectionObserver,
                    options,
                };

                watched.push(this.watcher);
            }

            observe(element: Element) {
                this.watcher.elements.push(element);
            }

            unobserve() {}
            disconnect() {}
        } as unknown as typeof IntersectionObserver;

        vi.useFakeTimers();
    });

    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();

        window.IntersectionObserver = originalIntersectionObserver;
        window.location.hash = "";
    });

    it("marks no section until one has been reached", () => {
        render(<Sections trackHash={false} />);
        expect(current()).toBeNull();
    });

    it("watches every section it is given", () => {
        render(<Sections trackHash={false} />);

        expect(watched[0].elements.map((element) => element.id)).toEqual(sections);
    });

    it("holds the line the sections are counted against below a fixed header", () => {
        render(<Sections offset={64} trackHash={false} />);

        expect(watched[0].options?.rootMargin).toBe("-64px 0px 0px 0px");
    });

    it("marks the topmost section standing in view", () => {
        render(<Sections trackHash={false} />);

        intersect([
            { id: "installation", isIntersecting: true },
            { id: "usage", isIntersecting: true },
        ]);

        expect(current()).toHaveTextContent("installation");
    });

    it("keeps the last section it marked once none of them is in view", () => {
        // Partway down a long section the reader is still somewhere, so the mark stays where
        // it was rather than being taken away
        render(<Sections trackHash={false} />);

        intersect([{ id: "installation", isIntersecting: true }]);
        intersect([{ id: "installation", isIntersecting: false }]);

        expect(current()).toHaveTextContent("installation");
    });

    it("marks the section a press asks for, whatever the scroll says", () => {
        render(<Sections trackHash={false} />);

        intersect([{ id: "introduction", isIntersecting: true }]);
        fireEvent.click(link("usage"));

        expect(current()).toHaveTextContent("usage");

        // The scroll to it is a scroll like any other, and until it has run its course the
        // section that was asked for stays marked
        intersect([{ id: "introduction", isIntersecting: true }]);
        expect(current()).toHaveTextContent("usage");
    });

    it("gives the mark back to the scroll once the page has settled", () => {
        render(<Sections trackHash={false} />);

        fireEvent.click(link("usage"));

        act(() => {
            vi.runOnlyPendingTimers();
        });

        intersect([{ id: "introduction", isIntersecting: true }]);

        expect(current()).toHaveTextContent("introduction");
    });

    it("marks the section the page was opened at", () => {
        window.location.hash = "#installation";

        render(<Sections />);

        expect(current()).toHaveTextContent("installation");
    });

    it("marks the section named by a link into the middle of the page", () => {
        render(<Sections />);

        act(() => {
            window.location.hash = "#usage";
            window.dispatchEvent(new Event("hashchange"));
        });

        expect(current()).toHaveTextContent("usage");
    });

    it("passes over a name that stands for none of the sections it follows", () => {
        window.location.hash = "#somewhere-else";

        render(<Sections />);

        expect(current()).toBeNull();
    });

    it("leaves the address alone where it is told to", () => {
        window.location.hash = "#installation";

        render(<Sections trackHash={false} />);

        expect(current()).toBeNull();
    });
});
