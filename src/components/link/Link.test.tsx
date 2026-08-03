import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import Link from "./Link";

describe("Link", () => {
    it("renders an anchor element by default", () => {
        render(<Link data-testid="link" />);
        expect(screen.getByTestId("link").tagName).toBe("A");
    });

    it("renders as the element passed to the as prop", () => {
        render(<Link as="button" data-testid="link" />);
        expect(screen.getByTestId("link").tagName).toBe("BUTTON");
    });

    it("passes the href down to the anchor element", () => {
        render(<Link href="https://github.com" data-testid="link" />);
        expect(screen.getByTestId("link")).toHaveAttribute("href", "https://github.com");
    });

    it("renders its children", () => {
        render(<Link href="#">Links are great</Link>);
        expect(screen.getByText("Links are great")).toBeInTheDocument();
    });

    it("uses the accent foreground colour and underlines on hover", () => {
        render(<Link data-testid="link" />);
        const link = screen.getByTestId("link");
        expect(link).toHaveClass("text-foreground-accent");
        expect(link).toHaveClass("no-underline");
        expect(link).toHaveClass("hover:underline");
    });

    it("resets the button styles when rendering a button element", () => {
        render(<Link as="button" data-testid="link" />);
        expect(screen.getByTestId("link")).toHaveClass("[&:is(button)]:appearance-none");
    });

    it("applies the muted colour when muted", () => {
        render(<Link muted data-testid="link" />);
        const link = screen.getByTestId("link");
        expect(link).toHaveAttribute("data-muted", "true");
        expect(link).toHaveClass("text-foreground-muted");
        expect(link).toHaveClass("hover:text-foreground-accent");
    });

    it("drops the default hover underline when muted", () => {
        render(<Link muted data-testid="link" />);
        const link = screen.getByTestId("link");
        expect(link).toHaveClass("hover:no-underline");
        expect(link).not.toHaveClass("hover:underline");
    });

    it("does not leak the muted prop onto the element", () => {
        render(<Link muted data-testid="link" />);
        expect(screen.getByTestId("link")).not.toHaveAttribute("muted");
    });

    it("underlines inline links only under the accessibility setting", () => {
        render(<Link inline data-testid="link" />);
        const link = screen.getByTestId("link");
        expect(link).toHaveAttribute("data-inline", "true");
        expect(link).toHaveClass("[[data-a11y-link-underlines='true']_&]:underline");
        expect(link).toHaveClass("[[data-a11y-link-underlines='true']_&]:hover:no-underline");
    });

    it("does not leak the inline prop onto the element", () => {
        render(<Link inline data-testid="link" />);
        expect(screen.getByTestId("link")).not.toHaveAttribute("inline");
    });

    it("leaves the state attributes unset by default", () => {
        render(<Link data-testid="link" />);
        const link = screen.getByTestId("link");
        expect(link).not.toHaveAttribute("data-muted");
        expect(link).not.toHaveAttribute("data-inline");
    });

    it("forwards element specific props to the element passed to the as prop", () => {
        render(<Link as="button" type="submit" data-testid="link" />);
        expect(screen.getByTestId("link")).toHaveAttribute("type", "submit");
    });

    it("tags the root element with a data-component attribute", () => {
        render(<Link data-testid="link" />);
        expect(screen.getByTestId("link")).toHaveAttribute("data-component", "Link");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLAnchorElement>();
        render(<Link ref={ref} data-testid="link" />);
        expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it("merges a custom className onto the root element", () => {
        render(<Link className="custom" data-testid="link" />);
        expect(screen.getByTestId("link")).toHaveClass("custom");
    });
});
