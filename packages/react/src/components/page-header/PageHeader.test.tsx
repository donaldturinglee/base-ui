import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { PageHeader } from ".";

const part = (container: HTMLElement, name: string) =>
    container.querySelector(`[data-component='PageHeader.${name}']`) as HTMLElement;

const header = () => screen.getByTestId("header");

const title = (
    <PageHeader.TitleArea>
        <PageHeader.Title>Title</PageHeader.Title>
    </PageHeader.TitleArea>
);

describe("PageHeader", () => {
    it("renders a div element by default", () => {
        render(<PageHeader data-testid="header">{title}</PageHeader>);
        expect(header().tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <PageHeader as="header" data-testid="header">
                {title}
            </PageHeader>,
        );
        expect(header().tagName).toBe("HEADER");
    });

    it("tags the header and its parts with data-component attributes", () => {
        const { container } = render(
            <PageHeader data-testid="header">
                <PageHeader.ContextArea>
                    <PageHeader.ParentLink href="#">Parent</PageHeader.ParentLink>
                    <PageHeader.ContextBar>Context bar</PageHeader.ContextBar>
                    <PageHeader.ContextAreaActions>Context actions</PageHeader.ContextAreaActions>
                </PageHeader.ContextArea>
                <PageHeader.TitleArea>
                    <PageHeader.LeadingVisual>Leading visual</PageHeader.LeadingVisual>
                    <PageHeader.Title>Title</PageHeader.Title>
                    <PageHeader.TrailingVisual>Trailing visual</PageHeader.TrailingVisual>
                </PageHeader.TitleArea>
                <PageHeader.LeadingAction>Leading action</PageHeader.LeadingAction>
                <PageHeader.Breadcrumbs>Breadcrumbs</PageHeader.Breadcrumbs>
                <PageHeader.TrailingAction>Trailing action</PageHeader.TrailingAction>
                <PageHeader.Actions>Actions</PageHeader.Actions>
                <PageHeader.Description>Description</PageHeader.Description>
                <PageHeader.Navigation>Navigation</PageHeader.Navigation>
            </PageHeader>,
        );

        expect(header()).toHaveAttribute("data-component", "PageHeader");

        for (const name of [
            "ContextArea",
            "ParentLink",
            "ContextBar",
            "ContextAreaActions",
            "TitleArea",
            "LeadingAction",
            "Breadcrumbs",
            "LeadingVisual",
            "Title",
            "TrailingVisual",
            "TrailingAction",
            "Actions",
            "Description",
            "Navigation",
        ]) {
            expect(part(container, name)).toBeInstanceOf(HTMLElement);
        }
    });

    it("says nothing about a role or a label unless it is given one", () => {
        render(<PageHeader data-testid="header">{title}</PageHeader>);
        expect(header()).not.toHaveAttribute("role");
        expect(header()).not.toHaveAttribute("aria-label");
    });

    it("takes the role and the label it is given", () => {
        render(
            <PageHeader role="banner" aria-label="Custom label">
                {title}
            </PageHeader>,
        );
        expect(screen.getByRole("banner", { name: "Custom label" })).toBeInTheDocument();
    });

    it("leaves the border off by default", () => {
        render(<PageHeader data-testid="header">{title}</PageHeader>);
        expect(header()).not.toHaveAttribute("data-has-border");
        expect(header()).not.toHaveClass("page-header-border");
    });

    it("draws a border where it is asked to", () => {
        render(
            <PageHeader hasBorder data-testid="header">
                {title}
            </PageHeader>,
        );
        expect(header()).toHaveAttribute("data-has-border", "true");
        expect(header()).toHaveClass("page-header-border");
    });

    it("forwards a ref to the root", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <PageHeader ref={ref} data-testid="header">
                {title}
            </PageHeader>,
        );
        expect(ref.current).toBe(header());
    });

    it("merges a custom className onto the root", () => {
        render(
            <PageHeader className="custom" data-testid="header">
                {title}
            </PageHeader>,
        );
        expect(header()).toHaveClass("page-header");
        expect(header()).toHaveClass("custom");
    });
});

