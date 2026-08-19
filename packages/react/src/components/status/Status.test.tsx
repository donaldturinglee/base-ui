import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { Status } from ".";
import type { StatusSize, StatusVariant } from "./Status.types";

const status = () => screen.getByTestId("status");

const indicator = () => status().querySelector(".status-indicator");

describe("Status", () => {
    it("renders a span element by default", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status().tagName).toBe("SPAN");
    });

    it("renders its children", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(screen.getByText("Operational")).toBeInTheDocument();
    });

    it("draws nothing of its own, so the row is only what was written", () => {
        render(<Status data-testid="status">Operational</Status>);
        expect(indicator()).toBeNull();
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <Status as="div" data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status().tagName).toBe("DIV");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Status as="a" href="https://example.com" data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status()).toHaveAttribute("href", "https://example.com");
    });

    it("tags the root element with a data-component attribute", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status()).toHaveAttribute("data-component", "Status");
    });

    it("falls back to the neutral variant when none is provided", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status()).toHaveAttribute("data-variant", "neutral");
        expect(status()).toHaveClass("status-neutral");
    });

    it("respects the variant prop", () => {
        const variants = {
            accent: "status-accent",
            success: "status-success",
            attention: "status-attention",
            severe: "status-severe",
            danger: "status-danger",
            done: "status-done",
            neutral: "status-neutral",
        } as const;

        for (const [variant, expected] of Object.entries(variants)) {
            const { unmount } = render(
                <Status variant={variant as StatusVariant} data-testid="status">
                    <Status.Indicator />
                    Operational
                </Status>,
            );
            expect(status()).toHaveAttribute("data-variant", variant);
            expect(status()).toHaveClass(expected);
            unmount();
        }
    });

    it("falls back to the medium size when none is provided", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status()).toHaveAttribute("data-size", "medium");
        expect(status()).toHaveClass("status-medium");
    });

    it("respects the size prop", () => {
        const sizes = {
            small: "status-small",
            medium: "status-medium",
            large: "status-large",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(
                <Status size={size as StatusSize} data-testid="status">
                    <Status.Indicator />
                    Operational
                </Status>,
            );
            expect(status()).toHaveAttribute("data-size", size);
            expect(status()).toHaveClass(expected);
            unmount();
        }
    });

    it("keeps the colour and the size apart, so neither displaces the other", () => {
        render(
            <Status variant="success" size="small" data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status()).toHaveClass("status", "status-success", "status-small");
    });

    it("reads the srText where the row carries the dot alone", () => {
        render(
            <Status variant="success" srText="Operational" data-testid="status">
                <Status.Indicator />
            </Status>,
        );
        expect(screen.getByText("Operational")).toHaveClass("sr-only");
    });

    it("leaves out the screen reader text when none is asked for", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status().querySelector(".sr-only")).toBeNull();
    });

    it("does not leak the variant, size and srText props onto the element", () => {
        render(
            <Status variant="success" size="small" srText="Operational" data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status()).not.toHaveAttribute("variant");
        expect(status()).not.toHaveAttribute("size");
        expect(status()).not.toHaveAttribute("srText");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(
            <Status ref={ref} data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(ref.current).toBe(status());
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Status className="custom" data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status()).toHaveClass("status", "custom");
    });

    it("passes extra props onto the root element", () => {
        render(
            <Status id="service-status" data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(status()).toHaveAttribute("id", "service-status");
    });
});

describe("Status.Indicator", () => {
    it("tags the dot with a data-component attribute", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(indicator()).toHaveAttribute("data-component", "Status.Indicator");
    });

    it("is read before the words where it was written before them", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator data-testid="dot" />
                Operational
            </Status>,
        );
        expect(status().firstElementChild).toBe(screen.getByTestId("dot"));
    });

    it("stays where it was written rather than being moved to the front", () => {
        render(
            <Status data-testid="status">
                Operational
                <Status.Indicator data-testid="dot" />
            </Status>,
        );
        expect(status().lastElementChild).toBe(screen.getByTestId("dot"));
    });

    it("takes the colour and the size of the status it sits in", () => {
        render(
            <Status variant="success" size="large" data-testid="status">
                <Status.Indicator data-testid="dot" />
                Operational
            </Status>,
        );
        const dot = screen.getByTestId("dot");
        expect(dot).toHaveClass("status-indicator-success", "status-indicator-large");
        expect(dot).toHaveAttribute("data-variant", "success");
        expect(dot).toHaveAttribute("data-size", "large");
    });

    it("says something of its own when asked to", () => {
        render(
            <Status variant="neutral" size="small" data-testid="status">
                <Status.Indicator variant="danger" size="large" data-testid="dot" />
                Not monitored
            </Status>,
        );
        const dot = screen.getByTestId("dot");
        expect(dot).toHaveClass("status-indicator-danger", "status-indicator-large");
        expect(status()).toHaveClass("status-neutral", "status-small");
    });

    it("keeps the dot from a screen reader, since the words beside it already say what it says", () => {
        render(
            <Status data-testid="status">
                <Status.Indicator />
                Operational
            </Status>,
        );
        expect(indicator()).toHaveAttribute("aria-hidden", "true");
    });

    it("falls back to a neutral medium dot where it is read outside a status", () => {
        render(<Status.Indicator data-testid="dot" />);
        expect(screen.getByTestId("dot")).toHaveClass(
            "status-indicator",
            "status-indicator-neutral",
            "status-indicator-medium",
        );
    });

    it("respects the variant prop where it is read outside a status", () => {
        const variants = {
            accent: "status-indicator-accent",
            success: "status-indicator-success",
            attention: "status-indicator-attention",
            severe: "status-indicator-severe",
            danger: "status-indicator-danger",
            done: "status-indicator-done",
            neutral: "status-indicator-neutral",
        } as const;

        for (const [variant, expected] of Object.entries(variants)) {
            const { unmount } = render(
                <Status.Indicator variant={variant as StatusVariant} data-testid="dot" />,
            );
            expect(screen.getByTestId("dot")).toHaveClass(expected);
            unmount();
        }
    });

    it("respects the size prop where it is read outside a status", () => {
        const sizes = {
            small: "status-indicator-small",
            medium: "status-indicator-medium",
            large: "status-indicator-large",
        } as const;

        for (const [size, expected] of Object.entries(sizes)) {
            const { unmount } = render(
                <Status.Indicator size={size as StatusSize} data-testid="dot" />,
            );
            expect(screen.getByTestId("dot")).toHaveClass(expected);
            unmount();
        }
    });

    it("stays out of the accessibility tree on its own", () => {
        render(<Status.Indicator data-testid="dot" />);
        expect(screen.getByTestId("dot")).toHaveAttribute("aria-hidden", "true");
    });

    it("does not leak the variant and size props onto the element", () => {
        render(<Status.Indicator variant="success" size="small" data-testid="dot" />);
        const dot = screen.getByTestId("dot");
        expect(dot).not.toHaveAttribute("variant");
        expect(dot).not.toHaveAttribute("size");
    });

    it("forwards a ref to the dot", () => {
        const ref = React.createRef<HTMLSpanElement>();
        render(<Status.Indicator ref={ref} data-testid="dot" />);
        expect(ref.current).toBe(screen.getByTestId("dot"));
    });

    it("merges a custom className onto the dot", () => {
        render(<Status.Indicator className="custom" data-testid="dot" />);
        expect(screen.getByTestId("dot")).toHaveClass("status-indicator", "custom");
    });
});
