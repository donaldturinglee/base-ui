import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { PageFooter } from ".";

const part = (name: string) =>
    document.querySelector(`[data-component="PageFooter.${name}"]`) as HTMLElement | null;

const footer = () => document.querySelector('[data-component="PageFooter"]') as HTMLElement;

const withCopyright = (props: React.ComponentProps<typeof PageFooter> = {}) => (
    <PageFooter {...props}>
        <PageFooter.Copyright>© 2026 GameCrafters, Inc.</PageFooter.Copyright>
    </PageFooter>
);

describe("PageFooter", () => {
    it("renders a footer by default", () => {
        render(withCopyright());
        expect(footer().tagName).toBe("FOOTER");
    });

    it("renders as whatever it is told to", () => {
        render(withCopyright({ as: "div" }));
        expect(footer().tagName).toBe("DIV");
    });

    it("tags the footer and its parts with data-component attributes", () => {
        render(
            <PageFooter>
                <PageFooter.Navigation>Navigation</PageFooter.Navigation>
                <PageFooter.LeadingVisual>Leading visual</PageFooter.LeadingVisual>
                <PageFooter.Copyright>Copyright</PageFooter.Copyright>
                <PageFooter.Actions>Actions</PageFooter.Actions>
                <PageFooter.Description>Description</PageFooter.Description>
            </PageFooter>,
        );

        for (const name of ["Navigation", "LeadingVisual", "Copyright", "Actions", "Description"]) {
            expect(part(name)).not.toBeNull();
        }
    });

    describe("naming the footer", () => {
        it("renders no name of its own", () => {
            render(withCopyright());
            expect(footer()).not.toHaveAttribute("aria-label");
        });

        it("renders the name it is given", () => {
            render(withCopyright({ "aria-label": "Site" }));
            expect(footer()).toHaveAttribute("aria-label", "Site");
        });

        it("renders the role it is given", () => {
            render(withCopyright({ as: "div", role: "contentinfo" }));
            expect(screen.getByRole("contentinfo")).toBe(footer());
        });
    });

    describe("the footer size", () => {
        it("falls back to the normal size", () => {
            render(withCopyright());

            expect(footer()).toHaveAttribute("data-size-variant", "normal");
            expect(footer()).toHaveClass("[--page-footer-text-size:var(--text-body-size-medium)]");
        });

        it("is set in the size it is given", () => {
            render(withCopyright({ variant: "condensed" }));

            expect(footer()).toHaveAttribute("data-size-variant", "condensed");
            expect(footer()).toHaveClass("[--page-footer-text-size:var(--text-body-size-small)]");
        });

        it("takes a different size at each viewport range", () => {
            render(withCopyright({ variant: { narrow: "condensed", regular: "normal" } }));

            expect(footer()).toHaveAttribute("data-size-variant-narrow", "condensed");
            expect(footer()).toHaveAttribute("data-size-variant-regular", "normal");
            expect(footer()).toHaveClass(
                "max-medium:[--page-footer-text-size:var(--text-body-size-small)]",
            );
            expect(footer()).toHaveClass(
                "medium:max-xxlarge:[--page-footer-text-size:var(--text-body-size-medium)]",
            );
        });
    });

    describe("the line above the footer", () => {
        it("draws no line unless it is asked for", () => {
            render(withCopyright());
            expect(footer()).not.toHaveClass("border-t-border-default");
        });

        it("draws a line where there is no navigation", () => {
            render(withCopyright({ hasBorder: true }));

            expect(footer()).toHaveAttribute("data-has-border", "");
            expect(footer()).toHaveClass("border-t-border-default");
        });

        it("leaves the line off where a navigation is showing", () => {
            render(
                <PageFooter hasBorder>
                    <PageFooter.Navigation>Navigation</PageFooter.Navigation>
                    <PageFooter.Copyright>Copyright</PageFooter.Copyright>
                </PageFooter>,
            );

            expect(footer()).toHaveAttribute("data-has-navigation", "");
            expect(footer()).not.toHaveClass("border-t-border-default");
        });

        it("draws the line only where the navigation is hidden", () => {
            render(
                <PageFooter hasBorder>
                    <PageFooter.Navigation hidden={{ narrow: true }}>
                        Navigation
                    </PageFooter.Navigation>
                    <PageFooter.Copyright>Copyright</PageFooter.Copyright>
                </PageFooter>,
            );

            expect(footer()).toHaveClass("max-medium:border-t-border-default");
            expect(footer()).not.toHaveClass("border-t-border-default");
        });

        it("reads a navigation through a fragment", () => {
            render(
                <PageFooter>
                    <>
                        <PageFooter.Navigation>Navigation</PageFooter.Navigation>
                    </>
                </PageFooter>,
            );
            expect(footer()).toHaveAttribute("data-has-navigation", "");
        });
    });

    describe("hiding a part", () => {
        it("takes a part off the screen everywhere", () => {
            render(
                <PageFooter>
                    <PageFooter.Description hidden>Description</PageFooter.Description>
                </PageFooter>,
            );

            expect(part("Description")).toHaveClass("hidden");
            expect(part("Description")).toHaveAttribute("data-hidden", "narrow regular wide");
        });

        it("takes a part off the screen at the ranges it names", () => {
            render(
                <PageFooter>
                    <PageFooter.Description hidden={{ regular: true }}>
                        Description
                    </PageFooter.Description>
                </PageFooter>,
            );

            expect(part("Description")).toHaveClass("medium:max-xxlarge:hidden");
            expect(part("Description")).toHaveAttribute("data-hidden", "regular");
        });

        it("leaves a part showing by default", () => {
            render(
                <PageFooter>
                    <PageFooter.Description>Description</PageFooter.Description>
                </PageFooter>,
            );

            expect(part("Description")).not.toHaveClass("hidden");
            expect(part("Description")).not.toHaveAttribute("data-hidden");
        });
    });

    describe("the navigation", () => {
        it("names itself when it is a landmark of its own", () => {
            render(
                <PageFooter>
                    <PageFooter.Navigation as="nav" aria-label="Site">
                        Navigation
                    </PageFooter.Navigation>
                </PageFooter>,
            );
            expect(screen.getByRole("navigation", { name: "Site" })).toBeInTheDocument();
        });

        it("leaves the name off a plain box, which names nothing", () => {
            render(
                <PageFooter>
                    <PageFooter.Navigation aria-label="Site">Navigation</PageFooter.Navigation>
                </PageFooter>,
            );

            expect(part("Navigation")?.tagName).toBe("DIV");
            expect(part("Navigation")).not.toHaveAttribute("aria-label");
        });
    });

    describe("the copyright", () => {
        it("is drawn as whatever it is told to be", () => {
            render(
                <PageFooter>
                    <PageFooter.Copyright as="p">© 2026 GameCrafters, Inc.</PageFooter.Copyright>
                </PageFooter>,
            );
            expect(part("Copyright")?.tagName).toBe("P");
        });

        it("passes the rest of its props through", () => {
            render(
                <PageFooter>
                    <PageFooter.Copyright data-testid="copyright">
                        © 2026 GameCrafters, Inc.
                    </PageFooter.Copyright>
                </PageFooter>,
            );
            expect(screen.getByTestId("copyright")).toBe(part("Copyright"));
        });
    });

    describe("refs and class names", () => {
        it("forwards a ref to the footer element", () => {
            const ref = React.createRef<HTMLElement>();
            render(
                <PageFooter ref={ref}>
                    <PageFooter.Copyright>Copyright</PageFooter.Copyright>
                </PageFooter>,
            );
            expect(ref.current).toBe(footer());
        });

        it("forwards a ref to a part", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(
                <PageFooter>
                    <PageFooter.Copyright ref={ref}>Copyright</PageFooter.Copyright>
                </PageFooter>,
            );
            expect(ref.current).toBe(part("Copyright"));
        });

        it("merges a custom className onto the footer element", () => {
            render(withCopyright({ className: "custom" }));
            expect(footer()).toHaveClass("custom");
        });

        it("merges a custom className onto a part", () => {
            render(
                <PageFooter>
                    <PageFooter.Description className="custom">Description</PageFooter.Description>
                </PageFooter>,
            );
            expect(part("Description")).toHaveClass("custom");
        });
    });
});
