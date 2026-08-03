import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import Alert from "./Alert";
import type { AlertVariant } from "./Alert.types";

describe("Alert", () => {
    it("renders a div element by default", () => {
        render(<Alert data-testid="alert">Message</Alert>);
        expect(screen.getByTestId("alert").tagName).toBe("DIV");
    });

    it("renders as the element passed to the as prop", () => {
        render(
            <Alert as="section" data-testid="alert">
                Message
            </Alert>,
        );
        expect(screen.getByTestId("alert").tagName).toBe("SECTION");
    });

    it("renders its children", () => {
        render(<Alert>Message</Alert>);
        expect(screen.getByText("Message")).toBeInTheDocument();
    });

    it("falls back to the default variant", () => {
        render(<Alert data-testid="alert">Message</Alert>);
        const alert = screen.getByTestId("alert");
        expect(alert).toHaveAttribute("data-variant", "default");
        expect(alert).toHaveClass("bg-background-accent-muted");
    });

    it("respects the variant prop", () => {
        const variants: Record<AlertVariant, string> = {
            default: "accent",
            success: "success",
            warning: "attention",
            danger: "danger",
        };

        for (const [variant, token] of Object.entries(variants)) {
            const { unmount } = render(
                <Alert variant={variant as AlertVariant} data-testid="alert">
                    Message
                </Alert>,
            );
            const alert = screen.getByTestId("alert");
            expect(alert).toHaveAttribute("data-variant", variant);
            expect(alert).toHaveClass(`bg-background-${token}-muted`);
            expect(alert).toHaveClass(`border-border-${token}-muted`);
            unmount();
        }
    });

    it("tints descendant icons to match the variant", () => {
        render(
            <Alert variant="danger" data-testid="alert">
                Message
            </Alert>,
        );
        expect(screen.getByTestId("alert")).toHaveClass("[&_svg]:text-foreground-danger");
    });

    it("spaces descendant icons from the message", () => {
        render(<Alert data-testid="alert">Message</Alert>);
        expect(screen.getByTestId("alert")).toHaveClass("[&_svg]:mr-[var(--base-size-8)]");
    });

    it("rounds the corners and borders every side", () => {
        render(<Alert data-testid="alert">Message</Alert>);
        const alert = screen.getByTestId("alert");
        expect(alert).toHaveClass("border-[length:var(--border-width-thin)]");
        expect(alert).toHaveClass("rounded-[var(--border-radius-medium)]");
    });

    it("does not leak the variant prop onto the element", () => {
        render(
            <Alert variant="success" data-testid="alert">
                Message
            </Alert>,
        );
        expect(screen.getByTestId("alert")).not.toHaveAttribute("variant");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(
            <Alert id="banner" data-testid="alert">
                Message
            </Alert>,
        );
        expect(screen.getByTestId("alert")).toHaveAttribute("id", "banner");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Alert data-testid="alert">Message</Alert>);
        expect(screen.getByTestId("alert")).toHaveAttribute("data-component", "Alert");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Alert ref={ref}>Message</Alert>);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <Alert className="custom" data-testid="alert">
                Message
            </Alert>,
        );
        expect(screen.getByTestId("alert")).toHaveClass("custom");
    });
});
