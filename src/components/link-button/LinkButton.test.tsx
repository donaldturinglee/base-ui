import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import LinkButton from "./LinkButton";

const Icon = () => <svg data-testid="icon" />;

describe("LinkButton", () => {
    it("renders an anchor element by default", () => {
        render(<LinkButton href="/settings">Settings</LinkButton>);
        const link = screen.getByRole("link", { name: "Settings" });
        expect(link.tagName).toBe("A");
        expect(link).toHaveAttribute("href", "/settings");
    });

    it("renders as the element passed to the as prop", () => {
        render(<LinkButton as="button">Settings</LinkButton>);
        expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
    });

    it("tags the root element with a data-component attribute", () => {
        render(<LinkButton href="/settings">Settings</LinkButton>);
        expect(screen.getByRole("link")).toHaveAttribute("data-component", "LinkButton");
    });

    it("does not carry a button type", () => {
        render(<LinkButton href="/settings">Settings</LinkButton>);
        expect(screen.getByRole("link")).not.toHaveAttribute("type");
    });

    it("lays itself out inline once it has somewhere to go", () => {
        render(<LinkButton href="/settings">Settings</LinkButton>);
        expect(screen.getByRole("link")).toHaveClass("[&[href]]:inline-flex");
    });

    it("forwards the anchor attributes", () => {
        render(
            <LinkButton href="https://example.com" target="_blank" rel="noreferrer" download="x">
                Settings
            </LinkButton>,
        );
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noreferrer");
        expect(link).toHaveAttribute("download", "x");
    });

    it("falls back to the default variant and the medium size", () => {
        render(<LinkButton href="/settings">Settings</LinkButton>);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("data-variant", "default");
        expect(link).toHaveAttribute("data-size", "medium");
    });

    it("respects the variant and the size", () => {
        render(
            <LinkButton href="/settings" variant="primary" size="large">
                Settings
            </LinkButton>,
        );
        const link = screen.getByRole("link");
        expect(link).toHaveClass("bg-[var(--button-primary-background-color-rest)]");
        expect(link).toHaveClass("h-[var(--control-large-size)]");
    });

    it("reads as plain text for the link variant", () => {
        render(
            <LinkButton href="/settings" variant="link">
                Settings
            </LinkButton>,
        );
        const link = screen.getByRole("link");
        expect(link).toHaveClass("text-foreground-accent");
        expect(link).toHaveClass("p-0");
    });

    it("renders a leading visual", () => {
        render(
            <LinkButton href="/settings" leadingVisual={Icon}>
                Settings
            </LinkButton>,
        );
        expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
            "data-component",
            "leadingVisual",
        );
    });

    it("renders a count as a trailing counter", () => {
        render(
            <LinkButton href="/settings" count={3}>
                Settings
            </LinkButton>,
        );
        const counter = screen.getByRole("link").querySelector("[data-component='ButtonCounter']");
        expect(counter).toHaveTextContent("3");
    });

    it("fills its container when block is set", () => {
        render(
            <LinkButton href="/settings" block>
                Settings
            </LinkButton>,
        );
        expect(screen.getByRole("link")).toHaveClass("w-full");
    });

    it("announces the wait while loading", () => {
        render(
            <LinkButton href="/settings" loading>
                Settings
            </LinkButton>,
        );
        expect(screen.getByRole("link")).toHaveAttribute("aria-disabled", "true");
        expect(screen.getByRole("status")).toHaveTextContent("Loading");
    });

    it("styles an inactive link", () => {
        render(
            <LinkButton href="/settings" inactive>
                Settings
            </LinkButton>,
        );
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("data-inactive", "");
        expect(link).toHaveClass("[color:var(--button-inactive-foreground-color)]");
    });

    it("does not leak its own props onto the element", () => {
        render(
            <LinkButton href="/settings" variant="primary" size="large" block>
                Settings
            </LinkButton>,
        );
        const link = screen.getByRole("link");
        expect(link).not.toHaveAttribute("variant");
        expect(link).not.toHaveAttribute("size");
        expect(link).not.toHaveAttribute("block");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLAnchorElement>();
        render(
            <LinkButton href="/settings" ref={ref}>
                Settings
            </LinkButton>,
        );
        expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it("merges a custom className onto the root element", () => {
        render(
            <LinkButton href="/settings" className="custom">
                Settings
            </LinkButton>,
        );
        expect(screen.getByRole("link")).toHaveClass("custom");
    });
});
