import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { List } from ".";
import type { ListProps, ListSpacing, ListVariant } from "./List.types";

const items = ["Fork the repository", "Create a branch", "Open a pull request"];

const renderList = (props: Partial<ListProps> = {}) =>
    render(
        <List {...props} data-testid="list">
            {items.map((item) => (
                <List.Item key={item}>{item}</List.Item>
            ))}
        </List>,
    );

const root = () => screen.getByTestId("list");

const listItems = () => Array.from(root().querySelectorAll("[data-component='List.Item']"));

describe("List", () => {
    it("renders a list tagged as a List", () => {
        renderList();

        expect(root()).toHaveAttribute("data-component", "List");
        expect(listItems()).toHaveLength(items.length);
    });

    it("draws the items it is given", () => {
        renderList();

        for (const item of items) {
            expect(screen.getByText(item)).toBeInTheDocument();
        }
    });

    describe("what marks the items", () => {
        const variants: ListVariant[] = ["bullet", "number", "plain"];

        it("marks them with a bullet by default", () => {
            renderList();

            expect(root()).toHaveAttribute("data-variant", "bullet");
            expect(root()).toHaveClass("list-bullet");
        });

        it.each(variants)("marks them the %s way where it is told to", (variant) => {
            renderList({ variant });

            expect(root()).toHaveAttribute("data-variant", variant);
            expect(root()).toHaveClass(`list-${variant}`);
        });
    });

    describe("what the list is drawn as", () => {
        it("is unordered where the items carry a bullet", () => {
            renderList({ variant: "bullet" });
            expect(root().tagName).toBe("UL");
        });

        it("is ordered where the items carry a number, so the order is told and not only shown", () => {
            renderList({ variant: "number" });
            expect(root().tagName).toBe("OL");
        });

        it("is unordered where the items carry nothing", () => {
            renderList({ variant: "plain" });
            expect(root().tagName).toBe("UL");
        });

        it("is drawn as whatever it is told to be over what the marker would make it", () => {
            render(
                <List as="ol" variant="plain" data-testid="list">
                    <List.Item>Fork the repository</List.Item>
                </List>,
            );

            expect(root().tagName).toBe("OL");
        });
    });

    describe("the list semantics", () => {
        it("says it is a list where there are no markers to say it, which Safari takes away", () => {
            renderList({ variant: "plain" });

            expect(root()).toHaveAttribute("role", "list");
            expect(screen.getByRole("list")).toBe(root());
        });

        it("leaves a marked list to speak for itself", () => {
            renderList();
            expect(root()).not.toHaveAttribute("role");
        });

        it("gives way to a role of the caller's own", () => {
            renderList({ variant: "plain", role: "presentation" });
            expect(root()).toHaveAttribute("role", "presentation");
        });
    });

    describe("spacings", () => {
        const spacings: ListSpacing[] = ["condensed", "normal", "spacious"];

        it("sits at the normal step by default", () => {
            renderList();

            expect(root()).toHaveAttribute("data-spacing", "normal");
            expect(root()).toHaveClass("list-normal");
        });

        it.each(spacings)("sits at the %s step where it is told to", (spacing) => {
            renderList({ spacing });

            expect(root()).toHaveAttribute("data-spacing", spacing);
            expect(root()).toHaveClass(`list-${spacing}`);
        });
    });

    describe("a list nested under an item", () => {
        it("stands within the item it hangs beneath", () => {
            render(
                <List data-testid="list">
                    <List.Item>
                        Create a branch
                        <List data-testid="nested">
                            <List.Item>Name it after the change</List.Item>
                        </List>
                    </List.Item>
                </List>,
            );

            const nested = screen.getByTestId("nested");
            expect(listItems()[0]).toContainElement(nested);
            expect(nested).toHaveClass("list-bullet");
        });

        it("keeps the marker it is drawn by rather than the one above it", () => {
            render(
                <List data-testid="list">
                    <List.Item>
                        Before you start
                        <List variant="number" data-testid="nested">
                            <List.Item>Install the dependencies</List.Item>
                        </List>
                    </List.Item>
                </List>,
            );

            expect(screen.getByTestId("nested").tagName).toBe("OL");
            expect(screen.getByTestId("nested")).toHaveClass("list-number");
        });
    });

    describe("the items", () => {
        it("draws each of them as a list item", () => {
            renderList();

            for (const item of listItems()) {
                expect(item.tagName).toBe("LI");
            }
        });

        it("draws one as whatever it is told to be", () => {
            render(
                <List data-testid="list">
                    <List.Item as="div">Fork the repository</List.Item>
                </List>,
            );

            expect(listItems()[0].tagName).toBe("DIV");
        });

        it("forwards a ref to the item", () => {
            const ref = React.createRef<HTMLLIElement>();

            render(
                <List data-testid="list">
                    <List.Item ref={ref}>Fork the repository</List.Item>
                </List>,
            );

            expect(ref.current).toBe(listItems()[0]);
        });

        it("merges a custom className onto the item", () => {
            render(
                <List data-testid="list">
                    <List.Item className="custom">Fork the repository</List.Item>
                </List>,
            );

            expect(listItems()[0]).toHaveClass("list-item", "custom");
        });
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLUListElement>();

        render(
            <List ref={ref} data-testid="list">
                <List.Item>Fork the repository</List.Item>
            </List>,
        );

        expect(ref.current).toBe(root());
    });

    it("merges a custom className onto the root element", () => {
        renderList({ className: "custom" });
        expect(root()).toHaveClass("list", "custom");
    });
});