describe("PageHeader hoisted attributes", () => {
    it("writes the title size onto the root", () => {
        render(
            <PageHeader data-testid="header">
                <PageHeader.TitleArea variant="large">
                    <PageHeader.Title>Title</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>,
        );
        expect(header()).toHaveAttribute("data-title-size-variant", "large");
    });

    it("falls back to the medium title size", () => {
        render(<PageHeader data-testid="header">{title}</PageHeader>);
        expect(header()).toHaveAttribute("data-title-size-variant", "medium");
    });

    it("writes a title size per viewport range onto the root", () => {
        render(
            <PageHeader data-testid="header">
                <PageHeader.TitleArea variant={{ narrow: "medium", regular: "large" }}>
                    <PageHeader.Title>Title</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>,
        );
        expect(header()).toHaveAttribute("data-title-size-variant-narrow", "medium");
        expect(header()).toHaveAttribute("data-title-size-variant-regular", "large");
        expect(header()).not.toHaveAttribute("data-title-size-variant");
    });

    it("reads the title area through a fragment", () => {
        render(
            <PageHeader data-testid="header">
                <>
                    <PageHeader.TitleArea variant="large">
                        <PageHeader.Title>Title</PageHeader.Title>
                    </PageHeader.TitleArea>
                </>
            </PageHeader>,
        );
        expect(header()).toHaveAttribute("data-title-size-variant", "large");
    });

    it("says nothing about a title size where there is no title area", () => {
        render(
            <PageHeader data-testid="header">
                <PageHeader.Navigation as="nav" aria-label="Custom">
                    Navigation
                </PageHeader.Navigation>
            </PageHeader>,
        );
        expect(header()).not.toHaveAttribute("data-title-size-variant");
    });

    it("says on the root that it holds a navigation region", () => {
        render(
            <PageHeader data-testid="header">
                {title}
                <PageHeader.Navigation>Navigation</PageHeader.Navigation>
            </PageHeader>,
        );
        expect(header()).toHaveAttribute("data-has-nav", "");
        expect(header()).toHaveAttribute("data-nav-hidden", "false");
    });

    it("reads a navigation region through a fragment", () => {
        render(
            <PageHeader data-testid="header">
                <>
                    <PageHeader.Navigation>Navigation</PageHeader.Navigation>
                </>
            </PageHeader>,
        );
        expect(header()).toHaveAttribute("data-has-nav", "");
    });

    it("says nothing about a navigation region it does not hold", () => {
        render(<PageHeader data-testid="header">{title}</PageHeader>);
        expect(header()).not.toHaveAttribute("data-has-nav");
        expect(header()).not.toHaveAttribute("data-nav-hidden");
    });

    it("writes the navigation's visibility onto the root", () => {
        render(
            <PageHeader data-testid="header">
                {title}
                <PageHeader.Navigation hidden={{ narrow: true, regular: false, wide: false }}>
                    Navigation
                </PageHeader.Navigation>
            </PageHeader>,
        );
        expect(header()).toHaveAttribute("data-nav-hidden-narrow", "true");
        expect(header()).toHaveAttribute("data-nav-hidden-regular", "false");
    });
});

