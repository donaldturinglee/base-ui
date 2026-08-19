import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { LayerCard } from ".";

const root = () => document.querySelector("[data-component='LayerCard']") as HTMLElement;

const part = (name: string) =>
    document.querySelector(`[data-component='LayerCard.${name}']`) as HTMLElement;

describe("LayerCard", () => {
    it("renders a div element by default", () => {
        render(<LayerCard>Get started</LayerCard>);
        expect(root().tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(<LayerCard as="section">Get started</LayerCard>);
        expect(root().tagName).toBe("SECTION");
    });

    it("renders its children", () => {
        render(<LayerCard>Get started</LayerCard>);
        expect(screen.getByText("Get started")).toBeInTheDocument();
    });

    it("passes the rest of its props down", () => {
        render(
            <LayerCard className="promo" aria-label="Promotion">
                Get started
            </LayerCard>,
        );

        expect(root()).toHaveClass("promo");
        expect(root()).toHaveAttribute("aria-label", "Promotion");
    });

    it("forwards a ref to the element it rendered", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<LayerCard ref={ref}>Get started</LayerCard>);

        expect(ref.current).toBe(root());
    });

    describe("given content", () => {
        it("is drawn as one surface", () => {
            render(<LayerCard>Get started</LayerCard>);

            expect(root()).toHaveClass("layer-card");
            expect(root()).not.toHaveClass("layer-card-layered");
            expect(root()).not.toHaveAttribute("data-layered");
        });
    });

    describe("given layers", () => {
        const layered = (
            <LayerCard>
                <LayerCard.Secondary>Next steps</LayerCard.Secondary>
                <LayerCard.Primary>Get started</LayerCard.Primary>
            </LayerCard>
        );

        it("becomes the layer the others stack on", () => {
            render(layered);

            expect(root()).toHaveClass("layer-card-layered");
            expect(root()).not.toHaveClass("layer-card");
            expect(root()).toHaveAttribute("data-layered", "");
        });

        it("renders both layers", () => {
            render(layered);

            expect(part("Secondary")).toHaveTextContent("Next steps");
            expect(part("Primary")).toHaveTextContent("Get started");
        });

        it("stacks them in the order they were written", () => {
            render(layered);

            expect(part("Secondary").nextElementSibling).toBe(part("Primary"));
        });

        it("takes a layer of either kind as enough to stack", () => {
            const { rerender } = render(
                <LayerCard>
                    <LayerCard.Primary>Get started</LayerCard.Primary>
                </LayerCard>,
            );
            expect(root()).toHaveClass("layer-card-layered");

            rerender(
                <LayerCard>
                    <LayerCard.Secondary>Next steps</LayerCard.Secondary>
                </LayerCard>,
            );
            expect(root()).toHaveClass("layer-card-layered");
        });

        // Sections built from a list arrive wrapped in a fragment, which is not itself a layer
        it("looks through a fragment for the layers inside it", () => {
            render(
                <LayerCard>
                    <>
                        <LayerCard.Secondary>Next steps</LayerCard.Secondary>
                        <LayerCard.Primary>Get started</LayerCard.Primary>
                    </>
                </LayerCard>,
            );

            expect(root()).toHaveClass("layer-card-layered");
        });

        it("is still one surface where the children only look like layers", () => {
            render(
                <LayerCard>
                    <div>Next steps</div>
                    <div>Get started</div>
                </LayerCard>,
            );

            expect(root()).toHaveClass("layer-card");
        });
    });

    describe("the layers", () => {
        it("render div elements by default", () => {
            render(
                <LayerCard>
                    <LayerCard.Secondary>Next steps</LayerCard.Secondary>
                    <LayerCard.Primary>Get started</LayerCard.Primary>
                </LayerCard>,
            );

            expect(part("Secondary").tagName).toBe("DIV");
            expect(part("Primary").tagName).toBe("DIV");
        });

        // The primary layer is often the thing the card is a link to
        it("render as the element passed to the as prop", () => {
            render(
                <LayerCard>
                    <LayerCard.Primary as="a" href="/start">
                        Get started
                    </LayerCard.Primary>
                </LayerCard>,
            );

            const link = screen.getByRole("link", { name: "Get started" });

            expect(link).toBe(part("Primary"));
            expect(link).toHaveAttribute("href", "/start");
        });

        it("pass the rest of their props down", () => {
            render(
                <LayerCard>
                    <LayerCard.Secondary className="quiet" aria-label="secondary section">
                        Next steps
                    </LayerCard.Secondary>
                    <LayerCard.Primary className="loud" aria-label="primary section">
                        Get started
                    </LayerCard.Primary>
                </LayerCard>,
            );

            expect(part("Secondary")).toHaveClass("layer-card-secondary", "quiet");
            expect(part("Secondary")).toHaveAttribute("aria-label", "secondary section");
            expect(part("Primary")).toHaveClass("layer-card-primary", "loud");
            expect(part("Primary")).toHaveAttribute("aria-label", "primary section");
        });

        it("forward refs to the elements they rendered", () => {
            const secondary = React.createRef<HTMLDivElement>();
            const primary = React.createRef<HTMLDivElement>();

            render(
                <LayerCard>
                    <LayerCard.Secondary ref={secondary}>Next steps</LayerCard.Secondary>
                    <LayerCard.Primary ref={primary}>Get started</LayerCard.Primary>
                </LayerCard>,
            );

            expect(secondary.current).toBe(part("Secondary"));
            expect(primary.current).toBe(part("Primary"));
        });

        it("can be rendered on their own, outside a card", () => {
            render(<LayerCard.Primary>Get started</LayerCard.Primary>);
            expect(part("Primary")).toHaveClass("layer-card-primary");
        });
    });
});
