import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { PageContent } from ".";

const content = () => document.querySelector('[data-component="PageContent"]') as HTMLElement;

const section = () =>
    document.querySelector('[data-component="PageContent.Section"]') as HTMLElement | null;

const withSection = (props: React.ComponentProps<typeof PageContent> = {}) => (
    <PageContent {...props}>
        <PageContent.Section>Section</PageContent.Section>
    </PageContent>
);

describe("PageContent", () => {
    it("renders a main by default", () => {
        render(withSection());
        expect(content().tagName).toBe("MAIN");
    });

    it("renders as whatever it is told to", () => {
        render(withSection({ as: "div" }));
        expect(content().tagName).toBe("DIV");
    });

    it("reads as the main landmark", () => {
        render(withSection());
        expect(screen.getByRole("main")).toBe(content());
    });

    it("tags the content and its runs with data-component attributes", () => {
        render(withSection());

        expect(content()).not.toBeNull();
        expect(section()).not.toBeNull();
    });

    describe("the width", () => {
        it("runs the whole width by default", () => {
            render(withSection());

            expect(content()).toHaveAttribute("data-width", "full");
            expect(content()).toHaveClass("page-content-width-full");
        });

        it("is held to the width it is given", () => {
            render(withSection({ width: "medium" }));

            expect(content()).toHaveAttribute("data-width", "medium");
            expect(content()).toHaveClass("page-content-width-medium");
        });

        it("is centred in whatever room the page leaves", () => {
            render(withSection({ width: "large" }));
            expect(content()).toHaveClass("page-content");
        });
    });

    describe("the padding", () => {
        it("leaves no room around the content by default", () => {
            render(withSection());

            expect(content()).toHaveAttribute("data-padding", "none");
            expect(content()).toHaveClass("page-content-padding-none");
        });

        it("leaves the room it is asked for", () => {
            render(withSection({ padding: "spacious" }));

            expect(content()).toHaveAttribute("data-padding", "spacious");
            expect(content()).toHaveClass("page-content-padding-spacious");
        });
    });

    describe("the gap", () => {
        it("falls back to the normal room between runs", () => {
            render(withSection());

            expect(content()).toHaveAttribute("data-gap", "normal");
            expect(content()).toHaveClass("page-content-gap-normal");
        });

        it("leaves the room it is asked for", () => {
            render(withSection({ gap: "condensed" }));

            expect(content()).toHaveAttribute("data-gap", "condensed");
            expect(content()).toHaveClass("page-content-gap-condensed");
        });
    });

    describe("a run of the content", () => {
        it("renders a section by default", () => {
            render(withSection());
            expect(section()?.tagName).toBe("SECTION");
        });

        it("renders as whatever it is told to", () => {
            render(
                <PageContent>
                    <PageContent.Section as="article">Section</PageContent.Section>
                </PageContent>,
            );
            expect(section()?.tagName).toBe("ARTICLE");
        });

        it("reads as a region once it is named", () => {
            render(
                <PageContent>
                    <PageContent.Section aria-label="Recent deliveries">
                        Section
                    </PageContent.Section>
                </PageContent>,
            );
            expect(screen.getByRole("region", { name: "Recent deliveries" })).toBe(section());
        });

        it("passes the rest of its props through", () => {
            render(
                <PageContent>
                    <PageContent.Section data-testid="run">Section</PageContent.Section>
                </PageContent>,
            );
            expect(screen.getByTestId("run")).toBe(section());
        });
    });

    describe("hiding a run", () => {
        it("takes a run off the screen everywhere", () => {
            render(
                <PageContent>
                    <PageContent.Section hidden>Section</PageContent.Section>
                </PageContent>,
            );

            expect(section()).toHaveClass("hidden");
            expect(section()).toHaveAttribute("data-hidden", "narrow regular wide");
        });

        it("takes a run off the screen at the ranges it names", () => {
            render(
                <PageContent>
                    <PageContent.Section hidden={{ regular: true }}>Section</PageContent.Section>
                </PageContent>,
            );

            expect(section()).toHaveClass("hidden-regular");
            expect(section()).toHaveAttribute("data-hidden", "regular");
        });

        it("leaves a run showing by default", () => {
            render(withSection());

            expect(section()).not.toHaveClass("hidden");
            expect(section()).not.toHaveAttribute("data-hidden");
        });
    });

    describe("refs and class names", () => {
        it("forwards a ref to the content element", () => {
            const ref = React.createRef<HTMLElement>();
            render(
                <PageContent ref={ref}>
                    <PageContent.Section>Section</PageContent.Section>
                </PageContent>,
            );
            expect(ref.current).toBe(content());
        });

        it("forwards a ref to a run", () => {
            const ref = React.createRef<HTMLElement>();
            render(
                <PageContent>
                    <PageContent.Section ref={ref}>Section</PageContent.Section>
                </PageContent>,
            );
            expect(ref.current).toBe(section());
        });

        it("merges a custom className onto the content element", () => {
            render(withSection({ className: "custom" }));
            expect(content()).toHaveClass("custom");
        });

        it("merges a custom className onto a run", () => {
            render(
                <PageContent>
                    <PageContent.Section className="custom">Section</PageContent.Section>
                </PageContent>,
            );
            expect(section()).toHaveClass("custom");
        });
    });
});