describe("PageHeader regions", () => {
    it("shows the context area only on a narrow viewport by default", () => {
        const { container } = render(
            <PageHeader>
                {title}
                <PageHeader.ContextArea>
                    <PageHeader.ParentLink href="#">Parent</PageHeader.ParentLink>
                    <PageHeader.ContextBar>Context bar</PageHeader.ContextBar>
                    <PageHeader.ContextAreaActions>Context actions</PageHeader.ContextAreaActions>
                </PageHeader.ContextArea>
            </PageHeader>,
        );

        for (const name of ["ContextArea", "ParentLink", "ContextBar", "ContextAreaActions"]) {
            expect(part(container, name)).toHaveAttribute("data-hidden-narrow", "false");
            expect(part(container, name)).toHaveAttribute("data-hidden-regular", "true");
            expect(part(container, name)).toHaveAttribute("data-hidden-wide", "true");
        }
    });

    it("shows the leading and trailing actions only from the regular range up by default", () => {
        const { container } = render(
            <PageHeader>
                {title}
                <PageHeader.LeadingAction>Leading action</PageHeader.LeadingAction>
                <PageHeader.TrailingAction>Trailing action</PageHeader.TrailingAction>
            </PageHeader>,
        );

        for (const name of ["LeadingAction", "TrailingAction"]) {
            expect(part(container, name)).toHaveAttribute("data-hidden-narrow", "true");
            expect(part(container, name)).toHaveAttribute("data-hidden-regular", "false");
            expect(part(container, name)).toHaveAttribute("data-hidden-wide", "false");
        }
    });

    it("shows everything else on every viewport by default", () => {
        const { container } = render(
            <PageHeader>
                <PageHeader.TitleArea>
                    <PageHeader.LeadingVisual>Leading visual</PageHeader.LeadingVisual>
                    <PageHeader.Title>Title</PageHeader.Title>
                    <PageHeader.TrailingVisual>Trailing visual</PageHeader.TrailingVisual>
                </PageHeader.TitleArea>
                <PageHeader.Breadcrumbs>Breadcrumbs</PageHeader.Breadcrumbs>
                <PageHeader.Actions>Actions</PageHeader.Actions>
                <PageHeader.Description>Description</PageHeader.Description>
                <PageHeader.Navigation>Navigation</PageHeader.Navigation>
            </PageHeader>,
        );

        for (const name of [
            "TitleArea",
            "LeadingVisual",
            "Title",
            "TrailingVisual",
            "Breadcrumbs",
            "Actions",
            "Description",
            "Navigation",
        ]) {
            expect(part(container, name)).toHaveAttribute("data-hidden", "false");
        }
    });

    it("can be taken away for good or one viewport range at a time", () => {
        const { container, rerender } = render(
            <PageHeader>
                <PageHeader.TitleArea>
                    <PageHeader.Title hidden>Title</PageHeader.Title>
                </PageHeader.TitleArea>
                <PageHeader.Description hidden>Description</PageHeader.Description>
            </PageHeader>,
        );
        expect(part(container, "Title")).toHaveAttribute("data-hidden", "true");
        expect(part(container, "Description")).toHaveAttribute("data-hidden", "true");

        rerender(
            <PageHeader>
                <PageHeader.TitleArea>
                    <PageHeader.Title hidden={{ narrow: true }}>Title</PageHeader.Title>
                </PageHeader.TitleArea>
                <PageHeader.Description hidden={{ regular: true, wide: false }}>
                    Description
                </PageHeader.Description>
            </PageHeader>,
        );
        expect(part(container, "Title")).toHaveAttribute("data-hidden-narrow", "true");
        expect(part(container, "Title")).not.toHaveAttribute("data-hidden");
        expect(part(container, "Description")).toHaveAttribute("data-hidden-regular", "true");
        expect(part(container, "Description")).toHaveAttribute("data-hidden-wide", "false");
    });

    it("never writes the native hidden attribute, which would take a region away outright", () => {
        const { container } = render(
            <PageHeader>
                <PageHeader.TitleArea hidden={{ narrow: true }}>
                    <PageHeader.Title hidden={{ narrow: true }}>Title</PageHeader.Title>
                </PageHeader.TitleArea>
                <PageHeader.ContextArea>
                    <PageHeader.ParentLink href="#">Parent</PageHeader.ParentLink>
                </PageHeader.ContextArea>
                <PageHeader.Navigation hidden={{ narrow: true }}>Navigation</PageHeader.Navigation>
            </PageHeader>,
        );

        for (const name of ["TitleArea", "Title", "ContextArea", "ParentLink", "Navigation"]) {
            expect(part(container, name)).not.toHaveAttribute("hidden");
            expect(part(container, name)).toHaveClass("page-header-hidden");
        }
    });

    it("forwards a ref to a region", () => {
        const ref = React.createRef<HTMLDivElement>();
        const { container } = render(
            <PageHeader>
                <PageHeader.TitleArea ref={ref}>
                    <PageHeader.Title>Title</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>,
        );
        expect(ref.current).toBe(part(container, "TitleArea"));
    });

    it("merges a custom className onto a region", () => {
        const { container } = render(
            <PageHeader>
                <PageHeader.TitleArea className="custom">
                    <PageHeader.Title>Title</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>,
        );
        expect(part(container, "TitleArea")).toHaveClass("page-header-title-area");
        expect(part(container, "TitleArea")).toHaveClass("custom");
    });
});

describe("PageHeader.TitleArea", () => {
    it("writes the size it is given onto itself", () => {
        const { container } = render(
            <PageHeader>
                <PageHeader.TitleArea variant="subtitle">
                    <PageHeader.Title>Title</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>,
        );
        expect(part(container, "TitleArea")).toHaveAttribute("data-size-variant", "subtitle");
    });

    it("writes a size per viewport range onto itself", () => {
        const { container } = render(
            <PageHeader>
                <PageHeader.TitleArea variant={{ narrow: "medium", regular: "large" }}>
                    <PageHeader.Title>Title</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>,
        );
        expect(part(container, "TitleArea")).toHaveAttribute("data-size-variant-narrow", "medium");
        expect(part(container, "TitleArea")).toHaveAttribute("data-size-variant-regular", "large");
    });
});

