import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { PageContainer } from ".";

const container = () => document.querySelector('[data-component="PageContainer"]') as HTMLElement;

const region = () =>
    document.querySelector('[data-component="PageContainer.Region"]') as HTMLElement | null;

const withRegion = (props: React.ComponentProps<typeof PageContainer> = {}) => (
    <PageContainer {...props}>
        <PageContainer.Region>Region</PageContainer.Region>
    </PageContainer>
);

describe("PageContainer", () => {
    it("renders a div by default", () => {
        render(withRegion());
        expect(container().tagName).toBe("DIV");
    });

    it("renders as whatever it is told to", () => {
        render(withRegion({ as: "article" }));
        expect(container().tagName).toBe("ARTICLE");
    });

    it("tags the container and its regions with data-component attributes", () => {
        render(withRegion());

        expect(container()).not.toBeNull();
        expect(region()).not.toBeNull();
    });

    describe("the width", () => {
        it("is held to the widest step by default", () => {
            render(withRegion());

            expect(container()).toHaveAttribute("data-width", "xlarge");
            expect(container()).toHaveClass("page-container-width-xlarge");
        });

        it("is held to the width it is given", () => {
            render(withRegion({ width: "medium" }));

            expect(container()).toHaveAttribute("data-width", "medium");
            expect(container()).toHaveClass("page-container-width-medium");
        });

        it("is centred in whatever room the viewport leaves", () => {
            render(withRegion({ width: "large" }));
            expect(container()).toHaveClass("page-container");
        });
    });

    describe("the padding", () => {
        it("falls back to the normal room around the page", () => {
            render(withRegion());

            expect(container()).toHaveAttribute("data-padding", "normal");
            expect(container()).toHaveClass("page-container-padding-normal");
        });

        it("leaves the room it is asked for", () => {
            render(withRegion({ padding: "spacious" }));

            expect(container()).toHaveAttribute("data-padding", "spacious");
            expect(container()).toHaveClass("page-container-padding-spacious");
        });
    });

    describe("the gap", () => {
        it("falls back to the normal room between regions", () => {
            render(withRegion());

            expect(container()).toHaveAttribute("data-gap", "normal");
            expect(container()).toHaveClass("page-container-gap-normal");
        });

        it("leaves the room it is asked for", () => {
            render(withRegion({ gap: "condensed" }));

            expect(container()).toHaveAttribute("data-gap", "condensed");
            expect(container()).toHaveClass("page-container-gap-condensed");
        });
    });

    describe("the height", () => {
        it("takes only the height the page asks for by default", () => {
            render(withRegion());

            expect(container()).not.toHaveClass("page-container-full-height");
            expect(container()).not.toHaveAttribute("data-full-height");
        });

        it("stands the height of the viewport once it is asked to", () => {
            render(withRegion({ fullHeight: true }));

            expect(container()).toHaveClass("page-container-full-height");
            expect(container()).toHaveAttribute("data-full-height", "");
        });
    });

    describe("a region of the page", () => {
        it("renders a div by default", () => {
            render(withRegion());
            expect(region()?.tagName).toBe("DIV");
        });

        it("renders as whatever it is told to", () => {
            render(
                <PageContainer>
                    <PageContainer.Region as="section">Region</PageContainer.Region>
                </PageContainer>,
            );
            expect(region()?.tagName).toBe("SECTION");
        });

        it("takes only the height it needs by default", () => {
            render(withRegion());

            expect(region()).not.toHaveClass("page-container-region-grow");
            expect(region()).not.toHaveAttribute("data-grow");
        });

        it("takes the height the page has left over once it is asked to", () => {
            render(
                <PageContainer>
                    <PageContainer.Region grow>Region</PageContainer.Region>
                </PageContainer>,
            );

            expect(region()).toHaveClass("page-container-region-grow");
            expect(region()).toHaveAttribute("data-grow", "");
        });

        it("passes the rest of its props through", () => {
            render(
                <PageContainer>
                    <PageContainer.Region data-testid="run">Region</PageContainer.Region>
                </PageContainer>,
            );
            expect(screen.getByTestId("run")).toBe(region());
        });
    });

    describe("hiding a region", () => {
        it("takes a region off the screen everywhere", () => {
            render(
                <PageContainer>
                    <PageContainer.Region hidden>Region</PageContainer.Region>
                </PageContainer>,
            );

            expect(region()).toHaveClass("hidden");
            expect(region()).toHaveAttribute("data-hidden", "narrow regular wide");
        });

        it("takes a region off the screen at the ranges it names", () => {
            render(
                <PageContainer>
                    <PageContainer.Region hidden={{ regular: true }}>Region</PageContainer.Region>
                </PageContainer>,
            );

            expect(region()).toHaveClass("hidden-regular");
            expect(region()).toHaveAttribute("data-hidden", "regular");
        });

        it("leaves a region showing by default", () => {
            render(withRegion());

            expect(region()).not.toHaveClass("hidden");
            expect(region()).not.toHaveAttribute("data-hidden");
        });
    });

    describe("refs and class names", () => {
        it("forwards a ref to the container element", () => {
            const ref = React.createRef<HTMLElement>();
            render(
                <PageContainer ref={ref}>
                    <PageContainer.Region>Region</PageContainer.Region>
                </PageContainer>,
            );
            expect(ref.current).toBe(container());
        });

        it("forwards a ref to a region", () => {
            const ref = React.createRef<HTMLElement>();
            render(
                <PageContainer>
                    <PageContainer.Region ref={ref}>Region</PageContainer.Region>
                </PageContainer>,
            );
            expect(ref.current).toBe(region());
        });

        it("merges a custom className onto the container element", () => {
            render(withRegion({ className: "custom" }));
            expect(container()).toHaveClass("custom");
        });

        it("merges a custom className onto a region", () => {
            render(
                <PageContainer>
                    <PageContainer.Region className="custom">Region</PageContainer.Region>
                </PageContainer>,
            );
            expect(region()).toHaveClass("custom");
        });
    });
});
