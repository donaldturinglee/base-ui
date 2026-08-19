import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { DirectionProvider, useDirection, useIsRtl } from ".";
import type { DirectionProviderProps, TextDirection } from "./Direction.types";

const root = () => document.querySelector('[data-component="DirectionProvider"]');

const Direction = () => {
    const direction = useDirection();
    return <span data-testid="direction">{direction}</span>;
};

describe("DirectionProvider", () => {
    it("is read left to right by default", () => {
        render(
            <DirectionProvider>
                <Direction />
            </DirectionProvider>,
        );

        expect(root()).toHaveAttribute("dir", "ltr");
        expect(screen.getByTestId("direction")).toHaveTextContent("ltr");
    });

    it("turns the subtree around when asked", () => {
        render(
            <DirectionProvider direction="rtl">
                <Direction />
            </DirectionProvider>,
        );

        expect(root()).toHaveAttribute("dir", "rtl");
        expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
    });

    it("renders a wrapper the reading direction can hang off", () => {
        render(
            <DirectionProvider className="page">
                <span>Hello</span>
            </DirectionProvider>,
        );

        expect(root()?.tagName).toBe("DIV");
        expect(root()).toHaveClass("page");
    });

    describe("following the props", () => {
        const app = (props: DirectionProviderProps) => (
            <DirectionProvider {...props}>
                <Direction />
            </DirectionProvider>
        );

        it("moves with the direction", () => {
            const { rerender } = render(app({ direction: "ltr" }));
            expect(root()).toHaveAttribute("dir", "ltr");

            rerender(app({ direction: "rtl" }));
            expect(root()).toHaveAttribute("dir", "rtl");
            expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
        });

        it("follows a direction the caller is holding", () => {
            const Toggle = () => {
                const [direction, setDirection] = React.useState<TextDirection>("ltr");

                return (
                    <DirectionProvider direction={direction}>
                        <button onClick={() => setDirection("rtl")}>Turn</button>
                    </DirectionProvider>
                );
            };

            render(<Toggle />);

            fireEvent.click(screen.getByRole("button"));
            expect(root()).toHaveAttribute("dir", "rtl");
        });
    });

    describe("nested", () => {
        const nested = () => document.querySelectorAll('[data-component="DirectionProvider"]')[1];

        it("inherits the direction from the provider above", () => {
            render(
                <DirectionProvider direction="rtl">
                    <DirectionProvider>
                        <Direction />
                    </DirectionProvider>
                </DirectionProvider>,
            );

            expect(nested()).toHaveAttribute("dir", "rtl");
            expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
        });

        it("changes only what it was asked to change", () => {
            render(
                <DirectionProvider direction="rtl">
                    <DirectionProvider direction="ltr">
                        <Direction />
                    </DirectionProvider>
                </DirectionProvider>,
            );

            expect(nested()).toHaveAttribute("dir", "ltr");
            expect(screen.getByTestId("direction")).toHaveTextContent("ltr");
        });

        it("takes the opposite of the direction above", () => {
            const Inverse = () => {
                const direction = useDirection();
                return (
                    <DirectionProvider direction={direction === "ltr" ? "rtl" : "ltr"}>
                        <Direction />
                    </DirectionProvider>
                );
            };

            render(
                <DirectionProvider direction="rtl">
                    <Inverse />
                </DirectionProvider>,
            );

            expect(nested()).toHaveAttribute("dir", "ltr");
        });
    });

    describe("contextOnly", () => {
        it("leaves the wrapper out", () => {
            render(
                <DirectionProvider contextOnly>
                    <span>Hello</span>
                </DirectionProvider>,
            );

            expect(root()).toBeNull();
            expect(screen.getByText("Hello")).toBeInTheDocument();
        });

        it("still hands the direction to whatever asks for it", () => {
            render(
                <DirectionProvider contextOnly direction="rtl">
                    <Direction />
                </DirectionProvider>,
            );

            expect(screen.getByTestId("direction")).toHaveTextContent("rtl");
        });
    });

    describe("useDirection", () => {
        it("answers left to right outside a provider", () => {
            render(<Direction />);
            expect(screen.getByTestId("direction")).toHaveTextContent("ltr");
        });
    });

    describe("useIsRtl", () => {
        const Marker = () => {
            const isRtl = useIsRtl();
            return (
                <span data-testid="marker">{isRtl ? "onwards is left" : "onwards is right"}</span>
            );
        };

        it("says which way the page is read", () => {
            const { rerender } = render(
                <DirectionProvider direction="ltr">
                    <Marker />
                </DirectionProvider>,
            );
            expect(screen.getByTestId("marker")).toHaveTextContent("onwards is right");

            rerender(
                <DirectionProvider direction="rtl">
                    <Marker />
                </DirectionProvider>,
            );
            expect(screen.getByTestId("marker")).toHaveTextContent("onwards is left");
        });

        it("answers outside a provider", () => {
            render(<Marker />);
            expect(screen.getByTestId("marker")).toHaveTextContent("onwards is right");
        });
    });
});