describe("PageHeader.Title", () => {
    it("renders an h2 by default", () => {
        render(<PageHeader>{title}</PageHeader>);
        expect(screen.getByRole("heading", { level: 2, name: "Title" })).toBeInTheDocument();
    });

    it("renders at the level passed to its as prop", () => {
        render(
            <PageHeader>
                <PageHeader.TitleArea>
                    <PageHeader.Title as="h1">Title</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>,
        );
        expect(screen.getByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
    });
});

describe("PageHeader.ParentLink", () => {
    it("renders a muted link to the href it is given", () => {
        render(
            <PageHeader>
                {title}
                <PageHeader.ContextArea>
                    <PageHeader.ParentLink href="/parent">Parent</PageHeader.ParentLink>
                </PageHeader.ContextArea>
            </PageHeader>,
        );

        const link = screen.getByRole("link", { name: "Parent" });
        expect(link).toHaveAttribute("href", "/parent");
        expect(link).toHaveAttribute("data-muted", "true");
        expect(link).toHaveClass("page-header-parent-link");
    });

    it("forwards rest props to the link", () => {
        render(
            <PageHeader>
                {title}
                <PageHeader.ContextArea>
                    <PageHeader.ParentLink href="/parent" data-testid="parent-link">
                        Parent
                    </PageHeader.ParentLink>
                </PageHeader.ContextArea>
            </PageHeader>,
        );
        expect(screen.getByTestId("parent-link")).toHaveAttribute("href", "/parent");
    });

    it("renders as the component passed to the as prop", () => {
        const CustomLink = React.forwardRef<
            HTMLAnchorElement,
            React.ComponentPropsWithoutRef<"a"> & { to: string }
        >(({ to, children, ...props }, ref) => (
            // The props are spread first, so the href the component builds is the one kept
            <a ref={ref} {...props} href={to}>
                {children}
            </a>
        ));
        CustomLink.displayName = "CustomLink";

        render(
            <PageHeader>
                {title}
                <PageHeader.ContextArea>
                    <PageHeader.ParentLink as={CustomLink} to="/somewhere">
                        Parent
                    </PageHeader.ParentLink>
                </PageHeader.ContextArea>
            </PageHeader>,
        );
        expect(screen.getByRole("link", { name: "Parent" })).toHaveAttribute("href", "/somewhere");
    });

    it("forwards a ref to the link", () => {
        const ref = React.createRef<HTMLAnchorElement>();
        render(
            <PageHeader>
                {title}
                <PageHeader.ContextArea>
                    <PageHeader.ParentLink ref={ref} href="/parent">
                        Parent
                    </PageHeader.ParentLink>
                </PageHeader.ContextArea>
            </PageHeader>,
        );
        expect(ref.current).toBe(screen.getByRole("link", { name: "Parent" }));
    });
});

describe("PageHeader.Navigation", () => {
    it("renders a div by default, which is no landmark", () => {
        const { container } = render(
            <PageHeader>
                {title}
                <PageHeader.Navigation>Navigation</PageHeader.Navigation>
            </PageHeader>,
        );
        expect(part(container, "Navigation").tagName).toBe("DIV");
        expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });

    it("renders as a nav landmark with the label it is given", () => {
        render(
            <PageHeader>
                {title}
                <PageHeader.Navigation as="nav" aria-label="Custom">
                    Navigation
                </PageHeader.Navigation>
            </PageHeader>,
        );
        expect(screen.getByRole("navigation", { name: "Custom" })).toBeInTheDocument();
    });

    it("can be named by another element on the page", () => {
        render(
            <PageHeader>
                <PageHeader.TitleArea>
                    <PageHeader.Title id="page-title">Title</PageHeader.Title>
                </PageHeader.TitleArea>
                <PageHeader.Navigation as="nav" aria-labelledby="page-title">
                    Navigation
                </PageHeader.Navigation>
            </PageHeader>,
        );
        expect(screen.getByRole("navigation", { name: "Title" })).toBeInTheDocument();
    });
});
