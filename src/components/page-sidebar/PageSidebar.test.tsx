import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { PageSidebar } from ".";

const part = (name: string) =>
    document.querySelector(`[data-component="PageSidebar.${name}"]`) as HTMLElement | null;

const sidebar = () => document.querySelector('[data-component="PageSidebar"]') as HTMLElement;

const withTitle = (props: React.ComponentProps<typeof PageSidebar> = {}) => (
    <PageSidebar {...props}>
        <PageSidebar.Title>Settings</PageSidebar.Title>
    </PageSidebar>
);

describe("PageSidebar", () => {
    it("renders an aside by default", () => {
        render(withTitle());
        expect(sidebar().tagName).toBe("ASIDE");
    });

    it("renders as whatever it is told to", () => {
        render(withTitle({ as: "div" }));
        expect(sidebar().tagName).toBe("DIV");
    });

    it("tags the sidebar and its parts with data-component attributes", () => {
        render(
            <PageSidebar>
                <PageSidebar.Header>
                    <PageSidebar.Title>Title</PageSidebar.Title>
                    <PageSidebar.Actions>Actions</PageSidebar.Actions>
                </PageSidebar.Header>
                <PageSidebar.Content>
                    <PageSidebar.Navigation>Navigation</PageSidebar.Navigation>
                    <PageSidebar.Section>Section</PageSidebar.Section>
                </PageSidebar.Content>
                <PageSidebar.Footer>Footer</PageSidebar.Footer>
            </PageSidebar>,
        );

        for (const name of [
            "Header",
            "Title",
            "Actions",
            "Content",
            "Navigation",
            "Section",
            "Footer",
        ]) {
            expect(part(name)).not.toBeNull();
        }
    });

    describe("naming the sidebar", () => {
        it("renders no name of its own", () => {
            render(withTitle());
            expect(sidebar()).not.toHaveAttribute("aria-label");
        });

        it("reads as a complementary landmark once it is named", () => {
            render(withTitle({ "aria-label": "Settings" }));
            expect(screen.getByRole("complementary", { name: "Settings" })).toBe(sidebar());
        });
    });

    describe("which side it stands on", () => {
        it("stands at the start by default", () => {
            render(withTitle());

            expect(sidebar()).toHaveAttribute("data-position", "start");
            expect(sidebar()).toHaveClass("[order:-1]");
        });

        it("stands at the end where it is told to", () => {
            render(withTitle({ position: "end" }));

            expect(sidebar()).toHaveAttribute("data-position", "end");
            expect(sidebar()).toHaveClass("[order:1]");
        });
    });

    describe("the width", () => {
        it("falls back to the medium width", () => {
            render(withTitle());

            expect(sidebar()).toHaveAttribute("data-width", "medium");
            expect(sidebar()).toHaveClass("medium:w-[256px]");
            expect(sidebar()).toHaveClass("large:w-[296px]");
        });

        it("is held to the width it is given", () => {
            render(withTitle({ width: "large" }));

            expect(sidebar()).toHaveAttribute("data-width", "large");
            expect(sidebar()).toHaveClass("large:w-[320px]");
        });

        it("runs the whole width where there is no room beside the content", () => {
            render(withTitle({ width: "small" }));
            expect(sidebar()).toHaveClass("w-full");
        });
    });

    describe("the padding and the gap", () => {
        it("falls back to the normal room around and between", () => {
            render(withTitle());

            expect(sidebar()).toHaveAttribute("data-padding", "normal");
            expect(sidebar()).toHaveAttribute("data-gap", "normal");
            expect(sidebar()).toHaveClass("p-[var(--base-size-16)]");
            expect(sidebar()).toHaveClass("[--page-sidebar-gap:var(--stack-gap-normal)]");
        });

        it("leaves the room it is asked for", () => {
            render(withTitle({ padding: "none", gap: "spacious" }));

            expect(sidebar()).toHaveAttribute("data-padding", "none");
            expect(sidebar()).toHaveAttribute("data-gap", "spacious");
            expect(sidebar()).toHaveClass("p-0");
            expect(sidebar()).toHaveClass("[--page-sidebar-gap:var(--stack-gap-spacious)]");
        });

        it("spaces its runs by the room it carries", () => {
            render(withTitle());
            expect(sidebar()).toHaveClass("gap-[var(--page-sidebar-gap)]");
        });
    });

    describe("staying in place", () => {
        it("scrolls away with the page by default", () => {
            render(withTitle());

            expect(sidebar()).not.toHaveAttribute("data-sticky");
            expect(sidebar()).not.toHaveClass("sticky");
        });

        it("stays put where it is asked to", () => {
            render(withTitle({ sticky: true }));

            expect(sidebar()).toHaveAttribute("data-sticky", "");
            expect(sidebar()).toHaveClass("sticky");
        });
    });

    describe("the line beside the sidebar", () => {
        it("draws no line unless it is asked for", () => {
            render(withTitle());
            expect(sidebar()).not.toHaveClass("border-e-border-default");
        });

        it("draws the line on the edge facing the content at the start", () => {
            render(withTitle({ hasBorder: true }));

            expect(sidebar()).toHaveAttribute("data-has-border", "");
            expect(sidebar()).toHaveClass("border-e-border-default");
        });

        it("turns the line around for a sidebar at the end", () => {
            render(withTitle({ position: "end", hasBorder: true }));

            expect(sidebar()).toHaveClass("border-s-border-default");
            expect(sidebar()).not.toHaveClass("border-e-border-default");
        });
    });

    describe("hiding a part", () => {
        it("takes a part off the screen everywhere", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Section hidden>Section</PageSidebar.Section>
                </PageSidebar>,
            );

            expect(part("Section")).toHaveClass("hidden");
            expect(part("Section")).toHaveAttribute("data-hidden", "narrow regular wide");
        });

        it("takes a part off the screen at the ranges it names", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Section hidden={{ regular: true }}>Section</PageSidebar.Section>
                </PageSidebar>,
            );

            expect(part("Section")).toHaveClass("medium:max-xxlarge:hidden");
            expect(part("Section")).toHaveAttribute("data-hidden", "regular");
        });

        it("leaves a part showing by default", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Section>Section</PageSidebar.Section>
                </PageSidebar>,
            );

            expect(part("Section")).not.toHaveClass("hidden");
            expect(part("Section")).not.toHaveAttribute("data-hidden");
        });
    });

    describe("the title", () => {
        it("is a level two heading by default", () => {
            render(withTitle());
            expect(screen.getByRole("heading", { name: "Settings", level: 2 })).toBeInTheDocument();
        });

        it("is drawn at whatever level it is told to be", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Title as="h3">Settings</PageSidebar.Title>
                </PageSidebar>,
            );
            expect(screen.getByRole("heading", { name: "Settings", level: 3 })).toBeInTheDocument();
        });
    });

    describe("the navigation", () => {
        it("names itself when it is a landmark of its own", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Navigation as="nav" aria-label="Docs">
                        Navigation
                    </PageSidebar.Navigation>
                </PageSidebar>,
            );
            expect(screen.getByRole("navigation", { name: "Docs" })).toBeInTheDocument();
        });

        it("leaves the name off a plain box, which names nothing", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Navigation aria-label="Docs">Navigation</PageSidebar.Navigation>
                </PageSidebar>,
            );

            expect(part("Navigation")?.tagName).toBe("DIV");
            expect(part("Navigation")).not.toHaveAttribute("aria-label");
        });
    });

    describe("the header", () => {
        it("stands the name and the actions at either end of the one line", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Header>
                        <PageSidebar.Title>Settings</PageSidebar.Title>
                        <PageSidebar.Actions>Actions</PageSidebar.Actions>
                    </PageSidebar.Header>
                </PageSidebar>,
            );

            expect(part("Header")).toHaveClass("flex-row");
            expect(part("Header")).toHaveClass("justify-between");
            expect(part("Header")).toContainElement(part("Title"));
            expect(part("Header")).toContainElement(part("Actions"));
        });

        it("passes the rest of its props through", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Header data-testid="head">Header</PageSidebar.Header>
                </PageSidebar>,
            );
            expect(screen.getByTestId("head")).toBe(part("Header"));
        });
    });

    describe("the content", () => {
        it("takes the room left between the head and the foot", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Header>Header</PageSidebar.Header>
                    <PageSidebar.Content>Content</PageSidebar.Content>
                    <PageSidebar.Footer>Footer</PageSidebar.Footer>
                </PageSidebar>,
            );
            expect(part("Content")).toHaveClass("grow");
        });

        it("spaces its runs by the room the sidebar carries", () => {
            render(
                <PageSidebar gap="spacious">
                    <PageSidebar.Content>
                        <PageSidebar.Section>Section</PageSidebar.Section>
                    </PageSidebar.Content>
                </PageSidebar>,
            );

            expect(part("Content")).toHaveClass("gap-[var(--page-sidebar-gap)]");
            expect(sidebar()).toHaveClass("[--page-sidebar-gap:var(--stack-gap-spacious)]");
        });

        it("holds the runs of the sidebar", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Content>
                        <PageSidebar.Navigation>Navigation</PageSidebar.Navigation>
                    </PageSidebar.Content>
                </PageSidebar>,
            );
            expect(part("Content")).toContainElement(part("Navigation"));
        });

        it("is taken off the screen at the ranges it names", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Content hidden={{ narrow: true }}>Content</PageSidebar.Content>
                </PageSidebar>,
            );

            expect(part("Content")).toHaveClass("max-medium:hidden");
            expect(part("Content")).toHaveAttribute("data-hidden", "narrow");
        });
    });

    describe("the footer", () => {
        it("is pushed to the foot of the sidebar", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Footer>Footer</PageSidebar.Footer>
                </PageSidebar>,
            );
            expect(part("Footer")).toHaveClass("mt-auto");
        });

        it("passes the rest of its props through", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Footer data-testid="foot">Footer</PageSidebar.Footer>
                </PageSidebar>,
            );
            expect(screen.getByTestId("foot")).toBe(part("Footer"));
        });
    });

    describe("refs and class names", () => {
        it("forwards a ref to the sidebar element", () => {
            const ref = React.createRef<HTMLElement>();
            render(
                <PageSidebar ref={ref}>
                    <PageSidebar.Title>Settings</PageSidebar.Title>
                </PageSidebar>,
            );
            expect(ref.current).toBe(sidebar());
        });

        it("forwards a ref to a part", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <PageSidebar>
                    <PageSidebar.Section ref={ref}>Section</PageSidebar.Section>
                </PageSidebar>,
            );
            expect(ref.current).toBe(part("Section"));
        });

        it("merges a custom className onto the sidebar element", () => {
            render(withTitle({ className: "custom" }));
            expect(sidebar()).toHaveClass("custom");
        });

        it("merges a custom className onto a part", () => {
            render(
                <PageSidebar>
                    <PageSidebar.Section className="custom">Section</PageSidebar.Section>
                </PageSidebar>,
            );
            expect(part("Section")).toHaveClass("custom");
        });
    });
});
