import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { PageHeader } from ".";

const part = (name: string) =>
    document.querySelector(`[data-component="PageHeader.${name}"]`) as HTMLElement | null;

const header = () => document.querySelector('[data-component="PageHeader"]') as HTMLElement;

const withTitle = (props: React.ComponentProps<typeof PageHeader> = {}) => (
    <PageHeader {...props}>
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
);

describe("PageHeader", () => {
    it("renders a plain box by default", () => {
        render(withTitle());
        expect(header().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(withTitle({ as: "header" }));
        expect(header().tagName).toBe("HEADER");
    });

    it("tags the header and its parts with data-component attributes", () => {
        render(
            <PageHeader>
                <PageHeader.ContextArea>
                    <PageHeader.ParentLink href="/parent">Parent</PageHeader.ParentLink>
                    <PageHeader.ContextBar>Bar</PageHeader.ContextBar>
                    <PageHeader.ContextAreaActions>Actions</PageHeader.ContextAreaActions>
                </PageHeader.ContextArea>
                <PageHeader.LeadingAction>Leading action</PageHeader.LeadingAction>
                <PageHeader.Breadcrumbs>Breadcrumbs</PageHeader.Breadcrumbs>
                <PageHeader.TitleArea>
                    <PageHeader.LeadingVisual>Leading visual</PageHeader.LeadingVisual>
                    <PageHeader.Title>Title</PageHeader.Title>
                    <PageHeader.TrailingVisual>Trailing visual</PageHeader.TrailingVisual>
                </PageHeader.TitleArea>
                <PageHeader.TrailingAction>Trailing action</PageHeader.TrailingAction>
                <PageHeader.Actions>Actions</PageHeader.Actions>
                <PageHeader.Description>Description</PageHeader.Description>
                <PageHeader.Navigation>Navigation</PageHeader.Navigation>
            </PageHeader>,
        );

        for (const name of [
            "ContextArea",
            "ParentLink",
            "ContextBar",
            "ContextAreaActions",
            "LeadingAction",
            "Breadcrumbs",
            "TitleArea",
            "LeadingVisual",
            "Title",
            "TrailingVisual",
            "TrailingAction",
            "Actions",
            "Description",
            "Navigation",
        ]) {
            expect(part(name)).not.toBeNull();
        }
    });

    describe("naming the header", () => {
        it("renders no role of its own", () => {
            render(withTitle());
            expect(header()).not.toHaveAttribute("role");
        });

        it("renders the role it is given", () => {
            render(withTitle({ role: "banner" }));
            expect(header()).toHaveAttribute("role", "banner");
        });

        it("renders no name of its own", () => {
            render(withTitle());
            expect(header()).not.toHaveAttribute("aria-label");
        });

        it("renders the name it is given", () => {
            render(withTitle({ role: "banner", "aria-label": "Page" }));
            expect(screen.getByRole("banner", { name: "Page" })).toBe(header());
        });
    });

    describe("the title size", () => {
        it("reads the size off the title area onto the header", () => {
            render(
                <PageHeader>
                    <PageHeader.TitleArea variant="large">
                        <PageHeader.Title>Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                </PageHeader>,
            );

            expect(header()).toHaveAttribute("data-title-size-variant", "large");
            expect(header()).toHaveClass("[--page-header-title-size:var(--text-title-size-large)]");
        });

        it("falls back to the medium size", () => {
            render(withTitle());

            expect(header()).toHaveAttribute("data-title-size-variant", "medium");
            expect(header()).toHaveClass(
                "[--page-header-title-size:var(--text-title-size-medium)]",
            );
        });

        it("reads the size through a fragment", () => {
            render(
                <PageHeader>
                    <>
                        <PageHeader.TitleArea variant="large">
                            <PageHeader.Title>Title</PageHeader.Title>
                        </PageHeader.TitleArea>
                    </>
                </PageHeader>,
            );
            expect(header()).toHaveAttribute("data-title-size-variant", "large");
        });

        it("sets no title size where there is no title area", () => {
            render(
                <PageHeader>
                    <PageHeader.Navigation>Navigation</PageHeader.Navigation>
                </PageHeader>,
            );
            expect(header()).not.toHaveAttribute("data-title-size-variant");
        });

        it("takes a different size at each viewport range", () => {
            render(
                <PageHeader>
                    <PageHeader.TitleArea variant={{ narrow: "medium", regular: "large" }}>
                        <PageHeader.Title>Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                </PageHeader>,
            );

            expect(header()).toHaveAttribute("data-title-size-variant-narrow", "medium");
            expect(header()).toHaveAttribute("data-title-size-variant-regular", "large");
            expect(header()).toHaveClass(
                "max-medium:[--page-header-title-size:var(--text-title-size-medium)]",
            );
            expect(header()).toHaveClass(
                "medium:max-xxlarge:[--page-header-title-size:var(--text-title-size-large)]",
            );
        });

        it("says on the title area which size it asked for", () => {
            render(
                <PageHeader>
                    <PageHeader.TitleArea variant="subtitle">
                        <PageHeader.Title>Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                </PageHeader>,
            );
            expect(part("TitleArea")).toHaveAttribute("data-size-variant", "subtitle");
        });
    });

    describe("the line under the header", () => {
        it("draws no line unless it is asked for", () => {
            render(withTitle());
            expect(header()).not.toHaveClass("border-b-border-default");
        });

        it("draws a line where there is no navigation", () => {
            render(withTitle({ hasBorder: true }));

            expect(header()).toHaveAttribute("data-has-border", "");
            expect(header()).toHaveClass("border-b-border-default");
        });

        it("leaves the line off where a navigation is showing", () => {
            render(
                <PageHeader hasBorder>
                    <PageHeader.TitleArea>
                        <PageHeader.Title>Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                    <PageHeader.Navigation>Navigation</PageHeader.Navigation>
                </PageHeader>,
            );

            expect(header()).toHaveAttribute("data-has-navigation", "");
            expect(header()).not.toHaveClass("border-b-border-default");
        });

        it("draws the line only where the navigation is hidden", () => {
            render(
                <PageHeader hasBorder>
                    <PageHeader.TitleArea>
                        <PageHeader.Title>Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                    <PageHeader.Navigation hidden={{ narrow: true }}>
                        Navigation
                    </PageHeader.Navigation>
                </PageHeader>,
            );

            expect(header()).toHaveClass("max-medium:border-b-border-default");
            expect(header()).not.toHaveClass("border-b-border-default");
        });

        it("reads a navigation through a fragment", () => {
            render(
                <PageHeader>
                    <>
                        <PageHeader.Navigation>Navigation</PageHeader.Navigation>
                    </>
                </PageHeader>,
            );
            expect(header()).toHaveAttribute("data-has-navigation", "");
        });
    });

    describe("hiding a part", () => {
        it("takes a part off the screen everywhere", () => {
            render(
                <PageHeader>
                    <PageHeader.Description hidden>Description</PageHeader.Description>
                </PageHeader>,
            );

            expect(part("Description")).toHaveClass("hidden");
            expect(part("Description")).toHaveAttribute("data-hidden", "narrow regular wide");
        });

        it("takes a part off the screen at the ranges it names", () => {
            render(
                <PageHeader>
                    <PageHeader.Description hidden={{ regular: true }}>
                        Description
                    </PageHeader.Description>
                </PageHeader>,
            );

            expect(part("Description")).toHaveClass("medium:max-xxlarge:hidden");
            expect(part("Description")).toHaveAttribute("data-hidden", "regular");
        });

        it("leaves a part showing by default", () => {
            render(
                <PageHeader>
                    <PageHeader.Description>Description</PageHeader.Description>
                </PageHeader>,
            );

            expect(part("Description")).not.toHaveClass("hidden");
            expect(part("Description")).not.toHaveAttribute("data-hidden");
        });

        it("keeps the context area to narrow viewports", () => {
            render(
                <PageHeader>
                    <PageHeader.ContextArea>
                        <PageHeader.ParentLink href="/parent">Parent</PageHeader.ParentLink>
                        <PageHeader.ContextBar>Bar</PageHeader.ContextBar>
                        <PageHeader.ContextAreaActions>Actions</PageHeader.ContextAreaActions>
                    </PageHeader.ContextArea>
                </PageHeader>,
            );

            for (const name of ["ContextArea", "ParentLink", "ContextBar", "ContextAreaActions"]) {
                expect(part(name)).toHaveAttribute("data-hidden", "regular wide");
            }
        });

        it("keeps the leading and trailing actions off narrow viewports", () => {
            render(
                <PageHeader>
                    <PageHeader.LeadingAction>Leading</PageHeader.LeadingAction>
                    <PageHeader.TrailingAction>Trailing</PageHeader.TrailingAction>
                </PageHeader>,
            );

            expect(part("LeadingAction")).toHaveAttribute("data-hidden", "narrow");
            expect(part("TrailingAction")).toHaveAttribute("data-hidden", "narrow");
        });
    });

    describe("the title", () => {
        it("is a level two heading by default", () => {
            render(withTitle());
            expect(screen.getByRole("heading", { name: "Title", level: 2 })).toBeInTheDocument();
        });

        it("is drawn at whatever level it is told to be", () => {
            render(
                <PageHeader>
                    <PageHeader.TitleArea>
                        <PageHeader.Title as="h1">Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                </PageHeader>,
            );
            expect(screen.getByRole("heading", { name: "Title", level: 1 })).toBeInTheDocument();
        });
    });

    describe("the navigation", () => {
        it("names itself when it is a landmark of its own", () => {
            render(
                <PageHeader>
                    <PageHeader.Navigation as="nav" aria-label="Pull request">
                        Navigation
                    </PageHeader.Navigation>
                </PageHeader>,
            );
            expect(screen.getByRole("navigation", { name: "Pull request" })).toBeInTheDocument();
        });

        it("leaves the name off a plain box, which names nothing", () => {
            render(
                <PageHeader>
                    <PageHeader.Navigation aria-label="Pull request">
                        Navigation
                    </PageHeader.Navigation>
                </PageHeader>,
            );

            expect(part("Navigation")?.tagName).toBe("DIV");
            expect(part("Navigation")).not.toHaveAttribute("aria-label");
        });
    });

    describe("the parent link", () => {
        it("links back up, with an arrow to say so", () => {
            render(
                <PageHeader>
                    <PageHeader.ContextArea>
                        <PageHeader.ParentLink href="/parent">Parent</PageHeader.ParentLink>
                    </PageHeader.ContextArea>
                </PageHeader>,
            );

            const link = screen.getByRole("link", { name: "Parent" });
            expect(link).toHaveAttribute("href", "/parent");
            expect(link.querySelector("svg")).not.toBeNull();
        });

        it("passes the rest of its props through", () => {
            render(
                <PageHeader>
                    <PageHeader.ContextArea>
                        <PageHeader.ParentLink href="/parent" data-testid="parent">
                            Parent
                        </PageHeader.ParentLink>
                    </PageHeader.ContextArea>
                </PageHeader>,
            );
            expect(screen.getByTestId("parent")).toHaveAttribute("href", "/parent");
        });

        it("renders as whatever it is told to", () => {
            const CustomLink = ({
                to,
                children,
                ...rest
            }: React.ComponentPropsWithoutRef<"a"> & { to?: string }) => (
                <a {...rest} href={to}>
                    {children}
                </a>
            );

            render(
                <PageHeader>
                    <PageHeader.ContextArea>
                        <PageHeader.ParentLink as={CustomLink} to="/somewhere">
                            Parent
                        </PageHeader.ParentLink>
                    </PageHeader.ContextArea>
                </PageHeader>,
            );
            expect(screen.getByRole("link", { name: "Parent" })).toHaveAttribute(
                "href",
                "/somewhere",
            );
        });
    });

    describe("refs and class names", () => {
        it("forwards a ref to the header element", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <PageHeader ref={ref}>
                    <PageHeader.TitleArea>
                        <PageHeader.Title>Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                </PageHeader>,
            );
            expect(ref.current).toBe(header());
        });

        it("forwards a ref to the title area", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <PageHeader>
                    <PageHeader.TitleArea ref={ref}>
                        <PageHeader.Title>Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                </PageHeader>,
            );
            expect(ref.current).toBe(part("TitleArea"));
        });

        it("merges a custom className onto the header element", () => {
            render(withTitle({ className: "custom" }));
            expect(header()).toHaveClass("custom");
        });

        it("merges a custom className onto a part", () => {
            render(
                <PageHeader>
                    <PageHeader.Description className="custom">Description</PageHeader.Description>
                </PageHeader>,
            );
            expect(part("Description")).toHaveClass("custom");
        });
    });
});
